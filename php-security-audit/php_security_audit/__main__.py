"""Usage: python -m php_security_audit --php-version 8.3.36 --provider upstream"""
import argparse
import json
from pathlib import Path
import shutil
import subprocess
import sys
from .core import assess, validate_data

MAX_BYTES = 16384

def main(argv=None):
    p = argparse.ArgumentParser(description="Offline PHP advisory checker. No scan, telemetry or automatic updates.")
    source = p.add_mutually_exclusive_group(required=True)
    source.add_argument("--php-version", help="Complete PHP version or local php -v output")
    source.add_argument("--input-file", type=Path, help="UTF-8 text containing local version information; maximum 16 KiB")
    source.add_argument("--inspect-local", action="store_true", help="Run the installed php executable with -n -v; needs --allow-local-execution")
    p.add_argument("--allow-local-execution", action="store_true", help="Explicit permission to execute local PHP for version inspection only")
    p.add_argument("--provider", choices=["upstream", "vendor", "unknown"], default="unknown")
    p.add_argument("--vendor", default="")
    p.add_argument("--os-release", default="")
    p.add_argument("--package", default="")
    p.add_argument("--package-version", default="")
    p.add_argument("--data", type=Path, help="Review a local replacement advisory JSON; it is not downloaded or authenticated by this tool")
    p.add_argument("--json", action="store_true", help="Machine-readable JSON report on stdout")
    a = p.parse_args(argv)
    try:
        if a.allow_local_execution and not a.inspect_local:
            raise ValueError("--allow-local-execution is only valid with --inspect-local")
        if a.inspect_local:
            if not a.allow_local_execution:
                raise ValueError("Local PHP execution requires --allow-local-execution")
            executable = shutil.which("php")
            if not executable:
                raise ValueError("PHP was not found on PATH; supply --php-version instead")
            # Fixed argv, no shell, no php.ini or extensions, and a bounded timeout.
            result = subprocess.run([executable, "-n", "-v"], capture_output=True, timeout=5, check=True)
            if len(result.stdout) > MAX_BYTES:
                raise ValueError("PHP version output exceeds 16 KiB")
            version = result.stdout.decode("utf-8")
        elif a.input_file:
            with a.input_file.open("rb") as stream:
                raw = stream.read(MAX_BYTES + 1)
            if len(raw) > MAX_BYTES:
                raise ValueError("Input exceeds 16 KiB")
            version = raw.decode("utf-8")
        else:
            version = a.php_version
        path = a.data or Path(__file__).with_name("data") / "advisories.json"
        with path.open("rb") as stream:
            raw = stream.read(1024 * 1024 + 1)
        if len(raw) > 1024 * 1024:
            raise ValueError("Advisory data exceeds 1 MiB")
        data = json.loads(raw)
        if not isinstance(data, dict) or not validate_data(data):
            raise ValueError("Advisory data failed schema validation")
        report = assess(dict(version=version, provider=a.provider, vendor=a.vendor, os_release=a.os_release, package=a.package, package_version=a.package_version), data)
        if a.json:
            print(json.dumps(report, indent=2))
        else:
            print(f"{report['status'].upper()}: PHP {report['version'] or 'unrecognised'}")
            print(report["reason"])
            print(f"Data reviewed {report['reviewed']}; review due {report['review_due']}.")
            print(report["limitations"])
            for url in report["source_urls"]:
                print(url)
        return 0 if report["status"] == "patched" else 1 if report["status"] in {"vulnerable", "unsupported"} else 2
    except (OSError, ValueError, UnicodeError, subprocess.SubprocessError) as exc:
        if a.json:
            print(json.dumps({"status": "error", "error": str(exc)}))
        else:
            print(f"Error: {exc}", file=sys.stderr)
        return 3

if __name__ == "__main__":
    raise SystemExit(main())
