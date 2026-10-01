/**
 * BUILD "Vital After 60" v2 (Dr. Alan Brooks) — clon de build_mateo (Nonna/Mateo): 1 foto Agnes por frase (+ clips "v" del doctor en acción), componentes kit/kit4/kit5, anclas tolerantes.
 *   node scripts/build_vital2.mjs <slug>   (PLAN=1 → no exige imágenes)   Config: _v3/<slug>_cfg.mjs (SHOTS, AVATAR, COMPS, OVS, QRS)
 */
import fs from "node:fs";
import path from "node:path";
const SLUG = process.argv[2];
const CFG = await import("../_v3/" + SLUG + "_cfg.mjs");
const SHOTS = CFG.SHOTS;
const ROOT = process.cwd();
const FPS = 30;
const T = CFG.THEME || "clinic";
const QR = CFG.QR || "img/qr_vital.png";
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", `captions_${SLUG}.json`), "utf8").replace(/^﻿/, ""));
const NUM = { "1": "one", "2": "two", "3": "three", "4": "four", "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine", "10": "ten", "12": "twelve", "13": "thirteen", "15": "fifteen", "20": "twenty", "25": "twenty five", "30": "thirty", "40": "forty", "50": "fifty", "60": "sixty", "65": "sixty five", "70": "seventy", "80": "eighty", "90": "ninety", "100": "one hundred" };
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/g, " ").replace(/\b\d+\b/g, (d) => (process.env.EXACT ? d : NUM[d] || d)).replace(/\s+/g, " ").trim();
const toks = []; caps.forEach((w, i) => norm(w.text).split(" ").filter(Boolean).forEach((t) => toks.push({ t, i })));
// búsqueda tolerante: con 4+ palabras acepta 1 distinta (Whisper small se equivoca: "alitre", "placart", "reboque")
const eq = (a, b) => a === b || (!process.env.EXACT) && (a.length > 3 && b.length > 3 && (a.startsWith(b.slice(0, 4)) || b.startsWith(a.slice(0, 4))));
const matchAt = (k, t, N) => { let miss = 0; for (let j = 0; j < N; j++) { if (!toks[k + j]) return false; if (!eq(toks[k + j].t, t[j])) { miss++; if (process.env.EXACT || N < 4 || miss > 1 || j < 2) return false; } } return true; };
const find = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let k = 0; k + N <= toks.length; k++) if (matchAt(k, t, N)) return [toks[k].i, toks[k + N - 1].i]; return null; };
const at = (p) => { const r = find(p); return r ? Math.round(caps[r[0]].startMs / 1000 * FPS) : null; };
const atEnd = (p, minF = 0) => { const t = norm(p).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let k = 0; k + N <= toks.length; k++) { if (caps[toks[k].i].startMs / 1000 * FPS < minF) continue; if (matchAt(k, t, N)) return Math.round(caps[toks[k + N - 1].i].endMs / 1000 * FPS); } return null; };
const sec = (n) => Math.round(n * FPS);
const durationInFrames = Math.round(caps[caps.length - 1].endMs / 1000 * FPS) + sec(1.5);
const IMG = (n) => `img/${SLUG}_s${String(n).padStart(2, "0")}.png`;

// ---------- AVATAR on-camera (~12-15%) ----------
const MAXWIN = sec(35);
const avatarBeats = CFG.AVATAR;
const avatarSegs = []; const avatarCuts = []; const avatarMiss = [];
let clip = 0;
for (const [aS, aE] of avatarBeats) {
  let from = at(aS); if (from != null && from < sec(0.5)) from = 0; let end = aE === "__END__" ? durationInFrames - sec(0.5) : atEnd(aE, from);
  if (from == null || end == null || end <= from) { avatarMiss.push(`${aS} → ${aE}`); continue; }
  end = Math.min(end + sec(0.25), durationInFrames);
  let dur = Math.min(end - from, MAXWIN);
  if (dur < sec(2)) { avatarMiss.push(`${aS} (corto)`); continue; }
  const AVAF_LIM = process.env.AVAF_SEC ? Math.floor(+process.env.AVAF_SEC * FPS) - 2 : Infinity;
  if (clip + dur > AVAF_LIM) dur = AVAF_LIM - clip;
  const L = avatarSegs[avatarSegs.length - 1];
  if (L && from < L.from + L.dur - sec(1)) { avatarMiss.push(`${aS} (fuera de orden)`); continue; }
  if (L && from - (L.from + L.dur) < sec(0.8)) { const add = from + dur - (L.from + L.dur); L.dur += add; clip += add; const C = avatarCuts[avatarCuts.length - 1]; C.endSec = +((L.from + L.dur) / FPS).toFixed(3); C.durSec = +(L.dur / FPS).toFixed(3); continue; }
  avatarSegs.push({ from, dur, clip });
  avatarCuts.push({ startSec: +(from / FPS).toFixed(3), endSec: +((from + dur) / FPS).toFixed(3), durSec: +(dur / FPS).toFixed(3) });
  clip += dur;
}
// CONGELAR: si el avatar ya se generó, los tramos salen del archivo de cortes (el audio del avatar se cortó con esos tiempos)
const CUTS = path.join(ROOT, "_v3", `${SLUG}_avatarcuts.json`);
const FROZEN = fs.existsSync(path.join(ROOT, "public", `${SLUG}_avatar.mp4`)) && fs.existsSync(CUTS);
if (FROZEN) { const cz = JSON.parse(fs.readFileSync(CUTS, "utf8")); avatarSegs.length = 0; avatarCuts.length = 0; let cl = 0; for (const c of cz) { const from = Math.round(c.startSec * FPS); let dur = Math.round(c.durSec * FPS); const LIM = process.env.AVAF_SEC ? Math.floor(+process.env.AVAF_SEC * FPS) - 2 : Infinity; if (cl + dur > LIM) dur = LIM - cl; if (dur < 1) continue; avatarSegs.push({ from, dur, clip: cl }); avatarCuts.push(c); cl += dur; } }
const avatarRanges = avatarSegs.map((s) => [s.from, s.from + s.dur]);
const inAvatar = (f) => avatarRanges.some(([a, b]) => f >= a - sec(0.3) && f < b + sec(0.3));

