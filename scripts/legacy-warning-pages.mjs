import {guides} from './help-content.mjs';

// Exact same-subject migrations only. Other old articles retain their 404.
export const legacyWarningPaths = [
  'blogs/bytova-home-advice/what-to-do-if-you-see-a-virus-warning-on-your-screen/index.html',
  'blogs/bytova-home-advice/how-to-spot-a-fake-virus-warning-on-your-computer/index.html',
  'blogs/bytova-home-advice/how-to-spot-a-fake-virus-pop-up-and-what-to-do/index.html',
];

export function buildLegacyWarningPages(config,contentPages){
  const origin=new URL(config.site.url);
  if(origin.href!=='https://bytova.co.uk/')throw new Error('Legacy warning pages require the canonical Bytova origin.');
  const targetFile='unexpected-virus-warning.html';
  const guide=guides.find(guide=>guide.file===targetFile);
  if(!guide||!contentPages.has(targetFile))throw new Error('The current warning guide must exist before its old links can move.');
  const esc=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  const target=new URL(targetFile,origin).href;
  const canonical=config.launch.indexable?`<link rel="canonical" href="${target}">\n`:'';
  const robots=config.launch.indexable?'index,follow':'noindex,nofollow';
  const html=`<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="refresh" content="0;url=${target}">
<meta name="robots" content="${robots}">
<title>This guide has moved | Bytova</title>
${canonical}<link rel="stylesheet" href="/site.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<main id="main"><div class="section container narrow">
<img src="/assets/Bytova_Logo.png" alt="Bytova" width="300" height="200">
<h1>This guide has moved</h1>
<p>Continue to <a href="/${targetFile}">${esc(guide.title)}</a>.</p>
</div></main>
</body>
</html>
`;
  return new Map(legacyWarningPaths.map(path=>[path,html]));
}
