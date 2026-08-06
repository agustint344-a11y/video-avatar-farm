import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile } from "remotion";
import { AnnotatedImage, BigNumberCard, SplitInfo, Testimonial } from "./kit3";

const S = 4 * 30;
export const KIT3DEMO_FRAMES = 4 * S;

// usa imágenes que ya existen en public/img (del video de la chía)
const IMG1 = "img/chia_cerebro.jpg";
const IMG2 = "img/chia_calabaza.jpg";

export const Kit3Demo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0b0b0b" }}>
    <Sequence from={0} durationInFrames={S}>
      <Testimonial durationInFrames={S} quote="Al principio no veía nada, casi lo dejo, pero seguí. A los 2 meses el pelo volvió a poblarse." name="Don Aurelio" role="carpintero, 84 años" photo={IMG1} />
    </Sequence>
    <Sequence from={S} durationInFrames={S}>
      <AbsoluteFill><Img src={staticFile(IMG2)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
      <SplitInfo durationInFrames={S} eyebrow="En resumen" title="Mi guía de la salud después de los 60" items={["150 remedios ordenados", "Con las cantidades exactas", "Todo junto en el celular"]} />
    </Sequence>
    <Sequence from={2 * S} durationInFrames={S}>
      <AnnotatedImage durationInFrames={S} eyebrow="Consultar antes" title="Cuándo ir al médico primero" image={IMG1} points={[{ label: "Caída por mechones", x: 30, y: 40, side: "left" }, { label: "Heridas o irritación", x: 70, y: 55, side: "right" }]} />
    </Sequence>
    <Sequence from={3 * S} durationInFrames={S}>
      <BigNumberCard durationInFrames={S} eyebrow="Estudios en personas" value={7} suffix=" mmHg" label="cuánto puede bajar la presión" />
    </Sequence>
  </AbsoluteFill>
);
