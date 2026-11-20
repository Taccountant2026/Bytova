import {engagements} from '../audiences.mjs';
import {projectServices} from '../service-catalogue.mjs';

const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

function review(email, employer) {
  const resultTitle = employer ? 'Review your hiring brief' : 'Review your enquiry';
  return `<section class="enquiry-result" data-project-result hidden>
    <h2 data-project-result-title tabindex="-1">${resultTitle}</h2>
    <label class="guide-field" for="project-draft">Your message<textarea id="project-draft" data-project-draft readonly rows="10"></textarea></label>
    <section class="website-send"><div data-project-send-fields><h3>Send privately to Leighton</h3>
      <div class="enquiry-field-grid">
        <label class="guide-field" for="reply-name">Your name<input id="reply-name" data-project-sender-name maxlength="50" autocomplete="name" required></label>
        <label class="guide-field" for="reply-email">Reply email address<input id="reply-email" data-project-sender-email type="email" maxlength="254" autocomplete="email" required></label></div>
      <label class="lead-trap" aria-hidden="true">Leave this blank<input data-project-website tabindex="-1" autocomplete="off"></label>
      <label class="consent-label"><input type="checkbox" data-project-privacy required><span>I have read the <a href="./privacy.html">privacy notice</a> and want Leighton to reply about this enquiry.</span></label>
      <button type="button" class="button button-navy" data-project-send>Send my enquiry</button><p class="lead-error" role="alert" data-project-send-status></p>
    </div><div class="lead-success" data-project-success hidden><h3 tabindex="-1" data-project-success-title>Your enquiry is with Leighton.</h3>
      <p>Your reference is <strong class="break-all" data-project-reference></strong>. I aim to reply by email within two working days.</p><a href="./start-here.html">Return to the route chooser</a></div></section>
    <div class="section-actions"><a class="button button-outline" href="mailto:${esc(email)}" data-project-email>Open in my email app</a><button class="button button-outline" type="button" data-project-copy>Copy message</button></div>
  </section>`;
}

export function enquiryPages({page, email}) {
  for (const employer of [false,true]) {
    const file = employer ? 'contract-enquiry.html' : 'project-enquiry.html';
    const name = employer ? 'Send a hiring brief' : 'Tell me what you need';
    const description = employer ? 'Send a freelance assignment, contract opportunity or CV request to Leighton Hepworth.' : 'Ask about household help or send a small-business project brief to Leighton Hepworth.';
    const back = employer ? './freelance-contracts.html' : './start-here.html';
    const emailLink = 'mailto:'+email+'?subject='+encodeURIComponent(employer?'Freelance or contract enquiry':'Bytova service enquiry');
    const options = employer ? engagements : projectServices;
    const projectSelect = `<label class="guide-field" for="project-service">${employer?'What are you contacting me about?':'Which service do you need?'}<select id="project-service" data-project-service>${employer?'':'<option value="">Help choosing a service</option>'}${options.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join('')}</select></label>`;
    const audienceSelect = `<label class="guide-field" for="project-audience">Who is the help for?<select id="project-audience" data-project-audience><option>Not sure</option><option>Home / personal</option><option>Sole trader / small business</option></select></label>`;
    const fields = `<div class="enquiry-field-grid">${employer?'':audienceSelect}${projectSelect}${employer?'<label class="guide-field" for="project-name">Organisation or agency (optional)<input id="project-name" data-project-name maxlength="140" autocomplete="organization"></label>':''}</div>
      ${employer?'<label class="guide-field" for="project-role">Role title or assignment (optional)<input id="project-role" data-project-role maxlength="150" placeholder="For example, service desk cover"></label>':'<label class="guide-field" for="project-name">Name or business (optional)<input id="project-name" data-project-name maxlength="140"></label>'}
      <label class="guide-field" for="project-goal"><span data-project-label>${employer?'What does your team need?':'What would you like help with?'}</span>
        <textarea id="project-goal" data-project-goal rows="4" maxlength="1000" aria-describedby="project-details-note"></textarea></label>
      <p class="small-note" id="project-details-note" data-project-hint>${employer?'Outline the responsibilities or deliverable. A CV request can be sent on its own.':'Describe the task and the result you want.'}</p>
      <label class="guide-field" for="project-systems">${employer?'Location and work pattern (optional)':'Device, software or website (optional)'}<textarea id="project-systems" data-project-systems rows="2" maxlength="300" placeholder="${employer?'For example, remote UK, 15 hours a week':'Include the device model or website address if relevant'}"></textarea></label>
      <div class="enquiry-field-grid"><label class="guide-field" for="project-timing">${employer?'Start date and duration (optional)':'Preferred timing (optional)'}<input id="project-timing" data-project-timing maxlength="120"></label>
      <label class="guide-field" for="project-budget">${employer?'Rate range or project budget (optional)':'Budget or constraints (optional)'}<input id="project-budget" data-project-budget maxlength="160"></label></div>
      ${employer?'':'<label class="guide-field" for="project-communication">Communication preference<select id="project-communication" data-project-communication><option>Written email first</option><option>Please agree a suitable approach by email</option></select></label>'}`;
    page(file,(employer?'Freelance & Contract Enquiry':'Household or Business Enquiry')+' | Bytova',description,`
      <header class="page-hero brief-heading"><div class="container centre narrow"><p class="guide-breadcrumb"><a data-project-back href="${back}">${employer?'Employers and recruiters':'Choose your route'}</a></p><h1 data-project-heading>${name}</h1><p class="lead">${esc(description)} Review your message before sending it.</p></div></header>
      <section class="section"><div class="container enquiry-layout" data-project-planner data-kind="${employer?'employer':'project'}" data-email="${esc(email)}">
      <div class="enquiry-fields"><div class="brief-controls"><div data-project-fields>${fields}</div>
      <button type="button" class="button button-navy" data-project-build>${employer?'Review my hiring brief':'Review my enquiry'}</button><p role="status" data-project-status></p>${review(email,employer)}</div>
      <noscript><style>.brief-controls{display:none}</style><p>Send your enquiry by email. <a href="${esc(emailLink)}">Write to Leighton</a> with ${employer?'your role, dates and work pattern, or ask for a CV':'your task, the result you want and any deadline'}.</p></noscript></div>
      <aside class="support-note"><h2>What happens next?</h2><p>${employer?'I’ll read the opportunity and reply by email about suitability, availability and the next conversation.':'I’ll read your brief, clarify the job and agree the scope and price with you before work begins.'}</p>
      <p>I aim to reply within two working days.</p><a href="${esc(emailLink)}">Email Leighton directly</a>
      <p class="small-note">Please leave out passwords and other people’s private information. <a href="./privacy.html">Read the privacy notice</a>.</p>
      ${employer?'':'<p>Hiring for a role? <a href="./contract-enquiry.html">Use the employer enquiry.</a></p>'}</aside></div></section>
      <script type="module" src="./project-planner.mjs"></script>`, '<link rel="stylesheet" href="./support-tool.css">');
  }
}
