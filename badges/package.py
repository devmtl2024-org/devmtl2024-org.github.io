"""Copies the rendered files to pour-imprimeur/ and declares trim and bleed boxes on the PDFs."""

import datetime
import shutil
import sys
from pathlib import Path

HERE = Path(__file__).parent
sys.path.insert(0, str(HERE / "pylib"))

import fitz  # noqa: E402

from config import YEAR  # noqa: E402
OUT = HERE / "out"
DEST = HERE / "pour-imprimeur"

BADGE_BLEED_PT = 9
# Ce qui s'imprime est à la racine de cocardes/ ; gabarits vierges et listes de contrôle dans sources/
BADGES = {
    "participants-fusionnes.pdf": "participants-fusionnes.pdf",
    "conferenciers-fusionnes.pdf": "conferenciers-fusionnes.pdf",
    "organisateurs-fusionnes.pdf": "organisateurs-fusionnes.pdf",
    "cocarde-commanditaires.pdf": "cocardes-commanditaires-kiosque.pdf",
    "cocarde-speaker.pdf": "sources/cocarde-conferencier-vierge.pdf",
    "cocarde-equipe.pdf": "sources/cocarde-organisateur-vierge.pdf",
}

# Cotes du gabarit imprimeur « template roll up mars.pdf »
ROLLUP_MEDIA = fitz.Rect(0, 0, 2439, 5850)
ROLLUP_TRIM = fitz.Rect(18, 9, 2421, 5841)


def main():
    shutil.rmtree(DEST, ignore_errors=True)
    (DEST / "cocardes" / "sources").mkdir(parents=True)
    (DEST / "roll-up").mkdir()

    for source, target in BADGES.items():
        doc = fitz.open(OUT / source)
        for page in doc:
            declare_badge_boxes(page)
        doc.save(DEST / "cocardes" / target, garbage=3, deflate=True)
    for listing in ["participants.csv", "conferenciers.csv", "organisateurs.csv"]:
        shutil.copy(OUT / listing, DEST / "cocardes" / "sources" / listing)
    # Écrit à la main : il vit hors de pour-imprimeur/, que ce script vide à chaque fois
    shutil.copy(HERE / "LISEZ-MOI-imprimeur.md", DEST / "LISEZ-MOI.md")

    rollup = fitz.open(OUT / "roll-up.pdf")
    page = rollup[0]
    # Chromium arrondit la largeur au pixel (2439,12 pt) : on ramène au gabarit exact
    page.set_mediabox(ROLLUP_MEDIA)
    page.set_bleedbox(ROLLUP_MEDIA)
    page.set_trimbox(ROLLUP_TRIM)
    page.set_artbox(ROLLUP_TRIM)
    rollup.save(DEST / "roll-up" / f"roll-up-{YEAR}.pdf", garbage=3, deflate=True)

    archive = shutil.make_archive(str(HERE / f"pour-imprimeur-{datetime.date.today()}"), "zip", HERE, DEST.name)
    print(f"→ {archive}")


# Chromium writes a bare MediaBox; the printer needs to know where to cut
def declare_badge_boxes(page):
    media = page.mediabox
    trim = fitz.Rect(media.x0 + BADGE_BLEED_PT, media.y0 + BADGE_BLEED_PT, media.x1 - BADGE_BLEED_PT, media.y1 - BADGE_BLEED_PT)
    page.set_bleedbox(media)
    page.set_trimbox(trim)
    page.set_artbox(trim)


main()
