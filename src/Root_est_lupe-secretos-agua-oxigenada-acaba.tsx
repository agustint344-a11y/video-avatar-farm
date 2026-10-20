import React from "react";
import { Composition } from "remotion";
import { VideoMain } from "./VideoEdit/VideoMain";
import type { Cues } from "./VideoEdit/types";
import inesCues from "./VideoEdit/data/cues_lupe-secretos-agua-oxigenada-acaba.json";

export const RemotionRoot: React.FC = () => {
  const c = inesCues as unknown as Cues;
  return (
    <Composition
      id="EstLupeSecretosAguaOxigenadaAcaba"
      component={VideoMain}
      durationInFrames={c.durationInFrames}
      fps={c.fps}
      width={c.width}
      height={c.height}
      defaultProps={{ cues: c }}
    />
  );
};
