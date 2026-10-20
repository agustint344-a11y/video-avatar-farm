import React from "react";
import { Composition } from "remotion";
import { VideoMain } from "./VideoEdit/VideoMain";
import type { Cues } from "./VideoEdit/types";
import inesCues from "./VideoEdit/data/cues_nonna-salsa-pasta-bar.json";

export const RemotionRoot: React.FC = () => {
  const c = inesCues as unknown as Cues;
  return (
    <Composition
      id="EstNonnaSalsaPastaBar"
      component={VideoMain}
      durationInFrames={c.durationInFrames}
      fps={c.fps}
      width={c.width}
      height={c.height}
      defaultProps={{ cues: c }}
    />
  );
};
