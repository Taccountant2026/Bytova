import {projectById} from './service-catalogue.mjs';

const clean=(v,max)=>String(v??'').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'').trim().slice(0,max);
export function enquiryService(value){return projectById(value);}
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

export function initialiseProjectPlanner(){
 const root=document.querySelector('[data-project-planner]');if(!root)return;
 const select=root.querySelector('[data-project-service]'),goal=root.querySelector('[data-project-goal]');
 const title=root.querySelector('[data-project-label]'),hint=root.querySelector('[data-project-hint]');
 const result=root.querySelector('[data-project-result]'),draft=root.querySelector('[data-project-draft]'),email=root.querySelector('[data-project-email]');
 const status=root.querySelector('[data-project-status]');let built=false;
 const by=(key)=>root.querySelector(`[data-project-${key}]`);
 const params=new URLSearchParams(location.search),chosen=projectById(params.get('service'));
 if(chosen){select.value=chosen.id;if(chosen.group==='business')by('audience').value='Sole trader / small business';}
 function describe(){const service=projectById(select.value);title.textContent=service?.detailLabel||'What would you like help with?';goal.placeholder=service?.placeholder||'Tell Leighton what you want to achieve.';hint.textContent=service?'Quoted work · scope, price and arrangements agreed before work starts':'Not sure? Describe the result you want and Leighton will help you choose.';}
 function update(){if(!built)return;const text=buildProjectBrief(select.value,{name:by('name').value,audience:by('audience').value,goal:goal.value,systems:by('systems').value,budget:by('budget').value,timing:by('timing').value,communication:by('communication').value});draft.value=text;email.href=`mailto:${root.dataset.email}?subject=${encodeURIComponent('Bytova enquiry: '+(projectById(select.value)?.name||'Help choosing'))}&body=${encodeURIComponent(text)}`;status.textContent='';}
 select.addEventListener('change',()=>{describe();update();});
 root.querySelectorAll('input,textarea,select').forEach(el=>{if(el!==draft)el.addEventListener('input',update);});
 by('build').addEventListener('click',()=>{if(goal.value.trim().length<10){status.textContent='Add a short description of the help or outcome you need.';goal.setAttribute('aria-invalid','true');goal.focus();return;}goal.removeAttribute('aria-invalid');built=true;update();result.hidden=false;by('result-title').focus();});
 by('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(draft.value);status.textContent='Enquiry copied. Paste it into your email or notes.';}catch{draft.focus();draft.select();status.textContent='Select and copy the enquiry text using your device’s copy command.';}});
 describe();
}
if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialiseProjectPlanner);else initialiseProjectPlanner();}
