import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {funnels,reviewQuestions,reviewPriorities,reviewFromQuery,funnelForService} from '../funnels.mjs';
import {websiteLead,buildProjectBrief} from '../project-planner.mjs';
import {buildSite} from '../scripts/build.mjs';
const config=JSON.parse(readFileSync(new URL('../site.config.json',import.meta.url)));
test('each customer route has a real landing page, preparation step and correct conversion destination',()=>{
 const pages=buildSite(config);assert.equal(funnels.length,7);
 for(const f of funnels){const page=pages.get(f.file);assert(page,f.file);assert(pages.has(f.guide));assert(pages.has(f.serviceFile));assert(pages.has(f.secondaryFile));assert(page.includes('./'+f.guide));if(f.service)assert(page.includes('project-enquiry.html?service='+f.service));else assert(page.includes('find-support.html'));}
 assert(pages.get('start-here.html').includes('business-check.html'));
 assert(pages.get('project-enquiry.html').includes('data-project-privacy required'));
 assert(pages.get('privacy.html').includes('dedicated Bytova business inbox hosted at bytova.taccountant.chatgpt.site'));
});
test('business priorities use complete valid answers, return bounded useful results and ignore injected query text',()=>{
 assert.deepEqual(reviewPriorities({}),[]);const all=Object.fromEntries(reviewQuestions.map(q=>[q.id,'working']));assert.deepEqual(reviewPriorities(all),[]);
 const result=reviewPriorities({...all,website:'unsure',admin:'improve',presence:'improve',it:'improve'});assert.deepEqual(result.map(q=>q.id),['presence','admin','it']);
 assert.deepEqual(reviewFromQuery('website,<script>,admin,https://evil.invalid').map(q=>q.id),['website','admin']);
 assert.equal(funnelForService('javascript:alert(1)'),null);
});
test('website submissions need deliberate privacy acknowledgement and bounded reply details',()=>{
 const details={name:'Example visitor',email:'Visitor@Example.invalid',body:buildProjectBrief('websites',{goal:'A practical website for a small local business.'}),privacyAccepted:true,campaign:'autumn-website'};
 const payload=websiteLead('websites',details);assert.equal(payload.route,'websites');assert.equal(payload.email,'visitor@example.invalid');assert.equal(payload.brand,'bytova');assert.equal(payload.campaign,'autumn-website');assert(!('publishConsent' in payload));
 for(const change of[{privacyAccepted:false},{name:''},{name:'A'.repeat(51)},{email:'invalid'},{body:'too short'},{body:'A'.repeat(3001)}])assert.throws(()=>websiteLead('websites',{...details,...change}));
 assert.equal(websiteLead('repairs',{...details,campaign:'https://evil.invalid'}).campaign,'');
 assert.equal(websiteLead('',{...details,route:'remote'}).route,'remote');
 const js=readFileSync(new URL('../project-planner.mjs',import.meta.url),'utf8');assert.match(js,/credentials:'omit'/);assert.match(js,/AbortSignal.timeout/);assert.doesNotMatch(js,/localStorage|sessionStorage|innerHTML/);
});
