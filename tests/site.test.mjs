import test from 'node:test';import{readFileSync,existsSync}from'node:fs';import{strict as assert}from'node:assert';
test('preview remains blocked from indexing',()=>assert.match(readFileSync('robots.txt','utf8'),/Disallow:\s*\//));
test('verified remote booking and store URLs retained',()=>{const home=readFileSync('index.html','utf8'),services=readFileSync('services.html','utf8');for(const page of[home,services])assert.match(page,/calendly.com\/leighton-hepworth22\/bytova-remote-computer-help/);assert.match(services,/bytova.co.uk\/products\/complete-pc-speed-up-guide/);assert.match(home,/£25/);});
test('official logo is local and referenced',()=>{assert(existsSync('bytova-logo.jpg'));for(const name of ['index.html','services.html','contact.html','faq.html'])assert.match(readFileSync(name,'utf8'),/bytova-logo.jpg/);});
test('accessible navigation assets included',()=>{assert.match(readFileSync('index.html','utf8'),/aria-expanded="false"/);assert.match(readFileSync('site.js','utf8'),/Escape/);});
test('terms preserve provisional warning',()=>assert.match(readFileSync('terms.html','utf8'),/Provisional customer information/i));
