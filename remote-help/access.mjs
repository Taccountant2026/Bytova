// Cloudflare Access is mandatory for private Remote Help routes.
// Validate the RS256 Access assertion against JWKS from the configured team domain.
// Never trust an email header, a decoded JWT without signature verification, or browser-provided identity.
import {HttpError} from "./core.mjs";

const textDecoder=new TextDecoder();
const cache=new Map();
const accessError=()=>new HttpError(401,"Cloudflare Access authentication required");
function decodeBase64Url(value){
 if(typeof value!=="string"||!/^[A-Za-z0-9_-]+$/.test(value)||value.length>12000)throw accessError();
 const padded=value.replace(/-/g,"+").replace(/_/g,"/").padEnd(Math.ceil(value.length/4)*4,"=");
 return Uint8Array.from(atob(padded),c=>c.charCodeAt(0));
}
function parsePart(value){
 try{return JSON.parse(textDecoder.decode(decodeBase64Url(value)))}catch{throw accessError()}
}
function issuerFrom(env){
 const origin=String(env.ACCESS_TEAM_DOMAIN||"").trim().replace(/\/$/,"");
 if(!/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/i.test(origin))
 throw new HttpError(503,"Private Access configuration incomplete");
 return origin;
}
async function keysFor(issuer){
 const entry=cache.get(issuer);
 if(entry&&Date.now()<entry.expires)return entry.keys;
 const resp=await fetch(issuer+"/cdn-cgi/access/certs");
 if(!resp.ok)throw new HttpError(503,"Private Access certificate lookup unavailable");
 const data=await resp.json();
 if(!Array.isArray(data.keys)||data.keys.length===0)throw new HttpError(503,"Private Access signing keys unavailable");
 const keys=data.keys.filter(k=>k.kty==="RSA"&&k.n&&k.e&&k.kid);
 if(!keys.length)throw new HttpError(503,"Private Access signing keys unavailable");
 cache.set(issuer,{keys,expires:Date.now()+10*60*1000});
 return keys;
}
export async function verifyOperatorAccess(request,env,{trustedKeys}={}){
 const issuer=issuerFrom(env),aud=String(env.ACCESS_AUD||"").trim();
 const owner=String(env.ACCESS_OWNER_EMAIL||"").trim().toLowerCase();
 if(!aud||aud.length>300||!owner||!owner.includes("@"))
 throw new HttpError(503,"Private Access configuration incomplete");
 const assertion=request.headers.get("cf-access-jwt-assertion");
 if(!assertion||assertion.length>16000)throw accessError();
 const parts=assertion.split(".");
 if(parts.length!==3)throw accessError();
 const header=parsePart(parts[0]),payload=parsePart(parts[1]);
 if(header.alg!=="RS256"||typeof header.kid!=="string"||header.kid.length>250)throw accessError();
 const now=Math.floor(Date.now()/1000);
 if(payload.iss!==issuer || !(Array.isArray(payload.aud)?payload.aud.includes(aud):payload.aud===aud)
   || typeof payload.exp!=="number" || payload.exp<=now
   || (typeof payload.nbf==="number"&&payload.nbf>now)
   || typeof payload.iat!=="number"||payload.iat>now+60
   || String(payload.email||"").toLowerCase()!==owner)throw accessError();
 const keys=trustedKeys||await keysFor(issuer);
 const jwk=keys.find(k=>k.kid===header.kid&&k.kty==="RSA");
 if(!jwk)throw accessError();
 try{
  const key=await crypto.subtle.importKey("jwk",jwk,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},false,["verify"]);
  const data=new TextEncoder().encode(parts[0]+"."+parts[1]);
  const signature=decodeBase64Url(parts[2]);
  if(!(await crypto.subtle.verify("RSASSA-PKCS1-v1_5",key,signature,data)))throw accessError();
 }catch(error){
  if(error instanceof HttpError)throw error;
  throw accessError();
 }
 return {email:owner,issuedAt:payload.iat};
}
