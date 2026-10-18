# Bytova domain connection

Target: `https://bytova.co.uk/`, with `www.bytova.co.uk` redirected by GitHub Pages.
Updated 18 October 2026 after the owner saved and corrected the DNS zone. GitHub's native branch publisher accepted the custom domain after the CNAME file was published. Public DNS now points to GitHub, and HTTP serves the new site. HTTPS currently fails certificate hostname verification, so certificate provisioning and HTTPS enforcement remain pending.

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

## Public delivery checked on 18 October

- http://bytova.co.uk/ returns HTTP 200 from GitHub and matches the repository homepage.
- http://www.bytova.co.uk/ returns HTTP 301 to http://bytova.co.uk/.
- The old GitHub Pages preview returns HTTP 301 to http://bytova.co.uk/.
- https://bytova.co.uk/ and https://www.bytova.co.uk/ currently fail certificate verification with a hostname mismatch. Verification was not bypassed. HTTPS and HTTPS redirects are not claimed as working.
- The 14 explicit HTML files, CSS, JavaScript, images, three local font files, robots.txt and sitemap.xml were checked against repository bytes over HTTP. A nonexistent path returns the repository's custom 404 with HTTP 404. This verifies delivery, not a browser interaction test on the secure domain.
- A fresh Calendly API read confirms the three configured service URLs remain active and paid, with the agreed 30/60/60-minute durations. Their terms links still use the old preview URL; replace these with https://bytova.co.uk/terms.html after valid HTTPS is confirmed.

## Connection order

1. Completed: domain routing has been accepted by this repository's native branch publisher. A different repository using a custom Actions publishing workflow must configure its custom domain through Settings or the API; a CNAME file alone is insufficient for that publishing mode.
2. Completed: the owner saved the four root A records below. The host field is blank for the root in this provider's editor.
3. Completed: www points to `taccountant2026.github.io`, without a scheme, slash or repository name.
4. Completed: the restored mail aliases and retained MX, TXT and SRV were read back through public DNS.
5. Pending: inspect Settings → Pages for `bytova.co.uk`, GitHub's DNS check and certificate status. Enable Enforce HTTPS when GitHub makes it available. The connected repository tools can publish source but do not expose Pages administration settings. GitHub documents that certificate provisioning may take time; if it remains stuck, its HTTPS documentation explains the domain remove/re-add procedure. Do not change DNS merely to retry a certificate request.
6. Verify root and www, every native page, assets and all three booking selections. Update the Calendly terms links to the working domain.
7. After the new domain works over HTTPS, set `launch.indexable` true, rebuild and publish. The build then emits production canonical URLs, a 13-page sitemap and its robots.txt reference. The 404 page remains noindex. Until then, indexing stays closed.

| Host | Type | Result |
| --- | --- | --- |
| blank | A | 185.199.108.153 |
| blank | A | 185.199.109.153 |
| blank | A | 185.199.110.153 |
| blank | A | 185.199.111.153 |
| www | CNAME | taccountant2026.github.io |

The saved public website records now match this table. Keep a copy of the complete zone before any further DNS changes.

## Source and deployment preparation

`site.config.json` records the intended production URL. The generated CNAME file and deployment artifact preserve it. The native Pages deployment for commit `3105f2e8288ad0c0c695c865a2bd7e3f1bca80d9` completed successfully, and public preview redirection confirmed custom-domain routing. Local validation passed all 11 tests and checked 14 pages and 419 local links/anchors. The custom workflows still failed; their status is not a passing CI result.

The domain registration remains with the existing provider. Domain/email renewal and any Shopify subscription decision are separate account tasks.

## References

- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages
- https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https
