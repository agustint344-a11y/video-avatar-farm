// node scripts/chunkmath.mjs <total_frames> <chunks> <idx>  → imprime start/end (0-based, inclusive)
const [total, chunks, idx] = process.argv.slice(2).map(Number);
const per = Math.ceil(total / chunks);
const start = idx * per;
const end = Math.min(total - 1, start + per - 1);
console.log(`start=${start}`);
console.log(`end=${end}`);
