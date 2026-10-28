// node nube/chunkmath.mjs <total_frames> <chunks> <idx> → start/end (inclusive) + skip para GITHUB_OUTPUT
const [total, chunks, idx] = process.argv.slice(2).map(Number);
const per = Math.ceil(total / chunks);
const start = idx * per, end = Math.min(total - 1, start + per - 1);
console.log(`start=${start}\nend=${end}\nskip=${start > total - 1 ? 1 : 0}`);
