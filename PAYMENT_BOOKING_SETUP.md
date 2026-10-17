# Payment and appointment status

Verified 16 October 2026. Online Calendly checkout is enabled for the three services.

## Verified live configuration

The live Stripe business account was inspected through the granted read-only connection. Charges and payouts are enabled, business details are submitted, and there are no currently due/past-due requirements or disabled reason. Existing live Calendly-associated GBP payment-intent records were visible; those inspected records were unpaid, awaiting a payment method.

All three Calendly events are active and paid. Their actual public booking pages were inspected in a fresh browser session, including available weekday date cells and customer-facing prices/durations:

| Service | Public total | Duration |
| --- | --- | --- |
| Remote Tech Help | £25 GBP | 30 minutes |
| Setup & Getting Started | £35 GBP | 60 minutes |
| Computer Care & Safety Check | £29 GBP | 60 minutes |

The owner corrected the care event's previous currency/amount setting, and a fresh browser read confirmed £29 GBP. The website configuration uses the same three prices and the retained Calendly URLs.

The care event's empty Stripe payment form also showed £29.00 GBP in live mode. Its read-only merchant details matched the verified live Bytova account. No customer or card details were entered and the booking was not submitted.

Both `onlineBookingEnabled` and `livePaymentsVerified` are now true. Here, verification means the live account configuration and actual public provider pricing were checked. It does not mean a real completed transaction was tested.

## Verification limit

No real customer booking, completed charge or refund was submitted during this work. A complete paid customer journey and confirmation/refund delivery have therefore not been transaction-tested. Do not describe these as completed end-to-end tests or assume optional reminders were sent.

The website never collects card details or contains payment credentials. Calendly supplies the booking flow and Stripe handles payment. Joining instructions and consumer early-start requests remain email steps before work begins; a website checkbox is not treated as durable early-start consent.

Indexing remains disabled until the intended domain is connected and its launch settings are approved. No DNS or email records were changed.
