# CLAUDE.md — /dev/mtl Conference Website

Production: https://dev-mtl.ca | Bilingual (FR/EN) conference site for /dev/mtl, Montreal.

## Commands

```bash
yarn dev            # Vite dev server
yarn build          # Production build (copies index.html → 404.html for GH Pages SPA routing)
yarn typecheck      # tsc --noEmit (strict)
yarn lint           # ESLint, zero warnings allowed (--max-warnings=0)
yarn format         # Prettier --write
yarn format-check   # Prettier --list-different
yarn test           # Vitest (happy-dom environment)
```

**CI runs on every push to main:** typecheck → lint → build → deploy to GitHub Pages.
Always run `yarn typecheck` and `yarn lint` before committing.

## Tech Stack

- **React 18** + **TypeScript** (strict mode) + **Vite 5**
- **Tailwind CSS v3** for styling — no CSS modules, no inline styles (except dynamic backgrounds)
- **Chakra UI v3** for some UI primitives
- **Framer Motion** for scroll-triggered animations
- **React Router DOM v7** with `BrowserRouter` (SPA, hash-based 404 fallback)
- **Vitest** + **happy-dom** for testing
- **Yarn 3** (via Corepack) — `yarn install --immutable` in CI
- **Husky + lint-staged** — Prettier runs on every commit

## Project Structure

```
src/
  main.tsx              # Router + LanguageProvider
  pages/                # One component per route
  components/           # Feature-organized (Home/, Navbar/, Sponsors/, etc.)
  assets/               # JSON data files + static media
    organizers/          # One JSON per organizer
    speakers-{year}/     # One JSON per speaker
    sponsors/            # One JSON per sponsor
    pauses.ts            # Break timestamps for schedule
    transparency-data.json
  contexts/             # LanguageContext (FR/EN detection + persistence)
  hooks/                # useTranslation(), useSponsors()
  type/                 # TypeScript interfaces (speakers.ts, sponsors.ts, etc.)
  utils/                # loadData.ts (Vite glob-based JSON loader), groupSpeakers.ts
  constants/            # navlinks.ts (centralized bilingual nav definitions)
public/                 # Static assets (images referenced in JSON data)
```

## Key Patterns

### Data loading — no external API

All content is JSON files in `src/assets/`. Loaded via `loadData<T>(folder)` which uses `import.meta.glob`.

To add a new year of speakers: create `src/assets/speakers-{year}/`, add a glob entry in `src/utils/loadData.ts`, and update `SpeakersPage.tsx`.

### Internationalization — inline, no library

```tsx
const { t } = useTranslation();
<h2>{t({ fr: "Conférenciers", en: "Speakers" })}</h2>
```

All translations are inline using `t()`. No separate translation files. Every user-visible string must have both `fr` and `en`.

Language detection: URL `?lang=` → localStorage → browser language → default `"fr"`.

### Image references

JSON data uses paths relative to `public/`: `"image": "speakers-2025/foo.jpg"` → `public/speakers-2025/foo.jpg`.

Rendered as: `src={`${import.meta.env.BASE_URL}${speaker.image}`}`.

SVGs imported as React components via svgr: `import Logo from "../../assets/logo.svg?react"`.

### Speaker URL slugs

Generated at navigation time from the `name` field: lowercase → NFD decomposition (strip accents) → replace spaces with hyphens. Keep this logic consistent between `SpeakersPage.tsx` and `SpeakerPage.tsx`.

### Tailwind colors

- `primary` / `primary-dark` / `primary-light` — navy blue (#01055E)
- `secondary` / `secondary-dark` / `secondary-light` — orange (#ff9b62)

### Feature flags

`ARE_TICKETS_AVAILABLE` in `src/components/BuyTicket/BuyTicket.tsx` — simple boolean constant.

### Nav links

Centralized in `src/constants/navlinks.ts` with bilingual names. Do not hardcode nav labels elsewhere.

## Adding Content

### Speaker (`src/assets/speakers-{year}/{name}.json`)
```json
{
  "name": "Full Name",
  "bio": "Bio or null",
  "position": "Title or null",
  "image": "speakers-2025/photo.jpg",
  "time": "2025-11-28T09:00:00",
  "track": 1,
  "title": "Talk Title",
  "description": "Talk description",
  "github": "username or null",
  "linkedin": "URL or null",
  "website": "URL or null"
}
```

Speakers with `title === "Intro"` are filtered out from the speakers grid.

### Sponsor (`src/assets/sponsors/{name}.json`)
```json
{
  "name": "Company",
  "logo": "sponsors/logo.png",
  "url": "https://...",
  "isEnabled": true,
  "description": { "fr": "...", "en": "..." },
  "level": "or" | "argent" | "bronze" | "supporter"
}
```

### Organizer (`src/assets/organizers/{name}.json`)
```json
{
  "name": "Full Name",
  "image": "organizers/photo.png",
  "github": "username",
  "linkedin": "URL or null",
  "website": "URL or null",
  "role": "Organizer"
}
```

## Routing

| Path | Page | Layout |
|---|---|---|
| `/` | HomePage | Own Navbar + Footer |
| `/about` | AboutPage | Shared Layout |
| `/venue` | VenuePage | Shared Layout |
| `/schedule` | SchedulePage | Shared Layout |
| `/speakers/:year` | SpeakersPage | Shared Layout |
| `/speaker/:name` | SpeakerPage | Shared Layout |
| `/sponsors` | SponsorsPage | Shared Layout |
| `/transparency` | TransparencyPage | Shared Layout |
| `/conduct` | ConductPage | Shared Layout |

`Layout` uses `<Outlet />` and derives the page title from `navLinks` based on the current path.

## TypeScript

- `@/` path alias maps to `src/`
- Interfaces for domain data in `src/type/`
- Strict mode: `noUnusedLocals`, `noUnusedParameters`
