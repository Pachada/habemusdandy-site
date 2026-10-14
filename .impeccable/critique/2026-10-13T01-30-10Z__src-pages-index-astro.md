---
target: homepage vs Manual de landing pages de venta
total_score: 20
max_score: 36
na_heuristics: 7
p0_count: 0
p1_count: 3
target_identity: "file:/Users/leinad/Documents/Projects/habemusdandy-site/src/pages/index.astro"
target_fingerprint: "sha256:0feeb65d7c1a2ed8bba18d93be2f05e47b32902287f1c2d1ce2e9ffd063b762e"
target_path: /Users/leinad/Documents/Projects/habemusdandy-site/src/pages/index.astro
timestamp: 2026-10-13T01-30-10Z
slug: src-pages-index-astro
---
Method: dual-agent (A: a623e958-f8cb-4e54-9fc3-e2dc5ab3e339 · B: 70c7aabf-a32c-4200-9104-5af2ac055b64)

The sales manual is a 10-block argument in a fixed order. The homepage is a clinic story that asks for signup early and shows the price late. The story is specific. The selling sequence is not finished.

## Still needed, against the manual

Current order: Hero → Problema → Visita → Cómo empezar → Bento → Integraciones → Precios → FAQ → Cierre.

Manual order: Hero → Barra de confianza → Oferta con precio → Problema→beneficio → Cómo funciona → Prueba social → Valor y comparativa → Garantías → FAQ → CTA final + botón fijo.

| Block | Status | What is on the page | The gap that still matters |
|---|---|---|---|
| 01 Hero | Partial | “Para clínicas.” H1 “La clínica, en un solo lugar.” Subtitle about agenda, formularios, fichas y notas. “Comenzar gratis” and “Ver una visita.” Trust line “Plan gratuito · Configuración en minutos.” Product panel. | One result-verb button, a fear line under it, and no second action competing in the first screen. The header still offers Producto, Precios, and Iniciar sesión. That nav is a site choice. “Ver una visita” is the extra action. |
| 02 Barra de confianza | Blocked | No proof strip. `docs/SITE.md` says skip logos and metrics until they are real. | No client count, years, rating, or third-party mark can be published. A slogan in that slot would fail the manual’s own rule. |
| 03 Oferta con precio | Partial | Three real plans, late. Gratis $0. Equipos launch $199 MXN / asiento / mes over a struck $249, annual launch $149 MXN / asiento / mes billed as $1,788. Empresas “A medida.” | Price is the eighth chapter. The lead says “{annual} si pagas anual” and can be read as a yearly total. Buttons disagree: “Comenzar gratis”, “Comenzar”, “Contactar a ventas”. All signup buttons open the same panel URL, and the plan is chosen inside the panel. |
| 04 Problema → beneficio | Partial | “Hoy la clínica se arma en el chat.” Three cases in the owner’s words. The payoffs live in the visit remates. | Each pain is not closed in place with a result title and the proof of how Horaya does it. The benefit is a later chapter, and it sits before the price. |
| 05 Cómo funciona | Partial | “Empezar no debería tomar una semana.” 01 horario, 02 servicios, 03 formulario de ingreso. | No step has a time the business can always meet. The steps are setup, not what happens after “Comenzar gratis.” Step 03 is a paid capability. |
| 06 Prueba social | Blocked | No quotes. The spec keeps this empty until name, clinic, and city are real. | No signed clinic, no before/after, no sourced rating. “Ana Rojas” and “Sofía P.” are interface fiction inside the product frames. |
| 07 Valor y comparativa | Partial | Plan versus plan, with an annual toggle and Equipos bullets. | The buyer’s real alternative is WhatsApp, paper, and a shared calendar. That comparison is not on the page. Named competitor tables stay out. The button does not carry the price. |
| 08 Garantías | Missing | Under the cards: “Datos aislados por clínica”, “El paciente no tiene panel”, “No vendemos listas.” | None of these say what the owner keeps if they leave, and no signup button sits on a mechanism. “¿Qué pasa con mis datos si dejo de usarlo?” exists only on `/precios`. |
| 09 FAQ | Partial | Seven real questions. The first open item is why leave WhatsApp and Calendar. The last is whether they can start without paying. | Money and risk are not first. Answers 1–3 do not open with sí or no. The data-if-you-leave answer is on the pricing page. |
| 10 CTA final + botón fijo | Partial | “Empieza con la próxima cita.” “Comenzar gratis” and “Ver precios.” Footer has email and privacy. | No fixed mobile button. The close adds a second button. The only risk line on the band is “Plan gratuito para comenzar.” |

