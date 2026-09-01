# Repository Guidelines

## Project

Kintook Site is the public marketing frontend (home, product, pricing). It is a separate Astro project from the clinic dashboard (`Habemusfisio-ui`).

## Required Context

- Read [`docs/SITE.md`](docs/SITE.md) before adding pages, sections, or marketing copy. It is the source of truth for structure, positioning, and look.
- Keep this site visitor-facing and static. Do not add authenticated dashboard features, API clients, or org/session logic here.
- Match Kintook brand: Outfit typeface, luxury refined minimalism, shadow over border, soft accents.
- Spanish is the default copy language, matching the product UI.
- Link into the dashboard for login and signup; do not reimplement those flows.

## Structure

- `docs/SITE.md` — marketing IA, sections, and visual baseline
- `src/pages/` — file-based routes
- `src/layouts/` — shared HTML shell
- `src/components/` — reusable Astro components
- `src/styles/` — global CSS and brand tokens
- `public/` — logos and other static assets
- `infra/` — AWS CDK (S3 + CloudFront + GitHub OIDC), production only
- `.github/workflows/` — CI, app deploy, infra deploy

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build
