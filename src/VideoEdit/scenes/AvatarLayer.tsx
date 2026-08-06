/**
 * Capa del avatar. Dos piezas:
 *   <AvatarAudio>     — el sonido del avatar, UNA vez, para toda la duración (nunca se corta).
 *   <AvatarBackdrop>  — el video del avatar a cámara completa, en el FONDO (z0), muteado.
 *
 * Diseño: el avatar es el fondo por defecto. El b-roll (z1) y los componentes (z2) se
 * dibujan ENCIMA y lo tapan cuando aparecen. Así "avatar full O visual full" sale solo,
 * sin ventanas ni PiP. El audio va aparte para que el video pueda taparse sin cortar la voz.
 */
import { Audio, Video } from "@remotion/media";
import React from "react";
import { AbsoluteFill, staticFile } from "remotion";

export const AvatarAudio: React.FC<{ slug: string }> = ({ slug }) => (
  <Audio src={staticFile(`${slug}.wav`)} />
);

export const AvatarBackdrop: React.FC<{ slug: string }> = ({ slug }) => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Video
      src={staticFile(`${slug}_opt.mp4`)}
      muted
      objectFit="cover"
      style={{ width: "100%", height: "100%" }}
    />
  </AbsoluteFill>
);
