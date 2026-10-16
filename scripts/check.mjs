import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {strict as assert} from 'node:assert';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const pages=readdirSync(root).filter(name=>name.endsWith('.html'));
const ids=new Map();
for(const name of pages){
 const html=readFileSync(resolve(root,name),'utf8');
 const values=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
 assert.equal(values.length,new Set(values).size,name+' has duplicate IDs');
 ids.set(name,new Set(values));
}
let linkCount=0;
for(const page of pages){
 const html=readFileSync(resolve(root,page),'utf8');
 assert(/<html lang="en-GB">/.test(html),page+' missing language');
 assert(/<title>[^<]+<\/title>/.test(html),page+' missing title');
 assert(/name="viewport"/.test(html),page+' missing viewport');
 assert.equal([...html.matchAll(/<h1\b/g)].length,1,page+' needs one main heading');
 assert(/<main id="main">/.test(html),page+' missing main landmark');
 assert(/class="skip" href="#main"/.test(html),page+' missing skip link');
 assert(!/https?:\/\/(?:www\.)?bytova\.co\.uk\//i.test(html),page+' contains a dependency on the previous website');
 for(const match of html.matchAll(/(?:href|src)="([^"<>]+)"/g)){
  const value=match[1].replaceAll('&amp;','&');
  if(!value.startsWith('./')&&!value.startsWith('#'))continue;
  const u=new URL(value,'https://local.example/'+page);
  let name=decodeURIComponent(u.pathname.slice(1));if(!name)name='index.html';
  assert(existsSync(resolve(root,name)),page+' broken local file: '+value);
  if(u.hash&&ids.has(name))assert(ids.get(name).has(decodeURIComponent(u.hash.slice(1))),page+' broken anchor: '+value);
  linkCount++;
 }
 for(const image of html.matchAll(/<img\b[^>]*>/g)){
  assert(/\balt="[^"]*"/.test(image[0]),page+' image missing alt text');
  assert(/\bwidth="\d+"/.test(image[0])&&/\bheight="\d+"/.test(image[0]),page+' image missing dimensions');
 }
}
for(const match of readFileSync(resolve(root,'site.css'),'utf8').matchAll(/url\(['"]?(\.\/[^)'"\s]+)['"]?\)/g))assert(existsSync(resolve(root,match[1].slice(2))),'Missing CSS asset '+match[1]);
console.log(`Checked ${pages.length} HTML pages, ${linkCount} local links/anchors, image semantics and CSS assets.`);
