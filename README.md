# Bytova — three-service remote support website

A standalone, buildless public website with local branding, images and fonts. Customer pages use no store, account, cart, product download, subscription, analytics or marketing integration.

## The catalogue

| Service | Appointment | Total price |
| --- | --- | --- |
| Remote Tech Help | 30 minutes | £25 |
| Setup & Getting Started | 60 minutes | £35 |
| Computer Care & Safety Check | 60 minutes | £29 |

Each service has a detailed scope, exclusions, preparation instructions and a genuine email route to `hello@bytova.co.uk`. The same bounded scope applies to households, students, sole traders and small businesses. Services are remote only.

## Customer journeys

- The booking page lets visitors choose one service, opt in to use Calendly, select an available time and complete its Stripe payment step. A genuine email route remains available for suitability questions and booking help.
- Online Calendly checkout is enabled after verification of the live Stripe configuration and the actual public GBP prices/durations for all three events. The configured URLs preserve the three existing event slugs, while their titles and descriptions match the catalogue.
- Both booking gates are enabled; the calendar still loads only after an explicit opt-in. Changing services or withdrawing the opt-in removes the iframe and resets consent. A direct provider link and no-JavaScript fallback are available with the privacy notice.
- Cancellation and early-start requests use email templates. The website does not store consent, confirm appointments or send automated messages.

## Source and checks

Edit `site.config.json` for verified business details, service scope, prices, booking mappings and launch flags. Edit `scripts/build.mjs` for page structure and copy, then run:

```sh
npm run build
npm run check
npm test
```

The build writes 14 HTML pages, `robots.txt`, `sitemap.xml` and the domain `CNAME` file. The check rejects stale generated content and missing local files/anchors. Tests cover the three-service catalogue, every gate combination, approved booking endpoints, privacy behavior, contact routes, cancellation wording and accessibility basics. `site.css` and `site.js` are maintained directly.

## Current release state

`onlineBookingEnabled` and `livePaymentsVerified` are `true`; `indexable` remains `false` for the domain cutover. The live account configuration and actual public Calendly prices are verified. No real customer booking, completed charge or refund was created during verification, so a completed transaction is not claimed as tested.

The existing public GitHub Pages audience is preserved. No DNS, domain, mail records or existing live-domain routing have been changed. See `LAUNCH_EVIDENCE.md` for completed work and the remaining launch dependencies.

## Production domain

The intended domain is `https://bytova.co.uk/`. Domain preparation is checked in; GitHub Pages must also accept its Custom domain setting, followed by the website DNS changes. Indexing remains disabled until HTTPS and the customer journeys work on that domain. See `DOMAIN_CUTOVER.md` for the precise records, order and rollback values.
