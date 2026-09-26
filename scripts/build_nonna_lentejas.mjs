/**
 * BUILD "nonna-lentejas" (La Nonna Cocina · video #3: lentejas). Tema EARTH.
 * Audio master = Fish (voz nonna). Avatar = on-cam concatenado cortado DEL MISMO master (lip-sync exacto).
 * B-roll = imágenes Agnes por sección (_v3/nonna-pasta_plan.json) con Ken Burns variado.
 *   node scripts/build_nonna_lentejas.mjs
 * Salidas: src/VideoEdit/data/cues_nonna-lentejas.json + _v3/nonna-lentejas_avatarcuts.json
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "nonna-lentejas";
const FPS = 30;
const T = "earth";
const QR = "img/qr_nonna.png";
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", `captions_${SLUG}.json`), "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
// captions por palabra (whisper puede pegar signos o partir palabras): aplanar a tokens
const toks = []; caps.forEach((w, i) => norm(w.text).split(" ").filter(Boolean).forEach((t) => toks.push({ t, i })));
const find = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let k = 0; k + N <= toks.length; k++) { let ok = 1; for (let j = 0; j < N; j++) if (toks[k + j].t !== t[j]) { ok = 0; break; } if (ok) return [toks[k].i, toks[k + N - 1].i]; } return null; };
const at = (p) => { const r = find(p); return r ? Math.round(caps[r[0]].startMs / 1000 * FPS) : null; };
const atEnd = (p, minF = 0) => { const t = norm(p).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let k = 0; k + N <= toks.length; k++) { if (caps[toks[k].i].startMs / 1000 * FPS < minF) continue; let ok = 1; for (let j = 0; j < N; j++) if (toks[k + j].t !== t[j]) { ok = 0; break; } if (ok) return Math.round(caps[toks[k + N - 1].i].endMs / 1000 * FPS); } return null; };
const sec = (n) => Math.round(n * FPS);
const durationInFrames = Math.round(caps[caps.length - 1].endMs / 1000 * FPS) + sec(1.5);

// ---------- AVATAR on-camera (~25%, habla casual) ----------
const MAXWIN = sec(40);
const avatarBeats = [
  ["mira mira esto una olla", "es como la cocinamos"],                     // hook
  ["bueno me dejaron un monton", "costumbre italiana muy linda"],          // promesa
  ["y aqui te cuento algo", "bueno sigamos"],                              // CTA1
  ["la lenteja se cocina con", "entera esta"],                             // regla fuego
  ["esto es algo que mi", "como ella"],                                    // la sal (honesto)
  ["en mi casa eramos tan", "que tuve en mi vida"],                        // remate 1 de enero
  ["si quieres todo esto escrito", "ahi abajito"],                         // CTA3
  ["y cuentame en los comentarios", "__END__"],                            // cierre
];
const avatarSegs = []; const avatarCuts = []; const avatarMiss = [];
let clip = 0;
for (const [aS, aE] of avatarBeats) {
  const from = at(aS); let end = aE === "__END__" ? durationInFrames - sec(0.5) : atEnd(aE, from);
  if (from == null || end == null || end <= from) { avatarMiss.push(`${aS} → ${aE}`); continue; }
  end = Math.min(end + sec(0.25), durationInFrames);
  let dur = Math.min(end - from, MAXWIN);
  if (dur < sec(2)) { avatarMiss.push(`${aS} (corto)`); continue; }
  const AVAF_LIM = process.env.AVAF_SEC ? Math.floor(+process.env.AVAF_SEC * FPS) - 2 : Infinity;
  if (clip + dur > AVAF_LIM) dur = AVAF_LIM - clip;
  avatarSegs.push({ from, dur, clip });
  avatarCuts.push({ startSec: +(from / FPS).toFixed(3), endSec: +((from + dur) / FPS).toFixed(3), durSec: +(dur / FPS).toFixed(3) });
  clip += dur;
}
const avatarRanges = avatarSegs.map((s) => [s.from, s.from + s.dur]);
const inAvatar = (f) => avatarRanges.some(([a, b]) => f >= a - sec(0.3) && f < b + sec(0.3));

// ---------- COMPONENTES full-screen ----------
const compBeats = [
  ["mi mama decia que las", 6, "PullQuote", { theme: T, quote: "Las lentejas son la carne de los pobres.", author: "La mamma de la Nonna Lucía" }],
  ["mi mama las volcaba en", 7, "Steps", { theme: T, eyebrow: "Error 1", title: "Revisarlas y lavarlas", steps: [{ title: "En un plato blanco", sub: "pásalas de a poco con el dedo" }, { title: "Fuera piedritas y palitos", sub: "y las lentejas negras" }, { title: "Lávalas en la bacha", sub: "hasta que el agua salga limpia" }] }],
  ["mucha gente deja las lentejas", 7, "MythVsTruth", { theme: T, myth: "Las lentejas van en remojo toda la noche, como los garbanzos.", truth: "La lenteja común no lo necesita. Si quieres, una o dos horitas. Toda la noche se deshacen." }],
  ["mi mama primero hacia el", 9, "Steps", { theme: T, eyebrow: "Error 3", title: "Primero, el sofrito", steps: [{ title: "Aceite, cebolla, zanahoria, apio y ajo", sub: "todo picadito" }, { title: "Fuego bajo, 10 minutos", sub: "hasta que la cebolla se pone transparente" }, { title: "Las lentejas, un minuto, y el agua", sub: "con una hojita de laurel" }] }],
  ["mucha gente las pone a", 7, "Compare", { theme: T, title: "El fuego", left: { label: "Hervor fuerte", sub: "se rompe la piel · puré" }, right: { label: "Apenas temblando", sub: "tiernas pero enteras · 30-40 min" } }],
  ["a veces las lentejas chupan", 6, "Compare", { theme: T, title: "Si se secan", left: { label: "Agua fría", sub: "se corta la cocción" }, right: { label: "Agua caliente", sub: "sigue todo igual" } }],
  ["pero lo del tomate si", 7, "Timeline", { theme: T, eyebrow: "Error 6", title: "¿Cuándo va cada cosa?", steps: [{ when: "Al principio", text: "Sofrito, lentejas, agua y laurel" }, { when: "Casi tiernas", text: "La sal" }, { when: "Últimos 10 min", text: "El tomate (lo ácido)" }] }],
  ["las lentejas como tantas comidas", 6, "BigStat", { theme: T, eyebrow: "El secreto", value: 1, suffix: " día", support: "de reposo: son más ricas al otro día" }],
  ["eso si lo que sobra", 5, "Callout", { theme: T, icon: "🧊", title: "Lo que sobra", sub: "apenas se enfría, tapado al refrigerador", tone: "warn" }],
  ["porque las lentejas tienen forma", 7, "KeywordPopFull", null],
  ["uno revisalas en un plato", 12, "Checklist", { theme: T, title: "Los 7 errores de las lentejas", items: ["Revisarlas y lavarlas", "Remojo: no hace falta", "Primero el sofrito", "Fuego suave", "Agua caliente si se secan", "Sal casi al final · tomate últimos 10 min", "Reposo y aceite crudo al servir"], stamp: "¡Anótalo!" }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { if (!props) continue; const from = at(a); if (from == null) { compMiss.push(a); continue; } if (inAvatar(from)) { compMiss.push(`${a} (avatar)`); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);

// ---------- OVERLAYS ----------
const QRP = { theme: T, corner: "bl", src: QR, eyebrow: "ESCANEA EL CÓDIGO", label: "El Cuaderno de la Nonna" };
const ovBeats = [
  ["pero antes dejame que te", 5, "LowerThird", { theme: T, accentText: "LA NONNA COCINA", title: "Nonna Lucía", sub: "hoy: las lentejas" }],
  ["el error numero uno no", 4.5, "SectionTitle", { theme: T, eyebrow: "ERROR 1", title: "No revisarlas" }],
  ["el error numero dos el", 4.5, "SectionTitle", { theme: T, eyebrow: "ERROR 2", title: "El remojo" }],
  ["el error numero 3 echarlas", 4.5, "SectionTitle", { theme: T, eyebrow: "ERROR 3", title: "Agua sola" }],
  ["el error numero 4 el", 4.5, "SectionTitle", { theme: T, eyebrow: "ERROR 4", title: "El fuego fuerte" }],
  ["el error numero 5 echarle", 4.5, "SectionTitle", { theme: T, eyebrow: "ERROR 5", title: "Agua fría" }],
  ["el error numero 6 la", 4.5, "SectionTitle", { theme: T, eyebrow: "ERROR 6", title: "La sal y el tomate" }],
  ["el error numero 7 servirlas", 4.5, "SectionTitle", { theme: T, eyebrow: "ERROR 7", title: "Servirlas enseguida" }],
  ["y un chorrito de aceite", 4, "KeywordPop", { theme: T, word: "ACEITE CRUDO", sub: "al servir, en el plato", pos: "top" }],
  ["porque las lentejas tienen forma", 4.5, "KeywordPop", { theme: T, word: "MONEDITAS", sub: "lentejas el 1° de enero = plata todo el año", pos: "top" }],
  // ---- QR ----
  ["y aqui te cuento algo", 8, "QRTag", QRP],
  ["y esto de los tiempos", 8, "QRTag", QRP],
  ["si quieres todo esto escrito", 8, "QRTag", QRP],
  ["repasemos para que lo anotes", 7, "QRTag", QRP],
];
const overlays = [];
const ovMiss = [];
for (const [a, d, comp, props] of ovBeats) { const from = at(a); if (from == null) { ovMiss.push(a); continue; } if (comp !== "QRTag" && inComp(from)) { ovMiss.push(`${a} (comp)`); continue; } overlays.push({ from, dur: sec(d), comp, props }); }
overlays.sort((x, y) => x.from - y.from);

// ---------- B-ROLL por sección (imágenes Agnes, sin repetir dentro de la sección) ----------
const plan = JSON.parse(fs.readFileSync(path.join(ROOT, "_v3", `${SLUG}_plan.json`), "utf8"));
const secs = plan.map((s) => ({ sec: s.sec, from: at(s.anchor), imgs: s.p.map((_, i) => `${s.sec}${String(i + 1).padStart(2, "0")}`).map((k) => (process.env.PLAN || fs.existsSync(path.join(ROOT, "public", `broll/${SLUG}_v_${k}.mp4`))) ? `broll/${SLUG}_v_${k}.mp4` : `img/${SLUG}_${k}.png`)  .filter((f) => process.env.PLAN || fs.existsSync(path.join(ROOT, "public", f))), used: 0 }));
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
const PACE = [sec(6.0), sec(5.4), sec(6.0), sec(5.7), sec(6.0)]; // clips Agnes de 6 s // variedad, no metrónomo
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
    broll.push({ from: f, dur: d, kind: src.endsWith(".mp4") ? "video" : "image", src, kb: n % 6, pip: false });
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
console.log(`b-roll ${broll.length} (videos ${broll.filter((b) => b.kind === "video").length}) ${Math.round(bf / FPS)}s = ${Math.round(bf / durationInFrames * 100)}% · únicas ${new Set(broll.map((b) => b.src)).size} · recicladas ${reuse.length}${secMiss.length ? " · SECCIONES SIN ANCLA: " + secMiss.join(",") : ""}`);
console.log(`TOTAL ${(durationInFrames / FPS / 60).toFixed(1)} min`);
