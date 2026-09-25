/**
 * BUILD "nonna-pasta" (La Nonna Cocina · video #1: 7 errores de la pasta). Tema EARTH.
 * Audio master = Fish (voz nonna). Avatar = on-cam concatenado cortado DEL MISMO master (lip-sync exacto).
 * B-roll = imágenes Agnes por sección (_v3/nonna-pasta_plan.json) con Ken Burns variado.
 *   node scripts/build_nonna_pasta.mjs
 * Salidas: src/VideoEdit/data/cues_nonna-pasta.json + _v3/nonna-pasta_avatarcuts.json
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "nonna-pasta";
const FPS = 30;
const T = "earth";
const QR = "img/qr_nonna.png";
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", `captions_${SLUG}.json`), "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
// captions por palabra (whisper puede pegar signos o partir palabras): aplanar a tokens
const toks = []; caps.forEach((w, i) => norm(w.text).split(" ").filter(Boolean).forEach((t) => toks.push({ t, i })));
const find = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let k = 0; k + N <= toks.length; k++) { let ok = 1; for (let j = 0; j < N; j++) if (toks[k + j].t !== t[j]) { ok = 0; break; } if (ok) return [toks[k].i, toks[k + N - 1].i]; } return null; };
const at = (p) => { const r = find(p); return r ? Math.round(caps[r[0]].startMs / 1000 * FPS) : null; };
const atEnd = (p) => { const r = find(p); return r ? Math.round(caps[r[1]].endMs / 1000 * FPS) : null; };
const sec = (n) => Math.round(n * FPS);
const durationInFrames = Math.round(caps[caps.length - 1].endMs / 1000 * FPS) + sec(1.5);

// ---------- AVATAR on-camera (minoría ~25%) ----------
const MAXWIN = sec(40);
const avatarBeats = [
  ["pon la olla mas grande", "empezaste a cocinarla mal"],               // hook
  ["hoy te las cuento todas", "me preguntan mis nietos"],                 // promesa
  ["y no te sientas mal eh", "que es otra cosa"],                         // empatía
  ["esto lo hacen muchisima gente", "y no es verdad"],                   // error 3 reacción
  ["la pasta no se enjuaga", "llave del agua"],                           // error 7 regla
  ["y aqui te quiero contar algo", "se equivoca casi todo el mundo"],     // CTA1
  ["el error numero cinco es", "es el tiempo"],                           // el más importante
  ["esto lo veo y me duele", "no se le pega nada"],                       // error 7
  ["esa es la leccion que me", "no tira nada"],                           // lección
  ["si quieres todo esto escrito", "es tuyo tambien"],                    // CTA3
  ["y cuentame en los comentarios", "__END__"],                            // cierre
];
const avatarSegs = []; const avatarCuts = []; const avatarMiss = [];
let clip = 0;
for (const [aS, aE] of avatarBeats) {
  const from = at(aS); let end = aE === "__END__" ? durationInFrames - sec(0.5) : atEnd(aE);
  if (from == null || end == null || end <= from) { avatarMiss.push(`${aS} → ${aE}`); continue; }
  end = Math.min(end + sec(0.25), durationInFrames);
  let dur = Math.min(end - from, MAXWIN);
  if (dur < sec(2)) { avatarMiss.push(`${aS} (corto)`); continue; }
  avatarSegs.push({ from, dur, clip });
  avatarCuts.push({ startSec: +(from / FPS).toFixed(3), endSec: +((from + dur) / FPS).toFixed(3), durSec: +(dur / FPS).toFixed(3) });
  clip += dur;
}
const avatarRanges = avatarSegs.map((s) => [s.from, s.from + s.dur]);
const inAvatar = (f) => avatarRanges.some(([a, b]) => f >= a - sec(0.3) && f < b + sec(0.3));

// ---------- COMPONENTES full-screen ----------
const compBeats = [
  ["la regla de mi mama era", 7, "BigStat", { theme: T, eyebrow: "La regla de mi mamma", value: 1, suffix: " litro", support: "de agua por cada 100 g de pasta · medio kilo = 5 litros" }],
  ["parece mucho ya se", 7, "Compare", { theme: T, title: "El tamaño de la olla", left: { label: "Olla chica", sub: "el agua deja de hervir · la pasta se pega" }, right: { label: "Olla grande", sub: "sigue hirviendo · la pasta sale suelta" } }],
  ["ahora si tu salsa ya", 7, "Checklist", { theme: T, title: "Echa menos sal si la salsa lleva…", items: ["Aceitunas", "Alcaparras", "Anchoas", "Queso fuerte"] }],
  ["como se meten enteros en", 8, "Steps", { theme: T, eyebrow: "Sin partir nada", title: "Espaguetis enteros", steps: [{ title: "Agárralos con la mano", sub: "el manojo entero" }, { title: "Ponlos parados en el agua hirviendo", sub: "y suéltalos" }, { title: "Empújalos con la cuchara de madera", sub: "en medio minuto están adentro" }] }],
  ["la medida de la nonna", 7, "BigStat", { theme: T, eyebrow: "La medida de la nonna", value: 10, suffix: " g", support: "de sal por cada litro de agua · 1 cucharada rasa" }],
  ["casi no se tocan", 8, "MythVsTruth", { theme: T, myth: "Un chorrito de aceite en el agua evita que la pasta se pegue.", truth: "El aceite flota. Solo deja una capita que hace resbalar la salsa. Lo que evita que se pegue es mucha agua y revolver." }],
  ["lo que evita que la pasta", 8, "Checklist", { theme: T, title: "Para que no se pegue", items: ["Mucha agua", "Hervor fuerte", "Revolver a los 30 segundos", "Y otra vez al minuto"] }],
  ["mi mama sacaba la pasta", 7, "BigStat", { theme: T, eyebrow: "El secreto", value: 2, suffix: " min", support: "antes de lo que dice el paquete · y a la sartén con la salsa" }],
  ["si la pasta termina de cocinarse", 8, "Compare", { theme: T, title: "Los últimos 2 minutos", left: { label: "En el agua", sub: "se llena de agua" }, right: { label: "En la salsa", sub: "se llena de salsa" } }],
  ["para que sirve cuando pasas", 9, "Steps", { theme: T, eyebrow: "El agua de oro", title: "La taza que nadie guarda", steps: [{ title: "Antes de escurrir, saca 1 taza", sub: "agua turbia, con almidón y sal" }, { title: "Medio cucharón en la sartén", sub: "con la pasta y la salsa" }, { title: "Revuelve fuerte", sub: "la salsa se vuelve cremosa y brillante" }] }],
  ["es la misma receta cara", 7, "PullQuote", { theme: T, quote: "Es la misma receta. La diferencia es una taza de agua que todos tiran.", author: "Nonna Lucía" }],
  ["el queso rallado de sobre", 8, "MythVsTruth", { theme: T, myth: "El queso de sobre es lo mismo.", truth: "Trae un polvito para que no se pegue: no se derrite bien y hace grumos. Mejor un pedazo rallado en el momento." }],
  ["el domingo era el unico", 9, "Timeline", { theme: T, eyebrow: "La salsa del domingo", title: "Como la hacía mi mamma", steps: [{ when: "7:00", text: "Olla al fuego antes de misa" }, { when: "4-5 horas", text: "Fuego mínimo, tapa a medias" }, { when: "Mediodía", text: "La salsa a la pasta, la carne de segundo" }] }],
  ["uno olla grande un litro", 12, "Checklist", { theme: T, title: "Las 7 reglas de la nonna", items: ["1 litro de agua por cada 100 g", "Sal cuando hierve: 10 g por litro", "Nada de aceite: revolver", "No partir los espaguetis", "2 minutos antes y a la sartén", "Guardar una taza de agua", "Nunca enjuagar"], stamp: "¡Anótalo!" }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } if (inAvatar(from)) { compMiss.push(`${a} (avatar)`); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);

// ---------- OVERLAYS ----------
const QRP = { theme: T, corner: "bl", src: QR, eyebrow: "ESCANEA EL CÓDIGO", label: "El Cuaderno de la Nonna" };
const ovBeats = [
  ["y no te sientas mal eh", 5, "LowerThird", { theme: T, accentText: "LA NONNA COCINA", title: "Nonna Lucía", sub: "la cocina de mi mamma, en Sicilia" }],
  ["el error numero uno es", 4.5, "SectionTitle", { theme: T, eyebrow: "ERROR 1", title: "La olla" }],
  ["y un secreto mas de la", 4, "KeywordPop", { theme: T, word: "LA TAPA", sub: "puesta para calentar · afuera con la pasta", pos: "top" }],
  ["el error numero dos es", 4.5, "SectionTitle", { theme: T, eyebrow: "ERROR 2", title: "La sal" }],
  ["la pasta es harina y", 4, "KeywordPop", { theme: T, word: "SOSA", sub: "la pasta solo toma sal mientras se cocina", pos: "top" }],
  ["el error numero cuatro es", 4.5, "SectionTitle", { theme: T, eyebrow: "ERROR 4", title: "Partir los espaguetis" }],
  ["y aqui viene el truco que", 4.5, "SectionTitle", { theme: T, eyebrow: "ERROR 6", title: "Tirar el agua" }],
  ["mi mama la llamaba", 4, "KeywordPop", { theme: T, word: "ACQUA D'ORO", sub: "el agua de oro", pos: "center" }],
  ["el error numero siete", 4.5, "SectionTitle", { theme: T, eyebrow: "ERROR 7", title: "Enjuagar la pasta" }],
  ["y el queso se echa fuera", 5, "Callout", { theme: T, icon: "🧀", title: "Fuera del fuego", sub: "con fuego fuerte el queso se corta y se pone como chicle", tone: "info" }],
  ["y ahora si lo que te prometi", 4.5, "SectionTitle", { theme: T, eyebrow: "EL REGALO", title: "La salsa del domingo" }],
  // ---- QR: los 3 CTAs + 2 extra ----
  ["y aqui te quiero contar algo", 8, "QRTag", QRP],            // CTA1 (sobre el avatar)
  ["y fijate que esta es una", 8, "QRTag", QRP],                // CTA2
  ["si quieres todo esto escrito", 8, "QRTag", QRP],            // CTA3
  ["repasemos rapido para que lo", 7, "QRTag", QRP],            // extra
  ["el domingo era el unico", 7, "QRTag", QRP],                 // extra
];
const overlays = [];
const ovMiss = [];
for (const [a, d, comp, props] of ovBeats) { const from = at(a); if (from == null) { ovMiss.push(a); continue; } if (comp !== "QRTag" && inComp(from)) { ovMiss.push(`${a} (comp)`); continue; } overlays.push({ from, dur: sec(d), comp, props }); }
overlays.sort((x, y) => x.from - y.from);

// ---------- B-ROLL por sección (imágenes Agnes, sin repetir dentro de la sección) ----------
const plan = JSON.parse(fs.readFileSync(path.join(ROOT, "_v3", `${SLUG}_plan.json`), "utf8"));
const secs = plan.map((s) => ({ sec: s.sec, from: at(s.anchor), imgs: s.p.map((_, i) => `img/${SLUG}_${s.sec}${String(i + 1).padStart(2, "0")}.png`).filter((f) => fs.existsSync(path.join(ROOT, "public", f))), used: 0 }));
const secMiss = secs.filter((s) => s.from == null).map((s) => s.sec);
const secsOk = secs.filter((s) => s.from != null).sort((a, b) => a.from - b.from);
secsOk[0].from = 0;
const secAt = (f) => { let cur = secsOk[0]; for (const s of secsOk) if (s.from <= f) cur = s; return cur; };
const blocked = [...avatarRanges, ...compRanges].sort((a, b) => a[0] - b[0]);
const merged = [];
for (const r of blocked) { if (merged.length && r[0] <= merged[merged.length - 1][1]) merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], r[1]); else merged.push([r[0], r[1]]); }
const free = []; let cur = 0;
for (const [a, b] of merged) { if (a > cur) free.push([cur, a]); cur = Math.max(cur, b); }
if (cur < durationInFrames) free.push([cur, durationInFrames]);
const PACE = [sec(4.8), sec(4.0), sec(5.6), sec(4.4), sec(5.2)]; // variedad, no metrónomo
const MINB = sec(1.6);
const broll = []; let n = 0; const reuse = [];
for (const [a, b] of free) {
  let f = a;
  while (b - f >= MINB) {
    let d = Math.min(PACE[n % PACE.length], b - f);
    if ((b - f - d) > 0 && (b - f - d) < MINB) d = b - f;
    const s = secAt(f);
    let src;
    if (s.used < s.imgs.length) src = s.imgs[s.used++];
    else { // sección agotada: tomar la próxima sección con imágenes libres (vecina), si no, reciclar
      const alt = secsOk.find((x) => x.from > s.from && x.used < x.imgs.length) || secsOk.slice().reverse().find((x) => x.used < x.imgs.length);
      if (alt) src = alt.imgs[alt.used++]; else { src = s.imgs[(s.used++) % s.imgs.length]; reuse.push(src); }
    }
    broll.push({ from: f, dur: d, kind: "image", src, kb: n % 6, pip: false });
    n++; f += d;
  }
}

// diagnóstico: cuántas tomas cayeron en cada sección vs imágenes disponibles
const need = {}; broll.forEach((b) => { const s = secAt(b.from).sec; need[s] = (need[s] || 0) + 1; });
console.log("tomas/imgs por sección: " + secsOk.map((x) => x.sec + ":" + (need[x.sec] || 0) + "/" + x.imgs.length).join(" "));
const cues = { slug: SLUG, fps: FPS, width: 1920, height: 1080, durationInFrames, audioSrc: `${SLUG}.mp3`, avatarSrc: `${SLUG}_avatar.mp4`, avatarSegs, broll, overlays, components };
fs.writeFileSync(path.join(ROOT, "src", "VideoEdit", "data", `cues_${SLUG}.json`), JSON.stringify(cues, null, 2));
fs.writeFileSync(path.join(ROOT, "_v3", `${SLUG}_avatarcuts.json`), JSON.stringify(avatarCuts, null, 2));
const bf = broll.reduce((s, b) => s + b.dur, 0);
const avf = avatarSegs.reduce((s, a) => s + a.dur, 0);
const cf = components.reduce((s, c) => s + c.dur, 0);
console.log(`avatar ${avatarSegs.length}/${avatarBeats.length} segs ${Math.round(avf / FPS)}s = ${Math.round(avf / durationInFrames * 100)}%${avatarMiss.length ? " MISS: " + avatarMiss.join(" | ") : ""}`);
console.log(`componentes ${components.length}/${compBeats.length} ${Math.round(cf / FPS)}s${compMiss.length ? " MISS: " + compMiss.join(" | ") : ""}`);
console.log(`overlays ${overlays.length}/${ovBeats.length} (QR ${overlays.filter((o) => o.comp === "QRTag").length})${ovMiss.length ? " MISS: " + ovMiss.join(" | ") : ""}`);
console.log(`b-roll ${broll.length} imgs ${Math.round(bf / FPS)}s = ${Math.round(bf / durationInFrames * 100)}% · únicas ${new Set(broll.map((b) => b.src)).size} · recicladas ${reuse.length}${secMiss.length ? " · SECCIONES SIN ANCLA: " + secMiss.join(",") : ""}`);
console.log(`TOTAL ${(durationInFrames / FPS / 60).toFixed(1)} min`);
