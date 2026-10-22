"""Create the public source ZIP reproducibly, excluding caches and local files."""
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED

ROOT = Path(__file__).resolve().parents[1]
source = ROOT / 'php-security-audit'
target = ROOT / 'assets/security/downloads/php-security-audit.zip'
target.parent.mkdir(parents=True, exist_ok=True)
with ZipFile(target, 'w', compression=ZIP_DEFLATED, compresslevel=9) as archive:
    for path in sorted(source.rglob('*')):
        if not path.is_file() or any(part in {'__pycache__', '.git', '.venv'} for part in path.parts) or path.suffix in {'.pyc', '.pyo'}:
            continue
        info = ZipInfo('php-security-audit/' + path.relative_to(source).as_posix(), (2026, 10, 22, 0, 0, 0))
        info.compress_type = ZIP_DEFLATED
        info.external_attr = 0o100644 << 16
        archive.writestr(info, path.read_bytes())
print(f'Created {target.relative_to(ROOT)} ({target.stat().st_size} bytes)')
