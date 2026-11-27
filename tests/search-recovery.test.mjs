import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {buildSite} from '../scripts/build.mjs';
import {legacyPages} from '../scripts/legacy-pages.mjs';

const pages = buildSite(JSON.parse(readFileSync('site.config.json','utf8')));
const sitemap = new Set([...pages.get('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]));
test('each historic route serves equivalent indexable content and names a direct sitemap destination', () => {
  for (const [alias, target] of Object.entries(legacyPages)) {
    const source = pages.get(alias);
    const canonical = 'https://bytova.co.uk/'+target;
    assert.ok(sitemap.has(canonical), target);
    assert.ok(!sitemap.has('https://bytova.co.uk/'+alias.replace(/index\.html$/, '')), alias);
    assert.ok(source.includes('<base href="/">'), alias);
    assert.equal(source.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)?.[0], pages.get(target).match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)?.[0], alias);
    assert.deepEqual([...source.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map(m=>m[1]), [canonical]);
    assert.equal(source.includes('http-equiv="refresh"'), false, alias);
  }
});
test('shop authentication, retired search, feeds and private resources stay outside the public sitemap', () => {
  for (const url of sitemap) {
    assert.doesNotMatch(url,/\/customer_authentication\/|\/services\/login_with_shop\/|\/cdn\/shop\/|\.atom$|\/search$|\/assets\/|[?#]/);
  }
  assert.ok(pages.get('charity-it-support.html').includes('href="./cyber-protect-online-charity-donations.html"'));
});
