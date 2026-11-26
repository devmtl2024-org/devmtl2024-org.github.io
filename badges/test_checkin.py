import unittest

from checkin import row


def holder_shown(badge_name, ticket_name):
    first_name, last_name = badge_name.split(" ", 1)
    holder_first_name, holder_last_name = ticket_name.split(" ", 1)
    badge = {"firstName": first_name, "lastName": last_name, "ticket": "1"}
    ticket = {"id": "1", "order": "42", "holderFirstName": holder_first_name, "holderLastName": holder_last_name}
    return row(badge, ticket, printed=set(), allergies={})["holder"]


class HolderTest(unittest.TestCase):
    # L'accueil n'a besoin du nom sur le billet que si c'est quelqu'un d'autre
    def test_hides_the_ticket_name_when_it_is_the_same_person(self):
        same_person = [
            ("Camille Tremblay-Roy", "Camille Tremblay Roy"),
            ("Camille Tremblay", "Camille Tremblya"),
            ("Camille Gagnon Tremblay", "Camille Gagnon"),
            ("Camille Tremblay", "Cam see TREMBLAY"),
            ("Camille Tremblay", "Marie camille Tremblay bouchard"),
        ]
        for badge_name, ticket_name in same_person:
            with self.subTest(badge=badge_name, ticket=ticket_name):
                self.assertEqual(holder_shown(badge_name, ticket_name), "")

    def test_shows_the_ticket_name_when_someone_else_holds_it(self):
        self.assertEqual(holder_shown("Camille Tremblay", "Alex Bouchard"), "Alex Bouchard")


if __name__ == "__main__":
    unittest.main()
