import {audiences} from '../audiences.mjs';
import {projectServices} from '../service-catalogue.mjs';

const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const path = value => './' + esc(value);
const anchor = (href, title) => `<a href="${href.startsWith('#') ? esc(href) : path(href)}">${esc(title)}</a>`;

export function audienceLinks() {
  return `<nav class="journey-picks" aria-label="Choose your route">${audiences.map(a => `
    <a class="journey-pick pick-${a.id}" href="${path(a.file)}" data-journey="${a.id}">
      <strong>${esc(a.name)}</strong><span>${esc(a.description)}</span>
    </a>`).join('')}</nav>`;
}

function mast(audience, heading, intro, target, action) {
  return `<header class="journey-mast mast-${audience.id}"><div class="container">
    <a class="journey-back" href="./start-here.html">Choose another route</a>
    <div class="mast-fields"><div><p class="mast-label">${esc(audience.name)}</p><h1>${heading}</h1></div>
    <div class="mast-action"><p>${esc(intro)}</p><a class="journey-button" href="${esc(target)}">${esc(action)}</a></div></div>
    </div></header>`;
}

function serviceList(items, audience) {
  return `<ul class="journey-service-list">${items.map(service => `<li>${anchor(service.file + (service.group === 'both' && audience ? '?audience=' + audience : ''), service.name)}</li>`).join('')}</ul>`;
}

function group(title, items, audience) {
  return `<section class="journey-group"><h3>${title}</h3>${serviceList(items, audience)}</section>`;
}

function task(title, copy, destination, label) {
  return `<article class="journey-task"><h3>${esc(title)}</h3><p>${esc(copy)}</p>${anchor(destination,label)}</article>`;
}


