# Horaya plans proposal

Status: **proposal, not live.** Written 2026-10-25 for the marketing site, UI (`Habemusfisio-ui`) and API (`Habemusfisio-api`) work. The site will not publish these plans until the API and UI ship them (see "Rollout order").

All prices are in MXN and **include IVA** (16%).

## The plans

| | **Gratis** | **Profesional** (new) | **Equipos** | **Empresas** |
| --- | --- | --- | --- | --- |
| API plan id | `personal_free` | `professional` (new) | `business` | `business` + sales agreement |
| Price | $0, no end date | $199 / month, or $149 / month billed annually ($1,788 / year) | Launch: $199 / month, or $149 / month billed annually, held for 12 months. Then list $299, or $249 / month billed annually | Custom |
| Billed per | — | 1 practitioner | Practitioner. Admin and reception seats are free | Agreement |
| For | Trying it, light use | Someone who works alone and wants fewer no-shows | Businesses with 2+ practitioners | Multiple locations, special needs |
| Agenda, appointments | ✓ | ✓ | ✓ | ✓ |
| Public booking link | ✓ | ✓ | ✓ | ✓ |
| Services and hours | ✓ | ✓ | ✓ | ✓ |
| Clients, records, visit notes | ✓ | ✓ | ✓ | ✓ |
| Intake forms | 1 basic form | Unlimited, branding, consent, signature | ✓ same as Profesional | ✓ |
| Email reminders | — | ✓ | ✓ | ✓ |
| SMS reminders | — | ✓ fair use while we measure | ✓ fair use | ✓ volume per contract |
| Google / Apple Calendar | — | ✓ | ✓ | ✓ |
| Reports | — | ✓ | ✓ | ✓ |
| Team, roles, invitations | — | — | ✓ | ✓ |
| Free admin and reception seats | — | — | ✓ | ✓ |
| Custom domain | — | — | ✓ once built | ✓ once built |
| Guided setup, dedicated support | — | — | — | ✓ |
| Commercial terms, advanced access | — | — | — | ✓ |

### What changes vs. today

- **Gratis gets smaller.** It keeps one basic intake form and loses calendar sync. Today neither is gated in the API.
- **Profesional is new.** One practitioner with reminders, forms, calendar sync and reports.
- **Equipos is billed per practitioner, not per login.** Admin and reception seats stop costing money, so clinics don't share one login. The list price rises after the 12-month launch window; early customers keep the launch price.
- **Empresas is unchanged.** It stays a sales label, not a separate API plan. Don't promise multiple locations as a feature until it is built.

### Open decisions

