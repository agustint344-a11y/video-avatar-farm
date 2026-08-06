/**
 * FASE 8 — AUDITOR sobre el MP4 ya rendido por el farm.
 *   node scripts/audit_video.mjs <slug> --video <ruta.mp4> [--every 12]
 *
 * Extrae 1 frame cada N segundos (con el ffmpeg de Remotion), arma contact sheets con
 * sharp, y escribe un manifiesto que mapea cada frame → la frase de la narración en ese
 * segundo (de public/captions_<slug>.json). Vos mirás POCAS grillas y marcás problemas.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { buildSheets } from "./contact_sheet.mjs";

const args = process.argv.slice(2);
const slug = args[0];
const videoPath = args[args.indexOf("--video") + 1];
const every = Number(args[args.indexOf("--every") + 1]) || 12;
if (!slug || !args.includes("--video")) {
  console.error("Uso: node scripts/audit_video.mjs <slug> --video <ruta.mp4> [--every 12]");
  process.exit(1);
}

const ROOT = process.cwd();
const OUT = path.join(ROOT, "_audit", slug);
const FRAMES = path.join(OUT, "frames");
fs.mkdirSync(FRAMES, { recursive: true });

// duración
const probe = execSync(`npx remotion ffprobe "${videoPath}"`, { cwd: ROOT }).toString() +
  (() => { try { return execSync(`npx remotion ffprobe "${videoPath}" 2>&1`, { cwd: ROOT }).toString(); } catch (e) { return e.stdout?.toString() || ""; } })();
const dm = probe.match(/Duration:\s*(\d+):(\d+):(\d+)/);
const durSec = dm ? (+dm[1]) * 3600 + (+dm[2]) * 60 + (+dm[3]) : 0;
if (!durSec) { console.error("No pude leer la duración del mp4"); process.exit(1); }

// captions para el phrase-por-frame
let caps = [];
const capFile = path.join(ROOT, "public", `captions_${slug}.json`);
if (fs.existsSync(capFile)) caps = JSON.parse(fs.readFileSync(capFile, "utf8").replace(/^﻿/, ""));
const phraseAt = (sec) => {
  const ms = sec * 1000;
  const around = caps.filter((w) => w.startMs >= ms - 500 && w.startMs <= ms + 4000);
  return around.map((w) => w.text).join(" ").slice(0, 80);
};

const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

const files = [];
const labels = [];
const manifest = [];
for (let t = 0; t < durSec; t += every) {
  const out = path.join(FRAMES, `f_${String(t).padStart(4, "0")}.jpg`);
  try {
    execSync(`npx remotion ffmpeg -ss ${t} -i "${videoPath}" -frames:v 1 -q:v 3 "${out}" -y`, { cwd: ROOT, stdio: "ignore" });
    const phrase = phraseAt(t);
    files.push(out);
    labels.push(`${mmss(t)} | ${phrase}`);
    manifest.push({ t, frame: t * 30, phrase });
  } catch { /* frame fuera de rango */ }
}

const sheets = await buildSheets(files, OUT, { cols: 4, tileW: 440, perSheet: 16, labels });
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`✓ ${files.length} frames, ${sheets.length} sheets en ${path.relative(ROOT, OUT)}`);
console.log(sheets.map((s) => path.relative(ROOT, s)).join("\n"));
