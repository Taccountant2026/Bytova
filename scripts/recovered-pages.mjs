// These pages give still-relevant historic requests a current, equivalent destination.
export function recoveredPages({page,hero,link}) {
  function article(file, title, summary, sections) {
    const body = sections.map(([heading, copy]) => '<h2>'+heading+'</h2>'+copy).join('');
    page(file,title+' | Bytova',summary,hero('',title,summary)+'<article class="section"><div class="container narrow legal-copy">'+body+'</div></article>');
  }
  article('technology-tuition.html','One-to-one technology tuition','Work through one everyday task at your pace. A 30-minute remote session costs £25, subject to suitability and a time agreed in writing.',[
    ['Choose one task','<p>You might want to attach a photo to an email, change the text size, organise a folder or use a video call. Tell me your device, what you already know and how you prefer to learn. Written instructions and time to practise are welcome.</p>'],
    ['What happens in the session','<p>We agree the goal first. I demonstrate the steps or talk you through them, then you try them yourself. We finish with a short written sequence you can use again. You keep control of your device. Keep passwords and verification codes private.</p>'],
    ['Arrange a lesson','<p>One task on one supported device is included. I will confirm compatibility, timing and any adjustments by email. Software licences, equipment, repairs and continuing tuition are separate.</p>'+link('./book.html?service=remote-tech-help','Request a £25 session')+' '+link('./qualifications.html','Teaching and assessment background')]
  ]);
  article('accessibility.html','Using Bytova accessibly','You can ask for help in writing, request a different format or tell me about a barrier on the website.',[
    ['Choosing a contact method','<p>Email hello@bytova.co.uk with the page address and what you were trying to do. If a form, calendar or download is difficult to use, I can discuss the same request with you in writing. Share only the details needed for the task.</p>'+link('./contact.html','Contact Leighton')],
    ['Using the site','<p>The skip link takes you to the main content. Page headings group related information. You can zoom with your browser and use the keyboard to follow links and move between controls. The booking page offers a written route alongside the external calendar.</p>'],
    ['Reporting a barrier','<p>Include your device, browser and preferred way to receive a reply if you want to. I will check the reported journey, agree a workable alternative and record any website change needed.</p>']
  ]);
}
