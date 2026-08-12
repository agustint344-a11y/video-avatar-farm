/**
 * FASE 7 — BUILD "colageno-articulaciones-elena" (Dra. Elena Vidal) — colágeno para articulaciones.
 * DENSO + COMPONENTES ESTRELLA (kit4): Medidor, AntesDespues, Timeline. Tema CLINIC.
 *   node scripts/build_colageno.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "colageno-articulaciones-elena";
const FPS = 30;
const T = "clinic";
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", `captions_${SLUG}.json`), "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
const cn = caps.map((w) => norm(w.text));
const at = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let i = 0; i + N <= cn.length; i++) { let ok = 1; for (let j = 0; j < N; j++) if (cn[i + j] !== t[j]) { ok = 0; break; } if (ok) return Math.round(caps[i].startMs / 1000 * FPS); } return null; };
const sec = (n) => Math.round(n * FPS);
const durationInFrames = Math.round(caps[caps.length - 1].endMs / 1000 * FPS) + sec(1);

const compBeats = [
  ["asi que quedate hasta el final", 6.5, "Checklist", { theme: T, title: "Lo que vas a ver hoy", items: ["Qué material perdemos con los años", "El alimento que lo repone", "El error que hace que no funcione"] }],
  ["bastante menos de la mitad", 6, "Medidor", { value: 50, max: 100, suffix: "%", eyebrow: "Dato clave", label: "del colágeno de joven (a los 60)" }],
  ["el que hace el trabajo es tu cuerpo", 6, "PullQuote", { theme: T, quote: "La gelatina no es cartílago que se pega a tu rodilla: le da a tu cuerpo los ladrillos para que él mismo lo repare." }],
  ["habia vuelto a caminar hasta la plaza", 6, "AntesDespues", { before: "img/colageno_antes.jpg", after: "img/colageno_despues.jpg", beforeLabel: "ANTES", afterLabel: "DESPUÉS", eyebrow: "El caso de doña Rosa", title: "De no salir de casa… a la plaza" }],
  ["cuando juntas las 4 cosas", 7.5, "Checklist", { theme: T, title: "Las 4 piezas que sí funcionan", items: ["Colágeno (los ladrillos)", "Vitamina C (el cemento)", "Movimiento (lleva la comida al cartílago)", "Comida antiinflamatoria (no destruir lo repuesto)"] }],
  ["las cremas de colageno reparan", 7, "MythVsTruth", { theme: T, myth: "Las cremas de colágeno reparan las articulaciones.", truth: "Falso. La molécula es muy grande para atravesar la piel. Para las articulaciones, el colágeno se COME, no se unta." }],
  ["con comer colageno una vez por semana", 7, "MythVsTruth", { theme: T, myth: "Con comerlo una vez por semana alcanza.", truth: "Falso. Tu cuerpo repara todos los días: necesita los ladrillos de forma regular. Un poco cada día rinde más que un atracón." }],
  ["si comes esto en un dia caminas", 7, "MythVsTruth", { theme: T, myth: "Comés esto y en un día caminás como a los 20.", truth: "Falso, y es la promesa que más lastima. Alivio de la rigidez relativamente pronto; la reconstrucción, en semanas y meses." }],
  ["solo sirve el colageno caro en polvo", 7, "MythVsTruth", { theme: T, myth: "Solo sirve el colágeno caro en polvo.", truth: "Falso. La gelatina natural y el caldo de huesos casero son fuentes excelentes y baratísimas. Tu bolsillo y tus rodillas, contentos." }],
  ["paso 1 elegi tu fuente de colageno", 8, "Steps", { theme: T, eyebrow: "Manos a la obra", title: "El plan, en pasos", steps: [{ title: "Elegí tu fuente", sub: "gelatina sin sabor o caldo de huesos" }, { title: "Sumale vitamina C", sub: "cítricos, kiwi, frutillas: el cemento" }, { title: "Movete cada día", sub: "lleva el alimento a la articulación" }, { title: "Bajá la inflamación", sub: "menos azúcar, más comida real" }] }],
  ["en los primeros dias con el colageno", 8, "Timeline", { theme: T, eyebrow: "Qué esperar", title: "Tus articulaciones, con el tiempo", steps: [{ when: "Primeros días", text: "menos rigidez al levantarte" }, { when: "Semanas", text: "más comodidad al moverte" }, { when: "Meses", text: "caminar con menos dolor" }] }],
  ["nos hicieron creer que perder movilidad", 7, "PullQuote", { theme: T, quote: "Nos hicieron creer que perder movilidad es 'hacerse viejo' y hay que aguantarlo. Es mentira: casi todo está en tus manos." }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["soy la doctora elena vidal", 5, "LowerThird", { theme: T, accentText: "SALUD ARTICULAR", title: "Dra. Elena Vidal", sub: "Moverte sin dolor, con evidencia" }],
  ["una especie de almohadilla resbaladiza", 3.6, "KeywordPop", { theme: T, word: "CARTÍLAGO", sub: "el amortiguador de tus articulaciones", pos: "center" }],
  ["una proteina que se llama colageno", 3.6, "KeywordPop", { theme: T, word: "COLÁGENO", sub: "el andamio que sostiene tu cuerpo", pos: "bottom" }],
  ["perdemos alrededor de un 1", 4.5, "StatChip", { theme: T, value: 1, prefix: "-", suffix: "% año", label: "de colágeno tras los 40" }],
  ["de la gelatina natural sin sabor", 5, "LowerThird", { theme: T, accentText: "EL ALIMENTO", title: "Colágeno natural", sub: "gelatina sin sabor + caldo de huesos" }],
  ["articulaciones mas nutridas y menos rigidas", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 1", title: "Articulaciones nutridas", sub: "menos rígidas, más cómodas" }],
  ["sobre la rigidez de la manana", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 2", title: "Menos rigidez de mañana", sub: "a veces se nota más rápido" }],
  ["la piel el pelo y las unas", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 3", title: "Piel, pelo y uñas", sub: "el mismo material, varias cosas" }],
  ["un cuarto beneficio mas silencioso", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 4", title: "Huesos más fuertes", sub: "la parte flexible del hueso es colágeno" }],
  ["a mi consultorio una mujer", 5, "LowerThird", { theme: T, accentText: "CASO REAL", title: "Doña Rosa, 67 años", sub: "rodillas con dolor, sin promesas mágicas" }],
  ["y aca llegamos a lo mas importante", 4, "SectionTitle", { eyebrow: "NO TE LO SALTEES", title: "El error que arruina todo" }],
  ["la vitamina c tu cuerpo no puede", 3.6, "KeywordPop", { theme: T, word: "VITAMINA C", sub: "sin ella no se arma el colágeno", pos: "center" }],
  ["se alimenta del liquido que lo rodea", 3.6, "KeywordPop", { theme: T, word: "EL MOVIMIENTO", sub: "lleva el alimento al cartílago", pos: "center" }],
  ["vamos a la parte que mas me importa", 4, "SectionTitle", { eyebrow: "ATENCIÓN", title: "Advertencias importantes" }],
  ["si la articulacion esta caliente", 5.5, "Callout", { theme: T, icon: "🚑", title: "Roja, caliente, hinchada o con fiebre", sub: "eso es médico, no gelatina: consultá", tone: "warn" }],
  ["si tenes una enfermedad renal", 5, "Callout", { theme: T, icon: "🩺", title: "Enfermedad renal: no subas proteínas solo", sub: "la cantidad la decide tu médico", tone: "warn" }],
  ["cuidado con las fuentes y con las alergias", 5, "Callout", { theme: T, icon: "⚠️", title: "Ojo con la fuente, alergias y azúcar", sub: "pescado o vaca; el polvo, sin azúcar", tone: "warn" }],
  ["cualquiera incluida una miniatura", 5, "Callout", { theme: T, icon: "🚫", title: "Nada de '20 años en 1 día'", sub: "se construye con constancia, no con magia", tone: "info" }],
  ["sumale vitamina c", 3.4, "KeywordPop", { theme: T, word: "SIEMPRE CON VITAMINA C", sub: "cítricos, kiwi, frutillas", pos: "center" }],
  ["no te olvides de que te deje", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía para tus articulaciones", items: ["Cantidades de colágeno exactas", "Recetas de caldo y gelatina", "Rutina de movimiento paso a paso"] }],
];
const overlays = [];
const ovMiss = [];
for (const [a, d, comp, props] of ovBeats) { const from = at(a); if (from == null) { ovMiss.push(a); continue; } if (inComp(from)) { ovMiss.push(`${a} (comp)`); continue; } overlays.push({ from, dur: sec(d), comp, props }); }
overlays.sort((x, y) => x.from - y.from);

const IMGMAP = JSON.parse(fs.existsSync(path.join(ROOT, "_v3", `${SLUG}_imgmap.json`)) ? fs.readFileSync(path.join(ROOT, "_v3", `${SLUG}_imgmap.json`), "utf8").replace(/^﻿/, "") : "{}");
const DROP = new Set((() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, "_v3", `${SLUG}_drop.json`), "utf8")); } catch { return []; } })());
const stock = [];
try { stock.push(...JSON.parse(fs.readFileSync(path.join(ROOT, "_v3", `${SLUG}_needstock.json`), "utf8").replace(/^﻿/, ""))); } catch {}
const CAP_VID = sec(25), CAP_IMG = sec(10), MIN = sec(1.8);
const cands = [];
for (const it of stock) { if (DROP.has(it.name)) continue; const from = at(it.anchor); if (from == null) continue; const imgFile = IMGMAP[it.name]; if (imgFile && fs.existsSync(path.join(ROOT, "public", "img", imgFile))) cands.push({ from, name: it.name, kind: "image", src: `img/${imgFile}`, cap: CAP_IMG }); else { const vid = path.join(ROOT, "public", "broll", `${SLUG}_${it.name}.mp4`); if (fs.existsSync(vid)) cands.push({ from, name: it.name, kind: "video", src: `broll/${SLUG}_${it.name}.mp4`, cap: CAP_VID }); } }
cands.sort((a, b) => a.from - b.from);
const uniq = []; for (const c of cands) if (!uniq.length || c.from - uniq[uniq.length - 1].from > sec(0.5)) uniq.push(c);
const broll = []; const brollMiss = [];
for (let i = 0; i < uniq.length; i++) { const c = uniq[i]; if (inComp(c.from)) { brollMiss.push(`${c.name}(comp)`); continue; } const nextB = i + 1 < uniq.length ? uniq[i + 1].from : Infinity; const dur = Math.min(c.cap, nextB - c.from, nextCompStart(c.from) - c.from); if (dur < MIN) { brollMiss.push(`${c.name}(sliver)`); continue; } broll.push({ from: c.from, dur, kind: c.kind, src: c.src }); }

const cues = { slug: SLUG, fps: FPS, width: 1920, height: 1080, durationInFrames, broll, overlays, components };
fs.writeFileSync(path.join(ROOT, "src", "VideoEdit", "data", `cues_${SLUG}.json`), JSON.stringify(cues, null, 2));
const bf = broll.reduce((s, b) => s + b.dur, 0);
const total = components.length + overlays.length + broll.length;
console.log(`✓ componentes ${components.length}/${compBeats.length}${compMiss.length ? " MISS: " + compMiss.join(" | ") : ""}`);
console.log(`✓ overlays ${overlays.length}/${ovBeats.length}${ovMiss.length ? " MISS: " + ovMiss.join(" | ") : ""}`);
console.log(`✓ b-roll ${broll.length} ~${Math.round(bf / FPS)}s = ${Math.round(bf / durationInFrames * 100)}% (PiP)${brollMiss.length ? " · " + brollMiss.join(", ") : ""}`);
console.log(`✓ TOTAL ${total} beats · ${components.length + overlays.length} comp/ov en ${(durationInFrames / FPS / 60).toFixed(1)} min → 1 cada ${(durationInFrames / FPS / total).toFixed(0)}s`);
