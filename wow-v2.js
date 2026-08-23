(()=>{'use strict';
const $=s=>document.querySelector(s),scene=$('#scene'),app=$('#app');
const reduced=matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
let quality='auto',autoTier='max',frameSamples=[],last=performance.now(),portalBusy=false;

function haptic(p){try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}}
function burst(x,y,count=10){if(reduced||document.documentElement.classList.contains('quality-low'))return;for(let i=0;i<count;i++){const p=document.createElement('i');p.className='juice-particle';p.style.left=x+'px';p.style.top=y+'px';const a=Math.random()*Math.PI*2,d=28+Math.random()*82;p.style.setProperty('--jx',Math.cos(a)*d+'px');p.style.setProperty('--jy',Math.sin(a)*d+'px');document.body.appendChild(p);setTimeout(()=>p.remove(),760)}}
function kick(strong=false){if(reduced)return;app.classList.remove('screen-kick');void app.offsetWidth;app.classList.add('screen-kick');setTimeout(()=>app.classList.remove('screen-kick'),380);haptic(strong?[16,24,18]:10)}

document.addEventListener('pointerdown',e=>{const b=e.target.closest&&e.target.closest('button');if(!b)return;b.classList.remove('juice-hit');void b.offsetWidth;b.classList.add('juice-hit');burst(e.clientX,e.clientY,6);setTimeout(()=>b.classList.remove('juice-hit'),350)},{passive:true});

/* Cold open: court, skippable implicitement par prefers-reduced-motion. */
function coldOpen(){const el=document.createElement('div');el.id='coldOpen';el.innerHTML='<div class="cold-grid"></div><div class="cold-orb"></div><div class="cold-scan"></div><div class="cold-copy"><small>HYPERSMART LAB · INITIALISATION</small><strong>ALINE</strong><span>INVITÉE IDENTIFIÉE · ACCÈS AU LABORATOIRE</span></div>';document.body.appendChild(el);const delay=reduced?350:2450;setTimeout(()=>{el.classList.add('done');setTimeout(()=>el.remove(),900)},delay)}

const portal=document.createElement('div');portal.id='levelPortal';portal.innerHTML='<div class="portal-iris"></div><div class="portal-title"><small>TRANSFERT VERS LE MODULE</small><b id="portalName">LABORATOIRE</b></div>';document.body.appendChild(portal);
const names={toLead:'LEAD‑LAG',crossAgain:'CROSS‑VENUE',toBoss:'TEST FINAL',finishBoss:'ANALYSE FINALE',finalReport:'RAPPORT FINAL',startMission:'COPY‑VAULT',enterLab:'LABORATOIRE'};
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('button');if(!b)return;const name=names[b.id];if(!name||portalBusy||reduced)return;portalBusy=true;$('#portalName').textContent=name;portal.classList.add('on');setTimeout(()=>portal.classList.remove('on'),780);setTimeout(()=>portalBusy=false,900)},true);

function setWorld(){const t=(scene.textContent||'').toUpperCase();document.body.classList.remove('world-copy','world-lead','world-cross','world-boss','world-aline','world-final','aline-shift');let cls='';if(t.includes('COPY‑VAULT'))cls='world-copy';else if(t.includes('LEAD‑LAG'))cls='world-lead';else if(t.includes('CROSS‑VENUE'))cls='world-cross';else if(t.includes('FAUX PROFIT')||t.includes('BOSS · PHASE 2'))cls='world-boss';else if(t.includes('VARIABLE INATTENDUE')||t.includes('ALINE')&&t.includes('CORRECTIF')){cls='world-aline';document.body.classList.add('aline-shift')}else if(t.includes('MISSION TERMINÉE'))cls='world-final';if(cls)document.body.classList.add(cls);enhanceBoss();}

function enhanceBoss(){const root=$('#bossRoot');if(!root||root.dataset.v2)return;root.dataset.v2='1';const orb=root.querySelector('.profit-orb');const row=root.querySelector('.enemy-row');const hp=document.createElement('div');hp.className='boss-hp';hp.innerHTML='<div class="boss-hp-track"><div class="boss-hp-fill" id="bossHpFill"></div></div><div class="boss-hp-label"><span>INTÉGRITÉ DU FAUX PROFIT</span><b id="bossHpText">100 %</b></div>';orb.insertAdjacentElement('afterend',hp);row.addEventListener('click',e=>{const b=e.target.closest('.attack-button');if(!b||b.dataset.v2hit)return;b.dataset.v2hit='1';const remaining=Math.max(0,100-document.querySelectorAll('.attack-button.defeated').length*25);setTimeout(()=>{const f=$('#bossHpFill'),txt=$('#bossHpText');if(f)f.style.width=remaining+'%';if(txt)txt.textContent=remaining+' %';if(orb){orb.classList.remove('danger');void orb.offsetWidth;orb.classList.add('danger')}const imp=document.createElement('i');imp.className='boss-impact';document.body.appendChild(imp);setTimeout(()=>imp.remove(),700);kick(remaining===0);if(remaining===0)burst(innerWidth/2,innerHeight/2,26)},50)});}

if(window.MutationObserver&&scene)new MutationObserver(setWorld).observe(scene,{childList:true,subtree:true});
setWorld();

/* Controle de qualite + monitoring du frame-time. Le mode Auto degrade uniquement les ornements CSS. */
const qc=document.createElement('div');qc.id='qualityControl';qc.setAttribute('aria-label','Qualité graphique');qc.innerHTML='<button data-q="auto" class="on">AUTO</button><button data-q="low">FLUIDE</button><button data-q="max">MAX</button>';document.body.appendChild(qc);
function applyQuality(q){document.documentElement.classList.remove('quality-low','quality-max');if(q==='low'||(q==='auto'&&autoTier==='low'))document.documentElement.classList.add('quality-low');else if(q==='max'||(q==='auto'&&autoTier==='max'))document.documentElement.classList.add('quality-max');qc.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.q===q))}
qc.onclick=e=>{const b=e.target.closest('button[data-q]');if(!b)return;quality=b.dataset.q;applyQuality(quality);try{localStorage.setItem('aline-quality',quality)}catch(_){}};
try{quality=localStorage.getItem('aline-quality')||'auto'}catch(_){}applyQuality(quality);
function perf(now){const dt=now-last;last=now;if(dt<100)frameSamples.push(dt);if(frameSamples.length>90){const avg=frameSamples.reduce((a,b)=>a+b,0)/frameSamples.length;const slow=frameSamples.filter(v=>v>24).length;autoTier=(avg>21||slow>22)?'low':'max';if(quality==='auto')applyQuality('auto');frameSamples=[]}requestAnimationFrame(perf)}requestAnimationFrame(perf);

/* Succès / erreurs visuels déduits des classes déjà utilisées par le jeu. */
if(window.MutationObserver){new MutationObserver(()=>{document.querySelectorAll('.correct:not([data-juice])').forEach(el=>{el.dataset.juice='1';el.classList.add('juice-success');const r=el.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2,14)});document.querySelectorAll('.wrong:not([data-juice])').forEach(el=>{el.dataset.juice='1';kick(false)});}).observe(document.body,{attributes:true,subtree:true,attributeFilter:['class']})}

coldOpen();
})();