### Four principles

1. **Un solo objetivo.** The site chose a multi-page header. Conversion still leaks because Equipos, Empresas, the hero, the bento, and the calendars add more verbs than that choice requires.
2. **Message match.** Title, H1, and meta description agree with each other. No live ad is in the repo to match. The line a paid click would need to see again, “fuera del chat y del calendario compartido”, is the subtitle.
3. **Confianza antes de pedir.** “Comenzar gratis” is in the header and the hero, before price and before any proof. The early button and the Equipos button are the same signup.
4. **Primero celular.** The drawer, 2.75rem targets, and stacked cards exist. The fixed thumb control is the cookie “Aceptar”, in brand blue. The visit is four near-screens below 860px. The price is many thumbs down.

### Can be done in design and copy now

- Repeat “Comenzar gratis” on every signup, including the Equipos card. Leave “Contactar a ventas” as the quiet mailto it already is.
- Put the true launch line high, with “por asiento” and “al mes” on both $199 and $149. Move the three cards up, before the bento and the calendars.
- One primary button in the hero. “Ver una visita” becomes a text link.
- After the first scroll on small screens, fix “Comenzar gratis” to the bottom, clear of the cookie.
- Close each of the three pains with the remate already written for that scene.
- Rewrite “Cómo empezar” as the path after the click. Take the paid form out of the step title. Delete “Configuración en minutos” until a duration is real.
- Open the FAQ on “¿Puedo empezar sin comprometerme a pagar?” and “¿Dónde quedan los datos de mi clínica?” Bring “Tus datos siguen siendo de tu clínica.” onto the homepage, next to the close.
- Repeat the three true `/seguridad` lines under the hero and on the navy band.
- Say “Formularios de ingreso: en Equipos y Empresas.” before the ingreso mock, not under it.
- Restyle cookie “Aceptar” so it is not a second primary button in the thumb zone.
- On small screens, let the four visit chapters size to their content.

### Held by the multi-page choice

Producto, Precios, Iniciar sesión, and links to `/producto`, `/precios`, and `/seguridad` stay. The manual’s “no menu, no exit links” box stays empty on purpose unless this homepage becomes a campaign landing.

### Blocked until the business has proof

- Any client count, years, Google rating, logos, or certifications.
- Testimonials with name, clinic, city, and a signed release.
- A refund, a cancel window, or any “what you get back” promise that is not already true.
- A setup time the team can always meet.
- Message match against a live ad.
- Installed measurement. The cookie notice says there is no analytics. Scroll depth, button clicks, and a sub-3-second load were not measured in this run.

## Design Health Score

Persuade surface. Heuristic 7 is n/a. Heuristic 10 is scored because the FAQ is the help.

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | The loader covers the first paint, and Equipos “Comenzar” does not confirm that a plan was chosen. |
| 2 | Match System / Real World | 3 | Clinic Spanish is fluent. “Owner, Manager o Staff” and “asiento” still need a plain gloss. |
| 3 | User Control and Freedom | 3 | Escape closes the drawer and a click stops the visit. Below 860px the visit is four tall chapters with no skip. |
| 4 | Consistency and Standards | 2 | The same signup is labeled “Comenzar gratis”, “Comenzar”, and “Contactar a ventas”. |
| 5 | Error Prevention | 2 | The hero shows “Ingreso completo” and “Nota lista” before the page says formularios are paid. Signup cannot carry the plan. |
| 6 | Recognition Rather Than Recall | 2 | Paid limits are 0.8rem footnotes after the picture. |
| 7 | Flexibility and Efficiency | n/a | A first marketing visit does not need shortcuts or a second expert path. |
| 8 | Aesthetic and Minimalist Design | 2 | The shell is quiet. The visit is told three times before the price. |
| 9 | Error Recovery | 2 | “El plan lo eliges en el panel.” names the mismatch and leaves it on the next site. |
| 10 | Help and Documentation | 2 | The FAQ is real. It opens on positioning. Money is last. Leaving-the-product is on `/precios`. |
| **Total** | | **20/36** | **Acceptable (56%)** |

## Design Specificity Verdict

**LLM assessment.** Authored for this clinic. “¿Tienes el jueves a las 5?”, “Deja checo y te aviso”, “Sin respuesta · 2 h”, “Sesión 6 · finalizada”, and the Thursday 17:00 visit cannot be pasted onto a generic scheduler. The page machine around that story is the Calendly / Cal.com / Koalendar pattern `docs/SITE.md` names on purpose: sticky header, dual CTA, feature bento, FAQ, navy close.