export function journeyPages({page, cards, dataSection, businessGuide, email, business}) {
  const [home, sme, employer] = audiences;
  const project = id => projectServices.find(s => s.id === id);
  const byIds = ids => ids.map(project);
  const contact = esc(email);
  const workLinks = `<div class="journey-proof"><div><h2>Work you can explore</h2><p>See the public-facing work on two businesses I run, including Bytova’s support journeys and the RetroReplay UK shop.</p></div><div class="journey-proof-links">${anchor('our-work.html','Explore my work')}<a href="https://retroreplay.uk/">Visit RetroReplay UK</a></div></div>`;
  const homePhoto = '<figure class="journey-portrait"><img src="./assets/leighton-workspace.webp" alt="Leighton Hepworth at his computer workspace" width="832" height="1248" fetchpriority="high"><figcaption><strong>Leighton Hepworth</strong><span>Independent IT &amp; digital support</span></figcaption></figure>';
  page('index.html','Bytova | Household IT, SME Services & Freelance Contracts',
    'Work directly with Leighton Hepworth for household tech help, small-business IT and digital projects, or freelance and contract work.',
    `<section class="journey-home"><div class="container home-split"><div class="journey-welcome">
       <h1>How can I <em>help you?</em></h1>
       <p class="journey-intro">I’m Leighton. Choose the route that fits what you need.</p>
       ${audienceLinks()}</div>${homePhoto}</div></section>
     <section class="journey-band"><div class="container">${workLinks}</div></section>
     <aside class="journey-return"><div class="container"><div><h2>Already a customer?</h2><p>Open your customer area to follow up on a request or manage an appointment.</p></div><a class="journey-secondary" href="https://bytova.taccountant.chatgpt.site/portal">Open customer area</a></div></aside>`,
    '<link rel="preload" href="./assets/leighton-workspace.webp" as="image" fetchpriority="high">');

  page('start-here.html','Choose Your Route | Bytova',
    'Choose household support, services for your business, or an employer and freelance contract enquiry.',
    `<section class="journey-choice"><div class="container"><h1>What brings you to Bytova?</h1><p class="journey-lead">Choose by what you want to do. A sole trader buying a website belongs under businesses. A recruiter filling a role belongs under employers.</p>${audienceLinks()}</div></section>
    <section class="journey-band"><div class="container journey-shortcuts"><h2>Know what you need?</h2><ul><li>${anchor('book.html','Arrange a remote appointment')}</li><li>${anchor('business-check.html','Check business priorities')}</li><li>${anchor('contract-enquiry.html?engagement=cv','Request a CV')}</li><li>${anchor('services.html','Browse the complete catalogue')}</li></ul></div></section>`);

  page(home.file,'Tech Help for Individuals & Households | Bytova',
    'Get help with a home computer, repairs, everyday devices or a small digital task. Compare remote appointments or ask for a written quote.',
    mast(home,'Help with your<br>everyday tech.','Choose help for yourself or someone at home. Tell me what you want to get working and we’ll agree the next step.','#household-tasks','Find household help') +
    `<section class="journey-band" id="household-tasks"><div class="container"><h2>What do you need a hand with?</h2><div class="journey-tasks">
     ${task('Something isn’t working','Get help with a Windows, email, software or printer issue. The support guide helps you choose an appointment.','find-support.html','Find my support option')}
     ${task('A device needs fixing','Describe a damaged or faulty computer or supported console. I’ll ask about the model and symptoms before agreeing a repair.','computer-hardware-repairs.html?audience=household','Ask about a repair')}
     ${task('I need help with a digital task','Describe a one-off job such as turning scans into a PDF or organising a set of photos. I’ll confirm the scope and price by email.',home.enquiry+'&task=digital','Describe my task')}
     </div></div></section><section class="journey-band band-soft" id="remote-appointments"><div class="container"><h2>Compare remote appointments</h2><p class="section-intro">Remote Tech Help and Setup are arranged on request. Computer Care has an online calendar.</p>${cards()}</div></section>
     <section class="journey-band"><div class="container journey-proof"><div><h2>Repairs, upgrades and setup</h2><p>For hands-on jobs, describe the device first. We agree the work, price and any equipment handover in writing.</p></div>
     ${serviceList(projectServices.filter(s=>s.group!=='business'),'household')}</div></section>`);

  page(sme.file,'Small Business IT, Websites & Data Services | Bytova',
    'Choose IT support, a website or ecommerce project, or a batch of data and AI work for a sole trader or small business.',
    mast(sme,'Get a job done<br>for your business.','For sole traders, shops and small teams buying a defined piece of work. Start with the outcome or send a brief for a written quote.','./'+sme.enquiry,'Describe my business project') +
    `<section class="journey-band" id="business-projects"><div class="container"><h2>Find a service by the job you need done</h2>
    <div class="journey-groups">${group('Keep the business running',byIds(['business-it','business-email','devices','storage','transfer']),'business')}
    ${group('Build or improve an online presence',byIds(['websites','website-fixes','ecommerce','marketing']),'business')}
    <section class="journey-group"><h3>Improve an ongoing workflow</h3><ul class="journey-service-list"><li>${anchor(project('automation').file,project('automation').name)}</li><li>${anchor('website-care.html','Monthly Website Care')}</li><li>${anchor('#data-services','AI, catalogue and data checks')}</li><li>${anchor(businessGuide,'Check my business priorities')}</li></ul></section></div></div></section>
    ${dataSection()}<section class="journey-band"><div class="container">${workLinks}<p class="journey-cross">Hiring someone to work within your team? ${anchor(employer.file,'Explore freelance and contract work')}.</p></div></section>`);

  page(employer.file,'Hire Leighton Hepworth | Freelance & Contract Work | Bytova',
    'Employers, agencies and recruiters can explore Leighton Hepworth’s experience, request a CV or send a brief for freelance and contract work.',
    mast(employer,'Hire Leighton for<br>freelance or contract work.','For employers, agencies and hiring managers. Share the assignment, how your team works and the dates you have in mind.','./'+employer.enquiry,'Send a role or contract brief') +
    `<section class="journey-band"><div class="container"><h2>Where I can contribute</h2><div class="journey-tasks">
    ${task('IT support and service desk','PC and software troubleshooting, device setup, user support and clear written handover notes.','contract-enquiry.html?engagement=contract&focus=support','Discuss an IT support role')}
    ${task('AI data and quality review','Review labels, compare model responses against a brief and explain scoring decisions with examples.','contract-enquiry.html?engagement=freelance&focus=data','Discuss a data assignment')}
    ${task('Website and ecommerce testing','Walk through a customer task, reproduce problems and document what a shop or web team needs to check.','contract-enquiry.html?engagement=freelance&focus=web','Discuss a testing assignment')}
    </div></div></section><section class="journey-band band-soft" id="experience"><div class="container journey-proof"><div><h2>Experience behind the work</h2><p>I run Bytova and RetroReplay UK. My experience includes troubleshooting hardware, building online customer journeys, and teaching and assessing technical learners.</p></div><div class="journey-proof-links">${anchor('our-work.html?audience=employer','See examples of my work')}${anchor('contract-enquiry.html?engagement=cv','Request my CV')}</div></div></section>
    <section class="journey-band"><div class="container journey-proof"><div><h2>Send an opportunity</h2><p>Include the role or deliverable, remote or on-site expectations, start date, duration, hours and rate range where known. I’ll reply by email to discuss fit and availability.</p></div><div class="journey-proof-links">${anchor('contract-enquiry.html','Prepare a hiring brief')}<a href="mailto:${contact}?subject=Freelance%20or%20contract%20opportunity">Email Leighton about a role</a></div></div></section>`);

  page('services.html','Service Catalogue | Bytova','Browse household tech help, business services, data checks, remote appointments and the route for hiring Leighton.',
    `<section class="journey-choice"><div class="container"><h1>Service catalogue</h1><p class="journey-lead">Choose a route for a guided visit, or go straight to a service below.</p>${audienceLinks()}</div></section>
    <section class="journey-band" id="quoted-services"><div class="container"><h2>Browse the catalogue</h2><nav class="journey-inline" aria-label="Catalogue sections"><a href="#remote-appointments">Remote appointments</a><a href="#data-services">Data annotation and checks</a><a href="./freelance-contracts.html">Freelance and contracts</a></nav>
    <div class="journey-groups">${group('Repairs and everyday devices',projectServices.filter(s=>s.group!=='business'))}
    ${group('IT and business systems',byIds(['business-it','business-email','automation']))}
    <section class="journey-group"><h3>Websites, shops and marketing</h3>${serviceList(byIds(['websites','website-fixes','ecommerce','marketing']))}${anchor('website-care.html','Monthly Website Care')}</section></div></div></section>
    ${dataSection()}<section class="journey-band" id="remote-appointments"><div class="container"><h2>Remote appointments</h2><p class="section-intro">Compare the service, duration and total price before arranging a session.</p>${cards()}</div></section>`);

  page('contact.html','Contact Leighton | Bytova','Choose the right Bytova enquiry for household help, a small business project or a freelance and contract opportunity.',
    `<section class="journey-choice"><div class="container"><h1>Contact Leighton</h1><p class="journey-lead">Choose the enquiry that fits. I aim to reply by email ${esc(business.responseAim)}.</p>
    <div class="journey-tasks">${task('Household enquiry','Tell me about the device or digital task and what you need help with.',home.enquiry,'Ask for household help')}
    ${task('Business enquiry','Describe the project, current setup and result you want.',sme.enquiry,'Send a business brief')}
    ${task('Employer or recruiter enquiry','Send a freelance assignment, contract role or CV request.',employer.enquiry,'Send a hiring enquiry')}</div>
    </div></section><section class="journey-band"><div class="container journey-proof"><div><h2>Prefer to email?</h2><p>Write to <a href="mailto:${contact}">${contact}</a>. Include a booking or enquiry reference if you already have one.</p><p>Please leave out passwords, payment details and other people’s personal information.</p></div><div><h2>Business details</h2><p>${esc(business.legalName)}, trading as Bytova<br>${business.address.map(esc).join(', ')}</p><p>Correspondence address. Arrange any equipment handover with me first.</p></div></div></section>`);
}
