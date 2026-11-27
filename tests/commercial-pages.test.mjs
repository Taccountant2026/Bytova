import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildSite} from '../scripts/build.mjs';

const config=JSON.parse(readFileSync(new URL('../site.config.json',import.meta.url)));
const pages=buildSite(config);

test('commercial package briefs retain their selected plan and catalogue links',()=>{
  const prices=pages.get('business-packages.html');
  const packages=[...prices.matchAll(/href="\.\/project-enquiry\.html\?service=([^&"]+)&amp;package=([^"]+)"/g)];
  assert.equal(packages.length,6);
  for(const [,id,encodedName] of packages) {
    const name=decodeURIComponent(encodedName);
    assert(name.length>3);
    assert.match(pages.get('project-enquiry.html'), new RegExp('value="'+id+'"'));
  }
  for (const route of ['business-packages.html','monthly-support.html','digital-toolkits.html']) {
    assert(pages.get('services.html').includes('./'+route));
    assert(pages.get('sitemap.xml').includes('/'+route));
  }
});

test('monthly and digital offers identify the purchase route and the actual plan allowance',()=>{
  const care=pages.get('website-care.html');
  assert.match(care,/£29 per Month/);
  assert.match(care,/up to 30 minutes/i);
  assert.doesNotMatch(care,/£49|60 minutes/);
  const plans=pages.get('monthly-support.html');
  for (const price of ['£9.99','£29','£49']) assert(plans.includes(price+' per month'));
  const products=pages.get('digital-toolkits.html');
  assert.match(products,/£5 once/);
  assert.match(products,/£15 once/);
  assert.match(products,/£9 once/);
  assert(pages.get('freelance-contracts.html').includes('./professional-portfolio.html'));
});
