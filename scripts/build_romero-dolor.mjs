/**
 * FASE 7 — BUILD "romero-dolor" (Dr. Juan Tomás) — romero para el dolor de espalda/músculos/articulaciones.
 * DENSO + QR ×6 + Compare/Steps/Timeline/MythVsTruth. Tema EARTH.
 *   node scripts/build_romero-dolor.mjs
 */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const SLUG = "romero-dolor";
const FPS = 30;
const T = "earth";
const QR = { theme: T, corner: "bl", src: "img/qr_guia_jt.png" };
const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", `captions_${SLUG}.json`), "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
const cn = caps.map((w) => norm(w.text));
const at = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); const N = Math.min(t.length, 5); for (let i = 0; i + N <= cn.length; i++) { let ok = 1; for (let j = 0; j < N; j++) if (cn[i + j] !== t[j]) { ok = 0; break; } if (ok) return Math.round(caps[i].startMs / 1000 * FPS); } return null; };
const sec = (n) => Math.round(n * FPS);
const durationInFrames = Math.round(caps[caps.length - 1].endMs / 1000 * FPS) + sec(1);

const compBeats = [
  ["Te voy a explicar exactamente que le hace", 6.5, "Checklist", { theme: T, title: "Lo que vas a ver hoy", items: ["Qué le hace el romero al dolor y la inflamación", "Cómo prepararlo: tomado y en aceite de masaje", "Quiénes NO deben usarlo (el error peligroso)"] }],
  ["el romero tiene dos compuestos estrella", 6.5, "Compare", { theme: T, title: "Por qué desinflama", left: { label: "Inflamación crónica", sub: "el fuego que aprieta y duele" }, right: { label: "Ácido rosmarínico + carnósico", sub: "le bajan el fuego a la zona" } }],
  ["un musculo contracturado una espalda cargada", 6.5, "Compare", { theme: T, title: "Circulación y dolor", left: { label: "Poca sangre en la zona", sub: "músculo tieso, frío, dolorido" }, right: { label: "Romero en masaje", sub: "más sangre, calor, el músculo afloja" } }],
  ["Estamos hablando de una planta que desinflama", 8.5, "Checklist", { theme: T, title: "Todo lo que hace el romero", items: ["Desinflama y calma el dolor", "Mejora la circulación y afloja el músculo", "Alivia el dolor de cabeza tensional", "Protege tus articulaciones", "Cuida digestión y defensas"] }],
  ["Mito el romero solo te va a curar", 7, "MythVsTruth", { theme: T, myth: "El romero cura la artrosis, la hernia o el problema de fondo.", truth: "Falso. Alivia el dolor, desinflama y afloja el músculo, pero un desgaste o una hernia se estudian y se tratan con tu médico. Acompaña, no reemplaza." }],
  ["pone una cucharadita de hojas secas de romero", 8.5, "Steps", { theme: T, eyebrow: "Para tomar", title: "La infusión, paso a paso", steps: [{ title: "1 cucharadita de romero en la taza", sub: "hojas secas o una ramita fresca" }, { title: "Agua caliente y TAPÁ la taza", sub: "así no se escapan los aceites buenos" }, { title: "Reposar 5 min, colar y tomar", sub: "1 o 2 tazas al día, suave" }] }],
  ["agarra un frasco de vidrio limpio", 9, "Steps", { theme: T, eyebrow: "Para el dolor", title: "Aceite de masaje casero", steps: [{ title: "Frasco con romero seco", sub: "sin nada de humedad" }, { title: "Cubrir con aceite de oliva o almendras", sub: "hasta tapar las ramitas" }, { title: "2-3 semanas al sol, agitando", sub: "colás y masajeás la zona" }] }],
  ["entibia un poquito el aceite antes de usarlo", 7.5, "Checklist", { theme: T, title: "3 trucos para que rinda al máximo", items: ["Entibiá el aceite antes del masaje", "Compresa caliente con infusión cargada", "Baño de pies con romero para piernas cansadas"] }],
  ["El masaje con el aceite tibio de romero lo vas", 8, "Timeline", { theme: T, eyebrow: "Qué esperar", title: "El romero, con el tiempo", steps: [{ when: "En el momento", text: "el masaje tibio afloja y alivia ya" }, { when: "Con las semanas", text: "baja la inflamación crónica de fondo" }, { when: "Como hábito", text: "más movilidad y menos dolor diario" }] }],
  ["el verdadero alivio del dolor no viene de una sola", 7, "PullQuote", { theme: T, quote: "El verdadero alivio del dolor no viene de una sola hierba milagrosa: viene de la suma de moverte, cuidar tu postura y sumar aliados como el romero." }],
];
const components = [];
const compMiss = [];
for (const [a, d, comp, props] of compBeats) { const from = at(a); if (from == null) { compMiss.push(a); continue; } components.push({ from, dur: sec(d), comp, props }); }
components.sort((x, y) => x.from - y.from);
const compRanges = components.map((c) => [c.from, c.from + c.dur]);
const inComp = (f) => compRanges.some(([a, b]) => f >= a - sec(0.3) && f < b);
const nextCompStart = (f) => { const l = components.filter((c) => c.from > f).map((c) => c.from); return l.length ? Math.min(...l) : Infinity; };

