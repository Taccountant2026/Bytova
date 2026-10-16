# Bytova Website — GitHub preview
This is the **existing Bytova repository**, redesigned in place to follow the current Shopify website: the photographic hero with Home/Business pathways, About Leighton, navy/cyan trust strip, featured-service carousel, four-step support process, service links, reassurance, FAQs and footer. All eight pages share the updated navigation, typography and branding.

The owner's newly uploaded logo is stored as `assets/Bytova_Logo.png`. Its original bytes were AVIF despite the PNG filename; it has been re-encoded as a valid PNG without visual changes. Photographs, service graphics and Inter fonts are local, with their original URLs recorded in `assets/SOURCES.md`. The Pages workflow includes the full assets directory.

**Important:** `https://bytova.co.uk/` is currently a separate, live Shopify store. Pushing to this GitHub repository **does not update Shopify** and does not switch the domain. This GitHub site remains a `noindex` preview while legal, checkout and deployment requirements are reviewed.

## Working external destinations
- Remote Computer Help: `https://calendly.com/leighton-hepworth22/bytova-remote-computer-help`, £25 / 30 minutes
- PC Speed-Up: `https://calendly.com/leighton-hepworth22/bytova-pc-speed-up`, £35 / 60 minutes
- Windows Security Check: `https://calendly.com/leighton-hepworth22/bytova-windows-security-check`, £29 / 60 minutes
- Live Shopify product catalogue: product cards link to their corresponding live Shopify product pages. Digital guides open Shopify checkout, **not Calendly**.
- Contact: `https://bytova.co.uk/pages/contact`. Do not collect passwords or card details on GitHub Pages.

## Checks
Run `npm run check && npm test`. CI also performs these checks before the GitHub Pages preview deployment. The featured carousel supports arrow buttons, keyboard arrows and touch scrolling; mobile navigation supports Escape and outside-click dismissal. Animations respect reduced-motion preferences. Newsletter signup, store search, accounts and baskets open the existing Shopify website.

## Launch gates
- Confirm booking provider live payment and appointment confirmation end-to-end (not assumed by an outbound link).
- Verify prices, service scopes and legal pages; some existing terms/privacy text remains provisional.
- Check responsive layout, keyboard navigation, accessibility, links and all customer flows manually.
- Obtain owner confirmation before changing DNS, replacing Shopify or removing preview noindex.
- This repo contains no Stripe secret keys and no standalone checkout backend.
