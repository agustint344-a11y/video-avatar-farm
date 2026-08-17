// kit4.tsx — COMPONENTE ESTRELLA: Top5Reveal
// Carrusel Top-N "ultra": fondo blanco borroso moderno, tarjetas flotantes en anillo con
// profundidad/parallax, giro suave, cámara con vida (zoom no-lineal + micro-handheld), y
// reveal por tarjeta con candado que se abre y enfoque (desenfoque → nítido).
//
// Coreografía (pedido del usuario 2026-08-12):
//   1) "hay 5 cultivos": entra la 1ª tarjeta desde abajo, la cámara hace zoom-in y la sigue;
//      luego aparecen las otras 4 y el anillo empieza a girar (todas borrosas + con candado).
//   2) "cultivo número N": el anillo gira suave hasta esa tarjeta, leve zoom gradual, el candado
//      se anima y se abre, y esa imagen se enfoca.
//
// Se ancla como UN componente que dura toda la sección del top (ver build: comp de dur larga con
// props.revealsSec relativos). Uso:
//   { comp:"Top5Reveal", from, dur, props:{ theme, title, cards:[{image,label,rank}], introSec, revealsSec } }

import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME_CLINIC, type Theme } from "./kit";

type Card = { image?: string; label: string; rank?: number | string; note?: string };

const smooth = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t)); // smoothstep
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const shadow = "0 18px 50px rgba(0,0,0,0.28)";

// interpolación por-segmento con smoothstep (para que el anillo frene/arranque con suavidad)
const smoothKeys = (t: number, times: number[], vals: number[]) => {
  if (t <= times[0]) return vals[0];
  for (let i = 0; i < times.length - 1; i++) {
    if (t >= times[i] && t <= times[i + 1]) {
      const k = smooth((t - times[i]) / Math.max(0.0001, times[i + 1] - times[i]));
      return lerp(vals[i], vals[i + 1], k);
    }
  }
  return vals[vals.length - 1];
};

const Padlock: React.FC<{ open: number; color: string }> = ({ open, color }) => {
  // open 0 = cerrado, 1 = abierto (el arco rota y sube)
  const lift = open * -10;
  const rot = open * -38;
  return (
    <svg width="86" height="104" viewBox="0 0 86 104" style={{ filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.35))" }}>
      <g transform={`translate(43 ${34 + lift}) rotate(${rot})`} style={{ transformOrigin: "0px 0px" }}>
        <path d="M -20 4 L -20 -8 A 20 20 0 0 1 20 -8 L 20 4" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" />
      </g>
      <rect x="14" y="34" width="58" height="46" rx="10" fill={color} />
      <circle cx="43" cy="53" r="6.5" fill="rgba(0,0,0,0.35)" />
      <rect x="40.5" y="55" width="5" height="14" rx="2.5" fill="rgba(0,0,0,0.35)" />
    </svg>
  );
};

