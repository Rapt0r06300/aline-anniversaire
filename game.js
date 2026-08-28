(()=>{'use strict';
const BUILD='V10-PREMIUM-20260828-2345';
const $=s=>document.querySelector(s),$$=s=>Array.from(document.querySelectorAll(s));
const scene=$('#scene');
const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false;
const timers=new Set();
let locked=false;

function later(fn,ms){const id=setTimeout(()=>{timers.delete(id);fn()},ms);timers.add(id);return id}
function wait(ms){return new Promise(resolve=>later(resolve,ms))}
function clearTimers(){for(const id of timers)clearTimeout(id);timers.clear();locked=false}
function render(html){clearTimers();scene.innerHTML=`<div class="shell"><div class="view enter">${html}</div></div>`;window.scrollTo({top:0,behavior:'auto'});requestAnimationFrame(()=>scene.querySelector('button')?.focus({preventScroll:true}))}
function action(label,id,secondary=false){return `<button class="${secondary?'text-action':'primary'}" id="${id}" type="button">${label}</button>`}
function bind(id,fn){const el=$('#'+id);if(!el)return;el.onclick=async()=>{if(locked||el.disabled)return;locked=true;el.disabled=true;try{await fn()}finally{locked=false;if(document.body.contains(el))el.disabled=false}}}
async function transition(next){if(reduced){next();return}scene.style.opacity='.28';scene.style.transform='translateY(5px)';await wait(220);scene.style.opacity='';scene.style.transform='';next()}
function showInsight(html){const box=$('#insight');if(!box)return;box.innerHTML=html;box.classList.add('show')}
function setActions(html){const box=$('#actions');if(box)box.innerHTML=html}

function home(){render(`
  <div class="home">
    <div class="eyebrow">Pour Aline</div>
    <div class="rule" aria-hidden="true"></div>
    <h1 class="display">Je préfère te le montrer que te l’expliquer.</h1>
    <p class="lead">Trois idées. Quelques secondes chacune. Rien à connaître avant.</p>
    <div class="actions">${action('Voir','start')}</div>
  </div>`);
  bind('start',()=>transition(momentOne));
}

function momentOne(){render(`
  <header class="section-head">
    <div class="section-copy">
      <div class="eyebrow">Régularité</div>
      <h2 class="headline">Le plus impressionnant n’est pas toujours le plus intéressant.</h2>
    </div>
    <p class="lead">Regarde ce qui tient dans le temps.</p>
  </header>
  <div class="stage">
    <div class="curves" aria-label="Trois trajectoires différentes">
      <div class="curve" data-curve="spike">
        <div><b>Très fort au début</b><small>Puis ça retombe.</small></div>
        <svg viewBox="0 0 220 120" preserveAspectRatio="none" aria-hidden="true"><path d="M4 101 C30 92,38 18,62 14 S92 88,118 34 S153 96,216 89"/></svg>
      </div>
      <div class="curve" data-curve="stable">
        <div><b>Moins spectaculaire</b><small>Mais ça tient.</small></div>
        <svg viewBox="0 0 220 120" preserveAspectRatio="none" aria-hidden="true"><path d="M4 101 C28 97,42 89,62 88 S102 72,122 73 S164 53,216 45"/></svg>
      </div>
      <div class="curve" data-curve="noise">
        <div><b>Très nerveux</b><small>Difficile à suivre.</small></div>
        <svg viewBox="0 0 220 120" preserveAspectRatio="none" aria-hidden="true"><path d="M4 72 L28 18 L50 104 L76 30 L99 98 L124 14 L148 91 L174 27 L197 85 L216 49"/></svg>
      </div>
    </div>
  </div>
  <div id="insight" class="insight" aria-live="polite"></div>
  <div id="actions" class="actions">${action('Voir ce que le logiciel retient','revealOne')}</div>`);
  bind('revealOne',revealOne);
}

async function revealOne(){
  $$('[data-curve]').forEach(el=>el.classList.toggle('dim',el.dataset.curve!=='stable'));
  $('[data-curve="stable"]')?.classList.add('keep');
  showInsight('<strong>Il garderait la trajectoire régulière.</strong> Moins spectaculaire, mais beaucoup plus fiable.');
  setActions(action('Continuer','nextOne'));
  bind('nextOne',()=>transition(momentTwo));
}

function momentTwo(){render(`
  <header class="section-head">
    <div class="section-copy">
      <div class="eyebrow">Décalage</div>
      <h2 class="headline">Parfois, le mouvement commence ailleurs.</h2>
    </div>
    <p class="lead">A bouge. B suit juste après.</p>
  </header>
  <div class="stage signal-wrap">
    <div class="signal-row" aria-label="A précède B">
      <div id="nodeA" class="signal-node">A</div>
      <div id="signalLine" class="signal-line"><i class="signal-dot" aria-hidden="true"></i></div>
      <div id="nodeB" class="signal-node">B</div>
    </div>
    <div class="signal-note">Le logiciel observe l’ordre et le délai.</div>
  </div>
  <div id="insight" class="insight" aria-live="polite"></div>
  <div id="actions" class="actions">${action('Voir le décalage','revealTwo')}</div>`);
  bind('revealTwo',revealTwo);
}

async function revealTwo(){
  const a=$('#nodeA'),b=$('#nodeB'),line=$('#signalLine'),dot=line?.querySelector('.signal-dot');
  if(!a||!b||!line||!dot)return;
  const travel=Math.max(0,line.clientWidth-dot.offsetWidth);
  line.style.setProperty('--travel',`${travel}px`);
  a.classList.add('pulse');
  line.classList.add('running');
  if(!reduced)await wait(650);
  if(!document.body.contains(b))return;
  b.classList.add('pulse');
  if(!reduced)await wait(280);
  showInsight('<strong>Le petit retard entre A et B est l’information.</strong> Le logiciel essaie de repérer ce genre de décalage avant qu’il disparaisse.');
  setActions(action('Continuer','nextTwo'));
  bind('nextTwo',()=>transition(momentThree));
}

function momentThree(){render(`
  <header class="section-head">
    <div class="section-copy">
      <div class="eyebrow">Résultat réel</div>
      <h2 class="headline">Le chiffre affiché n’est pas le résultat.</h2>
    </div>
    <p class="lead">100 € ici. 102 € ailleurs. À première vue : +2 €.</p>
  </header>
  <div class="stage price-stage">
    <div class="price-row">
      <div class="price"><small>Ici</small><b>100 €</b></div>
      <div class="price-arrow" aria-hidden="true">→</div>
      <div class="price"><small>Ailleurs</small><b>102 €</b></div>
    </div>
    <div class="net"><small>Résultat apparent</small><strong id="net">+2,00 €</strong></div>
    <div class="costs" aria-live="polite">
      <div class="cost" data-cost aria-hidden="true"><span>Frais</span><b>−0,60 €</b></div>
      <div class="cost" data-cost aria-hidden="true"><span>Prix qui bouge</span><b>−0,80 €</b></div>
      <div class="cost" data-cost aria-hidden="true"><span>Délai</span><b>−0,70 €</b></div>
    </div>
  </div>
  <div id="insight" class="insight" aria-live="polite"></div>
  <div id="actions" class="actions">${action('Voir ce qu’il reste','revealThree')}</div>`);
  bind('revealThree',revealThree);
}

async function revealThree(){
  const net=$('#net');
  const rows=$$('[data-cost]');
  const values=['+1,40 €','+0,60 €','−0,10 €'];
  for(let i=0;i<rows.length;i++){
    rows[i].setAttribute('aria-hidden','false');
    rows[i].classList.add('show');
    if(net)net.textContent=values[i];
    if(!reduced)await wait(320);
  }
  showInsight('<strong>Le +2 € a disparu.</strong> C’est pour ça que le logiciel ne s’arrête jamais au chiffre le plus séduisant.');
  setActions(action('Continuer','nextThree'));
  bind('nextThree',()=>transition(finale));
}

function finale(){render(`
  <div class="final">
    <div class="eyebrow">En bref</div>
    <h2 class="display">Trois idées. C’est essentiellement ça.</h2>
    <div class="final-lines">
      <div class="final-line">Repérer ce qui tient.</div>
      <div class="final-line">Voir ce qui bouge d’abord.</div>
      <div class="final-line">Vérifier ce qui reste vraiment.</div>
    </div>
    <div class="technical">En technique : Copy‑Vault · Lead‑Lag · Cross‑Venue</div>
    <p class="personal">Je voulais te le montrer comme ça, sans te faire subir vingt minutes de jargon. <span class="signature">— Flo</span></p>
    <div class="actions">${action('Revoir','replay',true)}</div>
  </div>`);
  bind('replay',()=>transition(home));
}

window.__ALINE_V10__={build:BUILD,getMetrics:()=>({width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,height:document.documentElement.clientHeight,scrollHeight:document.documentElement.scrollHeight})};
home();
})();
