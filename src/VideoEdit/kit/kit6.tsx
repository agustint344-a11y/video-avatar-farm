// kit6.tsx — componentes propios por canal (2 por canal). Todo determinístico (useCurrentFrame + interpolate), pantalla completa 1920x1080.
// NONNA: PizarraNonna · ProporcionTazas        MATEO: PlanoMedidas · NivelBurbuja
// HUERTA: CalendarioSiembra · CrecimientoPlanta   ELENA: RutinaDia · AnilloPorcentaje
// TOMBO: SemaforoVeredicto · CartelPrecaucion     ALAN (EN): WeekPlanner · HeartbeatLine
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";
import { loadFont as loadSerif } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";
import { loadFont as loadStamp } from "@remotion/google-fonts/Anton";
import { loadFont as loadMono } from "@remotion/google-fonts/CourierPrime";
const { fontFamily: HAND } = loadHand();
const { fontFamily: SERIF } = loadSerif();
const { fontFamily: SANS } = loadSans();
const { fontFamily: STAMP } = loadStamp();
const { fontFamily: MONO } = loadMono();

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const useOut = (dur: number) => interpolate(useCurrentFrame(), [dur - 8, dur], [1, 0], cl);
const pop = (f: number, a: number, len = 14) => interpolate(f, [a, a + len], [0, 1], { ...cl, easing: OUT });
type D = { durationInFrames: number };

/* ═════════════════ NONNA 1) PIZARRA: lista escrita con tiza ═════════════════ */
export const PizarraNonna: React.FC<D & { title: string; items: string[]; note?: string }> = ({ durationInFrames: dur, title, items, note }) => {
  const f = useCurrentFrame();
  const out = useOut(dur);
  const per = Math.max(14, Math.min(26, Math.floor((dur * 0.6) / Math.max(1, items.length))));
  return (
    <AbsoluteFill style={{ opacity: out, background: "radial-gradient(ellipse at center,#3a2a1a 0%,#1d140b 100%)", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 1500, height: 900, borderRadius: 14, padding: 26, background: "linear-gradient(135deg,#8a5a2b,#5e3b19 55%,#7a4e24)", boxShadow: "0 40px 90px rgba(0,0,0,.65)", scale: interpolate(f, [0, 14], [0.92, 1], { ...cl, easing: OUT }), opacity: pop(f, 0, 8) }}>
        <div style={{ width: "100%", height: "100%", position: "relative", borderRadius: 6, background: "radial-gradient(ellipse at 30% 20%,#2f4a3d 0%,#223a2f 70%,#1b2f26 100%)", boxShadow: "inset 0 0 120px rgba(0,0,0,.55)", padding: "50px 90px", boxSizing: "border-box" }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.12, background: "repeating-linear-gradient(115deg,#fff 0 2px,transparent 2px 9px)" }} />
          <div style={{ fontFamily: HAND, fontSize: 120, color: "#f5f0df", lineHeight: 1, clipPath: `inset(-10px ${100 - interpolate(f, [4, 22], [0, 100], cl)}% -10px 0)` }}>{title}</div>
          <svg width="900" height="26" viewBox="0 0 900 26" style={{ marginTop: 4 }}>
            <path d="M4 14 C150 4 300 22 450 12 S760 6 896 14" fill="none" stroke="#f5f0df" strokeWidth="5" strokeLinecap="round" strokeDasharray="920" strokeDashoffset={920 - 920 * interpolate(f, [18, 34], [0, 1], cl)} opacity=".85" />
          </svg>
          <div style={{ marginTop: 22 }}>
            {items.map((it, i) => {
              const a = 30 + i * per;
              const w = interpolate(f, [a, a + per * 0.8], [0, 100], cl);
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, height: 108 }}>
                  <div style={{ fontFamily: HAND, fontSize: 84, color: "#f2c94c", opacity: interpolate(f, [a, a + 4], [0, 1], cl) }}>{i + 1}.</div>
                  <div style={{ fontFamily: HAND, fontSize: 88, color: "#f5f0df", whiteSpace: "nowrap", clipPath: `inset(-10px ${100 - w}% -10px 0)` }}>{it}</div>
                </div>
              );
            })}
          </div>
          {note ? <div style={{ position: "absolute", right: 90, bottom: 44, fontFamily: HAND, fontSize: 76, color: "#f2c94c", rotate: "-3deg", opacity: pop(f, 34 + items.length * per, 10) }}>{note}</div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ═════════════════ NONNA 2) PROPORCIÓN: tazas que se llenan ═════════════════ */
