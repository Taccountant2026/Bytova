// Bytova Remote Help. Pure functions shared by Worker and Node tests.
// No credentials, customer data or payment state are trusted from a browser.
export const services=Object.freeze({
 "remote-tech-help":{name:"Remote Tech Help",minutes:30,pence:2500},
 "setup-getting-started":{name:"Setup & Getting Started",minutes:60,pence:3500},
 "computer-care-safety-check":{name:"Computer Care & Safety Check",minutes:60,pence:2900}
});
export const states=Object.freeze({
 new:["review","declined","cancelled"],
 review:["waiting_customer","approved","declined","cancelled"],
 waiting_customer:["review","approved","declined","cancelled"],
 approved:["appointment_confirmed","cancelled","declined"],
 appointment_confirmed:["ready","cancelled","reschedule_requested"],
 reschedule_requested:["approved","appointment_confirmed","cancelled"],
 ready:["in_progress","cancelled","reschedule_requested","no_show"],
 in_progress:["completed","escalated"],
 escalated:["in_progress","completed","closed"],
 no_show:["approved","closed"],
 completed:["closed","escalated"],
 declined:[],cancelled:[],closed:[]
});
export class HttpError extends Error{
 constructor(status,message){super(message);this.status=status}
}
const clean=(s,limit)=>typeof s==="string"?s.trim().slice(0,limit):"";
export function validateEnquiry(body){
 if(!body||typeof body!=="object"||Array.isArray(body))throw new HttpError(400,"Invalid request");
 if(clean(body.website,50))throw new HttpError(400,"Invalid request");
 const name=clean(body.name,90),email=clean(body.email,254).toLowerCase(),
 service=clean(body.service,64),description=clean(body.description,1200),
 device=clean(body.device,160);
 if(!name||!email||!service||!description)throw new HttpError(400,"Please complete all required fields");
 if(!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email))throw new HttpError(400,"Invalid email");
 if(!services[service])throw new HttpError(400,"Unknown service");
 if(description.length<15)throw new HttpError(400,"Please provide a little more detail about the issue");
 if(/(?:password|passphrase|security code|one.time code|otp)\s*[:=]/i.test(description))throw new HttpError(400,"Remove passwords and security codes from your message");
 return {name,email,service,description,device};
}
export function canTransition(from,to){
 return Array.isArray(states[from])&&states[from].includes(to);
}
export function requireTransition(from,to){
 if(!canTransition(from,to))throw new HttpError(409,"Invalid ticket status change");
}
export function expectedPence(service){const x=services[service];if(!x)throw new HttpError(400,"Unknown service");return x.pence}
export function verifyCheckoutEvent(event,ticket){
 const data=event?.data?.object;
 if(!data||!ticket||event.type!=="checkout.session.completed")return false;
 return event.livemode===false && data.id===ticket.stripe_session_id &&
  data.client_reference_id===ticket.id && data.metadata?.ticket_id===ticket.id &&
  data.payment_status==="paid" && data.currency==="gbp" &&
  data.amount_total===expectedPence(ticket.service);
}
function hex(buf){return [...new Uint8Array(buf)].map(n=>n.toString(16).padStart(2,"0")).join("")}
function slowEqual(a,b){
 if(typeof a!=="string"||typeof b!=="string"||a.length!==b.length)return false;
 let diff=0;for(let i=0;i<a.length;i++)diff|=a.charCodeAt(i)^b.charCodeAt(i);return diff===0;
}
export async function verifySignedPayload(raw,header,secret,now=Math.floor(Date.now()/1000)){
 if(typeof secret!=="string"||!secret||typeof raw!=="string"||raw.length>200000||!header)return false;
 const parts=Object.fromEntries(header.split(",").map(s=>s.trim().split("=",2)));
 const stamp=Number(parts.t);
 if(!Number.isInteger(stamp)||Math.abs(now-stamp)>300)return false;
 const sigs=[...header.matchAll(/(?:^|,)\s*v1=([a-f0-9]{64})(?=,|$)/g)].map(x=>x[1]);
 if(!sigs.length)return false;
 const k=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
 const sig=await crypto.subtle.sign("HMAC",k,new TextEncoder().encode(parts.t+"."+raw));
 const digest=hex(sig);
 return sigs.some(v=>slowEqual(v,digest));
}
export async function constantTimeSecret(provided,secret){
 if(!provided||!secret||provided.length>1024)return false;
 const bytes=x=>new TextEncoder().encode(x);
 const hash=async x=>new Uint8Array(await crypto.subtle.digest("SHA-256",bytes(x)));
 const [a,b]=await Promise.all([hash(provided),hash(secret)]);
 let mismatch=0;for(let i=0;i<a.length;i++)mismatch|=a[i]^b[i];
 return mismatch===0;
}
