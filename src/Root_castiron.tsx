import React from "react";
import { Composition } from "remotion";
import { VideoMain } from "./VideoEdit/VideoMain";
import type { Cues } from "./VideoEdit/types";
import castironCues from "./VideoEdit/data/cues_castiron.json";

export const RemotionRoot: React.FC = () => {
  const c = castironCues as Cues;
  return (
    <Composition
      id="CastIron"
      component={VideoMain}
      durationInFrames={c.durationInFrames}
      fps={c.fps}
      width={c.width}
      height={c.height}
      defaultProps={{ cues: c }}
    />
  );
};
