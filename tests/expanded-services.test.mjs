import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {projectServices} from '../service-catalogue.mjs';
import {recommendSupport,buildSupportBrief} from '../support-tool.mjs';
import {buildProjectBrief,enquiryService} from '../project-planner.mjs';
import {buildSite} from '../scripts/build.mjs';
const config=JSON.parse(readFileSync(new URL('../site.config.json',import.meta.url)));

test('physical and business jobs never acquire a remote price or calendar booking',()=>{
 const map={hardware:'repairs',transfer:'transfer',network:'devices',business:'business-it',website:'websites',marketing:'marketing',automation:'automation'};
 for(const[topic,id]of Object.entries(map))for(const ready of['yes','no','unsure'])for(const pace of['standard','calm','written']){
  const r=recommendSupport({topic,ready,pace});assert.equal(r.kind,'quote');assert.equal(r.projectId,id);assert.equal(r.serviceId,null);assert.equal(r.emailFirst,true);
  const offer=projectServices.find(s=>s.id===id);assert(offer);assert.equal(offer.price,undefined);assert.equal(offer.calendlyUrl,undefined);
  const brief=buildSupportBrief(offer,{topic,ready,pace});assert(brief.includes('scope and price to be agreed'));assert(!/£|undefined|NaN/.test(brief));
 }
});

test('untrusted or missing enquiry selections cannot create a different service or charge',()=>{
 for(const id of['missing','https://example.com','<script>','repairs&price=1','__proto__']){assert.equal(enquiryService(id),null);const b=buildProjectBrief(id);assert(b.includes('Help choosing'));assert(!b.includes(id));}
 const b=buildProjectBrief('repairs',{name:'A'.repeat(500),goal:'A screen fault\u0000',systems:'No power',audience:'unexpected'});
 assert(b.includes('Computer & Hardware Repairs'));assert(b.includes('A screen fault'));assert(!b.includes('\u0000'));assert(b.includes('Customer context: Not sure'));assert(b.includes('not a confirmed booking'));assert(b.includes('handover arrangements'));assert(b.length<1800);
});

test('all quoted services have a real route and the original paid configuration remains separate',()=>{
 const pages=buildSite(config);assert.equal(new Set(projectServices.map(s=>s.id)).size,projectServices.length);
 for(const s of projectServices){const html=pages.get(s.file);assert(html,s.file);assert(html.includes('project-enquiry.html?service='+s.id));assert(html.includes('./'+s.guide));assert(!html.includes('book.html?service='+s.id));assert(pages.get('services.html').includes('./'+s.file));}
 const booking=JSON.parse(pages.get('book.html').match(/<script id="booking-config" type="application\/json">(.*?)<\/script>/s)[1]);assert.deepEqual(booking.services.map(s=>s.id),config.services.map(s=>s.id));
 assert(pages.get('faq.html').includes('Yes. Bytova offers'));assert(pages.get('terms.html').includes('Quoted repairs and business projects'));assert(pages.get('small-business.html').includes('website-design-build.html'));
 const js=readFileSync(new URL('../project-planner.mjs',import.meta.url),'utf8');assert.doesNotMatch(js,/localStorage|sessionStorage|innerHTML/);
});
