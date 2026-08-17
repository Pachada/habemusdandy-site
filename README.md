# HabemusDandy Site

Public marketing site for [HabemusDandy](https://habemusfisio.com): product, pricing, and other visitor-facing pages.

The clinic dashboard lives in a separate repo (`Habemusfisio-ui`) and should stay on the app origin (for example `habemusfisio.com`). This site is static and SEO-oriented.

## Stack

- [Astro](https://astro.build) + TypeScript
- Outfit typeface (self-hosted via `@fontsource/outfit`) and HabemusDandy brand tokens

## Setup

```bash
cp .env.example .env
npm install
```

`PUBLIC_APP_ORIGIN` controls login/signup links (`/login`, `/signup`). Default: `https://habemusfisio.com`.

## Commands

| Command            | Action                                      |
| :----------------- | :------------------------------------------ |
| `npm install`      | Install dependencies                        |
| `npm run dev`      | Dev server at `http://localhost:4321`       |
| `npm run check`    | Type/content check (`astro check`)          |
| `npm run build`    | Production build to `./dist/`               |
| `npm run preview`  | Preview the production build locally        |

Background dev (see `AGENTS.md`): `astro dev --background`.

## Related repos

- `Habemusfisio-ui` — authenticated dashboard
- `Habemusfisio-api` — backend API
