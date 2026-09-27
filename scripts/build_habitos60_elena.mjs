/**
 * BUILD "habitos60-elena" (Dra. Elena Vidal) — 8 cosas que dejar después de los 60. CLINIC. QR x6. Pool 48.
 * Flujo Fish + InfiniteTalk: audio master (mp3) + avatar SOLO en tramos on-camera (muteado, trimBefore).
 *   node scripts/build_colageno70.mjs
 * Salidas: src/VideoEdit/data/cues_habitos60-elena.json  +  _v3/habitos60-elena_avatarcuts.json
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "habitos60-elena";
const FPS = 30;
const T = "clinic";
const QR = "img/qr_guia.png";
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", `captions_${SLUG}.json`), "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
const cn = caps.map((w) => norm(w.text));
const at = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let i = 0; i + N <= cn.length; i++) { let ok = 1; for (let j = 0; j < N; j++) if (cn[i + j] !== t[j]) { ok = 0; break; } if (ok) return Math.round(caps[i].startMs / 1000 * FPS); } return null; };
const atEnd = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let i = 0; i + N <= cn.length; i++) { let ok = 1; for (let j = 0; j < N; j++) if (cn[i + j] !== t[j]) { ok = 0; break; } if (ok) return Math.round(caps[i + N - 1].endMs / 1000 * FPS); } return null; };
const sec = (n) => Math.round(n * FPS);
const durationInFrames = Math.round(caps[caps.length - 1].endMs / 1000 * FPS) + sec(1);

// ---------- AVATAR on-camera (minoría): [inicio, fin], cap por ventana ----------
const MAXWIN = sec(42);
const avatarBeats = [
  ["conocia a una paciente de", "de consultorio que mas envejecen"],       // hook
  ["soy la doctora elena vidal", "la mas importante de todas"],            // presentación + retención
  ["y antes de empezar con", "el primer enlace de la descripcion"],        // CTA1
  ["vino a verme una paciente", "volvi a tener ganas"],                     // caso Amanda
  ["si este video te sirvio", "te espero en el proximo video"],            // cierre
];
const avatarSegs = []; const avatarCuts = []; const avatarMiss = [];
let clip = 0;
for (const [aS, aE] of avatarBeats) {
  const from = at(aS); let end = atEnd(aE);
  if (from == null || end == null || end <= from) { avatarMiss.push(`${aS} → ${aE}`); continue; }
  let dur = end - from; if (dur > MAXWIN) dur = MAXWIN;
  avatarSegs.push({ from, dur, clip });
  avatarCuts.push({ startSec: +(from / FPS).toFixed(3), endSec: +((from + dur) / FPS).toFixed(3), durSec: +(dur / FPS).toFixed(3) });
  clip += dur;
}
const avatarRanges = avatarSegs.map((s) => [s.from, s.from + s.dur]);
const inAvatar = (f) => avatarRanges.some(([a, b]) => f >= a - sec(0.3) && f < b + sec(0.3));

// ---------- COMPONENTES full-screen (tapan avatar/b-roll) ----------
const compBeats = [
  ["los genes explican apenas una", 8.5, "MythVsTruth", { theme: T, myth: "Cómo envejecés depende de tus genes.", truth: "Los genes explican apenas una parte. La mayor parte la escriben tus hábitos de todos los días." }],
  ["comer poco no es cuidarse", 8.5, "Checklist", { theme: T, title: "Proteína en cada comida", items: ["Huevo", "Carnes magras y pescado", "Legumbres", "Lácteos"] }],
  ["horarios regulares nada de pantallas", 8, "Checklist", { theme: T, title: "Dormir mejor a cualquier edad", items: ["Horarios regulares", "Nada de pantallas en la cama", "Cena liviana y temprano", "Si no mejora: al médico"] }],
  ["hace una lista con todo", 8.5, "Steps", { theme: T, eyebrow: "Consejo que salva vidas", title: "Tu lista de remedios", steps: [{ title: "Anotá TODO lo que tomás", sub: "remedios, vitaminas, hierbas, suplementos" }, { title: "Con las dosis", sub: "cuánto y cuándo" }, { title: "Llevala a cada consulta", sub: "y a la farmacia" }] }],
  ["casi ninguna cuesta dinero", 8.5, "Checklist", { theme: T, title: "Las 8, casi todas gratis", items: ["Moverte y comer proteína", "Ver gente y dormir bien", "Ordenar remedios y controlarte", "Soltar rencores y seguir aprendiendo"] }],
  ["no las cambias todas de", 8.5, "Steps", { theme: T, eyebrow: "Cómo empezar", title: "Un escalón a la vez", steps: [{ title: "Elegí UNA esta semana", sub: "la más a tu alcance" }, { title: "Cuando sea costumbre, sumá otra", sub: "pequeños cambios sostenidos" }, { title: "En meses, otra persona", sub: "más energía y más ganas" }] }],
  ["es mas bien un jardin", 8, "PullQuote", { theme: T, quote: "Los años te los da el calendario; la vida dentro de esos años, te la das vos.", author: "Dra. Elena Vidal" }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } if (inAvatar(from)) { compMiss.push(`${a} (avatar)`); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);

// ---------- OVERLAYS (van ENCIMA; QR exento del choque con componentes) ----------
const ovBeats = [
  ["soy la doctora elena vidal", 5, "LowerThird", { theme: T, accentText: "SALUD CON EVIDENCIA", title: "Dra. Elena Vidal", sub: "8 cosas que dejar después de los 60" }],
  ["la numero 1", 5, "LowerThird", { theme: T, accentText: "HÁBITO 1", title: "Pasar el día sentada", sub: "el sedentarismo es veneno lento" }],
  ["el movimiento es sin exagerar", 3.8, "KeywordPop", { theme: T, word: "MOVIMIENTO", sub: "la pastilla antienvejecimiento, y gratis", pos: "center" }],
  ["la numero 2", 5, "LowerThird", { theme: T, accentText: "HÁBITO 2", title: "Comer \"livianito\"", sub: "después de los 60 necesitás MÁS proteína" }],
  ["la numero 3", 5, "LowerThird", { theme: T, accentText: "HÁBITO 3", title: "Aislarte", sub: "la soledad daña tanto como fumar" }],
  ["la soledad cronica inflama", 3.8, "KeywordPop", { theme: T, word: "COMPAÑÍA", sub: "el corazón también se alimenta", pos: "center" }],
  ["resignarte a dormir mal", 5, "LowerThird", { theme: T, accentText: "HÁBITO 4", title: "Resignarte a dormir mal", sub: "no es \"cosa de la edad\"" }],
  ["la numero 5", 5, "LowerThird", { theme: T, accentText: "HÁBITO 5", title: "Automedicarte", sub: "mezclar remedios sin control" }],
  ["la numero 6", 5, "LowerThird", { theme: T, accentText: "HÁBITO 6", title: "Faltar a tus controles", sub: "lo que se detecta a tiempo se trata mejor" }],
  ["la numero 7", 5, "LowerThird", { theme: T, accentText: "HÁBITO 7", title: "Cargar rencores y estrés", sub: "suben la presión y te inflaman" }],
  ["el rencor es como tomar", 5.5, "Callout", { theme: T, icon: "🕊️", title: "Soltar es salud", sub: "el rencor es tomar veneno esperando que se enferme el otro", tone: "info" }],
  ["y la numero 8", 5, "LowerThird", { theme: T, accentText: "HÁBITO 8 · LA MÁS IMPORTANTE", title: "Dejar de aprender", sub: "tu mente necesita un para qué" }],
  ["ikigai", 3.8, "KeywordPop", { theme: T, word: "IKIGAI", sub: "la razón para levantarte cada mañana", pos: "center" }],
  ["y ahora unas advertencias importantes", 5.5, "Callout", { theme: T, icon: "⚠️", title: "Con cabeza", sub: "de a poco; si hace mucho que no te movés o tenés corazón/presión → consultá", tone: "warn" }],
  ["la depresion en la vejez", 5.5, "Callout", { theme: T, icon: "⚠️", title: "La tristeza no es \"cosa de la edad\"", sub: "la depresión es común y se trata: contáselo a tu médico", tone: "warn" }],
  ["todo el detalle con el paso", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía natural", items: ["El paso a paso de los 8 hábitos", "Rutinas simples", "La alimentación que los acompaña"] }],
  // ---- QR ×6 ----
  ["en los comentarios de este video", 7.5, "QRTag", { theme: T, corner: "bl", src: QR }],   // CTA1 (~2.9')
  ["necesitas mas proteina", 7, "QRTag", { theme: T, corner: "bl", src: QR }],               // extra
  ["el miedo a saber es", 7, "QRTag", { theme: T, corner: "bl", src: QR }],                  // extra
  ["ikigai", 7, "QRTag", { theme: T, corner: "bl", src: QR }],                               // extra
  ["una caminata corta hoy", 7, "QRTag", { theme: T, corner: "bl", src: QR }],               // extra
  ["fijada en los comentarios", 7.5, "QRTag", { theme: T, corner: "bl", src: QR }],          // CTA final
];
const overlays = [];
const ovMiss = [];
for (const [a, d, comp, props] of ovBeats) { const from = at(a); if (from == null) { ovMiss.push(a); continue; } if (comp !== "QRTag" && inComp(from)) { ovMiss.push(`${a} (comp)`); continue; } overlays.push({ from, dur: sec(d), comp, props }); }
overlays.sort((x, y) => x.from - y.from);

// ---------- B-ROLL: tapizar todo lo que NO es avatar ni componente ----------
const pool = [];
for (let i = 1; i <= 48; i++) { const nm = `broll/${SLUG}_s_${String(i).padStart(2, "0")}.mp4`; if (fs.existsSync(path.join(ROOT, "public", nm))) pool.push(nm); }
const CLIP = sec(5.0), MINB = sec(1.6);
const blocked = [...avatarRanges, ...compRanges].sort((a, b) => a[0] - b[0]);
const merged = [];
for (const r of blocked) { if (merged.length && r[0] <= merged[merged.length - 1][1]) merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], r[1]); else merged.push([r[0], r[1]]); }
const free = []; let cur = 0;
for (const [a, b] of merged) { if (a > cur) free.push([cur, a]); cur = Math.max(cur, b); }
if (cur < durationInFrames) free.push([cur, durationInFrames]);
const broll = []; let pi = 0;
for (const [a, b] of free) {
  let f = a;
  while (b - f >= MINB) {
    let d = Math.min(CLIP, b - f);
    if ((b - f - d) > 0 && (b - f - d) < MINB) d = b - f;
    broll.push({ from: f, dur: d, kind: "video", src: pool[pi % pool.length], pip: false });
    pi++; f += d;
  }
}
broll.sort((x, y) => x.from - y.from);

const cues = { slug: SLUG, fps: FPS, width: 1920, height: 1080, durationInFrames, audioSrc: `${SLUG}.mp3`, avatarSrc: `${SLUG}_avatar.mp4`, avatarSegs, broll, overlays, components };
fs.writeFileSync(path.join(ROOT, "src", "VideoEdit", "data", `cues_${SLUG}.json`), JSON.stringify(cues, null, 2));
fs.mkdirSync(path.join(ROOT, "_v3"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "_v3", `${SLUG}_avatarcuts.json`), JSON.stringify(avatarCuts, null, 2));
const bf = broll.reduce((s, b) => s + b.dur, 0);
const qr = overlays.filter((o) => o.comp === "QRTag").length;
const avf = avatarSegs.reduce((s, a) => s + a.dur, 0);
console.log(`✓ avatar ${avatarSegs.length}/${avatarBeats.length} segs ~${Math.round(avf / FPS)}s (clip usa ${Math.round(clip / FPS)}s de 268s)${avatarMiss.length ? " MISS: " + avatarMiss.join(" | ") : ""}`);
console.log(`✓ componentes ${components.length}/${compBeats.length}${compMiss.length ? " MISS: " + compMiss.join(" | ") : ""}`);
console.log(`✓ overlays ${overlays.length}/${ovBeats.length} (QR ${qr})${ovMiss.length ? " MISS: " + ovMiss.join(" | ") : ""}`);
console.log(`✓ b-roll ${broll.length} ~${Math.round(bf / FPS)}s = ${Math.round(bf / durationInFrames * 100)}%`);
console.log(`✓ TOTAL ${components.length + overlays.length + broll.length + avatarSegs.length} beats · ${(durationInFrames / FPS / 60).toFixed(1)} min`);
