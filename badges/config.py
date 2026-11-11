"""What changes from one edition to the next. Attendee data never lives in the repo: it is read from DATA_DIR."""

import os
from pathlib import Path

YEAR = 2026

# Hors du dépôt : l'export EventBrite et les corrections reçues par courriel
DATA_DIR = Path(os.environ.get("BADGES_DATA", Path.home() / "Downloads" / "dev-mtl" / "cocardes" / str(YEAR)))
EVENTBRITE_EXPORT = DATA_DIR / "eventbrite" / "participants-2026-11-10.csv"
EMAIL_CORRECTIONS = DATA_DIR / "reponses-multi-billets.csv"

# Order of arrival within each tier, same rule as the website. Logos are in assets/sponsors/, SVG preferred.
SPONSORS = {
    "or": ["osedea", "alten", "extia"],
    "argent": ["coveo", "vasco", "elastic"],
    # Roll-up seulement : la grille de commandites promet le roll-up aux Bronze, pas la cocarde
    "bronze": ["shopify", "formulize", "go-rock-it"],
}

# Le champ « position » du site est libre (accroches, postes) : l'entreprise à imprimer est
# extraite à la main, et laissée vide quand le texte n'en nomme pas. Ce qu'ils remplissent dans
# EventBrite l'emporte.
SPEAKER_COMPANIES = {
    "ayrat-khayretdinov": "Google",
    "carl-lapierre": "Osedea",
    "damien-soichet": "Soich Inc",
    "dina-kada": "Bell Mobility",
    "dwayne-mcdaniel": "GitGuardian",
    "francois-cailleau": "Select Etoile",
    "glodie-juvenal-pengele": "Audensiel Canada",
    "imad-eddine-charchar": "CGI",
    "keynote": "Sent Tech",
    "margaret-gu": "Elastic",
    "mathieu-benoit": "Docker",
    "nurul-islam": "QuickSeries Publishing Inc.",
    "samantha-st-louis": "Atmosera",
    "sebastien-castiel": "Vasco",
    "stefania-pecore": "Women Techmakers Montreal",
    "thomas-salmon": "Osedea",
    "zackary-therrien": "Osedea",
}

ORGANIZER_COMPANIES = {
    "nicolas-gras": "Intact",
    "nicolas-rosado": "Maplr",
    "xavier-bouclet": "Vertocube",
}

# Lot pour les inscriptions de dernière minute, en plus des billets encore sans nom : 180 cocardes à imprimer
# en 2026, kiosques compris
LAST_MINUTE_BLANKS = 12
