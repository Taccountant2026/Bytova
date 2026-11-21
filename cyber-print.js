document.addEventListener('DOMContentLoaded',()=>{
  for(const button of document.querySelectorAll('[data-cyber-print]')){
    button.addEventListener('click',()=>window.print());
  }
  const input=document.getElementById('cyber-search');
  if(!input)return;
  const cards=[...document.querySelectorAll('[data-cyber-card]')];
  const groups=[...document.querySelectorAll('.cyber-category')];
  const status=document.getElementById('cyber-results');
  const empty=document.querySelector('[data-cyber-empty]');
  function update(){
    const query=input.value.trim().toLocaleLowerCase('en-GB');
    let visible=0;
    for(const card of cards){
      const matches=!query||card.dataset.search.includes(query);
      card.hidden=!matches;
      if(matches)visible++;
    }
    for(const group of groups){
      group.hidden=![...group.querySelectorAll('[data-cyber-card]')].some(card=>!card.hidden);
    }
    status.textContent=query?'Matching guides: '+visible+'.':'Browse the complete article library.';
    if(empty)empty.hidden=visible!==0;
  }
  input.addEventListener('input',update);
});
