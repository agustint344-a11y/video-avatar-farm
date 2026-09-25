/**
 * Corta los tramos on-camera (_v3/<slug>_avatarcuts.json) del audio master public/<slug>.mp3
 * y los concatena en UN solo wav → ese audio va a InfiniteTalk (1 llamada, lip-sync exacto con el master).
 *   node scripts/cut_avatar_audio.mjs <slug>   →  _v3/<slug>_oncam.wav
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
const ROOT = process.cwd();
const SLUG = process.argv[2];
const FF = path.join(ROOT, "node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe");
const cuts = JSON.parse(fs.readFileSync(path.join(ROOT, "_v3", `${SLUG}_avatarcuts.json`), "utf8"));
const master = path.join(ROOT, "public", `${SLUG}.mp3`);
const tmp = path.join(ROOT, "_v3", `${SLUG}_oncam_parts`);
fs.mkdirSync(tmp, { recursive: true });
const list = [];
cuts.forEach((c, i) => {
  const out = path.join(tmp, `p${String(i).padStart(2, "0")}.wav`);
  execFileSync(FF, ["-y", "-loglevel", "error", "-i", master, "-ss", String(c.startSec), "-t", String(c.durSec), "-ac", "1", "-ar", "24000", "-c:a", "pcm_s16le", out]);
  list.push(`file '${out.replace(/\\/g, "/")}'`);
});
fs.writeFileSync(path.join(tmp, "list.txt"), list.join("\n"));
const final = path.join(ROOT, "_v3", `${SLUG}_oncam.wav`);
execFileSync(FF, ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", path.join(tmp, "list.txt"), "-c", "copy", final]);
const total = cuts.reduce((s, c) => s + c.durSec, 0);
console.log(`on-cam: ${cuts.length} tramos · ${total.toFixed(1)}s → ${final}`);
