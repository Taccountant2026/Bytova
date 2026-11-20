import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {audiences} from '../audiences.mjs';
import {platforms} from '../platforms.mjs';
import {buildSite} from '../scripts/build.mjs';
import {buildProjectBrief,buildContractBrief,websiteLead} from '../project-planner.mjs';

const config=JSON.parse(readFileSync(new URL('../site.config.json',import.meta.url),'utf8'));
const pages=buildSite(config);

test('all three visitor routes remain accessible from every canonical page and the main chooser',()=>{
  for(const [file,html] of pages) {
    if(file.includes('/') || !html.includes('<main id="main">'))continue;
    const navigation=html.match(/<nav id="primary-nav"[^>]*>(.*?)<\/nav>/s)?.[1];
    const fallback=html.match(/<noscript><nav[^>]*>(.*?)<\/nav>/s)?.[1];
    for(const a of audiences) {
      assert(navigation?.includes('./'+a.file),file+' primary navigation');
      assert(fallback?.includes('./'+a.file),file+' no-script navigation');
    }
  }
  for(const file of ['index.html','start-here.html','services.html']){
    const links=[...pages.get(file).matchAll(/data-journey="([^"]+)"/g)].map(m=>m[1]);
    assert.deepEqual(links,['household','business','employer']);
  }
  for(const a of audiences)assert(pages.get(a.file).includes(a.enquiry.split('&')[0]));
  assert(pages.get('services.html').includes('id="data-services"'));
  assert(pages.get('small-business.html').includes('id="data-services"'));
  assert(pages.get('home-tech-help.html').includes('Request Remote Tech Help'));
});

test('hiring opportunities and CV requests have a dedicated intake and retain their identity in the existing inbox',()=>{
  const html=pages.get('contract-enquiry.html');
  assert(html.includes('data-kind="employer"') && html.includes('mailto:hello@bytova.co.uk'));
  assert(!html.includes('data-project-audience') && !html.includes('data-project-communication'));
  assert(html.includes('data-project-privacy required'));
  const brief=buildContractBrief('freelance',{role:'Data reviewer',name:'Example team',goal:'Check a batch of tagged examples.',systems:'Remote',timing:'Four weeks',budget:'Agreed hourly rate'});
  for(const value of ['Freelance assignment','Data reviewer','Example team','Remote','Four weeks','Agreed hourly rate'])assert(brief.includes(value));
  const details={name:'Example',email:'example@example.invalid',body:brief,privacyAccepted:true,kind:'employer'};
  const payload=websiteLead('freelance',details);
  assert.equal(payload.route,'general');
  assert.equal(payload.title,'Bytova hiring: Freelance assignment');
  assert.equal(payload.body,brief);
  assert.throws(()=>websiteLead('freelance',{...details,privacyAccepted:false}));
  assert.throws(()=>websiteLead('unknown',details));
  assert(buildContractBrief('cv').includes('Please send me your CV by email.'));
  assert(!buildContractBrief('cv').includes('Device'));
  const generic=buildProjectBrief('devices',{audience:'Sole trader / small business',goal:'Connect the office printer.'});
  assert(generic.includes('Sole trader / small business') && generic.includes('Wi-Fi, Printers & Device Setup'));
  assert(pages.get('freelance-contracts.html').includes('contract-enquiry.html?engagement=cv'));
});

test('the independent introduction, three route photos and public profiles are discoverable', () => {
  const home = pages.get('index.html');
  assert.match(home, /I’m Leighton Hepworth/);
  assert.match(home, /href="#choose-route"/);
  assert.doesNotMatch(home, /security-home-promo|assistant\.js/);
  const channel = platforms.find(p => p.id === 'youtube');
  assert.match(home, /id="youtube"/);
  assert(home.includes(channel.url));
  for (const audience of audiences) {
    const image = './assets/journey-' + audience.id + '.webp';
    assert(home.includes(image));
    assert(pages.get(audience.file).includes(image));
  }
  for (const file of ['index.html', ...audiences.map(a => a.file), 'project-enquiry.html', 'contract-enquiry.html']) {
    const footer = pages.get(file).split('<footer')[1];
    for (const profile of platforms.filter(p => p.kind !== 'video')) {
      assert(footer.includes(profile.url), file + ' missing ' + profile.label);
    }
  }
});

test('visitors can verify all 24 Cisco awards and distinguish current qualifications from past cards', () => {
  const awards = JSON.parse(readFileSync(new URL('../data/cisco-credentials.json',import.meta.url),'utf8'));
  const page = pages.get('qualifications.html');
  const register = pages.get('assets/cisco-learning-record.csv');
  const profile = platforms.find(p => p.id === 'credly');
  assert.equal(awards.length,24);
  assert.equal(new Set(awards.map(a => a.verification)).size,24);
  assert.equal(awards.filter(a => a.pathway).length,2);
  for (const award of awards) {
    assert.match(award.verification,/^https:\/\/www\.credly\.com\/badges\/[0-9a-f-]{36}$/);
    assert(page.includes(award.verification) && page.includes(award.image));
    assert(page.includes('datetime="'+award.issued+'"'));
    assert(register.includes(award.name) && register.includes(award.verification));
  }
  assert.equal(register.trimEnd().split('\n').length,25);
  assert(page.includes(profile.url) && page.includes('Full UK driving licence') && page.includes('cards have expired'));
  for (const file of ['index.html','freelance-contracts.html']) {
    assert(pages.get(file).split('</main>')[0].includes('./qualifications.html'));
  }
  assert(pages.get('sitemap.xml').includes('/qualifications.html'));
});
