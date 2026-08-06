/**
 * FASE 1 — INGESTA + TRANSCRIPCIÓN LOCAL
 *
 *   node scripts/transcribe_local.mjs <slug> [rutaAvatar.mp4]
 *
 * Entrada:  public/avatar/<slug>.mp4  (o pasá la ruta como 2º argumento)
 * Salidas:  public/<slug>_opt.mp4        (normalizado 1920x1080, para el render)
 *           public/<slug>.wav            (48k stereo, por si el kit lo usa)
 *           public/<slug>_16k.wav        (mono 16k, para whisper)
 *           public/captions_<slug>.json  (array word-level {text,startMs,endMs})
 *
 * Notas:
 *  - Usa el ffmpeg que trae Remotion (npx remotion ffmpeg). Ese build NO tiene el
 *    filtro `crop`, así que normalizamos con `scale=1920:1080` (2px imperceptibles).
 *  - Whisper.cpp se auto-instala con @remotion/install-whisper-cpp (release prebuilt,
 *    sin GPU ni compilar). Modelo por defecto `medium`; WHISPER_MODEL=large-v3 si el
 *    timing sale flojo. En CPU tarda ~2.3x la duración del audio.
 */
import {
  downloadWhisperModel,
  installWhisperCpp,
  transcribe,
  toCaptions,
} from "@remotion/install-whisper-cpp";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SLUG = process.argv[2];
if (!SLUG) {
  console.error("Uso: node scripts/transcribe_local.mjs <slug> [rutaAvatar.mp4]");
  process.exit(1);
}
const WHISPER_VERSION = "1.5.5";
const MODEL = process.env.WHISPER_MODEL ?? "medium";
const WHISPER_DIR = path.join(ROOT, "whisper.cpp");
const PUB = path.join(ROOT, "public");
const AVATAR_DIR = path.join(PUB, "avatar");
const MEDIA_EXTENSIONS = [".mp4", ".mov", ".mkv", ".webm", ".m4a", ".mp3", ".wav"];

const ff = (args) =>
  execSync(`npx remotion ffmpeg ${args}`, { stdio: "inherit", cwd: ROOT });

const findInput = () => {
  const arg = process.argv[3];
  if (arg && fs.existsSync(arg)) return arg;
  for (const ext of MEDIA_EXTENSIONS) {
    const c = path.join(AVATAR_DIR, SLUG + ext);
    if (fs.existsSync(c)) return c;
  }
  throw new Error(
    `No encontré el avatar. Poné public/avatar/${SLUG}.mp4 o pasá la ruta como 2º argumento.`,
  );
};

const main = async () => {
  const input = findInput();
  console.log(`Avatar: ${path.relative(ROOT, input)}`);
  fs.mkdirSync(PUB, { recursive: true });

  const opt = path.join(PUB, `${SLUG}_opt.mp4`);
  const wav48 = path.join(PUB, `${SLUG}.wav`);
  const wav16 = path.join(PUB, `${SLUG}_16k.wav`);

  console.log("→ Normalizando video (scale 1920x1080, libx264 + aac)…");
  ff(`-i "${input}" -vf "scale=1920:1080" -r 30 -c:v libx264 -crf 23 -preset veryfast -c:a aac -b:a 128k "${opt}" -y`);

  console.log("→ WAV 48k stereo…");
  ff(`-i "${input}" -vn -acodec pcm_s16le -ar 48000 -ac 2 "${wav48}" -y`);

  console.log("→ WAV 16k mono (para whisper)…");
  ff(`-i "${input}" -vn -ar 16000 -ac 1 "${wav16}" -y`);

  console.log(`→ Instalando whisper.cpp ${WHISPER_VERSION}…`);
  await installWhisperCpp({ to: WHISPER_DIR, version: WHISPER_VERSION });
  console.log(`→ Descargando modelo "${MODEL}"…`);
  await downloadWhisperModel({ model: MODEL, folder: WHISPER_DIR });

  console.log("→ Transcribiendo (español, timestamps por token)…");
  const whisperCppOutput = await transcribe({
    inputPath: wav16,
    whisperPath: WHISPER_DIR,
    whisperCppVersion: WHISPER_VERSION,
    model: MODEL,
    language: "Spanish",
    tokenLevelTimestamps: true,
    splitOnWord: true,
    printOutput: false,
    onProgress: (p) => process.stdout.write(`\r   ${Math.round(p * 100)}%   `),
  });
  process.stdout.write("\n");

  const { captions } = toCaptions({ whisperCppOutput });
  const words = captions
    .map((c) => ({ text: c.text.trim(), startMs: c.startMs, endMs: c.endMs }))
    .filter((w) => w.text.length > 0);

  const outFile = path.join(PUB, `captions_${SLUG}.json`);
  fs.writeFileSync(outFile, JSON.stringify(words, null, 2));

  const durationMs = words.length ? words[words.length - 1].endMs : 0;
  console.log(`\n✓ ${words.length} palabras`);
  console.log(`✓ Duración: ${(durationMs / 1000).toFixed(2)} s  (${Math.round((durationMs / 1000) * 30)} frames @30fps)`);
  console.log(`✓ ${path.relative(ROOT, outFile)}`);
};

await main();
