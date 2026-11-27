import assert from 'node:assert/strict';
import {setTimeout as wait} from 'node:timers/promises';
import {legacyPages} from './legacy-pages.mjs';

const origin = 'https://bytova.co.uk/';
const canonicalOf = target => '<link rel="canonical" href="'+origin+target+'">';
async function get(path, options={}) {
  return fetch(new URL(path,origin), {signal:AbortSignal.timeout(15000), ...options});
}
async function verify() {
  const sitemap = await get('sitemap.xml');
  assert.equal(sitemap.status,200);
  const xml = await sitemap.text();
  const urls = new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]));
  const robots = await get('robots.txt');
  assert.equal(robots.status,200);
  assert.ok((await robots.text()).includes('Sitemap: '+origin+'sitemap.xml'));
  assert.equal(urls.size,[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].length,'duplicate sitemap entry');
  const targets = new Map();
  async function verifyTarget(target) {
    if (!targets.has(target)) targets.set(target,(async()=>{
      assert.ok(urls.has(origin+target),target+' absent from sitemap');
      const page=await get(target,{redirect:'manual'});
      assert.equal(page.status,200,target);
      const html=await page.text();
      assert.ok(html.includes(canonicalOf(target)),target+' incorrect canonical');
      assert.doesNotMatch(html,/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i,target+' noindex');
    })());
    return targets.get(target);
  }
  const aliases=Object.entries(legacyPages);
  for(let i=0;i<aliases.length;i+=6){
    await Promise.all(aliases.slice(i,i+6).map(async ([file,target])=>{
      const alias=file.replace(/\/index\.html$/,'');
      const response=await get(alias,{redirect:'manual'});
      assert.ok([301,308].includes(response.status),alias+' initial '+response.status);
      assert.equal(new URL(response.headers.get('location'),origin).href,origin+alias+'/');
      const page=await get(alias+'/',{redirect:'manual'});
      assert.equal(page.status,200,alias+'/');
      assert.ok((await page.text()).includes(canonicalOf(target)),alias+' incorrect canonical');
      assert.ok(!urls.has(origin+alias+'/'),alias+' must not be in sitemap');
      await verifyTarget(target);
    }));
  }
  await verifyTarget('cyber-protect-online-charity-donations.html');
  const charity=await get('charity-it-support.html');
  assert.equal(charity.status,200);
  assert.ok((await charity.text()).includes('href="./cyber-protect-online-charity-donations.html"'));
  const queryAlias=await get('products/one-to-one-technology-lesson?_pos=1&_sid=961f4648e&_ss=r');
  assert.equal(queryAlias.status,200,'historic query variant');
  assert.ok((await queryAlias.text()).includes(canonicalOf(legacyPages['products/one-to-one-technology-lesson/index.html'])));
  const missing=await get('by-site-quality-check-missing-1127',{redirect:'manual'});
  assert.equal(missing.status,404);
  for(const url of urls) assert.doesNotMatch(url,/\/customer_authentication\/|\/services\/login_with_shop\/|\/cdn\/shop\/|\.atom$|\/search$|\/assets\/|[?#]/);
  console.log('Verified '+aliases.length+' historic aliases, '+targets.size+' canonical destinations, sitemap, robots and true 404.');
}
for(let attempt=1;;attempt++){
  try{await verify();break;}
  catch(error){if(attempt===5)throw error;console.warn(error.message);await wait(15000);}
}
