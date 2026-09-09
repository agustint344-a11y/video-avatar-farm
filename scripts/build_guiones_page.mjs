import fs from "node:fs";
const G = "C:/Users/Teje/Desktop/CLAUDE/video-avatar-farm/guiones/";
const read = (f) => fs.readFileSync(G + f, "utf8").trim();

const videos = [
  {
    key: "canela", emoji: "🌿", accent: "#0d9488", accent2: "#5eead4",
    tema: "Dra. Elena Vidal", temaTag: "Salud · turquesa", dur: "≈ 18 min",
    titulo: "CANELA: la que tenés en casa NO es la que conviene (el secreto Ceylán vs Cassia)",
    desc: `La canela tiene efectos reales sobre el azúcar en sangre... pero casi nadie sabe que hay DOS tipos, y que la común (Cassia) tiene cumarina, que en exceso puede dañar el hígado. En este video te explico, con evidencia y sin exagerar, para qué sirve de verdad (azúcar, antioxidante, antiinflamatorio), cómo distinguir la canela de Ceylán de la Cassia, la cantidad segura, los mitos peligrosos (que "cura la diabetes" o "adelgaza") y las advertencias serias (anticoagulantes, hígado, diabetes con medicación).

👉 Mi guía "El Método Bienestar Natural" está en el comentario fijado y en el primer enlace de la descripción.

⚠️ Contenido informativo y educativo, no reemplaza la consulta con tu médico. Parte de la producción usa IA.`,
    comentario: `📘 Te dejé mi guía "El Método Bienestar Natural" acá 👇
https://guia-bienestar-natural-oficial.vercel.app/?utm_source=youtube&utm_medium=comment#oferta

Y acordate: si la tomás a diario, elegí canela de CEYLÁN (la verdadera). La común (Cassia) tiene cumarina, ojo con el exceso. Poco y bien 🌿`,
    guion: read("canela-elena_guion.txt"),
  },
  {
    key: "eucalipto", emoji: "🍃", accent: "#b45309", accent2: "#fbbf24",
    tema: "Dr. Juan Tombo", temaTag: "Remedios caseros · tierra", dur: "≈ 18 min",
    titulo: "EUCALIPTO para la congestión: SÍ funciona, pero esto que hacen muchos es PELIGROSO",
    desc: `El eucalipto es un gran aliado para destapar la nariz y el pecho... pero muchos lo usan mal, y con los niños puede ser peligroso. El Dr. Juan Tomás te explica, con criterio médico, para qué sirve de verdad (congestión, tos, vías respiratorias), cómo hacer una vaporización segura paso a paso, y sobre todo qué NUNCA hacer: nunca tomar el aceite esencial, muchísimo cuidado con bebés y asmáticos.

👉 La guía "El Método Bienestar Natural" está en el comentario fijado y en el primer enlace de la descripción.

⚠️ Contenido informativo y educativo, no reemplaza la consulta con tu médico. Parte de la producción usa IA.`,
    comentario: `📘 Te dejé la guía "El Método Bienestar Natural" acá 👇
https://guia-bienestar-natural-git-ve-312784-agustins-projects-da4b6a55.vercel.app/#oferta

⚠️ IMPORTANTE: el aceite de eucalipto NUNCA se toma (es tóxico), y muchísimo cuidado con bebés y niños chiquitos. Se respira en vapor o se usa sobre la piel diluido 🍃`,
    guion: read("eucalipto-juantombo_guion.txt"),
  },
  {
    key: "watches", emoji: "⌚", accent: "#a16207", accent2: "#e0b34d",
    tema: "Attic Fortune", temaTag: "Inglés · Walt Hargrove", dur: "≈ 14 min",
    titulo: "10 Old Watches in Your Drawer Worth a FORTUNE! (Here's How to Spot Them)",
    desc: `That old watch in your sock drawer could be worth hundreds — even thousands — to the right collector. Veteran appraiser Walt Hargrove walks you through 10 vintage watches hiding in American homes, from railroad pocket watches and military field watches to the forgotten name-brand wristwatch granddad left in a drawer. Learn how to spot the treasures, why the movement inside changes everything, and the #1 mistake that costs people a fortune.

👉 Get the full guide (brands, models & current values) in the pinned comment and the first link below.

Before you toss it, check its worth.`,
    comentario: `📘 Get my full Attic Fortune guide here 👇
https://attic-fortune.vercel.app

Tell me: what old watches have you got tucked away? ⌚ And remember — mechanical beats battery, and NEVER polish it or toss it just because it stopped ticking!`,
    guion: read("watches-atticfortune_guion.txt"),
  },
];

