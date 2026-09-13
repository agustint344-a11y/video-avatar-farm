/**
 * Página (Artifact HTML) con botones de Copiar: guión, título, descripción, comentario y PROMPT de miniatura.
 * Editar el array `videos` y correr: node scripts/build_guiones_page.mjs   (lee guiones/<slug>_guion.txt)
 */
import fs from "node:fs";
const ROOT = process.cwd();
const G = ROOT + "/guiones/";
const OUT_HTML = "C:/Users/Teje/AppData/Local/Temp/claude/C--Users-Teje-Desktop-CLAUDE/77868391-a22a-4c40-a359-e543a9539669/scratchpad/guiones_copiar.html";
const read = (f) => fs.readFileSync(G + f, "utf8").trim();

const videos = [
  { slug: "teverde-elena", emoji: "🍵", accent: "#0d9488", tema: "Dra. Elena Vidal", temaTag: "Salud · turquesa", dur: "≈ 20 min",
    titulo: "TÉ VERDE: ¿de verdad quema grasa? Lo que SÍ hace (y el error que arruina tu taza)",
    desc: `Al té verde le colgaron mil promesas: que derrite la grasa, que acelera el metabolismo, que desintoxica, que cura el cáncer. La Dra. Elena Vidal separa, con evidencia y sin exagerar, lo real de lo mágico: es una de las bebidas más sanas que hay (antioxidantes, corazón, energía tranquila por su L-teanina), pero su efecto sobre el peso es diminuto. Aprendé a prepararlo bien (el agua hirviendo lo arruina), cuándo tomarlo, y las advertencias (cafeína, embarazo, hierro y los peligrosos extractos concentrados).

👉 Mi guía "El Método Bienestar Natural" está en el comentario fijado y en el primer enlace de la descripción.

⚠️ Contenido informativo y educativo, no reemplaza la consulta con tu médico. Parte de la producción usa IA.`,
    comentario: `📘 Te dejé mi guía "El Método Bienestar Natural" acá 👇
https://guia-bienestar-natural-oficial.vercel.app/?utm_source=youtube&utm_medium=comment#oferta

Y acordate: NUNCA lo hagas con agua hirviendo (queda amargo y pierde lo bueno), tomalo lejos de las comidas con hierro, 2-3 tazas al día. No derrite grasa: es un hábito sano, no magia 🍵`,
    mini: `Miniatura de YouTube 1280x720, fondo 100% NEGRO puro. Usá la foto de referencia adjunta de la Dra. Elena Vidal RESPETANDO SU CARA, recreada en otra pose (no recortar la foto): en un CÍRCULO con borde difuminado en la esquina superior derecha, con bata blanca, señalando con expresión de advertencia amable. Abajo a la izquierda, una mano sosteniendo hojas de té verde. En el centro, una taza de vidrio con té verde humeante bien verde y hojas de té alrededor. Arriba a la izquierda, texto en MAYÚSCULAS tipografía Impact con grueso contorno negro: "TÉ VERDE" en verde y debajo "¿QUEMA GRASA?" en blanco. Estilo dopamínico, verde vivo sobre el negro, ultra nítido, alto contraste.` },
  { slug: "limon-juantombo", emoji: "🍋", accent: "#b45309", tema: "Dr. Juan Tombo", temaTag: "Remedios caseros · tierra", dur: "≈ 20 min",
    titulo: "LIMÓN: la verdad sobre el agua con limón en ayunas (y el mito peligroso de 'alcalinizar')",
    desc: `Al limón le atribuyen que adelgaza, que "alcaliniza el cuerpo" y así previene el cáncer, que cura la gripe, que desintoxica. El Dr. Juan Tomás separa, con criterio médico, lo real de lo mágico: es un gran alimento (vitamina C, ayuda a absorber el hierro, ayuda a comer con menos sal, y sí puede prevenir ciertos cálculos renales), pero NO alcaliniza nada (es imposible) ni adelgaza solo. Cómo usarlo sin lastimarte los dientes ni el estómago, y los mitos peligrosos desarmados.

👉 La guía "El Método Bienestar Natural" está en el comentario fijado y en el primer enlace de la descripción.

⚠️ Contenido informativo y educativo, no reemplaza la consulta con tu médico. Parte de la producción usa IA.`,
    comentario: `📘 Te dejé la guía "El Método Bienestar Natural" acá 👇
https://guia-bienestar-natural-git-ve-312784-agustins-projects-da4b6a55.vercel.app/#oferta

⚠️ IMPORTANTE: lo de "alcalinizar el cuerpo" es un MITO (tu sangre se regula sola). Y NUNCA tomes el jugo puro en ayunas: te gasta el esmalte de los dientes. Diluido, con las comidas 🍋`,
    mini: `Miniatura de YouTube 1280x720, fondo 100% NEGRO puro. Usá la foto de referencia adjunta del Dr. Juan Tomás RESPETANDO SU CARA, recreado en otra pose (no recortar la foto): en un CÍRCULO con borde difuminado en la esquina superior derecha, con scrubs azul marino, con la mano en alto en gesto de "alto/pará", expresión de advertencia. Abajo a la izquierda, una mano exprimiendo medio limón. En el centro, un vaso de agua con rodajas de limón y limones amarillos brillantes al lado. Arriba a la izquierda, texto en MAYÚSCULAS tipografía Impact con grueso contorno negro: "LIMÓN" en amarillo y debajo "¿EN AYUNAS?" en blanco. Estilo dopamínico, amarillo vivo sobre el negro, ultra nítido, alto contraste.` },
  { slug: "comics-atticfortune", emoji: "📚", accent: "#a16207", tema: "Attic Fortune", temaTag: "Inglés · Walt Hargrove", dur: "≈ 20 min",
    titulo: "10 Old Comic Books in Your Attic Worth a FORTUNE! (Age, Condition & Key Issues)",
    desc: `That box of old comics in the attic could be worth hundreds, thousands — even tens of thousands — to the right collector. Veteran appraiser Walt Hargrove walks you through 10 old comic books hiding in American homes, from Golden Age wartime issues to 1960s first appearances and key issues. Learn the three things that make a comic valuable (age, condition & importance), how the grading scale multiplies the price, and the #1 mistake that destroys the value.

👉 Get the full guide (key issues & current values) in the pinned comment and the first link below.

Before you toss it, check its worth.`,
    comentario: `📘 Get my full Attic Fortune guide here 👇
https://attic-fortune.vercel.app

Tell me: what old comics have you got tucked away? 📚 And remember — it's AGE + CONDITION + a KEY ISSUE (a first appearance) that matters, and NEVER tape, trim or clean an old comic!`,
    mini: `YouTube thumbnail 1280x720, Attic Fortune style. Use the attached reference photo of Walt Hargrove KEEPING HIS FACE (older appraiser, white beard, plaid shirt and denim overalls), recreated in a new pose (do not crop the photo) inside his rustic barn workshop, holding up an old vintage comic book toward the camera with a surprised expression, an open cardboard box full of old comics in front of him. Text: a red rusty "BEWARE" sign top-left; "WORTH" in yellow and "$40,000?" in big white below it (Impact font, thick black outline); a bold yellow curved arrow pointing at the comic. Warm barn lighting, ultra sharp, high contrast.` },
];

