# HabemusDandy marketing site — baseline

This is the source of truth for information architecture, sections, and look of the public site. It is inspired by [Calendly](https://calendly.com/?redirect=false), [Cal.com](https://cal.com/es/), and [Koalendar](https://koalendar.com/), then brought down to **HabemusDandy**: clinic operations software, not a generic meeting scheduler.

Copy language: **Spanish**. Dashboard login/signup stay in `Habemusfisio-ui`.

---

## 1. What those three sites actually do

They sell different brands, but the **page machine** is the same.

| Pattern | Calendly | Cal.com | Koalendar |
| --- | --- | --- | --- |
| Promise | Scheduling is simple, at any scale | Customizable scheduling infrastructure | Smart scheduling, forever free |
| Hero | One line + dual CTA + product UI | One line + dual signup + live booking widget | One line + “no card” + product UI |
| Proof | Fortune 500 / 100k orgs | Fast-growing company logos | 10k+ professionals, store ratings |
| How it works | 5-step product walkthrough | 3 numbered steps | “Ready in minutes” |
| Features | Benefit + screenshot, then integrations | Deep feature grid + reminders | Feature clusters + verticals |
| Pricing | Homepage teaser + `/pricing` matrix | Homepage light, `/pricing` heavy | Homepage comparison table |
| Trust close | Case-study metrics, security | Testimonials, FAQ, HIPAA/SOC | Reviews, professions, FAQ-ish chat |
| CTAs | Start free + Get a demo | Comienza + Habla con ventas | Start free (self-serve first) |

Shared chrome, every time:

- Sticky header: logo, product, pricing, login, primary CTA
- Dual CTAs: self-serve vs sales (Calendly/Cal). Koalendar leans self-serve.
- Homepage as a **story**, not a dump of features
- Product UI in the hero (the site *shows* the tool)
- Footer as a sitemap
- Repeated “start now” band before the footer

What we **do not** copy:

- Calendly’s “for every meeting in the Fortune 500”
- Cal.com’s open-source / developer / self-host story
- Koalendar’s koala-mascot warmth and “every profession” grid (sales, barbers, photographers…)
- Fake logos, invented metrics, or competitor comparison tables until we have real numbers

What we **do** take:

- Calendly’s calm, spacious, enterprise-quiet layout
- Cal.com’s “show the real product” hero and a short how-it-works
- Koalendar’s plain-language benefits and a pricing page that is scannable
- All three: homepage teaser → dedicated `/precios`, features on homepage → dedicated `/producto`

---

## 2. Our positioning

HabemusDandy is the **operating system of the clinic**, not a booking link.

Calendly / Cal / Koalendar stop at “someone picks a time.” We continue into the visit: client record, intake, services, clinical notes, hours, automations.

**Audience:** owners and staff of small-to-mid clinics (physio first, other practices later). Spanish-speaking, self-serve.

**Job to be done:** stop running the practice from WhatsApp, paper, and a shared Google Calendar.

**Promise (working):**
*La clínica, en un solo lugar.*
Agenda, clientes, formularios e historial clínico — sin el ida y vuelta.

**Not this:** “The smartest way to schedule meetings.”
**This:** “The clinic runs itself while you treat.”

Three product pillars (homepage and `/producto`):

1. **Agenda** — hours, services, appointments, calendar sync
2. **Clientes** — records, intake forms, reminders / workflows
3. **Clínica** — notes, continuity of care, staff admin

If a section does not serve one of those pillars, it does not belong on v1.

---

## 3. Site map

Keep the first version small. These sites look large in the footer; their **conversion path** is three pages plus auth.

```text
habemusdandy.com                    marketing (this repo)
app.habemusfisio.com                dashboard (Habemusfisio-ui)

/                   Home
/producto           Product / features
/precios            Pricing
/seguridad          Privacy & trust (short)
/login              → app login
/signup             → app signup (or login while signup is gated)

Legal (footer only, later): /privacidad, /terminos
```

Out of v1: blog, use-case microsites, careers, changelog, “vs Calendly”, comparison tables, chatbot.

```mermaid
flowchart LR
  subgraph marketing [Marketing site]
    Home --> Producto
    Home --> Precios
    Producto --> Precios
    Home --> Signup
    Precios --> Signup
  end
  Signup --> App[Dashboard app]
  Home --> Login --> App
```

---

## 4. Global chrome

### Header (sticky, light)

| Left | Center | Right |
| --- | --- | --- |
| Logo wordmark | Producto · Precios | Iniciar sesión · **Comenzar** |

- `Comenzar` is the only filled button (brand `#316dff`).
- `Iniciar sesión` is text. Same dual-path as Calendly, without a “Talk to sales” until we have sales.
- On mobile: logo + Comenzar; the rest in a simple drawer. Do not copy mega-menus.

### Footer

Four columns, quiet:

1. Producto, Precios, Seguridad
2. Iniciar sesión, Comenzar
3. Privacidad, Términos (placeholders until legal exists)
4. Short brand line + email

No 40-link Cal.com footer. No social proof wall in the footer.

### Dual CTA rule

Every major band ends with **Comenzar**. Secondary link is **Ver precios** or **Ver producto**, never a second competing primary.

---

## 5. Home (`/`) — section by section

This is the page that has to work alone. Order is the conversion story, not the org chart.

### 5.1 Hero

- Eyebrow (optional, tiny): `Para clínicas`
- H1: one line. Working: `La clínica, en un solo lugar.`
- Sub: two lines max. Working: `Agenda, clientes y notas clínicas sin WhatsApp ni papel. Tú atiendes; el sistema recuerda.`
- CTAs: `Comenzar` + `Ver producto`
- Trust line under buttons: `Sin tarjeta · Configuración en minutos` (drop “sin tarjeta” if billing requires one)
- **Visual:** framed screenshot of the real agenda (Cal.com pattern), on the `#f8f9fa` paper background. No isometric 3D, no mascot, no stock “happy clinic” photography.

### 5.2 Logo / proof strip

A single quiet line, then 4–6 marks **only when real**. Until then, skip this section rather than inventing “trusted by.”

Optional later: a metric row *only with real data* (citas, clínicas, no-show drop). Koalendar’s “10M+ classes” pattern is useful; fake numbers are not.

### 5.3 Problem

Three short columns. Pain the owner already feels:

| WhatsApp y papel | Huecos y ausencias | La historia se pierde |
| --- | --- | --- |
| La agenda vive en chats y cuadernos | Huecos, dobles reservas, nadie confirma | Cada visita empieza de cero |

No icons soup. Small brand-tint marks or nothing. Headline: `Deja de improvisar la operación.`

### 5.4 How it works (Calendly walkthrough, three steps)

Numbered 01–03. Each step: title, one sentence, a small UI fragment.

1. **Define horario y servicios** — cuándo atiendes y qué ofreces
2. **Recibe la cita y el ingreso** — el cliente reserva; el formulario llega antes
3. **Atiende con contexto** — ficha, notas, siguiente sesión

This is our version of Calendly’s “connect calendar → availability → share link.” We do not stop at the link.

### 5.5 Product pillars (alternating feature bands)

Three large bands, screenshot left/right alternating, generous whitespace (Calendly), real UI (Cal.com).

1. **Agenda que respeta tu horario**
   Horario, servicios, citas, sincronización de calendario.
   *Borrowed beat:* “no double bookings.”

2. **Clientes con historia, no solo un nombre**
   Ficha, ingreso, recordatorios.
   *Borrowed beat:* Koalendar’s “collect the right details before the visit.”

3. **Notas y seguimiento en el mismo sitio**
   Continuidad clínica, no un PDF suelto.
   *This is the wedge those three tools do not have.*

Each band: H2, one paragraph, 3 bullets, link `Ver producto`.

### 5.6 Feature mosaic (optional, short)

A 2×3 grid of smaller capabilities, Koalendar-style but clinic-specific. Only ship what exists in the app today:

- Horario de la clínica
- Servicios y duración
- Formularios de ingreso
- Workflows / recordatorios
- Integración de calendario
- Equipo y roles

If a tile would be “coming soon,” omit it.

### 5.7 Integrations

One row: Google Calendar, and any other live integration. Headline: `Se conecta con lo que ya usas.`
Do not show Zoom/Salesforce/Zapier just because Calendly does.

### 5.8 Pricing teaser

Three plan cards: **Gratis**, **Equipos** (`$249/mes` or `$200/mes` with annual payment), and **Empresas** (contact sales). Equipos is recommended. Link to `Ver precios`; do not publish competitor comparison tables.

### 5.9 Testimonials

Two or three quotes max, with name, clinic, city. Empty until real. Do not use Cal.com’s scrolling wall of tweets.

### 5.10 FAQ (5–7 questions)

Cal.com/Calendly close. Draft:

1. ¿Es solo para fisioterapia?
2. ¿Mis pacientes necesitan una cuenta?
3. ¿Se sincroniza con Google Calendar?
4. ¿Puedo usar mis propios formularios?
5. ¿Qué pasa con los datos de los pacientes?
6. ¿Puedo empezar gratis?
7. ¿Funciona en el celular?

Answers: two to four sentences. Link `/seguridad` from the data question.

### 5.11 Closing CTA

Full-width, paper or very light brand wash.
H2: `Empieza a ordenar la clínica.`
Buttons: `Comenzar` + `Ver precios`.

---

## 6. Producto (`/producto`)

Calendly `/features` shape: hero, then grouped capabilities, then CTA. Not a second homepage.

**Hero:** `Todo lo que la clínica necesita para operar.` + `Comenzar`

**Groups** (match the dashboard, not a scheduler feature list):

1. **Agenda** — citas, horario, servicios, calendario
2. **Clientes** — fichas, ingreso, consentimiento
3. **Clínica** — notas, historial, continuidad
4. **Automatización** — workflows, recordatorios
5. **Equipo** — roles, administración
6. **Integraciones** — only live ones

Each group: H2, short intro, 4–6 items (title + one line). One screenshot per group, not per item.

Close with the same CTA band as home.

---

## 7. Precios (`/precios`)

Calendly `/pricing` shape, Koalendar scannability, our plans.

1. H1: `Un plan por clínica, no por caos.`
2. Billing toggle when it exists
3. Plan cards (audience label, price, 5–8 bullets, CTA)
4. Feature comparison table (rows grouped: Agenda, Clientes, Clínica, Equipo)
5. FAQ (seats vs clinic, trial, invoices, what happens if you cancel)
6. Closing CTA

Do not add “vs Calendly / Cal.com / Koalendar.” Different category; that table would confuse the buyer.

Plans: Gratis, Equipos (`$249/mes`, or `$200/mes` paid annually), and Empresas (contact sales).

---

## 8. Seguridad (`/seguridad`)

Short trust page (Calendly “built to keep you secure,” without enterprise theater).

- Who can see clinic data (tenant isolation, roles)
- What patients see (intake link, no dashboard)
- What we do not do
- Link to privacy policy when it exists

No SOC/HIPAA badges unless they are real.

---

## 9. Look and feel

Luxury refined minimalism, same family as the dashboard — marketing is allowed to use real titles and a larger hero.

| Token | Value |
| --- | --- |
| Type | Outfit |
| Ink | `#171717` |
| Muted | `#6b6b68` |
| Paper | `#fafaf8` |
| Surface | `#ffffff` |
| Brand | `#1769e0` — primary actions and focus only |
| Depth | Soft shadow, no card borders |
| Radius | Medium, same as product |
| Motion | Fade/slide on scroll, respect `prefers-reduced-motion` |

**Closer to Calendly than Koalendar:** lots of air, typography hierarchy, product shots on paper, and an editorial monochrome shell. Color comes from product UI, icons, motion states, and restrained primary actions.
**Closer to Cal.com than Calendly:** the screenshot *is* our app, not an illustrated metaphor.
**Not Koalendar:** no mascot, no rainbow of vertical cards, no “free forever” personality unless that is the real offer.

Rules:

- One H1 per page
- Section labels are small + muted; section titles are large + light-to-medium weight
- Primary button once per band
- Status and proof use dots / quiet text, not filled badges
- No hardcoded one-off colors; CSS variables only
- Static HTML first. JS only for header drawer, pricing toggle, FAQ accordion

---

## 10. Voice

- Address the clinic owner: `tú`
- Concrete nouns: cita, ficha, horario, inasistencia — not “sinergias”
- Short sentences. One idea per heading
- Spanish from Spain/LatAm-neutral; match dashboard copy (`Citas`, `Clientes`, `Formularios`)
- Never claim a feature the app does not ship

---

## 11. v1 vs later

**v1 (this repo, now)**

- Chrome (header/footer)
- Home with all sections except empty proof/testimonials (omit if empty)
- `/producto`, `/precios` (structure), `/seguridad` (short)
- CTAs pointing at the app

**Later**

- Real logos, quotes, metrics
- Sales / demo CTA
- Legal pages
- Blog or guides
- Extra locales
- Comparison or “vs” pages only if we compete with clinic software, not with Calendly

---

## 12. Implementation notes

- Astro pages, shared `BaseLayout`, CSS variables in global styles
- Product shots: real dashboard captures (light scheme), lightly framed
- `Comenzar` / `Iniciar sesión` are absolute URLs to the app origin (env)
- No auth, no org context, no API client in this repo
