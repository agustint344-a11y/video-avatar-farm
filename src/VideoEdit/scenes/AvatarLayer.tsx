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
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import type { AvatarSeg } from "../types";

// El audio sale del propio opt.mp4 (el <Video> va muteado). Así no hay que subir un wav aparte.
// En el flujo Fish+InfiniteTalk se pasa audioSrc (mp3 master) y se usa ese en su lugar.
export const AvatarAudio: React.FC<{ slug: string; audioSrc?: string }> = ({ slug, audioSrc }) => (
  <Audio src={staticFile(audioSrc ?? `${slug}_opt.mp4`)} />
);

// Segmentos de avatar on-camera (Fish+InfiniteTalk): el avatar se ve a pantalla completa
// SOLO en sus tramos; el resto lo cubren el b-roll y los componentes. Cada segmento toma
// su tramo del mp4 único de avatar con trimBefore (clip). Va muteado: la voz es el audio master.
export const AvatarSegments: React.FC<{ slug: string; avatarSrc?: string; segs: AvatarSeg[] }> = ({ slug, avatarSrc, segs }) => {
  const src = staticFile(avatarSrc ?? `${slug}_avatar.mp4`);
  return (
    <>
      {segs.map((s, i) => (
        <Sequence key={`av${i}`} from={s.from} durationInFrames={s.dur} name={`avatar ${i}${s.layout ? " " + s.layout : ""}`}>
          {s.layout === "split" ? <AvatarSplit s={s} src={src} /> : s.layout === "cine" ? <AvatarCine s={s} src={src} /> : (
          <AbsoluteFill style={{ backgroundColor: "#000" }}>
            <Video src={src} muted trimBefore={s.clip} objectFit="cover" style={{ width: "100%", height: "100%", ...(s.zoom ? { transform: `scale(${s.zoom})`, transformOrigin: "50% 32%" } : {}) }} />
          </AbsoluteFill>
          )}
        </Sequence>
      ))}
    </>
  );
};

// 2026-11-03 (refs Cementos Rogelio / Elias Yoder): pantalla partida — presentador a la izquierda, la imagen de lo que habla a la derecha.
const AvatarSplit: React.FC<{ s: AvatarSeg; src: string }> = ({ s, src }) => {
  const f = useCurrentFrame();
  const k = Math.max(0, Math.min(1, f / 10));
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 1080, overflow: "hidden" }}>
        <Video src={src} muted trimBefore={s.clip} objectFit="cover" style={{ width: "100%", height: "100%", transform: "scale(1.12)", transformOrigin: "50% 30%" }} />
      </div>
      {s.side && (
        <div style={{ position: "absolute", left: 960, top: 0, width: 960, height: 1080, overflow: "hidden", transform: `translateX(${(1 - k) * 120}px)` }}>
          <Img src={staticFile(s.side)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.03 + f / 4000})` }} />
        </div>
      )}
      <div style={{ position: "absolute", left: 957, top: 0, width: 6, height: 1080, background: "#fff" }} />
    </AbsoluteFill>
  );
};
// 2026-11-03 (ref El Constructor Libre): frase en serif sobre la imagen oscurecida + el presentador hablando en un recuadro a la derecha.
const AvatarCine: React.FC<{ s: AvatarSeg; src: string }> = ({ s, src }) => {
  const f = useCurrentFrame();
  const k = Math.max(0, Math.min(1, f / 12));
  const words = (s.text || "").split(" ");
  const shown = Math.min(words.length, Math.floor(f / 4) + 1);
  const acc = (s.accent || "").toLowerCase();
  return (
    <AbsoluteFill style={{ backgroundColor: "#121212", overflow: "hidden" }}>
      {s.side && <Img src={staticFile(s.side)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.08 + f / 3000})`, filter: "blur(8px) brightness(0.35) saturate(0.75)" }} />}
      <div style={{ position: "absolute", left: 150, right: 820, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", opacity: k }}>
        {s.kicker && <div style={{ color: "rgba(255,255,255,0.7)", font: "600 24px Fraunces, serif", letterSpacing: 6, textTransform: "uppercase", marginBottom: 26 }}>{s.kicker}</div>}
        <div style={{ color: "#f4efe6", font: "500 76px/1.18 Fraunces, serif", textShadow: "0 4px 30px rgba(0,0,0,0.5)" }}>
          {words.slice(0, shown).map((w, i) => <span key={i} style={{ color: acc && acc.split(" ").includes(w.toLowerCase().replace(/[.,;:¿?¡!]/g, "")) ? "#E0835A" : undefined }}>{w} </span>)}
        </div>
      </div>
      <div style={{ position: "absolute", right: 110, top: 190, width: 600, height: 700, borderRadius: 22, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.6)", border: "4px solid rgba(255,255,255,0.85)", transform: `translateY(${(1 - k) * 40}px)`, opacity: k }}>
        <Video src={src} muted trimBefore={s.clip} objectFit="cover" style={{ width: "100%", height: "100%", transform: "scale(1.25)", transformOrigin: "50% 28%" }} />
      </div>
    </AbsoluteFill>
  );
};

// AvatarPipSegs (2026-10-26) — tramos de avatar con pip:true: círculo abajo a la derecha, ENCIMA de las animaciones 3D.
export const AvatarPipSegs: React.FC<{ slug: string; avatarSrc?: string; segs: AvatarSeg[] }> = ({ slug, avatarSrc, segs }) => {
  const src = staticFile(avatarSrc ?? `${slug}_avatar.mp4`);
  return (
    <>
      {segs.map((s, i) => !s.pip ? null : (
        <Sequence key={`pip${i}`} from={s.from} durationInFrames={s.dur} name={`avatar pip ${i}`}>
          <PipCircle dur={s.dur}><Video src={src} muted trimBefore={s.clip} objectFit="cover" style={{ width: "100%", height: "100%", transform: "scale(1.35)", transformOrigin: "50% 30%" }} /></PipCircle>
        </Sequence>
      ))}
    </>
  );
};
const PipCircle: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const k = Math.max(0, Math.min(1, f / 8, (dur - f) / 8));
  return <div style={{ position: "absolute", right: 60, bottom: 60, width: 400, height: 400, borderRadius: 999, overflow: "hidden", opacity: k, transform: `scale(${0.8 + 0.2 * k})`, boxShadow: "0 24px 60px rgba(0,0,0,0.45)", border: "8px solid #fff", background: "#000" }}>{children}</div>;
};

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
