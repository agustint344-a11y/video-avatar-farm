import React from "react";
import { Composition } from "remotion";
import { Kit4Demo, KIT4DEMO_FRAMES } from "./VideoEdit/kit/Kit4Demo";
import { KitProDemo, KITPRODEMO_FRAMES } from "./VideoEdit/kit/KitProDemo";
import { QRDemo, QRDEMO_FRAMES } from "./VideoEdit/kit/QRDemo";
import { ShortMain, type ShortCues } from "./VideoEdit/ShortMain";
import shortManzanillaCues from "./VideoEdit/data/cues_short-manzanilla.json";
import shortColagenoCues from "./VideoEdit/data/cues_short-colageno.json";

const shortMz = shortManzanillaCues as ShortCues;
const shortCol = shortColagenoCues as ShortCues;
export const RootTop5: React.FC = () => (
  <>
    <Composition
      id="ShortManzanilla"
      component={ShortMain}
      durationInFrames={shortMz.durationInFrames}
      fps={shortMz.fps}
      width={shortMz.width}
      height={shortMz.height}
      defaultProps={{ cues: shortMz }}
    />
    <Composition
      id="ShortColageno"
      component={ShortMain}
      durationInFrames={shortCol.durationInFrames}
      fps={shortCol.fps}
      width={shortCol.width}
      height={shortCol.height}
      defaultProps={{ cues: shortCol }}
    />
    <Composition
      id="Top5Demo"
      component={Kit4Demo}
      durationInFrames={KIT4DEMO_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="KitProDemo"
      component={KitProDemo}
      durationInFrames={KITPRODEMO_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="QRDemo"
      component={QRDemo}
      durationInFrames={QRDEMO_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
