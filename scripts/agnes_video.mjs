// Agnes Video 2.5 (reference mode: la Nonna como personaje) — b-roll en video.
//   node agnes_video.mjs --batch jobs.json
//   job: { out, prompt, images:[url], model?: "agnes-video-2.5-flash"|"agnes-video-2.5", seconds?: "5", size?: "720P" }
import fs from "node:fs";
const env = fs.readFileSync("C:/Users/Teje/Desktop/CLAUDE/video-avatar-farm/.env", "utf8");
const KEYS = (env.match(/^AGNES_API_KEYS=(.*)$/m)?.[1] || env.match(/^AGNES_API_KEY=(.*)$/m)[1]).split(",").map((s) => s.trim()).filter(Boolean);
const BASE = "https://apihub.agnes-ai.com";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const hdr = (k) => ({ Authorization: `Bearer ${k}`, "Content-Type": "application/json" });

async function one(j, key) {
  if (fs.existsSync(j.out) && !process.env.FORCE) return console.log("skip", j.out);
  const body = { model: j.model || "agnes-video-2.5-flash", prompt: j.prompt, mode: j.images?.length ? "reference" : "text", seconds: j.seconds || "5", size: j.size || "720P", aspect_ratio: "16:9" };
  if (j.images?.length) body.images = j.images;
  let id;
  for (let t = 0; t < 80 && !id; t++) {
    const r = await fetch(`${BASE}/v1/videos`, { method: "POST", headers: hdr(key), body: JSON.stringify(body) }).then((x) => x.json()).catch((e) => ({ message: e.message }));
    id = r.video_id || r.id || r.data?.video_id || r.data?.id;
    if (!id) { if (t % 5 === 0) console.log("submit retry", j.out, JSON.stringify(r).slice(0, 120)); await sleep(45000 + Math.random() * 15000); }
  }
  if (!id) return console.log("FAIL submit", j.out);
  const t0 = Date.now();
  while (Date.now() - t0 < 30 * 60 * 1000) {
    await sleep(15000);
    const s = await fetch(`${BASE}/agnesapi?video_id=${id}`, { headers: hdr(key) }).then((x) => x.json()).catch(() => ({}));
    const st = s.status || s.data?.status;
    const url = s.url || s.video_url || s.data?.url || s.data?.video_url;
    if (st === "completed" && url) {
      fs.writeFileSync(j.out, Buffer.from(await (await fetch(url)).arrayBuffer()));
      return console.log(`OK ${j.out} (${Math.round((Date.now() - t0) / 1000)}s)`);
    }
    if (st === "failed" || st === "error") return console.log("FAIL", j.out, JSON.stringify(s).slice(0, 300));
  }
  console.log("TIMEOUT", j.out, id);
}

const jobs = JSON.parse(fs.readFileSync(process.argv[3], "utf8"));
const CONC = +(process.env.CONC || KEYS.length);
let k = 0;
await Promise.all(Array.from({ length: CONC }, async (_, w) => { while (k < jobs.length) { const j = jobs[k++]; await one(j, KEYS[w % KEYS.length]); } }));
