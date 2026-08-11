(()=>{
'use strict';
const DATA=window.GERW_DATA;
if(!DATA){document.body.innerHTML='<p style="padding:2rem">The versioned application data could not be loaded.</p>';return}

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const cells=DATA.cells, districts=DATA.district_summary, shapes=DATA.districts, regions=DATA.regions||[], meta=DATA.meta;
let layer='score', weights=[.45,.25,.30], selectedCell=null, selectedDistrict=null, robustOnly=false;
const isDark=()=>document.documentElement.dataset.theme==='dark';
const mapTheme=()=>isDark()?{bg:'#0b2535',outline:'#eff8fc',region:'rgba(203,229,240,.52)',district:'rgba(255,255,255,.38)',furniture:'rgba(25,54,71,.94)',furnitureLine:'rgba(230,244,250,.34)',furnitureText:'#f4fbfe',inactive:'#244356'}:{bg:'#edf3f0',outline:'#011e50',region:'rgba(1,30,80,.5)',district:'rgba(255,255,255,.72)',furniture:'rgba(255,255,255,.92)',furnitureLine:'rgba(1,30,80,.14)',furnitureText:'#011e50',inactive:'#e5edeb'};

const layers={
  score:{label:'Default opportunity index',legend:'Opportunity index (0–100)',range:[0,100],palette:[[245,248,246],[201,232,215],[91,184,137],[1,135,74]],description:'Weighted geometric co-location of hydroclimatic opportunity (H), acid-soil co-benefit (B) and mapped feedstock access (F).'},
  H:{label:'Hydroclimatic opportunity (H)',legend:'Hydroclimatic opportunity (0–100)',range:[0,100],palette:[[245,248,248],[193,224,213],[82,171,139],[0,112,74]],description:'Relative hydroclimatic conditions derived from mean annual precipitation and temperature.'},
  B:{label:'Acid-soil co-benefit (B)',legend:'Acid-soil co-benefit (0–100)',range:[0,100],palette:[[249,248,243],[218,232,193],[116,183,117],[36,125,68]],description:'Relative amendment relevance and retention context derived from soil pH and cation-exchange capacity.'},
  F:{label:'Mapped feedstock access (F)',legend:'Mapped feedstock access (0–100)',range:[0,100],palette:[[247,245,239],[225,206,162],[173,139,83],[104,74,42]],description:'Low-confidence reconnaissance proxy combining mapped candidate-lithology quality and straight-line distance decay.'},
  scenario_width:{label:'Scenario-envelope width',legend:'P10–P90 width (index points)',range:[0,35],palette:[[244,247,245],[244,215,159],[216,139,82],[143,54,54]],description:'Width of the 400-draw epistemic scenario envelope. Larger values indicate greater parameter-related sensitivity.'},
  structural_min:{label:'Structural minimum',legend:'Minimum across structural tests (0–100)',range:[0,100],palette:[[245,248,246],[201,232,215],[91,184,137],[1,135,74]],description:'Lowest cell score across alternative weighting structures and haul-decay assumptions.'},
  pH:{label:'Soil pH',legend:'pH in H₂O (0–15 cm)',range:[4.5,7.5],palette:[[86,50,130],[77,119,169],[103,176,171],[230,220,111]],description:'SoilGrids 2.0 pH prediction, depth-weighted to 0–15 cm.'},
  CEC:{label:'Cation-exchange capacity',legend:'CEC (cmol(+) kg⁻¹)',range:[0,55],palette:[[242,240,247],[188,189,220],[117,107,177],[62,45,116]],description:'SoilGrids 2.0 cation-exchange-capacity prediction, depth-weighted to 0–15 cm.'},
  MAP:{label:'Mean annual precipitation',legend:'Precipitation (mm yr⁻¹)',range:[800,2000],palette:[[247,251,255],[198,219,239],[107,174,214],[24,100,170]],description:'WorldClim 2.1 mean annual precipitation for the 1970–2000 climatology.'},
  feedstock_km:{label:'Mapped-source distance',legend:'Straight-line distance (km)',range:[0,160],palette:[[255,247,236],[254,196,117],[217,95,14],[127,39,4]],description:'Straight-line distance to the nearest mapped candidate source cell; this is not a road-haul distance.'}
};
const bounds=meta.geo_bounds, mapW=620, mapH=893, margin=12;
const scale=Math.min((mapW-2*margin)/(bounds[2]-bounds[0]),(mapH-2*margin)/(bounds[3]-bounds[1]));
const project=(lon,lat)=>[margin+(lon-bounds[0])*scale,margin+(bounds[3]-lat)*scale];
const cellPx=Math.max(2,scale*meta.resolution_deg+1);

function interp(stops,t){
  t=Math.max(0,Math.min(1,t));
  const p=t*(stops.length-1),i=Math.min(stops.length-2,Math.floor(p)),f=p-i;
  return `rgb(${stops[i].map((v,k)=>Math.round(v+(stops[i+1][k]-v)*f)).join(',')})`;
}
function value(c){
  if(layer==='score'&&weights.some((w,i)=>Math.abs(w-[.45,.25,.30][i])>.001)){
    return 100*Math.exp(weights[0]*Math.log(Math.max(.01,c.H/100))+weights[1]*Math.log(Math.max(.01,c.B/100))+weights[2]*Math.log(Math.max(.01,c.F/100)));
  }
  return Number(c[layer]);
}
function color(v){const cfg=layers[layer],[lo,hi]=cfg.range;return interp(cfg.palette,(v-lo)/(hi-lo))}
function prepare(canvas){
  const dpr=Math.min(2,window.devicePixelRatio||1);
  if(canvas.width!==Math.round(mapW*dpr)||canvas.height!==Math.round(mapH*dpr)){
    canvas.width=Math.round(mapW*dpr);canvas.height=Math.round(mapH*dpr);
  }
  const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,mapW,mapH);return ctx;
}
function strokePath(ctx,path,colorValue,width){
  if(!path)return;try{ctx.strokeStyle=colorValue;ctx.lineWidth=width;ctx.stroke(new Path2D(path))}catch{/* Ignore malformed optional geometry. */}
}
function drawFurniture(ctx){
  const theme=mapTheme();
  const meanLat=(bounds[1]+bounds[3])/2;
  const barKm=100,barPx=Math.min(125,barKm*scale/(111.32*Math.cos(meanLat*Math.PI/180)));
  ctx.save();
  ctx.fillStyle=theme.furniture;ctx.strokeStyle=theme.furnitureLine;ctx.lineWidth=.6;
  ctx.beginPath();ctx.roundRect(22,mapH-57,barPx+28,36,7);ctx.fill();ctx.stroke();
  ctx.strokeStyle=theme.furnitureText;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(36,mapH-36);ctx.lineTo(36+barPx,mapH-36);ctx.moveTo(36,mapH-41);ctx.lineTo(36,mapH-31);ctx.moveTo(36+barPx,mapH-41);ctx.lineTo(36+barPx,mapH-31);ctx.stroke();
  ctx.fillStyle=theme.furnitureText;ctx.font='600 10px Inter, sans-serif';ctx.textAlign='center';ctx.fillText('100 km',36+barPx/2,mapH-43);
  ctx.fillStyle=theme.furniture;ctx.beginPath();ctx.roundRect(mapW-60,20,38,62,8);ctx.fill();
  ctx.fillStyle=theme.furnitureText;ctx.font='700 11px Inter, sans-serif';ctx.fillText('N',mapW-41,37);ctx.beginPath();ctx.moveTo(mapW-41,44);ctx.lineTo(mapW-49,67);ctx.lineTo(mapW-41,62);ctx.lineTo(mapW-33,67);ctx.closePath();ctx.fill();
  ctx.restore();
}
function draw(canvas,preview=false){
  if(!canvas)return;
  const theme=mapTheme(),ctx=prepare(canvas);ctx.fillStyle=theme.bg;ctx.fillRect(0,0,mapW,mapH);
  cells.forEach(c=>{
    const [x,y]=project(c.lon,c.lat);
    let alpha=1;
    if(selectedDistrict&&c.district_id!==selectedDistrict.district_id)alpha=.16;
    if(robustOnly&&!(c.score>=70&&c.structural_min>=70))alpha=Math.min(alpha,.12);
    ctx.globalAlpha=alpha;ctx.fillStyle=color(value(c));ctx.fillRect(x-cellPx/2,y-cellPx/2,cellPx,cellPx);
  });
  ctx.globalAlpha=1;
  if(!preview){
    shapes.forEach(s=>strokePath(ctx,s.path,theme.district,.38));
    regions.forEach(r=>strokePath(ctx,r.path,theme.region,.72));
  }
  strokePath(ctx,DATA.national_path,theme.outline,preview?1.15:1.35);
  if(selectedDistrict){
    const shape=shapes.find(s=>s.id===selectedDistrict.district_id);
    if(shape){strokePath(ctx,shape.path,'rgba(255,255,255,.95)',3.4);strokePath(ctx,shape.path,'#b94f36',1.8)}
  }
  if(selectedCell){
    const [x,y]=project(selectedCell.lon,selectedCell.lat);ctx.strokeStyle='#fff';ctx.lineWidth=4;ctx.strokeRect(x-cellPx/2-1,y-cellPx/2-1,cellPx+2,cellPx+2);ctx.strokeStyle=isDark()?'#03111e':'#011e50';ctx.lineWidth=1.8;ctx.strokeRect(x-cellPx/2-1,y-cellPx/2-1,cellPx+2,cellPx+2);
  }
  if(!preview)drawFurniture(ctx);
}
function drawDistrictMini(canvas,d){
  if(!canvas)return;const theme=mapTheme(),ctx=prepare(canvas);ctx.fillStyle=theme.bg;ctx.fillRect(0,0,mapW,mapH);
  shapes.forEach(s=>{try{ctx.fillStyle=s.id===d.district_id?'#27b677':theme.inactive;ctx.fill(new Path2D(s.path))}catch{/* Continue rendering valid district geometry. */}});
  regions.forEach(r=>strokePath(ctx,r.path,theme.region,.65));strokePath(ctx,DATA.national_path,theme.outline,1.25);
  const shape=shapes.find(s=>s.id===d.district_id);if(shape){strokePath(ctx,shape.path,'#fff',4);strokePath(ctx,shape.path,'#b94f36',2)}
}
function route(){
  const name=(location.hash||'#home').slice(1).split('?')[0];
  const valid=$$('[data-view]').some(v=>v.dataset.view===name)?name:'home';
  $$('[data-view]').forEach(v=>v.hidden=v.dataset.view!==valid);
  $$('#mainNav a').forEach(a=>{const active=a.getAttribute('href')==='#'+valid;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  $('#mainNav').classList.remove('open');$('#menuButton').setAttribute('aria-expanded','false');window.scrollTo(0,0);
  if(valid==='explorer')requestAnimationFrame(()=>draw($('#mapCanvas')));if(valid==='districts')renderDistrictTable();
}
function fmt(x,d=1){return Number(x).toLocaleString(undefined,{maximumFractionDigits:d,minimumFractionDigits:d})}
function cellDetails(c){
  selectedCell=c;const scenario=value(c),custom=weights.some((w,i)=>Math.abs(w-[.45,.25,.30][i])>.001);
  $('#cellDetails').innerHTML=`<span class="eyebrow">Grid-cell evidence profile</span><h2>${c.district}</h2><p>${c.region} · ${c.lat.toFixed(4)}° N, ${Math.abs(c.lon).toFixed(4)}° ${c.lon<0?'W':'E'}</p><div class="score-disc" style="--score:${Math.max(0,Math.min(100,scenario))}%"><strong>${fmt(scenario,1)}</strong></div><div class="mini-bars">${[['H',c.H],['B',c.B],['F',c.F]].map(([k,v])=>`<div class="mini-bar"><b>${k}</b><i><b style="width:${v}%"></b></i><span>${fmt(v)}</span></div>`).join('')}</div><div class="kv"><span>${custom?'Exploratory':'Default'} index</span><b>${fmt(scenario)}</b><span>Published default</span><b>${fmt(c.score)}</b><span>Scenario P10–P90</span><b>${fmt(c.p10)}–${fmt(c.p90)}</b><span>Structural minimum</span><b>${fmt(c.structural_min)}</b><span>pH / CEC</span><b>${fmt(c.pH,2)} / ${fmt(c.CEC)}</b><span>Precipitation / temperature</span><b>${fmt(c.MAP,0)} mm / ${fmt(c.MAT)} °C</b><span>Mapped-source distance</span><b>${fmt(c.feedstock_km)} km</b></div><p class="hero-warning"><strong>Required validation.</strong> Land eligibility, feedstock properties, logistics, environmental safety and carbon accounting must be established independently.</p>`;
  const status=$('#mapStatus');if(status)status.value=`Selected ${c.district}: ${layers[layer].label} ${fmt(value(c))}`;draw($('#mapCanvas'));
}
function nearestCell(event,canvas){
  const r=canvas.getBoundingClientRect(),x=(event.clientX-r.left)*mapW/r.width,y=(event.clientY-r.top)*mapH/r.height;let best=null,dist=Infinity;
  for(const c of cells){const p=project(c.lon,c.lat),d=(p[0]-x)**2+(p[1]-y)**2;if(d<dist){dist=d;best=c}}
  if(best&&dist<=(cellPx*2.2)**2)cellDetails(best);
}
function districtDetails(d,target='#districtProfile'){
  selectedDistrict=d;const el=$(target);if(!el)return;
  const coverage=d.interpolated_area_pct>0?`<p class="hero-warning"><strong>Boundary-cell coverage.</strong> ${fmt(d.interpolated_area_pct)}% of the aggregation area uses the nearest complete grid-cell evidence at the district boundary.</p>`:'';
  el.innerHTML=`<span class="eyebrow">District reporting profile</span><h2>${d.district}</h2><p>${d.region}</p><canvas class="district-mini-map" width="620" height="893" aria-label="Location of ${d.district} within Ghana"></canvas><div class="score-disc" style="--score:${d.score_mean}%"><strong>${fmt(d.score_mean)}</strong></div><div class="mini-bars">${[['H',d.H_mean],['B',d.B_mean],['F',d.F_mean]].map(([k,v])=>`<div class="mini-bar"><b>${k}</b><i><b style="width:${v}%"></b></i><span>${fmt(v)}</span></div>`).join('')}</div><div class="kv"><span>Area with index ≥70</span><b>${fmt(d.area_ge_70_pct)}%</b><span>Structurally robust area ≥70</span><b>${fmt(d.area_robust_ge_70_pct)}%</b><span>Spatial IQR</span><b>${fmt(d.within_iqr)} pts</b><span>Mean P10–P90 width</span><b>${fmt(d.scenario_width_mean)} pts</b><span>Intersecting cells</span><b>${d.n_intersecting_cells}</b><span>Aggregation</span><b>Area weighted</b></div>${coverage}<a class="button secondary show-district-map" href="#explorer">View in national explorer</a>`;
  drawDistrictMini(el.querySelector('.district-mini-map'),d);
  const btn=el.querySelector('.show-district-map');if(btn)btn.onclick=()=>setTimeout(()=>{selectedDistrict=d;selectedCell=null;draw($('#mapCanvas'));$('#districtSearch').value=d.district;districtDetails(d,'#cellDetails');const status=$('#mapStatus');if(status)status.value=`District selected: ${d.district}, ${d.region}`},40);
  if(target==='#cellDetails'){const status=$('#mapStatus');if(status)status.value=`District selected: ${d.district}, ${d.region}`;draw($('#mapCanvas'))}
}
function renderDistrictTable(){
  const q=($('#districtTableSearch')?.value||'').toLowerCase(),region=$('#regionFilter')?.value||'',sort=$('#districtSort')?.value||'score_mean';
  const list=districts.filter(d=>(!region||d.region===region)&&(!q||(d.district+' '+d.region).toLowerCase().includes(q))).sort((a,b)=>b[sort]-a[sort]);
  $('#districtTableBody').innerHTML=list.map(d=>`<tr data-id="${d.district_id}" tabindex="0"><td><strong>${d.district}</strong></td><td>${d.region}</td><td>${fmt(d.score_mean)}</td><td>${fmt(d.area_ge_70_pct)}%</td><td>${fmt(d.area_robust_ge_70_pct)}%</td><td>${fmt(d.scenario_width_mean)}</td><td>${fmt(d.within_iqr)}</td></tr>`).join('');
  $$('#districtTableBody tr').forEach(tr=>{const open=()=>districtDetails(districts.find(d=>d.district_id===+tr.dataset.id));tr.onclick=open;tr.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}}});
}
function updateLayerUI(){
  const cfg=layers[layer],[lo,hi]=cfg.range;$('#mapTitle').textContent=cfg.label;$('#legendMin').textContent=lo.toLocaleString();$('#legendMax').textContent=hi.toLocaleString();$('#legendTitle').textContent=cfg.legend;$('#layerDescription').textContent=cfg.description;
  $('#legendRamp').style.background=`linear-gradient(90deg,${cfg.palette.map(c=>`rgb(${c.join(',')})`).join(',')})`;
}
function updateWeights(changedId){
  const ids=['hWeight','bWeight','fWeight'];
  if(changedId){const changed=ids.indexOf(changedId),raw=ids.map(id=>+$('#'+id).value),remaining=100-raw[changed],others=[0,1,2].filter(i=>i!==changed),otherTotal=raw[others[0]]+raw[others[1]];const first=otherTotal?Math.round(remaining*raw[others[0]]/otherTotal):Math.round(remaining/2);raw[others[0]]=first;raw[others[1]]=remaining-first;ids.forEach((id,i)=>$('#'+id).value=raw[i])}
  weights=ids.map(id=>+$('#'+id).value/100);['h','b','f'].forEach((k,i)=>$('#'+k+'Out').textContent=Math.round(weights[i]*100)+'%');
  $('#mapContext').textContent=`Exploratory weights H ${Math.round(weights[0]*100)}% · B ${Math.round(weights[1]*100)}% · F ${Math.round(weights[2]*100)}%`;layer='score';$('#layerSelect').value='score';updateLayerUI();draw($('#mapCanvas'));if(selectedCell)cellDetails(selectedCell);
}
function clearSelection(){
  selectedCell=null;selectedDistrict=null;$('#districtSearch').value='';$('#districtMatches').innerHTML='';$('#cellDetails').innerHTML='<span class="eyebrow">Evidence profile</span><h2>No grid cell selected</h2><p>Select a grid cell or locate a district to review the mapped evidence and its interpretation limits.</p>';$('#mapStatus').value='No cell selected';draw($('#mapCanvas'));
}
function setTheme(theme,persist=true){
  const next=theme==='dark'?'dark':'light';document.documentElement.dataset.theme=next;
  if(persist){try{localStorage.setItem('knustrocks-theme',next)}catch{/* Theme persistence is optional in restricted browsers. */}}
  const dark=next==='dark',button=$('#themeToggle'),label=$('#themeLabel');
  if(button){button.setAttribute('aria-pressed',String(dark));button.setAttribute('aria-label',dark?'Use light theme':'Use dark theme')}
  if(label)label.textContent=dark?'Light':'Dark';
  const metaTheme=document.querySelector('meta[name="theme-color"]');if(metaTheme)metaTheme.content=dark?'#061724':'#011e50';
  requestAnimationFrame(()=>{draw($('#heroCanvas'),true);if($('#mapCanvas')&&!$('#mapCanvas').closest('[hidden]'))draw($('#mapCanvas'));const mini=$('#districtProfile canvas');if(mini&&selectedDistrict)drawDistrictMini(mini,selectedDistrict)});
}
function init(){
  setTheme(document.documentElement.dataset.theme||'light',false);$('#themeToggle').onclick=()=>setTheme(isDark()?'light':'dark');
  $('#homeCells').textContent=meta.n_cells.toLocaleString();$('#homeHigh').textContent=meta.cells_ge_70_pct.toFixed(2)+'%';$('#homeRobust').textContent=meta.cells_structurally_robust_ge_70_pct.toFixed(2)+'%';$('#homeWidth').textContent=meta.median_scenario_width.toFixed(1)+' pts';draw($('#heroCanvas'),true);
  $('#menuButton').onclick=()=>{const n=$('#mainNav'),o=!n.classList.contains('open');n.classList.toggle('open',o);$('#menuButton').setAttribute('aria-expanded',String(o))};window.addEventListener('hashchange',route);route();
  $('#layerSelect').onchange=e=>{layer=e.target.value;updateLayerUI();draw($('#mapCanvas'));if(selectedCell)cellDetails(selectedCell)};
  ['hWeight','bWeight','fWeight'].forEach(id=>$('#'+id).oninput=()=>updateWeights(id));$('#resetWeights').onclick=()=>{[['hWeight',45],['bWeight',25],['fWeight',30]].forEach(([id,v])=>$('#'+id).value=v);updateWeights()};
  $('#robustOnly').onchange=e=>{robustOnly=e.target.checked;draw($('#mapCanvas'))};$('#clearMapSelection').onclick=clearSelection;$('#mapCanvas').onclick=e=>nearestCell(e,$('#mapCanvas'));
  const search=()=>{const q=$('#districtSearch').value.toLowerCase();const found=q?districts.filter(d=>(d.district+' '+d.region).toLowerCase().includes(q)).slice(0,8):[];$('#districtMatches').innerHTML=found.map(d=>`<button data-id="${d.district_id}" role="option">${d.district}<small> · ${d.region}</small></button>`).join('');$$('#districtMatches button').forEach(b=>b.onclick=()=>{const d=districts.find(x=>x.district_id===+b.dataset.id);selectedDistrict=d;selectedCell=null;$('#districtSearch').value=d.district;$('#districtMatches').innerHTML='';districtDetails(d,'#cellDetails')})};$('#districtSearch').oninput=search;
  const regionNames=[...new Set(districts.map(d=>d.region))].sort();$('#regionFilter').innerHTML+='<option>'+regionNames.join('</option><option>')+'</option>';['districtTableSearch','regionFilter','districtSort'].forEach(id=>$('#'+id).addEventListener(id==='districtTableSearch'?'input':'change',renderDistrictTable));renderDistrictTable();updateLayerUI();
  const mrvSteps=$$('[data-mrv-step]'),updateMrv=()=>{const complete=mrvSteps.filter(step=>step.checked).length;$('#mrvProgress').textContent=`${complete} of ${mrvSteps.length} workstreams scoped`};mrvSteps.forEach(step=>step.onchange=updateMrv);$('#resetMrv').onclick=()=>{mrvSteps.forEach(step=>step.checked=false);updateMrv()};
  let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{draw($('#heroCanvas'),true);if(!$('#mapCanvas').closest('[hidden]'))draw($('#mapCanvas'))},120)});
}
init();
})();
