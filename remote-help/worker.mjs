import {services,states,HttpError,validateEnquiry,requireTransition,expectedPence,verifyCheckoutEvent,verifySignedPayload,constantTimeSecret} from "./core.mjs";
import {operatorHtml,operatorScript,requestHtml,requestScript,appCss} from "./screens.mjs";
import {verifyOperatorAccess} from "./access.mjs";
const headers={"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff","referrer-policy":"no-referrer"};
const errorResponse=(status,error,h={})=>new Response(JSON.stringify({error}),{status,headers:{...headers,...h}});
const response=(data,status=200,h={})=>new Response(JSON.stringify(data),{status,headers:{...headers,...h}});
const timestamp=()=>new Date().toISOString();
const validId=x=>/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(x||"");
function cors(req,env){
 const origin=req.headers.get("origin");
 return origin&&[new URL(req.url).origin,env.PUBLIC_SITE_ORIGIN||"https://bytova.co.uk"].includes(origin)?
 {"access-control-allow-origin":origin,"vary":"Origin"}:{};
}
function allowOrigin(req,env){
 const origin=req.headers.get("origin");
 if(origin&&!cors(req,env)["access-control-allow-origin"])throw new HttpError(403,"Origin not allowed");
}
async function body(req,max=10000){
 if(!(req.headers.get("content-type")||"").includes("application/json"))throw new HttpError(415,"JSON required");
 if(Number(req.headers.get("content-length")||0)>max)throw new HttpError(413,"Request too large");
 const raw=await req.text();if(raw.length>max)throw new HttpError(413,"Request too large");
 try{return JSON.parse(raw)}catch{throw new HttpError(400,"Invalid JSON")}
}
async function authorize(req,env){
 await verifyOperatorAccess(req,env);
 if(!env.ADMIN_API_KEY||env.ADMIN_API_KEY.length<32)throw new HttpError(503,"Operator access not configured");
 const auth=req.headers.get("authorization")||"";
 if(!auth.startsWith("Bearer ")||!(await constantTimeSecret(auth.slice(7),env.ADMIN_API_KEY)))
 throw new HttpError(401,"Operator authorisation required");
}
function dbOf(env){if(!env.DB)throw new HttpError(503,"Ticket database not configured");return env.DB}
async function ticketOf(db,id){
 if(!validId(id))throw new HttpError(404,"Ticket not found");
 const t=await db.prepare("SELECT * FROM tickets WHERE id=?").bind(id).first();
 if(!t)throw new HttpError(404,"Ticket not found");
 return t;
}
async function log(db,id,action,detail,actor="operator"){
 await db.prepare("INSERT INTO ticket_events(ticket_id,actor,action,detail,created_at) VALUES(?,?,?,?,?)").bind(id,actor,action,detail,timestamp()).run();
}
async function verifyTurnstile(token,env,allowedHosts){
 if(!env.TURNSTILE_SECRET)throw new HttpError(503,"Public requests not yet configured");
 if(typeof token!=="string"||token.length<8)throw new HttpError(400,"Please complete security verification");
 const res=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{
  method:"POST",body:new URLSearchParams({secret:env.TURNSTILE_SECRET,response:token})
 });
 const status=await res.json();if(!status.success||!allowedHosts.includes(status.hostname))throw new HttpError(403,"Security verification failed");
}
async function intake(req,env){
 allowOrigin(req,env);const input=await body(req),item=validateEnquiry(input);
 await verifyTurnstile(input.turnstileToken,env,[new URL(req.url).hostname,new URL(env.PUBLIC_SITE_ORIGIN||"https://bytova.co.uk").hostname]);
 const db=dbOf(env),id=crypto.randomUUID(),at=timestamp();
 await db.batch([
  db.prepare("INSERT INTO tickets(id,customer_name,email,service,summary,device,status,payment_status,amount_pence,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)")
  .bind(id,item.name,item.email,item.service,item.description,item.device,"new","not_requested",expectedPence(item.service),at,at),
  db.prepare("INSERT INTO ticket_events(ticket_id,actor,action,detail,created_at) VALUES(?,?,?,?,?)")
  .bind(id,"customer","enquiry_received","New request. Neither booking nor payment confirmed.",at)
 ]);
 return response({reference:id,received:true,message:"Your request has been received for review. No booking or payment is confirmed."},201,cors(req,env));
}
async function listTickets(db){
 const data=await db.prepare("SELECT id,customer_name,email,service,summary,status,payment_status,amount_pence,appointment_at,created_at,updated_at FROM tickets ORDER BY created_at DESC LIMIT 200").all();
 return response({tickets:data.results||[]});
}
async function ticketDetail(db,id){
 const ticket=await ticketOf(db,id);
 const events=await db.prepare("SELECT actor,action,detail,created_at FROM ticket_events WHERE ticket_id=? ORDER BY id DESC LIMIT 80").bind(id).all();
 return response({ticket,events:events.results||[]});
}
async function transition(req,db,id){
 const input=await body(req,2000),ticket=await ticketOf(db,id);
 requireTransition(ticket.status,input.status);
 const at=timestamp();
 const out=await db.prepare("UPDATE tickets SET status=?,updated_at=? WHERE id=? AND status=?").bind(input.status,at,id,ticket.status).run();
 if(out.meta?.changes!==1)throw new HttpError(409,"Ticket changed; refresh and retry");
 await log(db,id,"status_change","Status changed from "+ticket.status+" to "+input.status);
 return response({success:true,status:input.status});
}
async function addNote(req,db,id){
 await ticketOf(db,id);const input=await body(req,3000),note=String(input.note||"").trim();
 if(note.length<3||note.length>1800)throw new HttpError(400,"Note must be 3–1800 characters");
 await log(db,id,"private_note",note);
 return response({success:true});
}
async function linkBooking(req,db,id){
 const ticket=await ticketOf(db,id),data=await body(req,3000);
 if(["closed","cancelled","declined"].includes(ticket.status))throw new HttpError(409,"Ticket is closed");
 const invitee=String(data.invitee_uri||"").trim(),date=String(data.appointment_at||"").trim();
 if(!/^https:\/\/api\.calendly\.com\/scheduled_events\/[\w-]+\/invitees\/[\w-]+$/.test(invitee))
 throw new HttpError(400,"Valid Calendly invitee URI required");
 if(!date||!Number.isFinite(Date.parse(date)))throw new HttpError(400,"ISO appointment date required");
 try{
  await db.prepare("UPDATE tickets SET calendly_invitee_uri=?,appointment_at=?,updated_at=? WHERE id=?")
  .bind(invitee,new Date(date).toISOString(),timestamp(),id).run();
 }catch{throw new HttpError(409,"Invitee already belongs to a ticket")}
 await log(db,id,"booking_linked","Calendly invitee URI linked; verify booking independently");
 return response({success:true});
}
async function createTestCheckout(req,env,db,id){
 const ticket=await ticketOf(db,id);
 if(!["approved","appointment_confirmed"].includes(ticket.status))throw new HttpError(409,"Approve suitability before checkout");
 if(ticket.stripe_session_id||ticket.payment_status==="paid")throw new HttpError(409,"Existing checkout or completed payment");
 if(env.PAYMENTS_MODE!=="test"||!String(env.STRIPE_TEST_SECRET_KEY||"").startsWith("sk_test_"))
 throw new HttpError(503,"Live payments are disabled; test-mode keys not configured");
 const origin=new URL(req.url).origin,fields=new URLSearchParams();
 const params={"mode":"payment","client_reference_id":id,"customer_email":ticket.email,
 "success_url":origin+"/operator?checkout=pending","cancel_url":origin+"/operator?checkout=cancelled",
 "line_items[0][price_data][currency]":"gbp","line_items[0][price_data][unit_amount]":String(expectedPence(ticket.service)),
 "line_items[0][price_data][product_data][name]":services[ticket.service].name,
 "line_items[0][quantity]":"1","metadata[ticket_id]":id};
 for(const [key,value] of Object.entries(params))fields.append(key,value);
 const res=await fetch("https://api.stripe.com/v1/checkout/sessions",{
 method:"POST",headers:{"authorization":"Bearer "+env.STRIPE_TEST_SECRET_KEY,
 "content-type":"application/x-www-form-urlencoded","idempotency-key":"bytova-remote-"+id+"-v1"},body:fields
 });
 const data=await res.json();
 if(!res.ok||!data.id?.startsWith("cs_test_")||!data.url)throw new HttpError(502,"Unable to create test Checkout session");
 const result=await db.prepare("UPDATE tickets SET stripe_session_id=?,payment_status='awaiting_payment',updated_at=? WHERE id=? AND stripe_session_id IS NULL")
 .bind(data.id,timestamp(),id).run();
 if(result.meta?.changes!==1)throw new HttpError(409,"Concurrent checkout; refresh ticket");
 await log(db,id,"test_checkout_created","Test-mode Stripe checkout created, awaiting payment");
 return response({test_mode:true,checkout_url:data.url,session_id:data.id});
}
async function stripe(req,env){
 if(env.PAYMENTS_MODE!=="test"||!env.STRIPE_TEST_WEBHOOK_SECRET)return errorResponse(503,"Test payment webhook unavailable");
 const raw=await req.text();
 if(!(await verifySignedPayload(raw,req.headers.get("stripe-signature"),env.STRIPE_TEST_WEBHOOK_SECRET)))
 return errorResponse(401,"Invalid Stripe signature");
 let event;try{event=JSON.parse(raw)}catch{return errorResponse(400,"Invalid event")}
 if(event.type!=="checkout.session.completed")return response({received:true,ignored:true});
 if(event.livemode!==false)return errorResponse(400,"Live payments not enabled");
 const id=event.data?.object?.client_reference_id;
 if(!validId(id)||!/^evt_[\w]+$/.test(event.id||""))return response({received:true,unmatched:true});
 const db=dbOf(env),ticket=await db.prepare("SELECT * FROM tickets WHERE id=?").bind(id).first();
 if(!ticket||!verifyCheckoutEvent(event,ticket))return response({received:true,unmatched:true});
 const at=timestamp();
 await db.batch([
 db.prepare("INSERT OR IGNORE INTO webhook_receipts(provider,event_id,ticket_id,created_at) VALUES('stripe',?,?,?)").bind(event.id,id,at),
 db.prepare("UPDATE tickets SET payment_status='paid',updated_at=? WHERE id=? AND stripe_session_id=? AND payment_status!='paid'").bind(at,id,event.data.object.id),
 db.prepare("INSERT OR IGNORE INTO ticket_events(ticket_id,actor,action,detail,external_event_id,created_at) VALUES(?,'stripe','payment_confirmed','Verified test Stripe Checkout',?,?)").bind(id,event.id,at)
 ]);
 return response({received:true});
}
async function calendly(req,env){
 if(!env.CALENDLY_WEBHOOK_SIGNING_KEY)return errorResponse(503,"Calendly webhook not configured");
 const raw=await req.text();
 if(!(await verifySignedPayload(raw,req.headers.get("calendly-webhook-signature"),env.CALENDLY_WEBHOOK_SIGNING_KEY)))
 return errorResponse(401,"Invalid Calendly signature");
 let event;try{event=JSON.parse(raw)}catch{return errorResponse(400,"Invalid event")}
 if(!["invitee.created","invitee.canceled"].includes(event.event))return response({received:true,ignored:true});
 const invitee=event.payload?.uri;
 if(typeof invitee!=="string")return response({received:true,unmatched:true});
 const db=dbOf(env),ticket=await db.prepare("SELECT * FROM tickets WHERE calendly_invitee_uri=?").bind(invitee).first();
 if(!ticket)return response({received:true,unmatched:true});
 let next=null;
 if(event.event==="invitee.created"&&["approved","reschedule_requested"].includes(ticket.status))next="appointment_confirmed";
 if(event.event==="invitee.canceled"&&["appointment_confirmed","ready"].includes(ticket.status))next="reschedule_requested";
 if(next){
 await db.prepare("UPDATE tickets SET status=?,updated_at=? WHERE id=? AND status=?").bind(next,timestamp(),ticket.id,ticket.status).run();
 await log(db,ticket.id,event.event,"Verified Calendly webhook","calendly");
 }
 return response({received:true});
}
function page(content,type,publicPage=false){
 const policy=publicPage?
 "default-src 'none'; script-src 'self' https://challenges.cloudflare.com; style-src 'self'; connect-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; img-src 'self' data:; base-uri 'none'; form-action 'self'; frame-ancestors 'none'":
 "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";
 return new Response(content,{headers:{"content-type":type==="html"?"text/html; charset=utf-8":type==="js"?"text/javascript; charset=utf-8":"text/css; charset=utf-8",
 "cache-control":"no-store","content-security-policy":policy,"x-frame-options":"DENY","x-content-type-options":"nosniff","referrer-policy":"no-referrer"}});
}
export default {async fetch(req,env){
 const p=new URL(req.url).pathname;
 if(req.method==="OPTIONS"&&p==="/api/enquiries"){
  const h=cors(req,env);if(!h["access-control-allow-origin"])return errorResponse(403,"Origin not allowed");
  return new Response(null,{status:204,headers:{...h,"access-control-allow-methods":"POST, OPTIONS","access-control-allow-headers":"Content-Type","access-control-max-age":"600"}});
 }
 try{
  if(req.method==="GET"){
   if(p==="/health")return response({service:"Bytova Remote Help",configured:!!env.DB,live_payments_enabled:false});
   if(p==="/app.css")return page(appCss,"css");
   if(p==="/operator.js")return page(operatorScript,"js");
   if(p==="/request.js")return page(requestScript,"js",true);
   if(p==="/operator"){await verifyOperatorAccess(req,env);return page(operatorHtml,"html");}
   if(p==="/request")return page(requestHtml.replaceAll("__TURNSTILE_SITE_KEY__",String(env.TURNSTILE_SITE_KEY||"").replace(/[^\w-]/g,"")),"html",true);
  }
  if(p==="/api/enquiries"&&req.method==="POST")return await intake(req,env);
  if(p==="/webhooks/stripe"&&req.method==="POST")return await stripe(req,env);
  if(p==="/webhooks/calendly"&&req.method==="POST")return await calendly(req,env);
  if(p.startsWith("/api/")){
   await authorize(req,env);allowOrigin(req,env);
   const db=dbOf(env);
   if(p==="/api/tickets"&&req.method==="GET")return await listTickets(db);
   const m=p.match(/^\/api\/tickets\/([a-f0-9-]+)(?:\/(transition|note|booking|checkout))?$/i);
   if(m){
    if(req.method==="GET"&&!m[2])return await ticketDetail(db,m[1]);
    if(req.method==="POST"&&m[2]==="transition")return await transition(req,db,m[1]);
    if(req.method==="POST"&&m[2]==="note")return await addNote(req,db,m[1]);
    if(req.method==="POST"&&m[2]==="booking")return await linkBooking(req,db,m[1]);
    if(req.method==="POST"&&m[2]==="checkout")return await createTestCheckout(req,env,db,m[1]);
   }
  }
  return errorResponse(404,"Not found");
 }catch(e){
  if(e instanceof HttpError)return errorResponse(e.status,e.message,p==="/api/enquiries"?cors(req,env):{});
  console.error("Remote Help server failure",p,e?.name||"Error");
  return errorResponse(500,"Internal error");
 }
}};