**Deterministic scan.** `impeccable detect` on `src/pages/index.astro`, `src/components`, and `src/layouts` exited 0 with `[]`. No rule counts, no file hits. The detector did not see the conversion gaps. Those are argument order, offer clarity, and missing proof, which this scan does not score. No false positives to dismiss.

**Visual overlays.** No browser automation tool is available in this session. No overlay was injected. No user-visible highlight exists. Fallback is the CLI scan plus source review.

## Overall Impression

The problem chapter is the page’s peak, and the visit answers it in the same nouns. Then the same visit is repeated as setup, as five tiles, and as two calendars, while footnotes withdraw ingreso, roles, and calendars onto Equipos. The price arrives after that valley, and the recommended card’s button does not say what it buys. The single biggest opportunity is to put the true offer and the true risk lines next to one repeated “Comenzar gratis”, and to leave the empty proof blocks empty.

## What's Working

- The problem stills are documentary. “Deja checo y te aviso” goes quiet, then “Sin respuesta · 2 h”. The ficha is empty on purpose. “Sesión 6 · finalizada” sits next to “Sin próxima” and “Plan no registrado”.
- The visit answers those lines. Chapter 01 remate: “Sin ‘deja checo y te aviso’.” Chapter 04 ends on “Plan registrado”.
- The Equipos number is real once you reach it: list $249, launch $199 MXN per seat per month, annual launch $149 per seat per month billed as $1,788, chip “Promoción de lanzamiento”, pill “Recomendado”. No invented logos, ratings, or quotes.

## Cognitive load

High. Six of eight checks fail.

- Single focus fails. The first desktop viewport offers Producto, Precios, Iniciar sesión, Comenzar gratis, and Ver una visita.
- Chunking fails. The bento is five scenes at once. Seven FAQ questions are equal triggers.
- Grouping passes. Problem cards, setup cards, plan cards, and FAQ rows are separate objects.
- Visual hierarchy fails after the hero. From “Hoy la clínica se arma en el chat.” downward, every section reuses the same large title.
- One thing at a time fails. The pricing band asks for Mensual or Anual and for Gratis, Equipos, or Empresas together.
- Minimal choices fails. First viewport: 5 actions. Pricing band: Mensual, Anual −25%, Comenzar gratis, Comenzar, Contactar a ventas, Comparar todos los planes, then three `/seguridad` links.
- Working memory fails. “Con eso, la próxima visita corre como la acabas de ver.” depends on the tour just scrolled. “Plan gratuito” has to be held until the $199 card revises it.
- Progressive disclosure fails on the phone. Below 860px the four visit chapters are forced open, each about a screen tall when the viewport is taller than 640px.

## Emotional journey

The opening is calm: “La clínica, en un solo lugar.” The peak is the problem chapter, the only place the owner is caught in the act. “El chat no es un sistema.” is the relief. The valley is the repeat: setup, bento, calendars, and the footnotes that pull ingreso, roles, and calendars back onto the paid plan. Price is the high-stakes moment and it arrives after that valley, with “El plan lo eliges en el panel.” under the recommended button. Data trust is three quiet links after the cards. The end, “Empieza con la próxima cita.”, is a strong last frame, and it closes on “Plan gratuito para comenzar” with no mechanism for what happens if the clinic leaves.

## Priority Issues

### [P1] The price and the free/paid cut arrive late, then blur

**Why it matters.** The hero says “Plan gratuito” and shows “Ingreso completo” and “Nota lista”. The visit shows “El ingreso llega con tiempo”. The paid limit is a footnote. A clinic owner can believe the pictured visit is included, and that “Comenzar” on Equipos bought Equipos. The section lead’s annual figure can be read as $149 for the year.

**Fix.** One true line under the hero actions, still with a single primary button: Equipos is $199 MXN / asiento / mes at launch, or $149 MXN / asiento / mes billed annually. The plan is chosen in the panel. Move the three cards to just after the visit, before the bento and the calendars. On chapter 02, put “Formularios de ingreso: en Equipos y Empresas.” above the mock.

**Suggested command.** `$impeccable clarify`

### [P1] The ask splits into several verbs, and the phone has no thumb button

**Why it matters.** The manual’s rule is one label, one destination, repeated, plus a fixed mobile button. Producto, Precios, and Iniciar sesión are a deliberate site choice. The leak is everything beyond that: “Ver una visita”, Equipos “Comenzar”, “Contactar a ventas”, “Ver todas las capacidades”, “Ver integraciones”, and “Ver precios” on the close. On a phone the persistent signup is in the header. “Aceptar” owns the bottom in brand blue.

