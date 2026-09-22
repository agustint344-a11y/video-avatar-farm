import React from "react";
import { Composition } from "remotion";
import { VideoMain } from "./VideoEdit/VideoMain";
import type { Cues } from "./VideoEdit/types";
import collagenCues from "./VideoEdit/data/cues_collagen-vital.json";

export const RemotionRoot: React.FC = () => {
  const c = collagenCues as unknown as Cues;
  return (
    <Composition
      id="CollagenVital"
      component={VideoMain}
      durationInFrames={c.durationInFrames}
      fps={c.fps}
      width={c.width}
      height={c.height}
      defaultProps={{ cues: c }}
    />
  );
};
