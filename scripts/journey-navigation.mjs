import {platforms} from '../platforms.mjs';
import {audiences} from '../audiences.mjs';
import {funnels} from '../funnels.mjs';
import {projectServices} from '../service-catalogue.mjs';

const local = file => './' + file;
const audienceForPage = file => {
  const hub = audiences.find(a => a.file === file);
  if (hub) return hub.id;
  if (file === 'contract-enquiry.html') return 'employer';
  if (['book.html','find-support.html','remote-tech-help.html','setup-getting-started.html','computer-care-safety-check.html','computer-help.html','repair-quote.html'].includes(file)) return 'household';
  if (['business-check.html','website-care.html'].includes(file) || funnels.some(f => f.file === file)) return 'business';
  const item = projectServices.find(s => s.file === file);
  return item?.group === 'business' ? 'business' : item?.group === 'home' ? 'household' : '';
};

export function navigation(file, {esc, icon}) {
  const current = audienceForPage(file);
  const route = audiences.find(a => a.id === current);
  const links = audiences.map(a => `<a class="nav-audience" href="${local(a.file)}"${a.file === file ? ' aria-current="page"' : a.id === current ? ' aria-current="location"' : ''}>${esc(a.nav)}</a>`);
  links.push(...[['services.html','Services'],['help.html','Guides'],['cybersecurity-library.html','Cyber tips']].map(([href,label]) =>
    `<a class="nav-utility" href="${local(href)}"${href === file ? ' aria-current="page"' : ''}>${label}</a>`));
  const channel = platforms.find(platform => platform.id === 'youtube');
  links.push(`<a class="nav-utility" href="${esc(channel.url)}">YouTube</a>`);
  links.push('<a class="nav-utility" href="https://bytova.taccountant.chatgpt.site/portal">Customer area</a>');
  const cta = route ? local(route.enquiry) : './contact.html';
  return `<a class="skip" href="#main">Skip to content</a><header class="site-header"><div class="container header-inner">
    <a class="brand" href="./" aria-label="Bytova home"><img src="./assets/Bytova_Logo.png?v=20261110-v2" alt="Bytova" width="200" height="200"></a>
    <button class="menu-toggle icon-button" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Open navigation" data-menu-toggle>${icon('menu')}</button>
    <nav id="primary-nav" class="nav" aria-label="Main navigation" data-menu>${links.join('')}</nav>
    <a class="button header-cta" href="${esc(cta)}">${current === 'employer' ? 'Hiring enquiry' : 'Get in touch'}</a></div></header>`;
}

export function siteFooter({business, esc}) {
  const link = (file, name) => `<a href="${local(file)}">${esc(name)}</a>`;
  const profiles = platforms.filter(platform => platform.kind !== 'video');
  return `<footer class="footer journey-footer"><div class="container footer-grid">
    <div class="footer-about"><a class="footer-brand" href="./" aria-label="Bytova home"><img src="./assets/Bytova_Logo.png?v=20261110-v2" alt="Bytova" width="200" height="200" loading="lazy"></a>
    <p>I’m Leighton Hepworth, the independent IT and digital specialist behind Bytova.</p><a href="mailto:${esc(business.email)}">${esc(business.email)}</a></div>
    <div><h2>Work with Bytova</h2>${audiences.map(a=>link(a.file,a.name)).join('')}${link('start-here.html','Choose your route')}${link('services.html','All services')}${link('our-work.html','Examples of my work')}${link('qualifications.html','Qualifications and licences')}</div>
    <div><h2>Customer support</h2>${link('find-support.html','Find household support')}${link('book.html','Arrange an appointment')}${link('help.html','Help and guides')}${link('contact.html','Contact Leighton')}<a href="https://bytova.taccountant.chatgpt.site/portal">Customer area</a>${link('faq.html','Frequently asked questions')}</div>
    <div><h2>Service information</h2>${link('how-it-works.html','How it works')}${link('business-check.html','Business priorities check')}${link('remote-support-safety.html','Remote support safety')}${link('security.html','Security Response Centre')}${link('cybersecurity-library.html','50 cybersecurity tips')}${link('terms.html','Service terms')}${link('cancellations.html','Cancellations and refunds')}${link('privacy.html','Privacy and cookies')}</div></div>
    <nav class="container footer-platforms" aria-label="Bytova and my professional profiles"><h2>Find me online</h2>${profiles.map(p=>`<a href="${esc(p.url)}">${esc(p.label)}</a>`).join('')}</nav>
    <div class="container footer-business"><p>${esc(business.legalName)}, trading as Bytova · Sole trader · Not VAT registered.</p><p>Correspondence address: ${business.address.map(esc).join(', ')}. Arrange any equipment handover before a visit or delivery.</p></div>
    <div class="container footer-bottom"><span>© 2026 Bytova</span><span><a href="https://bytova.taccountant.chatgpt.site/manage">Owner dashboard</a></span></div></footer>`;
}
