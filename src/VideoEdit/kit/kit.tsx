// kit.tsx — STARTER KIT de componentes hermosos y coherentes para videos documentales (Remotion).
// Self-contained: SOLO depende de "remotion". Un solo sistema de diseño → todo combina y "queda editado a mano".
//
// Cómo se usa (en tu Main_<slug>.tsx):
//   import { Stage, BigStat, MythVsTruth, Compare, Checklist, Steps, PullQuote, Highlight, FramedPhoto, CTACard, CornerLabel, THEME_EARTH } from "./kit";
//   <Sequence from={sec(12.5)} durationInFrames={sec(5)}>
//     <BigStat durationInFrames={sec(5)} eyebrow="La temperatura del subsuelo" value={55} suffix=" °F"
//              support="13 °C constantes, todo el verano" />
//   </Sequence>
//
// Reglas de oro para que salga lindo:
//  · UN componente por momento (no amontones). Alterná componente ↔ footage real.
//  · Cada cifra/lista/comparación/mito/cita del guion = su propio componente, anclado a la frase que lo dice.
//  · Texto en el idioma del video, CON TILDES, corto (≤12 palabras por línea).
//  · Elegí el TIPO por el momento: número→BigStat · comparación→Compare · mito→MythVsTruth ·
//    lista→Checklist · pasos→Steps · remate→PullQuote · resaltar una palabra→Highlight · foto→FramedPhoto · oferta→CTACard.
//
// Fuentes: quedan MUCHO mejor con Google Fonts. Instalá y descomentá:
//   npm i @remotion/google-fonts
//   import { loadFont as loadSerif } from "@remotion/google-fonts/Fraunces";  const { fontFamily: SERIF } = loadSerif();
//   import { loadFont as loadSans }  from "@remotion/google-fonts/Inter";     const { fontFamily: SANS }  = loadSans();
// Si no, usa los fallbacks de abajo (igual se ve bien).

import React from "react";
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// ───────────────────────────── TEMA (cambiá 1 objeto y cambia TODO el look) ─────────────────────────────
export type Theme = {
  bg: string; ink: string; muted: string; line: string;
  accent: string; good: string; bad: string; panel: string;
  serif: string; sans: string;
};
const SERIF = "Fraunces, 'Playfair Display', Georgia, 'Times New Roman', serif";
const SANS = "Inter, 'Segoe UI', system-ui, -apple-system, sans-serif";

export const THEME_EARTH: Theme = {
  bg: "#F2E9D6", ink: "#2A2016", muted: "#8A7A60", line: "#D8C7A6",
  accent: "#C2592A", good: "#5E7A38", bad: "#B23A2E", panel: "#FBF5E7",
  serif: SERIF, sans: SANS,
};
// Un segundo tema listo (broadcast oscuro), por si el nicho lo pide:
export const THEME_NIGHT: Theme = {
  bg: "#0E1522", ink: "#EAF1F6", muted: "#8091A6", line: "#22304A",
  accent: "#17E0D6", good: "#39D98A", bad: "#FF5A78", panel: "#16223A",
  serif: SERIF, sans: SANS,
};

// ───────────────────────────── helpers de animación (suaves, sin rebote chillón) ─────────────────────────────
const useOp = (dur: number, inF = 12, outF = 12) => {
  const f = useCurrentFrame();
  return Math.min(
    interpolate(f, [0, inF], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [dur - outF, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
};
// entrada escalonada: sube 22px + aparece, con un spring calmo
const useRise = (delay = 0, rise = 22) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 200, mass: 0.7 }, durationInFrames: 18 });
  return { opacity: p, transform: `translateY(${(1 - p) * rise}px)` } as React.CSSProperties;
};
const useGrow = (delay = 0) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 200, mass: 0.6 }, durationInFrames: 20 });
};
// count-up (odómetro) para las cifras
const useCount = (to: number, delay = 6, dur = 26) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [delay, delay + dur], [0, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return Number.isInteger(to) ? Math.round(v) : Math.round(v * 10) / 10;
};

