# Bytova PHP Security Response 2026

Prepared 22 October 2026. A defensive engineering and public-education project, pending owner release approval.

## The problem

A widely used runtime received two critical security fixes. A small-business website owner needed a clear route from the official advisory to the person who could safely update the actual running service. A simple upstream-version comparison could misclassify a maintained distribution package with a backported fix, and a positive result could be mistaken for a guarantee of security.

## The work

The project prepares a static response centre integrated with Bytova’s existing site, a client-side version checker, a guided remediation checklist, printable incident resources and a Python auditing utility. The advisory data is separate from application logic and includes source URLs, checked dates, branch support windows and selected exact vendor-package fixes.

The intended user journey makes the information and downloads available before any optional commercial enquiry. No account or credentials are needed for a version check. The tool does not send scan traffic to a visitor’s website or determine whether compromise occurred. An existing everyday support appointment is not presented as a specialist incident-response service.

## Engineering decisions to demonstrate

- Keep the site static and preserve the existing services, prices, booking mappings and consent flow.
- Treat an unknown installation source, unrecognised package or newer unreviewed release as unverified.
- Check the complete vendor context rather than discarding a distribution suffix.
- Keep positive classifications tied to a dated review window.
- Explain that installed package files, command-line PHP and running web workers are separate evidence points.
- Separate routine patching from incident response and preserve relevant evidence when compromise is suspected.
- Keep campaign copy factual and distribution optional, with no automatic alert publishing or paid activation.

## Verification evidence

Use the final project QA report for actual automated-test counts, browser checks, link checks and unresolved limits. Do not copy a number from a draft. The campaign generator validates text bounds and exports exact PNG and SVG assets. Its final asset report and contact sheet are included for review.

At the time this case-study draft was written, no public reach, independent code review, customer remediation, search indexing, campaign conversion or revenue outcome had been established by the campaign work. Those are future observations to record, not achievements to imply.

## Limits and next steps

This is a limited advisory comparison, not an enterprise scanner, incident investigation or security certification. The exact package snapshot needs maintenance. Wider vendor coverage should be added only with current official evidence and corresponding tests. External reviewers can help assess technical accuracy, accessibility and the failure modes of a simple version-based tool.

After owner approval, release the reviewed branch and publish an accurate changelog. Invite bounded external review through the confirmed repository. Record actual feedback, accepted contributions and measured use in the outcomes ledger, while keeping customer incident information private.

## Credit

The original vulnerabilities and fixes belong to their credited researchers and PHP remediation developers. Bytova’s contribution is the educational response workflow, cautious comparison tools, clear remediation resources and transparent limits. No affiliation with or endorsement by PHP, NCSC, CISA or a vendor is claimed.
