/**
 * AVATAR con Agnes Video 2.5 Flash (reference mode, gratis) en vez de RunPod.
 * Corta cada ventana on-cam del cues en FRASES (≤ ~9 s), 1 clip por frase con el diálogo entre comillas
 * (labios siguen esas palabras). Se usan MUTEADOS sobre el master de Fish (misma voz en todo el video).
 *   node scripts/agnes_avatar.mjs <slug> jobs      → _v3/<slug>_avjobs.json + _v3/<slug>_avmap.json
 *   node scripts/agnes_video.mjs --batch _v3/<slug>_avjobs.json
 *   node scripts/agnes_avatar.mjs <slug> assemble  → public/<slug>_avatar.mp4 (dur exacta = suma de ventanas)
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
const ROOT = process.cwd();
const [SLUG, MODE] = process.argv.slice(2);
const FPS = 30;
const FF = path.join(ROOT, "node_modules", "@remotion", "compositor-win32-x64-msvc", "ffmpeg.exe");
const cues = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "VideoEdit", "data", `cues_${SLUG}.json`), "utf8"));
const MAP = path.join(ROOT, "_v3", `${SLUG}_avmap.json`);
const CLIPDIR = path.join(ROOT, "public", "avatar_clips"); fs.mkdirSync(CLIPDIR, { recursive: true });

if (MODE === "jobs") {
  const caps = JSON.parse(fs.readFileSync(path.join(ROOT, "public", `captions_${SLUG}.json`), "utf8").replace(/^﻿/, ""));
  const url = execFileSync("node", ["D:/CLAUDE/youtube-planner/scripts/upload_public.mjs", "D:/CLAUDE/public/avatar-src/senior.jpg", "avatar-src/senior.jpg"], { encoding: "utf8" }).trim().split("\n").pop();
  const map = [], jobs = [];
  cues.avatarSegs.forEach((s, i) => {
    const end = s.from + s.dur;
    const ws = caps.filter((w) => { const f = w.startMs / 1000 * FPS; return f >= s.from - 2 && f < end; });
    const sents = []; let cur = [];
    for (const w of ws) {
      cur.push(w);
      const span = (w.endMs - cur[0].startMs) / 1000;
      if ((/[.?!]$/.test(w.text.trim()) && span >= 2.5) || span >= 9) { sents.push(cur); cur = []; }
    }
    if (cur.length) { if (sents.length && (cur[cur.length - 1].endMs - cur[0].startMs) / 1000 < 2) sents[sents.length - 1].push(...cur); else sents.push(cur); }
    sents.forEach((sw, k) => {
      const fromF = k === 0 ? s.from : Math.round(sw[0].startMs / 1000 * FPS);
      const toF = k === sents.length - 1 ? end : Math.round(sents[k + 1][0].startMs / 1000 * FPS);
      const text = sw.map((w) => w.text.trim()).join(" ").replace(/"/g, "").replace(/\s+/g, " ").trim();
      const out = path.join(CLIPDIR, `${SLUG}_w${i}_${String(k).padStart(2, "0")}.mp4`).replace(/\\/g, "/");
      const secs = Math.min(12, Math.max(4, Math.ceil((toF - fromF) / FPS + 0.5)));
      map.push({ seg: i, out, fromF, durF: toF - fromF, text });
      jobs.push({ out, images: [url], seconds: String(secs), prompt:
        `<Picture 1> is Dr. Alan Brooks, a gray-haired American doctor around 60 with a short gray beard, white lab coat, light blue shirt and a stethoscope, sitting at his desk in the same bright clinic office as in <Picture 1>. Same framing as <Picture 1>: chest-up, facing the camera, looking straight into the lens. He talks directly to the viewer in a calm, warm, caring and natural way, with subtle natural head movements and blinking, and says: "${text}" Voice: calm, warm, mature American male doctor. His hands stay relaxed and clasped on the desk. Serious and kind, NOT smiling broadly. Static camera, the camera itself is NOT visible: no tripod, no phone. ONLY ONE man in the entire frame (no duplicates, no twin). Photorealistic, natural indoor light, no text, no subtitles, no captions.` });
    });
  });
  fs.writeFileSync(MAP, JSON.stringify(map, null, 2));
  fs.writeFileSync(path.join(ROOT, "_v3", `${SLUG}_avjobs.json`), JSON.stringify(jobs, null, 2));
  console.log(`${jobs.length} clips para ${cues.avatarSegs.length} ventanas · ${(map.reduce((a, m) => a + m.durF, 0) / FPS).toFixed(1)} s de avatar`);
} else if (MODE === "assemble") {
  const map = JSON.parse(fs.readFileSync(MAP, "utf8"));
  const tmp = path.join(ROOT, "_v3", `${SLUG}_avparts`); fs.mkdirSync(tmp, { recursive: true });
  const dur = (f) => { try { execFileSync(FF, ["-i", f], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }); } catch (e) { const m = String(e.stderr).match(/Duration: (\d+):(\d+):([\d.]+)/); return m ? (+m[1]) * 3600 + (+m[2]) * 60 + (+m[3]) : 0; } return 0; };
  const list = []; const missing = [];
  map.forEach((m, n) => {
    if (!fs.existsSync(m.out)) { missing.push(path.basename(m.out)); return; }
    const L = dur(m.out), T = m.durF / FPS;
    const part = path.join(tmp, `p_${String(n).padStart(3, "0")}.mp4`).replace(/\\/g, "/");
    // el ffmpeg de Remotion no trae setpts/fps/setsar → estirar con -itsscale y -r
    execFileSync(FF, ["-y", "-itsscale", (T / L).toFixed(5), "-i", m.out, "-an", "-vf", "scale=1280:720", "-r", String(FPS), "-frames:v", String(m.durF), "-c:v", "libx264", "-crf", "20", "-pix_fmt", "yuv420p", part], { stdio: "ignore" });
    list.push(`file '${part}'`);
  });
  if (missing.length) { console.log(`FALTAN ${missing.length} clips: ${missing.join(", ")}`); process.exit(1); }
  const lst = path.join(tmp, "list.txt"); fs.writeFileSync(lst, list.join("\n"));
  const out = path.join(ROOT, "public", `${SLUG}_avatar.mp4`);
  execFileSync(FF, ["-y", "-f", "concat", "-safe", "0", "-i", lst, "-c:v", "libx264", "-crf", "20", "-pix_fmt", "yuv420p", "-r", String(FPS), out], { stdio: "ignore" });
  console.log(`✓ ${out} · ${(dur(out)).toFixed(1)} s (esperado ${(map.reduce((a, m) => a + m.durF, 0) / FPS).toFixed(1)} s)`);
}
