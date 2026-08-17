/**
 * FASE 7 — BUILD "senal-nariz-elena" (Dra. Elena Vidal) — la marca en la nariz: señales de alerta.
 * DENSO + Compare estrella + QRTag ×6. Tema CLINIC.
 *   node scripts/build_nariz.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "senal-nariz-elena";
const FPS = 30;
const T = "clinic";
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", `captions_${SLUG}.json`), "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
const cn = caps.map((w) => norm(w.text));
const at = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let i = 0; i + N <= cn.length; i++) { let ok = 1; for (let j = 0; j < N; j++) if (cn[i + j] !== t[j]) { ok = 0; break; } if (ok) return Math.round(caps[i].startMs / 1000 * FPS); } return null; };
const sec = (n) => Math.round(n * FPS);
const durationInFrames = Math.round(caps[caps.length - 1].endMs / 1000 * FPS) + sec(1);

const compBeats = [
  ["asi que quedate hasta el final", 6.5, "Checklist", { theme: T, title: "Lo que vas a ver hoy", items: ["Por qué la nariz es un lugar especial", "Marcas comunes vs señales de alerta", "Qué hacer y qué NO hacer nunca"] }],
  ["las causas comunes esas que son", 7.5, "Checklist", { theme: T, title: "Causas comunes (quedate tranquila)", items: ["Un granito o espinilla", "Piel irritada o reseca", "Arañitas vasculares (vasitos rojos)", "Rosácea", "Lunares y pecas de siempre"] }],
  ["hay unas pocas senales que son distintas", 7, "Compare", { theme: T, title: "¿Cuándo preocuparse?", left: { label: "Marca común", sub: "se va en pocos días — tranquila" }, right: { label: "Señal de alerta", sub: "no cicatriza, cambia o sangra — al médico" } }],
  ["la primera senal de alerta", 8, "Checklist", { theme: T, title: "Señales de alerta (mostralas)", items: ["Herida que NO cicatriza en semanas", "Sangra con facilidad", "Bultito nacarado que crece", "Costra que se cae y vuelve", "Lunar que cambia"] }],
  ["la regla de las primeras letras", 8, "Checklist", { theme: T, title: "Regla ABCDE del lunar", items: ["A · Asimetría (una mitad distinta)", "B · Bordes irregulares", "C · Color: varios o cambió", "D · Diámetro grande o creció", "E · Evolución: está cambiando"] }],
  ["primer mito el mas peligroso", 7, "MythVsTruth", { theme: T, myth: "Si no duele, no es nada.", truth: "Falso, y es lo más traicionero. Las señales de la piel que más importan casi nunca duelen. El dolor no es un buen termómetro." }],
  ["es solo un granito ya se va", 7, "MythVsTruth", { theme: T, myth: "Es solo un granito, ya se va solo.", truth: "A veces sí. Pero si algo en tu nariz no se fue en 3 o 4 semanas, dejó de ser 'solo un granito' y pasó a ser algo para mostrar." }],
  ["a mi edad ya no vale la pena", 7, "MythVsTruth", { theme: T, myth: "A mi edad ya no vale la pena hacerse ver eso.", truth: "Falso. Justo a mayor edad, por el sol acumulado, más vale mirar y consultar. Una consulta simple evita un problema grande." }],
  ["yo nunca tome tanto sol", 7, "MythVsTruth", { theme: T, myth: "Yo nunca tomé tanto sol, a mí no me pasa.", truth: "Falso. El sol se acumula de a poquito: manejando, en los mandados, colgando la ropa. No es tema de 'los que se broncean': es de todos." }],
  ["el protector solar en la nariz todos", 8, "Steps", { theme: T, eyebrow: "Cómo cuidarte", title: "Prevención simple", steps: [{ title: "Protector solar cada día", sub: "en la nariz, sí o sí, llueva o truene" }, { title: "Revisá tu piel 1 vez por mes", sub: "cara, nariz, orejas, cuello, manos" }, { title: "Sombra y sombrero al mediodía", sub: "entre las 10 y las 16, respetá el sol" }] }],
  ["cuidar tu salud no es vivir asustada", 7, "PullQuote", { theme: T, quote: "Cuidar tu salud no es vivir asustada buscándote problemas. Es conocer tu cuerpo con cariño y consultar a tiempo. Eso no es miedo: es paz." }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const QR = (a, d = 8) => [a, d, "QRTag", { theme: T, corner: "bl" }];
const ovBeats = [
  ["soy la doctora elena vidal", 5, "LowerThird", { theme: T, accentText: "TU PIEL, CON EVIDENCIA", title: "Dra. Elena Vidal", sub: "Aprendé a mirar, sin miedo" }],
  ["toda esa radiacion acumulada", 3.6, "KeywordPop", { theme: T, word: "LA NARIZ = MÁS SOL", sub: "es la parte que más radiación acumula", pos: "center" }],
  ["disponible en los comentarios de este video y tambien", 7, "QRTag", { theme: T, corner: "bl" }],
  ["el tipo de cancer de piel mas comun", 3.8, "KeywordPop", { theme: T, word: "A TIEMPO = FÁCIL", sub: "detectado temprano, casi siempre simple", pos: "center" }],
  ["ese tipo de cancer de piel el mas frecuente", 7, "QRTag", { theme: T, corner: "bl" }],
  ["que esta en la descripcion y tambien fijada", 7, "QRTag", { theme: T, corner: "bl" }],
  ["vine a verme una mujer", 5, "LowerThird", { theme: T, accentText: "CASO REAL", title: "Doña Elsa, 68 años", sub: "una lastimadura de 6 meses que 'no era nada'" }],
  ["estas senales casi nunca duelen", 3.6, "KeywordPop", { theme: T, word: "CASI NUNCA DUELEN", sub: "por eso las ignoramos", pos: "center" }],
  ["por eso las ignoramos y por eso", 7, "QRTag", { theme: T, corner: "bl" }],
  ["que no hacer nunca con una marca", 4, "SectionTitle", { eyebrow: "IMPORTANTE", title: "Qué NO hacer nunca" }],
  ["no te la revientes", 5, "Callout", { theme: T, icon: "🚫", title: "No te la revientes ni te la rasques", sub: "manipularla empeora y confunde el diagnóstico", tone: "warn" }],
  ["no le pongas cualquier cosa encima", 5, "Callout", { theme: T, icon: "⚠️", title: "Nada de remedios caseros encima", sub: "sobre una lesión que no cicatriza, puede ser peligroso", tone: "warn" }],
  ["no te diagnostiques por internet", 5, "Callout", { theme: T, icon: "🩺", title: "Ante la duda: dermatólogo", sub: "quien mira tu piel y decide es un profesional", tone: "info" }],
  ["vamos a lo practico como cuidarte", 4, "SectionTitle", { eyebrow: "MANOS A LA OBRA", title: "Cómo cuidarte" }],
  ["revisarte la piel una vez por mes", 4.5, "StatChip", { theme: T, value: 1, suffix: " vez/mes", label: "revisá tu piel" }],
  ["no te olvides de que te deje", 7, "QRTag", { theme: T, corner: "bl" }],
  ["si algo en tu nariz no se fue", 5, "Callout", { theme: T, icon: "📅", title: "¿No se fue en 3-4 semanas?", sub: "dejó de ser 'un granito': mostralo", tone: "warn" }],
  ["te mando un abrazo enorme", 7, "QRTag", { theme: T, corner: "bl" }],
];
const overlays = [];
const ovMiss = [];
for (const [a, d, comp, props] of ovBeats) { const from = at(a); if (from == null) { ovMiss.push(a); continue; } if (inComp(from)) { ovMiss.push(`${a} (comp)`); continue; } overlays.push({ from, dur: sec(d), comp, props }); }
overlays.sort((x, y) => x.from - y.from);

const IMGMAP = JSON.parse(fs.existsSync(path.join(ROOT, "_v3", `${SLUG}_imgmap.json`)) ? fs.readFileSync(path.join(ROOT, "_v3", `${SLUG}_imgmap.json`), "utf8").replace(/^﻿/, "") : "{}");
const DROP = new Set((() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, "_v3", `${SLUG}_drop.json`), "utf8")); } catch { return []; } })());
const stock = [];
try { stock.push(...JSON.parse(fs.readFileSync(path.join(ROOT, "_v3", `${SLUG}_needstock.json`), "utf8").replace(/^﻿/, ""))); } catch {}
const CAP_VID = sec(25), CAP_IMG = sec(10), MIN = sec(1.8);
const cands = [];
for (const it of stock) { if (DROP.has(it.name)) continue; const from = at(it.anchor); if (from == null) continue; const imgFile = IMGMAP[it.name]; if (imgFile && fs.existsSync(path.join(ROOT, "public", "img", imgFile))) cands.push({ from, name: it.name, kind: "image", src: `img/${imgFile}`, cap: CAP_IMG }); else { const vid = path.join(ROOT, "public", "broll", `${SLUG}_${it.name}.mp4`); if (fs.existsSync(vid)) cands.push({ from, name: it.name, kind: "video", src: `broll/${SLUG}_${it.name}.mp4`, cap: CAP_VID }); } }
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
console.log(`✓ overlays ${overlays.length}/${ovBeats.length} (QRTag ${qr})${ovMiss.length ? " MISS: " + ovMiss.join(" | ") : ""}`);
console.log(`✓ b-roll ${broll.length} ~${Math.round(bf / FPS)}s = ${Math.round(bf / durationInFrames * 100)}% (PiP)${brollMiss.length ? " · " + brollMiss.join(", ") : ""}`);
console.log(`✓ TOTAL ${total} beats · ${components.length + overlays.length} comp/ov en ${(durationInFrames / FPS / 60).toFixed(1)} min → 1 cada ${(durationInFrames / FPS / total).toFixed(0)}s`);
