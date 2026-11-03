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

/* ───────── CorteLosa: corte de la losa vista de costado (techo arriba, cielorraso abajo).
   modo "esponja": la lluvia entra por los poros, el hierro se oxida y se hincha, aparece la grieta y la mancha en el cielorraso.
   modo "escudo": los poros se llenan de gel de vidrio, el agua queda arriba en gotitas y el cielorraso queda seco. ───────── */
export const CorteLosa: React.FC<{ durationInFrames: number; modo?: "esponja" | "escudo"; title?: string; etiquetas?: string[] }> = ({ durationInFrames, modo = "esponja", title, etiquetas }) => {
  const op = useFade(durationInFrames); const f = useCurrentFrame();
  const esp = modo === "esponja";
  const x0 = 120, W = 1680, top = 330, H = 470;
  const t = f / 30;
  const water = esp ? interpolate(f, [10, 110], [0, 1], clamp) : 0;
  const rust = esp ? interpolate(f, [80, 190], [0, 1], clamp) : 0;
  const crack = esp ? interpolate(f, [150, 230], [0, 1], clamp) : 0;
  const seal = esp ? 0 : interpolate(f, [10, 100], [0, 1], clamp);
  const grow = interpolate(f, [0, 18], [0.92, 1], clamp);
  // capilares deterministas: bajan desde la superficie, con quiebres (no son rayitas sueltas)
  const caps = Array.from({ length: 26 }).map((_, i) => {
    const rnd = (k: number) => { const r = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return r - Math.floor(r); };
    const x = x0 + 40 + (i + rnd(1) * 0.8) * ((W - 80) / 26);
    const len = 170 + rnd(2) * 200;
    const pts: [number, number][] = [[x, top]];
    for (let k = 1; k <= 5; k++) pts.push([x + (rnd(k + 3) - 0.5) * 34, top + (len * k) / 5]);
    return { pts, len, w: 7 + Math.round(rnd(9) * 5) };
  });
  const bars = Array.from({ length: 7 }).map((_, i) => ({ cx: x0 + 140 + i * 233, cy: top + H - 95 }));
  const drops = Array.from({ length: 18 }).map((_, i) => ({ x: x0 + 50 + i * 92, ph: (i * 0.37) % 1 }));
  const defs = esp ? ["Poros: el agua entra", "El hierro se oxida y se hincha ×7", "Mancha en el cielorraso"] : ["Gel de vidrio adentro de los poros", "El agua queda arriba", "Cielorraso seco"];
  const labels = etiquetas && etiquetas.length ? etiquetas : defs;
  const labelPos = [{ left: 150, top: top - 150 }, esp ? { left: 1080, top: top + H - 300 } : { left: 1250, top: top - 150 }, { left: 1120, top: top + H + 70 }];
  const labelAt = [40, 120, 200].map((d) => (esp ? d : d * 0.6));
  return <AbsoluteFill style={{ background: "linear-gradient(#D7E8F3, #EEF3F6 30%, #F7F7F5)", opacity: op, fontFamily: SANS }}>
    {title && <div style={{ position: "absolute", top: 56, width: "100%", textAlign: "center", font: `700 60px ${SERIF}`, color: "#1F2A30" }}>{title}</div>}
    <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, transform: `scale(${grow})`, transformOrigin: "50% 55%" }}>
      <defs>
        <pattern id="cl_grain" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="4" cy="5" r="3" fill="#8f8a80" /><circle cx="15" cy="14" r="2.2" fill="#d6d1c8" /><circle cx="18" cy="4" r="1.6" fill="#7c776e" /></pattern>
        <linearGradient id="cl_glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F4FDFF" /><stop offset="1" stopColor="#9FD8EA" /></linearGradient>
        <radialGradient id="cl_stain"><stop offset="0" stopColor="#8a6a3c" stopOpacity="0.75" /><stop offset="1" stopColor="#8a6a3c" stopOpacity="0" /></radialGradient>
      </defs>
      {/* lluvia */}
      {drops.map((d, i) => { const p = (t * 0.85 + d.ph) % 1; const y = 190 + p * (top - 200); return <ellipse key={i} cx={d.x} cy={y} rx="6" ry="14" fill="#4F9FD6" opacity={0.8} />; })}
      {/* losa */}
      <rect x={x0} y={top} width={W} height={H} rx="8" fill="#BDB8AE" />
      <rect x={x0} y={top} width={W} height={H} rx="8" fill="url(#cl_grain)" opacity="0.55" />
      <rect x={x0} y={top} width={W} height="10" fill="#a8a398" />
      {/* capilares */}
      {caps.map((c, i) => {
        const d = c.pts.map(([x, y], k) => `${k ? "L" : "M"} ${x} ${y}`).join(" ");
        const fill = esp ? interpolate(water, [i / 40, i / 40 + 0.45], [0, 1], clamp) : interpolate(seal, [i / 40, i / 40 + 0.4], [0, 1], clamp);
        return <g key={i}>
          <path d={d} stroke="#6d695f" strokeWidth={c.w} strokeLinecap="round" fill="none" />
          <path d={d} stroke={esp ? "#2F86CF" : "url(#cl_glass)"} strokeWidth={c.w - 2} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - fill} />
          {!esp && fill > 0.98 && <circle cx={c.pts[0][0]} cy={top + 4} r={c.w * 0.7} fill="#fff" opacity={0.9} />}
        </g>;
      })}
      {/* hierros (corte) */}
      {bars.map((b, i) => { const R = 26 + rust * 16; return <g key={i}>
        {rust > 0 && <circle cx={b.cx} cy={b.cy} r={R + 26 * rust} fill="#C26A1E" opacity={0.28 * rust} />}
        <circle cx={b.cx} cy={b.cy} r={R} fill={esp ? `rgb(${95 + rust * 100},${95 - rust * 15},${100 - rust * 70})` : "#5d6166"} stroke="#2e2e2e" strokeWidth="4" />
        {!esp && <circle cx={b.cx - 8} cy={b.cy - 8} r="6" fill="#9aa0a6" />}
      </g>; })}
      {/* grieta desde el hierro hinchado hacia arriba */}
      {crack > 0 && <path d={`M ${bars[3].cx} ${bars[3].cy - 40} l -22 -70 l 30 -60 l -26 -80 l 18 -70 l -8 -${70}`} stroke="#2f2b27" strokeWidth="7" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - crack} />}
      {/* cielorraso */}
      <rect x={x0} y={top + H} width={W} height="34" fill="#FAFAF8" stroke="#dcdad4" />
      {esp && <ellipse cx={bars[3].cx} cy={top + H + 17} rx={260 * rust} ry={30 * rust} fill="url(#cl_stain)" />}
      {esp && rust > 0.5 && [0, 1, 2].map((k) => { const p = (t * 0.7 + k * 0.33) % 1; return <ellipse key={k} cx={bars[3].cx - 60 + k * 60} cy={top + H + 40 + p * 120} rx="7" ry="11" fill="#4F9FD6" opacity={1 - p} />; })}
      {/* escudo: gotas perladas sobre la superficie */}
      {!esp && Array.from({ length: 13 }).map((_, i) => <ellipse key={i} cx={x0 + 70 + i * 128} cy={top - 13} rx={20 * seal} ry={13 * seal} fill="#5EB3E6" stroke="#fff" strokeWidth="3" />)}
    </svg>
    {labels.slice(0, 3).map((e, i) => { const a = interpolate(f, [labelAt[i], labelAt[i] + 14], [0, 1], clamp); return <div key={i} style={{ position: "absolute", ...labelPos[i], background: i === 1 && esp ? "#B5651D" : "#1F2A30", color: "#fff", padding: "14px 26px", borderRadius: 14, font: `700 34px ${SANS}`, opacity: a, transform: `translateY(${(1 - a) * 16}px)`, boxShadow: "0 10px 30px rgba(0,0,0,0.18)" }}>{e}</div>; })}
  </AbsoluteFill>;
};

