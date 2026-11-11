# Cocardes et roll-up

Generates the printer files for the edition: one recto-verso badge per ticket (participants, speakers,
organizers, one non-nominative badge per Or/Argent sponsor booth) with a vCard QR code, and the roll-up
that stands at the reception desk.

```bash
python3 -m pip install --target badges/pylib -r badges/requirements.txt # once
yarn badges                                                             # data.js → out/*.pdf → pour-imprimeur/ + pour-imprimeur-<date>.zip
python3 badges/verify.py                                                # decodes every QR and checks the printed names (needs Xcode's swiftc)
python3 badges/checkin.py                                               # participants' reception list → out/liste-accueil.pdf
(cd badges && python3 -m unittest test_build)
```

**Attendee data never goes in the repo.** `config.py` reads it from `DATA_DIR`
(`~/Downloads/dev-mtl/cocardes/<year>/` by default, or `BADGES_DATA`). Everything generated from it
(`data.js`, `out/`, `pour-imprimeur/`, the zip) is git-ignored.

## Recipe for a new edition

1. **`config.py`**: year, sponsors per tier, speaker and organizer companies. Sponsor print logos go in
   `assets/sponsors/` (SVG preferred, a PNG must hold up on the 80-inch roll-up). Change the date in
   `badges.html` (verso) and `rollup.html` too.
2. **EventBrite form** (Each Attendee, questions after checkout): badge name, then optional email, phone,
   company, job title and LinkedIn, each labelled « (badge QR Code) ». Filling a field is the opt-in.
   Orders placed before the form exists are « Buyer Only » (one name per order): email those buyers a
   block per ticket.
3. **Export**: Production de rapports › Participants › « Réponses aux questions personnalisées », status
   « Sera présent(e) », export CSV (the page itself shows 25 rows only) into `DATA_DIR/eventbrite/`.
4. **Corrections** in `DATA_DIR/reponses-multi-billets.csv`
   (`commande,billet,acheteur,prenom,nom,entreprise,poste,courriel,telephone,linkedin`). A row with
   `billet` (attendee ID) replaces that ticket. Otherwise it fills the order's tickets in export order,
   which changes between exports: once printed, pin every row to its `billet`. An empty name prints a
   blank badge. Settle every case `build.py` reports before printing: duplicate names,
   particles to check by hand (all-caps names are recased), an email typed as a name (the build stops).
5. `yarn badges`, `verify.py`, then fix `LISEZ-MOI-imprimeur.md` (counts per file) and run
   `yarn badges` again so the zip carries it. Keep a copy of the zip's `cocardes/sources/` lists in
   `DATA_DIR/pour-imprimeur/`: `checkin.py` compares against what was printed.
6. **Before the event**: put the corrected names in EventBrite (Gérer les commandes › Modifier les
   informations sur les participants, untick « Envoyer un courriel de confirmation »), so a scanned
   ticket shows the right person. Then take a fresh export and run `checkin.py`: one line per participant
   ticket in badge order, with the name EventBrite still shows when it differs, and the blank badges.

Speakers and organizers come from the site's JSON (`src/assets/speakers-<year>/`, `organizers/`). Their
EventBrite answers override the site data in their vCard.
