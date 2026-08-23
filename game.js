(()=>{'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const scene=$('#scene'),top=$('#top'),guide=$('#guide'),guideText=$('#guideText'),sound=$('#sound'),flash=$('#flash');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const state={sound:false,step:0,leadOpen:false};let audio=null,leadTimer=null;
function render(html,theme=''){document.body.classList.toggle('theme-love',theme==='love');scene.innerHTML=html;scene.style.animation='none';void scene.offsetWidth;scene.style.animation='';window.scrollTo(0,0)}
function progress(n){state.step=n;top.classList.toggle('hidden',n===0);$$('.steps i').forEach((d,i)=>d.classList.toggle('on',i<n))}
function ac(){if(!state.sound)return null;try{const A=window.AudioContext||window.webkitAudioContext;if(!audio&&A)audio=new A();if(audio&&audio.state==='suspended')audio.resume();return audio}catch(_){return null}}
function tone(f=420,d=.16,v=.007){const a=ac();if(!a)return;const o=a.createOscillator(),g=a.createGain(),t=a.currentTime;o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(a.destination);o.start();o.stop(t+d+.03)}
function ok(){flash.classList.remove('on');void flash.offsetWidth;flash.classList.add('on');tone(560,.12);setTimeout(()=>tone(760,.16),70);try{navigator.vibrate&&navigator.vibrate(12)}catch(_){}}
async function say(t,ms=2100){guideText.textContent=t;guide.classList.remove('hidden');await sleep(ms);guide.classList.add('hidden')}
function button(txt,id='next'){return `<button class="primary" id="${id}" type="button">${txt}</button>`}
sound.onclick=()=>{state.sound=!state.sound;sound.textContent=state.sound?'SON ✓':'SON';if(state.sound){ac();tone(500,.12)}};

/* décor canvas, volontairement discret */
const canvas=$('#fx'),ctx=canvas.getContext('2d');let W=0,H=0,D=1,p=[];
function resize(){W=innerWidth;H=innerHeight;D=Math.min(devicePixelRatio||1,1.5);canvas.width=W*D;canvas.height=H*D;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(D,0,0,D,0,0);const n=reduced?0:Math.min(46,Math.max(24,Math.floor(W/17)));p=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,r:.5+Math.random()*1.4,v:.08+Math.random()*.16,a:.08+Math.random()*.24,h:[188,255,330][Math.floor(Math.random()*3)]}))}
function draw(){ctx.clearRect(0,0,W,H);ctx.globalCompositeOperation='lighter';for(const q of p){q.y-=q.v;if(q.y<-10){q.y=H+10;q.x=Math.random()*W}ctx.fillStyle=`hsla(${q.h},90%,75%,${q.a})`;ctx.beginPath();ctx.arc(q.x,q.y,q.r,0,Math.PI*2);ctx.fill()}ctx.globalCompositeOperation='source-over';requestAnimationFrame(draw)}
addEventListener('resize',resize,{passive:true});resize();draw();

function home(){progress(0);render(`<div class="wrap hero">
  <div class="eyebrow">JUSTE POUR TOI</div>
  <div class="hero-orb"><b>A</b></div>
  <h1>Aline, joue trois fois.</h1>
  <p>À la fin, tu comprendras l’essentiel de ce que Flo fabrique sur son ordinateur. <strong>Tu n’as rien à apprendre avant.</strong></p>
  ${button('OK, MONTRE-MOI','start')}
  <div class="micro">3 petits jeux · environ 2 minutes</div>
</div>`);$('#start').onclick=async()=>{ok();await say('Promis : je te laisse regarder avant de t’expliquer. 😌',1600);game1()}}

const curves=[
{label:'Ça monte fort… puis ça s’écroule',name:'Le spectaculaire',stroke:'#ff7891',path:'M5 140 C45 28,80 160,118 34 S175 166,225 50 S280 178,335 66'},
{label:'Ça monte doucement, mais souvent',name:'Le régulier',stroke:'#75ffd3',path:'M5 145 C55 138,80 122,120 126 S180 102,215 106 S275 76,335 82'},
{label:'Impossible de savoir ce qui arrive',name:'Les montagnes russes',stroke:'#f5c86c',path:'M5 105 L38 28 L70 158 L103 42 L137 148 L170 20 L204 150 L240 38 L275 130 L335 52'}
];
function game1(){progress(1);render(`<div class="wrap game">
  <div class="game-head"><small>1 / 3</small><h2>Lequel te paraît le plus fiable ?</h2><p>Ne regarde pas seulement qui gagne le plus. Regarde surtout la forme.</p></div>
  <div class="arena"><div class="picks">${curves.map((c,i)=>`<button class="pick" data-pick="${i}" type="button"><div class="line"><svg viewBox="0 0 340 180" preserveAspectRatio="none"><path d="${c.path}" stroke="${c.stroke}"/></svg></div><div class="name"><small>${c.label}</small><b>${c.name}</b></div></button>`).join('')}</div></div>
  <div id="answer"></div>
</div>`);$$('[data-pick]').forEach(b=>b.onclick=()=>pick1(b))}
async function pick1(b){const i=+b.dataset.pick;$$('[data-pick]').forEach(x=>x.disabled=true);b.classList.add(i===1?'good':'bad');$$('[data-pick]')[1].classList.add('good');if(i===1)ok();$('#answer').innerHTML=`<div class="answer"><b>${i===1?'Oui.':'Le plus fiable était celui du milieu.'}</b> Le logiciel préfère souvent quelque chose de régulier à un énorme coup de chance.<div class="tech">ÇA S’APPELLE : COPY‑VAULT</div></div><div class="actions">${button('JEU SUIVANT','next1')}</div>`;await say('Premier principe compris. Pas besoin d’aller plus loin pour l’instant.',1600);$('#next1').onclick=game2}

