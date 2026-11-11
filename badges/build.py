"""Generates data.js (attendees + QR codes + sponsors) consumed by badges.html."""

import base64
import csv
import json
import re
import sys
import unicodedata
from pathlib import Path

HERE = Path(__file__).parent
WEBSITE_ASSETS = HERE.parent / "src" / "assets"
sys.path.insert(0, str(HERE / "pylib"))

import fitz  # noqa: E402
import segno  # noqa: E402
from PIL import Image  # noqa: E402

from config import (  # noqa: E402
    EMAIL_CORRECTIONS,
    EVENTBRITE_EXPORT,
    LAST_MINUTE_BLANKS,
    ORGANIZER_COMPANIES,
    SPEAKER_COMPANIES,
    SPONSORS,
    YEAR,
)

SAMPLE_ATTENDEES = [
    {
        "firstName": "Camille",
        "lastName": "Tremblay",
        "company": "Studio Boréal",
        "role": "participant",
        "vcard": {
            "title": "Développeuse full-stack",
            "email": "camille@studioboreal.example",
            "linkedin": "https://www.linkedin.com/in/camille-tremblay",
        },
    },
    {
        "firstName": "Jean-Christophe",
        "lastName": "Beauregard-Lévesque",
        "company": "Coopérative Les Petits Octets",
        "role": "speaker",
        "vcard": {
            "title": "Architecte logiciel principal",
            "email": "jean-christophe.beauregard-levesque@petitsoctets.example",
            "linkedin": "https://www.linkedin.com/in/jean-christophe-beauregard-levesque",
        },
    },
    {
        "firstName": "Maïka",
        "lastName": "Nguyen",
        "company": "",
        "role": "equipe",
        "vcard": None,
    },
    # Lot vierge pour les inscriptions de dernière minute : nom écrit à la main
    {"firstName": "", "lastName": "", "company": "", "role": "participant", "vcard": None},
]


def main():
    answers = staff_answers(EVENTBRITE_EXPORT)
    speakers = [with_qr(person) for person in people(f"speakers-{YEAR}", "speaker", SPEAKER_COMPANIES, answers)]
    organizers = [with_qr(person) for person in people("organizers", "equipe", ORGANIZER_COMPANIES, answers)]
    if answers:
        raise ValueError(f"Billets conférencier ou équipe sans fiche sur le site : {list(answers)}")
    blank = {"firstName": "", "lastName": "", "company": "", "role": "participant", "ticket": None, "vcard": None}
    attendees = [
        with_qr(person)
        for person in sorted(participants(EVENTBRITE_EXPORT, EMAIL_CORRECTIONS), key=print_order) + [blank] * LAST_MINUTE_BLANKS
    ]
    write_csv(OUT / "conferenciers.csv", speakers)
    write_csv(OUT / "organisateurs.csv", organizers)
    write_csv(OUT / "participants.csv", attendees)
    report(attendees)
    print(f"Total : {len(attendees) + len(speakers) + len(organizers)} cocardes (participants, conférenciers, équipe)")
    data = {
        "attendees": [with_qr(a) for a in SAMPLE_ATTENDEES],
        "people": {"speakers": speakers, "organizers": organizers, "participants": attendees},
        "sponsors": {tier: [logo(n) for n in names] for tier, names in SPONSORS.items()},
        "logoSvg": (HERE / "assets" / "logo.svg").read_text(),
        "officialColourLogoSvg": (HERE / "assets" / "logo-couleur-officiel.svg").read_text(),
        "skylineSvg": (HERE / "assets" / "skyline.svg").read_text(),
        # Inlined: Chromium refuses a file:// image as a CSS mask
        "skylineMask": data_uri(HERE / "assets" / "skyline-mask.png"),
    }
    (HERE / "data.js").write_text(f"window.DATA = {json.dumps(data, ensure_ascii=False)};\n")
    for a in data["attendees"]:
        print(a["firstName"], a["lastName"], "→", a["qrInfo"] or "pas de QR")


