import test from 'node:test';
import {strict as assert} from 'node:assert';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import * as core from '../statistics-core.mjs';
const source=readFileSync('measurement.js','utf8').replace("import(new URL('statistics-core.mjs',scriptUrl).href)",'Promise.resolve(core)');
class Element{
 constructor(tag){this.tag=tag;this.children=[];this.dataset={};this.isConnected=true;}
 append(...items){this.children.push(...items);}
 setAttribute(k,v){this[k]=v;}
 remove(){this.isConnected=false;}
 focus(){}
}
async function harness({choice=null,gpc=false,path='/php-version-checker.html',host='bytova.co.uk'}={}){
 const sent=[],scripts=[],listeners={},body=new Element('body'),head=new Element('head');
 const window={addEventListener:(name,fn)=>{listeners[name]=fn;}};
 const document={currentScript:{src:'https://bytova.co.uk/measurement.js',dataset:{brand:'bytova'}},head,body,createElement:tag=>{const el=new Element(tag);if(tag==='script')scripts.push(el);return el;},addEventListener(){},activeElement:null};
 const ctx={core,window,document,navigator:{globalPrivacyControl:gpc},location:{hostname:host,pathname:path,search:''},localStorage:{getItem:()=>choice?JSON.stringify(choice):null,setItem(){}},fetch:(url,options)=>{sent.push({url,options});return Promise.resolve({ok:true});},URL,URLSearchParams,Promise,Date,console};
 vm.runInNewContext(source,ctx);await new Promise(resolve=>setImmediate(resolve));
 function button(label){const visit=el=>{if(el.textContent===label&&el.isConnected)return el;for(const child of el.children||[]){const r=visit(child);if(r)return r;}};for(const el of body.children){if(!el.isConnected)continue;const r=visit(el);if(r)return r;}return null;}
 return {window,document,sent,scripts,listeners,button,events:()=>window.dataLayer?.filter(args=>args[0]==='event').map(args=>Array.from(args))||[]};
}
test('no analytics or Google script before affirmative consent',async()=>{
 const h=await harness();assert.equal(h.scripts.length,0);assert.equal(h.sent.length,0);assert.equal(h.events().length,0);
 h.listeners['business-metric']({detail:{event:'php_version_check',version:'DO-NOT-TRANSMIT'}});
 assert.equal(h.scripts.length,0);assert.equal(h.sent.length,0);
});
test('security events use the retained Google ID only after opt-in, never raw checker details',async()=>{
 const h=await harness();h.button('Allow statistics').onclick();assert.equal(h.scripts.length,1);assert.match(h.scripts[0].src,/G-HXLHMHPVZM/);assert.equal(h.sent.length,0,'security pages do not use an unconfigured private aggregation endpoint');
 h.listeners['business-metric']({detail:{event:'php_version_check',version:'8.3.35',package_version:'private-package-text'}});
 assert(h.events().some(e=>e[1]==='php_version_check'));
 assert.doesNotMatch(JSON.stringify(h.events()),/8\.3\.35|private-package-text/);
 h.listeners['business-metric']({detail:{event:'unapproved-event'}});assert(!h.events().some(e=>e[1]==='unapproved-event'));
 h.button('Privacy choices').onclick();h.button('Keep statistics off').onclick();const count=h.events().length;
 h.listeners['business-metric']({detail:{event:'php_version_check'}});assert.equal(h.events().length,count);assert.equal(h.window['ga-disable-G-HXLHMHPVZM'],true);assert.equal(h.scripts.length,1);
});
test('GPC and previews suppress analytics even with a stored opt-in',async()=>{
 for(const options of[{gpc:true},{host:'terminal.local'}]){const h=await harness({...options,choice:{version:1,allowed:true,at:Date.now()}});assert.equal(h.scripts.length,0);assert.equal(h.sent.length,0);assert.equal(h.events().length,0);}
});
test('existing ordinary Bytova pages retain their consented aggregation route',async()=>{
 const h=await harness({path:'/services.html',choice:{version:1,allowed:true,at:Date.now()}});assert.equal(h.sent.length,1);assert.equal(h.sent[0].url,'https://retroreplay.uk/api/metrics');assert.equal(JSON.parse(h.sent[0].options.body).page,'/services.html');
});
