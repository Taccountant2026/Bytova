# Bytova release evidence — updated 19 October 2026

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

The three event names, full HTML descriptions including the advertised £25/£35/£29 prices, 30/60/60-minute durations and custom remote joining-instructions location were updated and read back through the connected API. Actual payment settings were checked separately in the public booking flow, as recorded below. Additional unrelated support event types were deactivated. Europe/London availability was checked, including after the October DST change.

The live Stripe business account was subsequently inspected through granted read-only access. Charges and payouts are enabled, business details are submitted, and no current/past-due requirements or disabled reason were reported. Existing live Calendly-associated GBP payment-intent records were visible; inspected records were unpaid and awaiting a payment method. No account identifiers, customer records or credentials are stored here.

Fresh public browser sessions verified the actual booking prices and durations: Remote Tech Help £25 GBP / 30 minutes; Setup & Getting Started £35 GBP / 60 minutes; Computer Care & Safety Check £29 GBP / 60 minutes. The owner corrected the care event’s earlier currency/amount setting; a new browser read confirmed £29 GBP. Current weekday date cells were available. This supersedes the earlier blocked public HTTP retrieval.

The care event was followed as far as its empty payment form, without submitting customer or card information. Stripe showed £29.00 GBP in live mode, and its read-only merchant details matched the verified live Bytova account. No booking or payment was submitted.

Both online booking flags are now enabled. Verification records the live provider configuration and actual public prices; no real customer booking, completed charge or refund was submitted. A completed transaction and its confirmation/refund delivery are not claimed as end-to-end tested. Email remains available for suitability and booking help. Every combination of the two independent flags is tested; the browser receives the combined result. Even when both flags are enabled, no external calendar loads before explicit visitor opt-in, and choosing another service or withdrawing the opt-in removes the iframe.

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
- `npm test`: eleven checks covering the exact catalogue, all four booking gate combinations, retained endpoints, absence of store dependencies/tracking/fake forms, PNG logo, cancellation/early-start text, identity/privacy/remedies, responsive semantics, indexing guard and production-domain canonical/sitemap behavior.
- The public Calendly booking flows were inspected in the authorized cloud browser. Responsive layout and interactions were also checked in source. No completed browser purchase test is claimed.
- Custom GitHub workflows cannot start because of an account billing lock. Their status is not described as passing CI. Native Pages deployment and HTTP delivery are verified independently after publication.

The production domain now works over validated HTTPS with HTTP/www redirects. Production indexing is enabled in the release configuration. The earlier pending-certificate reports below are historical and superseded by the 19 October verification. Live provider configuration and public prices are verified. No real completed transaction was created or tested during this work; that limit remains explicit.

## Public release verification — 17 October 2026

Booking activation was published in commit `fc3b95e4d823d878ea96df67544fb1008aa946e9`. The native [Pages build and deployment](https://github.com/Taccountant2026/Bytova/actions/runs/39021371890) completed successfully. Local validation passed all ten tests and checked 14 pages and 419 internal links/anchors.

The public booking page was then checked in the authorized cloud browser. Each service loaded its matching embedded Calendly event with the correct actual GBP price: £25, £35 and £29. The initial calendar was absent and its load button disabled. Changing services removed the iframe, updated the service summary and reset the opt-in; withdrawing the opt-in also removed the iframe and hid the direct booking link. The desktop booking layout was visually inspected. No customer details, booking or payment were submitted. Indexing remains disabled for the domain cutover.

## Domain cutover verification — 18 October 2026

The owner saved the Names.co.uk zone and corrected the duplicated www entry and replaced mail setup aliases. Fresh public DNS returns the four expected GitHub Pages A addresses, no root AAAA, a single www CNAME to taccountant2026.github.io, the restored autoconfig/imap/pop3 aliases, both existing MX records, and the retained verification TXT and autodiscover SRV. These checks verify DNS, not email delivery.

The root serves the repository website over HTTP. The www host and previous GitHub Pages preview redirect to the root over HTTP. All 14 explicit HTML pages, CSS, JavaScript, images, all three local fonts, robots.txt and sitemap.xml match repository bytes. A nonexistent path returns the custom 404 page with HTTP 404.

Both secure domain variants currently fail certificate hostname verification. The check did not bypass verification, and HTTPS enforcement is not claimed as enabled. Indexing remains disabled until certificate provisioning and secure customer journeys work. The three active paid service events and their durations were read again through Calendly; terms links retain the previous preview address until the HTTPS production URL is usable. See DOMAIN_CUTOVER.md for the remaining steps and original website rollback values.


## Secure production release — 19 October 2026

At 17:36 BST the owner reported DNS check successful and Enforce HTTPS enabled. Independent public requests confirmed validated HTTPS returns 200 for the root and booking page. Both http://bytova.co.uk/ and https://www.bytova.co.uk/ end at https://bytova.co.uk/. A fresh public DNS query retained the four GitHub Pages A records. Certificate validation was never bypassed.

The original GitHub route is retained. Although a Sites fallback was prepared and its audience was made public with owner approval, no registrar credentials were submitted and no DNS record was changed. The fallback is not the production domain.

Production indexing is enabled, with canonical URLs on the 13 content pages, the production sitemap in robots.txt and noindex retained on 404.html. The three-service catalogue, GBP prices, durations, payment settings and explicit calendar opt-in remain unchanged. Final publication and secure asset verification are recorded after the release completes; no completed live customer purchase is claimed.

All three configured Bytova event types were freshly read and patched only to replace the old GitHub preview terms URL with https://bytova.co.uk/terms.html. A fresh readback confirmed the production link and preserved name, 30/60/60-minute duration, active/paid state, scheduling URL, location, questions and remaining event settings. The unrelated personal 30-minute meeting was not changed.
