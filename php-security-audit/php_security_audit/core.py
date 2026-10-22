"""Conservative, snapshot-bound PHP and exact vendor-package assessment."""
from datetime import date
import re

VERSION = re.compile(r"^(?:PHP\s+)?(0|[1-9]\d?)\.(0|[1-9]\d?)\.(0|[1-9]\d{0,3})([-+~][A-Za-z0-9.+:~_-]+|(?:RC|alpha|beta)\d+)?(?=\s|$)", re.I)

def parse_version(raw):
    if not isinstance(raw, str) or len(raw) > 16384:
        return None
    s = raw.strip()
    m = VERSION.match(s)
    if not m:
        return None
    rest = s[m.end():]
    if rest and not re.match(r"^\s+\((?:cli|fpm-fcgi|cgi-fcgi|apache2handler|built:)", rest, re.I):
        return None
    if re.search(r"\bPHP\s+\d+\.\d+\.\d+", rest, re.I):
        return None
    parts = tuple(map(int, m.group(1, 2, 3)))
    return {"version": ".".join(map(str, parts)), "parts": parts, "suffix": m.group(4) or ""}

def validate_data(d):
    try:
        def valid_date(s):
            return isinstance(s, str) and date.fromisoformat(s).isoformat() == s
        if d["schema_version"] != 1 or not valid_date(d["reviewed"]) or not valid_date(d["review_due"]) or d["review_due"] < d["reviewed"]:
            return False
        if len(d["scope"]) != 2 or not all(re.fullmatch(r"CVE-\d{4}-\d{4,}", s) for s in d["scope"]):
            return False
        if not isinstance(d["upstream"], dict) or not d["upstream"] or not isinstance(d["sources"], list) or not d["sources"] or not isinstance(d["vendor_fixes"], list):
            return False
        ids = {s["id"] for s in d["sources"]}
        if len(ids) != len(d["sources"]) or any(not s["url"].startswith("https://") or not valid_date(s["reviewed"]) for s in d["sources"]):
            return False
        for branch, b in d["upstream"].items():
            f, latest = parse_version(b["fixed"]), parse_version(b["latest_verified"])
            if not f or not latest or f["suffix"] or latest["suffix"] or not valid_date(b["security_until"]):
                return False
            if f["version"].rsplit(".", 1)[0] != branch or latest["version"].rsplit(".", 1)[0] != branch or f["parts"] > latest["parts"]:
                return False
        for v in d["vendor_fixes"]:
            if not all(v[k] for k in ["vendor", "os_release", "package", "version", "source_ids"]) or not parse_version(v["version"]) or any(i not in ids for i in v["source_ids"]):
                return False
        return True
    except (KeyError, TypeError, ValueError, AttributeError):
        return False

def assess(info, data, today=None):
    today = date.today() if today is None else today
    p = parse_version(info.get("version"))
    base = dict(status="unverified", reason="The advisory data could not be validated. Consult PHP and your vendor.", scope=data.get("scope", []), dataset=data.get("dataset_id", "invalid"), reviewed=data.get("reviewed"), review_due=data.get("review_due"), version=p["version"] if p else None, source_urls=[], limitations="This checks two advisories only. It cannot prove that a system is secure, exposed, or compromised. Verify the running web PHP, every worker, container and installed package.")
    if not validate_data(data):
        return base
    base["source_urls"] = [s["url"] for s in data["sources"] if s["id"] in {"php", "ghsa-618", "ghsa-619", "support"}]
    if not p:
        return dict(base, reason="Enter a complete PHP version such as 8.3.36, or a PHP -v output. Commands and URLs are not accepted.", input_valid=False)
    base["input_valid"] = True
    if not isinstance(today, date) or today.isoformat() < data["reviewed"]:
        return dict(base, reason="The current date is invalid or earlier than this advisory snapshot. Recheck the data and system clock.")
    stale = today.isoformat() > data["review_due"]
    b = data["upstream"].get(p["version"].rsplit(".", 1)[0])
    provider = info.get("provider", "unknown")
    base["upstream_support"] = "supported" if b and today.isoformat() <= b["security_until"] else "unsupported"
    if provider not in {"upstream", "vendor", "unknown"}:
        return dict(base, reason="Choose a valid installation source.")
    if provider == "vendor":
        v = next((v for v in data["vendor_fixes"] if all(v[k] == info.get(k) for k in ["vendor", "os_release", "package"]) and v["version"] == info.get("package_version")), None)
        if v:
            if parse_version(v["version"])["version"] != p["version"]:
                return dict(base, reason="The PHP version and vendor package do not match. Check the runtime used by the website.")
            base["source_urls"] += [s["url"] for s in data["sources"] if s["id"] in v["source_ids"]]
            return dict(base, status="unverified" if stale else "patched", reason="This exact vendor fix was verified previously, but the data review is overdue. Recheck the vendor advisory." if stale else "Exact vendor, OS release and package revision match a verified fix for both advisories. Confirm that this package actually serves the website; upstream support is a separate question.", basis="exact-vendor-package", stale=stale)
        return dict(base, reason="Vendor patch status is unverified. An older PHP number may contain a backported fix. Compare your exact OS release, package and revision with both vendor CVE records.", basis="vendor-review-required", stale=stale)
    if not b:
        if p["parts"][:2] < (8, 2):
            return dict(base, status="unsupported", reason="This branch has no PHP-project security support. Ask your vendor about both CVEs and maintained backports, or migrate to a supported branch. Unsupported does not prove compromise.", stale=stale)
        return dict(base, reason="This branch is outside the verified snapshot. Do not infer that a new or pre-release branch is safe.", stale=stale)
    if today.isoformat() > b["security_until"]:
        return dict(base, status="unsupported", reason="PHP-project security support for this branch has ended. Check vendor maintenance and plan a supported upgrade.", stale=stale)
    if provider != "upstream" or p["suffix"]:
        return dict(base, reason="The installation source or build suffix needs vendor verification. Select an unmodified upstream release only when that is confirmed.", stale=stale)
    if p["parts"] < tuple(map(int, b["fixed"].split("."))):
        return dict(base, status="vulnerable", reason=f"This upstream release is below {b['fixed']}, the fixed release for this branch. Apply a supported official update promptly and assess exposure.", fixed=b["fixed"], stale=stale)
    if p["parts"] > tuple(map(int, b["latest_verified"].split("."))):
        return dict(base, reason="This release is newer than the latest version verified in this snapshot. Check the current official release notes.", stale=stale)
    return dict(base, status="unverified" if stale else "patched", reason="This fixed release was verified previously, but the data review is overdue. Recheck the official advisories." if stale else "This upstream release includes the fixes for the two listed advisories. It is not a general security certificate or a compromise assessment.", fixed=b["fixed"], stale=stale)
