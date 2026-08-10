import React from "react";
import { Composition } from "remotion";
import { KitDemo, KITDEMO_FRAMES } from "./VideoEdit/kit/KitDemo";
import { Kit3Demo, KIT3DEMO_FRAMES } from "./VideoEdit/kit/Kit3Demo";
import { VideoMain } from "./VideoEdit/VideoMain";
import type { Cues } from "./VideoEdit/types";
import chiaCues from "./VideoEdit/data/cues_chia-colageno.json";
import jamaicaCues from "./VideoEdit/data/cues_agua-jamaica.json";
import colagenoCues from "./VideoEdit/data/cues_colageno-40.json";
import romeroCues from "./VideoEdit/data/cues_romero-elena.json";
import moringaCues from "./VideoEdit/data/cues_moringa-agustin.json";
import romeroNocheCues from "./VideoEdit/data/cues_romero-noche-elena.json";

export const RemotionRoot: React.FC = () => {
  const chia = chiaCues as Cues;
  const jamaica = jamaicaCues as Cues;
  const colageno = colagenoCues as Cues;
  const romero = romeroCues as Cues;
  const moringa = moringaCues as Cues;
  const romeroNoche = romeroNocheCues as Cues;
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
      <Composition
        id="Kit3Demo"
        component={Kit3Demo}
        durationInFrames={KIT3DEMO_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Jamaica"
        component={VideoMain}
        durationInFrames={jamaica.durationInFrames}
        fps={jamaica.fps}
        width={jamaica.width}
        height={jamaica.height}
        defaultProps={{ cues: jamaica }}
      />
      <Composition
        id="Colageno"
        component={VideoMain}
        durationInFrames={colageno.durationInFrames}
        fps={colageno.fps}
        width={colageno.width}
        height={colageno.height}
        defaultProps={{ cues: colageno }}
      />
      <Composition
        id="Romero"
        component={VideoMain}
        durationInFrames={romero.durationInFrames}
        fps={romero.fps}
        width={romero.width}
        height={romero.height}
        defaultProps={{ cues: romero }}
      />
      <Composition
        id="Moringa"
        component={VideoMain}
        durationInFrames={moringa.durationInFrames}
        fps={moringa.fps}
        width={moringa.width}
        height={moringa.height}
        defaultProps={{ cues: moringa }}
      />
      <Composition
        id="RomeroNoche"
        component={VideoMain}
        durationInFrames={romeroNoche.durationInFrames}
        fps={romeroNoche.fps}
        width={romeroNoche.width}
        height={romeroNoche.height}
        defaultProps={{ cues: romeroNoche }}
      />
    </>
  );
};
