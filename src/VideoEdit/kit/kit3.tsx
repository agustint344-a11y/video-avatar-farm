// kit3.tsx — COMPONENTES "DOPAMÍNICOS" (estilo tarjeta blanca moderna, tipo el canal de referencia).
// Look limpio/clínico: tarjetas blancas redondeadas, acento teal + ámbar, sans moderna, sombras suaves.
//  · Testimonial  — cita con foto circular (prueba social). Componente full (fondo propio claro).
//  · SplitInfo    — OVERLAY: tarjeta a la derecha, deja la izquierda para el avatar/b-roll.
//  · AnnotatedImage — imagen central con punteros/etiquetas (tipo "consultar antes").
//  · BigNumberCard — número gigante con contexto, tarjeta blanca.
// Se combinan con kit.tsx (editorial cálido) y kit2.tsx (overlays). Elegí el look por video.

import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const SANS = "Inter, 'Segoe UI', system-ui, -apple-system, sans-serif";
const CLR = {
  bg: "#EAF0F1", card: "#FFFFFF", ink: "#16242B", muted: "#6C7B84",
  teal: "#0FA9A0", amber: "#E8A33D", line: "#E3EAED",
};
const shadow = "0 30px 70px rgba(20,40,50,0.18)";

const useIO = (dur: number, inF = 12, outF = 12) => {
  const f = useCurrentFrame();
  return Math.min(
    interpolate(f, [0, inF], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [dur - outF, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
};
const useSp = (delay = 0, dur = 18, damping = 200, mass = 0.7) => {
  const { fps } = useVideoConfig();
  return spring({ frame: useCurrentFrame() - delay, fps, config: { damping, mass }, durationInFrames: dur });
};

/* ───────────── Testimonial — cita con foto (prueba social) ───────────── */
export const Testimonial: React.FC<{
  durationInFrames: number; quote: string; name: string; role?: string; photo?: string;
}> = ({ durationInFrames, quote, name, role, photo }) => {
  const op = useIO(durationInFrames);
  const p = useSp(0, 20, 160, 0.8);
  const src = photo ? (photo.startsWith("http") ? photo : staticFile(photo)) : null;
  return (
    <AbsoluteFill style={{ background: CLR.bg, alignItems: "center", justifyContent: "center", fontFamily: SANS }}>
      <div style={{ opacity: op, transform: `translateY(${(1 - p) * 40}px) scale(${0.94 + p * 0.06})`, width: 1500, background: CLR.card, borderRadius: 34, padding: "70px 90px", boxShadow: shadow, display: "flex", alignItems: "center", gap: 70 }}>
        {src && (
          <div style={{ flex: "0 0 auto", width: 340, height: 340, borderRadius: "50%", padding: 12, border: `4px solid ${CLR.amber}`, boxShadow: "0 12px 30px rgba(0,0,0,0.15)" }}>
            <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ color: CLR.teal, font: `900 130px/0.4 Georgia, serif`, height: 60 }}>“</div>
          <div style={{ color: CLR.ink, font: `700 66px/1.25 ${SANS}`, fontStyle: "italic", letterSpacing: -0.5 }}>{quote}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 40 }}>
            <div style={{ width: 64, height: 6, background: CLR.amber, borderRadius: 3 }} />
            <div>
              <div style={{ color: CLR.ink, font: `800 40px/1 ${SANS}` }}>{name}</div>
              {role && <div style={{ color: CLR.muted, font: `500 30px/1.2 ${SANS}`, marginTop: 6 }}>{role}</div>}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── SplitInfo — OVERLAY: tarjeta derecha, izquierda libre para avatar/b-roll ───────────── */
export const SplitInfo: React.FC<{
  durationInFrames: number; eyebrow?: string; title: string; items: string[];
}> = ({ durationInFrames, eyebrow, title, items }) => {
  const op = useIO(durationInFrames);
  const p = useSp(0, 20);
  return (
    <AbsoluteFill style={{ fontFamily: SANS }}>
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "56%", opacity: op, transform: `translateX(${(1 - p) * 80}px)`, display: "flex", alignItems: "center" }}>
        <div style={{ width: "100%", background: CLR.card, borderRadius: "40px 0 0 40px", borderLeft: `10px solid ${CLR.amber}`, padding: "80px 90px", boxShadow: shadow, minHeight: "72%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {eyebrow && <div style={{ color: CLR.teal, font: `800 30px/1 ${SANS}`, letterSpacing: 4, textTransform: "uppercase", marginBottom: 24, display: "flex", alignItems: "center", gap: 14 }}><span style={{ width: 34, height: 4, background: CLR.teal }} />{eyebrow}</div>}
          <div style={{ color: CLR.ink, font: `900 82px/1.05 ${SANS}`, letterSpacing: -1, marginBottom: 44 }}>{title}</div>
          {items.slice(0, 5).map((it, i) => {
            const g = spring({ frame: useCurrentFrame() - (10 + i * 6), fps: useVideoConfig().fps, config: { damping: 200, mass: 0.6 }, durationInFrames: 16 });
            return (
              <div key={i} style={{ opacity: g, transform: `translateX(${(1 - g) * -24}px)`, display: "flex", alignItems: "center", gap: 24, marginBottom: 26 }}>
                <div style={{ flex: "0 0 auto", width: 52, height: 52, borderRadius: "50%", border: `4px solid ${CLR.teal}`, color: CLR.teal, font: `900 30px/46px ${SANS}`, textAlign: "center" }}>✓</div>
                <div style={{ color: CLR.ink, font: `600 44px/1.2 ${SANS}` }}>{it}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── AnnotatedImage — imagen central con punteros (tipo "consultar antes") ───────────── */
export const AnnotatedImage: React.FC<{
  durationInFrames: number; eyebrow?: string; title: string; image: string;
  points: { label: string; x: number; y: number; side?: "left" | "right" }[]; // x,y en % de la imagen
}> = ({ durationInFrames, eyebrow, title, image, points }) => {
  const op = useIO(durationInFrames);
  const p = useSp(0, 18);
  const src = image.startsWith("http") ? image : staticFile(image);
  const IMG = { w: 760, h: 620 };
  return (
    <AbsoluteFill style={{ background: CLR.bg, alignItems: "center", justifyContent: "center", fontFamily: SANS }}>
      <div style={{ opacity: op, transform: `translateY(${(1 - p) * 30}px)`, width: 1720, background: CLR.card, borderRadius: 34, padding: "56px 70px 70px", boxShadow: shadow, textAlign: "center" }}>
        {eyebrow && <div style={{ color: CLR.teal, font: `800 28px/1 ${SANS}`, letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>— {eyebrow}</div>}
        <div style={{ color: CLR.ink, font: `900 74px/1.05 ${SANS}`, letterSpacing: -1, marginBottom: 40 }}>{title}</div>
        <div style={{ position: "relative", width: IMG.w, height: IMG.h, margin: "0 auto" }}>
          <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 20, boxShadow: "0 16px 40px rgba(0,0,0,0.18)" }} />
          {points.slice(0, 4).map((pt, i) => {
            const g = spring({ frame: useCurrentFrame() - (14 + i * 7), fps: useVideoConfig().fps, config: { damping: 200, mass: 0.6 }, durationInFrames: 16 });
            const left = (pt.side ?? (pt.x < 50 ? "left" : "right")) === "left";
            const dotX = (pt.x / 100) * IMG.w, dotY = (pt.y / 100) * IMG.h;
            return (
              <React.Fragment key={i}>
                <svg style={{ position: "absolute", left: 0, top: 0, width: IMG.w, height: IMG.h, overflow: "visible", opacity: g }}>
                  <line x1={left ? -60 : IMG.w + 60} y1={dotY} x2={dotX} y2={dotY} stroke={CLR.ink} strokeWidth={4} />
                  <circle cx={dotX} cy={dotY} r={13} fill={CLR.amber} stroke="#fff" strokeWidth={4} />
                </svg>
                <div style={{ position: "absolute", top: dotY - 40, [left ? "right" : "left"]: IMG.w + 70, opacity: g, transform: `translateX(${(1 - g) * (left ? 30 : -30)}px)`, background: CLR.card, border: `3px solid ${CLR.amber}`, borderRadius: 16, padding: "16px 28px", boxShadow: "0 10px 26px rgba(0,0,0,0.15)", whiteSpace: "nowrap" }}>
                  <span style={{ color: CLR.ink, font: `800 38px/1.1 ${SANS}` }}>{pt.label}</span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── BigNumberCard — número gigante con contexto, tarjeta blanca ───────────── */
export const BigNumberCard: React.FC<{
  durationInFrames: number; eyebrow?: string; value: number; prefix?: string; suffix?: string; label: string;
}> = ({ durationInFrames, eyebrow, value, prefix = "", suffix = "", label }) => {
  const op = useIO(durationInFrames);
  const p = useSp(0, 20, 160, 0.8);
  const f = useCurrentFrame();
  const n = (() => { const v = interpolate(f, [6, 34], [0, value], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); return Number.isInteger(value) ? Math.round(v) : Math.round(v * 10) / 10; })();
  return (
    <AbsoluteFill style={{ background: CLR.bg, alignItems: "center", justifyContent: "center", fontFamily: SANS }}>
      <div style={{ opacity: op, transform: `scale(${0.9 + p * 0.1})`, background: CLR.card, borderRadius: 34, padding: "70px 120px", boxShadow: shadow, textAlign: "center" }}>
        {eyebrow && <div style={{ color: CLR.teal, font: `800 32px/1 ${SANS}`, letterSpacing: 4, textTransform: "uppercase", marginBottom: 20 }}>{eyebrow}</div>}
        <div style={{ color: CLR.ink, font: `900 300px/0.9 ${SANS}`, letterSpacing: -6 }}>
          <span style={{ fontSize: 140, color: CLR.amber, verticalAlign: "super" }}>{prefix}</span>{n}<span style={{ fontSize: 140, color: CLR.amber }}>{suffix}</span>
        </div>
        <div style={{ color: CLR.muted, font: `600 46px/1.2 ${SANS}`, marginTop: 20 }}>{label}</div>
      </div>
    </AbsoluteFill>
  );
};
