// KitDemo.tsx — composición de PREVIEW del starter kit. Registrala en tu Root para verlos en Remotion Studio.
//
// En src/Root.tsx:
//   import { KitDemo, KITDEMO_FRAMES } from "./KitDemo";
//   <Composition id="KitDemo" component={KitDemo} durationInFrames={KITDEMO_FRAMES} fps={30} width={1920} height={1080} />
// Después:  npx remotion studio   → elegí "KitDemo".
//
// Cada componente se muestra ~4 s. Cambiá THEME_EARTH por THEME_NIGHT en un componente para ver el otro tema.

import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { BigStat, MythVsTruth, Compare, Checklist, Steps, PullQuote, Highlight, FramedPhoto, CTACard, CornerLabel, THEME_EARTH } from "./kit";

const S = 4 * 30; // 4 s por escena
const sec = (n: number) => Math.round(n * 30);

// una foto de ejemplo para FramedPhoto (poné cualquier imagen en public/):
const DEMO_IMG = "https://images.pexels.com/photos/210307/pexels-photo-210307.jpeg?auto=compress&cs=tinysrgb&w=1600";

const scenes: React.ReactNode[] = [
  <BigStat durationInFrames={S} eyebrow="La temperatura del subsuelo" value={55} suffix=" °F" support="13 °C constantes, todo el verano — lo que la tierra ya enfrió por vos" />,
  <MythVsTruth durationInFrames={S} myth="Abajo de la tierra hace frío" truth="Abajo hace LO MISMO todo el año: la tierra promedia las estaciones por vos" />,
  <Compare durationInFrames={S} title="El frío: ¿producto o algo tuyo?"
    left={{ label: "Aire acondicionado", sub: "se paga cada mes, para siempre; se rompe y se reemplaza" }}
    right={{ label: "El tubo enterrado", sub: "se paga una sola vez y trabaja gratis 50 años" }} />,
  <Checklist durationInFrames={S} title="Ayudá a la casa a guardar el fresco"
    items={["Cortinas gruesas del lado del sol", "Aislar el techo (por ahí entra casi todo el calor)", "Cerrar de día, ventilar de noche"]} stamp="Masa térmica" />,
  <Steps durationInFrames={S} eyebrow="La solución, en 3 pasos" title="Así lo hacés bien (cuesta $0 extra)"
    steps={[{ title: "Pendiente del 2% + drenaje", sub: "un pocito con piedras en el punto más bajo" }, { title: "Caño liso y sellado", sub: "nada de corrugado; se limpia una vez al año" }, { title: "Malla en las dos bocas", sub: "contra roedores e insectos" }]} />,
  <PullQuote durationInFrames={S} quote="Es la heladera más grande y más vieja del planeta. Y está funcionando debajo de tu casa ahora mismo." />,
  <Highlight durationInFrames={S} pre="Cuesta $300, dura 50 años y está, en la práctica," highlight="prohibido" post="." note="no por una ley — por algo más astuto" />,
  <FramedPhoto durationInFrames={S} src={DEMO_IMG} caption="El sótano de raíces" sub="55 °F todo el año, sin electricidad" />,
  <CTACard durationInFrames={S} eyebrow="Los planos y las medidas de hoy" title="Manual del Constructor Libre" bullet="76 arreglos caseros con medidas exactas — madera, óxido, plagas, humedad, caños" />,
];

export const KITDEMO_FRAMES = scenes.length * S;

export const KitDemo: React.FC = () => (
  <AbsoluteFill style={{ background: THEME_EARTH.bg }}>
    {scenes.map((el, i) => (
      <Sequence key={i} from={i * S} durationInFrames={S}>{el}</Sequence>
    ))}
    {/* CornerLabel va SOBRE b-roll, no usa Stage — demo encima de la última escena */}
    <Sequence from={(scenes.length - 1) * S} durationInFrames={S}>
      <CornerLabel durationInFrames={S} text="55 °F · Temperatura del suelo" corner="bl" />
    </Sequence>
  </AbsoluteFill>
);