/* ───────── GuiaPromo: llamado a la guía (la tapa/mockup real entra de costado, título serif y 3 puntos que aparecen de a uno).
   El QR lo pone el overlay QRTag aparte. ───────── */
export const GuiaPromo: React.FC<{ durationInFrames: number; src: string; eyebrow?: string; title: string; puntos?: string[]; foot?: string; qr?: string }> = ({ durationInFrames, src, qr, eyebrow = "LA BIBLIOTECA DEL MAESTRO", title, puntos = [], foot = "Link en la descripción y en el comentario fijado" }) => {
  const op = useFade(durationInFrames); const f = useCurrentFrame();
  const im = useSpring(0, 18); const tx = useSpring(8, 18);
  return <AbsoluteFill style={{ background: `radial-gradient(circle at 70% 45%, ${TEAL2}, ${TEAL} 72%)`, opacity: op, overflow: "hidden" }}>
    <div style={{ position: "absolute", right: 60, top: 140, width: 1000, height: 800, transform: `translateX(${(1 - im) * 160}px) scale(${1 + f / 6000})`, opacity: im }}>
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.55))" }} />
    </div>
    <div style={{ position: "absolute", left: 120, width: 760, top: 190, transform: `translateY(${(1 - tx) * 30}px)`, opacity: tx }}>
      <div style={{ font: `700 26px ${SANS}`, color: MINT, letterSpacing: 5, textTransform: "uppercase", marginBottom: 24 }}>— {eyebrow}</div>
      <div style={{ font: `600 74px/1.08 ${SERIF}`, color: "#fff" }}>{title}</div>
      <div style={{ marginTop: 40 }}>
        {puntos.slice(0, 4).map((p, i) => { const a = interpolate(f, [26 + i * 14, 38 + i * 14], [0, 1], clamp); return <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 22, opacity: a, transform: `translateX(${(1 - a) * -24}px)` }}>
          <div style={{ width: 40, height: 40, borderRadius: 99, background: MINT, color: TEAL, font: `800 26px ${SANS}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✓</div>
          <div style={{ font: `500 36px/1.25 ${SANS}`, color: "rgba(255,255,255,0.9)" }}>{p}</div>
        </div>; })}
      </div>
      <div style={{ marginTop: 34, display: "inline-block", background: "#E0835A", color: "#fff", padding: "16px 28px", borderRadius: 12, font: `700 30px ${SANS}`, opacity: interpolate(f, [70, 84], [0, 1], clamp) }}>{foot}</div>
      {qr && <div style={{ marginTop: 34, display: "flex", alignItems: "center", gap: 22, opacity: interpolate(f, [80, 94], [0, 1], clamp) }}>
        <div style={{ background: "#fff", padding: 12, borderRadius: 14 }}><Img src={qr} style={{ width: 150, height: 150, display: "block" }} /></div>
        <div style={{ font: `600 28px/1.3 ${SANS}`, color: "rgba(255,255,255,0.8)" }}>Escanea con la<br />cámara del celular</div>
      </div>}
    </div>
  </AbsoluteFill>;
};
