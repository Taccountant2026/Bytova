# Verification record — 22 October 2026

The primary record is `assets/security/advisories.json`, with the same file included in the standalone utility. Sources were checked on 22 October 2026. The snapshot must be reviewed by 29 October. This file records research provenance; it is not an independent professional incident assessment.

| Check | Finding | Primary evidence |
|---|---|---|
| CVE-2026-109618 exists | Confirmed: OOM corruption, critical, CVSS 4.0 9.2 | PHP GHSA-w8hw-w9fx-j79w, published 21 Oct 2026 |
| CVE-2026-109619 exists | Confirmed: stale global state, critical, CVSS 4.0 9.2 | PHP GHSA-6wmf-4rv5-p3rp, published 21 Oct 2026 |
| Fixed upstream releases | 8.2.35 / 8.3.36 / 8.4.27 / 8.5.12 | PHP announcement and both GHSAs |
| Source date difference | PHP release announcement dated 21 Oct; changelog labels 8.5.12 dated 22 Oct | PHP archive and ChangeLog-8.php; preserved explicitly |
| Complete remedy | Install a PHP release/package containing the fixes; temporary controls have limits | PHP official advisory |
| Demonstrated exploitation | Full unauthenticated RCE reported for mod_php as web worker; reliability depends on build and environment | PHP GHSA-w8hw-w9fx-j79w |
| Attack attempts | Cloudflare reports attack traffic and payload mutation; not a count of successful compromises | Cloudflare first-party article, 21 Oct |
| UK public guidance | NCSC recommends inventory, vendor updates, exposure assessment and qualified assistance where needed | NCSC alert, 21 Oct |
| Backports | Selected exact Ubuntu/Debian revisions checked against records for both CVEs | Per-CVE vendor records in JSON |
| NVD | Record URLs attempted; no readable record content returned | No NVD score or analysis-state assertion |
| CISA | Official alert found in search, full page retrieval returned an error | Not used as version/threshold evidence; KEV inclusion not asserted |

## Exact package rows represented

The dataset includes Ubuntu 22.04 php8.1 `8.1.2-1ubuntu2.28`; Ubuntu 24.04 php8.3 `8.3.6-0ubuntu0.24.04.13`; Ubuntu 26.04 php8.5 `8.5.4-0ubuntu1.5`; Ubuntu 26.10 php8.5 `8.5.9-0ubuntu2.1`; Debian 12 php8.2 `8.2.35-1~deb12u1`; and Debian 13 php8.4 `8.4.27-1~deb13u1`. These match the records checked for **both** CVEs. No inference is made about later revisions, different repositories, unlisted vendors or hosting panel labels. A package match is not proof that the running web process uses that package.

## URLs

- PHP: https://www.php.net/archive/2026.php#2026-10-21-5
- PHP changelog: https://www.php.net/ChangeLog-8.php
- OOM advisory: https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w
- Stale-state advisory: https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp
- Upstream support: https://www.php.net/supported-versions.php
- Ubuntu: https://ubuntu.com/security/CVE-2026-109618 and https://ubuntu.com/security/CVE-2026-109619
- Debian: https://security-tracker.debian.org/tracker/CVE-2026-109618 and https://security-tracker.debian.org/tracker/CVE-2026-109619
- NCSC: https://www.ncsc.gov.uk/news/critical-security-issue-affecting-php
- Cloudflare: https://blog.cloudflare.com/php-vulnerabilities-waf-protection/
- NVD attempted: https://nvd.nist.gov/vuln/detail/CVE-2026-109618 and https://nvd.nist.gov/vuln/detail/CVE-2026-109619
- CISA located, full retrieval unavailable: https://www.cisa.gov/news-events/alerts/2026/10/21/critical-vulnerabilities-php-require-immediate-patching

No exploit code, test payloads, credential access, attack simulation or external scanning was used. Bytova's resource does not claim credit for discovery, official endorsement, a general security certificate or verified protection of any number of websites.

## Official patch download routing

The dedicated patch page links to https://www.php.net/downloads.php, the verified Windows destination https://www.php.net/downloads.php?os=windows and Ubuntu notice https://ubuntu.com/security/notices/USN-8948-1 (published 21 October 2026). All were checked on 22 October 2026. The former windows.php.net/download/ URL redirects to the PHP downloads destination. PHP binaries are not mirrored or repackaged by Bytova. Linux/hosting guidance directs the administrator to the installed vendor package channel, with both CVE records retained.