const Taza: React.FC<{ fill: number; color: string; size?: number }> = ({ fill, color, size = 150 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <defs><clipPath id={`tz${color.replace("#", "")}`}><path d="M18 24 H72 V66 Q72 84 54 84 H36 Q18 84 18 66 Z" /></clipPath></defs>
    <rect x="18" y={24 + 60 * (1 - fill)} width="54" height={60 * fill + 2} fill={color} clipPath={`url(#tz${color.replace("#", "")})`} />
    <path d="M18 24 H72 V66 Q72 84 54 84 H36 Q18 84 18 66 Z" fill="rgba(255,255,255,.25)" stroke="#f5f0df" strokeWidth="4" strokeLinejoin="round" />
    <path d="M72 34 H82 Q90 34 90 44 V50 Q90 60 80 60 H72" fill="none" stroke="#f5f0df" strokeWidth="4" strokeLinecap="round" />
  </svg>
);
export const ProporcionTazas: React.FC<D & { title: string; left: { label: string; parts: number }; right: { label: string; parts: number }; note?: string }> = ({ durationInFrames: dur, title, left, right, note }) => {
  const f = useCurrentFrame();
  const out = useOut(dur);
  const row = (side: { label: string; parts: number }, color: string, t0: number, y: number) => (
    <div style={{ display: "flex", alignItems: "center", gap: 20, height: 190, translate: `0 ${y}px` }}>
      <div style={{ width: 360, fontFamily: HAND, fontSize: 84, color: "#3a2a1a", textAlign: "right" }}>{side.label}</div>
      <div style={{ display: "flex", gap: 6 }}>
        {Array.from({ length: Math.min(8, Math.ceil(side.parts)) }).map((_, i) => (
          <div key={i} style={{ opacity: pop(f, t0 + i * 8, 6), translate: `0 ${(1 - pop(f, t0 + i * 8, 10)) * -40}px` }}>
            <Taza color={color} fill={interpolate(f, [t0 + i * 8 + 6, t0 + i * 8 + 18], [0, Math.min(1, side.parts - i)], cl)} />
          </div>
        ))}
      </div>
      <div style={{ fontFamily: STAMP, fontSize: 130, color: "#b3261e", marginLeft: 12, opacity: pop(f, t0 + 20, 8) }}>×{side.parts}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: out, background: "radial-gradient(ellipse at 30% 20%,#f6efdc 0%,#e8dab8 100%)", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 84, color: "#2a2018", marginBottom: 20, opacity: pop(f, 0, 10) }}>{title}</div>
      {row(left, "#e9c46a", 14, 0)}
      <div style={{ fontFamily: STAMP, fontSize: 90, color: "#56652c", opacity: pop(f, 40, 8) }}>POR CADA</div>
      {row(right, "#8ecae6", 48, 0)}
      {note ? <div style={{ marginTop: 18, fontFamily: HAND, fontSize: 78, color: "#b3261e", rotate: "-2deg", opacity: pop(f, 86, 10) }}>{note}</div> : null}
    </AbsoluteFill>
  );
};

