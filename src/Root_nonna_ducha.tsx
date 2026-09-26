import React from "react";
import { Composition } from "remotion";
import { VideoMain } from "./VideoEdit/VideoMain";
import type { Cues } from "./VideoEdit/types";
import duchaCues from "./VideoEdit/data/cues_nonna-ducha.json";

export const RemotionRoot: React.FC = () => {
  const c = duchaCues as unknown as Cues;
  return (
    <Composition
      id="NonnaDucha"
      component={VideoMain}
      durationInFrames={c.durationInFrames}
      fps={c.fps}
      width={c.width}
      height={c.height}
      defaultProps={{ cues: c }}
    />
  );
};
