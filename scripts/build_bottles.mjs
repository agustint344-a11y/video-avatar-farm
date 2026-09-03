/**
 * FASE 7 — BUILD "bottles" (Attic Fortune · Walt Hargrove) — 10 old bottles & jars worth a fortune.
 *   node scripts/build_bottles.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "bottles";
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
  ["worth more than everything else in that cellar", 5, "BigStat", { theme: T, eyebrow: "ONE OLD BOTTLE", prefix: "$", value: 4000, suffix: "?", support: "what a single old bottle can sell for" }],
  ["colorful, and hard to find", 6, "Checklist", { theme: T, title: "Why old bottles pay", items: ["Hand-made — blown one at a time", "Colorful — cobalt, amber, teal, puce", "Hard to find — glass breaks over 100 years"] }],
  ["with bottles, damage is everything", 7, "MythVsTruth", { theme: T, mythLabel: "Myth", truthLabel: "Truth", myth: "A dirty old bottle with no cap is worthless junk.", truth: "One embossed or colored bottle from that box can sell to a collector for over $4,000. Dirt washes off — it's chips & cracks that kill the value." }],
  ["two secret words that tell you", 6, "Checklist", { theme: T, title: "How to date a bottle", items: ["Pontil — a rough scar on the base = pre-1860", "Whittle — a wavy, bumpy surface = early", "Color & embossing = the money"] }],
  ["embossed on the side", 6, "Checklist", { theme: T, title: "Spotting a valuable bottle", items: ["Hold it to the light — read the color", "Feel the base for a pontil scar", "Read the embossing: name, town, 'Cure'"], stamp: "#10" }],
  ["some of the most valuable bottles", 5, "BigStat", { theme: T, eyebrow: "RARE FIGURAL BITTERS", prefix: "$", value: 10000, suffix: "+", support: "a cabin or barrel in the right color" }],
  ["run it back real quick", 8, "Checklist", { theme: T, title: "The tells — quick recap", items: ["Color: cobalt, amber, teal & puce win", "Feel the base for a pontil scar", "Read the embossing — name & town", "Shape: figural bottles are prizes", "Check the lip & base for damage"] }],
  ["hauls a fortune to the dump", 6, "PullQuote", { theme: T, quote: "The difference between hauling a fortune to the dump and cashing it in isn't luck. It's knowing.", author: "Walt Hargrove" }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["spent better than forty years", 5, "LowerThird", { theme: T, accentText: "ATTIC FORTUNE", title: "Walt Hargrove", sub: "40+ years of cellars, dumps & barn finds" }],
  // section titles #10 → #1
  ["The embossed medicine bottle", 4, "SectionTitle", { theme: T, eyebrow: "#10", title: "The Medicine Bottle" }],
  ["The bitters bottle", 4, "SectionTitle", { theme: T, eyebrow: "#9", title: "The Bitters Bottle" }],
  ["The old soda and mineral water", 4, "SectionTitle", { theme: T, eyebrow: "#8", title: "The Soda Bottle" }],
  ["The historical flask", 4, "SectionTitle", { theme: T, eyebrow: "#7", title: "The Historical Flask" }],
  ["The poison bottle", 4, "SectionTitle", { theme: T, eyebrow: "#6", title: "The Poison Bottle" }],
  ["The ink bottle", 4, "SectionTitle", { theme: T, eyebrow: "#5", title: "The Ink Bottle" }],
  ["The fruit jar", 4, "SectionTitle", { theme: T, eyebrow: "#4", title: "The Fruit Jar" }],
  ["The barber bottle", 4, "SectionTitle", { theme: T, eyebrow: "#3", title: "The Barber Bottle" }],
  ["The milk bottle", 4, "SectionTitle", { theme: T, eyebrow: "#2", title: "The Milk Bottle" }],
  ["number one is not one particular", 4.5, "SectionTitle", { theme: T, eyebrow: "#1", title: "The Whole Cellar" }],
  // stat chips
  ["a rare figural one", 4.5, "StatChip", { theme: T, prefix: "$", value: 5000, suffix: "+", label: "figural bitters bottles", corner: "tr" }],
  ["with an eagle or a portrait", 4.5, "StatChip", { theme: T, prefix: "$", value: 2000, suffix: "+", label: "early historical flasks", corner: "tr" }],
  ["a rare colored fruit jar", 4.5, "StatChip", { theme: T, prefix: "$", value: 1000, suffix: "+", label: "rare colored fruit jars", corner: "tr" }],
  // keyword pops
  ["a rough, sharp scar right in the center", 3.2, "KeywordPop", { theme: T, word: "PONTIL MARK", sub: "hand-blown before ~1860", pos: "center" }],
  ["turn it in the light and read", 3.2, "KeywordPop", { theme: T, word: "READ THE GLASS", sub: "name, town & 'Cure' = money", pos: "bottom" }],
  ["run your fingers around the lip", 3.4, "KeywordPop", { theme: T, word: "CHECK FOR DAMAGE", sub: "a chip kills the value", pos: "center" }],
  // warnings
  ["a chip or a crack can take", 5, "Callout", { theme: T, label: "Caution", icon: "⚠️", title: "Damage is everything", sub: "a chip or crack can wipe 90% of the value", tone: "warn" }],
  ["do not go scrubbing hard", 5, "Callout", { theme: T, label: "Caution", icon: "🧽", title: "Don't scrub it — and don't toss it", sub: "dirt washes off gentle; check its worth first", tone: "warn" }],
  // CTAs
  ["Point your phone at that code", 6.5, "SplitInfo", { eyebrow: "FREE GUIDE", title: "The Attic Fortune Handbook", items: ["Colors, makers, embossing & tops", "Real value ranges for 60+ items", "Bottles, jars, coins, tools & more"] }],
  ["this is a good spot to remind you", 6.5, "SplitInfo", { eyebrow: "GRAB IT FIRST", title: "The Attic Fortune Handbook", items: ["Know what it's worth before you sell", "Real sold-price ranges", "Plain English, no collector jargon"] }],
  ["everything I showed you today", 6.5, "SplitInfo", { eyebrow: "EVERYTHING INSIDE", title: "The Attic Fortune Handbook", items: ["Every color, maker & mark", "Bottles, jars, coins & tools", "Link pinned in the comments"] }],
  // QR overlays
  ["ten old bottles and jars", 7, "QRTag", { ...QR }],
  ["Point your phone at that code", 8, "QRTag", { ...QR }],
  ["The bitters bottle", 7, "QRTag", { ...QR }],
  ["this is a good spot to remind you", 8, "QRTag", { ...QR }],
  ["The poison bottle", 7, "QRTag", { ...QR }],
  ["everything I showed you today", 8, "QRTag", { ...QR }],
  ["hit that subscribe button", 7, "QRTag", { ...QR }],
];
const overlays = [];
const ovMiss = [];
for (const [a, d, comp, props] of ovBeats) { const from = at(a); if (from == null) { ovMiss.push(a); continue; } if (comp !== "QRTag" && inComp(from)) { ovMiss.push(`${a} (comp)`); continue; } overlays.push({ from, dur: sec(d), comp, props }); }
overlays.sort((x, y) => x.from - y.from);

const IMGMAP = JSON.parse(fs.existsSync(path.join(ROOT, "_v3", `${SLUG}_imgmap.json`)) ? fs.readFileSync(path.join(ROOT, "_v3", `${SLUG}_imgmap.json`), "utf8").replace(/^﻿/, "") : "{}");
const stock = fs.existsSync(path.join(ROOT, "_v3", `${SLUG}_needstock.json`)) ? JSON.parse(fs.readFileSync(path.join(ROOT, "_v3", `${SLUG}_needstock.json`), "utf8").replace(/^﻿/, "")) : [];
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
