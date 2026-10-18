# Bytova domain connection

Target: `https://bytova.co.uk/`, with `www.bytova.co.uk` redirected by GitHub Pages.
Prepared 18 October 2026. GitHub's native branch publisher accepted the custom domain after the CNAME file was published. The previous preview address was checked and returns HTTP 301 to `http://bytova.co.uk/`. Website DNS still points to Shopify; the owner's DNS edit and certificate checks are next.

## Current public records and rollback values

- Nameservers: ns0.phase8.net, ns1.phase8.net, ns2.phase8.net.
- Root A: 23.227.38.65.
- www CNAME: shops.myshopify.com.
- Mail: priority 30 athena.hosts.co.uk and priority 30 hermes.hosts.co.uk.
- Preserve the existing autoconfig, imap, pop3, TXT, SRV and other email/verification records.

The owner's DNS-zone screenshot was reviewed and agrees with these website/mail records. Do not apply a DNS template or change nameservers for this connection.

## Connection order

1. Domain routing has been accepted by this repository's native branch publisher: the old preview address redirects to `http://bytova.co.uk/`. In repository Settings → Pages, the intended Custom domain is `bytova.co.uk`. An initial DNS warning is expected while website records still point to Shopify. A different repository using a custom Actions publishing workflow must configure its custom domain through Settings or the API; a CNAME file alone is insufficient for that publishing mode.
2. In Names.co.uk, replace the root website A record with the four GitHub Pages A records below. Leave the host field blank for the root in this provider's editor.
3. Change only the www CNAME target to `taccountant2026.github.io`. Use no scheme, slash or repository name.
4. Preserve all existing mail and verification records. Save the reviewed DNS zone.
5. Check public root/www DNS, GitHub's DNS check, certificate issuance and HTTPS. Enable Enforce HTTPS when GitHub makes it available.
6. Verify root and www, every native page, assets and all three booking selections. Update the Calendly terms links to the working domain.
7. After the new domain works over HTTPS, set `launch.indexable` true, rebuild and publish. The build then emits production canonical URLs, a 13-page sitemap and its robots.txt reference. The 404 page remains noindex. Until then, indexing stays closed.

| Host | Type | Result |
| --- | --- | --- |
| blank | A | 185.199.108.153 |
| blank | A | 185.199.109.153 |
| blank | A | 185.199.110.153 |
| blank | A | 185.199.111.153 |
| www | CNAME | taccountant2026.github.io |

In the supplied screenshot these correspond to changing row 1, adding A records in rows 8–10, and changing row 6. Keep a copy of the complete original zone before editing.

## Source and deployment preparation

`site.config.json` records the intended production URL. The generated CNAME file and deployment artifact preserve it. The native Pages deployment for commit `3105f2e8288ad0c0c695c865a2bd7e3f1bca80d9` completed successfully, and public preview redirection confirmed custom-domain routing. Local validation passed all 11 tests and checked 14 pages and 419 local links/anchors. The custom workflows still failed; their status is not a passing CI result.

The domain registration remains with the existing provider. Domain/email renewal and any Shopify subscription decision are separate account tasks.

## References

- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages
