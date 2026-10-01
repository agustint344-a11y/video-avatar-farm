// kit5.tsx — kit "artesanal" para La Nonna Cocina: papel, tinta, sellos, tickets, polaroids.
// Todo determinístico con useCurrentFrame() + interpolate (sin CSS animations).
// Componentes (tapan la pantalla): CuadernoReceta · TicketPrecio · PolaroidRecuerdo
// Overlays (transparentes, van encima del b-roll): SelloError · TimerCocina · MarcaCirculo
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, useCurrentFrame } from "remotion";
import { Circle, Underline } from "@remotion/rough-notation";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";
import { loadFont as loadStamp } from "@remotion/google-fonts/Anton";
import { loadFont as loadMono } from "@remotion/google-fonts/CourierPrime";
import { loadFont as loadSerif } from "@remotion/google-fonts/Fraunces";
const { fontFamily: HAND } = loadHand();
const { fontFamily: STAMP } = loadStamp();
const { fontFamily: MONO } = loadMono();
const { fontFamily: SERIF } = loadSerif();

const C = { paper: "#f6efdc", paper2: "#efe4c8", ink: "#2a2018", inkSoft: "#5b4a3a", red: "#b3261e", blue: "#1f3f7a", olive: "#56652c", line: "rgba(31,63,122,.22)" };
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);

// Fondo: la foto del momento, desenfocada y oscurecida (así el componente "vive" dentro del video)
const Backdrop: React.FC<{ src?: string; dur: number; dark?: number }> = ({ src, dur, dark = 0.55 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#1b1510", overflow: "hidden" }}>
      {src ? <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(18px) saturate(.8)", scale: interpolate(f, [0, dur], [1.12, 1.2]) }} /> : null}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, rgba(20,14,8,${dark - 0.25}) 0%, rgba(20,14,8,${dark + 0.2}) 100%)` }} />
    </AbsoluteFill>
  );
};

// Salida suave común (últimos 8 frames)
const useOut = (dur: number) => {
  const f = useCurrentFrame();
  return interpolate(f, [dur - 8, dur], [1, 0], cl);
};

/* ───────────── 1) CUADERNO: la receta se escribe a mano y se tilda ───────────── */
export const CuadernoReceta: React.FC<{ durationInFrames: number; src?: string; title: string; items: string[]; note?: string }> = ({ durationInFrames: dur, src, title, items, note }) => {
  const f = useCurrentFrame();
  const out = useOut(dur);
  const per = Math.max(14, Math.min(26, Math.floor((dur * 0.62) / Math.max(1, items.length))));
  const t0 = 18;
  const noteAt = t0 + items.length * per + 6;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Backdrop src={src} dur={dur} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{
          width: 1240, height: 960, position: "relative", borderRadius: 10,
          background: `repeating-linear-gradient(to bottom, transparent 0 94px, ${C.line} 94px 96px), radial-gradient(ellipse at 30% 20%, ${C.paper} 0%, ${C.paper2} 100%)`,
          backgroundPosition: "0 178px, 0 0",
          boxShadow: "0 40px 80px rgba(0,0,0,.55), inset 0 0 90px rgba(120,90,40,.18)",
          rotate: `${interpolate(f, [0, 16], [-5, -1.5], { ...cl, easing: OUT })}deg`,
          translate: `0px ${interpolate(f, [0, 16], [120, 0], { ...cl, easing: OUT })}px`,
          opacity: interpolate(f, [0, 8], [0, 1], cl),
        }}>
          {/* margen rojo + agujeros del anillado */}
          <div style={{ position: "absolute", left: 150, top: 0, bottom: 0, width: 3, background: "rgba(179,38,30,.45)" }} />
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: 46, top: 60 + i * 92, width: 34, height: 34, borderRadius: 17, background: "#1b1510", boxShadow: "inset 0 3px 6px rgba(0,0,0,.6)" }} />
          ))}
          <div style={{ position: "absolute", left: 190, top: 40, fontFamily: HAND, fontSize: 104, color: C.ink, lineHeight: 1 }}>
            <Underline progress={interpolate(f, [8, 22], [0, 1], cl)} color={C.red} strokeWidth={4} iterations={2}>
              <span>{title}</span>
            </Underline>
          </div>
          <div style={{ position: "absolute", left: 196, top: 184, right: 60 }}>
            {items.map((it, i) => {
              const a = t0 + i * per;
              const w = interpolate(f, [a, a + per * 0.75], [0, 100], { ...cl, easing: Easing.bezier(0.4, 0, 0.6, 1) });
              const tick = interpolate(f, [a + per * 0.7, a + per * 0.95], [0, 1], cl);
              return (
                <div key={i} style={{ height: 96, display: "flex", alignItems: "center", gap: 24 }}>
                  <svg width="60" height="60" viewBox="0 0 48 48" style={{ flex: "none" }}>
                    <path d="M6 26 L19 38 L43 8" fill="none" stroke={C.olive} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="70" strokeDashoffset={70 - 70 * tick} />
                  </svg>
                  <div style={{ fontFamily: HAND, fontSize: 80, color: C.blue, whiteSpace: "nowrap", clipPath: `inset(-20px ${100 - w}% -20px 0)` }}>{it}</div>
                </div>
              );
            })}
          </div>
          {note ? (
            <div style={{ position: "absolute", right: 80, bottom: 60, fontFamily: HAND, fontSize: 72, color: C.red, rotate: "-4deg", opacity: interpolate(f, [noteAt, noteAt + 8], [0, 1], cl) }}>
              <Circle progress={interpolate(f, [noteAt + 4, noteAt + 20], [0, 1], cl)} color={C.red} strokeWidth={3} padding={{ top: 14, bottom: 14, left: 26, right: 26 }}>
                <span>{note}</span>
              </Circle>
            </div>
          ) : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ───────────── 2) SELLO DE ERROR: golpe de sello de goma + temblor ───────────── */
