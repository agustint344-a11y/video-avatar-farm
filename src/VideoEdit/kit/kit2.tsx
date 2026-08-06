// kit2.tsx — COMPONENTES OVERLAY (fondo transparente) que van ENCIMA del avatar o del b-roll.
// A diferencia de kit.tsx (que usa Stage y tapa todo), estos decoran sin tapar: lower-thirds,
// keywords animados, chips de dato, filas de íconos, rótulos de sección y marcadores de fuente.
// Comparten el THEME de kit.tsx para que todo combine.

import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME_EARTH, type Theme } from "./kit";

const useInOut = (dur: number, inF = 10, outF = 10) => {
  const f = useCurrentFrame();
  return Math.min(
    interpolate(f, [0, inF], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [dur - outF, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
};
const useSpring = (delay = 0, dur = 16, damping = 200, mass = 0.6) => {
  const { fps } = useVideoConfig();
  return spring({ frame: useCurrentFrame() - delay, fps, config: { damping, mass }, durationInFrames: dur });
};
const shadow = "0 18px 50px rgba(0,0,0,0.28)";

/* ───────────── 1) LowerThird — barra inferior-izquierda (rótulo del presentador / sección) ───────────── */
export const LowerThird: React.FC<{
  durationInFrames: number; theme?: Theme; title: string; sub?: string; accentText?: string;
}> = ({ durationInFrames, theme = THEME_EARTH, title, sub, accentText }) => {
  const op = useInOut(durationInFrames, 12, 12);
  const p = useSpring(0, 18);
  const x = (1 - p) * -80;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 90, bottom: 110, opacity: op, transform: `translateX(${x}px)`, display: "flex", alignItems: "stretch", gap: 0, filter: `drop-shadow(${shadow})` }}>
        <div style={{ width: 10, background: theme.accent, borderRadius: "6px 0 0 6px" }} />
        <div style={{ background: theme.panel, borderRadius: "0 12px 12px 0", padding: "20px 34px 22px 26px", border: `1px solid ${theme.line}`, borderLeft: "none" }}>
          {accentText && <div style={{ color: theme.accent, font: `700 22px/1 ${theme.sans}`, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>{accentText}</div>}
          <div style={{ color: theme.ink, font: `600 46px/1.05 ${theme.serif}` }}>{title}</div>
          {sub && <div style={{ color: theme.muted, font: `400 28px/1.2 ${theme.sans}`, marginTop: 6 }}>{sub}</div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── 2) KeywordPop — palabra grande que entra con golpe (énfasis), transparente ───────────── */
export const KeywordPop: React.FC<{
  durationInFrames: number; theme?: Theme; word: string; sub?: string; pos?: "center" | "top" | "bottom";
}> = ({ durationInFrames, theme = THEME_EARTH, word, sub, pos = "center" }) => {
  const op = useInOut(durationInFrames, 8, 10);
  const p = useSpring(0, 16, 12, 0.8); // rebote sutil
  const scale = 0.6 + p * 0.4;
  const sweep = interpolate(useCurrentFrame(), [10, 26], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const justify = pos === "top" ? "flex-start" : pos === "bottom" ? "flex-end" : "center";
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: justify, paddingTop: pos === "top" ? 140 : 0, paddingBottom: pos === "bottom" ? 200 : 0, pointerEvents: "none" }}>
      <div style={{ opacity: op, transform: `scale(${scale})`, textAlign: "center" }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <span style={{ position: "absolute", left: -14, right: -14, bottom: 10, height: "34%", background: theme.accent, opacity: 0.9, width: `calc(${sweep}% + 28px)`, borderRadius: 6 }} />
          <span style={{ position: "relative", color: theme.ink, font: `900 132px/1 ${theme.serif}`, letterSpacing: -1, textShadow: "0 4px 24px rgba(0,0,0,0.35)" }}>{word}</span>
        </div>
        {sub && <div style={{ marginTop: 18, color: "#fff", font: `600 34px/1.2 ${theme.sans}`, textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>{sub}</div>}
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── 3) StatChip — dato compacto en una esquina (número con count-up) ───────────── */
export const StatChip: React.FC<{
  durationInFrames: number; theme?: Theme; value: number; prefix?: string; suffix?: string; label: string; corner?: "tr" | "tl";
}> = ({ durationInFrames, theme = THEME_EARTH, value, prefix = "", suffix = "", label, corner = "tr" }) => {
  const op = useInOut(durationInFrames, 10, 10);
  const p = useSpring(2, 18);
  const f = useCurrentFrame();
  const n = (() => {
    const v = interpolate(f, [4, 30], [0, value], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return Number.isInteger(value) ? Math.round(v) : Math.round(v * 10) / 10;
  })();
  const pos: React.CSSProperties = corner === "tl" ? { top: 90, left: 90 } : { top: 90, right: 90 };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", ...pos, opacity: op, transform: `translateY(${(1 - p) * -24}px)`, background: theme.panel, border: `1px solid ${theme.line}`, borderTop: `6px solid ${theme.accent}`, borderRadius: 14, padding: "20px 30px", textAlign: "center", filter: `drop-shadow(${shadow})`, minWidth: 220 }}>
        <div style={{ color: theme.ink, font: `800 84px/0.9 ${theme.serif}` }}>
          <span style={{ fontSize: 44, color: theme.accent, verticalAlign: "super" }}>{prefix}</span>{n}<span style={{ fontSize: 44, color: theme.accent }}>{suffix}</span>
        </div>
        <div style={{ color: theme.muted, font: `600 24px/1.2 ${theme.sans}`, letterSpacing: 1, textTransform: "uppercase", marginTop: 8 }}>{label}</div>
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── 4) IconRow — fila de chips (nutrientes / beneficios) abajo, entran escalonados ───────────── */
export const IconRow: React.FC<{
  durationInFrames: number; theme?: Theme; items: { icon?: string; label: string }[];
}> = ({ durationInFrames, theme = THEME_EARTH, items }) => {
  const op = useInOut(durationInFrames, 10, 10);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 90, pointerEvents: "none" }}>
      <div style={{ display: "flex", gap: 18, opacity: op, flexWrap: "wrap", justifyContent: "center", maxWidth: 1500 }}>
        {items.slice(0, 5).map((it, i) => {
          const p = spring({ frame: useCurrentFrame() - (6 + i * 5), fps: useVideoConfig().fps, config: { damping: 200, mass: 0.6 }, durationInFrames: 16 });
          return (
            <div key={i} style={{ opacity: p, transform: `translateY(${(1 - p) * 26}px)`, display: "flex", alignItems: "center", gap: 12, background: theme.panel, border: `1px solid ${theme.line}`, borderRadius: 999, padding: "14px 26px", filter: `drop-shadow(${shadow})` }}>
              {it.icon && <span style={{ fontSize: 34 }}>{it.icon}</span>}
              <span style={{ color: theme.ink, font: `700 32px/1 ${theme.sans}` }}>{it.label}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── 5) StatBar — barra horizontal que se llena (proporción / magnitud), overlay abajo ───────────── */
export const StatBar: React.FC<{
  durationInFrames: number; theme?: Theme; label: string; value: number; suffix?: string; max?: number;
}> = ({ durationInFrames, theme = THEME_EARTH, label, value, suffix = "", max }) => {
  const op = useInOut(durationInFrames, 10, 10);
  const grow = useSpring(6, 26, 200, 0.8);
  const pct = Math.min(1, value / (max ?? value));
  const shown = Math.round(interpolate(useCurrentFrame(), [6, 32], [0, value], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 110, pointerEvents: "none" }}>
      <div style={{ width: 1200, opacity: op, background: theme.panel, border: `1px solid ${theme.line}`, borderRadius: 16, padding: "26px 34px", filter: `drop-shadow(${shadow})` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
          <span style={{ color: theme.ink, font: `700 38px/1 ${theme.sans}` }}>{label}</span>
          <span style={{ color: theme.accent, font: `900 56px/1 ${theme.serif}` }}>{shown}{suffix}</span>
        </div>
        <div style={{ height: 22, background: theme.line, borderRadius: 999, overflow: "hidden" }}>
          <div style={{ width: `${pct * grow * 100}%`, height: "100%", background: `linear-gradient(90deg, ${theme.accent}, ${theme.good})`, borderRadius: 999 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── 7) Callout — banner de aviso (riesgo / dato clave), overlay inferior con ícono ───────────── */
export const Callout: React.FC<{
  durationInFrames: number; theme?: Theme; icon?: string; title: string; sub?: string; tone?: "warn" | "info" | "good";
}> = ({ durationInFrames, theme = THEME_EARTH, icon = "⚠️", title, sub, tone = "warn" }) => {
  const op = useInOut(durationInFrames, 10, 10);
  const p = useSpring(0, 18);
  const c = tone === "warn" ? theme.bad : tone === "good" ? theme.good : theme.accent;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 130, pointerEvents: "none" }}>
      <div style={{ maxWidth: 1400, opacity: op, transform: `translateY(${(1 - p) * 40}px)`, display: "flex", alignItems: "center", gap: 24, background: theme.panel, borderRadius: 16, padding: "24px 40px", border: `1px solid ${theme.line}`, borderLeft: `12px solid ${c}`, filter: `drop-shadow(${shadow})` }}>
        <span style={{ fontSize: 60, lineHeight: 1 }}>{icon}</span>
        <div>
          <div style={{ color: c, font: `800 24px/1 ${theme.sans}`, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{tone === "warn" ? "Cuidado" : tone === "good" ? "Sí" : "Dato"}</div>
          <div style={{ color: theme.ink, font: `700 44px/1.15 ${theme.serif}` }}>{title}</div>
          {sub && <div style={{ color: theme.muted, font: `400 30px/1.3 ${theme.sans}`, marginTop: 6 }}>{sub}</div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── 6) SectionTitle — placa de capítulo a pantalla parcial (barra central), semi-transparente ───────────── */
export const SectionTitle: React.FC<{
  durationInFrames: number; theme?: Theme; eyebrow?: string; title: string;
}> = ({ durationInFrames, theme = THEME_EARTH, eyebrow, title }) => {
  const op = useInOut(durationInFrames, 12, 12);
  const p = useSpring(0, 18);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      <div style={{ opacity: op, transform: `translateY(${(1 - p) * 30}px)`, background: "rgba(20,14,8,0.55)", backdropFilter: "blur(6px)", borderRadius: 18, padding: "40px 70px", textAlign: "center", border: `1px solid rgba(255,255,255,0.12)` }}>
        {eyebrow && <div style={{ color: theme.accent, font: `700 26px/1 ${theme.sans}`, letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>{eyebrow}</div>}
        <div style={{ color: "#fff", font: `800 78px/1.05 ${theme.serif}` }}>{title}</div>
        <div style={{ width: 90, height: 5, background: theme.accent, borderRadius: 3, margin: "24px auto 0" }} />
      </div>
    </AbsoluteFill>
  );
};
