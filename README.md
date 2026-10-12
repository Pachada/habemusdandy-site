# Horaya Site

Public marketing site for [Horaya](https://horaya.mx): product, pricing, and other visitor-facing pages.

The clinic dashboard lives in a separate repo and stays on `https://app.horaya.mx`. This site is static and SEO-oriented.

## Stack

- [Astro](https://astro.build) + TypeScript
- Outfit typeface (self-hosted via `@fontsource/outfit`) and Horaya brand tokens

## Setup

```bash
cp .env.example .env
npm install
```

`PUBLIC_APP_ORIGIN` controls login/signup links (`/login`, `/signup`). Default: `https://app.horaya.mx`.

## Commands

| Command            | Action                                      |
| :----------------- | :------------------------------------------ |
| `npm install`      | Install dependencies                        |
| `npm run dev`      | Dev server at `http://localhost:4321`       |
| `npm run check`    | Type/content check (`astro check`)          |
| `npm run build`    | Production build to `./dist/`               |
| `npm run preview`  | Preview the production build locally        |

Background dev (see `AGENTS.md`): `astro dev --background`.

## Deploy

Static hosting is S3 + CloudFront in the Horaya account (`651694720404`),
domain `horaya.mx`, deployed with GitHub Actions over OIDC. See [`infra/README.md`](infra/README.md).

| Workflow | When |
| --- | --- |
| `ci.yml` | Pull requests |
| `deploy-prod.yml` | Push to `main` |
| `deploy-infra.yml` | Manual CDK |

## Related repos

- `Habemusfisio-ui` — authenticated dashboard
- `Habemusfisio-api` — backend API
