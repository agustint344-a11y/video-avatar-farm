import React from "react";
import { AbsoluteFill, Composition, Img, Sequence, staticFile } from "remotion";
import { CuadernoReceta, MarcaCirculo, PolaroidRecuerdo, SelloError, TicketPrecio, TimerCocina } from "./VideoEdit/kit/kit5";

const Bg: React.FC<{ src: string }> = ({ src }) => <AbsoluteFill><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>;
const D = 120;
const Demo: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Sequence durationInFrames={D}><CuadernoReceta durationInFrames={D} src={staticFile("img/nonna-salsa_s07.png")} title="La salsa de mi mamma" items={["1 kg de tomates maduros", "2 dientes de ajo", "Aceite de oliva", "Albahaca fresca", "Sal, al final"]} note="¡sin azúcar!" /></Sequence>
    <Sequence from={D} durationInFrames={D}><Bg src="img/nonna-salsa_s24.png" /><SelloError durationInFrames={D} num={3} text="Quemar el ajo" /></Sequence>
    <Sequence from={2 * D} durationInFrames={D}><TicketPrecio durationInFrames={D} src={staticFile("img/nonna-salsa_s47.png")} title="LA CUENTA" rows={[{ label: "Frasco de salsa", price: "$3,50", bad: true }, { label: "1 kg de tomates", price: "$1,20" }, { label: "Ajo y aceite", price: "$0,30" }]} total={{ label: "CASERA x3", price: "$1,50" }} stamp="AHORRÁS 57%" /></Sequence>
    <Sequence from={3 * D} durationInFrames={D}><PolaroidRecuerdo durationInFrames={D} src={staticFile("img/nonna-salsa_s44.png")} caption="Sicilia, agosto de 1961" sub="la salsa para todo el invierno" /></Sequence>
    <Sequence from={4 * D} durationInFrames={D}><Bg src="img/nonna-salsa_s29.png" /><TimerCocina durationInFrames={D} minutes={20} label="a fuego bajo" /></Sequence>
    <Sequence from={5 * D} durationInFrames={D}><Bg src="img/nonna-salsa_s30.png" /><MarcaCirculo durationInFrames={D} x={50} y={52} w={520} h={380} note="¿ves? no se cierra" /></Sequence>
  </AbsoluteFill>
);
export const RemotionRoot: React.FC = () => <Composition id="Kit5Demo" component={Demo} durationInFrames={6 * D} fps={30} width={1920} height={1080} />;
