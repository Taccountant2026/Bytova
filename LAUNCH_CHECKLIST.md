# Bytova launch checklist

## Phase 1 — identity and content
- [x] Create responsive initial services page
- [ ] Audit current bytova.co.uk for logo, typography, colours, assets, policies, business contact details; do not approximate brand identity
- [ ] Replace provisional typography and colours with verified brand tokens
- [ ] Confirm fixed service scopes and final prices

## Phase 2 — booking and payment
- [ ] Select supported booking platform with Europe/London time zone, separate 09:00–14:00 and 18:00–20:00 weekday windows, 30/60-minute services, leave blocks and calendar sync
- [ ] Integrate Stripe-hosted payment through booking provider or secure backend; never accept payment details in GitHub Pages
- [ ] Verify paid status server-side and prevent double-bookings; configure transactional emails
- [ ] Test payment success/failure, booking conflict, refunds, cancellation and daylight-saving transitions

## Phase 3 — legal and release
- [ ] Publish accurate UK consumer information, terms, privacy notice and cancellation/refund policy (including digital service commencement)
- [ ] Accessibility, responsive, SEO and performance checks
- [ ] Verify GitHub Pages visibility/plan compatibility and custom domain setup
- [ ] Test on staging, then obtain approval for DNS switch; keep Shopify live until cutover

## No-go criteria
Do not show a working booking button or claim payments are active before integrations pass end-to-end tests. Do not publish API secrets. Do not connect local Alex directly to the public web.
