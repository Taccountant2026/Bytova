import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {buildSite} from '../scripts/build.mjs';
import {buildLegacyWarningPages,legacyWarningPaths} from '../scripts/legacy-warning-pages.mjs';

const config=JSON.parse(readFileSync('site.config.json','utf8'));
const content=buildSite(config);
const redirects=buildLegacyWarningPages(config,content);
const target='https://bytova.co.uk/unexpected-virus-warning.html';

test('only the three evidenced same-subject warning URLs receive recovery pages',()=>{
  assert.deepEqual([...redirects.keys()],[
    'blogs/bytova-home-advice/what-to-do-if-you-see-a-virus-warning-on-your-screen/index.html',
    'blogs/bytova-home-advice/how-to-spot-a-fake-virus-warning-on-your-computer/index.html',
    'blogs/bytova-home-advice/how-to-spot-a-fake-virus-pop-up-and-what-to-do/index.html',
  ]);
  for(const slug of ['why-is-my-wi-fi-slow-in-one-room-and-how-to-fix-it','how-to-set-up-a-new-laptop-without-losing-your-old-files','no-such-article','constructor']){
    assert.equal(redirects.has('blogs/bytova-home-advice/'+slug+'/index.html'),false);
  }
  assert.doesNotMatch(content.get('404.html'),/http-equiv="refresh"/);
});

test('recovery pages use an immediate fixed canonical destination with no script or input-derived target',()=>{
  for(const html of redirects.values()){
    assert.match(html,/<meta http-equiv="refresh" content="0;url=https:\/\/bytova\.co\.uk\/unexpected-virus-warning\.html">/);
    assert.ok(html.includes('<link rel="canonical" href="'+target+'">'));
    assert.equal(new URL(html.match(/content="0;url=([^"]+)"/)[1]).origin,'https://bytova.co.uk');
    assert.doesNotMatch(html,/<script\b|<iframe\b|<form\b|next=|returnTo=|location\./i);
  }
});

test('the fallback is branded, accessible and usable without JavaScript from a nested old URL',()=>{
  for(const [path,html] of redirects){
    assert.match(html,/<html lang="en-GB">/);
    assert.match(html,/<meta name="viewport"/);
    assert.match(html,/class="skip" href="#main"/);
    assert.match(html,/<main id="main"/);
    assert.equal([...html.matchAll(/<h1\b/g)].length,1);
    assert.match(html,/A sudden virus warning\? Pause before you click/);
    assert.match(html,/src="\/assets\/Bytova_Logo\.png" alt="Bytova" width="300" height="200"/);
    const base='https://bytova.co.uk/'+path;
    assert.equal(new URL('/unexpected-virus-warning.html',base).href,target);
    for(const match of html.matchAll(/(?:href|src)="(\/(?!\/)[^"]+)"/g)){
      assert.ok(existsSync('.'+new URL(match[1],base).pathname),match[1]);
    }
  }
});

test('recovery pages are excluded from the content sitemap and preserve the indexability gate',()=>{
  for(const path of legacyWarningPaths)assert.ok(!content.get('sitemap.xml').includes(path.replace(/\/index\.html$/,'')));
  const paused=structuredClone(config);paused.launch.indexable=false;
  for(const html of buildLegacyWarningPages(paused,buildSite(paused)).values()){
    assert.match(html,/content="noindex,nofollow"/);
    assert.doesNotMatch(html,/rel="canonical"/);
  }
});

test('a missing destination or a foreign canonical origin cannot produce a redirect',()=>{
  const missing=new Map(content);missing.delete('unexpected-virus-warning.html');
  assert.throws(()=>buildLegacyWarningPages(config,missing),/must exist/);
  for(const url of ['https://unrelated.example/','http://bytova.co.uk/','https://bytova.co.uk/unrelated/','https://bytova.co.uk/?next=https://unrelated.example']){
    const changed=structuredClone(config);changed.site.url=url;
    assert.throws(()=>buildLegacyWarningPages(changed,content),/canonical Bytova origin/);
  }
});