**Fix.** “Comenzar gratis” on Gratis and on Equipos, since both open `https://app.horaya.mx/signup`. Keep “Contactar a ventas” as text. Demote “Ver una visita” to a text link. After the first scroll on small screens, fix one “Comenzar gratis” to the bottom, clear of the cookie. Restyle “Aceptar” off the primary color.

**Suggested command.** `$impeccable layout`

### [P1] Risk is a slogan, and the proof blocks are empty on purpose

**Why it matters.** “Plan gratuito · Configuración en minutos” is a self-awarded line. Blocks 02 and 06 cannot be filled with fake clinics. Nothing next to a signup button says what the owner keeps if they leave. The three true lines already exist under the cards. “Tus datos siguen siendo de tu clínica.” already exists on the pricing FAQ.

**Fix.** Move those three `/seguridad` links under the hero and repeat them on the navy band, next to “Comenzar gratis”. Add the data-stays sentence beside that button. Leave logos and quotes absent. Do not write a refund or a certification.

**Suggested command.** `$impeccable clarify`

### [P2] “Cómo empezar” answers the wrong question

**Why it matters.** The manual’s question is what happens after the click, who does it, and what the owner needs in hand. The page answers with configuration, no times, and a paid form as step 03. “Configuración en minutos” has no number the business has shown it can always meet.

**Fix.** Rewrite the three steps as the path after “Comenzar gratis”: open the panel, set horario and servicios, run the next visit from the ficha. Keep the paid form as a footnote. Delete “Configuración en minutos” until a duration is real.

**Suggested command.** `$impeccable clarify`

### [P2] On a phone, the visit and the cookie take the decision slot

**Why it matters.** Below 860px the four chapters each demand about a screen, so the price is far down. The cookie bar is fixed at the bottom. The loader is a full-page veil. Signup stays in the header.

**Fix.** Let the four chapters size to their content on small screens. Keep the cookie clear of the fixed signup. Show the H1 while the loader runs, or drop the veil once the hero has painted.

**Suggested command.** `$impeccable adapt`

## Persona Red Flags

**Jordan (first-timer clinic owner).** The eyebrow says “Para clínicas”, not fisioterapia. Two hero actions look equal. “Equipo y roles” says “Owner, Manager o Staff”. Equipos says “Recomendado”, then “Comenzar”, then “El plan lo eliges en el panel.” Chapter 02 shows the ingreso and only then the footnote that it is paid. The open FAQ is “¿Por qué usar una herramienta de gestión si ya tengo WhatsApp y Calendar?”

**Riley (stress tester).** “Ingreso completo” and “Nota lista” are on the first screen. “Formularios de ingreso: en Equipos y Empresas.” appears later, three times. “Configuración en minutos” has no clock. The section lead’s annual price omits “por asiento al mes”; the card includes it. Equipos “Comenzar” and Gratis “Comenzar gratis” share `appSignupUrl`. “Ana Rojas” and “Sofía P.” read as patients on a page with zero signed clinics. All three trust links go to the same `/seguridad` URL. The cookie text says there is no analytics.

**Casey (distracted mobile).** Signup is at the top. “Aceptar” is at the bottom. From the narrowest breakpoint the menu control is an icon and login is inside the drawer. Four visit chapters are each about one screen, so the price is many thumbs away. The hero stacks the panel under the headline, so the product can fall below the first screen. `.js .reveal` starts later blocks at opacity 0 until they intersect.

## Minor Observations

- FAQ answers 1 and 2 never open with “sí” or “no”. Answers 4, 5, and 7 do.
- “¿Qué pasa con mis datos si dejo de usarlo?” is in `pricingFaqItems`, not on the homepage.
- The footer line “El sistema operativo de la clínica.” is a second promise beside the H1.
- Integrations sit between the product story and the price, with “Incluido en Equipos y Empresas.”
- Desktop journey autoplay advances about every 6 seconds, one pass, and stops on “Seguimiento preparado”.
- Primary buttons add a CSS arrow via `::after`, so the visible label and the accessible name can diverge.
- The featured card’s brand glow is the one place blue is doing hierarchy work inside a three-card row. Keep it.

## Questions to Consider

- “Comenzar” and “Comenzar gratis” both open `https://app.horaya.mx/signup`, and the plan is chosen in the panel. What decision is the shorter label pretending to complete?
- She already flinched at “Sin respuesta · 2 h”. What true sentence belongs between that line and `$199 MXN / asiento / mes`?
- After four near-full screens of the visit on a phone, is “Ver una visita” still a preview, or the page?
