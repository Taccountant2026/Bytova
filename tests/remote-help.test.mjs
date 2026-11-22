import test from "node:test";
import assert from "node:assert/strict";
import {services,states,validateEnquiry,canTransition,requireTransition,verifyCheckoutEvent,verifySignedPayload,constantTimeSecret} from "../remote-help/core.mjs";
import worker from "../remote-help/worker.mjs";
import {operatorHtml,requestHtml,operatorScript,requestScript,appCss} from "../remote-help/screens.mjs";

test("service catalogue retains exact independently approved prices",()=>{
 assert.deepEqual(Object.values(services).map(s=>s.pence),[2500,3500,2900]);
 assert.deepEqual(Object.values(services).map(s=>s.minutes),[30,60,60]);
});
test("public intake validates service, input, and rejects sensitive data",()=>{
 const good={name:"Test Customer",email:"USER@example.com",service:"remote-tech-help",description:"My Windows laptop printer stopped working",device:"Windows 11"};
 assert.equal(validateEnquiry(good).email,"user@example.com");
 assert.throws(()=>validateEnquiry({...good,service:"admin-access"}),/Unknown service/);
 assert.throws(()=>validateEnquiry({...good,email:"x"}),/Invalid email/);
 assert.throws(()=>validateEnquiry({...good,website:"spam"}),/Invalid request/);
 assert.throws(()=>validateEnquiry({...good,description:"password: veryprivate secret string"}),/passwords/);
});
test("ticket state changes have an explicit transition policy",()=>{
 assert.equal(canTransition("new","review"),true);
 assert.equal(canTransition("new","completed"),false);
 assert.equal(canTransition("approved","appointment_confirmed"),true);
 assert.equal(canTransition("closed","in_progress"),false);
 assert.throws(()=>requireTransition("closed","new"),/Invalid ticket status/);
 assert.ok(Object.keys(states).length>10);
});
test("Stripe is test-only, signed and matches reference, session, currency and exact amount",()=>{
 const id="1c41de45-687a-4cda-a52f-3b1f1553ebc0",session="cs_test_123";
 const ticket={id,service:"computer-care-safety-check",stripe_session_id:session};
 const ev={type:"checkout.session.completed",livemode:false,data:{object:{id:session,client_reference_id:id,metadata:{ticket_id:id},payment_status:"paid",currency:"gbp",amount_total:2900}}};
 assert.equal(verifyCheckoutEvent(ev,ticket),true);
 assert.equal(verifyCheckoutEvent({...ev,livemode:true},ticket),false);
 assert.equal(verifyCheckoutEvent({...ev,data:{object:{...ev.data.object,amount_total:2500}}},ticket),false);
 assert.equal(verifyCheckoutEvent({...ev,data:{object:{...ev.data.object,payment_status:"unpaid"}}},ticket),false);
 assert.equal(verifyCheckoutEvent({...ev,data:{object:{...ev.data.object,client_reference_id:"other"}}},ticket),false);
});
test("Stripe and Calendly style signatures verify raw body and reject expiry/tampering",async()=>{
 const secret="test-signing-secret",raw='{"event":"invitee.created","payload":{"uri":"abc"}}',now=1_799_999_900;
 const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
 const signature=await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(String(now)+"."+raw));
 const sig=[...new Uint8Array(signature)].map(b=>b.toString(16).padStart(2,"0")).join("");
 const h="t="+now+",v1="+sig;
 assert.equal(await verifySignedPayload(raw,h,secret,now),true);
 assert.equal(await verifySignedPayload(raw+"x",h,secret,now),false);
 assert.equal(await verifySignedPayload(raw,h,secret,now+500),false);
 assert.equal(await verifySignedPayload(raw,"t=notatime,v1="+sig,secret,now),false);
});
test("operator bearer comparison prevents wrong or missing keys",async()=>{
 assert.equal(await constantTimeSecret("a".repeat(40),"a".repeat(40)),true);
 assert.equal(await constantTimeSecret("a".repeat(40),"b".repeat(40)),false);
 assert.equal(await constantTimeSecret("","a".repeat(40)),false);
});
test("Worker exposes no customer data before authentication",async()=>{
 const origin="https://ops.example";
 const health=await worker.fetch(new Request(origin+"/health"),{});
 assert.equal(health.status,200);
 assert.equal((await health.json()).live_payments_enabled,false);
 const noKey=await worker.fetch(new Request(origin+"/api/tickets"),{ADMIN_API_KEY:"a".repeat(40)});
 assert.equal(noKey.status,503);
 const unavailable=await worker.fetch(new Request(origin+"/api/tickets",{headers:{authorization:"Bearer "+"a".repeat(40)}}),{ADMIN_API_KEY:"a".repeat(40)});
 assert.equal(unavailable.status,503);
 const page=await worker.fetch(new Request(origin+"/operator"),{});
 assert.equal(page.status,503);
});
test("public intake fails closed without verified security and rejects other origins",async()=>{
 const payload={name:"Test Customer",email:"test@example.com",service:"remote-tech-help",description:"A Windows computer problem that needs support",turnstileToken:"valid-looking-token"};
 const blocked=await worker.fetch(new Request("https://ops.example/api/enquiries",{method:"POST",headers:{"content-type":"application/json",origin:"https://unrelated.example"},body:JSON.stringify(payload)}),{PUBLIC_SITE_ORIGIN:"https://bytova.co.uk"});
 assert.equal(blocked.status,403);
 const unconfigured=await worker.fetch(new Request("https://ops.example/api/enquiries",{method:"POST",headers:{"content-type":"application/json",origin:"https://bytova.co.uk"},body:JSON.stringify(payload)}),{PUBLIC_SITE_ORIGIN:"https://bytova.co.uk"});
 assert.equal(unconfigured.status,503);
});
test("screens include secure request, ticket operations and no hardcoded passwords",()=>{
 assert.match(operatorHtml,/PRIVATE OPERATOR CONSOLE/);
 assert.match(operatorScript,/Authorization|authorization/);
 assert.match(operatorHtml,/Draft acknowledgement/);
 assert.match(operatorScript,/customerDraft\("prep"\)/);
 assert.match(operatorScript,/mailto:/);
 assert.match(requestHtml,/__TURNSTILE_SITE_KEY__/);
 assert.match(requestScript,/api\/enquiries/);
 assert.match(appCss,/0a1a5c/);
 assert.doesNotMatch(operatorHtml,/sk_live_|whsec_/);
});
