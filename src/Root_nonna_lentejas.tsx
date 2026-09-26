import React from "react";
import { Composition } from "remotion";
import { VideoMain } from "./VideoEdit/VideoMain";
import type { Cues } from "./VideoEdit/types";
import lentejasCues from "./VideoEdit/data/cues_nonna-lentejas.json";

export const RemotionRoot: React.FC = () => {
  const c = lentejasCues as unknown as Cues;
  return (
    <Composition
      id="NonnaLentejas"
      component={VideoMain}
      durationInFrames={c.durationInFrames}
      fps={c.fps}
      width={c.width}
      height={c.height}
      defaultProps={{ cues: c }}
    />
  );
};
