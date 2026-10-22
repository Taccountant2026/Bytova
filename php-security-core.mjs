/* Offline advisory comparison. No network, DOM, telemetry or infrastructure changes. */
export function parseVersion(raw){
 if(typeof raw!=='string'||raw.length>16384)return null;
 const s=raw.trim();
 const match=/^(?:PHP\s+)?(0|[1-9]\d?)\.(0|[1-9]\d?)\.(0|[1-9]\d{0,3})([-+~][A-Za-z0-9.+:~_-]+|(?:RC|alpha|beta)\d+)?(?=\s|$)/i.exec(s);
 if(!match)return null;
 const rest=s.slice(match[0].length);
 if(rest && !/^\s+\((?:cli|fpm-fcgi|cgi-fcgi|apache2handler|built:)/i.test(rest))return null;
 if(/\bPHP\s+\d+\.\d+\.\d+/i.test(rest))return null;
 return {version:`${+match[1]}.${+match[2]}.${+match[3]}`,parts:match.slice(1,4).map(Number),suffix:match[4]||''};
}
const cmp=(a,b)=>{for(let i=0;i<3;i++){if(a[i]!==b[i])return a[i]<b[i]?-1:1;}return 0;};
export function validateData(d){
 const date=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&new Date(s+'T00:00:00Z').toISOString().startsWith(s);
 try{
  if(d.schema_version!==1||!date(d.reviewed)||!date(d.review_due)||d.review_due<d.reviewed||!Array.isArray(d.scope)||d.scope.length!==2||!d.scope.every(s=>/^CVE-\d{4}-\d{4,}$/.test(s)))return false;
  if(!d.upstream||!Object.keys(d.upstream).length||!Array.isArray(d.sources)||!d.sources.length||!Array.isArray(d.vendor_fixes))return false;
  const ids=new Set(d.sources.map(s=>s.id));if(ids.size!==d.sources.length)return false;
  if(d.sources.some(s=>new URL(s.url).protocol!=='https:'||!date(s.reviewed)))return false;
  for(const [branch,b]of Object.entries(d.upstream)){
   const f=parseVersion(b.fixed),l=parseVersion(b.latest_verified);
   if(!f||!l||f.suffix||l.suffix||!date(b.security_until)||f.parts.slice(0,2).join('.')!==branch||l.parts.slice(0,2).join('.')!==branch||cmp(f.parts,l.parts)>0)return false;
  }
  if(d.vendor_fixes.some(v=>!v.vendor||!v.os_release||!v.package||!parseVersion(v.version)||!v.source_ids?.length||v.source_ids.some(id=>!ids.has(id))))return false;
  return true;
 }catch{return false;}
}
export function assess(input,data,{now=new Date()}={}){
 const p=parseVersion(input?.version);
 const base={status:'unverified',reason:'The advisory data could not be validated. Consult PHP and your vendor.',scope:data?.scope||[],dataset:data?.dataset_id||'invalid',reviewed:data?.reviewed||null,review_due:data?.review_due||null,version:p?.version||null,source_urls:[],limitations:'This checks two advisories only. It cannot prove that a system is secure, exposed, or compromised. Verify the running web PHP, every worker, container and installed package.'};
 if(!validateData(data))return base;
 base.source_urls=data.sources.filter(s=>['php','ghsa-618','ghsa-619','support'].includes(s.id)).map(s=>s.url);
 if(!p)return {...base,reason:'Enter a complete PHP version such as 8.3.36, or a PHP -v output. Commands and URLs are not accepted.',input_valid:false};
 base.input_valid=true;
 const today=now instanceof Date&&!Number.isNaN(now.valueOf())?now.toISOString().slice(0,10):null;
 if(!today||today<data.reviewed)return {...base,reason:'The current date is invalid or earlier than this advisory snapshot. Recheck the data and system clock.'};
 const stale=today>data.review_due;
 const branch=p.parts.slice(0,2).join('.'),b=data.upstream[branch];
 const provider=input.provider||'unknown';
 base.upstream_support=b&&today<=b.security_until?'supported':'unsupported';
 if(!['upstream','vendor','unknown'].includes(provider))return {...base,reason:'Choose a valid installation source.'};
 if(provider==='vendor'){
  const v=data.vendor_fixes.find(v=>v.vendor===input.vendor&&v.os_release===input.os_release&&v.package===input.package&&v.version===input.package_version);
  if(v){
   const vp=parseVersion(v.version);
   if(vp.version!==p.version)return {...base,reason:'The PHP version and vendor package do not match. Check the runtime used by the website.'};
   base.source_urls.push(...data.sources.filter(s=>v.source_ids.includes(s.id)).map(s=>s.url));
   return {...base,status:stale?'unverified':'patched',reason:stale?'This exact vendor fix was verified previously, but the data review is overdue. Recheck the vendor advisory.':'Exact vendor, OS release and package revision match a verified fix for both advisories. Confirm that this package actually serves the website; upstream support is a separate question.',basis:'exact-vendor-package',stale};
  }
  return {...base,reason:'Vendor patch status is unverified. An older PHP number may contain a backported fix. Compare your exact OS release, package and revision with both vendor CVE records.',basis:'vendor-review-required',stale};
 }
 if(!b){
  if(p.parts[0]<8||(p.parts[0]===8&&p.parts[1]<2))return {...base,status:'unsupported',reason:'This branch has no PHP-project security support. Ask your vendor about both CVEs and maintained backports, or migrate to a supported branch. Unsupported does not prove compromise.',stale};
  return {...base,reason:'This branch is outside the verified snapshot. Do not infer that a new or pre-release branch is safe.',stale};
 }
 if(today>b.security_until)return {...base,status:'unsupported',reason:'PHP-project security support for this branch has ended. Check vendor maintenance and plan a supported upgrade.',stale};
 if(provider!=='upstream'||p.suffix)return {...base,reason:'The installation source or build suffix needs vendor verification. Select an unmodified upstream release only when that is confirmed.',stale};
 if(cmp(p.parts,b.fixed.split('.').map(Number))<0)return {...base,status:'vulnerable',reason:`This upstream release is below ${b.fixed}, the fixed release for this branch. Apply a supported official update promptly and assess exposure.`,fixed:b.fixed,stale};
 if(cmp(p.parts,b.latest_verified.split('.').map(Number))>0)return {...base,reason:'This release is newer than the latest version verified in this snapshot. Check the current official release notes.',stale};
 return {...base,status:stale?'unverified':'patched',reason:stale?'This fixed release was verified previously, but the data review is overdue. Recheck the official advisories.':'This upstream release includes the fixes for the two listed advisories. It is not a general security certificate or a compromise assessment.',fixed:b.fixed,stale};
}
