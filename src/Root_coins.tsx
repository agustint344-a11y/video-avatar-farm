import React from "react";
import { Composition } from "remotion";
import { VideoMain } from "./VideoEdit/VideoMain";
import type { Cues } from "./VideoEdit/types";
import coinsCues from "./VideoEdit/data/cues_coins.json";
export const RemotionRoot: React.FC = () => {
  const c = coinsCues as Cues;
  return (<Composition id="Coins" component={VideoMain} durationInFrames={c.durationInFrames} fps={c.fps} width={c.width} height={c.height} defaultProps={{ cues: c }} />);
};
