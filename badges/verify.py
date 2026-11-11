"""Decodes every QR code of the merged PDFs and checks it against the vCard build.py meant, and that the name is printed."""

import json
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).parent
sys.path.insert(0, str(HERE / "pylib"))

import fitz  # noqa: E402

from build import vcard  # noqa: E402

OUT = HERE / "out"
SETS = {"participants": "participants", "speakers": "conferenciers", "organizers": "organisateurs"}


def main():
    decoder = OUT / "decode-qr"
    if not decoder.exists():
        subprocess.run(["swiftc", "-O", str(HERE / "decode-qr.swift"), "-o", str(decoder)], check=True)
    data = json.loads((HERE / "data.js").read_text().removeprefix("window.DATA = ").rstrip().rstrip(";"))
    errors = 0
    for kind, name in SETS.items():
        people = data["people"][kind]
        pdf = fitz.open(OUT / f"{name}-fusionnes.pdf")
        with_qr = 0
        for index, person in enumerate(people):
            recto = pdf[2 * index]
            decoded = decoded_qr(decoder, recto)
            expected = vcard(person) if person["qr"] else None
            if decoded != expected or not name_is_printed(person, recto):
                errors += 1
                print(f"❌ {name} page {2 * index + 1} : {person['firstName']} {person['lastName']}")
            with_qr += bool(expected)
        print(f"{name} : {len(people)} cocardes, {with_qr} QR vérifiés")
    sys.exit(1 if errors else 0)


def decoded_qr(decoder, page):
    image = OUT / "verify-recto.png"
    page.get_pixmap(dpi=300).save(image)
    output = subprocess.run([str(decoder), str(image)], capture_output=True, text=True, check=True).stdout
    if "→ 1 code" not in output:
        return None
    # Vision rend les fins de ligne en \n : on revient au \r\n de la vCard
    return output.split("\n", 2)[2].rstrip("\n").replace("\n", "\r\n")


def name_is_printed(person, page):
    text = " ".join(page.get_text().split()).upper()
    return all(part.upper() in text for part in (person["firstName"], person["lastName"]) if part)


if __name__ == "__main__":
    main()
