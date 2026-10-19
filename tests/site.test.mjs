import test from 'node:test';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {strict as assert} from 'node:assert';
import {buildSite} from '../scripts/build.mjs';
const config=JSON.parse(readFileSync('site.config.json','utf8'));
const pages=buildSite(config);
const html=[...pages].filter(([name])=>name.endsWith('.html'));

test('catalogue is exactly the three agreed bounded services with unchanged total prices',()=>{
 assert.deepEqual(config.services.map(s=>[s.id,s.name,s.price,s.minutes]),[
  ['remote-tech-help','Remote Tech Help',25,30],
  ['setup-getting-started','Setup & Getting Started',35,60],
  ['computer-care-safety-check','Computer Care & Safety Check',29,60],
 ]);
 assert.equal(new Set(config.services.map(s=>s.id)).size,3);
 for(const s of config.services){assert(existsSync(s.file));assert.match(pages.get(s.file),/What’s included/);assert.match(pages.get(s.file),/What’s outside this appointment/);assert.match(pages.get(s.file),/Before we start/);}
});

test('both independent launch gates are required for every online booking route',()=>{
 for(const enabled of[false,true])for(const verified of[false,true]){
  const variant=structuredClone(config);variant.launch.onlineBookingEnabled=enabled;variant.launch.livePaymentsVerified=verified;
  const page=buildSite(variant).get('book.html');
  const data=JSON.parse(page.match(/<script id="booking-config" type="application\/json">(.*?)<\/script>/s)[1]);
  const permitted=enabled&&verified;
  assert.equal(data.enabled,permitted,`flags ${enabled}/${verified}`);
  assert.equal(page.includes('data-booking-consent'),permitted);
  assert.equal(/href="https:\/\/calendly\.com\//.test(page),permitted);
  if(!permitted){assert.match(page,/data-booking-email/);assert.match(page,/mailto:hello@bytova\.co\.uk/);assert.doesNotMatch(page,/data-load-calendar/);}
  assert.doesNotMatch(page,/<iframe\b/,'No calendar request before opt-in');
 }
});

test('booking endpoints are exactly the three verified retained Calendly mappings',()=>{
 assert.deepEqual(config.services.map(s=>s.calendlyUrl),[
  'https://calendly.com/leighton-hepworth22/bytova-remote-computer-help',
  'https://calendly.com/leighton-hepworth22/bytova-pc-speed-up',
  'https://calendly.com/leighton-hepworth22/bytova-windows-security-check',
 ]);
 const js=readFileSync('site.js','utf8');
 assert.match(js,/if \(!consent\.checked \|\| !config\.enabled\) return/);
 assert.match(js,/calendarContainer\.replaceChildren\(\)/);
 assert.doesNotMatch(js,/fetch\(|localStorage|sessionStorage/);
});

test('website has no store dependency, subscriptions, downloads, tracking, or fake contact form',()=>{
 for(const[name,page]of html){
  const body=page.match(/<body>[\s\S]*<\/body>/)?.[0]||page;
  assert.doesNotMatch(body,/https?:\/\/(?:www\.)?bytova\.co\.uk\//i,name);
  assert.doesNotMatch(page,/shopify|\/products\/|\/collections\/|newsletter|support plan|retroreplay|header-actions|<form\b/i,name);
  assert.doesNotMatch(page,/<script[^>]+src="https?:|rel="preconnect"[^>]+calendly/i,name);
 }
 assert.match(pages.get('contact.html'),/mailto:hello@bytova\.co\.uk/);
 assert.match(pages.get('contact.html'),/Leighton Liam Hepworth/);
});

test('uploaded brand logo is a valid local PNG on every page',()=>{
 assert.deepEqual([...readFileSync('assets/Bytova_Logo.png').subarray(0,8)],[137,80,78,71,13,10,26,10]);
 for(const[name,page]of html){assert.match(page,/assets\/Bytova_Logo\.png/,name);assert.doesNotMatch(page,/bytova-logo\.jpg/,name);}
});

test('cancellation provides full pre-start refund and correctly separates early-start request from completed-service acknowledgement',()=>{
 const page=pages.get('cancellations.html');
 assert.match(page,/starting the day after the service contract is made/);
 assert.match(page,/at any time before the session starts for a full refund/);
 assert.match(page,/right is not lost simply because work begins/);
 assert.match(page,/within 14 days of being told of the cancellation/);
 assert.match(page,/Model cancellation form/);
 assert.match(page,/I explicitly request that you begin this service/);
 const early=[...page.matchAll(/href="(mailto:[^"]+)"/g)].map(m=>m[1]).find(v=>v.includes('Request%20to%20start'));
 assert(early);const decoded=decodeURIComponent(early.replaceAll('&amp;','&'));assert(decoded.includes('\n\n'));assert(decoded.includes('once the service is fully performed'));
});

test('legal identity, safety, privacy and consumer remedies are present without invented guarantees',()=>{
 for(const name of['terms.html','privacy.html','contact.html'])assert.match(pages.get(name),/65 Coronation Road/);
 assert.match(pages.get('terms.html'),/reasonable care and skill/);
 assert.match(pages.get('terms.html'),/repeat performance or a price reduction/);
 assert.match(pages.get('privacy.html'),/controller/);
 assert.match(pages.get('privacy.html'),/12 months/);
 assert.match(pages.get('privacy.html'),/six years/);
 assert.match(pages.get('remote-support-safety.html'),/AnyDesk/);
 assert.match(pages.get('computer-care-safety-check.html'),/does not guarantee/);
 assert.doesNotMatch(html.map(([,p])=>p).join(''),/Provisional customer information|unpublished development preview|guaranteed virus-free/i);
});

test('responsive navigation and reduced-motion/print support are retained',()=>{
 const css=readFileSync('site.css','utf8');const js=readFileSync('site.js','utf8');
 assert.match(css,/@media\(max-width:900px\)/);assert.match(css,/@media\(max-width:650px\)/);
 assert.match(css,/prefers-reduced-motion/);assert.match(css,/@media print/);
 assert.match(js,/Escape/);
 for(const[name,page]of html){assert.match(page,/aria-expanded="false"/,name);assert.match(page,/aria-controls="primary-nav"/,name);}
});

test('indexing follows the separate domain launch flag',()=>{
 if(!config.launch.livePaymentsVerified){assert.equal(config.launch.onlineBookingEnabled,false);assert.equal(config.launch.indexable,false);}
 if(!config.launch.indexable){assert.match(pages.get('robots.txt'),/Disallow: \//);for(const[,page]of html)assert.match(page,/noindex,nofollow/);}
});


test('active booking page exposes the approved calendar choices with consent and email fallback',()=>{
 if(!config.launch.onlineBookingEnabled||!config.launch.livePaymentsVerified)return;
 const page=pages.get('book.html');
 const data=JSON.parse(page.match(/<script id="booking-config" type="application\/json">(.*?)<\/script>/s)[1]);
 assert.equal(data.enabled,true);
 assert.deepEqual(data.services.map(s=>[s.name,s.price,s.minutes,s.url]),config.services.map(s=>[s.name,s.price,s.minutes,s.calendlyUrl]));
 assert.match(page,/data-booking-consent/);assert.match(page,/data-load-calendar disabled/);
 assert.match(page,/data-direct-booking hidden/);assert.match(page,/mailto:hello@bytova\.co\.uk/);
 assert.match(page,/early-start request/);assert.doesNotMatch(page,/<iframe\b/);
 assert.doesNotMatch(page,/Online checkout is not currently available|Live checkout is awaiting verification/);
});

test('the domain launch enables canonical URLs and a sitemap while keeping the error page out of search',()=>{
 for(const indexable of[false,true]){
  const variant=structuredClone(config);variant.launch.indexable=indexable;
  const built=buildSite(variant);
  assert.equal(built.get('CNAME'),'bytova.co.uk\n');
  for(const[name,page]of built){
   if(!name.endsWith('.html'))continue;
   if(indexable&&name!=='404.html'){
    const expected='https://bytova.co.uk/'+(name==='index.html'?'':name);
    assert(page.includes('<link rel="canonical" href="'+expected+'">'),name);
    assert.match(page,/content="index,follow"/);
   }else{assert.doesNotMatch(page,/rel="canonical"/);assert.match(page,/content="noindex,nofollow"/);}
  }
  const urls=[...built.get('sitemap.xml').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
  assert.equal(urls.length,indexable?17:0);
  assert(!urls.some(url=>url.endsWith('404.html')));
  if(indexable){assert(urls.includes('https://bytova.co.uk/'));assert(urls.includes('https://bytova.co.uk/book.html'));assert.match(built.get('robots.txt'),/Sitemap: https:\/\/bytova\.co\.uk\/sitemap\.xml/);}
  else{assert.match(built.get('robots.txt'),/Disallow: \//);assert.doesNotMatch(built.get('robots.txt'),/Sitemap:/);}
 }
});


test('help guides and nested missing-page recovery remain usable without a calendar or JavaScript',()=>{
 const names=['help.html','prepare-for-remote-support.html','describe-a-tech-problem.html','everyday-computer-care.html'];
 for(const name of names){const page=pages.get(name);assert(page,name);assert.match(page,/<noscript><nav/);assert.match(page,/href="\.\/help.html"/);assert.doesNotMatch(page,/<iframe\b/);}
 const error=pages.get('404.html');const base=error.match(/<base href="([^"]+)"/)[1];
 assert.equal(new URL('./services.html',new URL(base,'https://bytova.co.uk/old/missing')).href,'https://bytova.co.uk/services.html');
 assert.equal(new URL('./site.css',base).href,'https://bytova.co.uk/site.css');
 assert.match(pages.get('prepare-for-remote-support.html'),/Nothing is sent or saved/);
});
