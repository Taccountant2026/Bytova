# Payment and appointment status

The three Calendly events are active and marked paid through the connected API, with £25/30-minute, £35/60-minute and £29/60-minute pricing. That flag is not proof of a functioning live charge.

The accessible connected Stripe account is a sandbox. A live Stripe connection and a real end-to-end paid booking have not been verified. No real charge, refund or customer booking was created during this work. Public Calendly HTTP retrieval was blocked, so its checkout could not be independently inspected through that route.

The public website therefore uses a genuine email-first appointment route. Both online booking flags remain false. It does not display a checkout button that could imply live payment readiness.

To enable provider checkout after the live connection is available:

1. Verify that Calendly uses the correct live Stripe account for all three events and displays the agreed GBP total.
2. Verify the customer confirmation and the cancellation/refund route. Do not assume optional reminders have been configured or delivered.
3. Record the verification evidence in `LAUNCH_EVIDENCE.md`.
4. Set both `onlineBookingEnabled` and `livePaymentsVerified` to `true`, rebuild, run checks/tests and publish.

The site never collects card details. Do not put Stripe credentials in the repository. Consumer early-start requests and required pre-contract information are handled by email before work begins.
