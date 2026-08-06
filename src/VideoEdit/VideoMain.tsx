import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { AvatarAudio, AvatarBackdrop } from "./scenes/AvatarLayer";
import { BrollBeatView, ComponentBeatView } from "./renderCues";
import type { Cues } from "./types";

/**
 * Cuerpo genérico de un video del pipeline. Data-driven: todo sale del JSON de cues.
 * Capas (de atrás hacia adelante):
 *   z0  avatar (fondo por defecto) + su audio continuo
 *   z1  b-roll (tapa al avatar mientras dura)
 *   z2  componentes del kit (tienen su propio fondo opaco; tapan todo)
 */
export const VideoMain: React.FC<{ cues: Cues }> = ({ cues }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AvatarAudio slug={cues.slug} />
      <AvatarBackdrop slug={cues.slug} />

      {cues.broll.map((b, i) => (
        <Sequence key={`b${i}`} from={b.from} durationInFrames={b.dur} name={`broll ${b.src}`}>
          <BrollBeatView beat={b} />
        </Sequence>
      ))}

      {cues.components.map((c, i) => (
        <Sequence key={`c${i}`} from={c.from} durationInFrames={c.dur} name={`comp ${c.comp}`}>
          <ComponentBeatView beat={c} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
