import test from 'node:test';
import {strict as assert} from 'node:assert';
import {readFileSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
test('downloadable preview contains all nine pages, embedded data and valid self-contained modules',()=>{
 const dir=mkdtempSync(join(tmpdir(),'bytova-security-preview-'));
 try{
  const target=join(dir,'preview.html'),r=spawnSync('python3',['scripts/create-security-preview.py',target],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);
  const html=readFileSync(target,'utf8');assert.match(html,/sandbox="[^"]*allow-forms/);
  const pages=JSON.parse(html.match(/<script id="pages" type="application\/json">(.*?)<\/script>/s)[1]);assert.equal(Object.keys(pages).length,9);
  for(const[name,page]of Object.entries(pages)){
   assert.doesNotMatch(page,/<script\b[^>]*\bsrc=/,name);
   const modules=[...page.matchAll(/<script type="module">(.*?)<\/script>/sg)];assert.equal(modules.length,1,name);
   assert.doesNotMatch(modules[0][1],/\bfetch\s*\(/,name+' should use embedded advisory data');
   const syntax=spawnSync('node',['--input-type=module','--check'],{input:modules[0][1],encoding:'utf8'});assert.equal(syntax.status,0,name+': '+syntax.stderr);
   assert.match(page,/data:image\/png;base64/,name);assert.doesNotMatch(page,/<link\b[^>]*\brel="stylesheet"/,name);
  }
 }finally{rmSync(dir,{recursive:true,force:true});}
});
test('Google ownership proof remains exactly the separate verification file',()=>{
 assert.equal(readFileSync('google7154a567ddca562f.html','utf8'),'google-site-verification: google7154a567ddca562f.html\n');
 const sitemap=readFileSync('sitemap.xml','utf8');assert.doesNotMatch(sitemap,/google7154a567ddca562f\.html/);
});
