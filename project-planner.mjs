import {audiences,engagementFor} from './audiences.mjs';
import {projectById} from './service-catalogue.mjs';
import {funnelFor,funnelForService,reviewFromQuery} from './funnels.mjs';

const clean=(v,max)=>String(v??'').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'').trim().slice(0,max);
export function enquiryService(value){return projectById(value);}
export function websiteLead(serviceId,details={}){
 const hiring = details.kind === 'employer' ? engagementFor(serviceId) : null;
 if(details.kind === 'employer' && !hiring) throw new Error('Choose a type of hiring enquiry.');
 const service = hiring ? null : projectById(serviceId);
 const route = hiring ? 'general' : funnelForService(serviceId)?.id || (!service && funnelFor(details.route)?.id==='remote' ? 'remote' : 'general');
 const name=clean(details.name,51),email=clean(details.email,255).toLowerCase();
 if(!name||name.length>50||/[\r\n]/.test(name))throw new Error('Enter your name, using up to 50 characters.');
 if(email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new Error('Enter a valid reply email address.');
 if(details.privacyAccepted!==true)throw new Error('Please read the privacy notice and confirm you want a reply.');
 if(typeof details.body!=='string'||details.body.length<20||details.body.length>3000)throw new Error('Build and review your enquiry before sending.');
 const campaign=typeof details.campaign==='string'&&/^[a-zA-Z0-9][a-zA-Z0-9 _.-]{0,59}$/.test(details.campaign)?details.campaign:'';
 return {brand:'bytova',route,name,email,title:hiring ? 'Bytova hiring: '+hiring.name : 'Bytova: '+(service?.name||'Help choosing a service'),body:details.body,privacyAccepted:true,website:clean(details.website,200),campaign};
}
export function buildProjectBrief(serviceId,details={}){
 const service=projectById(serviceId);
 return ['Hello Leighton,','',`I would like to discuss: ${service?.name||'Help choosing a Bytova service'}.`,
  `Name / business (optional): ${clean(details.name,140)||'To be discussed'}`,
  `Customer context: ${['Home / personal','Sole trader / small business','Not sure'].includes(details.audience)?details.audience:'Not sure'}`,'',
  'What I need help with:',clean(details.goal,1000)||'To be discussed','',
  'Device, systems or existing website (no passwords):',clean(details.systems,300)||'To be discussed','',
  `Budget or constraints (optional): ${clean(details.budget,160)||'Please advise'}`,
  `Preferred timing (optional): ${clean(details.timing,120)||'To be discussed'}`,
  `Communication preference: ${details.communication==='Written email first'?'Written email first':'Please agree a suitable approach by email'}`,'',
  'Please confirm suitability, the proposed scope, price, any diagnostic charge or third-party costs, and the next step before I commit.',
  service&&['repairs','upgrades','transfer'].includes(service.id)?'I will not send or bring equipment until the handover arrangements have been agreed.':'',
  'This is an enquiry, not a confirmed booking, work authorisation or marketing subscription.',
 ].filter((v,i,a)=>v!==''||a[i-1]!=='').join('\n');
}

export function buildContractBrief(value, details={}) {
 const opportunity = engagementFor(value);
 if (!opportunity) throw new Error('Choose a type of hiring enquiry.');
 const fields = [
   ['Organisation or agency', clean(details.name,140)],
   ['Role or assignment', clean(details.role,150)],
   ['Responsibilities or deliverable', clean(details.goal,1000)],
   ['Location and work pattern', clean(details.systems,300)],
   ['Start date and duration', clean(details.timing,120)],
   ['Rate range or budget', clean(details.budget,160)]
 ];
 return [
   'Hello Leighton,', '', 'Hiring enquiry · '+opportunity.name,
   ...fields.filter(([,v])=>v).map(([label,v])=>label+': '+v),
   '', value==='cv' ? 'Please send me your CV by email.' : 'Please let me know whether this opportunity fits and when you would be available.'
 ].join('\n');
}

export function initialiseProjectPlanner(){
 const root=document.querySelector('[data-project-planner]');if(!root)return;
 const select=root.querySelector('[data-project-service]'),goal=root.querySelector('[data-project-goal]');
 const title=root.querySelector('[data-project-label]'),hint=root.querySelector('[data-project-hint]');
 const result=root.querySelector('[data-project-result]'),draft=root.querySelector('[data-project-draft]'),email=root.querySelector('[data-project-email]');
 const status=root.querySelector('[data-project-status]');let built=false;
 const by=(key)=>root.querySelector(`[data-project-${key}]`);
 const employer = root.dataset.kind === 'employer';
 const params = new URLSearchParams(location.search);
 const chosen = employer ? engagementFor(params.get('engagement')) : projectById(params.get('service'));
 if (chosen) select.value = chosen.id;
 const topics = {support:'IT support or service desk', data:'AI data and quality review', web:'Website and ecommerce testing'};
 if (employer) {
   const focus=params.get('focus');
   if (Object.hasOwn(topics,focus)) by('role').value=topics[focus];
 } else {
   const rawAudience=params.get('audience');
   const requested=(chosen?.group==='business' && rawAudience==='household') || (chosen?.group==='home' && rawAudience==='business') ? '' : rawAudience;
   const audience=audiences.find(a=>a.id===requested && a.id!=='employer') ||
     audiences.find(a=>a.id===(chosen?.group==='business'?'business':chosen?.group==='home'?'household':''));
   if(audience) by('audience').value=audience.id==='business'?'Sole trader / small business':'Home / personal';
   const packageName = params.get('package');
   // The URL can suggest a brief, but the visitor reviews it before sending.
   if (chosen && packageName && packageName.length <= 80) goal.value='I would like a written quote for '+packageName+'.\nMy requirements are: ';
   const priorities=reviewFromQuery(params.get('review'));
   if(priorities.length)goal.value='My digital-priorities check highlighted:\n'+priorities.map(q=>'- '+q.action).join('\n')+'\n\nThe improvement I would like to discuss is: ';
 }
 function describe(){
   if(employer){
     const cv=select.value==='cv';
     title.textContent=cv?'What should I know about the opportunity? (optional)':'What does your team need?';
     goal.placeholder=cv?'You can leave this blank to request a CV.':'Describe responsibilities, deliverables or the cover your team needs.';
     hint.textContent=cv?'You can review and send a CV request with just your reply details.':'Outline the role or assignment. Leave out private candidate or client data.';
     return;
   }
   const audience=audiences.find(a=>a.id===(by('audience').value==='Home / personal'?'household':by('audience').value==='Sole trader / small business'?'business':''));
   for(const option of select.options){
     const candidate=projectById(option.value);
     const eligible=!candidate || !audience || (audience.id==='household' ? candidate.group!=='business' : candidate.group!=='home');
     option.hidden=!eligible;
     option.disabled=!eligible;
   }
   if(select.selectedOptions[0]?.disabled)select.value='';
   const service=projectById(select.value);
   const digital=!service && audience?.id==='household' && params.get('task')==='digital';
   document.querySelector('[data-project-heading]').textContent=audience?.id==='household'?'Ask for household help':audience?.id==='business'?'Send a business project brief':'Tell me what you need';
   const back=document.querySelector('[data-project-back]');
   back.href=audience?'./'+audience.file:'./start-here.html'; back.textContent=audience?.name||'Choose your route';
   title.textContent=service?.detailLabel||(digital?'What digital task would you like help with?':'What would you like help with?');
   goal.placeholder=service?.placeholder||(digital?'For example, combine five scanned pages into a single PDF.':'Describe the problem or outcome you have in mind.');
   hint.textContent='Share enough detail for a first reply. Leave out passwords and private customer records.';
 }
 function update(){
   if(!built)return;
   const details={name:by('name').value,goal:goal.value,systems:by('systems').value,budget:by('budget').value,timing:by('timing').value};
   if(employer)details.role=by('role').value;
   else Object.assign(details,{audience:by('audience').value,communication:by('communication').value});
   const text=employer?buildContractBrief(select.value,details):buildProjectBrief(select.value,details);
   const subject=employer?'Bytova hiring: '+engagementFor(select.value).name:'Bytova enquiry: '+(projectById(select.value)?.name||'Help choosing');
   draft.value=text;email.href='mailto:'+root.dataset.email+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(text);status.textContent='';
 }
 function invalidateReview(){
   if(!built)return;
   built=false;result.hidden=true;by('success').hidden=true;by('send-fields').hidden=false;by('privacy').checked=false;
   status.textContent='Your details have changed. Review your message again before sending.';
 }
 if(!employer)by('audience').addEventListener('change',()=>{describe();invalidateReview();});
 select.addEventListener('change',()=>{describe();invalidateReview();});
 root.querySelector('[data-project-fields]').addEventListener('input',invalidateReview);
 by('build').addEventListener('click',()=>{if(!(employer && select.value==='cv') && goal.value.trim().length<10){status.textContent='Add a short description of the help or outcome you need.';goal.setAttribute('aria-invalid','true');goal.focus();return;}goal.removeAttribute('aria-invalid');built=true;update();result.hidden=false;window.dispatchEvent(new CustomEvent('business-metric',{detail:{event:'complete_tool'}}));by('result-title').focus();});
 by('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(draft.value);status.textContent='Enquiry copied. Paste it into your email or notes.';}catch{draft.focus();draft.select();status.textContent='Select and copy the enquiry text using your device’s copy command.';}});
 const send=by('send'),sendStatus=by('send-status'),success=by('success');let attempt=null;
 send.addEventListener('click',async()=>{
  sendStatus.textContent='';
  if(!by('sender-name').reportValidity()||!by('sender-email').reportValidity()||!by('privacy').reportValidity())return;
  let payload;try{payload=websiteLead(select.value,{kind:root.dataset.kind,name:by('sender-name').value,email:by('sender-email').value,privacyAccepted:by('privacy').checked,body:draft.value,route:params.get('funnel'),website:by('website').value,campaign:params.get('utm_campaign')});}catch(error){sendStatus.textContent=error.message;return;}
  const serialized=JSON.stringify(payload);if(!attempt||attempt.body!==serialized)attempt={body:serialized,key:crypto.randomUUID()};
  const controls=[...root.querySelectorAll('input,select,textarea,button')].map(el=>[el,el.disabled]);controls.forEach(([el])=>el.disabled=true);send.textContent='Sending your enquiry…';
  try{const response=await fetch('https://bytova.taccountant.chatgpt.site/api/leads',{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload,requestKey:attempt.key}),signal:AbortSignal.timeout(15000)}),data=await response.json();if(!response.ok||!data.reference)throw new Error(data.error||'Your enquiry could not be confirmed.');
   window.dispatchEvent(new CustomEvent('business-metric',{detail:{event:'generate_lead',lead_type:employer?'contract_enquiry':'website_project'}}));by('reference').textContent=data.reference;success.hidden=false;by('send-fields').hidden=true;by('success-title').focus();
  }catch(error){sendStatus.textContent=(error.name==='TimeoutError'?'The reply took too long to confirm.':error.message||'The connection could not be confirmed.')+' Retry the same enquiry, or use the email draft above. Keep the same details when retrying to prevent duplicates.';}
  finally{controls.forEach(([el,disabled])=>el.disabled=disabled);send.textContent='Send my enquiry';}
 });
 describe();
}
if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialiseProjectPlanner);else initialiseProjectPlanner();}
