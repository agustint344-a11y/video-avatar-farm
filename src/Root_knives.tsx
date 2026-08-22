import React from "react";
import { Composition } from "remotion";
import { VideoMain } from "./VideoEdit/VideoMain";
import type { Cues } from "./VideoEdit/types";
import knivesCues from "./VideoEdit/data/cues_knives.json";
export const RemotionRoot: React.FC = () => {
  const c = knivesCues as Cues;
  return (<Composition id="Knives" component={VideoMain} durationInFrames={c.durationInFrames} fps={c.fps} width={c.width} height={c.height} defaultProps={{ cues: c }} />);
};