// eyebrow reutilizable (rótulo chico en mayúsculas con guioncito)
const Eyebrow: React.FC<{ t: Theme; children: React.ReactNode; delay?: number }> = ({ t, children, delay = 0 }) => (
  <div style={{ ...useRise(delay), display: "flex", alignItems: "center", gap: 12, color: t.accent, font: `600 22px/1 ${t.sans}`, letterSpacing: 3, textTransform: "uppercase" }}>
    <span style={{ width: 34, height: 2, background: t.accent, display: "inline-block" }} />
    {children}
  </div>
);

// ───────────────────────────── STAGE (fondo + viñeta suave; envolvé cualquier componente) ─────────────────────────────
export const Stage: React.FC<{ theme?: Theme; children: React.ReactNode; pad?: number }> = ({ theme = THEME_EARTH, children, pad = 120 }) => (
  <AbsoluteFill style={{ background: theme.bg, fontFamily: theme.sans }}>
    {/* viñeta suave */}
    <AbsoluteFill style={{ background: `radial-gradient(120% 120% at 50% 42%, transparent 55%, rgba(0,0,0,0.16))` }} />
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: pad }}>
      {children}
    </AbsoluteFill>
  </AbsoluteFill>
);

// ───────────────────────────── 1) BigStat — cifra gigante con count-up ─────────────────────────────
export const BigStat: React.FC<{
  durationInFrames: number; theme?: Theme; eyebrow?: string; value: number; prefix?: string; suffix?: string; support?: string;
}> = ({ durationInFrames, theme = THEME_EARTH, eyebrow, value, prefix = "", suffix = "", support }) => {
  const op = useOp(durationInFrames); const n = useCount(value); const line = useGrow(14);
  return (
    <Stage theme={theme}><div style={{ opacity: op, textAlign: "center", maxWidth: 1400 }}>
      {eyebrow && <div style={{ display: "flex", justifyContent: "center", marginBottom: 26 }}><Eyebrow t={theme}>{eyebrow}</Eyebrow></div>}
      <div style={{ ...useRise(6, 16), font: `600 260px/0.9 ${theme.serif}`, color: theme.ink, letterSpacing: -2 }}>
        <span style={{ fontSize: 120, verticalAlign: "super", color: theme.accent }}>{prefix}</span>{n}
        <span style={{ fontSize: 120, color: theme.accent }}>{suffix}</span>
      </div>
      <div style={{ height: 6, width: 260 * line, background: theme.accent, borderRadius: 3, margin: "34px auto 0" }} />
      {support && <div style={{ ...useRise(20), marginTop: 30, font: `400 34px/1.4 ${theme.sans}`, color: theme.muted, maxWidth: 1050, marginInline: "auto" }}>{support}</div>}
    </div></Stage>
  );
};