export const SelloError: React.FC<{ durationInFrames: number; label?: string; num?: string | number; text?: string }> = ({ durationInFrames: dur, label = "ERROR", num, text }) => {
  const f = useCurrentFrame();
  const out = useOut(dur);
  const hit = 9;
  const s = interpolate(f, [0, hit], [2.8, 1], { ...cl, easing: Easing.bezier(0.55, 0, 1, 0.45) });
  const shake = f >= hit && f < hit + 10 ? (random(`sx${f}`) - 0.5) * 22 * (1 - (f - hit) / 10) : 0;
  const shakeY = f >= hit && f < hit + 10 ? (random(`sy${f}`) - 0.5) * 16 * (1 - (f - hit) / 10) : 0;
  return (
    <AbsoluteFill style={{ opacity: out, translate: `${shake}px ${shakeY}px` }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 35%, rgba(0,0,0,.55) 100%)", opacity: interpolate(f, [0, hit], [0, 1], cl) }} />
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="tinta">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="7" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.7 1.45" result="m" />
          <feComposite in="SourceGraphic" in2="m" operator="in" result="c" />
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="w" />
          <feDisplacementMap in="c" in2="w" scale="7" />
        </filter>
      </svg>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ scale: s, rotate: "-9deg", opacity: interpolate(f, [0, 3], [0, 1], cl), filter: "url(#tinta)", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ border: `12px solid ${C.red}`, outline: `4px solid ${C.red}`, outlineOffset: 10, padding: "10px 54px", borderRadius: 18, fontFamily: STAMP, fontSize: 190, lineHeight: 1.05, color: C.red, letterSpacing: 6, textTransform: "uppercase" }}>
            {label}{num != null ? <span style={{ fontSize: 150 }}> Nº{num}</span> : null}
          </div>
        </div>
        {text ? (
          <div style={{ marginTop: 70, fontFamily: HAND, fontSize: 96, color: "#fff", textShadow: "0 4px 18px rgba(0,0,0,.8)", opacity: interpolate(f, [hit + 6, hit + 14], [0, 1], cl), translate: `0px ${interpolate(f, [hit + 6, hit + 14], [20, 0], { ...cl, easing: OUT })}px` }}>
            {text}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ───────────── 3) TICKET: se imprime la cuenta y se tacha lo caro ───────────── */
export const TicketPrecio: React.FC<{ durationInFrames: number; src?: string; title?: string; rows: { label: string; price: string; bad?: boolean }[]; total?: { label: string; price: string }; stamp?: string }> = ({ durationInFrames: dur, src, title = "TICKET", rows, total, stamp }) => {
  const f = useCurrentFrame();
  const out = useOut(dur);
  const H = 190 + rows.length * 78 + (total ? 150 : 40);
  const print = interpolate(f, [4, 4 + 10 + rows.length * 9], [0, 1], { ...cl, easing: Easing.bezier(0.3, 0, 0.7, 1) });
  const after = 16 + rows.length * 9;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Backdrop src={src} dur={dur} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 70 }}>
        <div style={{ width: 760, height: H * print, overflow: "hidden", rotate: "1.5deg", filter: "drop-shadow(0 30px 40px rgba(0,0,0,.5))" }}>
          <div style={{ width: 760, height: H, background: "#fbf8f1", position: "relative", fontFamily: MONO, color: "#222", padding: "46px 56px", boxSizing: "border-box",
            WebkitMaskImage: "linear-gradient(to bottom, #000 calc(100% - 18px), transparent calc(100% - 18px)), radial-gradient(circle at 12px 100%, transparent 11px, #000 12px)",
            WebkitMaskSize: "100% 100%, 24px 18px", WebkitMaskPosition: "0 0, 0 100%", WebkitMaskRepeat: "no-repeat, repeat-x" }}>
            <div style={{ textAlign: "center", fontSize: 40, fontWeight: 700, letterSpacing: 4 }}>{title}</div>
            <div style={{ textAlign: "center", fontSize: 24, color: "#777", marginTop: 6 }}>- - - - - - - - - - - - - - - - - - - -</div>
            <div style={{ marginTop: 24 }}>
              {rows.map((r, i) => {
                const k = after + 4 + i * 8;
                return (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 38, height: 78, alignItems: "center" }}>
                    <span style={{ color: r.bad ? "#666" : "#222" }}>{r.label}</span>
                    {r.bad ? (
                      <span style={{ position: "relative" }}>
                        <span style={{ fontWeight: 700 }}>{r.price}</span>
                        <svg style={{ position: "absolute", left: -12, top: 18, overflow: "visible" }} width="200" height="20"><path d="M0 12 C 50 2, 120 20, 190 6" stroke={C.red} strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="220" strokeDashoffset={220 - 220 * interpolate(f, [k, k + 8], [0, 1], cl)} /></svg>
                      </span>
                    ) : <span style={{ fontWeight: 700 }}>{r.price}</span>}
                  </div>
                );
              })}
            </div>
            {total ? (
              <>
                <div style={{ textAlign: "center", fontSize: 24, color: "#777", marginTop: 8 }}>= = = = = = = = = = = = = = = = = = = =</div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 50, fontWeight: 700, marginTop: 22 }}>
                  <span>{total.label}</span>
                  <Circle progress={interpolate(f, [after + rows.length * 8 + 4, after + rows.length * 8 + 20], [0, 1], cl)} color={C.olive} strokeWidth={4} padding={{ top: 8, bottom: 8, left: 18, right: 18 }}>
                    <span style={{ color: C.olive }}>{total.price}</span>
                  </Circle>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </AbsoluteFill>
      {stamp ? (
        <AbsoluteFill style={{ alignItems: "flex-end", justifyContent: "flex-end", padding: 90 }}>
          <div style={{ fontFamily: STAMP, fontSize: 92, color: C.olive, border: `8px solid ${C.olive}`, borderRadius: 14, padding: "4px 30px", rotate: "-10deg", background: "rgba(246,239,220,.9)",
            scale: interpolate(f, [after + rows.length * 8 + 16, after + rows.length * 8 + 24], [2.4, 1], { ...cl, easing: Easing.bezier(0.55, 0, 1, 0.45) }),
            opacity: interpolate(f, [after + rows.length * 8 + 16, after + rows.length * 8 + 18], [0, 1], cl) }}>{stamp}</div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

/* ───────────── 4) POLAROID: un recuerdo que se revela sobre la mesa ───────────── */
export const PolaroidRecuerdo: React.FC<{ durationInFrames: number; src: string; caption: string; sub?: string }> = ({ durationInFrames: dur, src, caption, sub }) => {
  const f = useCurrentFrame();
  const out = useOut(dur);
  const drop = interpolate(f, [0, 18], [0, 1], { ...cl, easing: Easing.bezier(0.2, 1.3, 0.4, 1) });
  const dev = interpolate(f, [10, 60], [1, 0], { ...cl, easing: Easing.bezier(0.3, 0, 0.5, 1) }); // "revelado"
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Backdrop src={src} dur={dur} dark={0.7} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{
          background: "#fbfaf5", padding: "34px 34px 150px", boxShadow: "0 50px 90px rgba(0,0,0,.6)", position: "relative",
          rotate: `${interpolate(drop, [0, 1], [-18, -3])}deg`, translate: `0px ${interpolate(drop, [0, 1], [-900, 0])}px`,
          scale: interpolate(f, [18, dur], [1, 1.04], cl),
        }}>
          <div style={{ width: 880, height: 620, position: "relative", overflow: "hidden", background: "#222" }}>
            <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `sepia(.55) contrast(1.05) brightness(${1 + dev * 0.6}) blur(${dev * 6}px)` }} />
            <AbsoluteFill style={{ background: "#e9e4d6", opacity: dev * 0.9 }} />
            <AbsoluteFill style={{ boxShadow: "inset 0 0 120px rgba(60,40,10,.55)" }} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, textAlign: "center", fontFamily: HAND, color: C.ink }}>
            <div style={{ fontSize: 76, lineHeight: 1, clipPath: `inset(-20px ${100 - interpolate(f, [30, 62], [0, 100], cl)}% -20px 0)` }}>{caption}</div>
            {sub ? <div style={{ fontSize: 42, color: C.inkSoft, opacity: interpolate(f, [60, 70], [0, 1], cl) }}>{sub}</div> : null}
          </div>
          {/* cinta */}
          <div style={{ position: "absolute", top: -26, left: "50%", width: 220, height: 56, translate: "-50% 0", rotate: "4deg", background: "rgba(235,225,190,.75)", boxShadow: "0 2px 6px rgba(0,0,0,.2)" }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ───────────── 5) TIMER DE COCINA (overlay en esquina) ───────────── */
