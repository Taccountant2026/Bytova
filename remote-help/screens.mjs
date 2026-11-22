// No private ticket data appears in these public source strings.
// Operator data is rendered only after an authenticated API request.
export const operatorHtml=String.raw`<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bytova | Remote Help Operations</title><link rel="stylesheet" href="/app.css"><script defer src="/operator.js"></script></head>
<body><a class="skip" href="#main">Skip to dashboard</a><header class="brand-bar"><div class="shell"><span class="brand">BYTOVA<span class="dot">.</span></span><span class="brand-sub">Remote Help / Operations</span></div></header>
<main id="main" class="shell">
<section class="heading"><p class="eyebrow">PRIVATE OPERATOR CONSOLE</p><h1>Support, from first enquiry to final follow-up.</h1><p>Single-operator service management. Calendar confirmation and payment verification are separate records. Test payments only until live launch approval.</p></section>
<section class="gate card" id="gate"><label for="token">Operator access key</label><div class="gate-row"><input id="token" type="password" autocomplete="off" placeholder="Paste your approved operator key"><button id="connect" class="primary">Open tickets</button></div><p class="hint">This key remains in this browser tab's memory only. Use Cloudflare Access with MFA before deploying this console. Never share or save the key in a ticket.</p></section>
<section id="panel" hidden>
<div class="stats" aria-label="Ticket overview"><div class="stat card"><strong id="newCount">—</strong><span>New / review</span></div><div class="stat card"><strong id="waitingCount">—</strong><span>Waiting / payment</span></div><div class="stat card"><strong id="confirmedCount">—</strong><span>Confirmed / ready</span></div><div class="stat card"><strong id="closedCount">—</strong><span>Completed / closed</span></div></div>
<div class="panel-head"><div><p class="eyebrow">BYTOVA / CASES</p><h2>Support tickets</h2></div><div class="panel-actions"><label class="sr" for="filter">Find ticket</label><input id="filter" type="search" placeholder="Search reference, name or service"><button id="refresh" class="secondary">Refresh</button><button id="lock" class="secondary">Lock</button></div></div>
<div class="table-wrap card"><table><thead><tr><th>Reference</th><th>Customer</th><th>Service</th><th>Status</th><th>Payment</th><th>Updated</th><th></th></tr></thead><tbody id="ticketRows"><tr><td colspan="7">No tickets loaded</td></tr></tbody></table></div>
<section class="detail card" id="detail" hidden aria-labelledby="ticketHeading"><div class="detail-head"><div><p class="eyebrow">PRIVATE CASE RECORD</p><h2 id="ticketHeading">Ticket</h2></div><button id="closeDetail" class="secondary">Close details</button></div>
<div class="fields" id="ticketFields"></div>
<div class="detail-grid"><div><h3>Case actions</h3><label for="newState">Change status</label><select id="newState"></select><button id="applyState" class="primary">Apply status</button>
<label for="note">Internal work note</label><textarea id="note" rows="4" maxlength="1800" placeholder="Record agreed work, actions, results and follow-up. No passwords or codes."></textarea><button id="addNote" class="secondary">Save private note</button>
<h3>Customer communication</h3><p class="hint">Open a reviewable email draft in your own mail app. No email is sent by this dashboard.</p><button id="ackEmail" type="button" class="secondary">Draft acknowledgement</button><button id="prepEmail" type="button" class="secondary">Draft session instructions</button><button id="closeEmail" type="button" class="secondary">Draft aftercare summary</button>
<h3>Calendar link</h3><label for="invitee">Calendly invitee API URI</label><input id="invitee" placeholder="https://api.calendly.com/scheduled_events/.../invitees/..."><label for="appointment">Appointment date and time</label><input id="appointment" type="datetime-local"><button id="saveBooking" class="secondary">Save verified link</button>
<h3>Payments</h3><p class="hint">Test-mode Stripe Checkout is available only after suitability approval and secret configuration. No live charges.</p><button id="checkout" class="secondary">Create test checkout</button><div id="checkoutLink"></div>
</div><div><h3>Activity history</h3><ul class="timeline" id="ticketEvents"></ul><p class="hint">Use the customer’s verified email for joining instructions; this system never requests passwords, one-time codes or unattended AnyDesk access.</p></div></div>
</section></section><p id="feedback" class="feedback" role="status" aria-live="polite"></p>
</main><footer class="shell footer">Bytova · Independent IT & Digital Support · Private operator environment</footer></body></html>`;
export const requestHtml=String.raw`<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Request Remote Help | Bytova</title><link rel="stylesheet" href="/app.css"><script defer src="https://challenges.cloudflare.com/turnstile/v0/api.js"></script><script defer src="/request.js"></script></head>
<body><a class="skip" href="#main">Skip to request</a><header class="brand-bar"><div class="shell"><span class="brand">BYTOVA<span class="dot">.</span></span><span class="brand-sub">Remote Help / Request</span></div></header>
<main id="main" class="shell request-page"><div class="heading"><p class="eyebrow">SECURE SERVICE ENQUIRY</p><h1>Tell me what needs sorting.</h1><p>I’m Leighton, the independent IT specialist behind Bytova. Explain one issue and I’ll confirm whether remote help is suitable. This is a request, not a booked or paid appointment.</p></div>
<section class="card form-card"><form id="requestForm"><label for="fullName">Your name <span aria-hidden="true">*</span></label><input id="fullName" name="name" autocomplete="name" required maxlength="90">
<label for="email">Email address <span aria-hidden="true">*</span></label><input id="email" name="email" type="email" autocomplete="email" required maxlength="254">
<label for="service">Choose the service <span aria-hidden="true">*</span></label><select id="service" name="service" required><option value="">Choose a service</option><option value="remote-tech-help">Remote Tech Help — £25 / 30 minutes</option><option value="setup-getting-started">Setup & Getting Started — £35 / 60 minutes</option><option value="computer-care-safety-check">Computer Care & Safety Check — £29 / 60 minutes</option></select>
<label for="device">Device / operating system (optional)</label><input id="device" name="device" maxlength="160" placeholder="For example, Windows 11 laptop">
<label for="description">What is the issue? <span aria-hidden="true">*</span></label><textarea id="description" name="description" required minlength="15" maxlength="1200" rows="5" placeholder="Tell me what you expected and what happened. Do not include passwords, payment details or security codes."></textarea>
<div class="honey" aria-hidden="true"><label for="website">Website</label><input id="website" name="website" tabindex="-1" autocomplete="off"></div>
<div class="cf-turnstile" data-sitekey="__TURNSTILE_SITE_KEY__"></div><p id="challengeWarning" class="hint" hidden>Secure intake is not yet activated. Please use the email option below.</p>
<p class="hint">By submitting, you ask Bytova to review your request and reply by email. Please read the <a href="https://bytova.co.uk/privacy.html">privacy notice</a>. No payment is taken here.</p>
<button id="submitRequest" class="primary" type="submit">Send request for review</button><p id="requestFeedback" role="status" aria-live="polite"></p></form>
<aside class="advice"><h2>Before we connect</h2><p>Keep your files backed up. Only accept an attended remote session you've agreed directly with Bytova. You remain in control and can end access at any time.</p><a href="https://bytova.co.uk/remote-support-safety.html">Read remote support safety</a><p>Prefer email? <a href="mailto:hello@bytova.co.uk?subject=Bytova%20remote%20support%20enquiry">Contact me directly</a>.</p></aside></section></main>
<footer class="shell footer">Bytova · Independent IT & Digital Support · UK</footer></body></html>`;
export const appCss=String.raw`*{box-sizing:border-box}body{margin:0;color:#12235b;background:#f4f7fb;font:16px/1.6 system-ui,-apple-system,Segoe UI,Arial,sans-serif}h1,h2,h3{line-height:1.2}a{color:#005d97}button,input,textarea,select{font:inherit}input,textarea,select{min-width:0}button{cursor:pointer}button:disabled{opacity:.5;cursor:not-allowed}a:focus-visible,button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:3px solid #00a8ce;outline-offset:3px}.shell{width:min(1140px,calc(100% - 36px));margin:auto}.brand-bar{background:#0a1a5c;color:#fff;padding:16px 0}.brand-bar>.shell{display:flex;align-items:center;gap:22px;flex-wrap:wrap}.brand{font-size:1.75rem;font-weight:850;letter-spacing:.02em}.dot{color:#00d4ff}.brand-sub{font-size:.86rem;color:#c0ddf3}.heading{padding:42px 0 24px;max-width:780px}.heading h1{font-size:clamp(1.8rem,4vw,3rem);letter-spacing:-.03em;margin:8px 0 16px}.heading p{color:#485879}.heading .eyebrow,.eyebrow{font-size:.72rem;letter-spacing:.12em;font-weight:800;color:#0276a4}.card{background:#fff;border:1px solid #d8e2ee;border-radius:14px;padding:24px;box-shadow:0 8px 28px #0a1a5c0a}.gate{max-width:760px}.gate-row{display:flex;gap:10px}.gate-row input{flex:1}.gate label,.form-card label,.detail label{display:block;font-weight:700;font-size:.89rem;margin:12px 0 6px}input,textarea,select{display:block;width:100%;padding:11px 12px;border:1px solid #9aabc7;border-radius:7px;background:#fff;color:#12235b}input[type="datetime-local"]{max-width:380px}textarea{resize:vertical}.primary,.secondary{padding:11px 17px;border-radius:8px;font-size:.93rem;font-weight:750;min-height:43px}.primary{background:#0a1a5c;color:#fff;border:1px solid #0a1a5c}.primary:hover{background:#123e8c}.secondary{background:#fff;color:#0a1a5c;border:1px solid #a1b4cb}.secondary:hover{background:#eaf5fb}.hint{font-size:.85rem;color:#546681}.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:15px;margin:22px 0 30px}.stat{display:grid;gap:4px}.stat strong{font-size:2rem;line-height:1;color:#0a1a5c}.stat span{color:#536580;font-size:.86rem}.panel-head,.detail-head{display:flex;justify-content:space-between;align-items:end;gap:20px;flex-wrap:wrap}.panel-head h2,.detail-head h2{margin:2px 0 16px}.panel-actions{display:flex;gap:9px;align-items:center;margin-bottom:18px}.panel-actions input{max-width:270px}.table-wrap{padding:0;overflow-x:auto}table{border-collapse:collapse;width:100%;text-align:left;min-width:840px}th,td{padding:16px 12px;border-bottom:1px solid #e1e8f3;font-size:.87rem}th{background:#f3f8fc;white-space:nowrap;font-size:.78rem;text-transform:uppercase;letter-spacing:.05em}td{overflow-wrap:anywhere}td .secondary{padding:6px 10px;min-height:34px}.pill{display:inline-block;background:#edf4fa;color:#12315f;border-radius:100px;padding:2px 9px;font-size:.8rem;font-weight:700;white-space:nowrap}.pill.paid{color:#11623f;background:#e6f7ed}.pill.wait{color:#805300;background:#fff1d8}.detail{margin:24px 0}.fields{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;background:#f5f8fc;padding:17px;border-radius:9px}.field dt{font-size:.72rem;color:#596784;text-transform:uppercase;letter-spacing:.04em}.field dd{margin:3px 0 0;font-weight:650;overflow-wrap:anywhere}.detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:45px;margin-top:28px}.detail-grid h3{margin:25px 0 10px}.detail-grid button{margin:12px 0 8px}.timeline{list-style:none;padding:0}.timeline li{padding:12px 0;border-bottom:1px solid #e0e7ef;font-size:.88rem;overflow-wrap:anywhere}.timeline span{font-size:.77rem;color:#60718b}.feedback{min-height:30px;padding:15px 0;font-weight:650}.footer{padding:38px 0;color:#596681;font-size:.82rem}.skip{position:absolute;left:-10000px;top:0}.skip:focus{left:15px;top:15px;background:#fff;padding:8px}.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}.form-card{max-width:880px;display:grid;grid-template-columns:1.25fr .75fr;gap:38px}.form-card label{margin-top:18px}.advice{padding:16px 20px;background:#eef6fb;border-radius:10px;align-self:start}.advice h2{font-size:1.3rem}.advice p{color:#435776}.honey{position:absolute;left:-10000px;opacity:0}.request-page{padding-bottom:30px}#requestFeedback{font-weight:750;color:#164b7f}#checkoutLink a{overflow-wrap:anywhere}ul{padding-left:21px}@media(max-width:840px){.stats{grid-template-columns:repeat(2,1fr)}.fields{grid-template-columns:repeat(2,1fr)}.detail-grid,.form-card{grid-template-columns:1fr}.panel-actions{flex-wrap:wrap}}@media(max-width:520px){.gate-row{flex-direction:column}.stats{grid-template-columns:repeat(2,1fr)}.fields{grid-template-columns:1fr}.panel-actions input{max-width:100%}.shell{width:min(1140px,calc(100% - 26px))}}@media print{.brand-bar,.gate,.panel-actions,button,.footer{display:none!important}}`;
export const operatorScript=String.raw`(()=>{"use strict";
const $=id=>document.getElementById(id),money=n=>"£"+(Number(n||0)/100).toFixed(2),date=v=>v?new Date(v).toLocaleString("en-GB"):"Not set";
let token="",tickets=[],current=null,details=null;
const note=(msg,isError=false)=>{$("feedback").textContent=msg;$("feedback").style.color=isError?"#a31b21":"#126243"};
async function api(path,method="GET",data){
 const res=await fetch(path,{method,headers:{"authorization":"Bearer "+token,...(data?{"content-type":"application/json"}:{})},body:data?JSON.stringify(data):undefined,cache:"no-store"});
 let parsed;try{parsed=await res.json()}catch{throw new Error("Unrecognised server response")}
 if(!res.ok)throw new Error(parsed.error||"Request failed");
 return parsed;
}
function text(tag,content,klass){const x=document.createElement(tag);x.textContent=content==null?"":String(content);if(klass)x.className=klass;return x}
function cell(value){return text("td",value)}
function stats(){
 $("newCount").textContent=tickets.filter(t=>["new","review"].includes(t.status)).length;
 $("waitingCount").textContent=tickets.filter(t=>["waiting_customer","approved","reschedule_requested"].includes(t.status)||t.payment_status==="awaiting_payment").length;
 $("confirmedCount").textContent=tickets.filter(t=>["appointment_confirmed","ready","in_progress"].includes(t.status)).length;
 $("closedCount").textContent=tickets.filter(t=>["completed","closed"].includes(t.status)).length;
}
function render(){
 stats();const q=$("filter").value.trim().toLowerCase(),tbody=$("ticketRows");
 tbody.replaceChildren();
 const matches=tickets.filter(t=>[t.id,t.customer_name,t.email,t.service,t.status].some(x=>String(x||"").toLowerCase().includes(q)));
 if(!matches.length){const row=document.createElement("tr"),c=cell("No matching tickets");c.colSpan=7;row.append(c);tbody.append(row);return}
 for(const t of matches){
  const row=document.createElement("tr"),status=cell(""),p=cell("");
  status.append(text("span",t.status.replaceAll("_"," "),"pill"));
  p.append(text("span",t.payment_status.replaceAll("_"," "),"pill "+(t.payment_status==="paid"?"paid":t.payment_status==="awaiting_payment"?"wait":"")));
  const button=text("button","Open","secondary");button.type="button";button.addEventListener("click",()=>openTicket(t.id));
  const action=cell("");action.append(button);
  row.append(cell(t.id.slice(0,8)),cell(t.customer_name),cell(t.service.replaceAll("-"," ")),status,p,cell(date(t.updated_at)),action);
  tbody.append(row);
 }
}
async function refresh(){
 const data=await api("/api/tickets");tickets=data.tickets;
 $("gate").hidden=true;$("panel").hidden=false;render();
}
async function openTicket(id){
 try{
  details=await api("/api/tickets/"+id);current=id;
  const t=details.ticket;
  $("detail").hidden=false;$("ticketHeading").textContent="Ticket "+id.slice(0,8);
  const fields=$("ticketFields");fields.replaceChildren();
  for(const [k,v] of [["Customer",t.customer_name],["Email",t.email],["Service",t.service.replaceAll("-"," ")],["Price",money(t.amount_pence)],["State",t.status],["Payment",t.payment_status],["Issue",t.summary],["Device",t.device||"Not supplied"],["Booking",date(t.appointment_at)],["Full reference",t.id]]){
   const d=document.createElement("dl");d.className="field";d.append(text("dt",k),text("dd",v));fields.append(d);
  }
  const s=$("newState");s.replaceChildren();
  for(const next of ["review","waiting_customer","approved","appointment_confirmed","ready","in_progress","completed","closed","reschedule_requested","no_show","cancelled","declined","escalated"]){
   const option=document.createElement("option");option.value=next;option.textContent=next.replaceAll("_"," ");s.append(option);
  }
  s.value=t.status;s.dataset.original=t.status;
  $("invitee").value=t.calendly_invitee_uri||"";
  $("appointment").value=t.appointment_at?new Date(t.appointment_at).toISOString().slice(0,16):"";
  $("ticketEvents").replaceChildren();
  for(const e of details.events){
   const li=document.createElement("li");li.append(text("strong",e.action+" · "+e.actor),document.createElement("br"),text("span",date(e.created_at)),document.createElement("br"),text("span",e.detail));$("ticketEvents").append(li);
  }
  $("detail").scrollIntoView({behavior:"smooth",block:"start"});
 }catch(e){note(e.message,true)}
}
async function run(action){
 if(!current)return;
 try{await action();await refresh();await openTicket(current);note("Case updated successfully")}
 catch(e){note(e.message,true)}
}
$("connect").addEventListener("click",async()=>{
 token=$("token").value.trim();$("token").value="";
 try{await refresh();note("Operator access confirmed")}
 catch(e){token="";note(e.message,true)}
});
$("refresh").addEventListener("click",async()=>{try{await refresh();note("Tickets refreshed")}catch(e){note(e.message,true)}});
$("filter").addEventListener("input",render);
$("lock").addEventListener("click",()=>{token="";tickets=[];current=null;details=null;$("panel").hidden=true;$("gate").hidden=false;note("Operator session locked")});
$("closeDetail").addEventListener("click",()=>{$("detail").hidden=true});
$("applyState").addEventListener("click",()=>run(()=>api("/api/tickets/"+current+"/transition","POST",{status:$("newState").value})));
$("addNote").addEventListener("click",()=>run(async()=>{await api("/api/tickets/"+current+"/note","POST",{note:$("note").value});$("note").value=""}));
$("saveBooking").addEventListener("click",()=>run(()=>api("/api/tickets/"+current+"/booking","POST",{invitee_uri:$("invitee").value,appointment_at:new Date($("appointment").value).toISOString()})));
function customerDraft(kind){
 if(!details||!details.ticket)return;
 const t=details.ticket;
 if(kind==="prep"&&!["appointment_confirmed","ready","in_progress"].includes(t.status)){
  note("Confirm the appointment before preparing joining instructions",true);return;
 }
 const name=t.customer_name,ref=t.id.slice(0,8),service=t.service.replaceAll("-"," ");
 let subject="",body="";
 if(kind==="ack"){
  subject="Bytova support enquiry received — "+ref;
  body="Hello "+name+",\n\nThank you for contacting Bytova about "+service+". I have received your request (reference "+ref+") and will review whether remote support is suitable.\n\nThis is not yet a confirmed appointment or payment. I will respond in writing with the agreed scope, next steps and any payment arrangements.\n\nPlease do not email passwords, sign-in codes or banking details.";
 }else if(kind==="prep"){
  subject="Bytova — preparing for your remote appointment "+ref;
  body="Hello "+name+",\n\nYour "+service+" appointment is being prepared. Please check the agreed date/time and contact me before the session if anything needs changing.\n\nBefore we connect: back up important files; stay at your device; close private documents; use only the remote-support software and joining instructions you have independently verified as coming from Bytova. Only accept the connection you are expecting, and you can end it at any time. Please do not send me passwords or security codes.\n\nRead: https://bytova.co.uk/remote-support-safety.html\nCancellation information: https://bytova.co.uk/cancellations.html\n\n[ADD CONFIRMED DATE, TIME, SERVICE SCOPE AND AGREED JOINING DETAILS HERE]";
 }else{
  subject="Bytova support session — summary and next steps "+ref;
  body="Hello "+name+",\n\nThank you for using Bytova for "+service+".\n\nWork carried out: [ADD VERIFIED SUMMARY]\nResult: [ADD VERIFIED OUTCOME]\nAny outstanding actions: [ADD NEXT STEPS]\n\nIf anything is unclear, reply to this email and include reference "+ref+". You can read service and cancellation information at https://bytova.co.uk/cancellations.html.\n\n[Any accurate invoice or receipt should be supplied separately.]";
 }
 body+="\n\nKind regards,\nLeighton\nBytova\nhttps://bytova.co.uk";
 const url="mailto:"+encodeURIComponent(t.email)+"?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body);
 window.location.assign(url);
}
$("ackEmail").addEventListener("click",()=>customerDraft("ack"));
$("prepEmail").addEventListener("click",()=>customerDraft("prep"));
$("closeEmail").addEventListener("click",()=>customerDraft("aftercare"));
$("checkout").addEventListener("click",async()=>{
 if(!current)return;
 try{
  const data=await api("/api/tickets/"+current+"/checkout","POST");
  const box=$("checkoutLink");box.replaceChildren();
  const link=text("a","Open TEST checkout");link.href=data.checkout_url;link.target="_blank";link.rel="noopener noreferrer";
  box.append(text("p","Test payments only — this is not a live customer charge."),link);
  await refresh();note("Test checkout created; payment still awaiting verification");
 }catch(e){note(e.message,true)}
});
})();`;
export const requestScript=String.raw`(()=>{"use strict";const form=document.getElementById("requestForm"),status=document.getElementById("requestFeedback"),button=document.getElementById("submitRequest"),key=document.querySelector(".cf-turnstile")?.dataset.sitekey;
if(!key){document.getElementById("challengeWarning").hidden=false;button.disabled=true}
form.addEventListener("submit",async e=>{
 e.preventDefault();status.textContent="";
 const response=document.querySelector('[name="cf-turnstile-response"]')?.value;
 if(!response){status.textContent="Complete the security check before sending.";return}
 button.disabled=true;
 const data=Object.fromEntries(new FormData(form));data.turnstileToken=response;
 try{
  const req=await fetch("/api/enquiries",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(data)});
  const res=await req.json();if(!req.ok)throw new Error(res.error||"Unable to submit your request");
  form.querySelectorAll('input,textarea,select,button').forEach(el=>{el.disabled=true});status.textContent="Request received. Your reference is "+res.reference+". I will review the details and contact you by email. This is not an appointment confirmation.";
 }catch(err){status.textContent=err.message;button.disabled=false;if(window.turnstile)window.turnstile.reset()}
});
})();`;
