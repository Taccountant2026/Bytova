# Bytova domain connection

Production: https://bytova.co.uk/. Verified working over HTTPS on 19 October 2026.

The owner reported Enforce HTTPS enabled and DNS check successful at 17:36 BST. Independent requests then returned 200 over validated HTTPS for the root, www and booking page. HTTP and www redirected to https://bytova.co.uk/. Public root A records still point to the four GitHub Pages addresses. No registrar sign-in, DNS edit or mail change was completed during this final check.

## Current public records

- Nameservers: ns0.phase8.net, ns1.phase8.net, ns2.phase8.net.
- Root A: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153.
- Root AAAA: none.
- www CNAME: taccountant2026.github.io.
- Mail: priority 30 athena.hosts.co.uk and priority 30 hermes.hosts.co.uk.
- autoconfig CNAME: autoconfig.hosts.co.uk; imap CNAME: imap.hosts.co.uk; pop3 CNAME: pop3.hosts.co.uk.
- The existing Google verification TXT is retained.
- _autodiscover._tcp SRV: priority 0, weight 0, port 443, autodiscover.hosts.co.uk.

The first edited screenshot contained two www entries and replaced the three mail setup aliases. The owner corrected and saved the zone; fresh public DNS checks confirm the single GitHub www target, all three restored aliases, both MX records, TXT and SRV. Mail DNS was checked; sending and receiving email was not tested.

Do not apply a DNS template or change nameservers for this connection. The previous website-only rollback values were root A 23.227.38.65 and www CNAME shops.myshopify.com; preserve mail records if a deliberate rollback is required.

## Current release

The original GitHub Pages route is retained. The root and www certificate checks passed without bypassing validation. Production indexing is enabled in site.config.json, emitting the 13-page sitemap and canonical URLs; the error page stays noindex. All three Calendly service descriptions now link to https://bytova.co.uk/terms.html. Each was read before the description-only patch and read back after it; name, duration, active/paid state, booking URL, location and other event settings were unchanged.

A prepared Sites fallback exists in a separate source repository. Its pending custom-domain records were never installed at the registrar. Do not apply that unused alternative DNS table to this working GitHub site.

## Preserve this route

Keep the four website A records and www CNAME above. Preserve mail MX records, the autoconfig/imap/pop3 aliases, Google verification TXT and the autodiscover SRV. Keep the existing phase8.net nameservers. A template or nameserver change is unnecessary.

If a future incident occurs, diagnose current DNS, TLS, delivery and publisher status before changing settings. A past certificate delay does not justify automatically moving the domain or repeating certificate resets after the site is working.

## Verification limits

These are real public TLS and page-delivery checks. No completed paid customer booking or refund is claimed. Current source checks and public delivery evidence are recorded in LAUNCH_EVIDENCE.md. Native Pages publishing is independent of the custom Actions workflows affected by the existing account billing lock.

## References

- https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
