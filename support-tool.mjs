export const supportQuestions = [
  { id:'topic', title:'What would you like a hand with?', detail:'Choose the closest description of your one task.', choices:[
    {value:'issue',label:'Something has stopped working properly',detail:'One everyday Windows, supported app, email or connected-printer issue.'},
    {value:'setup',label:'I want to set up one new thing',detail:'One supported app, email account or agreed device setup.'},
    {value:'care',label:'I want to understand my computer’s care',detail:'Startup, storage, updates and common Windows security settings.'},
    {value:'unsure',label:'I am not sure which kind of help fits',detail:'Let’s make the question clearer first.'},
    {value:'outside',label:'Hardware, lost data or an active security incident',detail:'These need help outside Bytova’s three routine remote appointments.'},
  ]},
  { id:'ready', title:'Can you join a remote appointment?', detail:'You need to stay at a usable computer, with working internet and permission to make the agreed changes.', choices:[
    {value:'yes',label:'Yes, my Windows computer and internet work',detail:'I can join, stay present and follow the joining instructions.'},
    {value:'no',label:'No, I cannot use or connect the computer',detail:'Let’s check the right next step before arranging remote help.'},
    {value:'unsure',label:'I would like to check suitability first',detail:'For example, a different device or uncertainty about remote access.'},
  ]},
  { id:'pace', title:'What would make the support feel easier?', detail:'Choose a starting point for the conversation with Leighton.', choices:[
    {value:'standard',label:'A clear explanation and practical next steps',detail:'I am comfortable following the appointment as it happens.'},
    {value:'calm',label:'A patient, step-by-step walkthrough',detail:'I would appreciate time to understand each part.'},
    {value:'written',label:'Written communication before I book',detail:'I would like to agree communication needs and suitability by email first.'},
  ]},
];

export function recommendSupport(answers) {
  if (!supportQuestions.every(q=>q.choices.some(c=>c.value===answers?.[q.id]))) return {kind:'contact',serviceId:null,emailFirst:true,title:'Let’s make the next step clearer.',reason:'Choose an answer to each question, or email Leighton to discuss suitability.'};
  if (answers.topic==='outside') return {kind:'outside',serviceId:null,emailFirst:true,title:'This needs a different kind of help.',reason:'These routine appointments do not cover hardware repair, data recovery or migration, active fraud, incident response or account ownership bypass. Arrange appropriate specialist support before booking a routine remote session.'};
  if (answers.ready!=='yes') return {kind:'contact',serviceId:null,emailFirst:true,title:'Let’s check remote suitability first.',reason:'Remote support needs a usable computer, working internet, permission and your presence. Email Leighton with the device and the one task before paying for an appointment.'};
  if (answers.topic==='unsure') return {kind:'contact',serviceId:null,emailFirst:true,title:'Let’s choose it together.',reason:'A short description of what you want to achieve will help Leighton check which appointment, if any, fits.'};
  const serviceId={issue:'remote-tech-help',setup:'setup-getting-started',care:'computer-care-safety-check'}[answers.topic];
  return {kind:'service',serviceId,emailFirst:answers.topic==='setup'||answers.pace==='written',title:'A useful starting point for you.',reason:answers.topic==='setup'?'Email first so the app, account or supported device and the one setup task can be agreed.':answers.pace==='written'?'Email first to agree your communication needs and check that the appointment is suitable.':'Check the included scope below. This is a guide to choosing a service; Leighton will agree the actual task with you.'};
}

export function supportChecklist(service) {
  return service ? [...service.prepare,'Keep your appointment and joining instructions to hand.','Close private windows and keep passwords and sign-in codes to yourself.'] : ['Write down the one task or issue you need help with.','Note the device and operating system, if known.','Describe whether the computer and internet are usable.','Check the service scope with Leighton before booking.'];
}

export function buildSupportBrief(service, answers, details={}, readyItems=[], allItems=[]) {
  const label=(key)=>supportQuestions.find(q=>q.id===key)?.choices.find(c=>c.value===answers[key])?.label||'Not selected';
  return ['Hello Leighton,','','I used the Bytova support guide to prepare this question.',
    service?`Starting point: ${service.name} — £${service.price} total / ${service.minutes} minutes.`:'Starting point: please check suitability before an appointment.',
    `Task type: ${label('topic')}`,`Remote readiness: ${label('ready')}`,`Communication preference: ${label('pace')}`,'',
    'My device / operating system:',String(details.device||'To be discussed').trim().slice(0,120),'',
    'The one task or issue I would like help with:',String(details.task||'To be discussed').trim().slice(0,600),'',
    `Preparation: ${readyItems.length} of ${allItems.length} items marked ready.`,
    ...(readyItems.length?['Marked ready:',...readyItems.map(item=>'- '+item)]:[]),
    ...(allItems.some(item=>!readyItems.includes(item))?['Still to prepare:',...allItems.filter(item=>!readyItems.includes(item)).map(item=>'- '+item)]:[]),'',
    'Please confirm the agreed task, suitability and next steps. This message is not a booking confirmation.',
  ].join('\n');
}

