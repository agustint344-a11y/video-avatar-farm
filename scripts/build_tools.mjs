/**
 * FASE 7 — BUILD "tools" (Attic Fortune · Walt Hargrove) — 10 rusty tools in your garage worth thousands.
 *   node scripts/build_tools.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "tools";
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
  ["worth more than every power tool", 5, "BigStat", { theme: T, eyebrow: "ONE RUSTY WRENCH", prefix: "$", value: 2000, suffix: "?", support: "what a single old tool can sell for" }],
  ["old well made and hard to find", 6, "Checklist", { theme: T, title: "Why old tools pay", items: ["Old — hand-built to last three lifetimes", "Well-made — tighter than anything new", "Hard to find — the good ones got scarce"] }],
  ["built by hand out of good steel", 6, "Compare", { theme: T, title: "Old vs. new tools", left: { label: "OLD", sub: "hand-forged good steel, built to last" }, right: { label: "NEW", sub: "stamped, plastic, throwaway" } }],
  ["the knob the tote", 6, "Checklist", { theme: T, title: "Spotting a valuable plane", items: ["Maker's name stamped on the metal", "Complete: blade, knob & tote (handle)", "Rust is fine — missing parts are not"], stamp: "#10" }],
  ["sell a whole box of junk", 7, "MythVsTruth", { theme: T, mythLabel: "Myth", truthLabel: "Truth", myth: "It's a box of rusty junk worth five dollars.", truth: "One marked wrench in that box can sell to a collector for over $2,000. Most folks never look." }],
  ["a heavy old tool chest full", 5, "BigStat", { theme: T, eyebrow: "MACHINIST TOOL CHEST", prefix: "$", value: 1000, suffix: "+", support: "a full chest of precision tools" }],
  ["flip it over and look for the maker", 8, "Checklist", { theme: T, title: "The tells — quick recap", items: ["Flip it over → find the maker's name", "Hunt for a patent date", "Check it's complete — all parts there", "Don't fear rust; fear missing pieces", "Read every wrench, plane & level"] }],
  ["and now you know", 6, "PullQuote", { theme: T, quote: "The difference between tossing a $2,000 wrench and cashing it in isn't luck. It's knowing.", author: "Walt Hargrove" }],
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
  // section titles
  ["number ten the hand plane", 4, "SectionTitle", { theme: T, eyebrow: "#10", title: "The Hand Plane" }],
  ["number nine the adjustable wrench", 4, "SectionTitle", { theme: T, eyebrow: "#9", title: "The Adjustable Wrench" }],
  ["number eight the axe head", 4, "SectionTitle", { theme: T, eyebrow: "#8", title: "The Axe Head" }],
  ["number seven the level", 4, "SectionTitle", { theme: T, eyebrow: "#7", title: "The Level" }],
  ["number six the brace and the hand drill", 4, "SectionTitle", { theme: T, eyebrow: "#6", title: "The Brace & Hand Drill" }],
  ["number five the blacksmith", 4, "SectionTitle", { theme: T, eyebrow: "#5", title: "Blacksmith & Farrier Tools" }],
  ["number four the machinist", 4, "SectionTitle", { theme: T, eyebrow: "#4", title: "The Machinist's Chest" }],
  ["number three the specialty wrench", 4, "SectionTitle", { theme: T, eyebrow: "#3", title: "The Specialty Wrench" }],
  ["number two the wooden folding rule", 4, "SectionTitle", { theme: T, eyebrow: "#2", title: "The Folding Rule" }],
  ["number one is the whole rusty greasy", 4.5, "SectionTitle", { theme: T, eyebrow: "#1", title: "Your Whole Garage" }],
  // stat chips (values)
  ["run into the hundreds and the truly rare", 4.5, "StatChip", { theme: T, prefix: "$", value: 600, suffix: "+", label: "quality hand planes", corner: "tr" }],
  ["20 to 250", 4.5, "StatChip", { theme: T, prefix: "$", value: 250, label: "early marked wrenches", corner: "tr" }],
  ["30 up to 300", 4.5, "StatChip", { theme: T, prefix: "$", value: 300, label: "antique wood & brass levels", corner: "tr" }],
  // keyword pops
  ["read the handles", 3.2, "KeywordPop", { theme: T, word: "READ THE HANDLES", sub: "the marks are where the money is", pos: "bottom" }],
  ["that little stamp is like a birth certificate", 3.4, "KeywordPop", { theme: T, word: "PATENT DATE", sub: "the tool's birth certificate", pos: "center" }],
  ["the whole garage and barn", 3.2, "KeywordPop", { theme: T, word: "CHECK ITS WORTH", sub: "before you toss it", pos: "center" }],
  // warnings (Callout overlay)
  ["never ever throw a hand plane", 5, "Callout", { theme: T, label: "Caution", icon: "🚫", title: "Never scrap a hand plane", sub: "rusty is fine — missing parts kill the value", tone: "warn" }],
  ["do not clean these tools up before you know", 5, "Callout", { theme: T, label: "Caution", icon: "🧽", title: "Don't clean it before you know", sub: "that honest wear is part of the value", tone: "warn" }],
  // CTAs — tarjeta lateral con Walt visible
  ["point your phone at that code", 6.5, "SplitInfo", { eyebrow: "FREE GUIDE", title: "The Attic Fortune Handbook", items: ["60+ items with real value ranges", "How to read maker's marks & patent dates", "Tools, cast iron, lanterns, coins & more"] }],
  ["this is a good spot to remind you", 6.5, "SplitInfo", { eyebrow: "GRAB IT FIRST", title: "The Attic Fortune Handbook", items: ["Know what it's worth before you sell", "Real sold-price ranges", "Plain English, no jargon"] }],
  ["everything i showed you today", 6.5, "SplitInfo", { eyebrow: "EVERYTHING INSIDE", title: "The Attic Fortune Handbook", items: ["The 7 goldmine categories", "How to read every mark", "Link pinned in the comments"] }],
  // QR overlays — 6-7 apariciones
  ["the ten old tools hiding", 7, "QRTag", { ...QR }],
  ["point your phone at that code", 8, "QRTag", { ...QR }],
  ["number six the brace and the hand drill", 7, "QRTag", { ...QR }],
  ["this is a good spot to remind you", 8, "QRTag", { ...QR }],
  ["number three the specialty wrench", 7, "QRTag", { ...QR }],
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
