/**
 * Arma grillas (contact sheets) a partir de imágenes, con sharp.
 * Uso como módulo:  import { buildSheets } from "./contact_sheet.mjs"
 *   buildSheets(files, outDir, { cols, tileW, perSheet, labels })
 *
 * Devuelve las rutas de los sheets. Cada tile lleva su índice para poder referenciarlo.
 * Pensado para auditar POCAS grillas (2-8) en vez de leer cientos de imágenes sueltas.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

export async function buildSheets(files, outDir, opts = {}) {
  const cols = opts.cols ?? 4;
  const tileW = opts.tileW ?? 480;
  const tileH = Math.round((tileW * 9) / 16);
  const perSheet = opts.perSheet ?? 12;
  const labels = opts.labels ?? files.map((_, i) => String(i));
  fs.mkdirSync(outDir, { recursive: true });

  const labelSvg = (txt) =>
    Buffer.from(
      `<svg width="${tileW}" height="28"><rect width="100%" height="100%" fill="black" opacity="0.6"/><text x="6" y="20" font-family="sans-serif" font-size="16" fill="white">${String(txt).replace(/[<&>]/g, "")}</text></svg>`,
    );

  const sheets = [];
  for (let s = 0; s * perSheet < files.length; s++) {
    const batch = files.slice(s * perSheet, (s + 1) * perSheet);
    const batchLabels = labels.slice(s * perSheet, (s + 1) * perSheet);
    const rows = Math.ceil(batch.length / cols);
    const canvas = sharp({
      create: { width: cols * tileW, height: rows * tileH, channels: 3, background: "#111" },
    });
    const composites = [];
    for (let i = 0; i < batch.length; i++) {
      try {
        const tile = await sharp(batch[i])
          .resize(tileW, tileH, { fit: "cover" })
          .composite([{ input: labelSvg(batchLabels[i]), top: 0, left: 0 }])
          .jpeg()
          .toBuffer();
        composites.push({ input: tile, left: (i % cols) * tileW, top: Math.floor(i / cols) * tileH });
      } catch {
        // imagen rota → tile gris
      }
    }
    const out = path.join(outDir, `sheet_${String(s).padStart(2, "0")}.jpg`);
    await canvas.composite(composites).jpeg({ quality: 82 }).toFile(out);
    sheets.push(out);
  }
  return sheets;
}

// CLI: node scripts/contact_sheet.mjs <dir_con_imagenes> <outDir> [cols]
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const [dir, outDir, cols] = process.argv.slice(2);
  const files = fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).map((f) => path.join(dir, f));
  const labels = files.map((f) => path.basename(f));
  const sheets = await buildSheets(files, outDir || "_sheets", { cols: Number(cols) || 4, labels });
  console.log("Sheets:", sheets.join(", "));
}