// ───────────────────────────── 2) MythVsTruth — mito ✗ / verdad ✓ ─────────────────────────────
const Card: React.FC<{ t: Theme; delay: number; children: React.ReactNode; tone: "bad" | "good" }> = ({ t, delay, children, tone }) => {
  const c = tone === "bad" ? t.bad : t.good;
  return <div style={{ ...useRise(delay), display: "flex", gap: 26, alignItems: "flex-start", background: t.panel, border: `1px solid ${t.line}`, borderLeft: `8px solid ${c}`, borderRadius: 18, padding: "34px 40px", boxShadow: "0 24px 60px rgba(0,0,0,0.10)" }}>
    <div style={{ flex: "0 0 auto", width: 60, height: 60, borderRadius: "50%", background: c, color: "#fff", font: `700 34px/60px ${t.sans}`, textAlign: "center" }}>{tone === "bad" ? "✕" : "✓"}</div>
    <div>{children}</div>
  </div>;
};
export const MythVsTruth: React.FC<{ durationInFrames: number; theme?: Theme; myth: string; truth: string }> = ({ durationInFrames, theme = THEME_EARTH, myth, truth }) => {
  const op = useOp(durationInFrames);
  return <Stage theme={theme}><div style={{ opacity: op, display: "flex", flexDirection: "column", gap: 30, maxWidth: 1500, width: "100%" }}>
    <Card t={theme} delay={4} tone="bad"><div style={{ color: theme.bad, font: `700 26px/1 ${theme.sans}`, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Mito</div><div style={{ color: theme.ink, font: `500 46px/1.25 ${theme.serif}` }}>{myth}</div></Card>
    <Card t={theme} delay={16} tone="good"><div style={{ color: theme.good, font: `700 26px/1 ${theme.sans}`, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Verdad</div><div style={{ color: theme.ink, font: `500 46px/1.25 ${theme.serif}` }}>{truth}</div></Card>
  </div></Stage>;
};

// ───────────────────────────── 3) Compare — dos columnas (malo vs bueno) ─────────────────────────────
export const Compare: React.FC<{
  durationInFrames: number; theme?: Theme; title?: string;
  left: { label: string; sub?: string }; right: { label: string; sub?: string };
}> = ({ durationInFrames, theme = THEME_EARTH, title, left, right }) => {
  const op = useOp(durationInFrames);
  const Col = (d: { label: string; sub?: string }, tone: "bad" | "good", delay: number) => {
    const c = tone === "bad" ? theme.bad : theme.good;
    return <div style={{ ...useRise(delay), flex: 1, background: theme.panel, border: `1px solid ${theme.line}`, borderTop: `10px solid ${c}`, borderRadius: 18, padding: 46, boxShadow: "0 24px 60px rgba(0,0,0,0.10)" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: c, color: "#fff", font: `700 30px/56px ${theme.sans}`, textAlign: "center", marginBottom: 24 }}>{tone === "bad" ? "✕" : "✓"}</div>
      <div style={{ color: theme.ink, font: `600 44px/1.15 ${theme.serif}` }}>{d.label}</div>
      {d.sub && <div style={{ marginTop: 16, color: theme.muted, font: `400 30px/1.4 ${theme.sans}` }}>{d.sub}</div>}
    </div>;
  };
  return <Stage theme={theme}><div style={{ opacity: op, width: "100%", maxWidth: 1600 }}>
    {title && <div style={{ textAlign: "center", marginBottom: 34, color: theme.ink, font: `600 52px/1.1 ${theme.serif}` }}>{title}</div>}
    <div style={{ display: "flex", gap: 40, alignItems: "stretch", position: "relative" }}>
      {Col(left, "bad", 6)}
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", zIndex: 2, width: 84, height: 84, borderRadius: "50%", background: theme.ink, color: theme.bg, font: `700 30px/84px ${theme.sans}`, textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.25)" }}>VS</div>
      {Col(right, "good", 16)}
    </div>
  </div></Stage>;
};

// ───────────────────────────── 4) Checklist — ítems que aparecen con tilde ─────────────────────────────
export const Checklist: React.FC<{ durationInFrames: number; theme?: Theme; title?: string; items: string[]; stamp?: string }> = ({ durationInFrames, theme = THEME_EARTH, title, items, stamp }) => {
  const op = useOp(durationInFrames);
  return <Stage theme={theme}><div style={{ opacity: op, width: "100%", maxWidth: 1400 }}>
    {title && <div style={{ ...useRise(2), color: theme.ink, font: `600 56px/1.1 ${theme.serif}`, marginBottom: 40 }}>{title}</div>}
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {items.slice(0, 6).map((it, i) => {
        const g = useGrow(10 + i * 7);
        return <div key={i} style={{ opacity: g, transform: `translateX(${(1 - g) * -20}px)`, display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ flex: "0 0 auto", width: 52, height: 52, borderRadius: 14, background: theme.good, color: "#fff", font: `700 30px/52px ${theme.sans}`, textAlign: "center" }}>✓</div>
          <div style={{ color: theme.ink, font: `400 40px/1.3 ${theme.sans}` }}>{it}</div>
        </div>;
      })}
    </div>
    {stamp && <div style={{ ...useRise(10 + items.length * 7), display: "inline-block", marginTop: 40, padding: "12px 24px", border: `2px solid ${theme.accent}`, color: theme.accent, font: `700 26px/1 ${theme.sans}`, letterSpacing: 2, textTransform: "uppercase", borderRadius: 10, transform: "rotate(-2deg)" }}>{stamp}</div>}
  </div></Stage>;
};

// ───────────────────────────── 5) Steps — pasos numerados ─────────────────────────────
export const Steps: React.FC<{ durationInFrames: number; theme?: Theme; eyebrow?: string; title?: string; steps: { title: string; sub?: string }[] }> = ({ durationInFrames, theme = THEME_EARTH, eyebrow, title, steps }) => {
  const op = useOp(durationInFrames);
  return <Stage theme={theme}><div style={{ opacity: op, width: "100%", maxWidth: 1400 }}>
    {eyebrow && <div style={{ marginBottom: 18 }}><Eyebrow t={theme}>{eyebrow}</Eyebrow></div>}
    {title && <div style={{ ...useRise(4), color: theme.ink, font: `600 54px/1.1 ${theme.serif}`, marginBottom: 40 }}>{title}</div>}
    <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
      {steps.slice(0, 5).map((s, i) => {
        const g = useGrow(10 + i * 8);
        return <div key={i} style={{ opacity: g, transform: `translateY(${(1 - g) * 16}px)`, display: "flex", gap: 26, alignItems: "flex-start" }}>
          <div style={{ flex: "0 0 auto", width: 66, height: 66, borderRadius: "50%", background: theme.accent, color: "#fff", font: `700 34px/66px ${theme.serif}`, textAlign: "center" }}>{i + 1}</div>
          <div><div style={{ color: theme.ink, font: `600 40px/1.2 ${theme.sans}` }}>{s.title}</div>{s.sub && <div style={{ marginTop: 8, color: theme.muted, font: `400 30px/1.35 ${theme.sans}` }}>{s.sub}</div>}</div>
        </div>;
      })}
    </div>
  </div></Stage>;
};

// ───────────────────────────── 6) PullQuote — cita grande ─────────────────────────────
export const PullQuote: React.FC<{ durationInFrames: number; theme?: Theme; quote: string; author?: string }> = ({ durationInFrames, theme = THEME_EARTH, quote, author }) => {
  const op = useOp(durationInFrames); const q = useGrow(4);
  return <Stage theme={theme}><div style={{ opacity: op, maxWidth: 1500, textAlign: "center" }}>
    <div style={{ opacity: q, font: `700 200px/0.6 ${theme.serif}`, color: theme.accent, height: 90 }}>“</div>
    <div style={{ ...useRise(8, 18), color: theme.ink, font: `500 62px/1.3 ${theme.serif}`, fontStyle: "italic" }}>{quote}</div>
    {author && <div style={{ ...useRise(18), marginTop: 34, color: theme.muted, font: `600 30px/1 ${theme.sans}`, letterSpacing: 2, textTransform: "uppercase" }}>— {author}</div>}
  </div></Stage>;
};

// ───────────────────────────── 7) Highlight — una frase con UNA palabra resaltada (marcador que barre) ─────────────────────────────
export const Highlight: React.FC<{ durationInFrames: number; theme?: Theme; pre: string; highlight: string; post?: string; note?: string }> = ({ durationInFrames, theme = THEME_EARTH, pre, highlight, post = "", note }) => {
  const op = useOp(durationInFrames);
  const sweep = interpolate(useCurrentFrame(), [16, 34], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <Stage theme={theme}><div style={{ opacity: op, maxWidth: 1500, textAlign: "center" }}>
    <div style={{ ...useRise(4, 16), color: theme.ink, font: `500 66px/1.35 ${theme.serif}` }}>
      {pre}{" "}
      <span style={{ position: "relative", whiteSpace: "nowrap", color: theme.ink, fontWeight: 700 }}>
        <span style={{ position: "absolute", left: -6, right: -6, bottom: 4, height: "44%", background: theme.accent, opacity: 0.32, width: `calc(${sweep}% + 12px)`, borderRadius: 4 }} />
        <span style={{ position: "relative" }}>{highlight}</span>
      </span>{post}
    </div>
    {note && <div style={{ ...useRise(20), marginTop: 30, color: theme.muted, font: `400 34px/1.4 ${theme.sans}` }}>{note}</div>}
  </div></Stage>;
};

// ───────────────────────────── 8) FramedPhoto — imagen con Ken Burns + rótulo (ideal CTA/guía/archivo) ─────────────────────────────
export const FramedPhoto: React.FC<{ durationInFrames: number; theme?: Theme; src: string; caption?: string; sub?: string }> = ({ durationInFrames, theme = THEME_EARTH, src, caption, sub }) => {
  const op = useOp(durationInFrames); const f = useCurrentFrame();
  const scale = interpolate(f, [0, durationInFrames], [1.06, 1.14], { extrapolateRight: "clamp" });
  const x = interpolate(f, [0, durationInFrames], [0, -24], { extrapolateRight: "clamp" });
  return <Stage theme={theme} pad={90}><div style={{ opacity: op, width: "100%", maxWidth: 1580, background: theme.panel, border: `1px solid ${theme.line}`, borderRadius: 20, padding: 22, boxShadow: "0 34px 80px rgba(0,0,0,0.16)" }}>
    <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden", borderRadius: 12 }}>
      <Img src={src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale}) translateX(${x}px)` }} />
    </div>
    {(caption || sub) && <div style={{ ...useRise(8), padding: "22px 12px 6px" }}>
      {caption && <div style={{ color: theme.ink, font: `600 42px/1.1 ${theme.serif}` }}>{caption}</div>}
      {sub && <div style={{ marginTop: 8, color: theme.muted, font: `400 28px/1.35 ${theme.sans}` }}>{sub}</div>}
    </div>}
  </div></Stage>;
};

// ───────────────────────────── 9) CTACard — la oferta/guía (sin precio por defecto) ─────────────────────────────
export const CTACard: React.FC<{ durationInFrames: number; theme?: Theme; eyebrow?: string; title: string; bullet?: string; cta?: string }> = ({ durationInFrames, theme = THEME_EARTH, eyebrow, title, bullet, cta = "LINK EN LA DESCRIPCIÓN" }) => {
  const op = useOp(durationInFrames); const g = useGrow(6);
  return <Stage theme={theme}><div style={{ opacity: op, width: "100%", maxWidth: 1400, background: theme.panel, border: `1px solid ${theme.line}`, borderRadius: 22, padding: 60, boxShadow: "0 34px 90px rgba(0,0,0,0.18)", textAlign: "center" }}>
    {eyebrow && <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}><Eyebrow t={theme}>{eyebrow}</Eyebrow></div>}
    <div style={{ ...useRise(6, 16), color: theme.ink, font: `700 68px/1.05 ${theme.serif}` }}>{title}</div>
    {bullet && <div style={{ ...useRise(14), marginTop: 22, color: theme.muted, font: `400 34px/1.4 ${theme.sans}`, maxWidth: 1050, marginInline: "auto" }}>{bullet}</div>}
    <div style={{ transform: `scale(${0.9 + g * 0.1})`, opacity: g, display: "inline-block", marginTop: 40, padding: "22px 44px", background: theme.accent, color: "#fff", font: `700 34px/1 ${theme.sans}`, letterSpacing: 1, borderRadius: 14, boxShadow: `0 16px 40px ${theme.accent}55` }}>{cta} →</div>
  </div></Stage>;
};

// ───────────────────────────── 10) CornerLabel — rótulo chico en una esquina (sobre b-roll, NO usa Stage) ─────────────────────────────
export const CornerLabel: React.FC<{ durationInFrames: number; theme?: Theme; text: string; corner?: "tl" | "tr" | "bl" | "br" }> = ({ durationInFrames, theme = THEME_EARTH, text, corner = "bl" }) => {
  const op = useOp(durationInFrames);
  const pos: React.CSSProperties = corner === "tl" ? { top: 70, left: 70 } : corner === "tr" ? { top: 70, right: 70 } : corner === "br" ? { bottom: 70, right: 70 } : { bottom: 70, left: 70 };
  return <AbsoluteFill><div style={{ position: "absolute", ...pos, ...useRise(2), opacity: op, background: theme.panel, border: `1px solid ${theme.line}`, borderLeft: `6px solid ${theme.accent}`, borderRadius: 12, padding: "16px 24px", color: theme.ink, font: `600 34px/1.1 ${theme.sans}`, boxShadow: "0 16px 40px rgba(0,0,0,0.18)" }}>{text}</div></AbsoluteFill>;
};
