# Bytova Booking & Payment Integration Contract

Status: **not connected**. This is a technical implementation contract, not a claim that bookings or payments work.

## Appointment catalogue
| Service | GBP price | Duration | Checkout |
| --- | ---: | ---: | --- |
| Remote Computer Help | 25.00 | 30 min | Fixed price |
| PC Speed-Up | 35.00 | 60 min | Fixed price |
| Windows Security Check | 29.00 | 60 min | Fixed price |
| Business IT Support | From 49.00 | Quote required | No direct checkout |

Prices are provisional pending business approval.

## Availability
- IANA timezone: `Europe/London` (DST aware).
- Monday–Friday 09:00–14:00 and 18:00–20:00; Saturday/Sunday closed.
- Booking provider must allow calendar blocking, holiday exceptions, rescheduling and cancellations.
- Appointment length is service-specific. No appointment may extend beyond an open window.

## Transaction sequence
1. Customer chooses a fixed-price service.
2. Provider displays **actual** availability and temporarily holds a slot if supported.
3. Customer completes provider-hosted secure checkout.
4. Trusted provider webhook/server verifies payment, appointment and idempotency; browser redirect is never proof of payment.
5. Only after successful confirmation, issue booking confirmation and customer email; failures release holds or follow documented recovery process.
6. Provide secure cancellation/reschedule links and clear UK consumer cancellation information.

## Integration acceptance tests
- Confirm price/currency/service and appointment duration cannot be altered by browser inputs.
- Two customers cannot confirm the same slot.
- Failed/abandoned payment does not create a paid booking.
- Duplicate webhook does not create duplicate appointments or emails.
- Confirm timezone behaviour across BST/GMT change.
- Test cancellations, refunds, blocked dates, reminders and notification failures.
- No secret key or customer private data is stored in the public static repository.

## Platform constraint
GitHub Pages can host only the public frontend. Use an appropriately secured third-party booking/payment integration or separate backend. Do not create a simulated checkout, fake availability or insecure payment form. Until integrated, link customers to the existing live Bytova site.
