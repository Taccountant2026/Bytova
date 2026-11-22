# Bytova Remote Help — private, single-operator service

**Status: source implementation; not deployed or authorised to accept live payment.** This is a separate Cloudflare Worker + dedicated D1 database. The public Bytova website is presently hosted on GitHub Pages; GitHub Pages cannot run a Worker or D1 backend. Keep production domains, DNS, Stripe, RRUK and the existing Bytova portal unchanged until a reviewed deployment is ready.

## What is implemented
- Dedicated secure-intake route at /request using server-verified Turnstile; if not configured, request submission is disabled rather than silently discarded.
- Password-key protected case API and /operator single-operator dashboard, including ticket state, audit history, notes, Calendly invitee linkage and payment state. Operator key is never stored by browser LocalStorage.
- D1 migration: tickets, audit events and webhook receipts with database constraints.
- Webhook verification for Stripe and Calendly using HMAC SHA256 over the exact raw request body, signed timestamps and replay tolerance.
- Stripe **test** Checkout creation at the official service prices, with idempotency key and webhook-only paid status. Only matching ticket, session ID, GBP price and client reference can mark paid.
- Calendly webhook handling is limited to an invitee URI already linked by the operator; matching by customer email is prohibited.
- No built-in screen control. The operator may use appropriately licensed AnyDesk for an attended, customer-approved session according to the existing Bytova safety policy.

## Crucial limitations
1. This service is **not deployed** and has no production D1 database, Turnstile site key, operator secret, Cloudflare Access policy, live Stripe checkout or connected Calendly webhook subscription yet.
2. Stripe **livemode is intentionally disabled**, even if live Stripe credentials exist elsewhere. No production payments can be accepted by this Worker. Historical website/Calendly booking and payment status is not synchronised.
3. Email acknowledgement, reminder delivery, refunds, customer login, live Calendly subscription and dedicated remote-support licence verification remain external/manual steps. Do not advertise these as automated.
4. An existing public /portal link refers to an independent hosted service; this Worker is not a replacement and should not be assumed to share data with it.
5. Before public go-live, an operator must configure authenticated Cloudflare Access + MFA at /operator and /api/*, secret management, WAF/rate limiting, privacy and deletion policy, monitoring, backups, and end-to-end tests on their own account.
6. D1 audit logs may contain notes/customer information. Never commit a real D1 export or use a public repo for case notes.

## Deployment procedure (not executed)
1. Read the existing website and payment workflow, avoid conflicting live changes; create a **new** Cloudflare Worker and **new** dedicated D1 database in the authorised account.
2. Install Node 22.23.4+ and Wrangler. In this directory run: \`npm install\`.
3. Copy \`wrangler.toml.example\` to the ignored \`wrangler.toml\`. Replace only the new D1 ID, not a database used by RRUK or another service.
4. In Cloudflare configure an Access application covering \`/operator\` and \`/api/tickets*\` with an MFA policy restricted to the owner. Never make either publicly accessible. Add bot/WAF protections to public \`/api/enquiries\`.
5. Create a sufficiently random \`ADMIN_API_KEY\` (at least 32 characters). Add it with \`npx wrangler secret put ADMIN_API_KEY\`; never place it in GitHub or client code.
6. Configure a Turnstile widget for the final Worker hostname, set public \`TURNSTILE_SITE_KEY\` in Wrangler vars and \`TURNSTILE_SECRET\` using \`npx wrangler secret put TURNSTILE_SECRET\`.
7. Apply schema using \`npx wrangler d1 migrations apply bytova-remote-help --remote\` after verifying the database ID and taking an initial backup.
8. Run \`npm test\`, \`npx wrangler dev\`, and operator smoke tests with synthetic customers; ensure the public form submits only when Turnstile succeeds, staff UI shows no cases without a valid key, and other origins are rejected.
9. Configure Calendly webhook subscriptions for invitee created/cancelled only if the connected plan supports them. Store the returned signing key via \`npx wrangler secret put CALENDLY_WEBHOOK_SIGNING_KEY\`. Verify actual event payloads from this account in staging.
10. **Optional TEST payments**: set \`PAYMENTS_MODE="test"\`, \`STRIPE_TEST_SECRET_KEY\`, and \`STRIPE_TEST_WEBHOOK_SECRET\` via Wrangler secrets, using the separate Bytova Stripe account's **test keys**, never its live merchant keys. Listen for \`checkout.session.completed\`. Exercise duplicate events, tampered signatures, wrong amounts and out-of-order bookings.
11. Test operator cases, access control, backup export and a permitted sample AnyDesk session from start to finish. Record evidence and user consent.
12. Only after a separate live-payment security and UK consumer-law review would a future implementation enable live checkout. This version intentionally has no live checkout mode.

## Run and develop
- \`npm test\` tests core invariants and Worker security gates.
- \`npm run dev\` starts a local Worker after dependencies/config are available.
- The main website is not modified by the Worker: no Stripe or customer secrets reach static HTML.
- The public form entry point is \`/request\`; operator dashboard is \`/operator\`.

## Security model
- Operator endpoints use explicit bearer authentication. Cloudflare Access with MFA is a mandatory additional production boundary; an API key alone is not sufficient as a launch sign-off.
- The customer intake uses Turnstile server verification; adding a Cloudflare rate-limit rule is mandatory before public launch.
- The application does not collect or persist card numbers, customer passwords, MFA codes or AnyDesk session secrets. Prevent customers from entering secrets in free-text forms via guidance and review.
- Stripe receipt confirmation is server-side, exact-amount, test-mode and ticket-bound. Browsers are never trusted to declare payment.
- Customers need to initiate their own remote session and can disconnect at any time. Session screen recording or unattended access is not built in.
- Backups, audit-log protection, SAR/deletion procedures and support hours must be separately approved and verified in the operating environment.

## Project tracker
https://github.com/Taccountant2026/Bytova/issues/12

References: https://developer.calendly.com/api-docs/overview/webhooks/webhook-signatures ; https://developers.cloudflare.com/d1/get-started/ ; https://docs.stripe.com/webhooks/signature
