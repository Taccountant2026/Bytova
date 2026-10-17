# Booking configuration

Verified configuration date: 16 October 2026.

| Customer service | Duration | Total price | Retained Calendly URL |
| --- | --- | --- | --- |
| Remote Tech Help | 30 minutes | £25 | `https://calendly.com/leighton-hepworth22/bytova-remote-computer-help` |
| Setup & Getting Started | 60 minutes | £35 | `https://calendly.com/leighton-hepworth22/bytova-pc-speed-up` |
| Computer Care & Safety Check | 60 minutes | £29 | `https://calendly.com/leighton-hepworth22/bytova-windows-security-check` |

Calendly event names, descriptions, prices/durations and custom remote locations have been updated and read back through the connected API. The older URL slugs are retained for continuity. Four unrelated extra support event types were deactivated; the owner's separate personal event was left unchanged.

Availability uses the Europe/London calendar. API slot checks included a date after the October daylight-saving change. The website does not hard-code availability or invent dates.

## Website gate

Both `launch.onlineBookingEnabled` and `launch.livePaymentsVerified` in `site.config.json` must be `true` to render online booking controls. The same combined result is supplied to the browser. Tests cover all four flag combinations. Both flags are now `true` after live Stripe configuration and actual public GBP prices/durations were verified. No real completed booking or charge was submitted during verification.

Visitors choose one service and opt in to use Calendly. An email fallback remains available for suitability questions or booking help. The website does not send email itself. If either configuration gate is later disabled, the page returns to its email-first route.

The calendar is absent until the customer opts in and requests it. The provider URL is restricted to the three configured HTTPS Calendly event URLs. The iframe and direct-link permission are reset when the service changes or the opt-in is withdrawn. No personal information is prefilled into provider URLs. A no-JavaScript fallback explains the external-provider privacy implications before its links.

## Appointment delivery

Calendly supplies the appointment confirmation after its booking/payment flow. Leighton emails the agreed support details and joining instructions for the AnyDesk session. Customers remain present and control access. Early-start requests are collected by customer email before work begins; a website checkbox is not treated as a durable consent record.
