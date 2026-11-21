import part1 from './cyber-articles/part1.mjs';
import part2 from './cyber-articles/part2.mjs';
import part3 from './cyber-articles/part3.mjs';
import part4 from './cyber-articles/part4.mjs';
import part5 from './cyber-articles/part5.mjs';

export const cyberArticles = [...part1,...part2,...part3,...part4,...part5];
export const cyberLibraryFile = 'cybersecurity-library.html';
const published = '2026-11-21';
const e = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const fileOf = item => 'cyber-' + item.slug + '.html';
const sourceMap = {
 accounts: ['NCSC: secure important online accounts','https://www.ncsc.gov.uk/collection/small-organisations-guide-to-cyber-security/secure-your-important-online-accounts'],
 email: ['NCSC: secure your email','https://www.ncsc.gov.uk/collection/small-organisations-guide-to-cyber-security/secure-your-email'],
 attacks: ['NCSC: small organisations cyber guide','https://www.ncsc.gov.uk/collection/small-organisations-guide-to-cyber-security'],
 devices: ['NCSC: protecting your devices','https://www.ncsc.gov.uk/collection/small-organisations-guide-to-cyber-security/protecting-your-devices'],
 ico: ['ICO: data protection for small organisations','https://ico.org.uk/for-organisations/advice-for-small-organisations/personal-data-breaches/'],
 'ico-check': ['ICO: data protection fee','https://ico.org.uk/for-organisations/data-protection-fee/'],
 backup: ['NCSC: backing up your data','https://www.ncsc.gov.uk/collection/small-organisations-guide-to-cyber-security/1-backing-up-your-data'],
 small: ['NCSC: small organisations guide','https://www.ncsc.gov.uk/collection/small-organisations-guide-to-cyber-security'],
 cyber: ['NCSC: 10 steps to cyber security','https://www.ncsc.gov.uk/collection/10-steps'],
 web: ['NCSC: using online services safely','https://www.ncsc.gov.uk/collection/using-online-services-safely'],
 cloud: ['NCSC: secure online service users','https://www.ncsc.gov.uk/collection/using-online-services-safely/securing-your-users-accounts'],
 incident: ['NCSC: small organisations guide','https://www.ncsc.gov.uk/collection/small-organisations-guide-to-cyber-security'],
 'ico-breach': ['ICO: first 72 hours after a breach','https://ico.org.uk/for-organisations/advice-for-small-organisations/personal-data-breaches/72-hours-how-to-respond-to-a-personal-data-breach'],
 ce: ['NCSC: Cyber Essentials requirements v3.3','https://www.ncsc.gov.uk/files/cyber-essentials-requirements-for-it-infrastructure-v3-3.pdf']
};
const css = '<link rel="stylesheet" href="./cyber-library.css">\n<script src="./cyber-print.js" defer></script>';
const structured = (type,payload) => '<script type="application/ld+json">' + JSON.stringify(Object.assign({'@context':'https://schema.org','@type':type},payload)).replaceAll('<','\\u003c') + '</script>';
const anchor = (file,label,cls) => '<a class="' + e(cls||'text-link') + '" href="./' + e(file) + '">' + e(label) + '</a>';
const sourceLinks = item => [...new Set(item.refs)].map(key => sourceMap[key]).filter(Boolean).map(([label,url]) => '<li><a href="' + e(url) + '" rel="noopener noreferrer">' + e(label) + '</a></li>').join('');
const categoryGroups = new Map();
for(const item of cyberArticles){
  if(!categoryGroups.has(item.category))categoryGroups.set(item.category,[]);
  categoryGroups.get(item.category).push(item);
}
const categories = [...categoryGroups.keys()];
const categoryId = category => 'category-' + categories.indexOf(category);
export function cyberLibraryPages({page}){
  const articleCount = cyberArticles.length;
  const counts = '<div class="cyber-stats"><span>Practical advice for everyday security</span><span>Browse by subject</span><span>Free to read and print</span></div>';
  const categoryNav = '<nav class="cyber-topic-links" aria-label="Browse cybersecurity topics">' + categories.map(cat => '<a href="#' + categoryId(cat) + '">' + e(cat) + ' <span>' + categoryGroups.get(cat).length + '</span></a>').join('') + '</nav>';
  const cards = [...categoryGroups].map(([cat,items]) => '<section class="cyber-category" id="' + categoryId(cat) + '"><div class="cyber-category-heading"><p class="eyebrow">CYBERSECURITY GUIDES</p><h2>' + e(cat) + '</h2><span>' + items.length + ' guides</span></div><div class="cyber-card-grid">' + items.map(item => '<article class="cyber-card" data-cyber-card data-search="' + e((item.title+' '+item.summary+' '+item.category).toLowerCase()) + '"><p class="cyber-card-type">' + e(item.category) + '</p><h3>' + anchor(fileOf(item),item.title,'cyber-title-link') + '</h3><p>' + e(item.summary) + '</p>' + anchor(fileOf(item),'Read the guide →','cyber-card-action') + '</article>').join('') + '</div></section>').join('');
  const intro = '<section class="cyber-index-hero"><div class="container"><p class="eyebrow">BYTOVA / FREE CYBERSECURITY LIBRARY</p><h1>Safer technology.<br>One practical step at a time.</h1><p class="lead">Practical, plain-English cybersecurity guides for households, volunteers, charities and small businesses. Learn, act and print any article as a clean, branded PDF using your browser.</p>' + counts + '</div></section>';
  const index = intro + '<section class="section"><div class="container"><div class="cyber-index-intro"><h2>Find a useful next step.</h2><p>Browse by topic or search for a problem. These are educational guides, not a security certification or a substitute for urgent incident response.</p><label class="cyber-search-label" for="cyber-search">Search cybersecurity guides</label><input id="cyber-search" class="cyber-search" type="search" placeholder="Try phishing, backups, Wi-Fi, passkeys…" autocomplete="off"><p class="cyber-search-status" id="cyber-results" role="status" aria-live="polite">Browse the complete article library.</p></div>' + categoryNav + '<div class="cyber-category-collection">' + cards + '</div><p class="cyber-no-results" data-cyber-empty hidden>No matching guide. Try a simpler term or browse the topics above.</p></div></section><section class="section section-soft"><div class="container cyber-index-outro"><div><h2>Need a person to help?</h2><p>Bytova provides practical IT guidance and an initial free remote session for eligible UK charities, subject to availability. Please do not email passwords, security codes or sensitive incident evidence.</p></div><div class="cyber-outro-links">' + anchor('charity-it-support.html','Free charity IT support','button button-navy') + anchor('contact.html','Ask Leighton','button button-outline') + '</div></div></section>';
  const list = cyberArticles.map((item,i)=>({'@type':'ListItem',position:i+1,url:'https://bytova.co.uk/'+fileOf(item),name:item.title}));
  page(cyberLibraryFile,'Cybersecurity Tips & Advice Library | Bytova','Practical UK cybersecurity tips and printable HTML articles for households, charities and small businesses.',index,css+'\n'+structured('CollectionPage',{name:'Bytova Cybersecurity Tips Library',url:'https://bytova.co.uk/'+cyberLibraryFile,description:'Free practical guides to safer online habits.',isAccessibleForFree:true,inLanguage:'en-GB',mainEntity:{'@type':'ItemList',itemListElement:list}}));
  cyberArticles.forEach((item,index)=>{
    const position = index + 1;
    const neighbourPrev = cyberArticles[index-1], neighbourNext = cyberArticles[index+1];
    const brand = '<div class="cyber-print-brand" aria-hidden="true"><img src="./assets/Bytova_Logo.png" alt="" width="180" height="180"><div><strong>BYTOVA</strong><span>Free cybersecurity guidance</span></div></div>';
    const hero = '<header class="cyber-article-header"><div class="container cyber-article-container">' + brand + '<nav class="cyber-breadcrumb" aria-label="Breadcrumb">' + anchor(cyberLibraryFile,'Cybersecurity library') + '<span aria-hidden="true">/</span><span>' + e(item.category) + '</span></nav><p class="eyebrow">BYTOVA CYBERSECURITY / GUIDE ' + String(position).padStart(2,'0') + ' · PRACTICAL GUIDE' + '</p><h1>' + e(item.title) + '</h1><p class="cyber-deck">' + e(item.summary) + '</p><p class="cyber-article-meta">Written by Leighton Hepworth · Bytova · 21 November 2026 · Free practical guide</p><div class="cyber-article-actions"><button class="button button-navy" type="button" data-cyber-print>Print / save as PDF</button>' + anchor(cyberLibraryFile,'All cybersecurity guides','button button-outline') + '</div></div></header>';
    const nav = '<nav class="cyber-toc" aria-label="In this guide"><h2>In this guide</h2><ol>' + item.sections.map(([heading],i)=>'<li><a href="#cyber-step-' + (i+1) + '">' + e(heading) + '</a></li>').join('') + '</ol></nav>';
    const sections = item.sections.map(([heading,copy],i)=>'<section class="cyber-copy-block" id="cyber-step-' + (i+1) + '"><div class="cyber-step-mark">' + String(i+1).padStart(2,'0') + '</div><div><h2>' + e(heading) + '</h2><p>' + e(copy) + '</p></div></section>').join('');
    const checklist = '<section class="cyber-takeaway"><p class="eyebrow">YOUR ACTION CHECKLIST</p><h2>Three useful next steps</h2><ul>' + item.actions.map(action=>'<li><span class="cyber-checkbox" aria-hidden="true"></span>' + e(action) + '</li>').join('') + '</ul></section>';
    const sources = '<section class="cyber-sources"><h2>Further reading from official sources</h2><p>These links are included to help you check current guidance. Bytova is independent and is not affiliated with or endorsed by the NCSC or ICO.</p><ul>' + sourceLinks(item) + '</ul></section>';
    const related = '<nav class="cyber-related" aria-label="Explore more cybersecurity articles">' + (neighbourPrev?anchor(fileOf(neighbourPrev),'← Previous: '+neighbourPrev.title,'cyber-related-link'):'<span></span>') + (neighbourNext?anchor(fileOf(neighbourNext),'Next: '+neighbourNext.title+' →','cyber-related-link'):'<span></span>') + '</nav>';
    const endnote = '<p class="cyber-disclaimer">General preventive guidance only, not an assessment of your device or organisation. For suspected active compromise, financial fraud or a reportable personal data breach, use the relevant official provider and reporting channels promptly. Always act within your authority.</p>';
    const content = hero + '<article class="cyber-article-content"><div class="container cyber-article-container">' + nav + sections + checklist + sources + endnote + related + '<div class="cyber-feedback">' + anchor(cyberLibraryFile,'← Return to the article library','text-link') + '<a class="text-link" href="mailto:hello@bytova.co.uk?subject=Cybersecurity%20guide%20feedback">Suggest a correction</a></div></div></article>';
    const jsonld = structured('TechArticle',{headline:item.title,description:item.summary,url:'https://bytova.co.uk/'+fileOf(item),datePublished:published,dateModified:published,author:{'@type':'Person',name:'Leighton Hepworth'},publisher:{'@type':'Organization',name:'Bytova',url:'https://bytova.co.uk/'},mainEntityOfPage:'https://bytova.co.uk/'+fileOf(item),inLanguage:'en-GB',isAccessibleForFree:true});
    page(fileOf(item),item.title+' | Bytova Cybersecurity Tips',item.summary,content,css+'\n'+jsonld);
  });
}
