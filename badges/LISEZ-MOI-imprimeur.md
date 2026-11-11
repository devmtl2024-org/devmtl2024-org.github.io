# /dev/mtl 2026 — fichiers pour l'imprimeur

Version finale pour impression.

## Cocardes

Même format qu'en 2025 : 4 × 6 po fini, 0,125 po de fond perdu de chaque côté (pages de
4,25 × 6,25 po), recto verso, 2 perforations en haut aux mêmes positions. TrimBox et BleedBox
sont déclarées dans chaque PDF. Page 1 = recto, page 2 = verso, et ainsi de suite.

À imprimer, dans `cocardes/` :

| Fichier                               | Cocardes | Contenu                                                    |
| ------------------------------------- | -------- | ---------------------------------------------------------- |
| `participants-fusionnes.pdf`          | 146      | 124 nominatives triées par nom de famille, puis 22 vierges |
| `conferenciers-fusionnes.pdf`         | 22       | Nominatives, triées par nom de famille                     |
| `organisateurs-fusionnes.pdf`         | 6        | Nominatives, triées par nom de famille                     |
| `cocardes-commanditaires-kiosque.pdf` | 6        | Une par commanditaire, non nominatives                     |

Un exemplaire de chaque page, rien d'autre à fusionner ni à dupliquer : 180 cocardes en tout.
Les vierges en fin de `participants-fusionnes.pdf` servent aux inscriptions de dernière minute, nom
écrit sur place.

`cocardes/sources/` ne s'imprime pas : gabarits vierges conférencier et organisateur, au cas où, et
listes en CSV pour contrôle.

## Roll-up

`roll-up/roll-up-2026.pdf` reprend exactement les cotes de votre gabarit « template roll up mars » :
33,875 × 81,25 po au total, TrimBox identique, zone visible de 33,375 × 78,5 po.