export const TimerCocina: React.FC<{ durationInFrames: number; minutes: number; unit?: string; label?: string; corner?: "tr" | "br" | "bl" | "tl" }> = ({ durationInFrames: dur, minutes, unit = "MIN", label = "a fuego bajo", corner = "tr" }) => {
  const f = useCurrentFrame();
  const out = useOut(dur);
  const p = interpolate(f, [8, Math.max(20, dur - 14)], [0, 1], { ...cl, easing: Easing.bezier(0.45, 0, 0.55, 1) });
  const R = 118, L = 2 * Math.PI * R;
  const pos: React.CSSProperties = { position: "absolute", [corner.includes("t") ? "top" : "bottom"]: 60, [corner.includes("r") ? "right" : "left"]: 70 };
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ ...pos, width: 330, padding: "28px 0 24px", borderRadius: 36, background: "rgba(246,239,220,.95)", boxShadow: "0 20px 50px rgba(0,0,0,.45)", display: "flex", flexDirection: "column", alignItems: "center",
        scale: interpolate(f, [0, 10], [0.6, 1], { ...cl, easing: Easing.bezier(0.2, 1.4, 0.4, 1) }), opacity: interpolate(f, [0, 6], [0, 1], cl) }}>
        <svg width="280" height="280" viewBox="0 0 280 280">
          {Array.from({ length: 60 }).map((_, i) => {
            const a = (i / 60) * Math.PI * 2 - Math.PI / 2, big = i % 5 === 0;
            return <line key={i} x1={140 + Math.cos(a) * (big ? 96 : 102)} y1={140 + Math.sin(a) * (big ? 96 : 102)} x2={140 + Math.cos(a) * 108} y2={140 + Math.sin(a) * 108} stroke={C.inkSoft} strokeWidth={big ? 4 : 2} opacity={0.6} />;
          })}
          <circle cx="140" cy="140" r={R} fill="none" stroke="rgba(0,0,0,.08)" strokeWidth="16" />
          <circle cx="140" cy="140" r={R} fill="none" stroke={C.red} strokeWidth="16" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} transform="rotate(-90 140 140)" />
          <text x="140" y="150" textAnchor="middle" fontFamily={STAMP} fontSize="92" fill={C.ink}>{Math.round(p * minutes)}</text>
          <text x="140" y="192" textAnchor="middle" fontFamily={SERIF} fontSize="26" fill={C.inkSoft} letterSpacing="3">{unit}</text>
        </svg>
        <div style={{ fontFamily: HAND, fontSize: 46, color: C.ink, marginTop: -4 }}>{label}</div>
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── 6) MARCA A MANO sobre la foto: círculo + flecha + nota ───────────── */
export const MarcaCirculo: React.FC<{ durationInFrames: number; x: number; y: number; w?: number; h?: number; note: string; noteSide?: "left" | "right" }> = ({ durationInFrames: dur, x, y, w = 360, h = 260, note, noteSide = "right" }) => {
  const f = useCurrentFrame();
  const out = useOut(dur);
  const cx = (x / 100) * 1920, cy = (y / 100) * 1080;
  const nx = noteSide === "right" ? cx + w / 2 + 180 : cx - w / 2 - 180;
  const ny = cy - h / 2 - 90;
  const ar = interpolate(f, [16, 28], [0, 1], cl);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2 }}>
        <Circle progress={interpolate(f, [2, 18], [0, 1], cl)} color="#ffd23f" strokeWidth={9} iterations={2} padding={{ top: 0, bottom: 0, left: 0, right: 0 }}>
          <div style={{ width: w, height: h }} />
        </Circle>
      </div>
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <path d={`M ${nx} ${ny + 40} Q ${(nx + cx) / 2} ${ny - 60} ${noteSide === "right" ? cx + w / 2 - 10 : cx - w / 2 + 10} ${cy - h / 2 + 30}`} fill="none" stroke="#ffd23f" strokeWidth="8" strokeLinecap="round" strokeDasharray="900" strokeDashoffset={900 - 900 * ar} style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,.6))" }} />
      </svg>
      <div style={{ position: "absolute", left: noteSide === "right" ? nx - 40 : undefined, right: noteSide === "left" ? 1920 - nx - 40 : undefined, top: ny - 70, fontFamily: HAND, fontSize: 84, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,.85)", rotate: "-4deg",
        opacity: interpolate(f, [24, 32], [0, 1], cl), translate: `0px ${interpolate(f, [24, 32], [16, 0], { ...cl, easing: OUT })}px`, whiteSpace: "nowrap" }}>
        {note}
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── 7) LIBROS DE LA NONNA: las tapas reales de las guías + QR (CTA) ───────────── */
// covers: rutas ya resueltas (staticFile) · focus: índice de la tapa destacada (-1 = todas iguales)
export const GuiasNonna: React.FC<{ durationInFrames: number; src?: string; covers: string[]; labels?: string[]; focus?: number; eyebrow?: string; title?: string; qr?: string; foot?: string }> = ({ durationInFrames: dur, src, covers, labels = [], focus = -1, eyebrow = "LOS LIBROS DE LA NONNA", title, qr, foot = "En el primer comentario y en la descripción" }) => {
  const f = useCurrentFrame();
  const out = useOut(dur);
  const n = covers.length;
  const W = n >= 3 ? 470 : 540;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Backdrop src={src} dur={dur} dark={0.62} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 70 }}>
        <div style={{ fontFamily: SERIF, fontSize: 30, letterSpacing: 8, color: "#e9d9b6", opacity: interpolate(f, [0, 10], [0, 1], cl) }}>{eyebrow}</div>
        {title ? <div style={{ fontFamily: HAND, fontSize: 84, color: "#fff", marginTop: 4, textShadow: "0 4px 16px rgba(0,0,0,.7)", opacity: interpolate(f, [4, 14], [0, 1], cl), translate: `0px ${interpolate(f, [4, 14], [18, 0], { ...cl, easing: OUT })}px` }}>{title}</div> : null}
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 110 }}>
        <div style={{ display: "flex", gap: 46, alignItems: "flex-end" }}>
          {covers.map((c, i) => {
            const a = 8 + i * 7;
            const isF = focus === i;
            const dim = focus >= 0 && !isF ? 0.55 : 1;
            const rot = (i - (n - 1) / 2) * 4;
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center",
                translate: `0px ${interpolate(f, [a, a + 14], [500, 0], { ...cl, easing: Easing.bezier(0.2, 1.25, 0.4, 1) })}px`,
                rotate: `${rot}deg`, scale: isF ? interpolate(f, [a + 14, a + 24], [1, 1.08], cl) : 1, opacity: interpolate(f, [a, a + 6], [0, 1], cl) }}>
                <div style={{ width: W, height: W, borderRadius: 10, overflow: "hidden", boxShadow: isF ? "0 0 0 6px #ffd23f, 0 40px 70px rgba(0,0,0,.6)" : "0 34px 60px rgba(0,0,0,.55)", filter: `brightness(${dim})` }}>
                  <Img src={c} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                {labels[i] ? <div style={{ marginTop: 18, fontFamily: HAND, fontSize: 50, color: "#fff", textShadow: "0 3px 10px rgba(0,0,0,.8)", opacity: interpolate(f, [a + 12, a + 20], [0, dim], cl) }}>{labels[i]}</div> : null}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 46 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 26, background: "rgba(246,239,220,.96)", borderRadius: 22, padding: qr ? "14px 34px 14px 14px" : "18px 40px", boxShadow: "0 16px 40px rgba(0,0,0,.45)",
          opacity: interpolate(f, [26, 36], [0, 1], cl), translate: `0px ${interpolate(f, [26, 36], [40, 0], { ...cl, easing: OUT })}px` }}>
          {qr ? <Img src={qr} style={{ width: 128, height: 128, borderRadius: 8 }} /> : null}
          <div style={{ fontFamily: SERIF, fontSize: 40, fontWeight: 600, color: C.ink }}>👇 {foot}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
