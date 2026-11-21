import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {cyberArticles,cyberLibraryFile} from '../scripts/cyber-library.mjs';
import {buildSite} from '../scripts/build.mjs';
const config=JSON.parse(readFileSync(new URL('../site.config.json',import.meta.url),'utf8'));
test('Bytova cybersecurity library creates exactly 50 distinct, useful printable HTML articles',()=>{
  assert.equal(cyberArticles.length,50);
  assert.equal(new Set(cyberArticles.map(a=>a.slug)).size,50);
  assert.equal(new Set(cyberArticles.map(a=>a.title)).size,50);
  const pages=buildSite(config);
  const index=pages.get(cyberLibraryFile);
  assert.ok(index?.includes('Practical, plain-English cybersecurity guides'));
  assert.ok(index.includes('cyber-card-grid'));
  assert.doesNotMatch(index,/\b50\s+(?:free\s+)?(?:individual\s+)?(?:guides|articles|tips)|fifty\s+individual/i);
  for(const a of cyberArticles){
    assert.equal(a.sections.length,4,a.slug);
    assert.equal(a.actions.length,3,a.slug);
    assert.ok(a.refs.length>0,a.slug);
    const html=pages.get('cyber-'+a.slug+'.html');
    assert.ok(html,a.slug+' missing');
    assert.ok(html.includes('<article class="cyber-article-content">'),a.slug);
    assert.ok(html.includes('cyber-library.css'),a.slug);
    assert.ok(html.includes('data-cyber-print'),a.slug);
    assert.doesNotMatch(html,/\b50\s+(?:guides|articles|tips)|guide\s+\d+\s+of\s+50/i,a.slug);
    assert.ok(html.includes('"@type":"TechArticle"'),a.slug);
    assert.ok(html.includes('href="./cybersecurity-library.html"'),a.slug);
    assert.equal((html.match(/<h1\b/g)||[]).length,1,a.slug);
    assert.equal((html.match(/class="cyber-copy-block"/g)||[]).length,4,a.slug);
  }
  assert.ok(pages.get('sitemap.xml').includes('cybersecurity-library.html'));
  assert.ok(pages.get('sitemap.xml').includes('cyber-learn-cybersecurity-ethically.html'));
});
