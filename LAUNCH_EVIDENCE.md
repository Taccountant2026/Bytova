# Bytova release evidence — 16 October 2026

## Implemented website

Fourteen native pages: homepage, service catalogue, three detailed service pages, booking, contact, process, FAQs, remote-support safety, privacy, terms, cancellation/refunds and 404. Shared verified identity and contact details are included in the footer. The catalogue and all booking controls derive from one configuration.

The website uses the supplied Bytova logo, existing founder photograph and locally hosted Inter fonts. Old product graphics, store links, cart/account/search, marketing signup, digital products, subscription plans and unrelated business offerings have been removed. No customer data is posted to a site backend.

## Verified business information

Current published contact/legal-notice information was checked before rewriting the native pages:

- Leighton Liam Hepworth, trading as Bytova; sole trader; not VAT registered.
- `hello@bytova.co.uk`; response aim within two working days.
- Correspondence: Bytova, 65 Coronation Road, Stainforth, Doncaster, South Yorkshire DN7 5EU, United Kingdom.
- The current remote-support process names AnyDesk and emailed joining instructions. These are remote-only appointments.
- The BSc (Hons) Computing & IT study statement was retained from the existing public, owner-confirmed context.

## Calendly and payments

The three event names, full HTML descriptions, £25/£35/£29 prices, 30/60/60-minute durations and custom remote joining-instructions location were updated and read back through the connected API. Additional unrelated support event types were deactivated. Europe/London availability was checked, including after the October DST change.

The events are marked paid, but the accessible Stripe connection is a sandbox. No live charge, real customer booking or refund was created or verified. Public HTTP retrieval of Calendly returned 403. The operator was given the live-account connection handoff separately; its completion has not been assumed.

The website therefore keeps online booking disabled and provides an email-first route. Every combination of the two independent flags is tested; the browser receives the combined result. Even when both flags are enabled, no external calendar loads before explicit visitor opt-in, and choosing another service or withdrawing the opt-in removes the iframe.

## Consumer information and operating policies

The service pages state total prices, durations, scope, exclusions and prerequisites. The terms preserve reasonable-care-and-skill obligations and statutory remedies without inventing a blanket liability cap. Customers may cancel before the session starts for a full refund of any appointment payment. The consumer cancellation period is described as 14 days starting the day after the contract is made. Early performance requires an explicit customer email before work and acknowledgement of the consequence of full performance; a website tick box is not treated as recorded consent.

The local cancellation page includes a model form and real-newline email templates. The terms/form have print styling. The site does not claim to save customer consent, send email, confirm appointments, issue refunds or provide remote service automatically.

The privacy notice identifies the controller, purposes/bases, necessary providers, rights and ICO route. The selected retention policy is normally 12 months for routine enquiries/support correspondence and six years for accounting/booking records, with justified ongoing-record exceptions. It describes local assets, no analytics/marketing tracking and deliberate opt-in before the external calendar.

Primary guidance used for these pages:

- https://www.gov.uk/online-and-distance-selling-for-businesses/online-selling
- https://assets.publishing.service.gov.uk/media/5a817b92ed915d74e33fe73a/bis-13-1368-consumer-contracts-information-cancellation-and-additional-payments-regulations-guidance.pdf
- https://www.businesscompanion.info/en/quick-guides/distance-sales/consumer-contracts-distance-sales
- https://www.gov.uk/unfair-terms-in-sales-contracts/implied-rights
- https://www.gov.uk/guidance/writing-a-fair-contract-for-customers
- https://ico.org.uk/for-organisations/advice-for-small-organisations/privacy-notices-and-cookies/cookies-and-privacy-notices-in-detail/

Provider privacy links were checked: Calendly, Stripe, AnyDesk and GitHub's official privacy pages. These are notices, not marketing or store dependencies.

## Checks and limits

- `npm run build`: generates the complete site from current configuration.
- `npm run check`: verifies generated content is current, all 14 pages have a main heading/landmark and skip link, and checks local files, anchors, image dimensions/alt text and CSS assets.
- `npm test`: nine checks covering the exact catalogue, all four booking gate combinations, retained endpoints, absence of store dependencies/tracking/fake forms, PNG logo, cancellation/early-start text, identity/privacy/remedies, responsive semantics and indexing guard.
- Browser visual QA is unavailable in this managed runtime because the required control-browser capability is not installed. Responsive layout and interactions have been checked in source; no screenshot or completed browser purchase test is claimed.
- Custom GitHub workflows cannot start because of an account billing lock. Their status is not described as passing CI. Native Pages deployment and HTTP delivery are verified independently after publication.

No DNS, custom-domain, email-record or live-domain routing change has been made. The final external steps are live payment verification and the intended domain connection; the current website should not be described as fully verified for automated sales until the payment step is complete.
