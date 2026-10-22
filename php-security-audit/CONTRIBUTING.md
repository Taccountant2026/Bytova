# Contributing

Useful contributions include source corrections, vendor package evidence, accessibility feedback and boundary tests. Prefer a focused change with a small, reviewable explanation.

For advisory data, cite the primary vendor/project source, its publication or update date, retrieval date, exact affected branch, package and OS release. Verify both CVEs. Do not extrapolate package ordering across distributions. Keep application logic separate from data and preserve fail-closed behaviour for unverified inputs.

Run `python -m unittest discover -s tests -v`. In the parent website project also run `npm test` for cross-language parity. Update the browser and CLI datasets and fixtures together. Do not add network scanning, telemetry, credentials, exploit payloads or automatic remediation.

Never include customer evidence or claim a third party is compromised. Security defects should follow `SECURITY.md`. Publication of advisory changes requires human approval after source and test review.