// ---------- COMPONENTES full-screen (tarjetas de frase oscuras + crema, como la referencia) ----------
const fixSrc = (p) => { if (typeof p.src !== "string") return p; if (p.src.startsWith("IMG:")) return { ...p, src: IMG(+p.src.slice(4)) }; if (p.src.startsWith("AT:")) { const k = SHOTS.findIndex(([a]) => a === p.src.slice(3)); return { ...p, src: IMG(k + 1) }; } return p; };
const EN = (c) => c === "MythVsTruth" ? { mythLabel: "Myth", truthLabel: "Truth" } : c === "BeforeAfter" ? { beforeLabel: "BEFORE", afterLabel: "AFTER" } : {}; // defaults del kit vienen en español
const compBeats = CFG.COMPS.map(([a, d, c, p]) => [a, d, c, fixSrc({ theme: T, ...EN(c), ...p })]);
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } if (inAvatar(from)) { compMiss.push(`${a} (avatar)`); continue; } const nxA = avatarSegs.map((s) => s.from).filter((x) => x > from).sort((x, y) => x - y)[0]; const dd = Math.min(sec(d), nxA != null ? nxA - from : Infinity); components.push({ from, dur: dd, comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);

// ---------- OVERLAYS ----------
const QRP = { theme: T, corner: "bl", src: QR, eyebrow: CFG.QREYEBROW || "SCAN TO SEE THE GUIDES", label: CFG.QRLABEL || "The Vital After 60 Playbook", hint: "point your phone camera 📷" };
const ovBeats = [...CFG.OVS.map(([a, d, c, p]) => [a, d, c, { theme: T, ...EN(c), ...p }]), ...(CFG.QRS || []).map((a) => [a, 7, "QRTag", QRP])];
const overlays = [];
const ovMiss = [];
for (const [a, d, comp, props] of ovBeats) { const from = at(a); if (from == null) { ovMiss.push(a); continue; } if (comp !== "QRTag" && inComp(from)) { ovMiss.push(`${a} (comp)`); continue; } overlays.push({ from, dur: sec(d), comp, props }); }
overlays.sort((x, y) => x.from - y.from);

// ---------- B-ROLL: una imagen por frase, sostenida hasta la frase siguiente ----------
// SHOTS [ancla, prompt, "v"] → clip de video Agnes (broll/<slug>_v_sNN.mp4); sin "v" → imagen
const VID = (n) => `broll/${SLUG}_v_s${String(n).padStart(2, "0")}.mp4`;
const shots = SHOTS.map(([a, , k], i) => ({ n: i + 1, a, from: at(a), src: k === "v" && (process.env.PLAN || fs.existsSync(path.join(ROOT, "public", VID(i + 1)))) ? VID(i + 1) : IMG(i + 1) }))
  .filter((s) => process.env.PLAN || fs.existsSync(path.join(ROOT, "public", s.src)));
const shotMiss = shots.filter((s) => s.from == null).map((s) => s.n + ":" + s.a);
const seq = shots.filter((s) => s.from != null).sort((a, b) => a.from - b.from);
const blocked = [...avatarRanges, ...compRanges].sort((a, b) => a[0] - b[0]);
const merged = [];
for (const r of blocked) { if (merged.length && r[0] <= merged[merged.length - 1][1]) merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], r[1]); else merged.push([r[0], r[1]]); }
const free = []; let cur = 0;
for (const [a, b] of merged) { if (a > cur) free.push([cur, a]); cur = Math.max(cur, b); }
if (cur < durationInFrames) free.push([cur, durationInFrames]);
const MAXHOLD = sec(11), MINB = sec(1.6);
const broll = []; const used = new Set(); let n = 0;
for (const [a, b] of free) {
  if (b - a < sec(0.6)) { const pc = components.find((c) => c.from + c.dur === a); if (pc) { pc.dur += b - a; continue; } }
  // tomas cuyo ancla cae en esta ventana; si la ventana arranca antes del primer ancla, sigue la última imagen anterior o la próxima sin usar
  const inside = seq.filter((s) => s.from >= a && s.from < b);
  const before = seq.filter((s) => s.from < a);
  const cuts = inside.map((s) => ({ f: s.from, s }));
  if (!cuts.length || cuts[0].f - a >= MINB) {
    const prevUnused = before.slice().reverse().find((s) => !used.has(s.n));
    const lead = prevUnused || before[before.length - 1] || inside[0] || seq.find((s) => s.from >= b);
    if (lead) cuts.unshift({ f: a, s: lead });
  } else cuts[0].f = a;
  for (let i = 0; i < cuts.length; i++) {
    const f0 = cuts[i].f, f1 = i + 1 < cuts.length ? cuts[i + 1].f : b;
    if (f1 - f0 < MINB && broll.length && i > 0) { broll[broll.length - 1].dur += f1 - f0; continue; }
    let f = f0; let s = cuts[i].s;
    while (f1 - f >= 1) {
      const MH = s.src.endsWith(".mp4") ? sec(5.8) : MAXHOLD; // los clips duran 6 s
      let d = Math.min(f1 - f, MH);
      if (f1 - f - d > 0 && f1 - f - d < MINB) d = f1 - f;
      broll.push({ from: f, dur: d, kind: s.src.endsWith(".mp4") ? "video" : "image", src: s.src, kb: n % 6, pip: false });
      used.add(s.n); n++; f += d;
      if (f1 - f >= 1) { const nx = seq.filter((x) => !used.has(x.n) && x.from < f && x.from > f - sec(30)).pop(); if (nx) s = nx; }
    }
  }
}

