/**
 * BUILD "pyrex-atticfortune" (Walt Hargrove) — listicle EN: old kitchenware worth a fortune. EARTH.
 * B-roll = imágenes Agnes (imgmap). QR ×6 (qr_attic). CTA = SplitInfo + QRTag.
 *   node scripts/build_pyrex_atticfortune.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "pyrex-atticfortune";
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
  ["some of that old kitchenware that", 5, "BigStat", { theme: T, eyebrow: "ONE OLD SET", prefix: "$", value: 1000, suffix: "?", support: "what a rare vintage set can bring" }],
  ["the pattern the color the", 6, "Checklist", { theme: T, title: "What decides the value", items: ["The pattern & the color", "Who made it — the maker", "Rarity + condition"] }],
  ["not how old it is", 7, "MythVsTruth", { theme: T, mythLabel: "Myth", truthLabel: "Truth", myth: "The older it is, the more it's worth.", truth: "Not quite. Value is about the pattern, the color, the maker and how rare that combination is — a one-year color can beat a plain antique." }],
  ["running everything through the dishwasher over", 6.5, "Compare", { theme: T, title: "Why condition is everything", left: { label: "Run through the dishwasher", sub: "faded — worth a fraction" }, right: { label: "Hand-washed, kept for good", sub: "bright — worth far more" } }],
  ["so how do you tell if yours", 8, "Steps", { theme: T, eyebrow: "HOW TO VALUE IT", title: "Check it in 4 steps", steps: [{ title: "Turn it over", sub: "look for the maker's mark" }, { title: "Color & pattern", sub: "compare to a reference — rare colors win" }, { title: "Condition & complete set?", sub: "chips, fading; is it the full set" }] }],
  ["the only difference between the", 6, "PullQuote", { theme: T, quote: "The only difference between the family that gave away a fortune in a donation box, and the family that cashed in, was one of them stopped and asked what is this, really.", author: "Walt Hargrove" }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["poking through attics basements estate sales", 5, "LowerThird", { theme: T, accentText: "ATTIC FORTUNE", title: "Walt Hargrove", sub: "40+ years appraising attic & kitchen finds" }],
  ["a single bowl that sells for", 3.6, "KeywordPop", { theme: T, word: "$1,000+", sub: "one old bowl", pos: "center" }],
  ["the whole reason i put together", 6.5, "SplitInfo", { eyebrow: "FREE GUIDE", title: "The Attic Fortune Guide", items: ["Makers, patterns & colors that matter", "Real sold-price ranges", "Kitchenware, jewelry, coins & more"] }],
  ["everything you need is in that guide", 6.5, "SplitInfo", { eyebrow: "GRAB IT FIRST", title: "The Attic Fortune Guide", items: ["Know what it's worth before you sell", "Spot the rare color vs the common one", "Plain English, no jargon"] }],
  ["grab it before you sell a", 6.5, "SplitInfo", { eyebrow: "EVERYTHING INSIDE", title: "The Attic Fortune Guide", items: ["Identify your pieces step by step", "What collectors pay right now", "Link pinned in the comments"] }],
  ["coming in at number ten", 4, "SectionTitle", { theme: T, eyebrow: "#10", title: "Everyday Ware & Jadite" }],
  ["at number nine the old stoneware", 4, "SectionTitle", { theme: T, eyebrow: "#9", title: "Stoneware Crocks & Jugs" }],
  ["number eight vintage cast iron", 4, "SectionTitle", { theme: T, eyebrow: "#8", title: "Vintage Cast Iron" }],
  ["number seven the old", 4, "SectionTitle", { theme: T, eyebrow: "#7", title: "Transferware & Serving" }],
  ["at number six and now we're", 4, "SectionTitle", { theme: T, eyebrow: "#6", title: "Promo & Short-Run Glass" }],
  ["number five the complete sets", 4, "SectionTitle", { theme: T, eyebrow: "#5", title: "Complete Sets" }],
  ["number four the pastel and unusual", 4, "SectionTitle", { theme: T, eyebrow: "#4", title: "Pastel Mixing Bowls" }],
  ["number three anything with a rare", 4, "SectionTitle", { theme: T, eyebrow: "#3", title: "Rare & Failed Patterns" }],
  ["at number two the pieces in mint", 4.5, "SectionTitle", { theme: T, eyebrow: "#2", title: "Mint + Original Sticker" }],
  ["and the number one thing in the", 4.5, "SectionTitle", { theme: T, eyebrow: "#1", title: "Rare Color + Full Set" }],
  ["check the marks and the", 3.6, "KeywordPop", { theme: T, word: "CHECK THE MARKS", sub: "who made it & when", pos: "center" }],
  ["condition is king in this world", 3.6, "KeywordPop", { theme: T, word: "CONDITION IS KING", sub: "bright & unchipped wins", pos: "center" }],
  ["do not take steel wool or", 5, "Callout", { theme: T, label: "Caution", icon: "🚫", title: "Don't harsh-scrub it", sub: "steel wool destroys the pattern & value", tone: "warn" }],
  ["breaking up a set to sell", 5, "Callout", { theme: T, label: "Caution", icon: "⚠️", title: "Don't break up a set", sub: "a $500 set becomes $10 in singles", tone: "warn" }],
  // QR ×6
  ["some of that old kitchenware that", 7, "QRTag", { ...QR }],
  ["the whole reason i put together", 8, "QRTag", { ...QR }],
  ["number five the complete sets", 7, "QRTag", { ...QR }],
  ["everything you need is in that guide", 8, "QRTag", { ...QR }],
  ["grab it before you sell a", 8, "QRTag", { ...QR }],
  ["thank you kindly for spending this", 7, "QRTag", { ...QR }],
];
const overlays = [];
const ovMiss = [];
for (const [a, d, comp, props] of ovBeats) { const from = at(a); if (from == null) { ovMiss.push(a); continue; } if (comp !== "QRTag" && inComp(from)) { ovMiss.push(`${a} (comp)`); continue; } overlays.push({ from, dur: sec(d), comp, props }); }
overlays.sort((x, y) => x.from - y.from);

const IMGMAP = JSON.parse(fs.existsSync(path.join(ROOT, "_v3", `${SLUG}_imgmap.json`)) ? fs.readFileSync(path.join(ROOT, "_v3", `${SLUG}_imgmap.json`), "utf8").replace(/^﻿/, "") : "{}");
const DROP = new Set((() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, "_v3", `${SLUG}_drop.json`), "utf8")); } catch { return []; } })());
const stock = [];
try { stock.push(...JSON.parse(fs.readFileSync(path.join(ROOT, "_v3", `${SLUG}_needstock.json`), "utf8").replace(/^﻿/, ""))); } catch {}
const CAP_IMG = sec(9), MIN = sec(1.8);
const cands = [];
for (const it of stock) { if (DROP.has(it.name)) continue; const from = at(it.anchor); if (from == null) continue; const imgFile = IMGMAP[it.name]; if (imgFile && fs.existsSync(path.join(ROOT, "public", "img", imgFile))) cands.push({ from, name: it.name, kind: "image", src: `img/${imgFile}`, cap: CAP_IMG }); }
cands.sort((a, b) => a.from - b.from);
const uniq = []; for (const c of cands) if (!uniq.length || c.from - uniq[uniq.length - 1].from > sec(0.5)) uniq.push(c);
const broll = []; const brollMiss = [];
for (let i = 0; i < uniq.length; i++) { const c = uniq[i]; if (inComp(c.from)) { brollMiss.push(`${c.name}(comp)`); continue; } const nextB = i + 1 < uniq.length ? uniq[i + 1].from : Infinity; const dur = Math.min(c.cap, nextB - c.from, nextCompStart(c.from) - c.from); if (dur < MIN) { brollMiss.push(`${c.name}(sliver)`); continue; } broll.push({ from: c.from, dur, kind: c.kind, src: c.src }); }

const cues = { slug: SLUG, fps: FPS, width: 1920, height: 1080, durationInFrames, broll, overlays, components };
fs.writeFileSync(path.join(ROOT, "src", "VideoEdit", "data", `cues_${SLUG}.json`), JSON.stringify(cues, null, 2));
const bf = broll.reduce((s, b) => s + b.dur, 0);
const qr = overlays.filter((o) => o.comp === "QRTag").length;
const total = components.length + overlays.length + broll.length;
console.log(`✓ componentes ${components.length}/${compBeats.length}${compMiss.length ? " MISS: " + compMiss.join(" | ") : ""}`);
console.log(`✓ overlays ${overlays.length}/${ovBeats.length} (QR ${qr})${ovMiss.length ? " MISS: " + ovMiss.join(" | ") : ""}`);
console.log(`✓ b-roll ${broll.length} ~${Math.round(bf / FPS)}s = ${Math.round(bf / durationInFrames * 100)}%${brollMiss.length ? " · " + brollMiss.join(", ") : ""}`);
console.log(`✓ TOTAL ${total} beats · ${components.length + overlays.length} comp/ov en ${(durationInFrames / FPS / 60).toFixed(1)} min → 1 cada ${(durationInFrames / FPS / total).toFixed(0)}s`);
