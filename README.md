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

- The booking page lets visitors choose one service and opens a real, prefilled email enquiry. It does not submit a form or claim to send email itself.
- Online Calendly checkout is deliberately gated off until live payment processing is verified. The configured URLs preserve the three existing Calendly event slugs, although event titles and descriptions have been updated.
- If both booking gates are enabled, the calendar still loads only after an explicit opt-in. Changing services or withdrawing the opt-in removes the iframe and resets consent. A direct provider link and no-JavaScript fallback are available with the privacy notice.
- Cancellation and early-start requests use email templates. The website does not store consent, confirm appointments or send automated messages.

## Source and checks

Edit `site.config.json` for verified business details, service scope, prices, booking mappings and launch flags. Edit `scripts/build.mjs` for page structure and copy, then run:

```sh
npm run build
npm run check
npm test
```

The build writes 14 HTML pages and `robots.txt`. The check rejects stale generated content and missing local files/anchors. Tests cover the three-service catalogue, every gate combination, approved booking endpoints, privacy behavior, contact routes, cancellation wording and accessibility basics. `site.css` and `site.js` are maintained directly.

## Current release state

`onlineBookingEnabled`, `livePaymentsVerified` and `indexable` are all `false`. Customers can email to arrange support; the website does not expose an active payment route. Live Stripe checkout has not been verified. Do not change both booking gates to `true` until that verification is complete.

The existing public GitHub Pages audience is preserved. No DNS, domain, mail records or existing live-domain routing have been changed. See `LAUNCH_EVIDENCE.md` for completed work and the remaining launch dependencies.
