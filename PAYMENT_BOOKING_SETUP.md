# Bytova payment and booking integration

## Verified 12 October 2026
Stripe account: Bytova sandbox (test mode only; no live payments). Three **inactive** products with GBP one-time draft prices:

| Service | Duration | Draft price | Stripe product | Stripe price | Calendly event |
|---|---:|---:|---|---|---|
| Remote Computer Help | 30 min | £25 | `prod_VQVoRMO8VuIe1R` | `price_1UPempDemaz6EZhZRUgv1aFT` | `c32707e6-e3d3-4062-97a1-20c63227a937` |
| PC Speed-Up | 60 min | £35 | `prod_VQVofMS1FYx8qT` | `price_1UPemrDemaz6EZhZa05lpjzG` | `44874b88-481a-4ad9-8107-2f8d5fbc9c1c` |
| Windows Security Check | 60 min | £29 | `prod_VQVorOSt4yVGyx` | `price_1UPemvDemaz6EZhZu3AWcnqQ` | `4b024b9c-cc6a-4dc6-a509-f8566b946bf6` |

Calendly host timezone: Europe/London. **Verified live configuration of all three inactive event types:** Monday–Friday 09:00–14:00 and 18:00–20:00, no weekend rules. Existing free 30-minute meeting remains unchanged. The event types are currently unpaid and inactive.

## Required before sales
1. Verify preview GitHub Pages deployment succeeds and manually test responsive pages and links.
2. Approve service descriptions, draft GBP prices, legal information and business details.
3. Connect payment to booking without exposing unpaid appointment slots or taking payment without a deliverable appointment. Recommended: a Calendly paid event integrated with Stripe if supported by the connected plan; otherwise use a secure server-side payment/booking coordinator.
4. If using a custom coordinator, implement webhook signature validation, idempotency and refund/cancellation handling. A public GitHub Pages static site cannot securely hold Stripe secrets.
5. Complete sandbox checkout, payment verification, Calendly booking and confirmation tests, including failures, cancellation and duplicate webhook tests.
6. Connect and verify a **live** Stripe account separately; sandbox credentials cannot collect real sales.
7. Enable paid services only after successful live-mode verification and explicit owner approval.

No live Stripe checkout, paid Calendly event, or successful deployment is claimed by this document.
