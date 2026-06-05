# /dev/mtl 2026 — Media Partner Kit

Assets for the media partnership. Two deliverables, each in FR + EN.

| Deliverable      | Image                                   | Copy limit    |
| ---------------- | --------------------------------------- | ------------- |
| Social post      | `social-{lang}-1200x600.png` (1200×600) | 400–600 chars |
| Calendar listing | `calendar-{lang}-700x500.png` (700×500) | max 200 chars |

Event facts: **/dev/mtl 2026 · Nov 27, 2026 · Concordia University Conference Centre, Montréal · 21 talks · FR and EN · 150+ attendees · lunch & coffee included.** Bilingual, community-driven. https://www.dev-mtl.ca

---

## Social post copy

**FR**

> 🚀 /dev/mtl 2026, la conférence des communautés tech de Montréal est de retour!
>
> Le 27 novembre, rejoignez 150+ passionné·es au Centre de Conférence de l'Université Concordia pour une journée d'apprentissage, de partage et de réseautage. Au programme : 21 présentations en Anglais et Français par des conférencier·ères d'ici, le dîner et le café offerts, et une ambiance décontractée portée par les communautés tech locales.
>
> Partagez la passion. Découvrez l'innovation.
>
> 🎟️ Billets & programme : https://www.dev-mtl.ca

**EN**

> 🚀 /dev/mtl 2026 is back, the Montreal's community-driven tech conference!
>
> On November 27, join 150+ developers at the Concordia University Conference Centre for a day of learning, sharing, and networking. Expect 21 talks in French or English from local speakers, lunch and coffee included, and a relaxed vibe powered by Montreal's tech communities.
>
> Share the passion. Discover the innovation.
>
> 🎟️ Tickets & schedule: https://www.dev-mtl.ca

## Short copy

**FR**

> /dev/mtl 2026, la conférence des communautés tech de Montréal. Le 27 novembre à l'Université Concordia : 21 présentations, EN et FR, 150+ participant·es. Billets : dev-mtl.ca

**EN**

> /dev/mtl 2026, Montreal's community-driven tech conference. November 27 at Concordia University: 21 talks, EN and FR, 150+ attendees. Tickets: dev-mtl.ca

---

## Regenerating the images

```bash
python3 build.py # requires rsvg-convert (brew install librsvg)
```

`build.py` composes each card as an SVG (photo + navy `#01055E` overlay + hexagon
mark + wordmark + date/venue + tagline) and renders it to PNG with `rsvg-convert`.
Edit `COPY` / `LAYOUT` constants at the top to tweak text or positioning.

- `base.jpg` is a copy of `src/assets/overview.jpg` (kept local so `rsvg-convert`
  can reference it from this folder).
- The `*.svg` files are the editable sources for each PNG.
