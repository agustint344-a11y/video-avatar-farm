/**
 * BUILD "ricino-elena" (Dra. Elena Vidal) — aceite de ricino en el rostro. CLINIC. QR x6. Pool 48.
 * Flujo Fish + InfiniteTalk: audio master (mp3) + avatar SOLO en tramos on-camera (muteado, trimBefore).
 *   node scripts/build_colageno70.mjs
 * Salidas: src/VideoEdit/data/cues_ricino-elena.json  +  _v3/ricino-elena_avatarcuts.json
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "ricino-elena";
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
  ["hay un aceite viejo", "o con puntitos blancos"],                // hook
  ["soy la doctora elena vidal", "cremas carisimas"],              // presentación + retención
  ["antes de contarte la forma correcta", "el primer enlace de la descripcion"], // CTA1
  ["vino a verme una paciente", "lo que cambio fue el como"],       // caso Beatriz
  ["si este video te sirvio", "te espero en el proximo video"],     // cierre
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
  ["ese acido tiene tres superpoderes", 8.5, "Checklist", { theme: T, title: "3 poderes del ácido ricinoleico", items: ["Humecta y SELLA el agua en la piel", "Antiinflamatorio: calma rojeces", "Nutre pestañas, cejas y cicatrices", "Piel bien hidratada = efecto tensor"] }],
  ["si un poquito hidrata cuanto mas", 8, "MythVsTruth", { theme: T, myth: "Cuanto más ricino me ponga, mejor.", truth: "Al revés: más cantidad no es más resultado, es más riesgo de tapar los poros y que salga milia. Con el ricino, menos es más." }],
  ["menos es mas", 8.5, "Steps", { theme: T, eyebrow: "La forma correcta", title: "Las 3 reglas de oro", steps: [{ title: "Poco: 2-3 gotitas para toda la cara", sub: "más NO es mejor" }, { title: "Diluido en jojoba, almendras o rosa mosqueta", sub: "casi nunca puro" }, { title: "De noche, piel limpia, masaje hacia arriba", sub: "5 minutos" }] }],
  ["que esperar con el tiempo", 8.5, "Steps", { theme: T, eyebrow: "Qué esperar", title: "Es progresivo, no mágico", steps: [{ title: "Día 1: piel más suave e hidratada", sub: "se nota enseguida" }, { title: "Semanas 2-3: más luminosa, líneas disimuladas", sub: "uso constante" }, { title: "Mes 1-3: pestañas y cejas más pobladas", sub: "el vello crece despacio" }] }],
  ["usar demasiado y usarlo puro", 8, "MythVsTruth", { theme: T, myth: "Cuanto más y más puro, más antiedad.", truth: "Mucho + puro + piel sin limpiar = poros tapados y milia. Poco + diluido + piel limpia = resultado. Grabátelo." }],
  ["muchas veces no necesitas la crema", 8, "PullQuote", { theme: T, quote: "La diferencia entre que te rejuvenezca la piel o te la arruine no está en el frasco: está en el cómo. Poquito, diluido, sobre piel limpia y con paciencia.", author: "Dra. Elena Vidal" }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } if (inAvatar(from)) { compMiss.push(`${a} (avatar)`); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);

// ---------- OVERLAYS (van ENCIMA; QR exento del choque con componentes) ----------
const ovBeats = [
  ["soy la doctora elena vidal", 5, "LowerThird", { theme: T, accentText: "SALUD CON EVIDENCIA", title: "Dra. Elena Vidal", sub: "ricino: la forma correcta" }],
  ["que se llama acido ricinoleico", 3.8, "KeywordPop", { theme: T, word: "ÁCIDO RICINOLEICO", sub: "el secreto del aceite de ricino", pos: "center" }],
  ["una palabra sobre tu tipo de piel", 5, "Callout", { theme: T, icon: "🧴", title: "Según tu piel", sub: "seca: ideal · mixta: solo mejillas · grasa/acné: cuidado con los poros", tone: "info" }],
  ["la piel mas firme y con lineas", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 1", title: "Piel más firme", sub: "líneas finas disimuladas" }],
  ["son las pestanas y las cejas", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 2", title: "Pestañas y cejas", sub: "más pobladas con constancia" }],
  ["el tercer beneficio son las ojeras", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 3", title: "Ojeras y contorno", sub: "menos cansancio, más descanso" }],
  ["manos unas y cuticulas", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 4", title: "Manos y uñas", sub: "cutículas sanas, uñas fuertes" }],
  ["nunca nunca te lo pongas dentro del ojo", 5.5, "Callout", { theme: T, icon: "⚠️", title: "Nunca dentro del ojo", sub: "cerca de pestañas con cuidado; adentro jamás", tone: "warn" }],
  ["por via oral es un laxante", 5.5, "Callout", { theme: T, icon: "⚠️", title: "Solo uso externo", sub: "el ricino por vía oral es un laxante fuerte: NO se toma", tone: "warn" }],
  ["antes de ponertelo en toda la cara", 5, "Callout", { theme: T, icon: "🧪", title: "Prueba de alergia", sub: "detrás de la oreja, esperá un día antes de la cara", tone: "warn" }],
  ["aparecen esos puntitos blancos", 3.8, "KeywordPop", { theme: T, word: "MILIA", sub: "puntitos blancos por usar de más y puro", pos: "center" }],
  ["todo el detalle con las proporciones", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi guía natural", items: ["Las proporciones exactas de la mezcla", "El aceite ideal según tu piel", "La rutina para cara, ojos y pestañas"] }],
  // ---- QR ×6: los 3 CTAs reales + 3 extras ----
  ["en los comentarios de este video", 7.5, "QRTag", { theme: T, corner: "bl", src: QR }],   // CTA1 (~5.2')
  ["la piel mas firme y con lineas", 7, "QRTag", { theme: T, corner: "bl", src: QR }],        // extra (beneficio)
  ["fijada en los comentarios", 7.5, "QRTag", { theme: T, corner: "bl", src: QR }],           // CTA2 (~8.5')
  ["consegui aceite de ricino", 7, "QRTag", { theme: T, corner: "bl", src: QR }],             // extra (pasos)
  ["la tenes en el primer enlace", 7, "QRTag", { theme: T, corner: "bl", src: QR }],          // extra (cierre)
  ["en los comentarios compartilo", 7.5, "QRTag", { theme: T, corner: "bl", src: QR }],       // CTA3 (~16.7')
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
