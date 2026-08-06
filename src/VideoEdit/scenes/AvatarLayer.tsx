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
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";

// El audio sale del propio opt.mp4 (el <Video> va muteado). Así no hay que subir un wav aparte.
export const AvatarAudio: React.FC<{ slug: string }> = ({ slug }) => (
  <Audio src={staticFile(`${slug}_opt.mp4`)} />
);

// AvatarPip — el avatar chico en una esquina, ENCIMA del b-roll (estilo "dopamínico":
// el b-roll llena la pantalla y el presentador queda presente pero pequeño). Va montado
// toda la duración (sincronizado con el audio) y se muestra solo en las ventanas de b-roll.
export const AvatarPip: React.FC<{ slug: string; windows: { from: number; dur: number }[]; corner?: "br" | "bl" | "tr" | "tl" }> = ({ slug, windows, corner = "br" }) => {
  const f = useCurrentFrame();
  const FADE = 6;
  let op = 0;
  for (const w of windows) {
    const t = Math.min(
      (f - w.from) / FADE,
      (w.from + w.dur - f) / FADE,
      1,
    );
    op = Math.max(op, Math.max(0, Math.min(1, t)));
  }
  if (op <= 0.001) return null;
  const W = 500, H = 500 * (9 / 16) * (16 / 9); // caja 500x500 recorta el avatar (retrato)
  const pos: React.CSSProperties =
    corner === "bl" ? { bottom: 70, left: 70 } : corner === "tr" ? { top: 70, right: 70 } : corner === "tl" ? { top: 70, left: 70 } : { bottom: 70, right: 70 };
  return (
    <div style={{ position: "absolute", ...pos, width: 520, height: 300, borderRadius: 24, overflow: "hidden", opacity: op, boxShadow: "0 24px 60px rgba(0,0,0,0.45)", border: "5px solid rgba(255,255,255,0.9)" }}>
      <Video src={staticFile(`${slug}_opt.mp4`)} muted objectFit="cover" style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

// Ken Burns SUAVE y permanente sobre el avatar: un push lento que respira (nunca queda
// una cabeza parlante clavada). Amplitud chica para que no distraiga. Ciclo ~24 s.
export const AvatarBackdrop: React.FC<{ slug: string }> = ({ slug }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const scale = 1.04 + 0.025 * Math.sin(t / 12); // 1.015 ↔ 1.065
  const x = 10 * Math.sin(t / 17);
  const y = 6 * Math.cos(t / 21);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <Video
        src={staticFile(`${slug}_opt.mp4`)}
        muted
        objectFit="cover"
        style={{ width: "100%", height: "100%", transform: `scale(${scale}) translate(${x}px, ${y}px)` }}
      />
    </AbsoluteFill>
  );
};
