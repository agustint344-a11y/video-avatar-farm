import React from "react";
import { AbsoluteFill, Composition, Sequence, registerRoot } from "remotion";
import { Barras3D, Cano3D, Circuito3D, Pared3D, Vaso3D } from "./VideoEdit/kit/kit7_3d";

const S = 210;
const Demo: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Sequence durationInFrames={S}><Pared3D durationInFrames={S} kicker="Por dentro de la pared" title="Así sube la humedad" problema="humedad" note="El agua sube por el ladrillo como por una esponja" /></Sequence>
    <Sequence from={S} durationInFrames={S}><Pared3D durationInFrames={S} title="El moho vive en la pintura" problema="moho" /></Sequence>
    <Sequence from={S * 2} durationInFrames={S}><Cano3D durationInFrames={S} kicker="Dentro del caño" title="10 años de sarro" obstruccion={70} note="Por eso sale menos agua caliente" /></Sequence>
    <Sequence from={S * 3} durationInFrames={S}><Circuito3D durationInFrames={S} title="Lo que gasta de verdad" watts={12} aparato="Foco LED" /></Sequence>
    <Sequence from={S * 4} durationInFrames={S}><Vaso3D durationInFrames={S} kicker="Dentro de la arteria" title="Así se tapa una arteria" problema="placa" /></Sequence>
    <Sequence from={S * 5} durationInFrames={S}><Vaso3D durationInFrames={S} title="El azúcar en la sangre" problema="azucar" /></Sequence>
    <Sequence from={S * 6} durationInFrames={S}><Barras3D durationInFrames={S} title="Consumo por mes" unidad="kWh" destacar={2} items={[{ label: "LED", value: 3 }, { label: "Bajo consumo", value: 7 }, { label: "Incandescente", value: 22 }]} /></Sequence>
  </AbsoluteFill>
);
const Root: React.FC = () => <Composition id="Kit7Demo" component={Demo} durationInFrames={S * 7} fps={30} width={1920} height={1080} />;
registerRoot(Root);