OUT = HERE / "out"


# Triées par nom de famille pour l'accueil, les vierges à la fin
def print_order(attendee):
    return (not attendee["lastName"], sort_key(attendee["lastName"]), sort_key(attendee["firstName"]))


PARTICLES = {"de", "du", "des", "la", "le", "van", "von", "el", "al", "da", "di", "dos", "st"}


def report(attendees):
    named = [a for a in attendees if a["firstName"] or a["lastName"]]
    print(f"{len(attendees)} participants : {len(named)} nominatives, {len(attendees) - len(named)} vierges, {sum(1 for a in named if a['qr'])} avec QR")
    names = [f"{a['firstName']} {a['lastName']}" for a in named]
    duplicates = {name for name in names if names.count(name) > 1}
    if duplicates:
        print("❗ Noms en double :", duplicates)
    with_particle = [name for name in names if PARTICLES & set(re.split(r"[\s'’-]", name.casefold()))]
    if with_particle:
        print("À vérifier à la main (particules) :", with_particle)


# Une entrée par personne du site, triée par nom de famille. Prénom = premier mot, nom = le reste
# (identique au découpage de leur profil Sessionize). La vCard ne reprend que ce qui est déjà public
# sur dev-mtl.ca ; le formulaire EventBrite la complétera (courriel, téléphone) ou la corrigera.
def people(folder, role, companies, answers):
    entries = []
    for path in sorted((WEBSITE_ASSETS / folder).glob("*.json")):
        profile = json.loads(path.read_text())
        name = profile["name"].strip()
        if not name:
            continue
        first_name, _, last_name = name.partition(" ")
        public_contact = {
            "title": profile.get("position") or "",
            "linkedin": profile.get("linkedin") or "",
            "website": profile.get("website") or "",
        }
        # Ce qu'ils ont rempli dans EventBrite l'emporte sur le site
        answer = answers.pop(sort_key(name), None)
        given = {field: value for field, value in cleaned_contact(answer).items() if value} if answer else {}
        entries.append(
            {
                "firstName": first_name,
                "lastName": last_name,
                "company": (answer and answer["company"]) or companies.get(path.stem, ""),
                "role": role,
                "vcard": {**public_contact, **given},
            }
        )
    return sorted(entries, key=lambda entry: sort_key(entry["lastName"]))


# Une cocarde par billet participant de l'export EventBrite. Les corrections reçues par courriel remplacent
# un billet précis (colonne billet) ou, à défaut, les billets de la commande dans l'ordre. Un nom vide
# donne une cocarde vierge.
def participants(export_path, corrections_path):
    corrections = list(csv.DictReader(corrections_path.open(encoding="utf-8")))
    by_ticket = {row["billet"]: row for row in corrections if row["billet"]}
    by_order = {}
    for row in corrections:
        if not row["billet"]:
            by_order.setdefault(row["commande"], []).append(row)

    badges = []
    for ticket in eventbrite_tickets(export_path):
        if ticket["type"] in STAFF_TICKET_TYPES:
            continue
        order_corrections = by_order.get(ticket["order"], [])
        correction = by_ticket.get(ticket["id"]) or (order_corrections.pop(0) if order_corrections else None)
        badges.append(corrected_badge(ticket, correction) if correction else ticket_badge(ticket))
    leftovers = {order: rows for order, rows in by_order.items() if rows}
    if leftovers:
        raise ValueError(f"Corrections sans billet correspondant : {leftovers}")
    return badges


STAFF_TICKET_TYPES = {"Speakers", "Organizers"}


def staff_answers(export_path):
    return {
        sort_key(f"{ticket['holderFirstName']} {ticket['holderLastName']}"): ticket
        for ticket in eventbrite_tickets(export_path)
        if ticket["type"] in STAFF_TICKET_TYPES
    }


