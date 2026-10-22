# Quality assurance record — 22 October 2026

Candidate base: Bytova `main` at `a812edd5da0812e92394d1d0a040f40b1b1dfc94`. Release work is isolated on `security/php-response-2026-10-22`. The standalone utility is staged privately in `Taccountant2026/Bytova-PHP-Security-Audit`.

## Verified locally

| Check | Result |
|---|---|
| `npm run check` | Pass: generated output current, 54 actual HTML documents and 2,980 local links/anchors checked |
| `npm test` | Pass: 64 tests, including the original service/booking tests |
| Python unit suite | Pass: 8 tests; shared fixture test contains 33 classification cases |
| Cross-language behaviour | JavaScript/Python full JSON reports match on shared fixtures |
| Version boundaries | Fixed/below-fixed for all four branches, tuple comparisons and unknown future patches checked |
| Ambiguous inputs | Malformed, incomplete, command-like, URL, multiple-version, custom build, pre-release and unknown-provider inputs do not receive a positive fixed result |
| Vendor handling | Exact vendor/OS/package/revision matches; wrong release, unknown revision and runtime mismatch stay unverified |
| Date behaviour | Stale positive data becomes unverified; known old vulnerable releases remain flagged; future upstream end of life is checked |
| Consent controls | Tests verify no Google script or statistics before opt-in; GPC/preview suppression; withdrawal; no raw checker details in metrics; original ordinary-page aggregate path retained |
| Standalone preview | Nine pages embedded with local data/fonts/logo/downloads; all embedded modules pass syntax checks; no runtime fetch for comparison data |
| PDFs | Five A4 PDFs / nine pages rendered and visually inspected; selectable text and source links verified |
| Campaign assets | 13 designs as 13 SVG + 13 PNG, plus contact sheet; 232 text bounds, image decode/dimensions and SVG parsing checked |
| Optional Search copy | Headline maximum 27/30 characters, description maximum 84/90; inactive £0 draft |

The generator's summary counts the Google verification file as an `.html` output, hence “55 pages” in its log. The semantic checker correctly counts **54 actual documents**; the separate proof file remains byte-for-byte intact and outside the sitemap.

## Browser checks

The supervised internal static preview was exercised through the browser:

- Desktop response centre: branding, navigation, source dates and content hierarchy visually checked.
- Browser checker: unknown provider, vulnerable upstream and fixed upstream results checked.
- A complete fixed result also passed in the self-contained review preview; page routing and embedded-data loading were verified.
- Remediation wizard: visible step progression, checkbox count, Windows-specific guidance and WordPress guidance checked. The tool does not execute changes.
- Mobile frame at 375 CSS pixels: response-centre layout and version checker have equal document scroll width and viewport width; no horizontal overflow. Navigation opens with the correct expanded state and closes with Escape.
- Optional advisory updates: no request link before consent; explicit checkbox and preparation create only a `mailto:` draft. No email was opened or sent and no subscription was created.

This is focused browser and semantic QA, not a formal WCAG audit, screen-reader certification, penetration test or external professional code review. Chromium extension metadata errors were visible in browser logs; they are not treated as application failures.

## Preservation and pre-existing defects

The exact `site.config.json`, original logo, fonts, three services, £25/£35/£29 prices, 30/60/60-minute durations, Calendly URLs, calendar consent and production host remain unchanged.

Before this work, 3 of the 22 original tests failed because the Google ownership proof file was treated as a complete website document. The original generated-file check also failed: current generator metadata/footer details differed from the committed HTML. The test and semantic checker now distinguish a verification response from a content page. The source generator preserves the sister-business link actually present in the live snapshot, emits the real ownership meta token consistently, and adds the security footer route. The homepage gains a small resources banner; the privacy page describes the consent-first analytics and local-only security tools.

## Dependencies and security review

The static website introduces no npm runtime dependency. The Python utility has no third-party runtime dependency and performs no network access. Optional wheel packaging uses setuptools; PDF/graphic source regeneration uses the environment's reportlab/Pillow tools, which are not shipped as website or CLI runtime packages. No package was installed or downloaded to implement the response.

The new source uses no exploitation, credentials, URL scanning, shell execution of input, telemetry or automatic remediation. Local PHP execution is opt-in through two explicit flags, a fixed argument vector, no shell and a timeout. Source was reviewed for accidental credential patterns; intentionally public verification tokens and the retained GA ID are not secrets. A comprehensive upstream vulnerability audit of the entire editor/build environment is outside this record; do not treat this as a supply-chain certification.

## Not yet verified or authorised

- Production deployment and public HTTP status for the new paths. The local candidate is not a public release.
- Google Search Console/Bing account access, sitemap submission and indexing of the new pages. Prepared metadata and a sitemap do not establish indexing.
- Live GA4 DebugView ingestion after a production deployment. Consent/event behaviour was tested in an isolated harness; preview traffic is suppressed.
- External professional review, actual customer remediation, reach, leads or conversions. No outcome numbers are claimed.
- Production backup restoration/rollback. A source snapshot and Git history are retained, with a documented rollback procedure; no live restore was performed.
- Public opening of the utility repository. It stays private for review, and its hosted test job is skipped while private. Local tests pass; the workflow is ready to run after an approved public release/change.

All public claims need a source recheck before a delayed launch. The review-due date is 29 October 2026.

A direct HTTP status probe to executor loopback could not connect to the supervisor, which is browser-routed. This transport check is unverified; it is not counted as a page or download failure. Browser delivery and source-file checks passed. Public status/MIME checks remain required after an approved deployment.

## Hosted verification status

The candidate GitHub Actions jobs were created but could not start any steps because of an account-level runner restriction. No hosted CI success is claimed. Local tests and artifact checks pass as recorded above. The account restriction must be resolved and hosted checks/deployment availability verified before launch through GitHub. No account, permission, billing or paid-service configuration was changed.
