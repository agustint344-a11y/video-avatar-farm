/**
 * BUILD "collagen-vital" (Dr. Alan Brooks / Vital After 60) — collagen / egg + lemon water. CLINIC.
 * Fuente única: avatar FULL (habla todo el guión) → clip=from (sync perfecto sobre el audio master mp3).
 *   node scripts/build_collagen_vital.mjs
 * Salidas: src/VideoEdit/data/cues_collagen-vital.json  +  _v3/collagen-vital_avatarcuts.json
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "collagen-vital";
const FPS = 30;
const T = "clinic";
const QR = "img/qr_vital.png";
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", `captions_${SLUG}.json`), "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
const cn = caps.map((w) => norm(w.text));
const at = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let i = 0; i + N <= cn.length; i++) { let ok = 1; for (let j = 0; j < N; j++) if (cn[i + j] !== t[j]) { ok = 0; break; } if (ok) return Math.round(caps[i].startMs / 1000 * FPS); } return null; };
const atEnd = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let i = 0; i + N <= cn.length; i++) { let ok = 1; for (let j = 0; j < N; j++) if (cn[i + j] !== t[j]) { ok = 0; break; } if (ok) return Math.round(caps[i + N - 1].endMs / 1000 * FPS); } return null; };
const sec = (n) => Math.round(n * FPS);
const durationInFrames = Math.round(caps[caps.length - 1].endMs / 1000 * FPS) + sec(1);

// ---------- AVATAR on-camera (minoría). Fuente = avatar FULL → clip = from (mismo timeline) ----------
const MAXWIN = sec(42);
const avatarBeats = [
  ["if you look in the mirror", "costs just a few cents"],                 // hook
  ["dr alan brooks and over", "stay with me until the end"],               // intro + retención
  ["the full method the exact", "you can follow along"],                   // CTA1
  ["let me tell you about a patient", "it always knew how to do"],         // caso paciente
  ["if this helped you", "see you in the next one"],                       // cierre + CTA3
];
const avatarSegs = []; const avatarCuts = []; const avatarMiss = [];
const AVAF = sec(152); // largo del mp4 on-cam (154s) con margen: el clip no puede pasarse
let clip = 0; // avatar = on-cam concatenado (Elena) → trimBefore acumulativo
for (const [aS, aE] of avatarBeats) {
  const from = at(aS); let end = atEnd(aE);
  if (from == null || end == null || end <= from) { avatarMiss.push(`${aS} → ${aE}`); continue; }
  let dur = end - from; if (dur > MAXWIN) dur = MAXWIN;
  if (clip + dur > AVAF) dur = AVAF - clip;           // clamp al largo del avatar
  if (dur < sec(2)) { avatarMiss.push(`${aS} (sin cupo de avatar)`); continue; }
  avatarSegs.push({ from, dur, clip });
  avatarCuts.push({ startSec: +(from / FPS).toFixed(3), endSec: +((from + dur) / FPS).toFixed(3), durSec: +(dur / FPS).toFixed(3) });
  clip += dur;
}
const avatarRanges = avatarSegs.map((s) => [s.from, s.from + s.dur]);
const inAvatar = (f) => avatarRanges.some(([a, b]) => f >= a - sec(0.3) && f < b + sec(0.3));

// ---------- COMPONENTES full-screen (tapan avatar/b-roll) ----------
const compBeats = [
  ["think of your skin like a mattress", 8.5, "MythVsTruth", { theme: T, myth: "Wrinkles are just \"age\" and a good cream fixes them.", truth: "Most of it is LOST COLLAGEN — the scaffolding under your skin. Creams sit on top; real firmness is rebuilt from the inside." }],
  ["gently pinch the skin", 8.5, "Checklist", { theme: T, title: "Signs your collagen dropped", items: ["The pinched skin snaps back slowly", "Horizontal lines on the neck", "Thin, \"papery\" hands", "Nails break, hair loses body"] }],
  ["put a collagen cream", 8, "MythVsTruth", { theme: T, myth: "A collagen cream can rebuild your skin.", truth: "The collagen molecule is too big to get in — it stays on the surface. Firmness is manufactured from the inside, with raw material." }],
  ["your body builds collagen like a wall", 8.5, "Steps", { theme: T, eyebrow: "How it works", title: "Your body needs", steps: [{ title: "Bricks: glycine & proline", sub: "the egg is rich in both" }, { title: "The igniter: vitamin C", sub: "no vitamin C, no new collagen" }, { title: "Tools: zinc & copper", sub: "egg yolk + nuts and seeds" }] }],
  ["the egg is not collagen that sticks to your face", 8, "MythVsTruth", { theme: T, myth: "The egg is collagen you eat onto your skin.", truth: "No. It gives your body the exact materials so IT builds NEW collagen, deep in the skin where no cream reaches." }],
  ["one or two whole eggs", 9, "Steps", { theme: T, eyebrow: "The morning method", title: "Every morning", steps: [{ title: "1–2 whole eggs (keep the yolk)", sub: "boiled, scrambled, poached" }, { title: "A glass of water + juice of ½ lemon", sub: "the vitamin C igniter" }, { title: "A small handful of nuts/seeds", sub: "zinc & copper" }] }],
  ["it works with your body", 8, "PullQuote", { theme: T, quote: "It costs pennies. It's probably in your kitchen right now. And it works with your body instead of lying to it.", author: "Dr. Alan Brooks" }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } if (inAvatar(from)) { compMiss.push(`${a} (avatar)`); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);

// ---------- OVERLAYS (encima; QR exento del choque con componentes) ----------
const ovBeats = [
  ["dr alan brooks and over", 5, "LowerThird", { theme: T, accentText: "EVIDENCE-BASED", title: "Dr. Alan Brooks", sub: "collagen after 60" }],
  ["one word burned", 3.8, "KeywordPop", { theme: T, word: "COLLAGEN", sub: "the scaffolding that keeps skin firm", pos: "center" }],
  ["that igniter is vitamin c", 3.8, "KeywordPop", { theme: T, word: "VITAMIN C", sub: "the igniter that builds the collagen", pos: "center" }],
  ["talking about is the egg", 4.5, "SectionTitle", { theme: T, eyebrow: "THE FOOD", title: "The egg" }],
  ["a glass of warm water with lemon", 5, "LowerThird", { theme: T, accentText: "ADD THIS TO WATER", title: "Lemon water", sub: "the vitamin C that flips the switch" }],
  ["the sun is by far the biggest destroyer", 5.5, "Callout", { theme: T, icon: "⚠️", title: "The sun", sub: "the #1 destroyer of collagen — protect your skin or you undo the work", tone: "warn" }],
  ["talk to your own doctor before making eggs", 5.5, "Callout", { theme: T, icon: "⚠️", title: "A caution", sub: "if you were told to limit eggs, ask your own doctor first", tone: "warn" }],
  ["that free guide is waiting for you", 6, "SplitInfo", { eyebrow: "In the guide", title: "The Natural Wellness Method", items: ["The exact morning routine", "Safe daily amounts", "Foods richest in collagen bricks"] }],
  // ---- QR: los 3 CTAs + 1 extra ----
  ["pinned at the top of the comments", 7.5, "QRTag", { theme: T, corner: "bl", src: QR }],   // CTA1
  ["a glass of warm water with lemon", 7, "QRTag", { theme: T, corner: "bl", src: QR }],        // extra
  ["the link is in the description and pinned in the comments", 7.5, "QRTag", { theme: T, corner: "bl", src: QR }], // CTA2
  ["that free guide is waiting for you", 7.5, "QRTag", { theme: T, corner: "bl", src: QR }],     // CTA3
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
    broll.push({ from: f, dur: d, kind: "video", src: pool.length ? pool[pi % pool.length] : null, pip: false });
    pi++; f += d;
  }
}
const brollF = broll.filter(b => b.src);
brollF.sort((x, y) => x.from - y.from);

const cues = { slug: SLUG, fps: FPS, width: 1920, height: 1080, durationInFrames, audioSrc: `${SLUG}.mp3`, avatarSrc: `${SLUG}_avatar.mp4`, avatarSegs, broll: brollF, overlays, components };
fs.writeFileSync(path.join(ROOT, "src", "VideoEdit", "data", `cues_${SLUG}.json`), JSON.stringify(cues, null, 2));
fs.mkdirSync(path.join(ROOT, "_v3"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "_v3", `${SLUG}_avatarcuts.json`), JSON.stringify(avatarCuts, null, 2));
const bf = brollF.reduce((s, b) => s + b.dur, 0);
const qr = overlays.filter((o) => o.comp === "QRTag").length;
const avf = avatarSegs.reduce((s, a) => s + a.dur, 0);
console.log(`pool b-roll: ${pool.length} clips`);
console.log(`avatar ${avatarSegs.length}/${avatarBeats.length} segs ~${Math.round(avf / FPS)}s${avatarMiss.length ? " MISS: " + avatarMiss.join(" | ") : ""}`);
console.log(`componentes ${components.length}/${compBeats.length}${compMiss.length ? " MISS: " + compMiss.join(" | ") : ""}`);
console.log(`overlays ${overlays.length}/${ovBeats.length} (QR ${qr})${ovMiss.length ? " MISS: " + ovMiss.join(" | ") : ""}`);
console.log(`b-roll ${brollF.length} ~${Math.round(bf / FPS)}s = ${Math.round(bf / durationInFrames * 100)}%`);
console.log(`TOTAL ${components.length + overlays.length + brollF.length + avatarSegs.length} beats · ${(durationInFrames / FPS / 60).toFixed(1)} min`);
