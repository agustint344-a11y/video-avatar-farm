import React from "react";
import { Composition } from "remotion";
import { VideoMain } from "./VideoEdit/VideoMain";
import type { Cues } from "./VideoEdit/types";
import pastaCues from "./VideoEdit/data/cues_nonna-pasta.json";

export const RemotionRoot: React.FC = () => {
  const c = pastaCues as unknown as Cues;
  return (
    <Composition
      id="NonnaPasta"
      component={VideoMain}
      durationInFrames={c.durationInFrames}
      fps={c.fps}
      width={c.width}
      height={c.height}
      defaultProps={{ cues: c }}
    />
  );
};
