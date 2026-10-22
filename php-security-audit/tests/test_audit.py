import contextlib
from datetime import date
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from php_security_audit.core import assess, parse_version, validate_data
from php_security_audit.__main__ import main

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / 'php_security_audit/data/advisories.json').read_text())
FIXTURES = json.loads((ROOT / 'tests/cases.json').read_text())

class AuditTests(unittest.TestCase):
    def test_shared_cases(self):
        for case in FIXTURES:
            with self.subTest(case=case['name']):
                self.assertEqual(assess(case['input'], DATA, date.fromisoformat(case.get('date', '2026-10-22')))['status'], case['status'])

    def test_bad_data_fails_closed(self):
        for d in [{}, {'schema_version': 90}, dict(DATA, review_due='2026-02-31')]:
            self.assertFalse(validate_data(d))
            self.assertEqual(assess({'version': '8.3.36', 'provider': 'upstream'}, d)['status'], 'unverified')

    def test_local_execution_needs_explicit_permission(self):
        with patch('php_security_audit.__main__.subprocess.run') as run, contextlib.redirect_stderr(io.StringIO()):
            self.assertEqual(main(['--inspect-local']), 3)
            run.assert_not_called()

    def test_manual_version_never_executes_php(self):
        with patch('php_security_audit.__main__.subprocess.run') as run, contextlib.redirect_stdout(io.StringIO()):
            main(['--php-version', '8.3.35', '--provider', 'upstream'])
            run.assert_not_called()

    def test_json_error_for_bad_input_file(self):
        out = io.StringIO()
        with contextlib.redirect_stdout(out):
            self.assertEqual(main(['--input-file', '/nonexistent/local-version.txt', '--json']), 3)
        self.assertEqual(json.loads(out.getvalue())['status'], 'error')

    def test_input_size_bound(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / 'version.txt'
            path.write_text('8.3.36' + ' ' * 20000)
            with contextlib.redirect_stdout(io.StringIO()):
                self.assertEqual(main(['--input-file', str(path), '--json']), 3)

    def test_no_url_or_payload_input(self):
        for version in ['https://example.com', '8.3.36; whoami', '', '8.3', '08.3.36', '8.3.36x']:
            self.assertIsNone(parse_version(version))

    def test_fixed_argv_local_version_inspection(self):
        from types import SimpleNamespace
        with patch('php_security_audit.__main__.shutil.which', return_value='/usr/bin/php'), patch('php_security_audit.__main__.subprocess.run', return_value=SimpleNamespace(stdout=b'PHP 8.3.36 (cli)')) as run, contextlib.redirect_stdout(io.StringIO()):
            main(['--inspect-local', '--allow-local-execution', '--provider', 'upstream'])
            self.assertEqual(run.call_args.args[0], ['/usr/bin/php', '-n', '-v'])
            self.assertFalse(run.call_args.kwargs.get('shell', False))
            self.assertEqual(run.call_args.kwargs['timeout'], 5)

if __name__ == '__main__':
    unittest.main()