for (const v of videos) v.guion = read(v.slug + "_guion.txt");
const DATA = JSON.stringify(videos);

const html = `<title>Guiones para copiar</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap">
<style>
:root{ --bg:#f4f2ee; --panel:#fff; --ink:#1c1a17; --muted:#6b655c; --line:#e4dfd6; --chip:#efece6; --shadow:0 1px 2px rgba(0,0,0,.04),0 8px 24px rgba(0,0,0,.06); --radius:16px; }
@media (prefers-color-scheme:dark){ :root:not([data-theme="light"]){ --bg:#17150f; --panel:#211e17; --ink:#f3efe6; --muted:#a49c8c; --line:#332e24; --chip:#2b271e; --shadow:0 1px 2px rgba(0,0,0,.3),0 10px 30px rgba(0,0,0,.4); } }
:root[data-theme="dark"]{ --bg:#17150f; --panel:#211e17; --ink:#f3efe6; --muted:#a49c8c; --line:#332e24; --chip:#2b271e; --shadow:0 1px 2px rgba(0,0,0,.3),0 10px 30px rgba(0,0,0,.4); }
*{box-sizing:border-box}
body{background:var(--bg);color:var(--ink);font-family:Inter,system-ui,sans-serif;line-height:1.6;-webkit-font-smoothing:antialiased;padding:32px 20px 80px}
.wrap{max-width:900px;margin:0 auto}
.kicker{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);font-weight:600}
h1{font-family:Fraunces,Georgia,serif;font-weight:600;font-size:clamp(28px,5vw,42px);margin:.15em 0 .1em;letter-spacing:-.01em;text-wrap:balance}
.sub{color:var(--muted);max-width:62ch}
.card{background:var(--panel);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow);margin-top:22px;overflow:hidden}
.card-head{display:flex;align-items:center;gap:14px;padding:16px 20px;border-bottom:1px solid var(--line);border-left:5px solid var(--accent)}
.emoji{font-size:26px}.card-head .meta{flex:1;min-width:0}
.card-head h2{font-family:Fraunces,Georgia,serif;font-weight:600;font-size:20px;margin:0;color:var(--accent)}
.card-head .tags{font-size:12.5px;color:var(--muted);margin-top:2px}
.dur{font-size:12px;font-weight:600;color:var(--accent);background:color-mix(in srgb,var(--accent) 14%,transparent);padding:5px 10px;border-radius:999px;white-space:nowrap}
.block{padding:16px 20px;border-top:1px solid var(--line)}
.block-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px}
.label{font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:var(--muted);font-weight:600}
.wc{font-size:11.5px;color:var(--muted)}
.copy{border:1px solid var(--accent);color:var(--accent);background:transparent;font:inherit;font-size:13px;font-weight:600;padding:7px 14px;border-radius:9px;cursor:pointer;display:inline-flex;align-items:center;gap:7px;transition:background .12s,color .12s,transform .08s}
.copy:hover{background:color-mix(in srgb,var(--accent) 12%,transparent)}
.copy:active{transform:translateY(1px)}
.copy.done{background:var(--accent);color:#fff}
.copy svg{width:15px;height:15px}
.content{font-size:14.5px;white-space:pre-wrap;word-break:break-word}
.content.title-txt{font-weight:600;font-size:16px}.content.meta-txt{color:var(--muted)}
.content.mini-txt{background:var(--chip);border-radius:10px;padding:12px 14px;font-size:13.5px}
.guion-wrap{position:relative;max-height:200px;overflow:hidden}
.guion-wrap.open{max-height:none}
.guion-wrap:not(.open)::after{content:"";position:absolute;left:0;right:0;bottom:0;height:60px;background:linear-gradient(transparent,var(--panel))}
.guion-txt{font-size:14px;line-height:1.7;white-space:pre-wrap}
.expand{margin-top:10px;background:var(--chip);border:none;color:var(--ink);font:inherit;font-size:13px;font-weight:600;padding:8px 14px;border-radius:9px;cursor:pointer;width:100%}
.foot{margin-top:36px;text-align:center;color:var(--muted);font-size:12.5px}
</style>
<div class="wrap">
  <div class="kicker">Producción de videos · 3 canales</div>
  <h1>Guiones para copiar</h1>
  <p class="sub">Cada video con botones de <strong>Copiar</strong>: guión, título, descripción, comentario fijado y el <strong>prompt de la miniatura</strong> (pegalo en ChatGPT junto con la foto del avatar).</p>
  <div id="app"></div>
  <p class="foot">Elena → <code>qr_guia</code> · Juan → <code>qr_guia_jt</code> · Attic → <code>qr_attic</code></p>
</div>
<script id="data" type="application/json">${DATA.replace(/</g, "\\u003c")}</script>
<script>
const V=JSON.parse(document.getElementById("data").textContent);
const esc=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const IC='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
const store={};let uid=0;
function blk(label,text,cls){const id="t"+(uid++);store[id]=text;return \`<div class="block"><div class="block-head"><span class="label">\${label}</span><button class="copy" data-id="\${id}">\${IC}<span>Copiar</span></button></div><div class="content \${cls}">\${esc(text)}</div></div>\`;}
function gblk(text){const id="t"+(uid++);store[id]=text;const wc=text.trim().split(/\\s+/).length;return \`<div class="block"><div class="block-head"><span class="label">Guión · <span class="wc">\${wc} palabras</span></span><button class="copy" data-id="\${id}">\${IC}<span>Copiar guión</span></button></div><div class="guion-wrap"><div class="guion-txt">\${esc(text)}</div></div><button class="expand">Ver guión completo ▾</button></div>\`;}
document.getElementById("app").innerHTML=V.map(v=>\`<section class="card" style="--accent:\${v.accent}"><div class="card-head"><span class="emoji">\${v.emoji}</span><div class="meta"><h2>\${esc(v.titulo.split(":")[0])}</h2><div class="tags">\${v.tema} · \${v.temaTag}</div></div><span class="dur">\${v.dur}</span></div>\${gblk(v.guion)}\${blk("Título",v.titulo,"title-txt")}\${blk("Descripción",v.desc,"meta-txt")}\${blk("Comentario fijado",v.comentario,"meta-txt")}\${blk("🖼️ Miniatura — prompt (+ foto del avatar)",v.mini,"mini-txt")}</section>\`).join("");
document.addEventListener("click",async e=>{const b=e.target.closest(".copy");if(b){const t=store[b.dataset.id];try{await navigator.clipboard.writeText(t);}catch(_){const a=document.createElement("textarea");a.value=t;document.body.appendChild(a);a.select();document.execCommand("copy");a.remove();}const sp=b.querySelector("span"),o=sp.textContent;b.classList.add("done");sp.textContent="¡Copiado!";setTimeout(()=>{b.classList.remove("done");sp.textContent=o;},1600);return;}const x=e.target.closest(".expand");if(x){const w=x.previousElementSibling;const op=w.classList.toggle("open");x.textContent=op?"Ocultar guión ▴":"Ver guión completo ▾";}});
</script>`;
fs.writeFileSync(OUT_HTML, html);
console.log("HTML:", (Buffer.byteLength(html) / 1e6).toFixed(2), "MB ·", videos.length, "videos con prompt de miniatura");
