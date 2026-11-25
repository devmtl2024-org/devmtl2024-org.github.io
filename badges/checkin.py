"""Printable list for the reception desk, in the same order as the participant badge pile: out/liste-accueil.pdf.

Speakers, organizers and sponsor booth badges are handed out by the team, so they are not listed. A scanned
EventBrite ticket shows the name on the ticket: update EventBrite with the names learnt by email before
exporting, and the list only shows the tickets still under someone else's name. Names learnt after
printing get a blank badge, completed on site.
"""

import csv
import sys
from pathlib import Path

HERE = Path(__file__).parent
sys.path.insert(0, str(HERE / "pylib"))

import fitz  # noqa: E402

from build import eventbrite_tickets, participants, sort_key  # noqa: E402
from config import CHECKIN_EXPORT, EMAIL_CORRECTIONS, PRINTED_LISTS  # noqa: E402

OUT = HERE / "out"


def main():
    tickets = {ticket["id"]: ticket for ticket in eventbrite_tickets(CHECKIN_EXPORT)}
    allergies = allergies_by_ticket(CHECKIN_EXPORT)
    printed = {sort_key(f"{row['prenom']} {row['nom']}") for path in PRINTED_LISTS for row in csv.DictReader(path.open(encoding="utf-8"))}
    rows = [row(badge, tickets[badge["ticket"]], printed, allergies) for badge in participants(CHECKIN_EXPORT, EMAIL_CORRECTIONS)]

    named = sorted((row for row in rows if row["lastName"]), key=lambda row: (sort_key(row["lastName"]), sort_key(row["firstName"])))
    unnamed = sorted((row for row in rows if not row["lastName"]), key=lambda row: sort_key(row["holder"]))
    OUT.mkdir(exist_ok=True)
    write_pdf(OUT / "liste-accueil.pdf", named, unnamed)
    print(f"{len(named)} participants nommés, {len(unnamed)} billets sans nom → {OUT / 'liste-accueil.pdf'}")


# Le traiteur sert le dîner : l'accueil prévient les personnes allergiques
def allergies_by_ticket(export_path):
    rows = csv.DictReader(export_path.open(encoding="utf-8-sig"))
    answer = lambda row, prefix: next((value.strip() for column, value in row.items() if column.strip().startswith(prefix)), "")
    return {answer(row, "Numéro de participant"): answer(row, "Précise (allergie") for row in rows}


def row(badge, ticket, printed, allergies):
    holder = f"{ticket['holderFirstName']} {ticket['holderLastName']}"
    name = f"{badge['firstName']} {badge['lastName']}".strip()
    return {
        "lastName": badge["lastName"],
        "firstName": badge["firstName"],
        "blankBadge": bool(name) and sort_key(name) not in printed,
        # Ce qu'affiche l'appli EventBrite au scan, quand ce n'est pas la personne
        "holder": "" if sort_key(holder) == sort_key(name) else holder,
        "order": ticket["order"],
        "allergy": allergies.get(ticket["id"], ""),
    }


# Polices standard du PDF : pas de tiret cadratin, rendu comme un point médian
# Dessiné à la main : le moteur HTML de PyMuPDF perd des lignes d'une page à l'autre et ignore la largeur des tableaux
PAGE = fitz.paper_rect("letter")
MARGIN = 36
ROW_HEIGHT = 25
FONT_SIZE = 11
BOLD = fitz.Font("hebo")
# Titre de page et noms des colonnes
HEADER = 44
# Nom, billet au nom de, commande : sur toute la largeur utile, après la case à cocher
COLUMNS = ((MARGIN + 26, "Nom"), (MARGIN + 290, "Billet au nom de"), (PAGE.width - MARGIN - 90, "Commande"))


def write_pdf(path, named, unnamed):
    document = fitz.open()
    sections = [
        ("/dev/mtl : liste d'accueil des participants", named, name_cell),
        ("Billets sans nom : cocarde vierge, nom écrit sur place", unnamed, lambda row: ("", "", "", row["allergy"])),
    ]
    for title, rows, name in sections:
        rows_per_page = int((PAGE.height - 2 * MARGIN - HEADER) // ROW_HEIGHT)
        for start in range(0, len(rows), rows_per_page):
            page = document.new_page(width=PAGE.width, height=PAGE.height)
            heading = title if start == 0 else f"{title} (suite)"
            page.insert_text((MARGIN, MARGIN + 14), heading, fontname="hebo", fontsize=15)
            y = MARGIN + HEADER
            for x, label in COLUMNS:
                page.insert_text((x, y - 8), label, fontname="hebo", fontsize=FONT_SIZE)
            line(page, y)
            for row in rows[start : start + rows_per_page]:
                y += ROW_HEIGHT
                baseline = y - (ROW_HEIGHT - FONT_SIZE) / 2 - 2
                page.draw_rect(fitz.Rect(MARGIN + 2, baseline - 10, MARGIN + 13, baseline + 1), color=(0, 0, 0), width=0.8)
                last_name, first_name, note, allergy = name(row)
                name_baseline = baseline - 4 if allergy else baseline
                x = COLUMNS[0][0]
                page.insert_text((x, name_baseline), last_name, fontname="hebo", fontsize=FONT_SIZE)
                # fitz.get_text_length sous-estime les capitales accentuées (« SÉGUIN ») : la police mesure juste
                x += BOLD.text_length(last_name, FONT_SIZE)
                page.insert_text((x, name_baseline), first_name + note, fontname="helv", fontsize=FONT_SIZE)
                if allergy:
                    page.insert_text((COLUMNS[0][0], name_baseline + 9), f"Allergie : {allergy}", fontname="hebo", fontsize=7.5, color=(0.8, 0, 0))
                page.insert_text((COLUMNS[1][0], baseline), row["holder"], fontname="helv", fontsize=FONT_SIZE)
                page.insert_text((COLUMNS[2][0], baseline), row["order"], fontname="helv", fontsize=FONT_SIZE)
                line(page, y)
    document.save(path)


def line(page, y):
    page.draw_line((MARGIN, y), (PAGE.width - MARGIN, y), color=(0.6, 0.6, 0.6), width=0.5)


def name_cell(row):
    note = " (cocarde vierge)" if row["blankBadge"] else ""
    return row["lastName"].upper(), f", {row['firstName']}", note, row["allergy"]


if __name__ == "__main__":
    main()
