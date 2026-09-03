import React from "react";
import { Composition } from "remotion";
import { VideoMain } from "./VideoEdit/VideoMain";
import type { Cues } from "./VideoEdit/types";
import bottlesCues from "./VideoEdit/data/cues_bottles.json";
export const RemotionRoot: React.FC = () => {
  const c = bottlesCues as Cues;
  return (<Composition id="Bottles" component={VideoMain} durationInFrames={c.durationInFrames} fps={c.fps} width={c.width} height={c.height} defaultProps={{ cues: c }} />);
};
