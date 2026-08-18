import React from "react";
import { Composition } from "remotion";
import { VideoMain } from "./VideoEdit/VideoMain";
import type { Cues } from "./VideoEdit/types";
import toolsCues from "./VideoEdit/data/cues_tools.json";
export const RemotionRoot: React.FC = () => {
  const c = toolsCues as Cues;
  return (<Composition id="Tools" component={VideoMain} durationInFrames={c.durationInFrames} fps={c.fps} width={c.width} height={c.height} defaultProps={{ cues: c }} />);
};