/* ═════════════════ MATEO 1) PLANO DE MEDIDAS: cotas que se dibujan ═════════════════ */
export const PlanoMedidas: React.FC<D & { title: string; w: number; h: number; unit?: string; label?: string; note?: string }> = ({ durationInFrames: dur, title, w, h, unit = "cm", label = "ÁREA", note }) => {
  const f = useCurrentFrame();
  const out = useOut(dur);
  const RW = 760, RH = Math.max(260, Math.min(520, 760 * (h / w)));
  const x0 = 960 - RW / 2 - 40, y0 = 560 - RH / 2;
  const p1 = interpolate(f, [6, 30], [0, 1], { ...cl, easing: OUT });
  const p2 = interpolate(f, [26, 50], [0, 1], { ...cl, easing: OUT });
  const n1 = Math.round(w * interpolate(f, [30, 52], [0, 1], cl));
  const n2 = Math.round(h * interpolate(f, [50, 72], [0, 1], cl));
  const ARR = (x1: number, y1: number, x2: number, y2: number, p: number) => (
    <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke="#ffd166" strokeWidth="5" markerStart="url(#arr)" markerEnd="url(#arr)" />
  );
  return (
    <AbsoluteFill style={{ opacity: out, background: "#0d3b66", fontFamily: MONO }}>
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.09) 2px,transparent 2px),linear-gradient(90deg,rgba(255,255,255,.09) 2px,transparent 2px)", backgroundSize: "60px 60px" }} />
      <div style={{ position: "absolute", left: 90, top: 60, fontFamily: STAMP, fontSize: 70, color: "#fff", letterSpacing: 4, opacity: pop(f, 0, 8) }}>{title}</div>
      <div style={{ position: "absolute", right: 90, top: 70, border: "3px solid #ffd166", padding: "6px 16px", color: "#ffd166", fontSize: 34, opacity: pop(f, 4, 8) }}>PLANO · ESC 1:20</div>
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        <defs><marker id="arr" markerWidth="12" markerHeight="12" refX="6" refY="6" orient="auto"><path d="M1 1 L11 6 L1 11" fill="none" stroke="#ffd166" strokeWidth="2" /></marker></defs>
        <rect x={x0} y={y0} width={RW} height={RH} fill="rgba(255,255,255,.07)" stroke="#fff" strokeWidth="6" strokeDasharray={2 * (RW + RH)} strokeDashoffset={2 * (RW + RH) * (1 - interpolate(f, [0, 28], [0, 1], cl))} />
        {ARR(x0, y0 + RH + 60, x0 + RW, y0 + RH + 60, p1)}
        {ARR(x0 + RW + 60, y0, x0 + RW + 60, y0 + RH, p2)}
        <text x={x0 + RW / 2} y={y0 + RH + 130} textAnchor="middle" fill="#ffd166" fontSize="68" fontFamily={MONO} fontWeight="700" opacity={pop(f, 30, 6)}>{n1} {unit}</text>
        <text x={x0 + RW + 100} y={y0 + RH / 2 + 24} fill="#ffd166" fontSize="68" fontFamily={MONO} fontWeight="700" opacity={pop(f, 50, 6)}>{n2} {unit}</text>
        <text x={x0 + RW / 2} y={y0 + RH / 2 + 18} textAnchor="middle" fill="#fff" fontSize="56" fontFamily={STAMP} letterSpacing="6" opacity={pop(f, 36, 10) * 0.9}>{label}</text>
      </svg>
      {note ? <div style={{ position: "absolute", left: 90, bottom: 60, color: "#fff", fontSize: 46, borderLeft: "8px solid #ffd166", paddingLeft: 22, opacity: pop(f, 74, 10) }}>{note}</div> : null}
    </AbsoluteFill>
  );
};

