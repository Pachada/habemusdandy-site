# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Owners and staff of small-to-mid businesses that work with appointments. Clinics lead the story (physiotherapy first); consultorios, studios and other appointment businesses are welcome. They work in Spanish, mostly self-serve. The job is to stop running the business from WhatsApp, paper, and a shared Google Calendar.

The public site speaks to the owner as `tú` and calls the people they serve `clientes`. Clients are not dashboard users. `/clinicas` keeps clinic wording (`clínica`, `pacientes`).

## Product Purpose

Horaya is the operating system of a business that works with appointments. It carries the visit past “someone picks a time”: client record, intake, services, clinical notes, hours, and staff administration.

Success for the marketing site is an owner who understands that promise and starts in the panel. Signup and login stay on `https://app.horaya.mx`. This repo does not authenticate, hold org context, or call the product API.

## Positioning

Calendly, Cal.com, and Koalendar stop when someone picks a time. Horaya continues into the visit: agenda, clients, and continuity between visits in one flow.

Working promise: tu negocio, en un solo lugar. Agenda, clientes, formularios e historial clínico, sin el ida y vuelta.

## Operating Context

The owner evaluates Horaya against WhatsApp, paper, and a shared calendar, not against a meeting scheduler. The next step after a marketing button is the panel at `app.horaya.mx`. Signup creates an account. It cannot receive a plan from this site. The plan is chosen in the panel.

Gratis covers essential operation: weekly agenda and appointments, clients and records, notes for each visit, services and hours. Equipos (API plan id `business`) adds per-seat price, intake forms, roles, integrations, automations, and reports. Empresas is contact-only accompaniment on top of Equipos, not a third API plan.

Launch prices, already published on the site: Equipos list `$249 MXN` per seat per month, or `$199 MXN` per seat per month billed annually. Launch promo `$199 MXN` per seat per month, or `$149 MXN` per seat per month billed annually as `$1,788 MXN` per seat per year.

## Capabilities and Constraints

- Spanish is the default copy. Match dashboard nouns: Citas, Clientes, Formularios.
- Do not claim a feature the app does not ship. Intake forms, team roles, calendar integrations, email/SMS automations, and reports are on Equipos and Empresas, not on Gratis. Say that in the present tense. Do not mark them `Próximamente`.
- Do not claim “sin tarjeta”, a setup time, a refund, a certification, or a metric that is not real.
- Do not invent logos, ratings, testimonials, or customer counts. Testimonials need a name, business, city, and permission. Until then, the proof blocks stay empty.
- “Tus datos siguen siendo de tu negocio.” Isolation (`Datos aislados por negocio`), no client panel (`Tu cliente no tiene panel`), and no selling of lists are the trust lines already published. `/clinicas` keeps the clinic versions. The mechanism pages are `/seguridad`, `/privacidad`, and `/terminos`.
- The brochure site (home, `/producto`, `/precios`, `/seguridad`) keeps its header. The campaign route `/clinicas` is a separate ad landing and is not in that header.
- No live ad creative is in the repo. The line to match is the site’s own promise: fuera del chat y del calendario compartido.
- No analytics cookies. Measurement of this landing is not installed.

## Brand Commitments

Name: Horaya. Wordmark reads Horaya.mx. Voice: short sentences, concrete nouns, owner as `tú`. Contact: `hola@horaya.mx`.

Visual system already in the site: Outfit, ink `#171717`, paper `#fafaf8`, brand `#1769e0` for primary actions and focus, soft shadow rather than borders, luxury refined minimalism shared with the product. The campaign landing inherits that system. It does not introduce a second brand.

## Evidence on Hand

- Product UI frames in `src/components/ProductFrame.astro`. Names inside those frames are interface demonstrations, not signed customers.
- Prices and plan cuts in `src/config/site.ts`.
- Trust and legal copy on `/seguridad`, `/privacidad`, `/terminos`, and the pricing FAQ.
- No customer logos, reviews, case studies, or certified badges.

## Product Principles

- Show the visit, not a generic scheduler.
- One self-serve action, `Comenzar gratis`, always to the panel signup. Empresas may use a quiet mailto. The plan is chosen in the panel.
- Publish only what the owner can check or the product already does.
- Price is part of the offer. Say per seat and per month out loud, including the annual figure.
- The brochure and the ad landing do different jobs. Do not make the home page carry the campaign’s single-purpose rules.

## Accessibility & Inclusion

Public pages are Spanish, keyboard reachable, and built as static HTML. The campaign landing is designed for a phone first. No separate accessibility standard was set beyond that.
