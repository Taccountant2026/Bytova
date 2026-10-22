"""Build a self-contained local review preview; it never deploys a website."""
import argparse
import base64
import html
import json
import mimetypes
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
FILES = ['security.html', 'php-security-advisory.html', 'php-patches.html', 'php-version-checker.html', 'php-remediation-guide.html', 'security-incident-resources.html', 'security-assistance.html', 'php-security-explained.html', 'security-sources.html']

def data_url(path):
    kind = mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
    return 'data:' + kind + ';base64,' + base64.b64encode(path.read_bytes()).decode()

def build(output):
    css = '\n'.join((ROOT / name).read_text() for name in ['site.css', 'catalogue.css', 'funnels.css', 'security.css'])
    css = re.sub(r"url\(['\"]?(\./assets/[^)'\"\s]+)['\"]?\)", lambda m: "url('" + data_url(ROOT / m[1][2:]) + "')", css)
    core = (ROOT / 'php-security-core.mjs').read_text().replace('export function ', 'function ')
    tools = (ROOT / 'security-tools.mjs').read_text()
    tools = tools.replace("import {assess,validateData} from './php-security-core.mjs';", '')
    old = "await fetch(new URL('./assets/security/advisories.json',import.meta.url),{credentials:'omit',cache:'no-store'})"
    assert old in tools
    dataset = json.loads((ROOT / 'assets/security/advisories.json').read_text())
    tools = tools.replace(old, "{ok:true,json:async()=>(" + json.dumps(dataset) + ")}")
    router = "document.addEventListener('click',event=>{const a=event.target.closest?.('a[data-preview-page]');if(a){event.preventDefault();parent.postMessage({type:'bytova-preview-page',file:a.dataset.previewPage},'*');}});"
    scripts = (ROOT / 'site.js').read_text() + '\n' + core + '\n' + tools + '\n' + router
    pages = {}
    for name in FILES:
        content = (ROOT / name).read_text()
        content = re.sub(r'<script\b[^>]*\bsrc="[^"]+"[^>]*></script>', '', content)
        content = re.sub(r'<link\b(?=[^>]*\brel="(?:stylesheet|preload)")[^>]*>', '', content)
        content = content.replace('content="index,follow"', 'content="noindex,nofollow"')
        content = content.replace('</head>', '<style>' + css + '</style></head>')
        content = content.replace('./assets/Bytova_Logo.png', data_url(ROOT / 'assets/Bytova_Logo.png'))
        def rewrite(m):
            value = html.unescape(m[1])
            if not value.startswith('./'):
                return m[0]
            rel = value[2:]
            file = rel.split('#')[0].split('?')[0]
            if file in FILES:
                return 'href="#' + file + '" data-preview-page="' + file + '"'
            if file.startswith('assets/security/downloads/'):
                path = ROOT / file
                return 'href="' + data_url(path) + '" download="' + path.name + '"'
            return 'href="https://bytova.co.uk/' + html.escape(rel, quote=True) + '" target="_blank" rel="noopener"'
        content = re.sub(r'href="([^"<>]+)"', rewrite, content)
        content = content.replace(' download download=', ' download=')
        # Duplicate boolean download is harmless in HTML but avoid it in the review artifact.
        content = re.sub(r'(download="[^"]+")\s+download\b', r'\1', content)
        content = content.replace('</body>', '<script type="module">' + scripts.replace('</script', '<\\/script') + '</script></body>')
        pages[name] = content
    serial = json.dumps(pages, ensure_ascii=False).replace('<', '\\u003c').replace('>', '\\u003e')
    outer = '''<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Bytova Security Response — local review preview</title><style>*{box-sizing:border-box}body{margin:0;background:#f5f7fa;color:#0a1a5c;font:14px system-ui,sans-serif}.review{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;padding:12px 18px;background:#eaf3ff;border-bottom:1px solid #c9d9ed}.review strong{font-size:13px}.review span{font-size:12px}.review a{color:inherit;font-weight:700}iframe{display:block;width:100%;height:calc(100vh - 60px);border:0;background:#fff}</style></head><body><aside class="review" aria-label="Preview status"><strong>BYTOVA / LOCAL REVIEW PREVIEW</strong><span>Nothing is deployed. Checker inputs stay local. Optional analytics are disabled in this preview.</span><a href="#security.html">Response centre</a></aside><iframe id="view" title="Bytova security resource preview" sandbox="allow-scripts allow-forms allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"></iframe><script id="pages" type="application/json">PAGES_JSON</script><script>const pages=JSON.parse(document.getElementById('pages').textContent),frame=document.getElementById('view');function render(){const file=location.hash.slice(1)||'security.html';frame.srcdoc=pages[file]||pages['security.html'];}window.addEventListener('hashchange',render);window.addEventListener('message',event=>{if(event.source===frame.contentWindow&&event.data?.type==='bytova-preview-page'&&Object.hasOwn(pages,event.data.file)){location.hash=event.data.file;}});render();</script></body></html>'''
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(outer.replace('PAGES_JSON', serial), encoding='utf-8')
    print(json.dumps({'preview': str(output), 'bytes': output.stat().st_size, 'embedded_pages': len(pages), 'analytics': 'disabled', 'deployment': 'none'}))

if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('output', type=Path)
    build(p.parse_args().output)
