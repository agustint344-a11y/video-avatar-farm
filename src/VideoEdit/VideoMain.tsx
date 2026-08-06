import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { AvatarAudio, AvatarBackdrop, AvatarPip } from "./scenes/AvatarLayer";
import { BrollBeatView, ComponentBeatView, OverlayBeatView } from "./renderCues";
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

      {/* Avatar en PiP sobre el b-roll (b-roll a pantalla completa + presentador chico en la esquina). */}
      <AvatarPip
        slug={cues.slug}
        windows={cues.broll.filter((b) => b.pip !== false).map((b) => ({ from: b.from, dur: b.dur }))}
      />

      {(cues.overlays ?? []).map((o, i) => (
        <Sequence key={`o${i}`} from={o.from} durationInFrames={o.dur} name={`overlay ${o.comp}`}>
          <OverlayBeatView beat={o} />
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
