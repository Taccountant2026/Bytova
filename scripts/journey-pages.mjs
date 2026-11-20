import {audiences} from '../audiences.mjs';
import {projectServices} from '../service-catalogue.mjs';
import {platforms} from '../platforms.mjs';

const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const href = value => /^(#|https:|mailto:)/.test(value) ? esc(value) : './' + esc(value);
const link = (url, label, cls='') => `<a${cls ? ' class="' + cls + '"' : ''} href="${href(url)}">${esc(label)}</a>`;
const button = (url, label) => link(url, label, 'button button-navy');
const customerArea = 'https://bytova.taccountant.chatgpt.site/portal';

const routeDetails = {
  household: {action:'Explore household help', image:'A laptop, home printer and photographs on a kitchen table'},
  business: {action:'Explore business services', image:'A parcel and laptop at a small online shop’s packing bench'},
  employer: {action:'Explore freelance and contract work', image:'A headset, laptop and notebook at a contractor’s desk'}
};

function routePhoto(audience, priority=false) {
  const alt = priority ? routeDetails[audience.id].image : '';
  return `<img class="route-photo" src="./assets/journey-${audience.id}.webp" width="1100" height="733" alt="${esc(alt)}" ${priority ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

export function audienceLinks(withPhotos=false) {
  return `<nav class="audience-choices${withPhotos ? ' with-photos' : ''}" aria-label="Choose your route">${audiences.map(a => `
    <a class="audience-choice" href="${href(a.file)}" data-journey="${a.id}">
      ${withPhotos ? routePhoto(a) : ''}<div class="choice-copy"><h3>${esc(a.name)}</h3><p>${esc(a.description)}</p><span class="choice-action">${routeDetails[a.id].action}</span></div>
    </a>`).join('')}</nav>`;
}

function mast(a, title, intro, target, action) {
  return `<header class="page-hero audience-mast"><div class="container audience-intro">
    <div><p class="guide-breadcrumb">${link('start-here.html','Choose your route')} <span aria-hidden="true"> / </span> ${esc(a.nav)}</p>
    <h1>${esc(title)}</h1><p class="lead">${esc(intro)}</p>${button(target,action)}</div>${routePhoto(a,true)}
    </div></header>`;
}

function services(items,audience) {
  return `<ul class="journey-service-list">${items.map(item => `<li>${link(item.file + (item.group==='both' && audience ? '?audience='+audience : ''),item.name)}</li>`).join('')}</ul>`;
}

function group(title, content) {
  return `<section class="guide-card route-group"><h3>${esc(title)}</h3>${content}</section>`;
}

function task(title, copy, url, action) {
  return `<article class="guide-card route-task"><h3>${esc(title)}</h3><p>${esc(copy)}</p>${link(url,action,'text-link')}</article>`;
}

function nextStep(title, copy, links) {
  return `<aside class="section section-soft route-next"><div class="container route-next-inner"><div><h2>${esc(title)}</h2><p>${esc(copy)}</p></div><div class="route-next-links">${links}</div></div></aside>`;
}

export function journeyPages({page,cards,dataSection,businessGuide,email,business}) {
  const [home,sme,employer] = audiences;
  const byIds = ids => ids.map(id => projectServices.find(s=>s.id===id));
  const otherProfiles = platforms.filter(p=>p.kind==='social' && p.id!=='youtube');
  const channel = platforms.find(p=>p.id==='youtube').url;
  const short = platforms.find(p=>p.id==='featured-video');
  const work = link('our-work.html','See examples of my work','text-link');
  const watch = link(channel,'Visit Bytova on YouTube','button button-navy');
  const professional = platforms.filter(p=>p.kind==='professional' && p.id!=='credly').map(p=>link(p.url,p.label,'text-link')).join('');

  page('index.html','Bytova | Independent IT & Digital Support from Leighton Hepworth',
    'Work directly with Leighton Hepworth for household tech support, small-business websites and data projects, or freelance and contract work.',
    `<section class="hero personal-hero" aria-labelledby="hero-title">
      <img class="hero-image" src="./assets/leighton-workspace.webp" alt="Leighton Hepworth in his computer workspace" width="832" height="1248" fetchpriority="high"><div class="hero-shade"></div>
      <div class="container personal-intro"><div><h1 id="hero-title">Technology that works<br>for your world.</h1>
      <p>I’m Leighton Hepworth. I run Bytova from Doncaster. I help people with everyday technology, build digital tools for small businesses and take on freelance IT and data work.</p>
      ${link('#choose-route','Find the right service','button')}</div></div></section>
     <section class="section choose-section" id="choose-route"><div class="container"><h2>How can I help?</h2>${audienceLinks(true)}</div></section>
     <section class="section section-soft"><div class="container personal-work"><div><h2>Work directly with me</h2>
       <p>Running the RetroReplay UK shop means I use the same tools I help businesses with. I’ve also taught technical learners and repaired computers and games consoles. I’ll explain the options and agree the work with you in writing.</p><div class="watch-actions">${work}${link('qualifications.html','Qualifications and Cisco badges','text-link')}</div></div>
       <div id="youtube"><h2>Bytova on YouTube</h2><p>I share practical tech tips and walkthroughs you can follow at your own pace.</p>
       <a class="featured-short" href="${href(short.url)}"><img src="./assets/youtube-windows-shortcut.webp" width="480" height="360" loading="lazy" alt=""><span><strong>${esc(short.label)}</strong><span class="choice-action">Watch the Short</span></span></a>
       <div class="watch-actions">${watch}</div>
       ${otherProfiles.length ? `<p class="channel-links">Also find me on ${otherProfiles.map(p=>link(p.url,p.label)).join(' · ')}.</p>` : ''}</div></div></section>
     ${nextStep('Already in touch?','Open your customer area to follow up on a request or manage an appointment.',button(customerArea,'Open customer area'))}`,
     '<link rel="preload" href="./assets/leighton-workspace.webp" as="image" fetchpriority="high">');

  page('start-here.html','Choose Your Service | Bytova','Find household help, services for your business, or a direct route to hire Leighton.',
    `<header class="page-hero"><div class="container centre narrow"><h1>How can I help?</h1><p class="lead">Choose the type of help you need and I’ll take you through the options.</p></div></header>
     <section class="section choose-section"><div class="container">${audienceLinks(true)}</div></section>
     ${nextStep('Know what you need?','Go straight to an appointment, a business check or a CV request.',
       link('book.html','Arrange remote support','text-link')+link(businessGuide,'Check business priorities','text-link')+link('contract-enquiry.html?engagement=cv','Request my CV','text-link'))}`);

  page(home.file,'Tech Help for Individuals & Households | Bytova',
    'Personal help with computers, repairs, devices and one-off digital tasks. Compare remote appointments or ask Leighton for a written quote.',
    mast(home,'Tech help for you and your home','A printer that won’t connect, a slow computer or a pile of family photos to organise? Tell me what you’re trying to do. I’ll explain what I can do remotely and what it will cost.','#household-tasks','Find household help') +
    `<section class="section" id="household-tasks"><div class="container"><h2>What do you need a hand with?</h2><div class="guide-grid">
     ${task('Fix an everyday problem','Help with Windows, email, software, Wi-Fi or a printer. Start with the support guide to find a suitable appointment.','find-support.html','Find my support option')}
     ${task('Repair or upgrade a device','Tell me the model and symptoms. I’ll check suitability and agree any diagnostic charge or handover with you first.','computer-hardware-repairs.html?audience=household','Ask about a repair')}
     ${task('Get a digital task done','I can combine scanned pages into one PDF or help organise a collection of photos. Describe the result and I’ll quote by email.',home.enquiry+'&task=digital','Describe my task')}
     </div></div></section><section class="section section-soft" id="remote-appointments"><div class="container"><div class="section-heading centre"><h2>Remote appointments</h2>
     <p>Compare the duration and price. Computer Care has an online calendar. I arrange Remote Tech Help and Setup by email.</p></div>${cards()}</div></section>
     <section class="section"><div class="container detail-columns"><div><h2>Repairs, upgrades and setup</h2><p>For hands-on work, I’ll agree the job, price and handover before you send or bring equipment.</p></div>${services(projectServices.filter(s=>s.group!=='business'),'household')}</div></section>
     ${nextStep('Prefer to try it yourself?','My written guides and YouTube channel cover everyday tech questions.',link('help.html','Read the guides','text-link')+link(channel,'Watch on YouTube','text-link'))}`);

  page(sme.file,'Small Business IT, Websites & Data Services | Bytova','IT, websites, ecommerce and data services for sole traders and small businesses, quoted directly by Leighton.',
    mast(sme,'Digital support for your business','I work with sole traders, shops and small teams. Whether you need a website fix, a dependable email setup or a batch of data checked, send me the outcome you want. I’ll come back with a written scope and quote.',sme.enquiry,'Describe my business project') +
    `<section class="section" id="business-projects"><div class="container"><h2>Choose a business service</h2><div class="guide-grid">
    ${group('IT and devices',services(byIds(['business-it','business-email','devices','storage','transfer']),'business'))}
    ${group('Websites and online shops',services(byIds(['websites','website-fixes','ecommerce','marketing']),'business'))}
    ${group('Systems and ongoing support',`<ul class="journey-service-list"><li>${link('automation-business-systems.html','Automation and business systems')}</li><li>${link('website-care.html','Monthly website care')}</li><li>${link('#data-services','Data annotation and quality checks')}</li><li>${link(businessGuide,'Check my business priorities')}</li></ul>`)}
    </div></div></section>${dataSection()}
    ${nextStep('See how I work','I built the customer journeys for Bytova and run an online shop. See how I approach enquiries, product catalogues and checkout.',work+button(sme.enquiry,'Ask for a written quote'))}`);

  page(employer.file,'Hire Leighton Hepworth | Freelance & Contract Work | Bytova','Employers and agencies can see Leighton’s experience, request a CV, or send a freelance assignment or contract role.',
    mast(employer,'Hire me for freelance or contract work','I’m Leighton Hepworth. I bring hands-on IT support, ecommerce operations, technical teaching and data evaluation experience. Tell me what your team needs and I’ll reply about fit and availability.',employer.enquiry,'Send a role or contract brief') +
    `<section class="section"><div class="container"><h2>Where I can contribute</h2><div class="guide-grid">
     ${task('IT support and service desk','I troubleshoot computers and software, set up devices and leave clear handover notes for the next person.','contract-enquiry.html?engagement=contract&focus=support','Discuss an IT support role')}
     ${task('Data annotation and evaluation','I check labels, compare model responses against a brief and explain scoring decisions with examples.','contract-enquiry.html?engagement=freelance&focus=data','Discuss a data assignment')}
     ${task('Website and ecommerce testing','I test real customer tasks, record what goes wrong and give the team steps to reproduce a problem.','contract-enquiry.html?engagement=freelance&focus=web','Discuss a testing assignment')}
     </div></div></section>
     ${nextStep('Experience and CV','Explore my work on Bytova and RetroReplay UK, or ask for a CV directly. If you have a brief, include the work pattern, dates and rate range.',link('our-work.html?audience=employer','See my work','text-link')+link('qualifications.html','My qualifications and licences','text-link')+professional+button('contract-enquiry.html?engagement=cv','Request my CV'))}`);

  page('services.html','Service Catalogue | Bytova','Browse household tech help, business and data services, remote appointments and freelance work.',
    `<header class="page-hero"><div class="container centre narrow"><h1>Service catalogue</h1><p class="lead">Browse the work I offer or choose who you’re here for.</p></div></header>
    <section class="section choose-section"><div class="container">${audienceLinks()}</div></section>
    <section class="section section-soft" id="quoted-services"><div class="container"><h2>Repairs and projects</h2><nav class="service-jump" aria-label="Catalogue sections">${link('#remote-appointments','Remote appointments')}${link('#data-services','Data annotation and checks')}${link(employer.file,'Freelance and contracts')}</nav><div class="guide-grid">
    ${group('Repairs and everyday devices',services(projectServices.filter(s=>s.group!=='business')))}
    ${group('IT and business systems',services(byIds(['business-it','business-email','automation'])))}
    ${group('Websites, shops and marketing',services(byIds(['websites','website-fixes','ecommerce','marketing']))+link('website-care.html','Monthly website care'))}</div></div></section>
    ${dataSection()}<section class="section" id="remote-appointments"><div class="container"><div class="section-heading centre"><h2>Remote appointments</h2><p>See the service, duration and total price before arranging a session.</p></div>${cards()}</div></section>`);

  page('contact.html','Contact Leighton | Bytova','Choose household help, a business project or a hiring enquiry. Every enquiry goes directly to Leighton.',
    `<header class="page-hero"><div class="container centre narrow"><h1>Contact me</h1><p class="lead">Your enquiry comes directly to me. I aim to reply by email ${esc(business.responseAim)}.</p></div></header>
    <section class="section"><div class="container guide-grid">
    ${task('Household help','Tell me about the device or one-off task you need a hand with.',home.enquiry,'Ask for household help')}
    ${task('A business project','Tell me about your setup and what you’d like to improve.',sme.enquiry,'Send a business brief')}
    ${task('A role or contract','Send the opportunity or request a CV for your hiring process.',employer.enquiry,'Send a hiring enquiry')}</div></section>
    <section class="section section-soft"><div class="container detail-columns"><div><h2>Email me directly</h2><p>${link('mailto:'+email,email)}. If we’re already in touch, include your booking or enquiry reference.</p></div><div><h2>Business details</h2><p>${esc(business.legalName)}, trading as Bytova<br>${business.address.map(esc).join(', ')}</p><p>Please arrange equipment handovers with me in advance.</p></div></div></section>`);
}
