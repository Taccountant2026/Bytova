export const campaigns=['bytova-php-security-2026','bytova-remote-autumn26','bytova-repairs-autumn26','bytova-websites-autumn26','bytova-shop-autumn26','bytova-content-autumn26','bytova-automation-autumn26','rruk-start-autumn26','rruk-gifts-autumn26','rruk-collectors-autumn26','rruk-setup-autumn26','rruk-community-autumn26','rruk-shop-autumn26','outdoor-projects-autumn26','outdoor-planner-autumn26','outdoor-pots-autumn26','outdoor-wildlife-autumn26','outdoor-journal-autumn26','outdoor-range-autumn26'];
export const events=['page_view','start_tool','complete_tool','save_item','begin_checkout','open_booking','enquiry_receipt','view_item','view_cart','add_to_cart','remove_from_cart','add_to_wishlist','generate_lead','booking_scheduled','contact_intent','security_advisory_view','php_version_check','security_checklist_download','official_patch_click','remediation_guide_view','security_assistance_intent'];
export function readChoice(raw,now=Date.now()){try{const v=typeof raw==='string'?JSON.parse(raw):raw;if(v?.version!==1||typeof v.allowed!=='boolean'||!Number.isSafeInteger(v.at)||v.at>now+60000||now-v.at>180*86400000)return null;return {version:1,allowed:v.allowed,at:v.at};}catch{return null;}}
export function publicPage(brand,path){
 if(!['rruk','bytova','garden'].includes(brand)||typeof path!=='string'||path.length>180||/[?#%\\\s]/.test(path))return null;
 if(path==='/index.html'&&brand==='bytova')return '/';if(path==='/Turf-Right/index.html'&&brand==='garden')return '/Turf-Right/';
 if(brand==='rruk')return /^\/(?:admin|api|order|portal|manage|sign-in|sign-out|callback|chatgpt-auth)(?:\/|$)/.test(path)?null:/^\/[a-z0-9/*-]*$/.test(path)?path:null;
 if(brand==='garden')return path==='/'||path==='/index.html'||path==='/Turf-Right/'||/^\/(?:Turf-Right\/)?(?:[a-z0-9-]+\/)?[a-z0-9-]+\.html$/.test(path)&&!path.endsWith('/checkout.html')&&!path.endsWith('/404.html')?path:null;
 return path==='/'||/^\/[a-z0-9-]+\.html$/.test(path)&&path!=='/404.html'?path:null;
}
// Only public catalogue fields and fixed choices may leave the page. Never merge raw event detail.
export function ecommerceItem(product,quantity=1){
 if(!product||!Number.isInteger(quantity)||quantity<1||quantity>20||!/^[-a-zA-Z0-9]{1,60}$/.test(product.id||''))return null;
 const item={item_id:product.id,quantity};
 for(const [key,value] of [['item_name',product.title],['item_category',product.category]])if(typeof value==='string'&&value.length<=140&&!/[<>@\r\n]/.test(value)&&!value.includes('://'))item[key]=value;
 if(!product.catalogueOnly&&Number.isSafeInteger(product.pricePence)&&product.pricePence>=0&&product.pricePence<=10000000)item.price=product.pricePence/100;
 return item;
}
export function eventParameters(event,detail={}){
 if(['view_item','view_cart','add_to_cart','remove_from_cart','add_to_wishlist','begin_checkout','purchase'].includes(event)){
  const items=Array.isArray(detail.items)?detail.items.slice(0,20).map(line=>ecommerceItem(line?.product,line?.quantity)).filter(Boolean):[];
  if(!items.length)return null;
  const result={currency:'GBP',items};
  if(items.every(item=>typeof item.price==='number'))result.value=Math.round(items.reduce((n,item)=>n+Math.round(item.price*100)*item.quantity,0))/100;
  return result;
 }
 if(event==='generate_lead')return ['availability','hunt','question','website_project'].includes(detail.lead_type)?{lead_type:detail.lead_type}:{};
 if(event==='contact_intent')return {contact_method:'email'};
 if(event==='booking_scheduled')return {booking_provider:'calendly'};
 return {};
}
export function safePageContext(brand,path){
 const page=publicPage(brand,path);if(!page)return null;
 const origin={rruk:'https://retroreplay.uk',bytova:'https://bytova.co.uk',garden:'https://stoneandsprig.co.uk'}[brand];
 return {page_path:page,page_location:origin+page,page_referrer:'',page_title:brand==='rruk'?'RetroReplay UK':brand==='bytova'?'Bytova':'Stone & Sprig'};
}
export function permittedEvent({choice,brand,path,event,campaign,doNotTrack=false,preview=false},now=Date.now()){
 if(!readChoice(choice,now)?.allowed||doNotTrack||preview||!events.includes(event))return null;
 const page=publicPage(brand,path);if(!page)return null;
 return {brand,page,event,campaign:campaigns.includes(campaign)?campaign:'',consent:true};
}