def eventbrite_tickets(export_path):
    rows = list(csv.DictReader(export_path.open(encoding="utf-8-sig")))
    for row in rows:
        answer = lambda prefix: next(value for column, value in row.items() if column.strip().startswith(prefix)).strip()
        yield {
            "order": answer("Numéro de commande"),
            "id": answer("Numéro de participant"),
            "type": answer("Types de billets"),
            "holderFirstName": row[next(column for column in row if column.strip() == "Prénom")].strip(),
            "holderLastName": row[next(column for column in row if column.strip() == "Nom")].strip(),
            "badgeName": answer("Prénom et nom de la personne qui portera ce badge"),
            "email": answer("Courriel / Email (badge QR Code)"),
            "phone": answer("Téléphone / Phone (badge QR Code)"),
            "company": answer("Entreprise / Company (badge QR Code)"),
            "title": answer("Rôle / Job title (badge QR Code)"),
            "linkedin": answer("URL LinkedIn / LinkedIn URL (badge QR Code)"),
        }


def ticket_badge(ticket):
    name = ticket["badgeName"] or f"{ticket['holderFirstName']} {ticket['holderLastName']}"
    if "@" in name:
        raise ValueError(f"Billet {ticket['id']} : « {name} » n'est pas un nom de cocarde")
    first_name, last_name = split_name(name, ticket["holderFirstName"])
    return badge(ticket["id"], first_name, last_name, ticket["company"], ticket)


def corrected_badge(ticket, correction):
    if not correction["prenom"] and not correction["nom"]:
        return {"firstName": "", "lastName": "", "company": "", "role": "participant", "ticket": ticket["id"], "vcard": None}
    contact = {"email": correction["courriel"], "phone": correction["telephone"], "title": correction["poste"], "linkedin": correction["linkedin"]}
    return badge(ticket["id"], correction["prenom"], correction["nom"], correction["entreprise"], contact)


def badge(ticket_id, first_name, last_name, company, contact):
    vcard_fields = cleaned_contact(contact)
    return {
        "firstName": recased(first_name),
        "lastName": recased(last_name),
        "company": company.strip(),
        "role": "participant",
        "ticket": ticket_id,
        "vcard": vcard_fields if any(vcard_fields.values()) else None,
    }


def cleaned_contact(contact):
    return {
        "email": contact["email"].strip().lower(),
        # Excel préfixe d'une apostrophe les numéros qui commencent par +
        "phone": contact["phone"].strip().lstrip("'"),
        "title": contact["title"].strip(),
        "linkedin": linkedin_url(contact["linkedin"]),
    }


# Le prénom du billet dit où couper le nom de cocarde (« Ana Sofia Costa Silva »), sinon au premier espace
def split_name(name, holder_first_name):
    words = name.split()
    holder_words = len(holder_first_name.split())
    first_words = holder_words if sort_key(" ".join(words[:holder_words])) == sort_key(holder_first_name) else 1
    return " ".join(words[:first_words]), " ".join(words[first_words:])


# Seuls les noms tout en capitales (ou tout en minuscules) sont recasés : McDaniel ou St-Louis restent tels quels
def recased(name):
    name = name.strip()
    if not (name.isupper() or name.islower()):
        return name
    return re.sub(r"(^|[\s'’-])(\w)", lambda match: match.group(1) + match.group(2).upper(), name.lower())


# Sans les paramètres de partage (utm_…), qui grossissent le QR pour rien
def linkedin_url(url):
    url = url.strip().split("?")[0].split("#")[0]
    if url and not url.startswith("http"):
        return f"https://{url}"
    return url


def sort_key(text):
    return unicodedata.normalize("NFD", text).encode("ascii", "ignore").decode().casefold()


def write_csv(path, entries):
    path.parent.mkdir(exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["prenom", "nom", "entreprise"])
        writer.writerows([entry["firstName"], entry["lastName"], entry["company"]] for entry in entries)


