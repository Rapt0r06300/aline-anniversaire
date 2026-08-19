(function(){
'use strict';
var $=function(s){return document.querySelector(s)},sleep=function(ms){return new Promise(function(r){setTimeout(r,ms)})};
var intro=$('#intro'),card=$('#introCard'),heart=$('#heroHeart'),open=$('#open'),infection=$('#infection'),hack=$('#hack'),modal=$('#modal'),profile=$('#profile'),ids=$('#ids'),big=$('#big');
var coarse=window.matchMedia&&window.matchMedia('(pointer:coarse)').matches;
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function parallax(x,y){if(!card||coarse)return;var rx=clamp((.5-y/window.innerHeight)*8,-6,6),ry=clamp((x/window.innerWidth-.5)*10,-7,7);card.style.transform='rotateX('+rx+'deg) rotateY('+ry+'deg) translateZ(0)';if(heart)heart.style.transform='translate3d('+ry*1.7+'px,'+(-rx*1.5)+'px,42px)'}
if(intro){intro.addEventListener('pointermove',function(e){parallax(e.clientX,e.clientY)});intro.addEventListener('pointerleave',function(){if(card)card.style.transform='';if(heart)heart.style.transform=''})}
function pulseAt(x,y){var d=document.createElement('i');d.className='tap-ripple';d.style.left=x+'px';d.style.top=y+'px';document.body.appendChild(d);setTimeout(function(){d.remove()},750)}
document.addEventListener('pointerdown',function(e){if(e.target.closest('button'))pulseAt(e.clientX,e.clientY)},{passive:true});
/* Observe les modules hacker pour que le HUD réagisse automatiquement. */
if(window.MutationObserver&&hack){var obs=new MutationObserver(function(){var focus=[modal,profile,ids,big].some(function(el){return el&&el.classList.contains('visible')});hack.classList.toggle('hud-focus',focus)});[modal,profile,ids,big].forEach(function(el){if(el)obs.observe(el,{attributes:true,attributeFilter:['class']})})}
/* Transition d'entrée : on garde le onclick historique, mais on insère la contamination avant lui. */
if(open){var original=open.onclick;open.onclick=null;open.addEventListener('click',async function(e){e.preventDefault();if(open.dataset.busy)return;open.dataset.busy='1';open.classList.add('arming');if(card)card.classList.add('collapse');await sleep(420);if(infection){infection.classList.remove('active');void infection.offsetWidth;infection.classList.add('active')}await sleep(720);if(typeof original==='function')original.call(open,e);else open.dispatchEvent(new CustomEvent('cinematic:continue'));setTimeout(function(){if(infection)infection.classList.remove('active')},2300)},{once:true})}
/* Compatibilité : app.js affecte onclick après le chargement ; on le récupère au prochain tick si nécessaire. */
setTimeout(function(){if(!open||open.dataset.bound)return;var legacy=open.onclick;if(typeof legacy==='function'){open.onclick=null;open.dataset.bound='1';open.addEventListener('click',async function(e){e.preventDefault();if(open.dataset.busy)return;open.dataset.busy='1';open.classList.add('arming');if(card)card.classList.add('collapse');await sleep(420);if(infection){infection.classList.remove('active');void infection.offsetWidth;infection.classList.add('active')}await sleep(720);legacy.call(open,e);setTimeout(function(){if(infection)infection.classList.remove('active')},2300)},{once:true})}},0);
})();
