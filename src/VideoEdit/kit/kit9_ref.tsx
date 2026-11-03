// kit9 (2026-11-03) — componentes copiados de las referencias del usuario:
//   El Constructor Libre (azotea $2, 1,9M): barras "Lo que ahorras" en papel crema, fichas de pregunta teal con foto, dato al costado del presentador.
//   Cementos Rogelio (piso cal, 237k): el presupuesto del albañil en papel.
//   Corte de la losa (propio): poros como esponja → hierro que se oxida y se hincha / poros sellados con el escudo.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";
const { fontFamily: SERIF } = loadSerif();
const { fontFamily: SANS } = loadSans();
const { fontFamily: HAND } = loadHand();

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const useFade = (dur: number, n = 10) => {
  const f = useCurrentFrame();
  return Math.min(interpolate(f, [0, n], [0, 1], clamp), interpolate(f, [dur - n, dur], [1, 0], clamp));
};
const useSpring = (delay = 0, damping = 16) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping } });
};
const PAPER = "#F3EEE3", INK = "#2B2721", RED = "#C9573B", GREEN = "#5E8F4E", TEAL = "#0D2328", TEAL2 = "#12343A", MINT = "#5ED3B8";

/* ───────── AhorroBarras: "Lo que ahorras" (papel crema, dos barras que crecen) ───────── */
export const AhorroBarras: React.FC<{ durationInFrames: number; title?: string; caro: { label: string; value: number; tag?: string }; barato: { label: string; value: number; tag?: string }; moneda?: string; nota?: string }> = ({ durationInFrames, title = "Lo que ahorras", caro, barato, moneda = "US$", nota }) => {
  const op = useFade(durationInFrames); const f = useCurrentFrame();
  const max = Math.max(caro.value, barato.value);
  const g1 = interpolate(f, [12, 42], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const g2 = interpolate(f, [34, 58], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const H = 560;
  const bar = (b: { label: string; value: number; tag?: string }, g: number, color: string, x: number) => {
    const h = Math.max(14, (b.value / max) * H * g);
    return <div style={{ position: "absolute", left: x, bottom: 210, width: 230, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ font: `700 46px ${SERIF}`, color, marginBottom: 14, opacity: g }}>{moneda}{Math.round(b.value * g)}</div>
      <div style={{ width: 150, height: h, background: color, borderRadius: "18px 18px 6px 6px", boxShadow: "inset -10px 0 0 rgba(0,0,0,0.08)" }} />
      <div style={{ position: "absolute", top: "100%", marginTop: 22, font: `600 30px ${SANS}`, color: INK, textAlign: "center", width: 330 }}>{b.label}</div>
      {b.tag && <div style={{ position: "absolute", top: "100%", marginTop: 66, font: `500 24px ${SANS}`, color: "#7A7266", textAlign: "center", width: 330 }}>{b.tag}</div>}
    </div>;
  };
  const save = caro.value - barato.value;
  const st = useSpring(66, 11);
  return <AbsoluteFill style={{ background: PAPER, opacity: op }}>
    <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)", backgroundSize: "6px 6px", opacity: 0.6 }} />
    <div style={{ position: "absolute", top: 90, width: "100%", textAlign: "center", font: `600 64px ${SERIF}`, color: INK }}>{title}</div>
    <div style={{ position: "absolute", left: 470, right: 470, bottom: 210, height: 3, background: "#CFC6B5" }} />
    {bar(caro, g1, RED, 560)}
    {bar(barato, g2, GREEN, 1130)}
    <div style={{ position: "absolute", right: 150, top: 300, transform: `rotate(-8deg) scale(${st})`, background: GREEN, color: "#fff", borderRadius: 18, padding: "18px 30px", font: `800 44px ${SANS}`, boxShadow: "0 12px 30px rgba(0,0,0,0.18)" }}>
      Ahorras {moneda}{save}
    </div>
    {nota && <div style={{ position: "absolute", bottom: 70, width: "100%", textAlign: "center", font: `500 34px ${HAND}`, color: "#6C6457" }}>{nota}</div>}
  </AbsoluteFill>;
};

/* ───────── PreguntaFicha: ficha teal con foto a la izquierda y la pregunta grande (estilo FAQ) ───────── */
export const PreguntaFicha: React.FC<{ durationInFrames: number; src?: string; kicker?: string; pregunta: string; respuesta?: string; n?: number }> = ({ durationInFrames, src, kicker, pregunta, respuesta, n }) => {
  const op = useFade(durationInFrames); const f = useCurrentFrame();
  const ph = useSpring(2, 18); const tx = useSpring(10, 18);
  const chars = respuesta ? Math.floor(interpolate(f, [26, 26 + respuesta.length * 1.1], [0, respuesta.length], clamp)) : 0;
  return <AbsoluteFill style={{ background: `radial-gradient(circle at 30% 40%, ${TEAL2}, ${TEAL} 70%)`, opacity: op }}>
    <div style={{ position: "absolute", left: 70, top: 0, bottom: 0, width: 4, background: "rgba(94,211,184,0.25)" }} />
    <div style={{ position: "absolute", left: 62, top: 520, width: 20, height: 20, borderRadius: 99, background: MINT, boxShadow: `0 0 24px ${MINT}` }} />
    <div style={{ position: "absolute", left: 180, top: 170, width: 760, height: 740, borderRadius: 26, overflow: "hidden", transform: `translateX(${(1 - ph) * -60}px)`, opacity: ph, boxShadow: "0 30px 80px rgba(0,0,0,0.5)", border: "3px solid rgba(255,255,255,0.12)", background: "#000" }}>
      {src && <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + f / 3000})` }} />}
    </div>
    <div style={{ position: "absolute", left: 1030, right: 120, top: 330, transform: `translateY(${(1 - tx) * 30}px)`, opacity: tx }}>
      {kicker && <div style={{ font: `700 26px ${SANS}`, color: MINT, letterSpacing: 4, textTransform: "uppercase", marginBottom: 22 }}>{n ? `${String(n).padStart(2, "0")} · ` : "— "}{kicker}</div>}
      <div style={{ font: `700 76px/1.1 ${SANS}`, color: "#fff" }}>{pregunta}</div>
      {respuesta && <div style={{ marginTop: 30, font: `400 38px/1.35 ${SANS}`, color: "rgba(255,255,255,0.78)" }}>{respuesta.slice(0, chars)}</div>}
    </div>
  </AbsoluteFill>;
};

/* ───────── Presupuesto: la hoja del albañil / la ferretería, con el total encerrado a mano ───────── */
export const Presupuesto: React.FC<{ durationInFrames: number; titulo?: string; items: { label: string; price: string }[]; total: string; nota?: string; src?: string }> = ({ durationInFrames, titulo = "PRESUPUESTO", items, total, nota, src }) => {
  const op = useFade(durationInFrames); const f = useCurrentFrame();
  const sh = useSpring(0, 20);
  const circ = interpolate(f, [24 + items.length * 6, 50 + items.length * 6], [0, 1], clamp);
  return <AbsoluteFill style={{ background: "#1b1a18", opacity: op, overflow: "hidden" }}>
    {src && <Img src={src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(10px) brightness(0.45)" }} />}
    <div style={{ position: "absolute", left: "50%", top: 70, width: 900, marginLeft: -450, height: 940, background: "#FBFAF6", transform: `translateY(${(1 - sh) * 400}px) rotate(${-2.5 + sh * 0.5}deg)`, boxShadow: "0 40px 90px rgba(0,0,0,0.55)", padding: "70px 80px", boxSizing: "border-box", fontFamily: SANS, color: INK }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "3px solid #2B2721", paddingBottom: 18 }}>
        <div style={{ font: `800 50px ${SANS}`, letterSpacing: 3 }}>{titulo}</div>
        <div style={{ font: `500 22px ${SANS}`, color: "#8a8378" }}>N.º 0347</div>
      </div>
      {items.map((it, i) => {
        const a = interpolate(f, [14 + i * 6, 22 + i * 6], [0, 1], clamp);
        return <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "22px 0", borderBottom: "1px dashed #cfc8bb", font: `500 34px ${SANS}`, opacity: a, transform: `translateX(${(1 - a) * 20}px)` }}>
          <span>{it.label}</span><span style={{ fontWeight: 700 }}>{it.price}</span>
        </div>;
      })}
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", marginTop: 34, font: `800 46px ${SANS}` }}>
        <span>TOTAL</span><span style={{ position: "relative" }}>{total}
          <svg width="330" height="150" viewBox="0 0 330 150" style={{ position: "absolute", left: -80, top: -48, overflow: "visible" }}>
            <path d="M40 80 C 30 20, 290 10, 305 70 C 318 125, 60 140, 30 95 C 20 75, 60 40, 120 35" fill="none" stroke={RED} strokeWidth="7" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - circ} />
          </svg>
        </span>
      </div>
      {nota && <div style={{ position: "absolute", right: 70, bottom: 70, font: `700 56px ${HAND}`, color: RED, transform: `rotate(-6deg) scale(${useSpring(60 + items.length * 6, 10)})` }}>{nota}</div>}
    </div>
  </AbsoluteFill>;
};

/* ───────── DatoLateral (overlay): dato grande al costado del presentador, con un ícono dibujado ───────── */
const ICONOS: Record<string, (k: number) => React.ReactNode> = {
  varilla: (k) => <svg width="420" height="90" viewBox="0 0 420 90"><rect x="10" y="30" width={400} height={30} rx="15" fill={`rgb(${120 + k * 70},${90 - k * 20},${60 - k * 30})`} transform={`scale(1 ${1 + k * 0.6})`} style={{ transformOrigin: "50% 45px" }} />{Array.from({ length: 13 }).map((_, i) => <rect key={i} x={22 + i * 30} y="24" width="8" height="42" rx="3" fill="rgba(0,0,0,0.25)" transform={`rotate(25 ${26 + i * 30} 45)`} />)}</svg>,
  gota: () => <svg width="120" height="150" viewBox="0 0 120 150"><path d="M60 8 C 60 8, 12 70, 12 98 a48 48 0 0 0 96 0 C108 70, 60 8, 60 8Z" fill="#5EB3E6" /><ellipse cx="42" cy="96" rx="10" ry="18" fill="rgba(255,255,255,0.5)" /></svg>,
  balde: () => <svg width="150" height="150" viewBox="0 0 150 150"><path d="M25 40 L125 40 L113 140 L37 140Z" fill="#E8E4DA" stroke="#9a9488" strokeWidth="4" /><rect x="40" y="70" width="70" height="36" fill={RED} /><path d="M25 40 C 25 0, 125 0, 125 40" fill="none" stroke="#777" strokeWidth="5" /></svg>,
};
export const DatoLateral: React.FC<{ durationInFrames: number; kicker?: string; valor: string; texto: string; icono?: string; lado?: "der" | "izq" }> = ({ durationInFrames, kicker, valor, texto, icono, lado = "der" }) => {
  const op = useFade(durationInFrames, 8); const s = useSpring(0, 15); const f = useCurrentFrame();
  const k = interpolate(f, [20, 70], [0, 1], clamp);
  const pos: React.CSSProperties = lado === "der" ? { right: 80 } : { left: 80 };
  return <AbsoluteFill style={{ opacity: op }}>
    <div style={{ position: "absolute", top: 0, bottom: 0, width: 900, ...(lado === "der" ? { right: 0, background: "linear-gradient(90deg, transparent, rgba(8,14,16,0.82) 45%)" } : { left: 0, background: "linear-gradient(270deg, transparent, rgba(8,14,16,0.82) 45%)" }) }} />
    <div style={{ position: "absolute", ...pos, top: 260, width: 560, textAlign: "center", transform: `translateY(${(1 - s) * 40}px)`, opacity: s }}>
      {kicker && <div style={{ font: `600 24px ${SERIF}`, letterSpacing: 6, textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: 26 }}>{kicker}</div>}
      {icono && ICONOS[icono] && <div style={{ display: "flex", justifyContent: "center", marginBottom: 24, transform: "scale(1.1)" }}>{ICONOS[icono](k)}</div>}
      <div style={{ font: `600 120px/1 ${SERIF}`, color: "#F4C27A" }}>{valor}</div>
      <div style={{ font: `500 40px/1.25 ${SERIF}`, color: "#fff", marginTop: 16 }}>{texto}</div>
    </div>
  </AbsoluteFill>;
};

/* ───────── CorteLosa: corte de la losa. modo "esponja" (el agua entra y oxida el hierro) | "escudo" (poros sellados, el agua perla) ───────── */
export const CorteLosa: React.FC<{ durationInFrames: number; modo?: "esponja" | "escudo"; title?: string; etiquetas?: string[] }> = ({ durationInFrames, modo = "esponja", title, etiquetas }) => {
  const op = useFade(durationInFrames); const f = useCurrentFrame();
  const W = 1600, top = 380, H = 330, x0 = 160;
  const t = f / 30;
  const rust = modo === "esponja" ? interpolate(f, [70, 200], [0, 1], clamp) : 0;
  const seal = modo === "escudo" ? interpolate(f, [15, 90], [0, 1], clamp) : 0;
  // poros deterministas
  const pores = Array.from({ length: 46 }).map((_, i) => { const r = Math.sin(i * 12.9898) * 43758.5453; const a = r - Math.floor(r); const r2 = Math.sin(i * 78.233) * 12345.678; const b = r2 - Math.floor(r2); return { x: x0 + 30 + a * (W - 60), y: top + 20 + b * (H - 120), w: 6 + (i % 4) * 3, h: 40 + (i % 5) * 18 }; });
  const drops = Array.from({ length: 16 }).map((_, i) => ({ x: x0 + 60 + i * 95, ph: (i * 0.37) % 1 }));
  const crack = modo === "esponja" ? interpolate(f, [150, 230], [0, 1], clamp) : 0;
  return <AbsoluteFill style={{ background: "linear-gradient(#DCEAF3, #F4F7F8 45%)", opacity: op, fontFamily: SANS }}>
    {title && <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center", font: `700 58px ${SANS}`, color: "#1F2A30" }}>{title}</div>}
    <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
      {/* lluvia */}
      {drops.map((d, i) => { const p = (t * 0.9 + d.ph) % 1; const y = 180 + p * (top - 180); return modo === "escudo" && p > 0.92 ? null : <ellipse key={i} cx={d.x} cy={y} rx="7" ry="13" fill="#4F9FD6" opacity={0.85} />; })}
      {/* losa */}
      <rect x={x0} y={top} width={W} height={H} rx="10" fill="#B9B5AC" />
      <rect x={x0} y={top} width={W} height={H} rx="10" fill="url(#grain)" opacity="0.35" />
      <defs><pattern id="grain" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="3" cy="4" r="2" fill="#8d897f" /><circle cx="10" cy="11" r="1.5" fill="#d2cec6" /></pattern></defs>
      {/* poros: con agua (esponja) o con el gel de vidrio (escudo) */}
      {pores.map((p, i) => { const fill = modo === "escudo" ? interpolate(seal, [i / 60, i / 60 + 0.3], [0, 1], clamp) : interpolate(f, [10 + i * 2, 60 + i * 2], [0, 1], clamp);
        return <g key={i}><rect x={p.x} y={p.y} width={p.w} height={p.h} rx={p.w / 2} fill="#6f6b63" /><rect x={p.x} y={p.y} width={p.w} height={p.h * fill} rx={p.w / 2} fill={modo === "escudo" ? "#BFE8F2" : "#3E8FD0"} opacity={modo === "escudo" ? 0.95 : 0.9} /></g>; })}
      {/* hierros */}
      {[0, 1].map((r) => <g key={r}>{Array.from({ length: 7 }).map((_, i) => { const cx = x0 + 150 + i * 220, cy = top + H - 80 - r * 0; const R = 22 + rust * (r === 0 ? 14 : 0) * (i % 2 ? 1 : 0.7); return <g key={i}>{rust > 0 && <circle cx={cx} cy={cy} r={R + 14 * rust} fill="#B5651D" opacity={0.25 * rust} />}<circle cx={cx} cy={cy} r={R} fill={`rgb(${90 + rust * 100},${90 - rust * 20},${95 - rust * 60})`} stroke="#3a3a3a" strokeWidth="3" /></g>; })}</g>)}
      {/* grieta */}
      {crack > 0 && <path d={`M ${x0 + 820} ${top + H} l -20 -60 l 30 -50 l -25 -70 l 20 -60 l -10 -${90 * crack}`} stroke="#3b3631" strokeWidth="6" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - crack} />}
      {/* escudo: gotas perladas arriba */}
      {modo === "escudo" && Array.from({ length: 11 }).map((_, i) => <ellipse key={i} cx={x0 + 90 + i * 140} cy={top - 12} rx={18 * seal} ry={12 * seal} fill="#5EB3E6" stroke="#fff" strokeWidth="3" />)}
    </svg>
    {(etiquetas || []).map((e, i) => { const a = interpolate(f, [40 + i * 40, 55 + i * 40], [0, 1], clamp); const ys = [top - 120, top + H / 2 - 20, top + H + 40]; return <div key={i} style={{ position: "absolute", left: 140 + i * 520, top: ys[i % 3], background: "#1F2A30", color: "#fff", padding: "14px 24px", borderRadius: 12, font: `700 32px ${SANS}`, opacity: a, transform: `translateY(${(1 - a) * 16}px)` }}>{e}</div>; })}
  </AbsoluteFill>;
};