def with_qr(attendee):
    if not attendee["vcard"]:
        return {**attendee, "qr": None, "qrInfo": None}
    payload = vcard(attendee)
    qr = segno.make(payload.encode("utf-8"), error="m", micro=False)
    size = qr.symbol_size(border=0)[0]
    svg = qr.svg_inline(border=0, omitsize=True, dark="#0b0d32")
    info = f"{len(payload.encode('utf-8'))} octets, QR v{qr.version}-{qr.error}, {size} modules"
    return {**attendee, "qr": svg, "qrModules": size, "qrInfo": info}


def vcard(attendee):
    v = attendee["vcard"]
    first_name, last_name = escaped(attendee["firstName"]), escaped(attendee["lastName"])
    url = v.get("linkedin") or v.get("website")
    lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        f"N:{last_name};{first_name};;;",
        f"FN:{first_name} {last_name}",
        f"ORG:{escaped(attendee['company'])}" if attendee.get("company") else None,
        f"TITLE:{escaped(v['title'])}" if v.get("title") else None,
        f"EMAIL:{v['email']}" if v.get("email") else None,
        f"TEL:{v['phone']}" if v.get("phone") else None,
        f"URL:{url}" if url else None,
        "END:VCARD",
    ]
    return "\r\n".join(line for line in lines if line)


# vCard 3.0 (RFC 2426) : ces caractères séparent les champs, il faut les échapper dans une valeur
def escaped(text):
    return text.replace("\\", "\\\\").replace(",", "\\,").replace(";", "\\;")


def data_uri(path):
    return "data:image/png;base64," + base64.b64encode(path.read_bytes()).decode()


def logo(name):
    if name is None:
        return {"name": None, "src": None, "ratio": 3.6, "inkCentre": 0.5, "inkProfile": None, "isVector": False}
    folder = HERE / "assets" / "sponsors"
    is_vector = (folder / f"{name}.svg").exists()
    path = folder / f"{name}.{'svg' if is_vector else 'png'}"
    image = rasterized(path) if is_vector else Image.open(path)
    width, height = image.size
    return {
        "name": name,
        "src": str(path.relative_to(HERE)),
        "ratio": width / height,
        "inkCentre": ink_centre(image),
        "inkProfile": ink_profile(image),
        "isVector": is_vector,
    }


def rasterized(svg_path):
    page = fitz.open(svg_path)[0]
    scale = 600 / page.rect.width
    pixmap = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False)
    return Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples)


# Highest and lowest ink, as a fraction of the height, in each vertical slice of the logo. The gap the
# eye sees between two stacked logos is between these edges, not between their boxes.
def ink_profile(image, slices=60):
    import numpy as np

    pixels = np.asarray(image.convert("RGBA")).astype(int)
    ink = (pixels[..., 3] > 16) & (pixels[..., :3].min(axis=2) < 240)
    height, width = ink.shape
    top, bottom = [], []
    for index in range(slices):
        rows = np.where(ink[:, index * width // slices : max((index + 1) * width // slices, index * width // slices + 1)].any(axis=1))[0]
        top.append(round(rows[0] / height, 4) if rows.size else None)
        bottom.append(round((rows[-1] + 1) / height, 4) if rows.size else None)
    return {"top": top, "bottom": bottom}


# Where the visual weight of a logo sits, from 0 (top) to 1 (bottom). A tick or a
# descender shifts it away from the middle of the bounding box, which is what the eye aligns on.
def ink_centre(image):
    rgba = image.convert("RGBA")
    width, height = rgba.size
    pixels = rgba.load()
    ink_per_row = [
        sum(1 for x in range(width) if pixels[x, y][3] > 16 and min(pixels[x, y][:3]) < 240)
        for y in range(height)
    ]
    total = sum(ink_per_row)
    return sum((y + 0.5) * ink for y, ink in enumerate(ink_per_row)) / total / height


if __name__ == "__main__":
    main()