const ovBeats = [
  ["Soy el dr Juan Tomas medico cirujano", 5.5, "LowerThird", { theme: T, accentText: "DOLOR E INFLAMACIÓN", title: "Dr. Juan Tomás", sub: "Médico Cirujano · salud natural con evidencia" }],
  ["el romero es un antiinflamatorio natural de verdad", 5.5, "LowerThird", { theme: T, accentText: "BENEFICIO 1", title: "Antiinflamatorio natural", sub: "ácido rosmarínico y carnósico" }],
  ["el acido rosmarinico y el acido carnosico", 3.4, "KeywordPop", { theme: T, word: "ÁCIDO ROSMARÍNICO", sub: "antiinflamatorio de la planta", pos: "center" }],
  ["el romero mejora la circulacion de la sangre", 5.5, "LowerThird", { theme: T, accentText: "BENEFICIO 2", title: "Mejora la circulación", sub: "más sangre y calor a la zona" }],
  ["el romero ayuda a relajar el musculo", 5.5, "LowerThird", { theme: T, accentText: "BENEFICIO 3", title: "Relaja el músculo", sub: "afloja la contractura y el espasmo" }],
  ["Vino a mi consulta una senora de sesenta", 5, "LowerThird", { theme: T, accentText: "CASO REAL", title: "Una paciente, 60 años", sub: "dolor de espalda de años" }],
  ["por primera vez en anos pude atarme", 7, "QRTag", QR],
  ["Te deje el enlace ahi en el comentario fijado", 7.5, "QRTag", QR],
  ["el romero cuida y despierta tu cerebro", 5.5, "LowerThird", { theme: T, accentText: "BENEFICIO 4", title: "Cerebro y memoria", sub: "su aroma despeja y concentra" }],
  ["cuida tu digestion el romero es un gran amigo", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 5", title: "Cuida tu digestión", sub: "vientre menos hinchado y pesado" }],
  ["el romero fortalece tus defensas y ayuda", 5, "LowerThird", { theme: T, accentText: "BENEFICIO 6", title: "Fortalece tus defensas", sub: "antioxidante y antimicrobiano" }],
  ["el romero es un gran aliado contra la cefalea", 5.5, "LowerThird", { theme: T, accentText: "BENEFICIO 7", title: "Dolor de cabeza tensional", sub: "cuello y sienes, con masaje suave" }],
  ["El desgaste de una articulacion la temida", 3.6, "KeywordPop", { theme: T, word: "ARTICULACIONES", sub: "inflamación + oxidación = dolor", pos: "bottom" }],
  ["Porque yo soy medico y mi trabajo no es", 4, "SectionTitle", { eyebrow: "NO TE LO SALTEES", title: "Las advertencias" }],
  ["si estas embarazada no uses romero en dosis", 5.5, "Callout", { theme: T, icon: "🤰", title: "Embarazo", sub: "solo para cocinar — nada de dosis medicinales", tone: "warn" }],
  ["JAMAS tomes el aceite esencial de romero", 6, "Callout", { theme: T, icon: "⚠️", title: "Aceite esencial: NUNCA por boca", sub: "puede provocar convulsiones — solo externo, diluido", tone: "warn" }],
  ["si tenes epilepsia o tendencia", 3.6, "KeywordPop", { theme: T, word: "EPILEPSIA: CUIDADO", sub: "el aceite esencial puede gatillar convulsiones", pos: "center" }],
  ["si tenes la presion alta ojo el romero", 5.5, "Callout", { theme: T, icon: "🩺", title: "Presión alta", sub: "puede subirla un poco — con moderación y consultá", tone: "warn" }],
  ["si tomas anticoagulantes esos remedios para", 5.5, "Callout", { theme: T, icon: "💊", title: "Anticoagulantes", sub: "puede interferir — avisá a tu médico", tone: "warn" }],
  ["Nunca te pongas aceite esencial de romero puro", 5.5, "Callout", { theme: T, icon: "🧴", title: "En la piel: siempre diluido", sub: "en aceite base + prueba en el codo primero", tone: "info" }],
  ["deja reposar 5 minutos cola", 3.6, "StatChip", { theme: T, value: 5, suffix: " min", label: "de reposo para la infusión" }],
  ["Te lo hago facil para que empieces", 4, "SectionTitle", { eyebrow: "MANOS A LA OBRA", title: "Cómo usarlo" }],
  ["Los que lo prueban dos dias y lo dejan", 7, "QRTag", QR],
  ["Y si queres el romero con las cantidades exactas", 6.5, "SplitInfo", { eyebrow: "En los comentarios", title: "Mi guía completa para el dolor", items: ["La receta exacta del aceite de masaje", "Cuántas veces al día aplicarlo", "Combinaciones probadas con mis pacientes"] }],
  ["todo eso esta en la guia que te deje", 7.5, "QRTag", QR],
  ["no reemplaza el estudio de lo que te esta", 5, "Callout", { theme: T, icon: "🩺", title: "No reemplaza a tu médico", sub: "dolor fuerte que no cede, con hormigueo → consultá", tone: "info" }],
  ["que te deje fijada ahi abajo", 7.5, "QRTag", QR],
  ["y nos vemos en el proximo", 7, "QRTag", QR],
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
console.log(`✓ overlays ${overlays.length}/${ovBeats.length} (QR ${qr})${ovMiss.length ? " MISS: " + ovMiss.join(" | ") : ""}`);
console.log(`✓ b-roll ${broll.length} ~${Math.round(bf / FPS)}s = ${Math.round(bf / durationInFrames * 100)}%${brollMiss.length ? " · " + brollMiss.join(", ") : ""}`);
console.log(`✓ TOTAL ${total} beats · ${components.length + overlays.length} comp/ov en ${(durationInFrames / FPS / 60).toFixed(1)} min → 1 cada ${(durationInFrames / FPS / total).toFixed(0)}s`);
