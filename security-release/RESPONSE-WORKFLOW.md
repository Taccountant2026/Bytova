# Reusable vulnerability response workflow

This workflow applies to future PHP, WordPress, Apache, OpenSSL, Linux or Windows advisories. The code/data release path remains human-gated; no scheduled collector is configured to publish an alert.

| State | Required evidence | Exit condition |
|---|---|---|
| Received | Original project/vendor advisory URL and UTC retrieval time | Source is identified; untrusted forwarded claims remain leads |
| Verifying | CVE/GHSA identifiers, publication dates, affected range, fixed releases, vendor exceptions | Primary evidence supports each intended claim |
| Draft | Plain-language meaning, technical scope, exploitation status and explicit uncertainties | Affected products and users are stated carefully |
| Review | Data diff, safe remediation guidance, attribution and incident-escalation boundaries | Owner/qualified reviewer accepts content and limitations |
| Testing | Boundary cases, invalid input, backports, date expiry, privacy, accessibility, downloads, prior services | Required checks pass with recorded evidence |
| Awaiting approval | Exact commit/artifact, rollback point and publication destinations | Owner explicitly approves the specific release |
| Released | Successful deployment, correct live files and source hashes | Actual public checks pass; no claim of indexing without search-engine evidence |
| Monitoring | Upstream/vendor changes, corrections, source-review due date and actual user outcomes | Update, correction or closure is documented |

## Advisory record

For each response, record:

- Product/runtime and authoritative identifiers.
- Primary source URL, publisher, publication/update date, retrieval date and source-specific uncertainty.
- Affected ranges by supported branch, verified fixes, package vendor and release-specific backports.
- CVSS system/version and publisher; do not mix scores from different authorities silently.
- Exploitation evidence type: possible impact, research demonstration, observed attempt, confirmed successful compromise, or unknown. Attribute each to its source and date.
- Operational mitigation limits, complete remediation, runtime/process validation and incident-escalation route.
- Data revision, reviewer, review date, next review, tests, release approval and publication record.

## Data update controls

Keep JSON data separate from the comparison engine. Schema-check data, compare verified minimum and latest-reviewed releases, and add regression fixtures before shipping a threshold change. Do not silently treat an unreviewed future version as safe. Package fixes require the right distribution, OS, source package and full revision. Use a vendor's native version semantics when adding version ordering; otherwise keep exact matching and return unverified.

The PHP website/CLI copies and fixture copies must remain identical. Positive results fail closed when the dataset needs review. A known vulnerable upstream release remains flagged. State what the review-date rule does so visitors do not mistake a local snapshot for a live service.

## Monitoring and communications

Recheck official sources before launch and at the review-due date. No automation or reminder was created: the task is an implementation request, not permission to schedule new background work. If an unattended monitor is later requested, let it collect candidate changes and notify a reviewer; require human approval before publishing claims, changing thresholds or emailing people.

Use consented topic-specific updates only, honour withdrawal, avoid scraped contact lists and never imply that a reader is compromised. Respect each community's current rules and disclose Bytova's involvement. Do not submit security reports or contact affected organisations without explicit owner authorisation.

## Correction procedure

Pause inaccurate campaign copy, preserve the prior record, verify the correction with primary sources, explain the change in plain English and update data/content/tests together. Release the correction through the same approval path. Notify only people who requested relevant updates, after approval. Never erase a material uncertainty to make a result look more reassuring.
