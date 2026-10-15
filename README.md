# Bytova Website — GitHub preview
This is the **existing Bytova repository**, redesigned in place with the supplied Shopify theme as a visual reference (navy/cyan, hero, Home/Business split, service cards, mobile navigation). The owner's uploaded Bytova JPEG logo is stored as `bytova-logo.jpg`.

**Important:** `https://bytova.co.uk/` is currently a separate, live Shopify store. Pushing to this GitHub repository **does not update Shopify** and does not switch the domain. This GitHub site remains a `noindex` preview while legal, checkout and deployment requirements are reviewed.

## Working external destinations
- Remote Computer Help: `https://calendly.com/leighton-hepworth22/bytova-remote-computer-help`, £25 / 30 minutes
- Live Shopify product catalogue: product cards link to their corresponding live Shopify product pages. Digital guides open Shopify checkout, **not Calendly**.
- Contact: `https://bytova.co.uk/pages/contact`. Do not collect passwords or card details on GitHub Pages.

## Checks
Run `npm run check && npm test`. CI also performs these checks before the GitHub Pages preview deployment.

## Launch gates
- Confirm booking provider live payment and appointment confirmation end-to-end (not assumed by an outbound link).
- Verify prices, service scopes and legal pages; some existing terms/privacy text remains provisional.
- Check responsive layout, keyboard navigation, accessibility, links and all customer flows manually.
- Obtain owner confirmation before changing DNS, replacing Shopify or removing preview noindex.
- This repo contains no Stripe secret keys and no standalone checkout backend.
