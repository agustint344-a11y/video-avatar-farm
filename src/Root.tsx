import React from "react";
import { Composition } from "remotion";
import { KitDemo, KITDEMO_FRAMES } from "./VideoEdit/kit/KitDemo";
import { VideoMain } from "./VideoEdit/VideoMain";
import type { Cues } from "./VideoEdit/types";
import chiaCues from "./VideoEdit/data/cues_chia-colageno.json";

export const RemotionRoot: React.FC = () => {
  const chia = chiaCues as Cues;
  return (
    <>
      <Composition
        id="KitDemo"
        component={KitDemo}
        durationInFrames={KITDEMO_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Chia"
        component={VideoMain}
        durationInFrames={chia.durationInFrames}
        fps={chia.fps}
        width={chia.width}
        height={chia.height}
        defaultProps={{ cues: chia }}
      />
    </>
  );
};
