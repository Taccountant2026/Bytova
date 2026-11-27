import assert from 'node:assert/strict';
import {setTimeout as wait} from 'node:timers/promises';
import {legacyPages} from './legacy-pages.mjs';

const origin = 'https://bytova.co.uk/';
async function verify() {
  const sitemap = await fetch(origin+'sitemap.xml');
  assert.equal(sitemap.status,200);
  const xml = await sitemap.text();
  const robots = await fetch(origin+'robots.txt');
  assert.equal(robots.status,200);
  assert.ok((await robots.text()).includes('Sitemap: '+origin+'sitemap.xml'));
  for (const alias of ['pages/home-support','products/one-to-one-technology-lesson','pages/refund-and-cancellation-policy']) {
    const target = legacyPages[alias+'/index.html'];
    const location = await fetch(origin+alias,{redirect:'manual'});
    assert.ok([301,308].includes(location.status), alias+' initial '+location.status);
    assert.equal(new URL(location.headers.get('location'),origin).href,origin+alias+'/');
    for (const path of [alias+'/',target]) {
      const page = await fetch(origin+path,{redirect:'manual'});
      assert.equal(page.status,200,path);
      assert.ok((await page.text()).includes('<link rel="canonical" href="'+origin+target+'">'),path);
    }
    assert.ok(xml.includes('<loc>'+origin+target+'</loc>'), target);
    assert.ok(!xml.includes('<loc>'+origin+alias+'/</loc>'),alias);
  }
  const missing = await fetch(origin+'by-site-quality-check-missing-1127',{redirect:'manual'});
  assert.equal(missing.status,404);
}
for (let attempt=1; ; attempt++) {
  try { await verify(); console.log('Production routes, canonical targets, sitemap, robots and 404 response verified.'); break; }
  catch (error) { if (attempt===5) throw error; console.warn(error.message); await wait(15000); }
}
