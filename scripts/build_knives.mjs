/**
 * FASE 7 — BUILD "knives" (Attic Fortune · Walt Hargrove) — 10 old knives worth thousands.
 *   node scripts/build_knives.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "knives";
const FPS = 30;
const T = "earth";
const QR = { theme: T, src: "img/qr_attic.png", eyebrow: "SCAN THE CODE", label: "Free guide · link below", corner: "bl" };
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", `captions_${SLUG}.json`), "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
const cn = caps.map((w) => norm(w.text));
const at = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let i = 0; i + N <= cn.length; i++) { let ok = 1; for (let j = 0; j < N; j++) if (cn[i + j] !== t[j]) { ok = 0; break; } if (ok) return Math.round(caps[i].startMs / 1000 * FPS); } return null; };
const sec = (n) => Math.round(n * FPS);
const durationInFrames = Math.round(caps[caps.length - 1].endMs / 1000 * FPS) + sec(1);

const compBeats = [
  ["worth more than everything else in that drawer", 5, "BigStat", { theme: T, eyebrow: "ONE OLD KNIFE", prefix: "$", value: 4000, suffix: "?", support: "what a single old knife can sell for" }],
  ["old well made and hard to find", 6, "Checklist", { theme: T, title: "Why old knives pay", items: ["Old — carried & made by hand", "Well-made — good steel, bone & stag", "Hard to find — collectors hunt them hard"] }],
  ["made them by hand out of good steel", 6, "Compare", { theme: T, title: "Old vs. new knives", left: { label: "OLD", sub: "good steel, bone/stag/pearl handles" }, right: { label: "NEW", sub: "stamped steel, plastic handles" } }],
  ["open it up and read the tang", 6, "Checklist", { theme: T, title: "Spotting a valuable knife", items: ["Open it up → read the tang stamp", "Respected maker = real money", "Check the handle: bone, stag, pearl"], stamp: "#10" }],
  ["sell a whole cigar box of old knives", 7, "MythVsTruth", { theme: T, mythLabel: "Myth", truthLabel: "Truth", myth: "It's a cigar box of rusty old knives worth ten dollars.", truth: "One marked knife in that box can sell to a collector for over $4,000. Most folks never look." }],
  ["a couple hundred dollars into the thousands", 5, "BigStat", { theme: T, eyebrow: "CUSTOM / HANDMADE KNIFE", prefix: "$", value: 2000, suffix: "+", support: "the right maker's handmade knife" }],
  ["learn the patterns the shape tells", 8, "Checklist", { theme: T, title: "The tells — quick recap", items: ["Open it → read the tang stamp", "Learn the patterns; shape = value", "Bone, stag & pearl beat plastic", "Watch for military & advertising marks", "Rust is fine — a broken blade is not"] }],
  ["and now you know", 6, "PullQuote", { theme: T, quote: "The difference between tossing a $4,000 knife and cashing it in isn't luck. It's knowing.", author: "Walt Hargrove" }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["digging through barns", 5, "LowerThird", { theme: T, accentText: "ATTIC FORTUNE", title: "Walt Hargrove", sub: "40+ years of barn sales & finds" }],
  ["look real close at the blade", 4, "SectionTitle", { theme: T, eyebrow: "#10", title: "The Marked Pocketknife" }],
  ["number nine the bowie", 4, "SectionTitle", { theme: T, eyebrow: "#9", title: "The Bowie & Hunting Knife" }],
  ["number eight the straight razor", 4, "SectionTitle", { theme: T, eyebrow: "#8", title: "The Straight Razor" }],
  ["the classic patterns", 4, "SectionTitle", { theme: T, eyebrow: "#7", title: "The Classic Patterns" }],
  ["a whole bunch of blades", 4, "SectionTitle", { theme: T, eyebrow: "#6", title: "The Multi-Blade Knife" }],
  ["the military knife", 4, "SectionTitle", { theme: T, eyebrow: "#5", title: "The Military Knife" }],
  ["the kitchen and butcher", 4, "SectionTitle", { theme: T, eyebrow: "#4", title: "Kitchen & Butcher Blades" }],
  ["the custom or handmade", 4, "SectionTitle", { theme: T, eyebrow: "#3", title: "The Custom / Handmade Knife" }],
  ["the advertising and premium", 4, "SectionTitle", { theme: T, eyebrow: "#2", title: "The Advertising Knife" }],
  ["number one is the whole rusty", 4.5, "SectionTitle", { theme: T, eyebrow: "#1", title: "Your Whole Drawer" }],
  // stat chips
  ["those run into the hundreds", 4.5, "StatChip", { theme: T, prefix: "$", value: 300, suffix: "+", label: "the right maker & pattern", corner: "tr" }],
  ["complete with its original sheath", 4.5, "StatChip", { theme: T, prefix: "$", value: 500, label: "marked hunting knives", corner: "tr" }],
  // keyword pops
  ["the maker stamped their name", 3.2, "KeywordPop", { theme: T, word: "READ THE TANG", sub: "the maker's stamp is everything", pos: "bottom" }],
  ["the shape matters the pattern matters", 3.2, "KeywordPop", { theme: T, word: "THE PATTERN", sub: "shape tells the story", pos: "center" }],
  // warnings
  ["do not throw it out", 5, "Callout", { theme: T, label: "Caution", icon: "🚫", title: "Never toss the old razor", sub: "marked razors with fancy handles sell strong", tone: "warn" }],
  ["do not clean or sharpen these old knives", 5, "Callout", { theme: T, label: "Caution", icon: "🧽", title: "Don't clean or sharpen it", sub: "the original blade & patina IS the value", tone: "warn" }],
  // CTAs
  ["point your phone at that code", 6.5, "SplitInfo", { eyebrow: "FREE GUIDE", title: "The Attic Fortune Handbook", items: ["60+ items with real value ranges", "How to read maker's marks & tang stamps", "Knives, tools, cast iron, coins & more"] }],
  ["this is a good spot to remind you", 6.5, "SplitInfo", { eyebrow: "GRAB IT FIRST", title: "The Attic Fortune Handbook", items: ["Know what it's worth before you sell", "Real sold-price ranges", "Plain English, no jargon"] }],
  ["everything i showed you today", 6.5, "SplitInfo", { eyebrow: "EVERYTHING INSIDE", title: "The Attic Fortune Handbook", items: ["The 7 goldmine categories", "How to read every mark", "Link pinned in the comments"] }],
  // QR overlays
  ["the ten old knives hiding", 7, "QRTag", { ...QR }],
  ["point your phone at that code", 8, "QRTag", { ...QR }],
  ["a whole bunch of blades", 7, "QRTag", { ...QR }],
  ["this is a good spot to remind you", 8, "QRTag", { ...QR }],
  ["the custom or handmade", 7, "QRTag", { ...QR }],
  ["everything i showed you today", 8, "QRTag", { ...QR }],
  ["hit that subscribe button", 7, "QRTag", { ...QR }],
];
const overlays = [];
const ovMiss = [];
for (const [a, d, comp, props] of ovBeats) { const from = at(a); if (from == null) { ovMiss.push(a); continue; } if (comp !== "QRTag" && inComp(from)) { ovMiss.push(`${a} (comp)`); continue; } overlays.push({ from, dur: sec(d), comp, props }); }
overlays.sort((x, y) => x.from - y.from);

const IMGMAP = JSON.parse(fs.existsSync(path.join(ROOT, "_v3", `${SLUG}_imgmap.json`)) ? fs.readFileSync(path.join(ROOT, "_v3", `${SLUG}_imgmap.json`), "utf8").replace(/^﻿/, "") : "{}");
const stock = JSON.parse(fs.readFileSync(path.join(ROOT, "_v3", `${SLUG}_needstock.json`), "utf8").replace(/^﻿/, ""));
const CAP_VID = sec(9), CAP_IMG = sec(6.5), MIN = sec(1.8);
const cands = [];
for (const it of stock) {
  const from = at(it.anchor); if (from == null) continue;
  const imgFile = IMGMAP[it.name];
  if (imgFile && fs.existsSync(path.join(ROOT, "public", "img", imgFile))) cands.push({ from, name: it.name, kind: "image", src: `img/${imgFile}`, cap: CAP_IMG });
  else { const vid = path.join(ROOT, "public", "broll", `${SLUG}_${it.name}.mp4`); if (fs.existsSync(vid)) cands.push({ from, name: it.name, kind: "video", src: `broll/${SLUG}_${it.name}.mp4`, cap: CAP_VID }); }
}
cands.sort((a, b) => a.from - b.from);
const uniq = []; for (const c of cands) if (!uniq.length || c.from - uniq[uniq.length - 1].from > sec(0.5)) uniq.push(c);
const broll = []; const brollMiss = [];
for (let i = 0; i < uniq.length; i++) { const c = uniq[i]; if (inComp(c.from)) { brollMiss.push(`${c.name}(comp)`); continue; } const nextB = i + 1 < uniq.length ? uniq[i + 1].from : Infinity; const dur = Math.min(c.cap, nextB - c.from, nextCompStart(c.from) - c.from); if (dur < MIN) { brollMiss.push(`${c.name}(sliver)`); continue; } broll.push({ from: c.from, dur, kind: c.kind, src: c.src }); }

const cues = { slug: SLUG, fps: FPS, width: 1920, height: 1080, durationInFrames, broll, overlays, components };
fs.mkdirSync(path.join(ROOT, "src", "VideoEdit", "data"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "src", "VideoEdit", "data", `cues_${SLUG}.json`), JSON.stringify(cues, null, 2));
const bf = broll.reduce((s, b) => s + b.dur, 0);
const total = components.length + overlays.length + broll.length;
console.log(`✓ components ${components.length}/${compBeats.length}${compMiss.length ? " MISS: " + compMiss.join(" | ") : ""}`);
console.log(`✓ overlays ${overlays.length}/${ovBeats.length}${ovMiss.length ? " MISS: " + ovMiss.join(" | ") : ""}`);
console.log(`✓ b-roll ${broll.length} ~${Math.round(bf / FPS)}s = ${Math.round(bf / durationInFrames * 100)}%${brollMiss.length ? " · miss: " + brollMiss.length : ""}`);
console.log(`✓ TOTAL ${total} beats en ${(durationInFrames / FPS / 60).toFixed(1)} min → 1 cada ${(durationInFrames / FPS / total).toFixed(0)}s`);
