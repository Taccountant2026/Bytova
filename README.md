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

Online booking and verified live provider configuration remain enabled. HTTPS and redirects on https://bytova.co.uk/ were independently verified on 19 October 2026 after the owner enabled Enforce HTTPS. Search indexing is enabled for the production domain: the build emits canonical URLs, an allow rule and a 13-page sitemap; the custom 404 stays noindex.

The catalogue remains exactly three services at GBP25/GBP35/GBP29 with 30/60/60-minute appointments. No completed live customer booking, charge or refund was created during launch verification. See LAUNCH_EVIDENCE.md for the precise checks and limits.

## Production domain

The public website remains hosted on GitHub Pages at https://bytova.co.uk/. HTTP and the www hostname redirect to the secure root. The working GitHub DNS route is retained, and no registrar or mail DNS change was made during the final HTTPS verification.

A separate Sites copy was prepared while GitHub certificate issuance was stalled. The owner approved public access to that fallback, but the original domain recovered before any registrar edit. The domain has not moved to Sites. Keep any fallback copy out of search and do not replace the working website records without a new reason and owner instruction.