/* ═════════════════ MATEO 2) NIVEL DE BURBUJA: la burbuja busca el centro ═════════════════ */
export const NivelBurbuja: React.FC<D & { title: string; verdict?: string; sub?: string }> = ({ durationInFrames: dur, title, verdict = "¡A NIVEL!", sub }) => {
  const f = useCurrentFrame();
  const out = useOut(dur);
  const settle = interpolate(f, [8, 70], [1, 0], { ...cl, easing: Easing.out(Easing.cubic) });
  const bx = settle * Math.cos(f / 4) * 300;
  const good = f > 70;
  return (
    <AbsoluteFill style={{ opacity: out, background: "linear-gradient(#2b2d31,#1a1b1e)", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", top: 90, fontFamily: STAMP, fontSize: 100, color: "#f2f2f2", letterSpacing: 4, opacity: pop(f, 0, 8) }}>{title}</div>
      <div style={{ marginTop: -250, width: 1500, height: 240, borderRadius: 30, background: "linear-gradient(#ffd23f,#e0a800 60%,#b98300)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center", scale: interpolate(f, [0, 12], [0.9, 1], { ...cl, easing: OUT }), opacity: pop(f, 0, 8) }}>
        <div style={{ width: 900, height: 110, borderRadius: 55, background: "linear-gradient(#e8fbd0,#a8e063)", border: "10px solid #7a5a00", position: "relative", boxShadow: "inset 0 8px 18px rgba(0,0,0,.35)" }}>
          <div style={{ position: "absolute", left: "calc(50% - 90px)", top: 0, bottom: 0, width: 6, background: "#7a5a00" }} />
          <div style={{ position: "absolute", left: "calc(50% + 84px)", top: 0, bottom: 0, width: 6, background: "#7a5a00" }} />
          <div style={{ position: "absolute", top: 8, left: `calc(50% - 70px + ${bx}px)`, width: 140, height: 76, borderRadius: 38, background: "radial-gradient(circle at 35% 30%,#fff,#c6f0ff 60%,#7cc8e8)", boxShadow: "0 0 18px rgba(255,255,255,.7)" }} />
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 130, textAlign: "center", opacity: pop(f, 70, 8), scale: good ? interpolate(f, [70, 80], [1.3, 1], { ...cl, easing: OUT }) : 1 }}>
        <div style={{ fontFamily: STAMP, fontSize: 150, color: "#7bd88f", letterSpacing: 6 }}>{verdict}</div>
        {sub ? <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 52, color: "#e5e5e5", marginTop: 10 }}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

/* ═════════════════ HUERTA 1) CALENDARIO DE SIEMBRA: 12 meses ═════════════════ */
const MESES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
export const CalendarioSiembra: React.FC<D & { title: string; crop?: string; sow: number[]; harvest?: number[]; note?: string }> = ({ durationInFrames: dur, title, crop, sow, harvest = [], note }) => {
  const f = useCurrentFrame();
  const out = useOut(dur);
  return (
    <AbsoluteFill style={{ opacity: out, background: "linear-gradient(#f3ecd9,#e3d7b6)", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 92, color: "#2f3a1f", opacity: pop(f, 0, 10) }}>{title}</div>
      {crop ? <div style={{ fontFamily: HAND, fontSize: 80, color: "#8a4b1e", marginTop: 4, opacity: pop(f, 6, 10) }}>{crop}</div> : null}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 22, marginTop: 40, width: 1560 }}>
        {MESES.map((m, i) => {
          const s = sow.includes(i + 1), h = harvest.includes(i + 1);
          const a = 14 + i * 3;
          const lit = interpolate(f, [a + 20, a + 32], [0, 1], cl);
          return (
            <div key={m} style={{ height: 210, borderRadius: 22, background: "#fffaf0", border: "3px solid #cdbd96", boxShadow: "0 10px 24px rgba(60,40,10,.18)", position: "relative", overflow: "hidden", opacity: pop(f, a, 8), translate: `0 ${(1 - pop(f, a, 12)) * 40}px` }}>
              <div style={{ position: "absolute", inset: 0, background: s ? "#6a994e" : h ? "#f4a261" : "transparent", opacity: lit * (s || h ? 1 : 0) }} />
              <div style={{ position: "relative", fontFamily: STAMP, fontSize: 70, textAlign: "center", marginTop: 26, color: (s || h) && lit > 0.5 ? "#fff" : "#4a3f2a", letterSpacing: 3 }}>{m}</div>
              <div style={{ position: "relative", textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 36, color: "#fff", opacity: lit, marginTop: 14 }}>{s ? "SEMBRAR" : h ? "COSECHAR" : ""}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 40, marginTop: 36, fontFamily: SANS, fontWeight: 700, fontSize: 40, color: "#3a3a2a", opacity: pop(f, 60, 8) }}>
        <span><span style={{ display: "inline-block", width: 34, height: 34, borderRadius: 8, background: "#6a994e", marginRight: 12, verticalAlign: "middle" }} />Siembra</span>
        {harvest.length ? <span><span style={{ display: "inline-block", width: 34, height: 34, borderRadius: 8, background: "#f4a261", marginRight: 12, verticalAlign: "middle" }} />Cosecha</span> : null}
      </div>
      {note ? <div style={{ marginTop: 20, fontFamily: HAND, fontSize: 70, color: "#b3261e", opacity: pop(f, 74, 10) }}>{note}</div> : null}
    </AbsoluteFill>
  );
};

/* ═════════════════ HUERTA 2) CRECIMIENTO: la planta sube por etapas ═════════════════ */
export const CrecimientoPlanta: React.FC<D & { title: string; stages: { label: string; sub?: string }[] }> = ({ durationInFrames: dur, title, stages }) => {
  const f = useCurrentFrame();
  const out = useOut(dur);
  const n = Math.max(2, Math.min(5, stages.length));
  const per = Math.max(16, Math.floor((dur * 0.7) / n));
  const colW = 1620 / n;
  return (
    <AbsoluteFill style={{ opacity: out, background: "linear-gradient(#cfe8f5 0%,#eaf5e1 62%,#eaf5e1 100%)" }}>
      <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 88, color: "#25401f", opacity: pop(f, 0, 10) }}>{title}</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 330, background: "linear-gradient(#7a4f2a,#4b2f16)" }} />
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        {stages.slice(0, n).map((s, i) => {
          const cx = 150 + colW * (i + 0.5);
          const g = interpolate(f, [10 + i * per, 10 + i * per + per * 0.8], [0, 1], { ...cl, easing: OUT });
          const H = (60 + 380 * ((i + 1) / n)) * g;
          const leaves = Math.min(i + 1, 5);
          return (
            <g key={i}>
              <ellipse cx={cx} cy={750} rx="80" ry="14" fill="#3b2410" />
              <path d={`M${cx} 750 C${cx - 8} ${750 - H * 0.5} ${cx + 10} ${750 - H * 0.8} ${cx} ${750 - H}`} stroke="#3e8e41" strokeWidth="14" fill="none" strokeLinecap="round" />
              {Array.from({ length: leaves }).map((_, k) => {
                const ly = 750 - H * ((k + 1) / (leaves + 0.5));
                const side = k % 2 ? 1 : -1;
                const sz = 60 + i * 12;
                return <ellipse key={k} cx={cx + side * sz * 0.8} cy={ly} rx={sz} ry={sz * 0.42} fill="#58b368" transform={`rotate(${side * -22} ${cx + side * sz * 0.8} ${ly})`} opacity={g} />;
              })}
              {i === n - 1 ? <circle cx={cx} cy={750 - H - 30} r={50 * g} fill="#e63946" /> : null}
            </g>
          );
        })}
      </svg>
      {stages.slice(0, n).map((s, i) => (
        <div key={i} style={{ position: "absolute", left: 150 + colW * i, width: colW, bottom: 70, textAlign: "center", opacity: pop(f, 14 + i * per, 10) }}>
          <div style={{ fontFamily: STAMP, fontSize: 64, color: "#fff2d8", letterSpacing: 2 }}>{s.label}</div>
          {s.sub ? <div style={{ fontFamily: HAND, fontSize: 56, color: "#ffd9a0" }}>{s.sub}</div> : null}
        </div>
      ))}
    </AbsoluteFill>
  );
};

