# Bytova Remote Help — Operator Runbook
**Operational draft · 22 November 2026 · Not a completed end-to-end test**

This is a single-operator operating procedure for Bytova. Keep all customer case information inside the approved, authenticated ticketing system, not in this public GitHub repository. Written/email communication is the standard route.

## Currently advertised appointments
| Service | Duration | Price | Live scheduling observed 22 Nov |
|---|---:|---:|---|
| Computer Care & Safety Check | 60 min | £29 | Active paid Calendly event; completed payment flow not tested |
| Remote Tech Help | 30 min | £25 | Paid Calendly event **inactive**; request-first |
| Setup & Getting Started | 60 min | £35 | Paid Calendly event **inactive**; request-first |

The configuration in `site.config.json` marks `livePaymentsVerified:false`. Historic booking notes describe a prior state; do not override the current configuration without verified evidence.

## A. New enquiry — 3 minutes
1. Check who requested help, their reply address, service, device/OS, issue and preferred time. Ask for missing basics by email. Do not collect passwords, one-time codes, identity scans or unnecessary personal details.
2. Check the published service scope; ordinary remote support excludes active fraud, suspected compromise/forensic work, account bypass, enterprise administration and physical repairs.
3. Record a unique support reference in the **secured ticketing system**. Status: `new`; payment: `not_requested`.
4. Acknowledge receipt in writing. **An enquiry is not a confirmed order.**

## B. Booking and payment
1. Offer only available services and actual published slots. For inactive event types, arrange manually until approved to enable the calendar.
2. Send the written price, duration, scope, cancellation terms, and any early-start instructions that apply. Do not infer the customer's statutory consent from a booking checkbox.
3. Record the event/booking identifier and confirm that the appointment was accepted by the customer.
4. Verify actual payment through the authorised merchant/provider; do not equate a booked slot, email notification, customer screenshot or browser redirect with payment.
5. Only after verification update `payment: paid` (or accurately retain `awaiting_payment`). Do not send an untrue paid receipt.

## C. Prepare the session
- Check your own machine, AnyDesk commercial-use entitlement, network and backup connectivity.
- Confirm remote access instructions come from the customer's expected Bytova contact route.
- Explain that the customer initiates and approves the connection, remains present, may end access at any time and should close private documents before connecting.
- Agree the exact issue and permitted changes before requesting access. Do not enable unattended access.

## D. During remote support
1. Identify the customer and consent, explain the next action and work within agreed scope.
2. Keep a timestamped private activity summary; do not record credentials or unnecessary screen content.
3. Request additional permission before significant configuration changes, reboots, installations, deletion, account changes or extra charges.
4. If fraud, active compromise or access-right concerns emerge, **stop routine support**, disconnect safely and refer to a suitable incident pathway.

## E. Finish and aftercare
1. Disconnect and verify any temporary access is removed.
2. Record what was checked/changed, tests carried out, remaining issues and outcome.
3. Send written summary and legitimate receipt/invoice where applicable, and explain next steps and cancellation/refund/complaint routes.
4. Close the ticket only when follow-up actions are accounted for; apply the documented retention policy.

## Ticket fields (minimum)
`ticket_id`, `created_at`, `customer_name`, `reply_email`, `service_id`, `summary`, `device_os`, `scope_approved_at`, `booking_provider_id`, `appointment_start_utc`, `payment_provider_id`, `payment_status`, `remote_consent_at`, `early_start_evidence`, `operator`, `work_log`, `outcome`, `aftercare_sent_at`, `closed_at`.

Do not store raw payment-card data, banking credentials, login passwords, OTPs or remote-access tokens in tickets.

## Daily opening checklist
- [ ] Review new enquiries and outstanding customer responses.
- [ ] Check today's actual Calendly events and availability, not a cached list.
- [ ] Check payment status against actual provider records.
- [ ] Verify your remote support tool, licensed use and customer approval process.
- [ ] Send preparation emails to customers with confirmed slots.
- [ ] Check overdue follow-ups, refunds/complaints and service disruption alerts.

## Go-live criteria
- [ ] A real, approved customer portal with authentication and role restrictions is confirmed.
- [ ] Booking state and paid state are verified independently.
- [ ] Order confirmation and support ticket are created with evidence.
- [ ] Safe, attended remote access is demonstrated on a consenting test device.
- [ ] Customer receives completion notes and accurate payment documentation.
- [ ] Cancellations, declines, failures, reschedules, no-shows and refunds are rehearsed.
- [ ] Backup, recovery, privacy, logging and access controls are tested.

**Do not claim end-to-end order readiness until these criteria are evidenced.** See issue #12 for implementation and tests.
