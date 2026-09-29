import React from "react";
import { Composition } from "remotion";
import { VideoMain } from "./VideoEdit/VideoMain";
import type { Cues } from "./VideoEdit/types";
import kidneysCues from "./VideoEdit/data/cues_kidneys-vital.json";

export const RemotionRoot: React.FC = () => {
  const c = kidneysCues as unknown as Cues;
  return (
    <Composition
      id="KidneysVital"
      component={VideoMain}
      durationInFrames={c.durationInFrames}
      fps={c.fps}
      width={c.width}
      height={c.height}
      defaultProps={{ cues: c }}
    />
  );
};
