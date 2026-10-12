# Deployment and launch gates

The current GitHub repository is a **development preview** and is public. The original Shopify website remains authoritative and unchanged.

## Pre-launch verification
1. Obtain and apply original Bytova logo, typefaces, colours and verified business details from the current Shopify site. Do not guess identity or claim the temporary CSS is the approved brand.
2. Confirm final service pricing, scopes, remote access platform and contact method.
3. Confirm legal pages with verified controller identity, privacy processor details, UK consumer cancellation rights and complaints contact. Current terms and privacy pages are **pre-launch placeholders**.
4. Configure Calendly event hours and Stripe payment collection; confirm the provider supports payment-before-confirmation. Verify test payments, duplicate bookings, cancellations and BST/GMT transitions. Only then activate events.
5. Run automated accessibility, broken-link and responsive checks, followed by manual mobile, keyboard and screen-reader review.
6. Confirm GitHub Pages build settings, repository visibility and any custom domain; remove robots.txt indexing block only when public release is approved.
7. Obtain explicit approval before any DNS cutover or Shopify cancellation. Never commit credentials or publish test payment links as live.

## Local preview
Run a local static HTTP server in the repository root, e.g. `python -m http.server 8000`, then open `http://localhost:8000/`.

## Current limitations
The website's static pages are navigable, but payments, live booking, confirmation emails, remote session delivery, production hosting and legal signoff have **not** been verified. The final release therefore has more than two dependencies until those checks are completed.
