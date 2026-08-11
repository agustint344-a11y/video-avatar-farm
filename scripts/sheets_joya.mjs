import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { buildSheets } from "./contact_sheet.mjs";

const ROOT = process.cwd();
const SLUG = "joya-70-80-elena";
const BROLL = path.join(ROOT, "public", "broll");
const STILLS = path.join(ROOT, "_stills", SLUG);
fs.mkdirSync(STILLS, { recursive: true });
const FFPROBE = path.join(ROOT, "node_modules", "@remotion", "compositor-win32-x64-msvc", "ffprobe.exe");
const FFMPEG = path.join(ROOT, "node_modules", "@remotion", "compositor-win32-x64-msvc", "ffmpeg.exe");

const clips = fs.readdirSync(BROLL).filter((f) => f.startsWith(`${SLUG}_s_`) && f.endsWith(".mp4")).sort();
const files = [], labels = [];
for (const c of clips) {
  const src = path.join(BROLL, c);
  const name = c.replace(`${SLUG}_`, "").replace(".mp4", "");
  let dur = 4;
  try { dur = parseFloat(execSync(`"${FFPROBE}" -v error -show_entries format=duration -of default=nk=1:nw=1 "${src}"`).toString().trim()) || 4; } catch {}
  const ss = Math.max(0.3, dur / 2);
  const out = path.join(STILLS, `${name}.jpg`);
  try {
    execSync(`"${FFMPEG}" -y -ss ${ss.toFixed(2)} -i "${src}" -frames:v 1 -q:v 3 "${out}"`, { stdio: "ignore" });
    files.push(out); labels.push(name);
  } catch (e) { console.log("skip", name, e.message); }
}
const sheets = await buildSheets(files, path.join(ROOT, "_stills", `${SLUG}_sheets`), { cols: 4, tileW: 460, perSheet: 12, labels });
console.log("Sheets:", sheets.join("\n"));
