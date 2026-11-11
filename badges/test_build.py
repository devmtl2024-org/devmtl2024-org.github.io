import csv
import tempfile
import unittest
from pathlib import Path

from build import participants, vcard


def person(**vcard_fields):
    return {"firstName": "Camille", "lastName": "Tremblay", "company": "", "vcard": vcard_fields}


class VcardTest(unittest.TestCase):
    # vCard 3.0 (RFC 2426) : « , » « ; » et « \ » dans une valeur doivent être échappés,
    # sinon les applis de contacts coupent le champ
    def test_escapes_separators_in_text_values(self):
        card = vcard({**person(title="SE @ Docker, CNCF; GDE \\ Cloud"), "company": "Audensiel Canada, Inc."})

        self.assertIn("TITLE:SE @ Docker\\, CNCF\; GDE \\\\ Cloud\r\n", card)
        self.assertIn("ORG:Audensiel Canada\\, Inc.\r\n", card)

    def test_escapes_separators_in_names(self):
        card = vcard({**person(), "lastName": "St-Louis; Allegrini"})

        self.assertIn("N:St-Louis\; Allegrini;Camille;;;\r\n", card)

    # Les organisateurs sans LinkedIn ont un site web : c'est lui qui va dans la carte
    def test_falls_back_to_website_without_linkedin(self):
        card = vcard(person(website="https://understandlegacycode.com"))

        self.assertIn("URL:https://understandlegacycode.com\r\n", card)

    def test_includes_phone(self):
        card = vcard(person(phone="438-555-0199"))

        self.assertIn("TEL:438-555-0199\r\n", card)


EXPORT_COLUMNS = [
    "Numéro de commande ",
    "Prénom",
    "Nom ",
    "Types de billets",
    "Numéro de participant ",
    "Prénom et nom de la personne qui portera ce badge (obligatoire)",
    "Courriel / Email (badge QR Code) — Bonus networking",
    "Téléphone / Phone (badge QR Code)",
    "Entreprise / Company (badge QR Code)",
    "Rôle / Job title (badge QR Code)",
    "URL LinkedIn / LinkedIn URL (badge QR Code)",
]
CORRECTION_COLUMNS = ["commande", "billet", "acheteur", "prenom", "nom", "entreprise", "poste", "courriel", "telephone", "linkedin"]


def ticket(order, attendee_id, holder, badge="", ticket_type="General Admission", **contact):
    first_name, last_name = holder.split(" ", 1)
    return [order, first_name, last_name, ticket_type, attendee_id, badge,
            contact.get("email", ""), contact.get("phone", ""), contact.get("company", ""),
            contact.get("title", ""), contact.get("linkedin", "")]


def correction(order, first_name, last_name, attendee_id="", company=""):
    return [order, attendee_id, "", first_name, last_name, company, "", "", "", ""]


class ParticipantsTest(unittest.TestCase):
    def setUp(self):
        self.folder = Path(tempfile.mkdtemp())

    def build(self, tickets, corrections=()):
        return participants(self.csv("export.csv", EXPORT_COLUMNS, tickets), self.csv("corrections.csv", CORRECTION_COLUMNS, corrections))

    def csv(self, name, header, rows):
        path = self.folder / name
        with path.open("w", newline="", encoding="utf-8") as file:
            csv.writer(file).writerows([header, *rows])
        return path

    def names(self, badges):
        return [(badge["firstName"], badge["lastName"]) for badge in badges]

    # Le nom de cocarde vient du formulaire, sinon du billet. Conférenciers et équipe ont leur propre cocarde.
    def test_one_badge_per_participant_ticket_named_from_the_form(self):
        badges = self.build([
            ticket("1", "11", "Camille Tremblay", badge="Maïka Nguyen"),
            ticket("2", "21", "JEAN-PHILIPPE GAGNON", badge="JEAN-PHILIPPE GAGNON"),
            ticket("3", "31", "Ana Costa", badge="Ana Costa Silva"),
            ticket("4", "41", "Olivier Roy"),
            ticket("5", "51", "Léa Bouchard", ticket_type="Speakers"),
        ])

        self.assertEqual(self.names(badges), [("Maïka", "Nguyen"), ("Jean-Philippe", "Gagnon"), ("Ana", "Costa Silva"), ("Olivier", "Roy")])

    def test_contact_answers_go_to_the_vcard_without_spreadsheet_artifacts(self):
        badges = self.build([ticket("1", "11", "Camille Tremblay", phone="'+1 438 555 0199", company="Studio Boréal",
                                    title="Dev", linkedin="linkedin.com/in/camille?utm_source=share")])

        self.assertEqual(badges, [{
            "firstName": "Camille", "lastName": "Tremblay", "company": "Studio Boréal", "role": "participant", "ticket": "11",
            "vcard": {"email": "", "phone": "+1 438 555 0199", "title": "Dev", "linkedin": "https://linkedin.com/in/camille"},
        }])

    # Les commandes « un nom par commande » sont corrigées par courriel : ligne par commande, ou par billet
    def test_email_corrections_replace_tickets_by_order_or_by_attendee_id(self):
        badges = self.build(
            [ticket("1", "11", "Martin Lavoie"), ticket("1", "12", "Martin Lavoie"),
             ticket("2", "21", "Sophie Gagné"), ticket("2", "22", "Sophie Gagné", badge="sophie.gagne@example.com")],
            [correction("1", "Karim", "Haddad", company="Studio Boréal"), correction("1", "", ""), correction("2", "", "", attendee_id="22")],
        )

        self.assertEqual(self.names(badges), [("Karim", "Haddad"), ("", ""), ("Sophie", "Gagné"), ("", "")])
        self.assertEqual(badges[0]["company"], "Studio Boréal")

    def test_refuses_an_email_address_as_a_badge_name(self):
        with self.assertRaisesRegex(ValueError, "22"):
            self.build([ticket("2", "22", "Sophie Gagné", badge="sophie.gagne@example.com")])


if __name__ == "__main__":
    unittest.main()
