#!/usr/bin/env bash
# Termina un video de la Nonna: build final → assets → commit rama → farm → espera → baja a D:/CLAUDE/out.
#   bash scripts/finish_nonna.sh <slug> <build_script> <CompId> <entry>
#   ej: bash scripts/finish_nonna.sh nonna-arroz scripts/build_nonna_arroz.mjs NonnaArroz src/index-nonna-arroz.ts
set -e
SLUG=$1; BUILD=$2; COMP=$3; ENTRY=$4
cd C:/Users/Teje/Desktop/CLAUDE/video-avatar-farm
AVAF_SEC=$(node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe -hide_banner -i public/${SLUG}_avatar.mp4 2>&1 | grep -o "Duration: [0-9:.]*" | awk -F"[: ]" '{print $3*3600+$4*60+$5}') node "$BUILD"
node -e 'const s=process.argv[1];const c=require("./src/VideoEdit/data/cues_"+s+".json");const set=new Set(c.broll.map(b=>b.src));(c.components||[]).forEach(k=>k.props&&typeof k.props.src==="string"&&set.add(k.props.src));[s+".mp3",s+"_avatar.mp4","img/qr_mateo.png"].forEach(x=>set.add(x));const fs=require("fs");const miss=[...set].filter(f=>!fs.existsSync("public/"+f));if(miss.length){console.error("FALTAN:",miss.join(" "));process.exit(1)}fs.writeFileSync("_"+s+"_assets.txt",[...set].join("\n")+"\n");console.log("assets",set.size)' "$SLUG"
BR="$SLUG-render"
git checkout -q -B "$BR"
for p in "$BUILD" "src/VideoEdit/data/cues_$SLUG.json" "_${SLUG}_assets.txt" src/Root_nonna*.tsx src/index-nonna*.ts src/Root_mateo*.tsx src/index-mateo*.ts src/VideoEdit/renderCues.tsx src/VideoEdit/types.ts src/VideoEdit/kit/kit.tsx .github/workflows/render.yml scripts/finish_nonna.sh scripts/agnes_video.mjs scripts/cut_avatar_audio.mjs; do git add "$p" 2>/dev/null || echo "no add $p"; done
git commit -q -m "$SLUG render

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" || true
git push -q -f origin "$BR"
TF=$(node -e 'console.log(require("./src/VideoEdit/data/cues_'"$SLUG"'.json").durationInFrames)')
FARM_REF="$BR" ENTRY="$ENTRY" node scripts/farm.mjs "$SLUG" "$COMP" "$TF" 40 "@_${SLUG}_assets.txt" | grep -E "disparado|rror" || true
SHA=$(git rev-parse HEAD)
while true; do
  L=$(gh run list --branch "$BR" --json databaseId,headSha,status,conclusion -q ".[] | select(.headSha==\"$SHA\") | \"\(.databaseId) \(.status) \(.conclusion)\"" 2>/dev/null | head -1)
  case "$L" in *completed*) echo "RUN $L"; break;; esac; sleep 90
done
gh release download "$SLUG" --repo agustint344-a11y/video-avatar-farm --pattern "$SLUG.mp4" --dir D:/CLAUDE/out --clobber
ls -la "D:/CLAUDE/out/$SLUG.mp4"
echo "FIN $SLUG"