/* ═════════════════ ELENA 1) RUTINA DEL DÍA: el sol recorre el arco ═════════════════ */
export const RutinaDia: React.FC<D & { title: string; slots: { time: string; text: string }[] }> = ({ durationInFrames: dur, title, slots }) => {
  const f = useCurrentFrame();
  const out = useOut(dur);
  const n = Math.max(2, Math.min(4, slots.length));
  const per = Math.max(18, Math.floor((dur * 0.72) / n));
  const P = (t: number) => ({ x: 260 + 1400 * t, y: 560 - Math.sin(Math.PI * t) * 300 });
  const sunT = interpolate(f, [8, 8 + per * n], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const sp = P(sunT);
  return (
    <AbsoluteFill style={{ opacity: out, background: "linear-gradient(#EAF0F1,#d9ecee)", fontFamily: SANS }}>
      <div style={{ position: "absolute", top: 80, left: 120, fontWeight: 800, fontSize: 80, color: "#16242B", opacity: pop(f, 0, 10) }}>{title}</div>
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        <path d={`M260 560 Q960 -40 1660 560`} fill="none" stroke="#9fc3c6" strokeWidth="6" strokeDasharray="14 14" />
        <line x1="180" y1="560" x2="1740" y2="560" stroke="#16242B" strokeWidth="4" opacity=".35" />
        <circle cx={sp.x} cy={sp.y} r="54" fill="#f6b73c" />
        <circle cx={sp.x} cy={sp.y} r="86" fill="#f6b73c" opacity=".22" />
        {slots.slice(0, n).map((s, i) => {
          const t = n === 1 ? 0.5 : i / (n - 1);
          const p = P(t);
          const on = sunT >= t - 0.001;
          return <circle key={i} cx={p.x} cy={p.y} r="22" fill={on ? "#0FA9A0" : "#fff"} stroke="#0FA9A0" strokeWidth="6" />;
        })}
      </svg>
      {slots.slice(0, n).map((s, i) => {
        const t = n === 1 ? 0.5 : i / (n - 1);
        const p = P(t);
        const a = 8 + per * t * n;
        return (
          <div key={i} style={{ position: "absolute", left: Math.max(30, Math.min(1430, p.x - 230)), top: 650, width: 460, textAlign: "center", opacity: pop(f, a, 10), translate: `0 ${(1 - pop(f, a, 12)) * 24}px` }}>
            <div style={{ fontWeight: 800, fontSize: 62, color: "#0FA9A0" }}>{s.time}</div>
            <div style={{ fontWeight: 600, fontSize: 48, color: "#16242B", lineHeight: 1.15, marginTop: 6, background: "#fff", borderRadius: 18, padding: "12px 20px", boxShadow: "0 10px 26px rgba(22,36,43,.15)" }}>{s.text}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ═════════════════ ELENA 2) ANILLO DE PORCENTAJE ═════════════════ */
export const AnilloPorcentaje: React.FC<D & { value: number; label: string; sub?: string; eyebrow?: string }> = ({ durationInFrames: dur, value, label, sub, eyebrow }) => {
  const f = useCurrentFrame();
  const out = useOut(dur);
  const p = interpolate(f, [8, 52], [0, value / 100], { ...cl, easing: OUT });
  const R = 250, C = 2 * Math.PI * R;
  return (
    <AbsoluteFill style={{ opacity: out, background: "linear-gradient(135deg,#EAF0F1,#cfe5e7)", fontFamily: SANS, alignItems: "center", justifyContent: "center" }}>
      {eyebrow ? <div style={{ position: "absolute", top: 100, fontWeight: 800, fontSize: 46, letterSpacing: 8, color: "#0FA9A0", opacity: pop(f, 0, 8) }}>{eyebrow.toUpperCase()}</div> : null}
      <div style={{ display: "flex", alignItems: "center", gap: 120 }}>
        <svg width="620" height="620" viewBox="0 0 620 620" style={{ scale: interpolate(f, [0, 12], [0.85, 1], { ...cl, easing: OUT }) }}>
          <circle cx="310" cy="310" r={R} fill="none" stroke="#fff" strokeWidth="64" />
          <circle cx="310" cy="310" r={R} fill="none" stroke="#0FA9A0" strokeWidth="64" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - p)} transform="rotate(-90 310 310)" />
          <text x="310" y="350" textAnchor="middle" fontSize="170" fontWeight="800" fill="#16242B">{Math.round(p * 100)}%</text>
        </svg>
        <div style={{ maxWidth: 760 }}>
          <div style={{ fontWeight: 800, fontSize: 92, color: "#16242B", lineHeight: 1.05, opacity: pop(f, 24, 10) }}>{label}</div>
          {sub ? <div style={{ fontWeight: 500, fontSize: 50, color: "#4f636c", marginTop: 20, opacity: pop(f, 40, 10) }}>{sub}</div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ═════════════════ TOMBO 1) SEMÁFORO DE VEREDICTO ═════════════════ */
export const SemaforoVeredicto: React.FC<D & { title: string; light: "verde" | "amarillo" | "rojo"; verdict: string; reasons?: string[] }> = ({ durationInFrames: dur, title, light, verdict, reasons = [] }) => {
  const f = useCurrentFrame();
  const out = useOut(dur);
  const order = ["rojo", "amarillo", "verde"] as const;
  const COL = { rojo: "#e63946", amarillo: "#ffb703", verde: "#2fbf71" };
  const seq = f < 14 ? "rojo" : f < 26 ? "amarillo" : light; // parpadea de rojo a amarillo y se detiene en el veredicto
  const lit = f < 14 ? "rojo" : f < 26 ? "amarillo" : light;
  void seq;
  return (
    <AbsoluteFill style={{ opacity: out, background: "radial-gradient(ellipse at 30% 40%,#26323a,#11181d)", fontFamily: SANS, justifyContent: "center" }}>
      <div style={{ position: "absolute", top: 90, left: 150, fontWeight: 800, fontSize: 74, color: "#f1f5f7", opacity: pop(f, 0, 10), maxWidth: 1500 }}>{title}</div>
      <div style={{ position: "absolute", left: 220, top: 230, width: 260, height: 700, borderRadius: 60, background: "#0b0f12", border: "10px solid #3a4850", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around", boxShadow: "0 30px 70px rgba(0,0,0,.6)", opacity: pop(f, 0, 8) }}>
        {order.map((c) => (
          <div key={c} style={{ width: 170, height: 170, borderRadius: 85, background: lit === c ? COL[c] : "#232c31", boxShadow: lit === c ? `0 0 90px ${COL[c]}, inset 0 -10px 30px rgba(0,0,0,.25)` : "inset 0 6px 14px rgba(0,0,0,.6)" }} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 640, top: 270, right: 120 }}>
        <div style={{ fontFamily: STAMP, fontSize: 150, color: COL[light], letterSpacing: 4, opacity: pop(f, 28, 10), scale: interpolate(f, [28, 38], [1.25, 1], { ...cl, easing: OUT }), transformOrigin: "left center" }}>{verdict}</div>
        {reasons.slice(0, 4).map((r, i) => (
          <div key={i} style={{ fontWeight: 600, fontSize: 56, color: "#e6edf0", marginTop: 26, display: "flex", gap: 22, opacity: pop(f, 40 + i * 12, 10), translate: `${(1 - pop(f, 40 + i * 12, 12)) * 50}px 0` }}>
            <span style={{ color: COL[light] }}>●</span><span>{r}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ═════════════════ TOMBO 2) CARTEL DE PRECAUCIÓN ═════════════════ */
export const CartelPrecaucion: React.FC<D & { title: string; text: string; sub?: string }> = ({ durationInFrames: dur, title, text, sub }) => {
  const f = useCurrentFrame();
  const out = useOut(dur);
  const slide = (1 - pop(f, 0, 14)) * -300;
  const stripe = "repeating-linear-gradient(-45deg,#ffcc00 0 46px,#111 46px 92px)";
  const blink = f % 24 < 14 ? 1 : 0.55;
  return (
    <AbsoluteFill style={{ opacity: out, background: "#1b1b1b", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, height: 100, background: stripe, translate: `${-slide}px 0` }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, height: 100, background: stripe, translate: `${slide}px 0` }} />
      <div style={{ textAlign: "center", opacity: pop(f, 8, 10), maxWidth: 1500 }}>
        <svg width="260" height="230" viewBox="0 0 260 230" style={{ opacity: blink }}>
          <path d="M130 12 L248 214 H12 Z" fill="#ffcc00" stroke="#111" strokeWidth="12" strokeLinejoin="round" />
          <rect x="120" y="82" width="20" height="74" rx="8" fill="#111" /><circle cx="130" cy="182" r="12" fill="#111" />
        </svg>
        <div style={{ fontFamily: STAMP, fontSize: 118, color: "#ffcc00", letterSpacing: 6, marginTop: 10 }}>{title}</div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 80, color: "#fff", lineHeight: 1.1, marginTop: 18, opacity: pop(f, 20, 10) }}>{text}</div>
        {sub ? <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 48, color: "#d7d7d7", marginTop: 20, opacity: pop(f, 34, 10) }}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

/* ═════════════════ ALAN (EN) 1) WEEK PLANNER ═════════════════ */
export const WeekPlanner: React.FC<D & { title: string; days: { d: string; t: string; rest?: boolean }[] }> = ({ durationInFrames: dur, title, days }) => {
  const f = useCurrentFrame();
  const out = useOut(dur);
  const n = Math.min(7, days.length);
  return (
    <AbsoluteFill style={{ opacity: out, background: "linear-gradient(135deg,#0f2a43,#16466b)", fontFamily: SANS, alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontWeight: 800, fontSize: 84, color: "#fff", marginBottom: 46, opacity: pop(f, 0, 10) }}>{title}</div>
      <div style={{ display: "flex", gap: 18 }}>
        {days.slice(0, n).map((d, i) => {
          const a = 8 + i * 6;
          return (
            <div key={i} style={{ width: Math.floor(1600 / n) - 18, height: 430, borderRadius: 26, background: d.rest ? "rgba(255,255,255,.12)" : "#fff", border: d.rest ? "3px dashed rgba(255,255,255,.4)" : "none", boxShadow: "0 20px 44px rgba(0,0,0,.35)", overflow: "hidden", opacity: pop(f, a, 8), translate: `0 ${(1 - pop(f, a, 12)) * 70}px` }}>
              <div style={{ background: d.rest ? "transparent" : "#2a9d8f", color: "#fff", fontWeight: 800, fontSize: 52, textAlign: "center", padding: "18px 0", letterSpacing: 3 }}>{d.d.toUpperCase()}</div>
              <div style={{ padding: "30px 18px", textAlign: "center", fontWeight: 700, fontSize: 46, lineHeight: 1.15, color: d.rest ? "rgba(255,255,255,.85)" : "#0f2a43" }}>{d.t}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ═════════════════ ALAN (EN) 2) HEARTBEAT: el ECG se dibuja ═════════════════ */
export const HeartbeatLine: React.FC<D & { title: string; value?: number; unit?: string; sub?: string }> = ({ durationInFrames: dur, title, value = 72, unit = "BPM", sub }) => {
  const f = useCurrentFrame();
  const out = useOut(dur);
  const seg = "L0 0 L40 0 L56 -26 L78 70 L104 -150 L128 110 L146 0 L176 0 L200 -30 L226 0 L330 0";
  let d = "M0 0";
  for (let k = 0; k < 6; k++) d += ` ${seg.replace(/L(-?\d+) (-?\d+)/g, (_, x, y) => `L${+x + k * 330} ${y}`)}`;
  const LEN = 3900;
  const p = interpolate(f, [4, 60], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const beat = 1 + 0.06 * Math.max(0, Math.sin(f / 3.2)) * (f > 20 ? 1 : 0);
  return (
    <AbsoluteFill style={{ opacity: out, background: "#06131a", fontFamily: SANS }}>
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(0,255,170,.07) 2px,transparent 2px),linear-gradient(90deg,rgba(0,255,170,.07) 2px,transparent 2px)", backgroundSize: "48px 48px" }} />
      <div style={{ position: "absolute", top: 90, left: 120, fontWeight: 800, fontSize: 76, color: "#e7fff6", opacity: pop(f, 0, 10), maxWidth: 1500 }}>{title}</div>
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        <g transform="translate(-60 600) scale(1.02 1)">
          <path d={d} fill="none" stroke="#00ffaa" strokeWidth="9" strokeLinejoin="round" strokeLinecap="round" strokeDasharray={LEN} strokeDashoffset={LEN * (1 - p)} style={{ filter: "drop-shadow(0 0 14px #00ffaa)" }} />
        </g>
      </svg>
      <div style={{ position: "absolute", right: 140, bottom: 110, textAlign: "right", opacity: pop(f, 30, 10) }}>
        <span style={{ fontWeight: 800, fontSize: 210, color: "#00ffaa", display: "inline-block", scale: beat }}>{Math.round(value * interpolate(f, [24, 54], [0.6, 1], cl))}</span>
        <span style={{ fontWeight: 700, fontSize: 64, color: "#9fe8d0", marginLeft: 16 }}>{unit}</span>
        {sub ? <div style={{ fontWeight: 500, fontSize: 48, color: "#cfeee3" }}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
