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
import ajoCues from "./VideoEdit/data/cues_ajo-elena.json";
import camerasCues from "./VideoEdit/data/cues_cameras-atticfortune.json";
import canelaCues from "./VideoEdit/data/cues_canela-elena.json";
import eucaliptoCues from "./VideoEdit/data/cues_eucalipto-juantombo.json";
import watchesCues from "./VideoEdit/data/cues_watches-atticfortune.json";
import laurelCues from "./VideoEdit/data/cues_laurel-elena.json";
import clavoCues from "./VideoEdit/data/cues_clavo-juantombo.json";
import jengibreCues from "./VideoEdit/data/cues_jengibre-elena.json";
import romeroDolorCues from "./VideoEdit/data/cues_romero-dolor.json";
import magnesioCues from "./VideoEdit/data/cues_magnesio-elena.json";
import bicarbonatoCues from "./VideoEdit/data/cues_bicarbonato-juantombo.json";
import coinsAtticCues from "./VideoEdit/data/cues_coins-atticfortune.json";
import vinagreCues from "./VideoEdit/data/cues_vinagre-elena.json";
import mielCues from "./VideoEdit/data/cues_miel-juantombo.json";
import vinylCues from "./VideoEdit/data/cues_vinyl-atticfortune.json";

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
  const ajo = ajoCues as Cues;
  const cameras = camerasCues as Cues;
  const canela = canelaCues as Cues;
  const eucalipto = eucaliptoCues as Cues;
  const watches = watchesCues as Cues;
  const laurel = laurelCues as Cues;
  const clavo = clavoCues as Cues;
  const jengibre = jengibreCues as Cues;
  const romeroDolor = romeroDolorCues as Cues;
  const magnesio = magnesioCues as Cues;
  const bicarbonato = bicarbonatoCues as Cues;
  const coinsAttic = coinsAtticCues as Cues;
  const vinagre = vinagreCues as Cues;
  const miel = mielCues as Cues;
  const vinyl = vinylCues as Cues;
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
        id="RomeroDolor"
        component={VideoMain}
        durationInFrames={romeroDolor.durationInFrames}
        fps={romeroDolor.fps}
        width={romeroDolor.width}
        height={romeroDolor.height}
        defaultProps={{ cues: romeroDolor }}
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
      <Composition
        id="AjoElena"
        component={VideoMain}
        durationInFrames={ajo.durationInFrames}
        fps={ajo.fps}
        width={ajo.width}
        height={ajo.height}
        defaultProps={{ cues: ajo }}
      />
      <Composition
        id="CamerasAttic"
        component={VideoMain}
        durationInFrames={cameras.durationInFrames}
        fps={cameras.fps}
        width={cameras.width}
        height={cameras.height}
        defaultProps={{ cues: cameras }}
      />
      <Composition id="LaurelElena" component={VideoMain} durationInFrames={laurel.durationInFrames} fps={laurel.fps} width={laurel.width} height={laurel.height} defaultProps={{ cues: laurel }} />
      <Composition id="ClavoJuantombo" component={VideoMain} durationInFrames={clavo.durationInFrames} fps={clavo.fps} width={clavo.width} height={clavo.height} defaultProps={{ cues: clavo }} />
      <Composition id="CanelaElena" component={VideoMain} durationInFrames={canela.durationInFrames} fps={canela.fps} width={canela.width} height={canela.height} defaultProps={{ cues: canela }} />
      <Composition id="EucaliptoJuanTombo" component={VideoMain} durationInFrames={eucalipto.durationInFrames} fps={eucalipto.fps} width={eucalipto.width} height={eucalipto.height} defaultProps={{ cues: eucalipto }} />
      <Composition id="WatchesAttic" component={VideoMain} durationInFrames={watches.durationInFrames} fps={watches.fps} width={watches.width} height={watches.height} defaultProps={{ cues: watches }} />
      <Composition id="MagnesioElena" component={VideoMain} durationInFrames={magnesio.durationInFrames} fps={magnesio.fps} width={magnesio.width} height={magnesio.height} defaultProps={{ cues: magnesio }} />
      <Composition id="BicarbonatoJuanTombo" component={VideoMain} durationInFrames={bicarbonato.durationInFrames} fps={bicarbonato.fps} width={bicarbonato.width} height={bicarbonato.height} defaultProps={{ cues: bicarbonato }} />
      <Composition id="CoinsAttic" component={VideoMain} durationInFrames={coinsAttic.durationInFrames} fps={coinsAttic.fps} width={coinsAttic.width} height={coinsAttic.height} defaultProps={{ cues: coinsAttic }} />
      <Composition id="VinagreElena" component={VideoMain} durationInFrames={vinagre.durationInFrames} fps={vinagre.fps} width={vinagre.width} height={vinagre.height} defaultProps={{ cues: vinagre }} />
      <Composition id="MielJuanTombo" component={VideoMain} durationInFrames={miel.durationInFrames} fps={miel.fps} width={miel.width} height={miel.height} defaultProps={{ cues: miel }} />
      <Composition id="VinylAttic" component={VideoMain} durationInFrames={vinyl.durationInFrames} fps={vinyl.fps} width={vinyl.width} height={vinyl.height} defaultProps={{ cues: vinyl }} />
    </>
  );
};
