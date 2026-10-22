# Bytova PHP Security Audit

A small, defensive Python utility for comparing locally supplied PHP version information with a dated, verified advisory snapshot. It covers **CVE-2026-109618 and CVE-2026-109619**, not the whole security state of a server.

**Source snapshot checked: 22 October 2026. Review due: 29 October 2026.**

No runtime dependencies, network requests, scanning, exploitation, credentials, automatic updates or telemetry. Python 3.10 or later is required. Bytova did not discover these flaws and is not endorsed by PHP, NCSC, CISA or the original researchers.

## Run without installing

Open a terminal in this folder:

```sh
python -m php_security_audit --php-version 8.3.36 --provider upstream
python -m php_security_audit --php-version 8.3.35 --provider upstream --json
python -m php_security_audit --input-file local-php-version.txt --provider unknown --json
```

On some systems use `python3` or `py` instead of `python`. The default installation source is **unknown**, so an unexplained version string does not receive a positive patch result.

For a vendor-maintained package, retain all the context:

```sh
python -m php_security_audit --php-version 8.3.6 --provider vendor --vendor ubuntu --os-release 24.04 --package php8.3 --package-version 8.3.6-0ubuntu0.24.04.13 --json
```

Only selected **exact** vendor/OS/package/revision combinations are verified. The tool deliberately does not implement Debian, RPM or every hosting vendor's version-ordering rules. A newer unlisted package is **unverified**, not automatically vulnerable or safe. Upstream end-of-life status is shown separately from a vendor fix for these two advisories.

Optional local inspection requires two deliberate flags:

```sh
python -m php_security_audit --inspect-local --allow-local-execution --provider unknown
```

This executes the `php` executable found on your local PATH using a fixed `-n -v` argument list, with no shell and a five-second timeout. `-n` avoids loading php.ini and its configured extensions. Only run it on a machine where you are authorised to execute that local PHP binary. No command is run for supplied version text or files. The CLI PHP on PATH may differ from the PHP used by a website; inspect every actual web handler separately.

## Optional installation

```sh
python -m pip install .
php-security-audit --php-version 8.3.36 --provider upstream
```

The package has no third-party runtime requirements. Building a wheel uses setuptools as specified in `pyproject.toml`; an isolated pip build may need to obtain that build dependency. Running directly from the folder avoids installation. Do not install a similarly named package from an unverified registry.

## Reports and exit codes

Human-readable output is the default; `--json` produces one JSON object on stdout. Redirect it to a local file when needed:

```sh
python -m php_security_audit --php-version 8.3.36 --provider upstream --json > result.json
```

| Exit | Meaning |
|---|---|
| 0 | Patched for the two advisories in the current snapshot; deployment still needs verification |
| 1 | Vulnerable confirmed upstream release, or unsupported upstream branch |
| 2 | Unverified status, including malformed version text, stale positive data or unknown vendor package |
| 3 | Input, file, data-schema or local execution error |

JSON reports include the dataset identifier, source-review dates, classification, reason, scope, sources and limitations. They omit hostname, username and raw supplied text. The utility never writes a report unless you redirect its output yourself.

## Advisory data and review

Data is separate from logic in `php_security_audit/data/advisories.json`. It is bundled locally and never fetched automatically. A replacement can be supplied with `--data reviewed-advisories.json`; schema validation checks shape and consistency, not authenticity. Review the provenance yourself before accepting local data from anyone else.

The snapshot recognises the verified fixed upstream releases and selected Ubuntu/Debian backports. Unknown branches, build suffixes and releases newer than the newest verified release fail closed as **unverified**. Once the review-due date passes, previously positive patch comparisons become unverified. Already-known vulnerable upstream releases remain flagged. An ended upstream support branch remains unsupported unless separately matched to an exact vendor fix for this advisory scope.

Updates require official-source verification, human review, boundary fixtures, test execution and a release decision. Never auto-publish unreviewed alerts. The website and CLI dataset copies and shared cases must stay byte-identical.

## Tests

```sh
python -m unittest discover -s tests -v
```

The test suite covers fixed-release boundaries, legacy branches, malformed input, package identity and revision mismatches, future releases, stale data, permission-gated local execution and error reports. Shared fixtures also run against the browser engine in the parent website project, where full Python/JavaScript JSON reports are compared.

## What this utility cannot establish

A matching version is not proof of the running website's package, worker restart, exposure, compromise status or overall security. The utility does not look for web shells, read logs, authenticate to a host, inspect a remote URL or perform remediation. Preserve evidence and involve your host and a qualified incident responder if you suspect compromise.

## Primary references

- [PHP official announcement](https://www.php.net/archive/2026.php#2026-10-21-5), 21 October 2026.
- [OOM corruption advisory](https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w), 21 October 2026.
- [Stale global state advisory](https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp), 21 October 2026.
- [Upstream support calendar](https://www.php.net/supported-versions.php), checked 22 October 2026.
- [Ubuntu CVE-2026-109618](https://ubuntu.com/security/CVE-2026-109618) and [CVE-2026-109619](https://ubuntu.com/security/CVE-2026-109619), checked 22 October 2026.
- [Debian CVE-2026-109618](https://security-tracker.debian.org/tracker/CVE-2026-109618) and [CVE-2026-109619](https://security-tracker.debian.org/tracker/CVE-2026-109619), checked 22 October 2026.

MIT-licensed. See `SECURITY.md` and `CONTRIBUTING.md`. Source authorship is Bytova's educational implementation; vulnerability discovery credit stays with the original researchers.
