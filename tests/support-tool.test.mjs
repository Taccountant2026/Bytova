import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {recommendSupport,supportChecklist,buildSupportBrief} from '../support-tool.mjs';
import {buildSite} from '../scripts/build.mjs';
const config=JSON.parse(readFileSync(new URL('../site.config.json',import.meta.url)));

test('routine support recommendations retain the real service mappings and communication choices',()=>{
 for(const[topic,id]of[['issue','remote-tech-help'],['setup','setup-getting-started'],['care','computer-care-safety-check']])for(const pace of['standard','calm','written']){
  const result=recommendSupport({topic,ready:'yes',pace});
  assert.equal(result.kind,'service');assert.equal(result.serviceId,id);
  assert.equal(result.emailFirst,topic==='setup'||pace==='written');
  assert(config.services.some(s=>s.id===result.serviceId));
 }
});

test('unsupported work, unusable connections and uncertainty never produce a booking recommendation',()=>{
 for(const ready of['yes','no','unsure'])for(const pace of['standard','calm','written']){
  const outside=recommendSupport({topic:'outside',ready,pace});assert.equal(outside.serviceId,null);assert.equal(outside.kind,'outside');
 }
 for(const topic of['issue','setup','care','unsure'])for(const ready of['no','unsure']){
  const result=recommendSupport({topic,ready,pace:'standard'});assert.equal(result.serviceId,null);assert.equal(result.emailFirst,true);
 }
 assert.equal(recommendSupport({topic:'unsure',ready:'yes',pace:'calm'}).serviceId,null);
 assert.equal(recommendSupport({topic:'care',ready:'yes'}).serviceId,null);
 assert.equal(recommendSupport({topic:'invented',ready:'yes',pace:'standard'}).serviceId,null);
});

test('plans use the configured total price, service preparation and only deliberately supplied details',()=>{
 const service=config.services[0],items=supportChecklist(service),answers={topic:'issue',ready:'yes',pace:'calm'};
 assert.deepEqual(items.slice(0,service.prepare.length),service.prepare);
 const brief=buildSupportBrief(service,answers,{device:'My laptop',task:'The printer queue is paused.'},[items[0]],items);
 assert(brief.includes('£25 total / 30 minutes'));assert(brief.includes('My laptop'));assert(brief.includes('The printer queue is paused.'));
 assert(brief.includes('1 of 5'));assert(brief.includes('Still to prepare:'));assert(brief.includes('not a booking confirmation'));
 assert(!brief.includes('calendly.com'));assert(!brief.includes('support-'));
 const contact=buildSupportBrief(null,{topic:'outside',ready:'no',pace:'written'});
 assert(contact.includes('check suitability before an appointment'));assert(!contact.includes('£'));
});

test('support planner is discoverable and retains a local fallback without loading an external calendar',()=>{
 const pages=buildSite(config),page=pages.get('find-support.html');assert(page);
 for(const file of['index.html','services.html','help.html','book.html'])assert(pages.get(file).includes('./find-support.html'),file);
 assert(page.includes('src="./support-tool.mjs"'));assert(page.includes('data-support-copy'));assert(page.includes('data-support-print'));
 assert(page.includes('<noscript>'));assert(page.includes('data-support-next disabled'));assert(!page.includes('<iframe'));
 const data=JSON.parse(page.match(/<script id="support-config" type="application\/json">(.*?)<\/script>/s)[1]);
 assert.deepEqual(data.services.map(s=>[s.id,s.price,s.minutes]),config.services.map(s=>[s.id,s.price,s.minutes]));
 const js=readFileSync(new URL('../support-tool.mjs',import.meta.url),'utf8');assert.doesNotMatch(js,/fetch\(|localStorage|sessionStorage|innerHTML/);
 assert(js.includes('navigator.clipboard.writeText'));assert(js.includes('brief.select()'));
});