function initialiseSupportGuide() {
  const tool=document.querySelector('[data-support-tool]');if(!tool)return;
  let config;try{config=JSON.parse(document.getElementById('support-config').textContent);}catch{return;}
  const questionPanel=tool.querySelector('[data-support-questions]'),steps=[...tool.querySelectorAll('[data-support-step]')],progressItems=[...tool.querySelectorAll('[data-support-progress]')];
  const next=tool.querySelector('[data-support-next]'),back=tool.querySelector('[data-support-back]'),stepStatus=tool.querySelector('[data-support-step-status]');
  const result=tool.querySelector('[data-support-result]'),heading=tool.querySelector('[data-support-title]'),summary=tool.querySelector('[data-support-summary]'),reason=tool.querySelector('[data-support-reason]');
  const serviceLink=tool.querySelector('[data-support-service]'),bookLink=tool.querySelector('[data-support-book]'),emailLink=tool.querySelector('[data-support-email]');
  const device=tool.querySelector('[data-support-device]'),task=tool.querySelector('[data-support-task]'),brief=tool.querySelector('[data-support-brief]'),checklist=tool.querySelector('[data-support-checklist]');
  const prepProgress=tool.querySelector('[data-plan-meter]'),prepStatus=tool.querySelector('[data-plan-status]'),copyStatus=tool.querySelector('[data-support-copy-status]');
  let step=0,service=null,answers={},items=[];
  const values=()=>Object.fromEntries(supportQuestions.map(q=>[q.id,tool.querySelector(`input[name="support-${q.id}"]:checked`)?.value||'']));
  function showStep(focus=false){questionPanel.hidden=false;result.hidden=true;steps.forEach((node,i)=>{node.hidden=i!==step;});progressItems.forEach((node,i)=>{node.classList.toggle('complete',i<step);if(i===step)node.setAttribute('aria-current','step');else node.removeAttribute('aria-current');});back.hidden=step===0;next.textContent=step===2?'Build my support plan':'Next question';next.disabled=!values()[supportQuestions[step].id];stepStatus.textContent=`Question ${step+1} of ${steps.length}`;if(focus)steps[step].querySelector('legend').focus();}
  function updatePlan(){
    const ready=[...checklist.querySelectorAll('input:checked')].map(input=>items[Number(input.value)]);
    prepProgress.max=items.length;prepProgress.value=ready.length;prepStatus.textContent=`${ready.length} of ${items.length} preparation items ready`;
    brief.value=buildSupportBrief(service,answers,{device:device.value,task:task.value},ready,items);
    tool.querySelector('[data-support-print-brief]').textContent=brief.value;
    emailLink.href=`mailto:${config.email}?subject=${encodeURIComponent(service?'My Bytova support plan: '+service.name:'Bytova suitability question')}&body=${encodeURIComponent(brief.value)}`;
    copyStatus.textContent='';
  }
  function showResult(){
    answers=values();const outcome=recommendSupport(answers);service=config.services.find(s=>s.id===outcome.serviceId)||null;
    heading.textContent=outcome.title;reason.textContent=outcome.reason;
    summary.textContent=service?`${service.name} · £${service.price} total · ${service.minutes} minutes`:'Please check suitability before booking';
    serviceLink.hidden=!service;bookLink.hidden=!service||outcome.emailFirst;
    if(service){serviceLink.href='./'+service.file;serviceLink.textContent='Read what’s included';bookLink.href='./book.html?service='+encodeURIComponent(service.id);bookLink.textContent='Choose a time for '+service.name;}
    emailLink.textContent=outcome.emailFirst?'Email Leighton before booking':'Email my plan to Leighton';
    items=supportChecklist(service);checklist.replaceChildren();
    items.forEach((text,i)=>{const label=document.createElement('label'),input=document.createElement('input'),span=document.createElement('span');input.type='checkbox';input.value=String(i);input.addEventListener('change',updatePlan);span.textContent=text;label.append(input,span);checklist.append(label);});
    questionPanel.hidden=true;result.hidden=false;progressItems.forEach(node=>{node.classList.add('complete');node.removeAttribute('aria-current');});stepStatus.textContent='Your support plan';updatePlan();heading.focus();
  }
  steps.forEach(node=>node.addEventListener('change',()=>{next.disabled=!values()[supportQuestions[step].id];}));
  next.addEventListener('click',()=>{if(!values()[supportQuestions[step].id])return;if(step<2){step++;showStep(true);}else showResult();});
  back.addEventListener('click',()=>{if(step>0){step--;showStep(true);}});
  tool.querySelector('[data-support-adjust]').addEventListener('click',()=>{step=0;showStep(true);});
  device.addEventListener('input',updatePlan);task.addEventListener('input',updatePlan);
  tool.querySelector('[data-support-copy]').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(brief.value);copyStatus.textContent='Plan copied. You can paste it into an email or your own notes.';}catch{copyStatus.textContent='Select the plan text below and copy it using your device’s copy command.';brief.focus();brief.select();}});
  tool.querySelector('[data-support-print]').addEventListener('click',()=>window.print());
  showStep();
}

if(typeof document!=='undefined'){
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialiseSupportGuide);else initialiseSupportGuide();
}
