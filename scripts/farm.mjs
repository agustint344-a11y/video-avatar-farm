/**
 * DRIVER DEL FARM (local).
 *   node scripts/farm.mjs <slug> <comp_id> <total_frames> [chunks=40] @lista_assets.txt
 *
 * Hace: (1) empaqueta assets en un .tar con paths RELATIVOS a public/;
 *       (2) lo sube como release assets-<slug>; (3) dispara render.yml en la rama;
 *       (4) te deja el comando para trackear.
 *
 * Env:
 *   FARM_REF      rama a rendear (default: rama actual). OBLIGATORIO en la práctica.
 *   ONLY_CHUNKS   re-render parcial (ej "44,51,52"): reusa el release de assets.
 *   ENTRY         entry propio (ej src/index-<slug>.ts). Default src/index.ts.
 *   GH_BIN        ruta a gh.exe si no está en PATH.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";

const [slug, comp, total, chunks = "40", listArg] = process.argv.slice(2);
if (!slug || !comp || !total) {
  console.error("Uso: node scripts/farm.mjs <slug> <comp_id> <total_frames> [chunks] @lista_assets.txt");
  process.exit(1);
}

const GH = process.env.GH_BIN || "gh";
const sh = (c) => execSync(c, { stdio: "inherit" });
const out = (c) => execSync(c).toString().trim();

const REPO = out(`${GH} repo view --json nameWithOwner -q .nameWithOwner`);
const REF = process.env.FARM_REF || out(`git rev-parse --abbrev-ref HEAD`);
const only = process.env.ONLY_CHUNKS || "";

// 0) PRE-VUELO: rama sincronizada con origin
if (out(`git rev-parse HEAD`) !== out(`git rev-parse origin/${REF}`)) {
  throw new Error(`Pusheá tu rama antes de farmear:  git push -f origin ${REF}`);
}

if (!only) {
  // 1) empaquetar + 2) subir assets
  const files = listArg && listArg.startsWith("@")
    ? fs.readFileSync(listArg.slice(1), "utf8").split(/\r?\n/).filter(Boolean)
    : [];
  if (!files.length) throw new Error("Pasá @_<slug>_assets.txt con rutas RELATIVAS a public/");
  // Temporales (list + tar) en D:, NO en C: — el .tar pesa cientos de MB por video.
  const TMP = "D:/CLAUDE/_tmp";
  fs.mkdirSync(TMP, { recursive: true });
  const listPath = `${TMP}/_list_${slug}.txt`;
  const tarPath = `${TMP}/assets-${slug}.tar`;
  fs.writeFileSync(listPath, files.join("\n"));
  // --force-local: GNU tar interpreta "D:/..." como host:path (rsh) y falla; esto lo trata como ruta local.
  sh(`tar --force-local -cf "${tarPath}" -C public -T "${listPath}"`);
  const badPaths = out(`tar --force-local -tf "${tarPath}"`).split(/\r?\n/).filter((l) => l.startsWith("public/")).length;
  if (badPaths > 0) throw new Error("El tar tiene rutas con prefijo public/ — deben ser relativas a public/");
  try { sh(`${GH} release delete assets-${slug} --repo ${REPO} --yes --cleanup-tag`); } catch {}
  sh(`${GH} release create assets-${slug} --repo ${REPO} --title assets-${slug} --notes assets "${tarPath}"`);
  // borrar temporales al terminar de subir
  try { fs.rmSync(tarPath, { force: true }); fs.rmSync(listPath, { force: true }); } catch {}
}

// 3) disparar
const entry = process.env.ENTRY || "src/index.ts";
const onlyArg = only ? `-f only_chunks=${only}` : "";
sh(`${GH} workflow run render.yml --repo ${REPO} --ref ${REF} -f slug=${slug} -f comp_id=${comp} -f total_frames=${total} -f chunks=${chunks} -f entry=${entry} ${onlyArg}`);
console.log(`\n✓ Workflow disparado en ${REPO} (rama ${REF}).`);
console.log(`  Trackealo por SHA:  ${GH} run list --branch ${REF} --json databaseId,headSha,status,conclusion`);
console.log(`  Al terminar, bajá:  ${GH} release download ${slug} --repo ${REPO} --pattern "${slug}.mp4" --dir . --clobber`);
