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

Both `launch.onlineBookingEnabled` and `launch.livePaymentsVerified` in `site.config.json` must be `true` to render online booking controls. The same combined result is supplied to the browser. Tests cover all four flag combinations. Both flags are currently `false` because a live checkout has not been verified.

While gated, visitors choose a service and email Leighton. The email template includes the selected service, price/duration, one task, device details and preferred times. No email is sent by the website itself.

When enabled, the calendar is absent until the customer opts in and requests it. The provider URL is restricted to the three configured HTTPS Calendly event URLs. The iframe and direct-link permission are reset when the service changes or the opt-in is withdrawn. No personal information is prefilled into provider URLs. A no-JavaScript fallback explains the external-provider privacy implications before its links.

## Appointment delivery

Leighton confirms the scope and arrangements by email and emails joining instructions for the agreed AnyDesk session. Customers remain present and control access. Early-start requests are collected by customer email before work begins; a website checkbox is not treated as a durable consent record.