const words = (s) => s.trim().split(/\s+/).length;
const DATA = JSON.stringify(videos);

const html = `<title>Guiones para copiar</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap">
<style>
:root{
  --bg:#f4f2ee; --panel:#ffffff; --ink:#1c1a17; --muted:#6b655c; --line:#e4dfd6;
  --chip:#efece6; --shadow:0 1px 2px rgba(0,0,0,.04),0 8px 24px rgba(0,0,0,.06);
  --radius:16px;
}
:root:not([data-theme="light"]){ }
@media (prefers-color-scheme:dark){
  :root:not([data-theme="light"]){
    --bg:#17150f; --panel:#211e17; --ink:#f3efe6; --muted:#a49c8c; --line:#332e24;
    --chip:#2b271e; --shadow:0 1px 2px rgba(0,0,0,.3),0 10px 30px rgba(0,0,0,.4);
  }
}
:root[data-theme="dark"]{
  --bg:#17150f; --panel:#211e17; --ink:#f3efe6; --muted:#a49c8c; --line:#332e24;
  --chip:#2b271e; --shadow:0 1px 2px rgba(0,0,0,.3),0 10px 30px rgba(0,0,0,.4);
}
*{box-sizing:border-box}
body{background:var(--bg);color:var(--ink);font-family:Inter,system-ui,sans-serif;line-height:1.6;
  -webkit-font-smoothing:antialiased;padding:32px 20px 80px}
.wrap{max-width:900px;margin:0 auto}
header.top{margin:8px 0 28px}
.kicker{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);font-weight:600}
h1{font-family:Fraunces,Georgia,serif;font-weight:600;font-size:clamp(28px,5vw,42px);margin:.15em 0 .1em;
  letter-spacing:-.01em;text-wrap:balance}
.sub{color:var(--muted);max-width:60ch}
.card{background:var(--panel);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow);
  margin-top:22px;overflow:hidden}
.card-head{display:flex;align-items:center;gap:14px;padding:18px 20px;border-bottom:1px solid var(--line);
  border-left:5px solid var(--accent)}
.emoji{font-size:26px;line-height:1}
.card-head .meta{flex:1;min-width:0}
.card-head h2{font-family:Fraunces,Georgia,serif;font-weight:600;font-size:20px;margin:0;color:var(--accent-ink)}
.card-head .tags{font-size:12.5px;color:var(--muted);margin-top:2px}
.dur{font-size:12px;font-weight:600;color:var(--accent-ink);background:var(--accent-soft);
  padding:5px 10px;border-radius:999px;white-space:nowrap}
.block{padding:16px 20px;border-top:1px solid var(--line)}
.block:first-of-type{border-top:none}
.block-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px}
.label{font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:var(--muted);font-weight:600}
.copy{border:1px solid var(--accent);color:var(--accent-ink);background:transparent;font:inherit;font-size:13px;
  font-weight:600;padding:7px 14px;border-radius:9px;cursor:pointer;display:inline-flex;align-items:center;gap:7px;
  transition:background .12s,color .12s,transform .08s}
.copy:hover{background:var(--accent-soft)}
.copy:active{transform:translateY(1px)}
.copy.done{background:var(--accent);color:#fff;border-color:var(--accent)}
.copy svg{width:15px;height:15px}
.content{font-size:14.5px;color:var(--ink);white-space:pre-wrap;word-break:break-word}
.content.title-txt{font-weight:600;font-size:16px}
.content.meta-txt{color:var(--muted)}
.guion-wrap{position:relative;max-height:210px;overflow:hidden;transition:max-height .25s ease}
.guion-wrap.open{max-height:none}
.guion-wrap:not(.open)::after{content:"";position:absolute;left:0;right:0;bottom:0;height:64px;
  background:linear-gradient(transparent,var(--panel))}
.guion-txt{font-size:14px;line-height:1.7;white-space:pre-wrap}
.expand{margin-top:10px;background:var(--chip);border:none;color:var(--ink);font:inherit;font-size:13px;
  font-weight:600;padding:8px 14px;border-radius:9px;cursor:pointer;width:100%}
.wc{font-size:11.5px;color:var(--muted);font-weight:500}
.foot{margin-top:36px;text-align:center;color:var(--muted);font-size:12.5px}
@media (max-width:560px){.card-head{flex-wrap:wrap}.block{padding:14px 16px}}
</style>

<div class="wrap">
  <header class="top">
    <div class="kicker">Producción de videos · 3 canales</div>
    <h1>Guiones para copiar</h1>
    <p class="sub">Tocá <strong>Copiar</strong> en cada bloque para llevarte el texto tal cual: guión completo, título, descripción y comentario fijado de cada video.</p>
  </header>
  <div id="app"></div>
  <p class="foot">Elena → <code>qr_guia</code> · Juan → <code>qr_guia_jt</code> · Attic → <code>qr_attic</code></p>
</div>

<script id="data" type="application/json">${DATA.replace(/</g, "\\u003c")}</script>
<script>
const VIDEOS = JSON.parse(document.getElementById("data").textContent);
const esc = (s) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const COPY_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
const store = {};
let uid = 0;
function block(label, text, cls, wc){
  const id = "t"+(uid++);
  store[id] = text;
  return \`<div class="block">
    <div class="block-head"><span class="label">\${label}\${wc?\` · <span class="wc">\${wc} palabras</span>\`:""}</span>
    <button class="copy" data-id="\${id}">\${COPY_ICON}<span>Copiar</span></button></div>
    <div class="content \${cls}">\${esc(text)}</div></div>\`;
}
function guionBlock(text){
  const id = "t"+(uid++); store[id]=text;
  const wc = text.trim().split(/\\s+/).length;
  return \`<div class="block">
    <div class="block-head"><span class="label">Guión · <span class="wc">\${wc} palabras</span></span>
    <button class="copy" data-id="\${id}">\${COPY_ICON}<span>Copiar guión</span></button></div>
    <div class="guion-wrap"><div class="guion-txt">\${esc(text)}</div></div>
    <button class="expand">Ver guión completo ▾</button></div>\`;
}
document.getElementById("app").innerHTML = VIDEOS.map(v => \`
  <section class="card" style="--accent:\${v.accent};--accent2:\${v.accent2};--accent-ink:\${v.accent};--accent-soft:\${v.accent}22">
    <div class="card-head">
      <span class="emoji">\${v.emoji}</span>
      <div class="meta"><h2>\${esc(v.titulo.split(":")[0])}</h2><div class="tags">\${v.tema} · \${v.temaTag}</div></div>
      <span class="dur">\${v.dur}</span>
    </div>
    \${guionBlock(v.guion)}
    \${block("Título", v.titulo, "title-txt")}
    \${block("Descripción", v.desc, "meta-txt")}
    \${block("Comentario fijado", v.comentario, "meta-txt")}
  </section>\`).join("");

document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".copy");
  if (btn){
    const txt = store[btn.dataset.id];
    try{ await navigator.clipboard.writeText(txt); }
    catch(_){ const ta=document.createElement("textarea");ta.value=txt;document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove(); }
    const span = btn.querySelector("span"); const orig = span.textContent;
    btn.classList.add("done"); span.textContent = "¡Copiado!";
    setTimeout(()=>{ btn.classList.remove("done"); span.textContent = orig; }, 1600);
    return;
  }
  const ex = e.target.closest(".expand");
  if (ex){
    const wrap = ex.previousElementSibling;
    const open = wrap.classList.toggle("open");
    ex.textContent = open ? "Ocultar guión ▴" : "Ver guión completo ▾";
  }
});
</script>`;

fs.writeFileSync("C:/Users/Teje/AppData/Local/Temp/claude/C--Users-Teje-Desktop-CLAUDE/77868391-a22a-4c40-a359-e543a9539669/scratchpad/guiones_copiar.html", html);
console.log("HTML escrito. Palabras:", videos.map(v=>v.key+"="+words(v.guion)).join(" "));
