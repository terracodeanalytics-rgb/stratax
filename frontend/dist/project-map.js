import {api} from './auth.js';
let loading;
async function maps(){
  if(window.google?.maps?.Map)return window.google.maps;
  if(!loading)loading=(async()=>{const config=await api('/api/runtime-config',{authenticated:false});if(!config.maps_api_key)throw new Error('The map is unavailable. You can still enter coordinates manually.');await new Promise((resolve,reject)=>{const script=document.createElement('script');const timeout=setTimeout(()=>reject(new Error('The map could not load. Check your connection and try again.')),15000);window.strataxMapsReady=()=>{clearTimeout(timeout);resolve();};window.gm_authFailure=()=>{clearTimeout(timeout);reject(new Error('The map could not be authorized. Coordinate entry is still available.'));};script.referrerPolicy='strict-origin-when-cross-origin';script.src='https://maps.googleapis.com/maps/api/js?key='+encodeURIComponent(config.maps_api_key)+'&callback=strataxMapsReady&v=weekly';script.onerror=()=>{clearTimeout(timeout);reject(new Error('The map could not load. Coordinate entry is still available.'));};document.head.append(script);});return window.google.maps;})().catch(error=>{loading=null;throw error;});
  return loading;
}
export async function mountMap(element,coordinates,{pick,search,searchButton,feedback}={}){
  if(!element)return;
  element.textContent='Loading map…';
  try{const g=await maps();if(!element.isConnected)return;const map=new g.Map(element,{center:coordinates||{lat:0,lng:0},zoom:coordinates?12:2,mapTypeId:'terrain',streetViewControl:false,mapTypeControl:true,fullscreenControl:false});let marker;
    const position=point=>{if(marker)marker.setMap(null);marker=new g.Marker({position:point,map});};
    if(coordinates)position(coordinates);
    if(pick)map.addListener('click',event=>{const point={lat:Number(event.latLng.lat().toFixed(7)),lng:Number(event.latLng.lng().toFixed(7))};position(point);pick(point);});
    if(searchButton)searchButton.onclick=async()=>{if(!search.value.trim())return;try{const result=await new g.Geocoder().geocode({address:search.value.trim()});const point=result.results[0]?.geometry.location;if(!point)throw new Error();const coord={lat:point.lat(),lng:point.lng()};map.setCenter(coord);map.setZoom(12);position(coord);pick?.(coord);if(feedback)feedback.textContent='Location selected. Adjust the pin if needed.';}catch{if(feedback)feedback.textContent='No location found. Try another search or enter coordinates.';}};
    if(search)search.onkeydown=event=>{if(event.key==='Enter'){event.preventDefault();searchButton.click();}};
  }catch(error){element.textContent=error.message;element.classList.add('map-unavailable');}
}
