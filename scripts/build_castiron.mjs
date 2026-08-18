/**
 * FASE 7 — BUILD "castiron" (Attic Fortune · Walt Hargrove) — 10 rusty cast iron pans worth thousands.
 * Estilo dopamínico (PiP + kit + tema EARTH). QR de la landing 6-7 veces.
 *   node scripts/build_castiron.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "castiron";
const FPS = 30;
const T = "earth";
const QR = { theme: T, src: "img/qr_attic.png", eyebrow: "SCAN THE CODE", label: "Free guide · link below", corner: "bl" };
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", `captions_${SLUG}.json`), "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
const cn = caps.map((w) => norm(w.text));
const at = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let i = 0; i + N <= cn.length; i++) { let ok = 1; for (let j = 0; j < N; j++) if (cn[i + j] !== t[j]) { ok = 0; break; } if (ok) return Math.round(caps[i].startMs / 1000 * FPS); } return null; };
const sec = (n) => Math.round(n * FPS);
const durationInFrames = Math.round(caps[caps.length - 1].endMs / 1000 * FPS) + sec(1);

// ---------- FULL-SCREEN COMPONENTS ----------
const compBeats = [
  ["worth more than everything else on the shelf", 5, "BigStat", { theme: T, eyebrow: "A SINGLE RUSTY PAN", prefix: "$", value: 8000, suffix: "?", support: "what a rare skillet can sell for" }],
  ["old well made and hard to find", 6, "Checklist", { theme: T, title: "Why cast iron pays", items: ["Old — they don't make it like this anymore", "Well-made — smooth, balanced, built to last", "Hard to find — the good ones got scarce"] }],
  ["make it like they used to", 6, "Compare", { theme: T, title: "Old vs. new cast iron", left: { label: "OLD (pre-1960)", sub: "ground smooth as glass, made to last a lifetime" }, right: { label: "NEW", sub: "rough, pebbly, mass-produced" } }],
  ["flip it feel it smooth is gold", 6, "Checklist", { theme: T, title: "The smooth-bottom test", items: ["Flip the pan over", "Run your fingers across the bottom", "Smooth as glass = old & valuable"], stamp: "#10" }],
  ["snap a picture of that mark", 8, "Steps", { theme: T, eyebrow: "THE PHONE TRICK", title: "Value any mark in 10 seconds", steps: [{ title: "Snap the maker's mark", sub: "zoom in nice and close" }, { title: "Search the exact words", sub: "and add the word 'sold'" }, { title: "Read the SOLD prices", sub: "what buyers actually paid" }] }],
  ["something you could lose in your coat pocket", 5, "BigStat", { theme: T, eyebrow: "TOY / SALESMAN SKILLET", prefix: "$", value: 500, support: "for a pan that fits in your palm" }],
  ["sitting in a bucket of rust ignored", 7, "MythVsTruth", { theme: T, mythLabel: "Myth", truthLabel: "Truth", myth: "Looks like a rusty old piece of junk on three legs.", truth: "A real spider skillet can sell for well over $8,000. Most folks toss it without a second look." }],
  ["flip it over feel for a smooth bottom", 8, "Checklist", { theme: T, title: "The tells — quick recap", items: ["Smooth bottom + heat ring", "Gate mark = real antique", "Odd size numbers", "Maker's name → search SOLD", "Toy & gem pans", "Spider skillet = jackpot", "Never toss unmarked · never over-clean"] }],
  ["it's knowing and now you know", 6, "PullQuote", { theme: T, quote: "The difference between tossing an $8,000 pan and cashing it in isn't luck. It's knowing.", author: "Walt Hargrove" }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

// ---------- OVERLAYS ----------
const ovBeats = [
  ["digging through barns", 5, "LowerThird", { theme: T, accentText: "ATTIC FORTUNE", title: "Walt Hargrove", sub: "40+ years of barn sales & finds" }],
  ["before you toss it check its worth", 3.4, "KeywordPop", { theme: T, word: "CHECK ITS WORTH", sub: "before you toss it", pos: "bottom" }],
  // section titles #10 -> #1
  ["the smooth bottom skillet", 4, "SectionTitle", { theme: T, eyebrow: "#10", title: "The Smooth Bottom" }],
  ["look for a raised ring", 4, "SectionTitle", { theme: T, eyebrow: "#9", title: "The Heat Ring" }],
  ["the gate mark", 4, "SectionTitle", { theme: T, eyebrow: "#8", title: "The Gate Mark" }],
  ["the odd size number", 4, "SectionTitle", { theme: T, eyebrow: "#7", title: "The Odd Size Number" }],
  ["the name on the bottom", 4, "SectionTitle", { theme: T, eyebrow: "#6", title: "The Maker's Name" }],
  ["the toy skillet", 4, "SectionTitle", { theme: T, eyebrow: "#5", title: "The Toy Skillet" }],
  ["the gem pan and the muffin pan", 4, "SectionTitle", { theme: T, eyebrow: "#4", title: "Gem & Muffin Pans" }],
  ["the spider skillet", 4, "SectionTitle", { theme: T, eyebrow: "#3", title: "The Spider Skillet" }],
  ["the unmarked early skillet", 4, "SectionTitle", { theme: T, eyebrow: "#2", title: "The Unmarked Skillet" }],
  ["number one is the whole rusty", 4.5, "SectionTitle", { theme: T, eyebrow: "#1", title: "Your Whole Barn" }],
  // stat chips
  ["world of difference", 4.5, "StatChip", { theme: T, prefix: "$", value: 300, label: "common pan → the right maker", corner: "tr" }],
  ["one of the oldest things", 4.5, "StatChip", { theme: T, prefix: "$", value: 600, label: "gate-marked antiques", corner: "tr" }],
  ["nice ornate gem pan", 4.5, "StatChip", { theme: T, prefix: "$", value: 400, label: "ornate gem pans", corner: "tr" }],
  // keyword pops
  ["folks actually paid", 3.2, "KeywordPop", { theme: T, word: "+ SOLD", sub: "search sold prices, not asking", pos: "center" }],
  ["sold for well over", 3.4, "KeywordPop", { theme: T, word: "$8,000+", sub: "a real spider skillet", pos: "center" }],
  // warnings (Callout es overlay)
  ["take a wire wheel to it", 5, "Callout", { theme: T, label: "Caution", icon: "🚫", title: "Never take a wire wheel to it", sub: "grinding off the patina grinds off the money", tone: "warn" }],
  ["do not throw out a pan just because", 5, "Callout", { theme: T, label: "Caution", icon: "⚠️", title: "Never toss an unmarked pan", sub: "some of the best iron has no name at all", tone: "warn" }],
  ["do not clean these pans up before you know", 5, "Callout", { theme: T, label: "Caution", icon: "🧽", title: "Don't clean it before you know", sub: "the patina IS the value — you can't put it back", tone: "warn" }],
  // CTAs (voz ya grabada) — tarjeta lateral con Walt visible
  ["point your phone at that code", 6.5, "SplitInfo", { eyebrow: "FREE GUIDE", title: "The Attic Fortune Handbook", items: ["60+ items with real value ranges", "How to read maker's marks & spot fakes", "Tools, lanterns, coins & more"] }],
  ["let me take one quick second", 6.5, "SplitInfo", { eyebrow: "GRAB IT FIRST", title: "The Attic Fortune Handbook", items: ["Know what it's worth before you sell", "Real sold-price ranges", "Plain English, no jargon"] }],
  ["everything i showed you today", 6.5, "SplitInfo", { eyebrow: "EVERYTHING INSIDE", title: "The Attic Fortune Handbook", items: ["The 7 goldmine categories", "How to read every mark", "Link pinned in the comments"] }],
  // QR overlays (esquina) — 6-7 apariciones
  ["cast iron pans hiding", 7, "QRTag", { ...QR }],
  ["point your phone at that code", 8, "QRTag", { ...QR }],
  ["the name on the bottom", 7, "QRTag", { ...QR }],
  ["let me take one quick second", 8, "QRTag", { ...QR }],
  ["sold for well over", 7, "QRTag", { ...QR }],
  ["everything i showed you today", 8, "QRTag", { ...QR }],
  ["hit that subscribe button", 7, "QRTag", { ...QR }],
];
const overlays = [];
const ovMiss = [];
for (const [a, d, comp, props] of ovBeats) { const from = at(a); if (from == null) { ovMiss.push(a); continue; } if (comp !== "QRTag" && inComp(from)) { ovMiss.push(`${a} (comp)`); continue; } overlays.push({ from, dur: sec(d), comp, props }); }
overlays.sort((x, y) => x.from - y.from);

// ---------- B-ROLL (stock videos + fotos via imgmap) ----------
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
