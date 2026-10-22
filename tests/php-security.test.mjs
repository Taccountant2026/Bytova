import test from 'node:test';
import {strict as assert} from 'node:assert';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {assess,validateData,parseVersion} from '../php-security-core.mjs';
const data=JSON.parse(readFileSync('assets/security/advisories.json'));
const fixtures=JSON.parse(readFileSync('assets/security/test-cases.json'));
test('advisory schema rejects missing, unsafe and inconsistent data',()=>{
 assert(validateData(data));
 for(const change of[d=>d.schema_version=9,d=>d.upstream['8.3'].fixed='9.0.1',d=>d.review_due='2026-02-31',d=>d.sources[0].url='javascript:alert(1)',d=>d.vendor_fixes[0].source_ids=['missing']]){const bad=structuredClone(data);change(bad);assert.equal(validateData(bad),false);assert.equal(assess({version:'8.3.36',provider:'upstream'},bad).status,'unverified');}
 assert.equal(parseVersion('8.3.36x'),null);assert.equal(parseVersion('A'.repeat(20000)),null);
});
for(const fixture of fixtures)test('PHP assessment: '+fixture.name,()=>{assert.equal(assess(fixture.input,data,{now:new Date((fixture.date||'2026-10-22')+'T12:00:00Z')}).status,fixture.status);});
test('every supported-branch boundary uses tuple comparison and unknown future values cannot look patched',()=>{
 for(const [branch,b]of Object.entries(data.upstream)){
  const n=+b.fixed.split('.')[2];
  for(let patch=0;patch<n;patch++)assert.equal(assess({version:branch+'.'+patch,provider:'upstream'},data,{now:new Date('2026-10-22')}).status,'vulnerable');
  for(const patch of[n+1,n+10,999])assert.equal(assess({version:branch+'.'+patch,provider:'upstream'},data,{now:new Date('2026-10-22')}).status,'unverified');
 }
});
test('JS and Python produce identical full reports for shared fixtures',()=>{
 const code="import sys,json;from datetime import date;from php_security_audit.core import assess;d=json.load(open('../assets/security/advisories.json'));f=json.load(open('../assets/security/test-cases.json'));print(json.dumps([assess(x['input'],d,date.fromisoformat(x.get('date','2026-10-22'))) for x in f]))";
 const r=spawnSync('python3',['-c',code],{cwd:'php-security-audit',encoding:'utf8'});assert.equal(r.status,0,r.stderr);
 const py=JSON.parse(r.stdout);fixtures.forEach((f,i)=>assert.deepEqual(assess(f.input,data,{now:new Date((f.date||'2026-10-22')+'T12:00:00Z')}),py[i],f.name));
 assert.equal(readFileSync('assets/security/advisories.json','utf8'),readFileSync('php-security-audit/php_security_audit/data/advisories.json','utf8'));
});
