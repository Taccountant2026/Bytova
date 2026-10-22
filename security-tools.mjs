import {assess,validateData} from './php-security-core.mjs';
const $=s=>document.querySelector(s);
const metric=event=>window.dispatchEvent(new CustomEvent('business-metric',{detail:{event}}));
const save=(name,value)=>{
 const blob=new Blob([JSON.stringify(value,null,2)+'\n'],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
const titles={patched:'Patched for these advisories',vulnerable:'Vulnerable upstream version',unsupported:'Unsupported by PHP',unverified:'Status unverified'};
const checker=$('#php-checker');
if(checker){
 let data=null,last=null;
 const state=$('#checker-data-state'),submit=$('#check-submit'),download=$('#download-result'),result=$('#php-result'),provider=$('#php-provider');
 const syncVendor=()=>{$('#vendor-fields').hidden=provider.value!=='vendor';};
 provider.addEventListener('change',()=>{syncVendor();invalidate();});
 function invalidate(){last=null;download.hidden=true;result.removeAttribute('data-status');result.replaceChildren();const h=document.createElement('h2');h.textContent='Ready to check.';const p=document.createElement('p');p.textContent='Submit the current details to get a new result.';result.append(h,p);}
 checker.addEventListener('input',invalidate);
 checker.addEventListener('reset',()=>{invalidate();queueMicrotask(syncVendor);});
 try{
  const r=await fetch(new URL('./assets/security/advisories.json',import.meta.url),{credentials:'omit',cache:'no-store'});
  if(!r.ok)throw new Error('Advisory file unavailable');
  data=await r.json();if(!validateData(data))throw new Error('Advisory file invalid');
  state.textContent=`Advisory snapshot checked ${data.reviewed}. Review due ${data.review_due}.`;
  submit.disabled=false;
 }catch{state.textContent='The advisory snapshot could not be loaded or validated. Use the official source links and the fixed-release table; no result will be guessed.';}
 checker.addEventListener('submit',event=>{
  event.preventDefault();if(!data||!checker.reportValidity())return;
  const input=Object.fromEntries(new FormData(checker));last=assess(input,data);
  result.dataset.status=last.status;result.replaceChildren();
  const label=document.createElement('p');label.className='eyebrow';label.textContent='YOUR RESULT';
  const heading=document.createElement('h2');heading.textContent=titles[last.status];
  const reason=document.createElement('p');reason.textContent=last.reason;
  const limitation=document.createElement('p');limitation.textContent=last.limitations;
  const date=document.createElement('p');date.className='small-note';date.textContent=`Sources checked ${last.reviewed}; review due ${last.review_due}.`;
  result.append(label,heading,reason,limitation,date);
  if(last.upstream_support==='unsupported'){const p=document.createElement('p');p.textContent='Upstream support: ended or outside this support calendar. Vendor maintenance is separate.';result.append(p);}
  const ul=document.createElement('ul');
  for(const href of last.source_urls){const li=document.createElement('li'),a=document.createElement('a');a.href=href;a.textContent=new URL(href).hostname+' · official source';a.dataset.officialLink='';li.append(a);ul.append(li);}
  result.append(ul);const next=document.createElement('a');next.href='./php-remediation-guide.html';next.textContent='Work through the remediation guide →';result.append(next);
  download.hidden=false;metric('php_version_check');
 });
 download.addEventListener('click',()=>{if(last)save('bytova-php-version-result.json',last);});
}
const wizard=$('.security-wizard');
if(wizard){
 const items=[...document.querySelectorAll('[data-wizard-step]')],checks=[...document.querySelectorAll('[data-step-complete]')];
 let current=0,showAll=false;
 const env=$('#hosting-environment');
 const advice={managed:'Ask the managed provider to confirm the PHP package fix, worker replacement and maintenance window. A panel label alone is not patch evidence.',shared:'Use the hosting panel’s supported PHP selector and ask the host which exact build contains both fixes. Do not upload your own PHP binary or publish phpinfo(). Confirm how existing workers are replaced.',linux:'Identify your OS release and signed package source. Read both vendor CVE records and record the full package revision. Plan the appropriate PHP-FPM or Apache worker replacement with the administrator.',windows:'Identify the actual PHP executable used by IIS FastCGI or Apache, its architecture, thread-safety build and extensions. Follow vendor instructions and replace the relevant processes or application pools. CLI PHP on PATH may be a different installation.',container:'Rebuild from a verified fixed base image, record its digest and deploy through the established rollout process. Replace every affected replica and check rollback images. Updating one running container does not patch the rest.'};
 const controls=$('#wizard-controls'),buttons=$('#wizard-buttons');controls.hidden=false;buttons.hidden=false;$('#wizard-download').hidden=false;
 function render(focus=false){
  items.forEach((item,i)=>item.hidden=!showAll&&i!==current);
  const done=checks.filter(c=>c.checked).length;
  $('#wizard-status').textContent=`Step ${current+1} of ${items.length} · ${done} completed`;
  $('#wizard-progress').value=done;$('#wizard-back').disabled=current===0;$('#wizard-next').disabled=current===items.length-1;
  $('#wizard-all').textContent=showAll?'Show one step at a time':'Show all steps';
  $('#wizard-completion').textContent=done===items.length?'All ten steps marked complete. Review your evidence and outstanding risks before closing the change.':`${done} of ${items.length} steps marked complete. A tick is your record, not independent verification.`;
  if(focus)$('#wizard-title-'+current).focus();
 }
 env.addEventListener('change',()=>{$('#hosting-advice').replaceChildren();const p=document.createElement('p');p.textContent=advice[env.value]||advice.managed;$('#hosting-advice').append(p);});
 $('#uses-wordpress').addEventListener('change',event=>{$('#wordpress-advice').hidden=!event.target.checked;});
 $('#wizard-next').addEventListener('click',()=>{current=Math.min(items.length-1,current+1);render(true);});
 $('#wizard-back').addEventListener('click',()=>{current=Math.max(0,current-1);render(true);});
 $('#wizard-all').addEventListener('click',()=>{showAll=!showAll;render();});
 checks.forEach(c=>c.addEventListener('change',()=>render()));
 $('#wizard-download').addEventListener('click',()=>save('bytova-php-remediation-progress.json',{created:new Date().toISOString(),source_reviewed:'2026-10-22',environment:env.value,wordpress:$('#uses-wordpress').checked,steps:checks.map((c,i)=>({step:i+1,title:$('#wizard-title-'+i).textContent,marked_complete:c.checked})),limitations:'Self-recorded progress only. No independent inspection or infrastructure changes were performed by this tool.'}));
 render();metric('remediation_guide_view');
}
const updates=$('#security-updates');
if(updates){
 const link=$('#updates-draft'),status=$('#updates-status');
 $('#updates-consent').addEventListener('change',()=>{link.hidden=true;link.href='#';status.textContent='';});
 updates.addEventListener('submit',event=>{event.preventDefault();if(!updates.reportValidity()||!$('#updates-consent').checked)return;
  const body='Hello Leighton,\n\nI explicitly request email updates about CVE-2026-109618 and CVE-2026-109619. I understand this is optional, does not request other marketing, and I can withdraw by replying stop.\n\nPlease confirm whether you can provide these updates.\n';
  link.href='mailto:hello@bytova.co.uk?subject='+encodeURIComponent('Explicit request: PHP advisory updates')+'&body='+encodeURIComponent(body);link.hidden=false;status.textContent='Your request is ready to review in your email app. You have not been subscribed or sent anything.';
 });
}
document.addEventListener('click',event=>{const a=event.target.closest?.('a');if(!a)return;if(a.hasAttribute('data-checklist-download'))metric('security_checklist_download');if(a.hasAttribute('data-official-link'))metric('official_patch_click');if(a.hasAttribute('data-assistance-intent'))metric('security_assistance_intent');});
if(location.pathname.endsWith('/php-security-advisory.html'))metric('security_advisory_view');
