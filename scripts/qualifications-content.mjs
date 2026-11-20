import awards from '../data/cisco-credentials.json' with {type:'json'};
import {platforms} from '../platforms.mjs';

const dateDisplay = new Intl.DateTimeFormat('en-GB', {day:'numeric', month:'short', year:'numeric', timeZone:'UTC'});
const groups = ['Cybersecurity','Networking & infrastructure','Data & analytics','Business','Communication'];

export function qualificationsPage({page,esc,button}) {
  const profile = platforms.find(p=>p.id==='credly').url;
  const date = item => `<time datetime="${esc(item.issued)}">${dateDisplay.format(new Date(item.issued+'T00:00:00Z'))}</time>`;
  const image = (item,size) => `<img src="./${esc(item.image)}" width="${size}" height="${size}" alt="" loading="lazy">`;
  const featured = awards.filter(a=>a.pathway).map(a=>`<a class="career-award" href="${esc(a.verification)}">${image(a,84)}
    <span><strong>${esc(a.name)}</strong><span>Cisco · ${date(a)}</span></span></a>`).join('');
  const directory = groups.map((group,index)=>{
    const entries = awards.filter(a=>a.area===group);
    return `<details class="badge-group"${index===0?' open':''}><summary>${esc(group)} <span>${entries.length} badges</span></summary>
      <ul>${entries.map(a=>`<li><a href="${esc(a.verification)}">${image(a,52)}<span><strong>${esc(a.name)}</strong> ${date(a)}</span></a></li>`).join('')}</ul></details>`;
  }).join('');
  page('qualifications.html','Qualifications, Licences & Credly Badges | Leighton at Bytova',
    'See Leighton Hepworth’s 24 Cisco learning badges and individual Credly records, qualifications in teaching and assessment, and UK driving licence.',
    `<header class="page-hero"><div class="container centre narrow"><h1>My qualifications and licences</h1>
    <p class="lead">I’m Leighton Hepworth. My background brings together computing, teaching, vocational assessment and hands-on engineering. You can check each Cisco award on my public Credly record.</p></div></header>
    <section class="section"><div class="container credential-layout"><div><h2>Cisco learning credentials</h2><p>Cisco issued these 24 digital learning badges in February and March 2024. Two recognise completion of a career pathway.</p>
    <div class="award-links">${button(profile,'View my Credly profile','button-navy')}<a href="./assets/cisco-learning-record.csv" download>Download the learning record (CSV)</a></div></div>
    <div class="career-awards">${featured}</div></div></section>
    <section class="section section-soft" id="all-badges"><div class="container credential-layout"><div><h2>All 24 Cisco badges</h2><p>Choose a subject. Each badge links to its individual award, with the issuer, date and earning criteria.</p></div><div>${directory}</div></div></section>
    <section class="section" id="qualifications"><div class="container credential-layout"><div><h2>Qualifications and licences</h2><p>I’ve used my teaching and assessment qualifications to support apprentices and explain technical work in plain English.</p></div>
    <div class="qualification-list"><section><h3>Teaching and assessment</h3><ul><li>City &amp; Guilds Level 3 Award in Education and Training (AET)</li>
    <li>VTCT Level 3 Certificate in Assessing Vocational Achievement (TAQA)</li></ul></section>
    <section><h3>Engineering and general qualifications</h3><ul><li>City &amp; Guilds Level 2 NVQ in Railway Engineering</li>
    <li>Level 2 Functional Skills in English and Mathematics</li><li>Level 1 Community Volunteering</li></ul></section>
    <section><h3>Licence</h3><p>Full UK driving licence.</p></section>
    <section><h3>Current study</h3><p>Part-time undergraduate study with The Open University, including computing modules in Java, web technologies and IT service management.</p></section>
    <details class="badge-group"><summary>Earlier trade qualifications and safety cards</summary><p>My earlier training included groundworks and Level 2 NVQ plant operations for a tracked 360-degree excavator (10 tonnes and above), dumper and roller. I also earned welding certificates in MIG/MAG, MMA, TIG and oxy-acetylene work.</p>
    <p>My former PTS, CSCS, CPCS, Lookout and Site Warden cards have expired.</p></details></div></div></section>
    <section class="section section-soft"><div class="container route-next-inner"><div><h2>Hiring for a role?</h2><p>I’m happy to discuss which experience fits your brief.</p></div><div class="route-next-links">${button('./contract-enquiry.html?engagement=cv','Request my CV','button-navy')}<a class="text-link" href="./freelance-contracts.html">Freelance and contract work</a></div></div></section>`);
}

export function learningRegister() {
  const quote = s => '"' + String(s).replaceAll('"','""') + '"';
  const rows = [['Subject','Credential','Issuer','Issue date','Award type','Individual public verification URL'],
    ...awards.map(a=>[a.area,a.name,'Cisco',a.issued,a.pathway?'Career pathway badge':'Digital learning badge',a.verification])];
  return rows.map(row=>row.map(quote).join(',')).join('\n')+'\n';
}
