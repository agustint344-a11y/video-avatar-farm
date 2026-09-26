import React from "react";
import { Composition } from "remotion";
import { VideoMain } from "./VideoEdit/VideoMain";
import type { Cues } from "./VideoEdit/types";
import arrozCues from "./VideoEdit/data/cues_nonna-arroz.json";

export const RemotionRoot: React.FC = () => {
  const c = arrozCues as unknown as Cues;
  return (
    <Composition
      id="NonnaArroz"
      component={VideoMain}
      durationInFrames={c.durationInFrames}
      fps={c.fps}
      width={c.width}
      height={c.height}
      defaultProps={{ cues: c }}
    />
  );
};
