/**
 * BUILD "comics-atticfortune" (Walt Hargrove) — listicle EN: old comic books worth a fortune. EARTH.
 * B-roll = imágenes Agnes (imgmap). QR ×6 (qr_attic). CTA = SplitInfo + QRTag.
 *   node scripts/build_comics_atticfortune.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "comics-atticfortune";
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
  ["some of those old comic books", 5, "BigStat", { theme: T, eyebrow: "ONE OLD COMIC", prefix: "$", value: 40000, suffix: "?", support: "what a key first appearance can bring" }],
  ["age condition and importance", 6, "Checklist", { theme: T, title: "What makes a comic valuable", items: ["Age — the older, the scarcer", "Condition — everything", "Importance — a first appearance or key issue"] }],
  ["the difference between an original and a reprint", 6, "Compare", { theme: T, title: "Original vs. reprint", left: { label: "ORIGINAL", sub: "the real first printing — worth the money" }, right: { label: "REPRINT", sub: "looks alike — worth a tiny fraction" } }],
  ["the vast majority of comics", 7, "MythVsTruth", { theme: T, mythLabel: "Myth", truthLabel: "Truth", myth: "Every old comic is a treasure.", truth: "Most common issues are worth a few dollars. The fortunes are in the key issues, the early ones, and the ones in beautiful condition." }],
  ["so how do you tell if yours", 8, "Steps", { theme: T, eyebrow: "HOW TO VALUE IT", title: "Check it in 4 steps", steps: [{ title: "Age & date", sub: "on the cover, in a corner" }, { title: "A key issue?", sub: "a first appearance is the jackpot" }, { title: "Condition & original", sub: "flat, glossy, no tape, not a reprint" }] }],
  ["the only difference between the person", 6, "PullQuote", { theme: T, quote: "The only difference between the person who let a fortune go for a quarter and the person who cashed in was knowing what to look for.", author: "Walt Hargrove" }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["appraising the odds and ends", 5, "LowerThird", { theme: T, accentText: "ATTIC FORTUNE", title: "Walt Hargrove", sub: "40+ years appraising attic & basement finds" }],
  ["before you toss it check its worth", 3.4, "KeywordPop", { theme: T, word: "CHECK ITS WORTH", sub: "before you toss it", pos: "bottom" }],
  ["what exactly is a key issue", 3.6, "KeywordPop", { theme: T, word: "KEY ISSUE", sub: "a first appearance, a #1, an origin", pos: "center" }],
  ["put together a complete guide", 6.5, "SplitInfo", { eyebrow: "FREE GUIDE", title: "The Attic Fortune Guide", items: ["Exact key issues & price ranges", "How to spot originals vs reprints", "Comics, coins, records & more"] }],
  ["everything you need is in that guide", 6.5, "SplitInfo", { eyebrow: "GRAB IT FIRST", title: "The Attic Fortune Guide", items: ["Know what it's worth before you sell", "Real sold-price ranges", "Plain English, no jargon"] }],
  ["the whole reason i put that guide", 6.5, "SplitInfo", { eyebrow: "EVERYTHING INSIDE", title: "The Attic Fortune Guide", items: ["Identify your comics step by step", "What collectors pay right now", "Link pinned in the comments"] }],
  ["old newspaper comic strips and early funny books", 4, "SectionTitle", { theme: T, eyebrow: "#10", title: "Early Strips & Funny Books" }],
  ["1970s and 80s key issues", 4, "SectionTitle", { theme: T, eyebrow: "#9", title: "'70s & '80s Key Issues" }],
  ["first issues the number ones", 4, "SectionTitle", { theme: T, eyebrow: "#8", title: "First Issues (#1s)" }],
  ["key villains and supporting characters", 4, "SectionTitle", { theme: T, eyebrow: "#7", title: "Villains & Key First Appearances" }],
  ["complete runs and high grade commons", 4, "SectionTitle", { theme: T, eyebrow: "#6", title: "Complete Runs & High Grade" }],
  ["the old horror crime and science", 4, "SectionTitle", { theme: T, eyebrow: "#5", title: "1950s Horror & Crime" }],
  ["gave us the first appearances", 4, "SectionTitle", { theme: T, eyebrow: "#4", title: "1960s First Appearances" }],
  ["what collectors call the golden", 4.5, "SectionTitle", { theme: T, eyebrow: "#3", title: "1940s Golden Age" }],
  ["where a character the whole world", 4.5, "SectionTitle", { theme: T, eyebrow: "#2", title: "A Famous First Appearance" }],
  ["any early important comic a first appearance", 4.5, "SectionTitle", { theme: T, eyebrow: "#1", title: "Key Issue, High Grade" }],
  ["he almost sold for a quarter", 3.6, "KeywordPop", { theme: T, word: "$40,000+", sub: "the comic in the attic box", pos: "center" }],
  ["do not restore tape trim", 5, "Callout", { theme: T, label: "Caution", icon: "🚫", title: "Never tape, trim or clean it", sub: "restoring an old comic wipes out the value", tone: "warn" }],
  ["sell in a hurry", 5, "Callout", { theme: T, label: "Caution", icon: "⚠️", title: "Don't sell in a hurry", sub: "the eager buyer usually knows something you don't", tone: "warn" }],
  // QR ×6
  ["some of those old comic books", 7, "QRTag", { ...QR }],
  ["put together a complete guide", 8, "QRTag", { ...QR }],
  ["mistaken for junk", 7, "QRTag", { ...QR }],
  ["everything you need is in that guide", 8, "QRTag", { ...QR }],
  ["the whole reason i put that guide", 8, "QRTag", { ...QR }],
  ["thank you kindly for spending this time", 7, "QRTag", { ...QR }],
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
