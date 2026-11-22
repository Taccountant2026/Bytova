import test from "node:test";
import assert from "node:assert/strict";
import worker from "../remote-help/worker.mjs";
import {verifySignedPayload} from "../remote-help/core.mjs";

// Minimal deterministic D1 replacement. Tests API wiring, not actual SQLite transaction semantics.
class FakeDb {
 constructor(){this.tickets=new Map();this.events=[];this.receipts=new Set()}
 prepare(sql){const statement=(args)=>({
  first:async()=>this.execute(sql,args,"first"),
  all:async()=>this.execute(sql,args,"all"),
  run:async()=>this.execute(sql,args,"run")
 });return {...statement([]),bind:(...args)=>statement(args)}}
 async batch(statements){const results=[];for(const s of statements)results.push(await s.run());return results}
 execute(sql,args,kind){
  let result={meta:{changes:0}};let ticket;
  if(sql.startsWith("INSERT INTO tickets(")){
   const [id,customer_name,email,service,summary,device,status,payment_status,amount_pence,created_at,updated_at]=args;
   this.tickets.set(id,{id,customer_name,email,service,summary,device,status,payment_status,amount_pence,created_at,updated_at,calendly_invitee_uri:null,appointment_at:null,stripe_session_id:null});
   result.meta.changes=1;
  }else if(sql.startsWith("INSERT INTO ticket_events(")){
   const [ticket_id,actor,action,detail,created_at]=args;
   this.events.push({ticket_id,actor,action,detail,created_at});result.meta.changes=1;
  }else if(sql.startsWith("SELECT * FROM tickets WHERE id=?")){
   return this.tickets.get(args[0])||null;
  }else if(sql.startsWith("SELECT * FROM tickets WHERE calendly_invitee_uri=?")){
   return [...this.tickets.values()].find(x=>x.calendly_invitee_uri===args[0])||null;
  }else if(sql.startsWith("SELECT id,customer_name,email,service")){
   return {results:[...this.tickets.values()]};
  }else if(sql.startsWith("SELECT actor,action,detail,created_at FROM ticket_events")){
   return {results:this.events.filter(x=>x.ticket_id===args[0]).reverse().slice(0,80)};
  }else if(sql.startsWith("UPDATE tickets SET status=?,updated_at=?")){
   const [status,updated_at,id,expected]=args;ticket=this.tickets.get(id);
   if(ticket&&ticket.status===expected){ticket.status=status;ticket.updated_at=updated_at;result.meta.changes=1}
  }else if(sql.startsWith("UPDATE tickets SET calendly_invitee_uri")){
   const [invitee,appointment,updated_at,id]=args;
   ticket=this.tickets.get(id);
   if([...this.tickets.values()].some(x=>x.id!==id&&x.calendly_invitee_uri===invitee))throw new Error("UNIQUE");
   Object.assign(ticket,{calendly_invitee_uri:invitee,appointment_at:appointment,updated_at});result.meta.changes=1;
  }else if(sql.startsWith("UPDATE tickets SET stripe_session_id")){
   const [session,updated_at,id]=args;ticket=this.tickets.get(id);
   if(ticket&&!ticket.stripe_session_id){Object.assign(ticket,{stripe_session_id:session,payment_status:"awaiting_payment",updated_at});result.meta.changes=1}
  }else if(sql.startsWith("INSERT OR IGNORE INTO webhook_receipts")){
   const [eventId]=args;if(!this.receipts.has(eventId)){this.receipts.add(eventId);result.meta.changes=1}
  }else if(sql.startsWith("UPDATE tickets SET payment_status='paid'")){
   const [updated_at,id,session]=args;ticket=this.tickets.get(id);
   if(ticket&&ticket.stripe_session_id===session&&ticket.payment_status!=="paid"){ticket.payment_status="paid";ticket.updated_at=updated_at;result.meta.changes=1}
  }else if(sql.startsWith("INSERT OR IGNORE INTO ticket_events")){
   const [id,external_event_id,created_at]=args;
   if(!this.events.some(x=>x.external_event_id===external_event_id)){
    this.events.push({ticket_id:id,actor:"stripe",action:"payment_confirmed",detail:"Verified test Stripe Checkout",external_event_id,created_at});result.meta.changes=1
   }
  }else throw new Error("Test DB did not recognise SQL: "+sql.slice(0,80));
  return result;
 }
}
const key="an-exact-operator-test-key-of-more-than-32-characters";
const admin={"authorization":"Bearer "+key,"content-type":"application/json"};
const authRequest=(url,method="GET",payload)=>new Request(url,{method,headers:admin,body:payload?JSON.stringify(payload):undefined});
async function signed(raw,secret,time=Math.floor(Date.now()/1000)){
 const k=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
 const buf=await crypto.subtle.sign("HMAC",k,new TextEncoder().encode(time+"."+raw));
 return "t="+time+",v1="+[...new Uint8Array(buf)].map(x=>x.toString(16).padStart(2,"0")).join("");
}
test("Full test-mode journey: accepted request, private ticket, Stripe verification and Calendly linkage",async()=>{
 const originalFetch=globalThis.fetch,db=new FakeDb();
 const origin="https://remote.example",customerOrigin="https://bytova.co.uk";
 const env={DB:db,ADMIN_API_KEY:key,PUBLIC_SITE_ORIGIN:customerOrigin,
  TURNSTILE_SECRET:"turnstile-secret",PAYMENTS_MODE:"test",STRIPE_TEST_SECRET_KEY:"sk_test_sample",
  STRIPE_TEST_WEBHOOK_SECRET:"whsec_sample",CALENDLY_WEBHOOK_SIGNING_KEY:"calendly-signing"};
 globalThis.fetch=async (url)=>{
  if(String(url).includes("turnstile/v0/siteverify"))return new Response(JSON.stringify({success:true,hostname:"remote.example"}),{status:200});
  if(String(url).includes("checkout/sessions"))return new Response(JSON.stringify({id:"cs_test_xyz",url:"https://checkout.stripe.com/c/pay/cs_test_xyz"}),{status:200});
  throw new Error("Unexpected test fetch "+url);
 };
 try{
  const request={name:"Example Customer",email:"buyer@example.com",service:"remote-tech-help",device:"Windows 11",
   description:"Windows says that my local printer is offline and I need help",turnstileToken:"test-verification-token"};
  let resp=await worker.fetch(new Request(origin+"/api/enquiries",{method:"POST",headers:{"content-type":"application/json","origin":customerOrigin},body:JSON.stringify(request)}),env);
  assert.equal(resp.status,201);
  const reference=(await resp.json()).reference;
  assert.match(reference,/^[0-9a-f-]{36}$/);
  resp=await worker.fetch(authRequest(origin+"/api/tickets"),env);assert.equal(resp.status,200);
  assert.equal((await resp.json()).tickets.length,1);
  const detail=async()=>{const r=await worker.fetch(authRequest(origin+"/api/tickets/"+reference),env);assert.equal(r.status,200);return (await r.json())};
  assert.equal((await detail()).ticket.payment_status,"not_requested");
  for(const status of ["review","approved"]){
   resp=await worker.fetch(authRequest(origin+"/api/tickets/"+reference+"/transition","POST",{status}),env);
   assert.equal(resp.status,200);
  }
  resp=await worker.fetch(authRequest(origin+"/api/tickets/"+reference+"/checkout","POST"),env);
  assert.equal(resp.status,200);assert.equal((await resp.json()).test_mode,true);
  assert.equal((await detail()).ticket.payment_status,"awaiting_payment");
  const fakeEvent={id:"evt_example001",type:"checkout.session.completed",livemode:false,
   data:{object:{id:"cs_test_xyz",client_reference_id:reference,metadata:{ticket_id:reference},currency:"gbp",amount_total:2500,payment_status:"paid"}}};
  const payload=JSON.stringify(fakeEvent),sig=await signed(payload,env.STRIPE_TEST_WEBHOOK_SECRET);
  const requestEvent=()=>new Request(origin+"/webhooks/stripe",{method:"POST",headers:{"stripe-signature":sig},body:payload});
  resp=await worker.fetch(requestEvent(),env);assert.equal(resp.status,200);
  assert.equal((await detail()).ticket.payment_status,"paid");
  resp=await worker.fetch(requestEvent(),env);assert.equal(resp.status,200);
  assert.equal((await detail()).events.filter(e=>e.action==="payment_confirmed").length,1);
  const invitee="https://api.calendly.com/scheduled_events/ev123/invitees/inv456";
  resp=await worker.fetch(authRequest(origin+"/api/tickets/"+reference+"/booking","POST",{invitee_uri:invitee,appointment_at:"2026-12-01T10:00:00Z"}),env);
  assert.equal(resp.status,200);
  const event={event:"invitee.created",payload:{uri:invitee}};
  const raw=JSON.stringify(event);
  resp=await worker.fetch(new Request(origin+"/webhooks/calendly",{method:"POST",
   headers:{"calendly-webhook-signature":await signed(raw,env.CALENDLY_WEBHOOK_SIGNING_KEY)},body:raw}),env);
  assert.equal(resp.status,200);
  assert.equal((await detail()).ticket.status,"appointment_confirmed");
 }finally{globalThis.fetch=originalFetch}
});