export const Top5Reveal: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  eyebrow?: string;
  title?: string;
  cards: Card[];
  introSec?: number;      // cuándo termina de ensamblarse el anillo
  revealsSec?: number[];  // momento de reveal/enfoque de cada tarjeta (relativo, en orden de las cards)
}> = ({ durationInFrames, theme = THEME_CLINIC, eyebrow = "TOP 5", title, cards, introSec = 3, revealsSec }) => {
  const { fps, width, height } = useVideoConfig();
  const f = useCurrentFrame();
  const t = f / fps;
  const N = cards.length;
  const reveals = revealsSec && revealsSec.length === N ? revealsSec : cards.map((_, i) => introSec + 2 + i * 3.4);

  // frontPos(t): -1.6 (fuera) → 0 (1ª tarjeta al frente al terminar el intro) → i en cada reveal
  const kt = [0, introSec, ...reveals];
  const kv = [-1.6, 0, ...reveals.map((_, i) => i)];
  const wobble = 0.055 * Math.sin(t * 0.7) + 0.03 * Math.sin(t * 1.7 + 1);
  const frontPos = smoothKeys(t, kt, kv) + wobble;

  // cámara con vida: zoom gradual (sube un poco en cada reveal) + micro-handheld
  const zoomKeys = smoothKeys(t, [0, introSec, ...reveals], [1.06, 1.0, ...reveals.map((_, i) => 1.02 + i * 0.025)]);
  const handheld = 1 + 0.010 * Math.sin(t * 1.3) + 0.006 * Math.sin(t * 2.3 + 0.6);
  const camScale = zoomKeys * handheld;
  const camX = 7 * Math.sin(t * 0.9) + 4 * Math.sin(t * 1.9);
  // seguimiento de la 1ª tarjeta mientras sube en el intro
  const introProg = smooth(interpolate(t, [0.2, introSec - 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const camY = (1 - introProg) * 120 + 6 * Math.cos(t * 1.1);

  const cx = 0, cy = 0;
  const RX = Math.min(width, 1920) * 0.30;
  const CARD_W = 430, CARD_H = 560;

  const items = cards.map((c, i) => {
    const angle = (i - frontPos) * ((2 * Math.PI) / N) + wobble * 0.5;
    const depth = Math.cos(angle); // 1 front, -1 back
    const d01 = (depth + 1) / 2;
    const x = cx + RX * Math.sin(angle);
    const y = cy - 26 * depth;
    const scale = lerp(0.52, 1.0, d01);
    const opacity = lerp(0.18, 1, d01 * d01);
    const depthBlur = lerp(12, 0, d01);
    // reveal (candado + desenfoque de bloqueo)
    const rev = smooth(interpolate(t, [reveals[i], reveals[i] + 0.75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
    const lockBlur = (1 - rev) * 18;
    const isFront = Math.abs(((i - frontPos) % N + N) % N) < 0.5 || Math.abs(((frontPos - i) % N + N) % N) < 0.5;
    const focusPop = isFront ? rev * 0.06 : 0;
    // entrada: la 1ª tarjeta sube desde abajo; las demás aparecen escalonadas
    const enter = i === 0
      ? smooth(interpolate(t, [0.1, introSec - 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))
      : smooth(interpolate(t, [introSec - 1.6 + i * 0.22, introSec - 0.4 + i * 0.22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
    const enterY = (1 - enter) * (i === 0 ? 780 : 120);
    const enterScale = i === 0 ? 1 : lerp(0.4, 1, enter);
    return { c, i, x, y, scale: scale * (1 + focusPop) * enterScale, opacity: opacity * enter, blur: Math.max(depthBlur, lockBlur), z: Math.round(depth * 100) + 100, rev, enterY };
  });

  return (
    <AbsoluteFill style={{ background: theme.bg, overflow: "hidden", fontFamily: theme.sans }}>
      {/* fondo blanco borroso moderno: blobs suaves muy desenfocados */}
      <AbsoluteFill style={{ filter: "blur(90px)", opacity: 0.9 }}>
        <div style={{ position: "absolute", top: "12%", left: "8%", width: 620, height: 620, borderRadius: "50%", background: theme.accent, opacity: 0.20 }} />
        <div style={{ position: "absolute", bottom: "6%", right: "10%", width: 720, height: 720, borderRadius: "50%", background: theme.good, opacity: 0.16 }} />
        <div style={{ position: "absolute", top: "30%", right: "26%", width: 520, height: 520, borderRadius: "50%", background: "#ffffff", opacity: 0.7 }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0.15) 40%, rgba(255,255,255,0.55))" }} />

      {/* título del top */}
      {(title || eyebrow) && (
        <div style={{ position: "absolute", top: 70, left: 0, right: 0, textAlign: "center", opacity: introProg }}>
          {eyebrow && <div style={{ color: theme.accent, font: `800 30px/1 ${theme.sans}`, letterSpacing: 6, textTransform: "uppercase" }}>{eyebrow}</div>}
          {title && <div style={{ color: theme.ink, font: `800 66px/1.05 ${theme.serif}`, marginTop: 10 }}>{title}</div>}
        </div>
      )}

      {/* escenario 3D con cámara */}
      <AbsoluteFill style={{ perspective: 1600, transform: `translate(${camX}px, ${camY}px) scale(${camScale})` }}>
        <div style={{ position: "absolute", left: "50%", top: "54%", width: 0, height: 0, transformStyle: "preserve-3d" }}>
          {items.sort((a, b) => a.z - b.z).map((it) => (
            <div key={it.i} style={{
              position: "absolute",
              left: it.x - CARD_W / 2, top: it.y - CARD_H / 2 + it.enterY,
              width: CARD_W, height: CARD_H,
              transform: `scale(${it.scale})`,
              opacity: it.opacity, zIndex: it.z,
              borderRadius: 28, overflow: "hidden",
              background: theme.panel,
              boxShadow: `0 40px 90px rgba(0,0,0,${0.10 + 0.22 * ((it.z - 0) / 200)})`,
              border: `1px solid ${theme.line}`,
            }}>
              {/* imagen (borrosa hasta el reveal) */}
              <div style={{ position: "absolute", inset: 0, filter: `blur(${it.blur}px)`, transform: `scale(${1.06 + it.blur * 0.004})` }}>
                {it.c.image
                  ? <Img src={staticFile(it.c.image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: "100%", background: `linear-gradient(160deg, ${theme.accent}, ${theme.good})` }} />}
              </div>
              {/* velo mientras está bloqueada */}
              <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.5)", opacity: 1 - it.rev }} />
              {/* candado */}
              {it.rev < 0.98 && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 1 - it.rev }}>
                  <Padlock open={it.rev} color={theme.accent} />
                </div>
              )}
              {/* badge de rank */}
              <div style={{ position: "absolute", top: 16, left: 16, minWidth: 62, height: 62, padding: "0 14px", borderRadius: 16, background: theme.accent, color: "#fff", font: `900 40px/62px ${theme.serif}`, textAlign: "center", boxShadow: "0 8px 20px rgba(0,0,0,0.25)" }}>
                {it.c.rank ?? `#${N - it.i}`}
              </div>
              {/* etiqueta (aparece con el reveal) */}
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "40px 22px 20px", background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.72))", opacity: it.rev, transform: `translateY(${(1 - it.rev) * 20}px)` }}>
                <div style={{ color: "#fff", font: `800 40px/1.1 ${theme.serif}` }}>{it.c.label}</div>
                {it.c.note && <div style={{ color: "rgba(255,255,255,0.85)", font: `500 26px/1.2 ${theme.sans}`, marginTop: 6 }}>{it.c.note}</div>}
              </div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ═══════════════ 2) AntesDespues — slider cinematográfico antes/después ═══════════════ */
export const AntesDespues: React.FC<{
  durationInFrames: number; theme?: Theme; before: string; after: string;
  beforeLabel?: string; afterLabel?: string; title?: string; eyebrow?: string;
}> = ({ durationInFrames, theme = THEME_CLINIC, before, after, beforeLabel = "ANTES", afterLabel = "DESPUÉS", title, eyebrow }) => {
  const { fps } = useVideoConfig();
  const f = useCurrentFrame();
  const t = f / fps;
  const div = smoothKeys(t, [0, 0.4, 2.6, 3.6, 999], [50, 12, 90, 54, 54]) + 1.4 * Math.sin(t * 0.8);
  const camScale = smoothKeys(t, [0, 1.2], [1.08, 1.0]) * (1 + 0.008 * Math.sin(t * 1.4));
  const camX = 6 * Math.sin(t * 0.9);
  const appear = smooth(interpolate(t, [0, 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <AbsoluteFill style={{ background: "#0b0f12", overflow: "hidden", fontFamily: theme.sans }}>
      <AbsoluteFill style={{ transform: `translateX(${camX}px) scale(${camScale})`, opacity: appear }}>
        <Img src={staticFile(before)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - div}% 0 0)` }}>
          <Img src={staticFile(after)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `${div}%`, width: 4, background: "#fff", boxShadow: "0 0 24px rgba(255,255,255,0.8)" }} />
        <div style={{ position: "absolute", top: "50%", left: `${div}%`, transform: "translate(-50%,-50%)", width: 68, height: 68, borderRadius: "50%", background: "#fff", boxShadow: "0 8px 26px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: theme.accent, font: "900 30px sans-serif" }}>{"⇆"}</div>
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 54, left: 60, opacity: appear, background: "rgba(0,0,0,0.55)", color: "#fff", padding: "10px 22px", borderRadius: 12, font: `800 30px/1 ${theme.sans}`, letterSpacing: 2 }}>{beforeLabel}</div>
      <div style={{ position: "absolute", top: 54, right: 60, opacity: appear, background: theme.accent, color: "#fff", padding: "10px 22px", borderRadius: 12, font: `800 30px/1 ${theme.sans}`, letterSpacing: 2 }}>{afterLabel}</div>
      {(title || eyebrow) && (
        <div style={{ position: "absolute", bottom: 60, left: 0, right: 0, textAlign: "center", opacity: appear }}>
          {eyebrow && <div style={{ color: theme.accent, font: `800 26px/1 ${theme.sans}`, letterSpacing: 5, textTransform: "uppercase", textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}>{eyebrow}</div>}
          {title && <div style={{ color: "#fff", font: `800 54px/1.1 ${theme.serif}`, marginTop: 8, textShadow: "0 3px 18px rgba(0,0,0,0.7)" }}>{title}</div>}
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ═══════════════ 3) Medidor — gauge radial con número que sube (dato de impacto) ═══════════════ */
export const Medidor: React.FC<{
  durationInFrames: number; theme?: Theme; value: number; max?: number;
  suffix?: string; prefix?: string; label?: string; eyebrow?: string;
}> = ({ durationInFrames, theme = THEME_CLINIC, value, max = 100, suffix = "%", prefix = "", label, eyebrow }) => {
  const { fps } = useVideoConfig();
  const f = useCurrentFrame();
  const t = f / fps;
  const prog = smooth(interpolate(t, [0.3, 2.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const frac = Math.min(1, (value / max) * prog);
  const shown = Math.round(value * prog);
  const R = 300, C = 2 * Math.PI * R, SWEEP = 0.72;
  const dash = C * SWEEP;
  const appear = smooth(interpolate(t, [0, 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const pulse = 1 + 0.02 * Math.sin(t * 3);
  const tipAngle = -234 + (SWEEP * 360) * frac;
  const rad = (tipAngle * Math.PI) / 180;
  const tipX = 400 + R * Math.cos(rad), tipY = 400 + R * Math.sin(rad);
  return (
    <AbsoluteFill style={{ background: theme.bg, alignItems: "center", justifyContent: "center", fontFamily: theme.sans, overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(90px)", opacity: 0.8 }}>
        <div style={{ position: "absolute", top: "20%", left: "18%", width: 560, height: 560, borderRadius: "50%", background: theme.accent, opacity: 0.18 }} />
        <div style={{ position: "absolute", bottom: "12%", right: "16%", width: 620, height: 620, borderRadius: "50%", background: theme.good, opacity: 0.14 }} />
      </AbsoluteFill>
      <div style={{ transform: `scale(${appear * pulse})`, opacity: appear }}>
        {eyebrow && <div style={{ textAlign: "center", color: theme.accent, font: `800 30px/1 ${theme.sans}`, letterSpacing: 6, textTransform: "uppercase", marginBottom: 14 }}>{eyebrow}</div>}
        <svg width="800" height="760" viewBox="0 0 800 800" style={{ overflow: "visible" }}>
          <defs>
            <filter id="glow"><feGaussianBlur stdDeviation="10" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          <circle cx="400" cy="400" r={R} fill="none" stroke={theme.line} strokeWidth="34" strokeLinecap="round" strokeDasharray={`${dash} ${C}`} transform="rotate(126 400 400)" />
          <circle cx="400" cy="400" r={R} fill="none" stroke={theme.accent} strokeWidth="34" strokeLinecap="round" strokeDasharray={`${dash * frac} ${C}`} transform="rotate(126 400 400)" filter="url(#glow)" />
          <circle cx={tipX} cy={tipY} r="16" fill="#fff" stroke={theme.accent} strokeWidth="6" filter="url(#glow)" />
          <text x="400" y="410" textAnchor="middle" fill={theme.ink} style={{ font: `900 210px/1 ${theme.serif}` }}>
            <tspan fontSize="90" fill={theme.accent}>{prefix}</tspan>{shown}<tspan fontSize="90" fill={theme.accent}>{suffix}</tspan>
          </text>
          {label && <text x="400" y="500" textAnchor="middle" fill={theme.muted} style={{ font: `600 40px/1 ${theme.sans}` }}>{label}</text>}
        </svg>
      </div>
    </AbsoluteFill>
  );
};

/* ═══════════════ 4) Timeline — línea de tiempo que se ilumina progresivamente ═══════════════ */
export const Timeline: React.FC<{
  durationInFrames: number; theme?: Theme; title?: string; eyebrow?: string;
  steps: { when: string; text: string }[];
}> = ({ durationInFrames, theme = THEME_CLINIC, title, eyebrow, steps }) => {
  const { fps } = useVideoConfig();
  const f = useCurrentFrame();
  const t = f / fps;
  const n = steps.length;
  const startFill = 1.0, perStep = 1.6;
  const fill = smooth(interpolate(t, [startFill, startFill + perStep * (n - 1) + 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const appear = smooth(interpolate(t, [0, 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const camScale = 1 + 0.006 * Math.sin(t * 1.2);
  const L = 8, R = 92;
  const xOf = (i: number) => L + (R - L) * (n === 1 ? 0.5 : i / (n - 1));
  return (
    <AbsoluteFill style={{ background: theme.bg, fontFamily: theme.sans, overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(100px)", opacity: 0.75 }}>
        <div style={{ position: "absolute", top: "16%", left: "10%", width: 620, height: 620, borderRadius: "50%", background: theme.accent, opacity: 0.16 }} />
        <div style={{ position: "absolute", bottom: "10%", right: "12%", width: 680, height: 680, borderRadius: "50%", background: theme.good, opacity: 0.13 }} />
      </AbsoluteFill>
      {(title || eyebrow) && (
        <div style={{ position: "absolute", top: 80, left: 0, right: 0, textAlign: "center", opacity: appear }}>
          {eyebrow && <div style={{ color: theme.accent, font: `800 28px/1 ${theme.sans}`, letterSpacing: 6, textTransform: "uppercase" }}>{eyebrow}</div>}
          {title && <div style={{ color: theme.ink, font: `800 62px/1.05 ${theme.serif}`, marginTop: 10 }}>{title}</div>}
        </div>
      )}
      <AbsoluteFill style={{ transform: `scale(${camScale})` }}>
        <div style={{ position: "absolute", top: "52%", left: `${L}%`, right: `${100 - R}%`, height: 8, background: theme.line, borderRadius: 8 }} />
        <div style={{ position: "absolute", top: "52%", left: `${L}%`, width: `${(R - L) * fill}%`, height: 8, background: theme.accent, borderRadius: 8, boxShadow: `0 0 20px ${theme.accent}` }} />
        {steps.map((s, i) => {
          const nodeProg = smooth(interpolate(t, [startFill + perStep * i - 0.25, startFill + perStep * i + 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
          const on = fill >= (n === 1 ? 0.5 : i / (n - 1)) - 0.001;
          const up = i % 2 === 0;
          return (
            <div key={i}>
              <div style={{ position: "absolute", top: "52%", left: `${xOf(i)}%`, transform: `translate(-50%,-50%) scale(${nodeProg})`, width: 40, height: 40, borderRadius: "50%", background: on ? theme.accent : theme.panel, border: `5px solid ${on ? theme.accent : theme.line}`, boxShadow: on ? `0 0 26px ${theme.accent}` : "none" }} />
              <div style={{ position: "absolute", top: up ? "26%" : "60%", left: `${xOf(i)}%`, transform: `translate(-50%, ${(1 - nodeProg) * 24}px)`, opacity: nodeProg, width: 300, textAlign: "center", background: theme.panel, border: `1px solid ${theme.line}`, borderTop: `6px solid ${theme.accent}`, borderRadius: 16, padding: "18px 20px", boxShadow: shadow }}>
                <div style={{ color: theme.accent, font: `800 30px/1 ${theme.serif}` }}>{s.when}</div>
                <div style={{ color: theme.ink, font: `500 26px/1.25 ${theme.sans}`, marginTop: 8 }}>{s.text}</div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ═══════════════ 5) QRTag — QR en la esquina para escanear (aparece en los CTAs) ═══════════════ */
export const QRTag: React.FC<{
  durationInFrames: number; theme?: Theme; src?: string;
  eyebrow?: string; label?: string; corner?: "bl" | "br" | "tl" | "tr";
}> = ({ durationInFrames, theme = THEME_CLINIC, src = "img/qr_guia.png", eyebrow = "ESCANEÁ EL CÓDIGO", label = "y llevate la guía", corner = "bl" }) => {
  const { fps } = useVideoConfig();
  const f = useCurrentFrame();
  const t = f / fps;
  const op = smooth(interpolate(f, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })) *
    smooth(interpolate(f, [durationInFrames - 12, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const rise = (1 - smooth(interpolate(f, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))) * 40;
  const pulse = 0.5 + 0.5 * Math.sin(t * 3.2);
  const pos: React.CSSProperties =
    corner === "br" ? { bottom: 70, right: 70 } : corner === "tr" ? { top: 70, right: 70 } : corner === "tl" ? { top: 70, left: 70 } : { bottom: 70, left: 70 };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", ...pos, opacity: op, transform: `translateY(${rise}px)`, display: "flex", alignItems: "center", gap: 18, background: theme.panel, border: `1px solid ${theme.line}`, borderTop: `6px solid ${theme.accent}`, borderRadius: 20, padding: "18px 24px 18px 18px", boxShadow: `0 24px 60px rgba(0,0,0,0.28), 0 0 ${16 + pulse * 22}px ${theme.accent}55` }}>
        <div style={{ width: 168, height: 168, borderRadius: 12, overflow: "hidden", background: "#fff", flexShrink: 0, boxShadow: "0 4px 14px rgba(0,0,0,0.15)" }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
        <div style={{ maxWidth: 240 }}>
          <div style={{ color: theme.accent, font: `800 24px/1 ${theme.sans}`, letterSpacing: 2, textTransform: "uppercase" }}>{eyebrow}</div>
          <div style={{ color: theme.ink, font: `700 34px/1.1 ${theme.serif}`, marginTop: 8 }}>{label}</div>
          <div style={{ color: theme.muted, font: `500 22px/1.2 ${theme.sans}`, marginTop: 8 }}>apuntá la cámara 📷</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