1. **Annual discount after launch.** $299 → $249 is ~17%. The site says −25% today ($199 → $149). Pick one figure for the post-launch list price.
2. **Fair-use SMS limit.** Number not set. Decide after 60–90 days of usage data.
3. **Gratis never expires.** Confirm this is the product rule; the site already says "Plan gratuito, no una prueba".
4. **Seat roles that are free.** Define which roles count as "admin and reception" (today's roles are Owner, Manager, Staff). Proposal: a practitioner is any member who can be booked; non-bookable members are free.
5. **"Insights con IA" in reports.** The site comparison table says it. Confirm it exists or drop it.

## Feature gating

`PlanEntitlements` today (`internal/domain/plan.go`): `MaxStaffSeats`, `CanInviteStaff`, `Workflows`, `Reports`, `CustomDomain`. Route checks exist only for reports and workflows (`RequirePlanFeature` in `internal/transport/http/router.go`).

| Entitlement | Gratis | Profesional | Equipos | Status today |
| --- | --- | --- | --- | --- |
| `max_staff_seats` (billable practitioners) | 1 | 1 | Unlimited | Exists. Counts every member, not practitioners |
| `can_invite_staff` | ✗ | ✗ (see note) | ✓ | Exists, enforced |
| `workflows` (email + SMS) | ✗ | ✓ | ✓ | Exists, enforced |
| `reports` | ✗ | ✓ | ✓ | Exists, enforced |
| `custom_domain` | ✗ | ✗ | ✓ | Exists, feature not built |
| `max_intake_forms` (new) | 1 | Unlimited | Unlimited | **Missing.** Forms are not gated |
| `form_branding_consent` (new) | ✗ | ✓ | ✓ | **Missing** |
| `calendar_sync` (new) | ✗ | ✓ | ✓ | **Missing.** Calendar sync is not gated |
| `sms_monthly_parts` (new, soft) | 0 | Fair use | Fair use | **Missing.** No usage tracking |

Note on Profesional and invitations: decide whether a solo practitioner can invite a free receptionist. If yes, `can_invite_staff` is ✓ but only for non-bookable roles.

## Work by repo

### API (`Habemusfisio-api`)

1. Add the `professional` plan to `planCatalog` with the entitlements above.
2. Add `max_intake_forms`, `form_branding_consent` and `calendar_sync` entitlements, and enforce them:
   - Creating a second form on Gratis returns a plan error.
   - Connecting Google / Apple Calendar on Gratis returns a plan error.
   - Decide what happens to existing Gratis orgs that already have several forms or a connected calendar (proposal: keep what exists, read-only for extra forms; block new ones).
3. Billing (Stripe): add Profesional prices (monthly and annual). Change Equipos quantity to count bookable practitioners only.
4. SMS usage: record parts and USD cost per message in workflow delivery history, aggregate per org per month. Alert at 50% and 80% of the AWS SNS monthly spend limit.
5. Plan error responses: a stable error code (e.g. `plan_feature_required` with the feature name) so the UI can show the right upgrade prompt.

### UI (`Habemusfisio-ui`)

1. Plan picker and billing screens: show Gratis, Profesional and Equipos with the prices above. Empresas stays a contact link.
2. Upgrade prompts where the API now blocks: second intake form, form branding / consent / signature, calendar connection, workflows, reports, inviting staff.
3. Seats: show which members are billable (practitioners) and which are free.
4. Workflow editor: live character and SMS part counter, with a warning that accents and ñ shrink a part to 70 characters.
5. Existing Gratis orgs over the new limits: a notice explaining what stays and what needs Profesional.

### Marketing site (`habemusdandy-site`)

1. `/precios`: four plan cards (Gratis, Profesional, Equipos, Empresas), updated comparison table and pricing FAQ.
2. `src/config/site.ts`: pricing config for Profesional, FAQ answers that name Profesional.
3. Home pricing preview and `/clinicas`: show the new plan cut.
4. `docs/SITE.md` and `PRODUCT.md`: plan rules, prices, and what each plan claims.
5. Terms: a fair-use line for SMS.

## Rollout order

1. API: entitlements, the `professional` plan, Stripe prices, SMS usage tracking.
2. UI: plan picker, upgrade prompts, seat display, SMS counter.
3. Site: publish the new plans **only after 1 and 2 are in production.** The site rule is to never claim a plan or feature the app doesn't ship.
4. Existing customers: email Gratis orgs that use more than one form or calendar sync before the limits apply.

## Later features and their plan

| Feature | Plan |
| --- | --- |
| WhatsApp reminders with confirm / cancel reply (default channel, SMS as fallback) | Profesional and up |
| Online payment or deposit at booking | Profesional and up |
| Session packages (bonos) | Profesional and up |
| No-show rate in reports | Profesional and up |
| CFDI invoicing | Equipos and up, or paid add-on |
| Multiple locations | Empresas |

## Why

- **Solo practitioners have no reason to pay today.** Gratis covers almost everything, and most physios work alone.
- **Reminders are what people pay for.** They cut no-shows, the one benefit an owner can measure in pesos.
- **Charge per practitioner.** Charging for reception pushes clinics to share one login.
- **SMS is expensive.** An SMS to Mexico costs $0.10 USD per part, and Spanish accents cut a part to 70 characters. One reminder is often 2–3 parts (~$3.70–5.50 MXN). At ~150 appointments a month, SMS alone can cost more than the seat. Keep it included while we measure, with fair use in the terms.
