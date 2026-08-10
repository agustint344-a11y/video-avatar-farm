/**
 * FASE 7 — BUILD "romero-noche-elena" (Dra. Elena Vidal) — aceite de romero para las manchas.
 * ESTILO DOPAMÍNICO (PiP + kit + tema CLINIC).
 *   node scripts/build_romero-noche.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "romero-noche-elena";
const FPS = 30;
const T = "clinic";
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", `captions_${SLUG}.json`), "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
const cn = caps.map((w) => norm(w.text));
const at = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let i = 0; i + N <= cn.length; i++) { let ok = 1; for (let j = 0; j < N; j++) if (cn[i + j] !== t[j]) { ok = 0; break; } if (ok) return Math.round(caps[i].startMs / 1000 * FPS); } return null; };
const sec = (n) => Math.round(n * FPS);
const durationInFrames = Math.round(caps[caps.length - 1].endMs / 1000 * FPS) + sec(1);

const compBeats = [
  ["quedate conmigo porque la parte", 6.5, "Checklist", { theme: T, title: "Lo que vas a ver hoy", items: ["Qué es realmente esa mancha", "Cómo trabaja el romero en tu piel", "Cómo usarlo bien (y quiénes NO)"] }],
  ["hay varios tipos", 7, "Checklist", { theme: T, title: "3 tipos de mancha", items: ["Solares: años de sol acumulado", "Melasma: hormonas + sol, con forma de mapa", "Posinflamatoria: la marca de un grano"] }],
  ["gran parte del resultado no esta en el frasco", 6, "PullQuote", { theme: T, quote: "Gran parte del resultado no está en el frasco: está en el ritual de cuidarte cada noche." }],
  ["el 80 de lo que llamamos", 6, "BigNumberCard", { eyebrow: "Dato clave", value: 80, suffix: "%", label: "del envejecimiento de la piel viene del sol" }],
  ["el romero borra las manchas en una semana", 7, "MythVsTruth", { theme: T, myth: "El romero borra las manchas en una semana.", truth: "Falso. El tono cambia en MESES de constancia, no en días. Quien promete una semana, te miente." }],
  ["si un poco funciona mas funciona", 7, "MythVsTruth", { theme: T, myth: "Si un poco funciona, más funciona mejor.", truth: "Peligroso. Más aceite esencial no da más resultado: irrita y quema. La dosis correcta es sagrada." }],
  ["el aceite de romero reemplaza al protector", 7, "MythVsTruth", { theme: T, myth: "El aceite de romero reemplaza al protector solar.", truth: "Rotundamente falso. El romero es apoyo de noche; el protector es la defensa de día. Se necesitan." }],
  ["es natural asi que no puede hacer", 7, "MythVsTruth", { theme: T, myth: "Es natural, así que no puede hacer daño.", truth: "Natural no es seguro. La dilución y la prueba del parche son lo que hacen seguro al romero." }],
  ["toma un punado de romero limpio", 8, "Steps", { theme: T, eyebrow: "Camino 1 · Macerado", title: "Aceite de romero en frasco", steps: [{ title: "Romero seco en un frasco", sub: "cubrilo con aceite de oliva o almendras" }, { title: "Reposar 2 a 3 semanas", sub: "lugar fresco, sin sol, agitar cada día" }, { title: "Colar y guardar", sub: "en frasco oscuro, listo para usar" }] }],
  ["camino 2 mas rapido con aceite", 8, "Steps", { theme: T, eyebrow: "Camino 2 · Dilución", title: "Con aceite esencial", steps: [{ title: "30 ml de aceite base", sub: "unas 2 cucharadas de oliva o almendras" }, { title: "3 a 6 gotas de esencial", sub: "nunca más; la primera vez, solo 3" }, { title: "Mezclar bien", sub: "listo, sin esperar semanas" }] }],
  ["paso 1 la cara limpia", 8, "Steps", { theme: T, eyebrow: "Aplicación nocturna", title: "Paso a paso", steps: [{ title: "Cara limpia y seca", sub: "agua tibia, sin frotar" }, { title: "3-4 gotas + masaje suave", sub: "hacia arriba y afuera, 1 a 2 min" }, { title: "Dejar toda la noche", sub: "a la mañana: lavar + protector solar" }] }],
  ["cuando juntas las cuatro patas", 7.5, "Checklist", { theme: T, title: "Las 4 patas de la mesa", items: ["Protector solar cada mañana", "Dormir bien y tomar agua", "Comer muchos vegetales de colores", "Paciencia y suavidad (menos es más)"] }],
  ["cuidar la piel no es una guerra", 7, "PullQuote", { theme: T, quote: "Cuidar la piel no es una guerra contra el espejo. Es tratarte con la misma amabilidad que a alguien que querés." }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["soy la doctora elena vidal", 5, "LowerThird", { theme: T, accentText: "ANTIEDAD CON EVIDENCIA", title: "Dra. Elena Vidal", sub: "Rejuvenecer la piel, sin humo" }],
  ["la melanina es el pigmento", 3.2, "KeywordPop", { theme: T, word: "MELANINA", sub: "el pigmento que forma la mancha", pos: "bottom" }],
  ["se generan unas moleculas inestables", 3.2, "KeywordPop", { theme: T, word: "RADICALES LIBRES", sub: "chispas que dañan la piel", pos: "center" }],
  ["un antioxidante es como el agua", 3.2, "KeywordPop", { theme: T, word: "ANTIOXIDANTE", sub: "apaga esas chispas", pos: "bottom" }],
  ["proteccion antioxidante nocturna", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 1", title: "Escudo antioxidante de noche", sub: "acompaña la reparación de la piel" }],
  ["el segundo beneficio es sobre el tono", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 2", title: "Tono más parejo", sub: "un apoyo, no un despigmentante médico" }],
  ["esa enzima es la fabrica de melanina", 3.2, "KeywordPop", { theme: T, word: "TIROSINASA", sub: "la fábrica de melanina", pos: "center" }],
  ["el tercer beneficio es la circulacion", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 3", title: "Circulación y luminosidad", sub: "por el masaje suave nocturno" }],
  ["hay un cuarto beneficio del que se habla", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 4", title: "Cuida tu colágeno", sub: "protege el que ya tenés" }],
  ["y hay un quinto efecto mas silencioso", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 5", title: "Calma la inflamación", sub: "piel más calma, menos manchas" }],
  ["a la parte del video que mas", 4, "SectionTitle", { eyebrow: "ATENCIÓN", title: "Advertencias importantes" }],
  ["apliques aceite esencial de romero", 5, "Callout", { theme: T, icon: "⚠️", title: "Nunca el aceite esencial PURO", sub: "siempre diluido en un aceite base", tone: "warn" }],
  ["antes de ponerte nada en la cara", 5, "Callout", { theme: T, icon: "🧪", title: "Prueba del parche 24 h", sub: "una gota en el antebrazo antes de la cara", tone: "warn" }],
  ["el romero puede aumentar la sensibilidad", 5, "Callout", { theme: T, icon: "☀️", title: "Puede sensibilizar al sol", sub: "por eso: de noche + protector de día", tone: "warn" }],
  ["si estas embarazada o dando el pecho", 5, "Callout", { theme: T, icon: "🤰", title: "Embarazo o lactancia: consultá", sub: "el esencial es muy activo — mejor evitar", tone: "warn" }],
  ["el romero no va sobre heridas", 4.5, "Callout", { theme: T, icon: "🚫", title: "No sobre heridas ni cerca de ojos", sub: "ni acné reventado; rosácea → dermatólogo", tone: "warn" }],
  ["si una mancha cambia de tamano", 5.5, "Callout", { theme: T, icon: "🩺", title: "¿La mancha cambia? → Dermatólogo", sub: "tamaño, color o bordes raros: consultá ya", tone: "info" }],
  ["vamos a preparar el aceite", 4, "SectionTitle", { eyebrow: "MANOS A LA OBRA", title: "Cómo prepararlo" }],
  ["ese frasco tiene que reposar", 4.5, "StatChip", { theme: T, value: 3, suffix: " sem", label: "de reposo (macerado)" }],
  ["a la manana siguiente protector solar", 3.4, "KeywordPop", { theme: T, word: "PROTECTOR SOLAR", sub: "todos los días, sí o sí", pos: "center" }],
  ["noches por semana es un ritmo", 4.5, "StatChip", { theme: T, value: 4, suffix: " noches", label: "por semana, para empezar" }],
  ["te deje todo reunido en una guia", 6, "SplitInfo", { eyebrow: "En resumen", title: "Mi rutina antimanchas", items: ["Cantidades exactas, gota por gota", "Rutina de noche paso a paso", "Qué evitar según tu piel"] }],
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
const total = components.length + overlays.length + broll.length;
console.log(`✓ componentes ${components.length}/${compBeats.length}${compMiss.length ? " MISS: " + compMiss.join(" | ") : ""}`);
console.log(`✓ overlays ${overlays.length}/${ovBeats.length}${ovMiss.length ? " MISS: " + ovMiss.join(" | ") : ""}`);
console.log(`✓ b-roll ${broll.length} ~${Math.round(bf / FPS)}s = ${Math.round(bf / durationInFrames * 100)}% (PiP)${brollMiss.length ? " · " + brollMiss.join(", ") : ""}`);
console.log(`✓ TOTAL ${total} beats en ${(durationInFrames / FPS / 60).toFixed(1)} min → 1 cada ${(durationInFrames / FPS / total).toFixed(0)}s`);
