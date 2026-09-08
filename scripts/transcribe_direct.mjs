/**
 * Transcriptor DIRECTO con whisper.cpp/main.exe (evita el wrapper @remotion que crashea en español).
 * Reusa public/<slug>_16k.wav. Word-level via -ml 1 -sow -oj.
 *   WHISPER_LANG=es node scripts/transcribe_direct.mjs <slug>
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SLUG = process.argv[2];
const LANG = process.env.WHISPER_LANG ?? "es";
const THREADS = process.env.WHISPER_THREADS ?? "6";
const MAIN = path.join(ROOT, "whisper.cpp", "main.exe");
const MODEL = path.join(ROOT, "whisper.cpp", "ggml-medium.bin");
const PUB = path.join(ROOT, "public");
const wav16 = path.join(PUB, `${SLUG}_16k.wav`);
const outBase = path.join(PUB, `${SLUG}_words`);
if (!fs.existsSync(wav16)) { console.error("falta " + wav16); process.exit(1); }

console.log(`→ whisper directo: ${SLUG} (lang=${LANG}, ${THREADS} threads)…`);
execFileSync(MAIN, ["-m", MODEL, "-f", wav16, "-l", LANG, "-ml", "1", "-sow", "-oj", "-of", outBase, "-t", THREADS], { stdio: "ignore" });

const raw = JSON.parse(fs.readFileSync(outBase + ".json", "utf8"));
const words = (raw.transcription || [])
  .map((t) => ({ text: (t.text || "").trim(), startMs: t.offsets.from, endMs: t.offsets.to }))
  .filter((w) => w.text.length > 0);
fs.writeFileSync(path.join(PUB, `captions_${SLUG}.json`), JSON.stringify(words, null, 2));
fs.rmSync(outBase + ".json", { force: true });
console.log(`✓ ${SLUG}: ${words.length} palabras · ${(words[words.length - 1].endMs / 1000 / 60).toFixed(1)} min`);