function game2(){progress(2);render(`<div class="wrap game">
 <div class="game-head"><small>2 / 3</small><h2>Regarde la ville A.</h2><p>Dès qu’elle s’allume, touche le bouton avant que la lumière atteigne B.</p></div>
 <div class="arena"><div class="cities"><div id="cityA" class="city"><label>VILLE A</label></div><div id="road" class="road"><i class="signal"></i></div><div id="cityB" class="city"><label>VILLE B</label></div></div><button id="go" class="primary big-action" type="button">LANCER</button></div>
 <div id="answer"></div>
 </div>`);$('#go').onclick=startLead}
async function startLead(){if(state.leadOpen)return;const b=$('#go');b.disabled=true;b.textContent='REGARDE A…';await sleep(650+Math.random()*500);$('#cityA').classList.add('pulse');$('#road').classList.add('go');state.leadOpen=true;b.disabled=false;b.textContent='MAINTENANT !';b.onclick=()=>finishLead(true);leadTimer=setTimeout(()=>{if(state.leadOpen){$('#cityB').classList.add('hit');finishLead(false)}},1000)}
async function finishLead(win){if(!state.leadOpen)return;state.leadOpen=false;clearTimeout(leadTimer);$('#go').disabled=true;if(win)ok();$('#answer').innerHTML=`<div class="answer"><b>${win?'Bien vu.':'L’onde est arrivée juste avant.'}</b> Tu viens de voir A bouger, puis B suivre un peu après.<div class="tech">ÇA S’APPELLE : LEAD‑LAG</div></div><div class="actions">${button('DERNIER JEU','next2')}</div>`;await say('C’est vraiment ça : le premier bouge, le second suit.',1600);$('#next2').onclick=game3}

function game3(){progress(3);render(`<div class="wrap game">
 <div class="game-head"><small>3 / 3</small><h2>Tu vois un gain de 2 €.</h2><p>Même objet. 100 € ici, 102 € là-bas. Bonne affaire ?</p></div>
 <div class="arena"><div class="net" id="net">+2,00 €</div><div class="shops"><div class="shop"><div class="product"><b>◇</b></div><div class="price">100 €</div></div><div class="arrow">→</div><div class="shop"><div class="product"><b>◇</b></div><div class="price">102 €</div></div></div><div class="costs" id="costs">${button('VÉRIFIER CE QU’IL RESTE','check')}</div></div>
 <div id="answer"></div>
 </div>`);$('#check').onclick=checkCosts}
async function checkCosts(){const box=$('#costs'),net=$('#net');box.innerHTML='';const rows=[['Frais de transaction','−0,60 €'],['Prix qui bouge pendant l’achat','−0,80 €'],['Petit délai','−0,70 €']];let value=2;for(const [a,b] of rows){await sleep(450);box.insertAdjacentHTML('beforeend',`<div class="cost"><span>${a}</span><b>${b}</b></div>`);value-=Number(b.replace('−','').replace(' €','').replace(',','.'));net.textContent=(value>=0?'+':'')+value.toFixed(2).replace('.',',')+' €';net.style.color=value>0?'#79ffd2':'#ff849f';tone(300,.1)}await sleep(450);$('#answer').innerHTML=`<div class="answer"><b>Le gain a disparu.</b> Le logiciel ne regarde donc pas le joli +2 € du début. Il calcule ce qu’il reste vraiment à la fin.<div class="tech">ÇA S’APPELLE : CROSS‑VENUE</div></div><div class="actions">${button('J’AI COMPRIS','finish')}</div>`;await say('Et voilà. Troisième principe compris.',1400);$('#finish').onclick=finale}

function finale(){progress(3);render(`<div class="wrap final">
  <div class="eyebrow">C’EST TOUT.</div>
  <h2>Tu viens de comprendre le cœur du logiciel.</h2>
  <div class="summary"><div><b>①</b><small>Éviter de confondre talent et coup de chance.</small></div><div><b>②</b><small>Repérer quand quelque chose bouge juste avant autre chose.</small></div><div><b>③</b><small>Calculer ce qu’il reste vraiment après les petits coûts.</small></div></div>
  <p>Derrière ces trois idées très simples, Flo fait tester au logiciel énormément de situations pour essayer d’éviter les pièges.</p>
  <div class="love"><b>Petite anomalie détectée : ALINE ❤️</b><span>Le système indique qu’elle apparaît beaucoup trop souvent dans les pensées du propriétaire.</span></div>
  ${button('REJOUER','replay')}
 </div>`,'love');$('#replay').onclick=home;setTimeout(()=>say('Maintenant, quand Flo prononcera “Lead‑Lag”, tu pourras au moins lever les yeux au ciel en sachant de quoi il parle. 😂❤️',3300),500)}
home();
})();