/**
 * Transcribe-only: reusa public/<slug>_16k.wav (salta ffmpeg). Evita rehacer el opt/wav.
 *   WHISPER_LANG=Spanish node scripts/transcribe_only.mjs <slug>
 */
import { downloadWhisperModel, installWhisperCpp, transcribe, toCaptions } from "@remotion/install-whisper-cpp";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SLUG = process.argv[2];
const MODEL = process.env.WHISPER_MODEL ?? "medium";
const WHISPER_VERSION = "1.5.5";
const WHISPER_DIR = path.join(ROOT, "whisper.cpp");
const PUB = path.join(ROOT, "public");
const wav16 = path.join(PUB, `${SLUG}_16k.wav`);
if (!fs.existsSync(wav16)) { console.error("falta " + wav16); process.exit(1); }

await installWhisperCpp({ to: WHISPER_DIR, version: WHISPER_VERSION });
await downloadWhisperModel({ model: MODEL, folder: WHISPER_DIR });
console.log(`→ Transcribiendo ${SLUG} (${process.env.WHISPER_LANG ?? "Spanish"})…`);
const whisperCppOutput = await transcribe({
  inputPath: wav16,
  whisperPath: WHISPER_DIR,
  whisperCppVersion: WHISPER_VERSION,
  model: MODEL,
  language: process.env.WHISPER_LANG ?? "Spanish",
  tokenLevelTimestamps: true,
  splitOnWord: true,
  printOutput: false,
});
const { captions } = toCaptions({ whisperCppOutput });
const words = captions.map((c) => ({ text: c.text.trim(), startMs: c.startMs, endMs: c.endMs })).filter((w) => w.text.length > 0);
fs.writeFileSync(path.join(PUB, `captions_${SLUG}.json`), JSON.stringify(words, null, 2));
console.log(`✓ ${words.length} palabras · ${(words[words.length-1].endMs/1000/60).toFixed(1)} min`);