while (broll.length && broll[broll.length - 1].dur < sec(0.6)) broll.pop(); // cola final: mejor negro que un flash
const cues = { slug: SLUG, fps: FPS, width: 1920, height: 1080, durationInFrames, audioSrc: `${SLUG}.mp3`, avatarSrc: `${SLUG}_avatar.mp4`, avatarSegs, broll, overlays, components };
fs.writeFileSync(path.join(ROOT, "src", "VideoEdit", "data", `cues_${SLUG}.json`), JSON.stringify(cues, null, 2));
if (!FROZEN) fs.writeFileSync(CUTS, JSON.stringify(avatarCuts, null, 2));
const bf = broll.reduce((s, b) => s + b.dur, 0);
const avf = avatarSegs.reduce((s, a) => s + a.dur, 0);
const cf = components.reduce((s, c) => s + c.dur, 0);
const durs = broll.map((b) => b.dur / FPS);
console.log(`avatar ${avatarSegs.length}/${avatarBeats.length} segs ${Math.round(avf / FPS)}s = ${Math.round(avf / durationInFrames * 100)}%${avatarMiss.length ? " MISS: " + avatarMiss.join(" | ") : ""}`);
console.log(`componentes ${components.length}/${compBeats.length} ${Math.round(cf / FPS)}s${compMiss.length ? " MISS: " + compMiss.join(" | ") : ""}`);
console.log(`overlays ${overlays.length}/${ovBeats.length} (QR ${overlays.filter((o) => o.comp === "QRTag").length})${ovMiss.length ? " MISS: " + ovMiss.join(" | ") : ""}`);
console.log(`b-roll ${broll.length} planos ${Math.round(bf / FPS)}s = ${Math.round(bf / durationInFrames * 100)}% · imágenes usadas ${used.size}/${SHOTS.length} · plano medio ${(durs.reduce((a, b) => a + b, 0) / durs.length).toFixed(1)}s (min ${Math.min(...durs).toFixed(1)} max ${Math.max(...durs).toFixed(1)})`);
if (shotMiss.length) console.log("TOMAS SIN ANCLA: " + shotMiss.join(" | "));
const unused = SHOTS.map((_, i) => i + 1).filter((k) => !used.has(k));
if (unused.length) console.log("no usadas: " + unused.join(","));
console.log(`TOTAL ${(durationInFrames / FPS / 60).toFixed(1)} min`);
