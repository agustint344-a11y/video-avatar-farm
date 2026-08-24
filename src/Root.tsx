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
import vitaminaCues from "./VideoEdit/data/cues_vitamina-venas-agustin.json";
import sarcopeniaCues from "./VideoEdit/data/cues_sarcopenia-elena.json";
import joyaCues from "./VideoEdit/data/cues_joya-70-80-elena.json";
import colagenoCues from "./VideoEdit/data/cues_colageno-articulaciones-elena.json";
import manzanillaCues from "./VideoEdit/data/cues_manzanilla-elena.json";
import narizCues from "./VideoEdit/data/cues_senal-nariz-elena.json";
import curcumaCues from "./VideoEdit/data/cues_curcuma-elena.json";
import jengibreCues from "./VideoEdit/data/cues_jengibre-elena.json";

export const RemotionRoot: React.FC = () => {
  const chia = chiaCues as Cues;
  const jamaica = jamaicaCues as Cues;
  const colageno = colagenoCues as Cues;
  const romero = romeroCues as Cues;
  const moringa = moringaCues as Cues;
  const romeroNoche = romeroNocheCues as Cues;
  const vitamina = vitaminaCues as Cues;
  const sarcopenia = sarcopeniaCues as Cues;
  const joya = joyaCues as Cues;
  const colagenoArt = colagenoCues as Cues;
  const manzanilla = manzanillaCues as Cues;
  const nariz = narizCues as Cues;
  const curcuma = curcumaCues as Cues;
  const jengibre = jengibreCues as Cues;
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
      <Composition
        id="VitaminaVenas"
        component={VideoMain}
        durationInFrames={vitamina.durationInFrames}
        fps={vitamina.fps}
        width={vitamina.width}
        height={vitamina.height}
        defaultProps={{ cues: vitamina }}
      />
      <Composition
        id="SarcopeniaElena"
        component={VideoMain}
        durationInFrames={sarcopenia.durationInFrames}
        fps={sarcopenia.fps}
        width={sarcopenia.width}
        height={sarcopenia.height}
        defaultProps={{ cues: sarcopenia }}
      />
      <Composition
        id="JoyaElena"
        component={VideoMain}
        durationInFrames={joya.durationInFrames}
        fps={joya.fps}
        width={joya.width}
        height={joya.height}
        defaultProps={{ cues: joya }}
      />
      <Composition
        id="ColagenoElena"
        component={VideoMain}
        durationInFrames={colagenoArt.durationInFrames}
        fps={colagenoArt.fps}
        width={colagenoArt.width}
        height={colagenoArt.height}
        defaultProps={{ cues: colagenoArt }}
      />
      <Composition
        id="ManzanillaElena"
        component={VideoMain}
        durationInFrames={manzanilla.durationInFrames}
        fps={manzanilla.fps}
        width={manzanilla.width}
        height={manzanilla.height}
        defaultProps={{ cues: manzanilla }}
      />
      <Composition
        id="SenalNariz"
        component={VideoMain}
        durationInFrames={nariz.durationInFrames}
        fps={nariz.fps}
        width={nariz.width}
        height={nariz.height}
        defaultProps={{ cues: nariz }}
      />
      <Composition
        id="CurcumaElena"
        component={VideoMain}
        durationInFrames={curcuma.durationInFrames}
        fps={curcuma.fps}
        width={curcuma.width}
        height={curcuma.height}
        defaultProps={{ cues: curcuma }}
      />
      <Composition
        id="JengibreElena"
        component={VideoMain}
        durationInFrames={jengibre.durationInFrames}
        fps={jengibre.fps}
        width={jengibre.width}
        height={jengibre.height}
        defaultProps={{ cues: jengibre }}
      />
    </>
  );
};
