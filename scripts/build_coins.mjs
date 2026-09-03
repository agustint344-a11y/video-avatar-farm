/**
 * FASE 7 — BUILD "coins" (Attic Fortune · Walt Hargrove) — 10 old coins & bills worth thousands.
 *   node scripts/build_coins.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "coins";
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
  ["worth more than your car", 5, "BigStat", { theme: T, eyebrow: "ONE OLD COIN", prefix: "$", value: 4000, suffix: "?", support: "what a single old coin can sell for" }],
  ["Old, scarce, and in the right", 6, "Checklist", { theme: T, title: "Why coins pay", items: ["Old — it doesn't rust or rot, it just waits", "Scarce — key dates & low mintages", "Right condition — and never cleaned"] }],
  ["come down to a single letter", 6, "Compare", { theme: T, title: "Common vs. key date", left: { label: "COMMON", sub: "a few cents over face value" }, right: { label: "KEY DATE", sub: "hundreds into the thousands" } }],
  ["sort your wheat pennies by date", 6, "Checklist", { theme: T, title: "Spotting a valuable coin", items: ["Read the date → hunt the key years", "Find the mint mark (D, S, CC…)", "Grade the condition — don't clean it!"], stamp: "#10" }],
  ["there is nothing junk about it", 7, "MythVsTruth", { theme: T, mythLabel: "Myth", truthLabel: "Truth", myth: "It's just a jar of old change, worth face value.", truth: "Every dime, quarter & half from 1964 or older is 90% real silver — worth many times its face, and climbing. Most folks never check." }],
  ["worth thousands even in worn shape", 5, "BigStat", { theme: T, eyebrow: "KEY-DATE SILVER DOLLAR", prefix: "$", value: 4000, suffix: "+", support: "the right date & mint mark" }],
  ["run it back real quick", 8, "Checklist", { theme: T, title: "The tells — quick recap", items: ["Read the date; hunt the key years", "Find the mint mark — D, S, CC", "1964 & older = real silver", "Look close for doubling & errors", "Never clean it; check its worth first"] }],
  ["And now, now you know", 6, "PullQuote", { theme: T, quote: "The difference between dumping a fortune into a coin machine and cashing it in isn't luck. It's knowing.", author: "Walt Hargrove" }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["spent better than forty years", 5, "LowerThird", { theme: T, accentText: "ATTIC FORTUNE", title: "Walt Hargrove", sub: "40+ years of coins, barns & estate sales" }],
  // section titles #10 → #1
  ["The old wheat penny", 4, "SectionTitle", { theme: T, eyebrow: "#10", title: "The Wheat Penny" }],
  ["The buffalo nickel", 4, "SectionTitle", { theme: T, eyebrow: "#9", title: "The Buffalo Nickel" }],
  ["The old silver dime", 4, "SectionTitle", { theme: T, eyebrow: "#8", title: "The Silver Dime" }],
  ["the pile of 90", 4, "SectionTitle", { theme: T, eyebrow: "#7", title: "The 90% Silver Pile" }],
  ["The silver dollar", 4, "SectionTitle", { theme: T, eyebrow: "#6", title: "The Silver Dollar" }],
  ["The old gold coin", 4, "SectionTitle", { theme: T, eyebrow: "#5", title: "The Gold Coin" }],
  ["The odd old copper", 4, "SectionTitle", { theme: T, eyebrow: "#4", title: "Odd Old Copper" }],
  ["the air coin", 4, "SectionTitle", { theme: T, eyebrow: "#3", title: "The Error Coin" }],
  ["The old paper money", 4, "SectionTitle", { theme: T, eyebrow: "#2", title: "Old Paper Money" }],
  ["number one is not one particular", 4.5, "SectionTitle", { theme: T, eyebrow: "#1", title: "The Whole Jar" }],
  // stat chips
  ["look on the back, at the bottom", 4.5, "StatChip", { theme: T, prefix: "$", value: 700, suffix: "+", label: "1909-S VDB penny", corner: "tr" }],
  ["the one you want above all", 4.5, "StatChip", { theme: T, prefix: "$", value: 1000, suffix: "+", label: "1916-D Mercury dime", corner: "tr" }],
  ["hundreds to a couple thousand dollars each", 4.5, "StatChip", { theme: T, prefix: "$", value: 1800, suffix: "+", label: "pre-1933 gold, just as metal", corner: "tr" }],
  // keyword pops
  ["look for the little mint mark", 3.2, "KeywordPop", { theme: T, word: "THE MINT MARK", sub: "one tiny letter = real money", pos: "center" }],
  ["the big mint mark", 3.2, "KeywordPop", { theme: T, word: "WAR NICKEL", sub: "1942–45 = 35% silver", pos: "bottom" }],
  ["look close at the front, and you'll see", 3.4, "KeywordPop", { theme: T, word: "DOUBLED DIE", sub: "the letters look printed twice", pos: "center" }],
  // warnings
  ["you do not spend that", 5, "Callout", { theme: T, label: "Caution", icon: "🚫", title: "Never spend an old gold coin", sub: "small, heavy & yellow = find out first", tone: "warn" }],
  ["do not clean your old coins", 5, "Callout", { theme: T, label: "Caution", icon: "🧽", title: "Never clean a coin", sub: "a cleaned coin can lose half its value", tone: "warn" }],
  // CTAs
  ["Point your phone at that code", 6.5, "SplitInfo", { eyebrow: "FREE GUIDE", title: "The Attic Fortune Handbook", items: ["Key dates, mint marks & error coins", "Real value ranges for 60+ items", "Coins, bills, tools, cast iron & more"] }],
  ["this is a good spot to remind you", 6.5, "SplitInfo", { eyebrow: "GRAB IT FIRST", title: "The Attic Fortune Handbook", items: ["Know what it's worth before you sell", "Real sold-price ranges", "Plain English, no coin-dealer jargon"] }],
  ["everything I showed you today", 6.5, "SplitInfo", { eyebrow: "EVERYTHING INSIDE", title: "The Attic Fortune Handbook", items: ["Every key date & mint mark", "Coins, bills, tools & cast iron", "Link pinned in the comments"] }],
  // QR overlays
  ["ten old coins and bills", 7, "QRTag", { ...QR }],
  ["Point your phone at that code", 8, "QRTag", { ...QR }],
  ["The buffalo nickel", 7, "QRTag", { ...QR }],
  ["this is a good spot to remind you", 8, "QRTag", { ...QR }],
  ["The old gold coin", 7, "QRTag", { ...QR }],
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
