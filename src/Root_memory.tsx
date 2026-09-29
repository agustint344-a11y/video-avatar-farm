import React from "react";
import { Composition } from "remotion";
import { VideoMain } from "./VideoEdit/VideoMain";
import type { Cues } from "./VideoEdit/types";
import cues from "./VideoEdit/data/cues_memory-vital.json";

export const RemotionRoot: React.FC = () => {
  const c = cues as unknown as Cues;
  return <Composition id="MemoryVital" component={VideoMain} durationInFrames={c.durationInFrames} fps={c.fps} width={c.width} height={c.height} defaultProps={{ cues: c }} />;
};
