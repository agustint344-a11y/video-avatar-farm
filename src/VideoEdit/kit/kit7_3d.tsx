// kit7_3d.tsx — animaciones 3D (three.js) para los videos largos. Pantalla completa 1920x1080, todo determinístico (useCurrentFrame).
// MATEO: Pared3D (capas de la pared + humedad/moho/salitre/grieta) · Cano3D (caño en corte con sarro) · Circuito3D (enchufe → cable → foco con consumo)
// SALUD (Tombo/Elena/Alan): Vaso3D (vaso sanguíneo en corte: placa / azúcar / inflamación)
// TODOS: Barras3D (comparación de 2-5 valores con barras 3D)
// Etiquetas: HTML proyectado con la misma cámara (fuentes reales, nítidas).
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";
import { loadFont as loadStamp } from "@remotion/google-fonts/Anton";
import * as THREE from "three";
import { metal, paint, studioEnv } from "./real3d";
const { fontFamily: SANS } = loadSans();
const { fontFamily: STAMP } = loadStamp();

type V3 = [number, number, number];
type D = { durationInFrames: number };
type Cam = { p: V3; l: V3; fov: number };
type Tone = "dark" | "red" | "blue" | "yellow" | "green";
type Lbl = { at: V3; text: string; t0: number; tone?: Tone; side?: "l" | "r"; dy?: number };

const W = 1920, H = 1080;
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const sm = (x: number) => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const seeded = (s: number) => () => ((s = (s * 16807) % 2147483647) / 2147483647);
const TONE: Record<Tone, string> = { dark: "#1d2329", red: "#d63a2f", blue: "#1f6fd1", yellow: "#e8a512", green: "#1f9d5a" };

// órbita suave de cámara alrededor de `look` (a0→a1 en radianes, 0 = de frente)
const orbit = (t: number, o: { r: number; y: number; a0: number; a1: number; look: V3; fov: number; r1?: number }): Cam => {
  const k = Easing.inOut(Easing.cubic)(Math.min(1, Math.max(0, t)));
  const a = lerp(o.a0, o.a1, k), r = lerp(o.r, o.r1 ?? o.r, k);
  return { p: [o.look[0] + Math.sin(a) * r, o.y, o.look[2] + Math.cos(a) * r], l: o.look, fov: o.fov };
};

const project = (cam: Cam, at: V3) => {
  const c = new THREE.PerspectiveCamera(cam.fov, W / H, 0.05, 100);
  c.position.set(...cam.p); c.lookAt(...cam.l); c.updateMatrixWorld(); c.updateProjectionMatrix();
  const v = new THREE.Vector3(...at).project(c);
  return { x: ((v.x + 1) / 2) * W, y: ((1 - v.y) / 2) * H };
};

/* ─────────── escena base: entorno de estudio, sombras, cámara, título y etiquetas ─────────── */
const Env: React.FC = () => {
  const { gl, scene } = useThree();
  useMemo(() => {
    scene.environment = studioEnv(gl);
    gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.0;
    gl.shadowMap.enabled = true; gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.localClippingEnabled = true;
  }, [gl, scene]);
  return null;
};
const CamRig: React.FC<{ cam: Cam }> = ({ cam }) => {
  const { camera } = useThree();
  const c = camera as THREE.PerspectiveCamera;
  c.position.set(...cam.p); c.fov = cam.fov; c.aspect = W / H; c.near = 0.05; c.far = 100;
  c.lookAt(...cam.l); c.updateProjectionMatrix();
  return null;
};
const Lights: React.FC<{ floorY: number; size?: number }> = ({ floorY, size = 8 }) => (
  <>
    <ambientLight intensity={0.35} />
    <directionalLight position={[-5, 9, 7]} intensity={1.6} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
      shadow-camera-left={-size} shadow-camera-right={size} shadow-camera-top={size} shadow-camera-bottom={-size} shadow-bias={-0.0004} />
    <directionalLight position={[6, 4, -4]} intensity={0.45} color="#cfe6ff" />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, floorY, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <shadowMaterial opacity={0.22} />
    </mesh>
  </>
);

const Pill: React.FC<{ l: Lbl; cam: Cam; f: number; dur: number }> = ({ l, cam, f, dur }) => {
  const k = interpolate(f, [l.t0 * dur, l.t0 * dur + 12], [0, 1], { ...cl, easing: OUT });
  if (k <= 0) return null;
  const p = project(cam, l.at);
  const side = l.side ?? (p.x > W * 0.55 ? "r" : "l");
  const dx = side === "r" ? 70 : -70, dy = l.dy ?? -46;
  const col = TONE[l.tone ?? "dark"];
  return (
    <>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <line x1={p.x} y1={p.y} x2={p.x + dx * k} y2={p.y + dy * k} stroke={col} strokeWidth={4} strokeLinecap="round" />
        <circle cx={p.x} cy={p.y} r={9 * k} fill="#fff" stroke={col} strokeWidth={4} />
      </svg>
      <div style={{ position: "absolute", left: p.x + dx, top: p.y + dy, transform: `translate(${side === "r" ? "0" : "-100%"}, -50%) scale(${0.6 + 0.4 * k})`, transformOrigin: side === "r" ? "left center" : "right center", opacity: k,
        background: col, color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 40, padding: "12px 28px", borderRadius: 999, whiteSpace: "nowrap", boxShadow: "0 10px 30px rgba(0,0,0,.25)" }}>{l.text}</div>
    </>
  );
};

const Stage: React.FC<D & { cam: Cam; title: string; kicker?: string; note?: string; labels?: Lbl[]; hud?: React.ReactNode; floorY?: number; shadowSize?: number; children: React.ReactNode }> = ({ durationInFrames: dur, cam, title, kicker, note, labels = [], hud, floorY = 0, shadowSize, children }) => {
  const f = useCurrentFrame();
  const out = interpolate(f, [dur - 8, dur], [1, 0], cl);
  const inK = interpolate(f, [0, 16], [0, 1], { ...cl, easing: OUT });
  return (
    <AbsoluteFill style={{ opacity: out, background: "radial-gradient(ellipse at 50% 38%, #ffffff 0%, #eef0f2 55%, #d3d8dd 100%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: inK, transform: `scale(${0.96 + 0.04 * inK})` }}>
        <ThreeCanvas shadows width={W} height={H} gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }} camera={{ fov: cam.fov, position: cam.p }}>
          <Env />
          <CamRig cam={cam} />
          <Lights floorY={floorY} size={shadowSize} />
          {children}
        </ThreeCanvas>
      </AbsoluteFill>
      {labels.map((l, i) => <Pill key={i} l={l} cam={cam} f={f} dur={dur} />)}
      <div style={{ position: "absolute", left: 90, top: 70, opacity: inK, transform: `translateY(${(1 - inK) * -20}px)` }}>
        {kicker ? <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: TONE.red, textTransform: "uppercase" }}>{kicker}</div> : null}
        <div style={{ fontFamily: STAMP, fontSize: 92, lineHeight: 1.02, color: "#151a1f", maxWidth: 1100, textTransform: "uppercase" }}>{title}</div>
      </div>
      {note ? <div style={{ position: "absolute", left: 90, bottom: 70, maxWidth: 1000, fontFamily: SANS, fontWeight: 700, fontSize: 40, color: "#151a1f", background: "rgba(255,255,255,.85)", padding: "16px 28px", borderLeft: `10px solid ${TONE.red}`, borderRadius: 10,
        opacity: interpolate(f, [dur * 0.55, dur * 0.55 + 12], [0, 1], cl) }}>{note}</div> : null}
      {hud}
    </AbsoluteFill>
  );
};

// texturas de mancha dibujadas en canvas (con alfa), una por tipo de problema
const stainTex = (kind: string) => {
  const N = 512, c = document.createElement("canvas"); c.width = c.height = N;
  const x = c.getContext("2d")!; const r = seeded(kind.length * 977 + 13);
  if (kind === "humedad") {
    x.beginPath(); x.moveTo(0, N);
    for (let i = 0; i <= 40; i++) x.lineTo((i / 40) * N, N * 0.08 + Math.sin(i * 0.9) * 14 + r() * 26);
    x.lineTo(N, N); x.closePath();
    const g = x.createLinearGradient(0, 0, 0, N); g.addColorStop(0, "rgba(120,98,66,0.35)"); g.addColorStop(1, "rgba(92,78,58,0.75)");
    x.fillStyle = g; x.fill(); x.strokeStyle = "rgba(95,72,40,0.85)"; x.lineWidth = 7; x.stroke();
  } else if (kind === "moho") {
    for (let i = 0; i < 1400; i++) { const cx = N * (0.15 + 0.85 * Math.pow(r(), 0.6)), cy = N * Math.pow(r(), 1.6), rr = 1 + r() * 7;
      x.fillStyle = `rgba(${18 + r() * 25},${24 + r() * 30},${18 + r() * 20},${0.35 + r() * 0.55})`; x.beginPath(); x.arc(cx, cy, rr, 0, Math.PI * 2); x.fill(); }
  } else if (kind === "salitre") {
    for (let i = 0; i < 1800; i++) { const cx = r() * N, cy = N - N * 0.45 * Math.pow(r(), 1.4), rr = 1 + r() * 5;
      x.fillStyle = `rgba(255,255,255,${0.45 + r() * 0.5})`; x.beginPath(); x.arc(cx, cy, rr, 0, Math.PI * 2); x.fill(); }
  } else {
    x.strokeStyle = "rgba(25,22,20,0.95)"; x.lineCap = "round";
    const crack = (x0: number, y0: number, ang: number, len: number, w: number, d: number) => {
      let px = x0, py = y0; x.lineWidth = w; x.beginPath(); x.moveTo(px, py);
      for (let i = 0; i < 18; i++) { ang += (r() - 0.5) * 0.7; px += Math.cos(ang) * len / 18; py += Math.sin(ang) * len / 18; x.lineTo(px, py);
        if (d < 2 && r() < 0.12) { x.stroke(); crack(px, py, ang + (r() - 0.5) * 1.6, len * 0.4, w * 0.5, d + 1); x.lineWidth = w; x.beginPath(); x.moveTo(px, py); } }
      x.stroke();
    };
    crack(N * 0.15, N * 0.1, 0.9, N * 1.05, 6, 0);
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
};

/* ═════════════════ MATEO 1) PARED EN CORTE ═════════════════ */
const PROB: Record<string, { label: string; tone: Tone }> = {
  humedad: { label: "Humedad que sube", tone: "blue" }, moho: { label: "Moho", tone: "dark" }, salitre: { label: "Salitre", tone: "yellow" }, grieta: { label: "Grieta", tone: "red" },
};
export const Pared3D: React.FC<D & { title: string; problema?: "humedad" | "moho" | "salitre" | "grieta"; capas?: string[]; kicker?: string; note?: string; etiqueta?: string }> = ({ durationInFrames: dur, title, problema = "humedad", capas, kicker, note, etiqueta }) => {
  const f = useCurrentFrame(); const t = f / dur;
  const L = [capas?.[0] || "Ladrillo", capas?.[1] || "Revoque", capas?.[2] || "Pintura"];
  const grow = sm((t - 0.22) / 0.55);
  const wet = problema === "humedad" ? grow * 1.5 : problema === "salitre" ? grow * 0.8 : 0;
  const cam = orbit(t, { r: 8.2, r1: 7.4, y: 2.6, a0: -0.85, a1: -0.45, look: [0, 1.45, 0], fov: 36 });
  const bricks = useMemo(() => {
    const r = seeded(7); const out: { x: number; y: number; w: number; c: THREE.Color }[] = [];
    for (let row = 0; row < 11; row++) {
      const off = row % 2 ? 0.31 : 0;
      for (let x0 = -2 - off; x0 < 2; x0 += 0.62) {
        const a = Math.max(-2, x0), b = Math.min(2, x0 + 0.6); if (b - a < 0.08) continue;
        out.push({ x: (a + b) / 2, y: 0.14 + row * 0.27, w: b - a, c: new THREE.Color().setHSL(0.04 + r() * 0.02, 0.5 + r() * 0.15, 0.36 + r() * 0.08) });
      }
    }
    return out;
  }, []);
  const tex = useMemo(() => stainTex(problema), [problema]);
  const sh = problema === "humedad" ? 1.7 : problema === "salitre" ? 1.2 : problema === "moho" ? 1.6 : 2.6;
  const stainH = problema === "humedad" || problema === "salitre" ? sh * grow : sh;
  tex.repeat.set(1, problema === "humedad" || problema === "salitre" ? Math.max(0.001, grow) : 1);
  const stainOp = problema === "humedad" || problema === "salitre" ? 1 : grow;
  const drops = Array.from({ length: problema === "humedad" ? 14 : 0 }, (_, i) => {
    const ph = (i * 0.137 + t * 1.6) % 1; return { y: ph * Math.max(0.2, 1.5 * grow), z: -0.45 + ((i * 37) % 10) / 13, o: Math.sin(ph * Math.PI) };
  });
  const labels: Lbl[] = [
    { at: [-2, 2.6, -0.1], text: L[0], t0: 0.06, side: "l" },
    { at: [-1.6, 2.05, 0.42], text: L[1], t0: 0.12, side: "l" },
    { at: [-1.2, 1.5, 0.555], text: L[2], t0: 0.18, side: "l" },
    { at: problema === "moho" ? [1.2, 2.5, 0.56] : problema === "grieta" ? [0.6, 1.6, 0.56] : [0.7, Math.max(0.3, stainH * 0.7), 0.56], text: etiqueta || PROB[problema].label, t0: 0.42, tone: PROB[problema].tone, side: "r" },
  ];
  return (
    <Stage durationInFrames={dur} cam={cam} title={title} kicker={kicker} note={note} labels={labels} floorY={0}>
      <mesh position={[0, 1.5, -0.1]} receiveShadow castShadow><boxGeometry args={[3.98, 2.98, 0.76]} /><meshStandardMaterial color="#b9b1a2" roughness={0.95} /></mesh>
      {bricks.map((b, i) => {
        const w = wet > 0 ? sm((wet - b.y) / 0.5 + 0.5) : 0;
        return (
          <mesh key={i} position={[b.x, b.y, -0.1]} castShadow receiveShadow>
            <boxGeometry args={[b.w - 0.03, 0.24, 0.8]} />
            <meshStandardMaterial color={b.c.clone().lerp(new THREE.Color("#3d2418"), w * 0.55)} roughness={lerp(0.9, 0.45, w)} />
          </mesh>
        );
      })}
      <mesh position={[0.2, 1.5, 0.41]} castShadow receiveShadow><boxGeometry args={[3.6, 3, 0.22]} /><meshStandardMaterial color={new THREE.Color("#d8d2c4").lerp(new THREE.Color("#8d826e"), Math.min(1, wet) * 0.35)} roughness={0.95} /></mesh>
      <mesh position={[0.4, 1.5, 0.535]} castShadow receiveShadow><boxGeometry args={[3.2, 3, 0.03]} /><meshPhysicalMaterial color="#f4f2ec" roughness={0.6} clearcoat={0.2} /></mesh>
      <mesh position={[0.4, (problema === "moho" ? 3 - sh / 2 : problema === "grieta" ? 1.5 : stainH / 2), 0.552]}>
        <planeGeometry args={[3.2, Math.max(0.001, stainH)]} />
        <meshStandardMaterial map={tex} transparent opacity={stainOp} roughness={0.8} depthWrite={false} />
      </mesh>
      {drops.map((d, i) => (
        <mesh key={i} position={[-2.02, d.y + 0.05, d.z]}><sphereGeometry args={[0.045, 12, 12]} /><meshStandardMaterial color="#3aa0ff" emissive="#1f6fd1" emissiveIntensity={0.6} transparent opacity={d.o} /></mesh>
      ))}
      <mesh position={[0, -0.04, -0.1]} receiveShadow><boxGeometry args={[4.6, 0.08, 1.8]} /><meshStandardMaterial color="#9c9a95" roughness={0.9} /></mesh>
    </Stage>
  );
};

/* ═════════════════ MATEO 2) CAÑO EN CORTE CON SARRO ═════════════════ */
export const Cano3D: React.FC<D & { title: string; obstruccion?: number; kicker?: string; note?: string; etiqueta?: string; fluido?: string }> = ({ durationInFrames: dur, title, obstruccion = 60, kicker, note, etiqueta, fluido }) => {
  const f = useCurrentFrame(); const t = f / dur;
  const pct = Math.min(0.92, Math.max(0, obstruccion / 100));
  const grow = sm((t - 0.25) / 0.5);
  const R = 0.62, Lp = 6.4, rin = R * 0.93 * Math.sqrt(1 - pct * grow);
  const clip = useMemo(() => [new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)], []);
  const cam = orbit(t, { r: 7.8, r1: 7.0, y: 2.1, a0: 0.55, a1: 0.2, look: [0, 0.85, 0], fov: 38 });
  const sarro = useMemo(() => {
    const q = Math.round(rin * 200) / 200;
    const pts = [new THREE.Vector2(q, -Lp / 2), new THREE.Vector2(R * 0.93, -Lp / 2), new THREE.Vector2(R * 0.93, Lp / 2), new THREE.Vector2(q, Lp / 2), new THREE.Vector2(q, -Lp / 2)];
    const g = new THREE.LatheGeometry(pts, 64); g.rotateZ(Math.PI / 2); return g;
  }, [Math.round(rin * 200)]);
  const sarroMat = useMemo(() => { const m = paint("#d9ccb0", 0.95); m.clearcoat = 0; m.side = THREE.DoubleSide; m.clippingPlanes = clip; return m; }, [clip]);
  const glass = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#dfe9ee", roughness: 0.12, metalness: 0, transparent: true, opacity: 0.32, side: THREE.DoubleSide, clippingPlanes: clip, clearcoat: 1 }), [clip]);
  const ring = useMemo(() => metal("#b8bcc2", 0.3), []);
  const speed = lerp(1.6, 0.35, pct * grow);
  const parts = Array.from({ length: 70 }, (_, i) => {
    const r = seeded(i * 91 + 7); const a = Math.PI * (0.5 + r()), rr = Math.sqrt(r()) * rin * 0.85;
    const x = (((r() + t * speed * (0.8 + r() * 0.4)) % 1) - 0.5) * Lp;
    return { x, y: Math.cos(a) * rr, z: -Math.abs(Math.sin(a) * rr) };
  });
  const flow = Math.round((1 - pct * grow) * 100);
  const labels: Lbl[] = [
    { at: [-2.4, 0.75 + R * 0.95, -0.2], text: etiqueta || "Sarro", t0: 0.35, tone: "yellow", side: "l", dy: -70 },
    { at: [1.2, 0.75, -0.05], text: fluido || "Agua", t0: 0.12, tone: "blue", side: "r", dy: -110 },
  ];
  const hud = (
    <div style={{ position: "absolute", right: 90, bottom: 80, background: "#151a1f", color: "#fff", borderRadius: 18, padding: "22px 34px", fontFamily: SANS, opacity: interpolate(f, [dur * 0.3, dur * 0.3 + 12], [0, 1], cl) }}>
      <div style={{ fontWeight: 700, fontSize: 28, opacity: 0.75 }}>Paso del agua</div>
      <div style={{ fontFamily: STAMP, fontSize: 110, lineHeight: 1, color: flow < 60 ? "#ff6b5e" : "#7fd3ff" }}>{flow}%</div>
    </div>
  );
  return (
    <Stage durationInFrames={dur} cam={cam} title={title} kicker={kicker} note={note} labels={labels} hud={hud} floorY={0}>
      <group position={[0, 0.75, 0]}>
        <mesh material={glass} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[R, R, Lp, 64, 1, true]} /></mesh>
        <mesh material={sarroMat} geometry={sarro} castShadow />
        <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[rin * 0.98, rin * 0.98, Lp, 48, 1, true]} /><meshStandardMaterial color="#5bb6ff" transparent opacity={0.28} side={THREE.DoubleSide} clippingPlanes={clip} /></mesh>
        {parts.map((p, i) => <mesh key={i} position={[p.x, p.y, p.z]}><sphereGeometry args={[0.04, 10, 10]} /><meshStandardMaterial color="#9fdcff" emissive="#2d8cff" emissiveIntensity={0.5} /></mesh>)}
        {[-Lp / 2, Lp / 2].map((x, i) => <mesh key={i} material={ring} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[R * 1.12, R * 1.12, 0.36, 48]} /></mesh>)}
      </group>
      {[-2.2, 2.2].map((x, i) => <mesh key={i} position={[x, 0.05, 0]} castShadow><boxGeometry args={[0.22, 0.1, 0.9]} /><meshStandardMaterial color="#6d7177" roughness={0.6} /></mesh>)}
    </Stage>
  );
};

/* ═════════════════ MATEO 3) CIRCUITO: enchufe → cable → foco, con consumo ═════════════════ */
export const Circuito3D: React.FC<D & { title: string; watts?: number; aparato?: string; kicker?: string; note?: string; unidad?: string }> = ({ durationInFrames: dur, title, watts = 9, aparato, kicker, note, unidad = "W" }) => {
  const f = useCurrentFrame(); const t = f / dur;
  const on = sm((t - 0.2) / 0.2);
  const cam = orbit(t, { r: 8, r1: 7.2, y: 2.4, a0: -0.35, a1: 0.25, look: [0, 1.3, 0], fov: 38 });
  const curve = useMemo(() => new THREE.CatmullRomCurve3([new THREE.Vector3(-2.9, 1.0, 0.2), new THREE.Vector3(-2.2, 0.15, 0.6), new THREE.Vector3(-0.4, 0.06, 0.9), new THREE.Vector3(1.4, 0.08, 0.4), new THREE.Vector3(2.4, 0.2, 0), new THREE.Vector3(2.5, 0.9, 0)]), []);
  const tube = useMemo(() => new THREE.TubeGeometry(curve, 160, 0.07, 16, false), [curve]);
  const base = useMemo(() => metal("#c9b37a", 0.3), []);
  const n = Math.round(lerp(16, 46, Math.min(1, watts / 1500)));
  const sp = lerp(0.25, 0.9, Math.min(1, watts / 1500));
  const shown = Math.round(interpolate(f, [dur * 0.3, dur * 0.7], [0, watts], { ...cl, easing: OUT }));
  const labels: Lbl[] = [{ at: [-2.9, 1.45, 0.3], text: "Enchufe", t0: 0.08, side: "l" }, { at: [2.5, 2.35, 0], text: aparato || "Foco", t0: 0.3, tone: "yellow", side: "r" }];
  const hud = (
    <div style={{ position: "absolute", right: 90, bottom: 80, background: "#151a1f", color: "#fff", borderRadius: 18, padding: "22px 34px", fontFamily: SANS, opacity: interpolate(f, [dur * 0.25, dur * 0.25 + 12], [0, 1], cl) }}>
      <div style={{ fontWeight: 700, fontSize: 28, opacity: 0.75 }}>Consumo</div>
      <div style={{ fontFamily: STAMP, fontSize: 110, lineHeight: 1, color: "#ffd43b" }}>{shown.toLocaleString("es")} {unidad}</div>
    </div>
  );
  return (
    <Stage durationInFrames={dur} cam={cam} title={title} kicker={kicker} note={note} labels={labels} hud={hud} floorY={0}>
      <mesh position={[-2.95, 1.2, -0.25]} castShadow receiveShadow><boxGeometry args={[1.0, 1.4, 0.5]} /><meshPhysicalMaterial color="#f3f3f1" roughness={0.4} clearcoat={0.6} /></mesh>
      {[-0.15, 0.15].map((x, i) => <mesh key={i} position={[-2.95 + x, 1.25, 0.01]}><boxGeometry args={[0.06, 0.2, 0.02]} /><meshStandardMaterial color="#222" /></mesh>)}
      <mesh geometry={tube} castShadow><meshPhysicalMaterial color="#1c1f22" roughness={0.45} clearcoat={0.4} /></mesh>
      {Array.from({ length: n }, (_, i) => {
        const u = (i / n + t * sp) % 1; const p = curve.getPointAt(u);
        return <mesh key={i} position={[p.x, p.y + 0.11, p.z]} scale={on}><sphereGeometry args={[0.05, 10, 10]} /><meshStandardMaterial color="#fff3a0" emissive="#ffc400" emissiveIntensity={2.2} toneMapped={false} /></mesh>;
      })}
      <group position={[2.5, 0.9, 0]}>
        <mesh material={base} castShadow><cylinderGeometry args={[0.28, 0.24, 0.5, 40]} /></mesh>
        {[0, 1, 2].map((i) => <mesh key={i} material={base} position={[0, -0.15 + i * 0.14, 0]}><torusGeometry args={[0.27, 0.025, 10, 40]} /></mesh>)}
        <mesh position={[0, 0.85, 0]} castShadow>
          <sphereGeometry args={[0.75, 48, 48]} />
          <meshPhysicalMaterial color={new THREE.Color("#ffffff").lerp(new THREE.Color("#fff1c4"), on)} emissive="#ffd27a" emissiveIntensity={on * 1.6} roughness={0.25} transparent opacity={0.92} clearcoat={1} />
        </mesh>
        <mesh position={[0, 0.35, 0]}><cylinderGeometry args={[0.3, 0.42, 0.3, 40]} /><meshPhysicalMaterial color="#f5f5f5" roughness={0.3} emissive="#ffd27a" emissiveIntensity={on * 0.6} /></mesh>
        <pointLight position={[0, 0.9, 0.9]} intensity={on * 6} distance={7} color="#ffd890" />
      </group>
    </Stage>
  );
};

/* ═════════════════ SALUD) VASO SANGUÍNEO EN CORTE ═════════════════ */
export const Vaso3D: React.FC<D & { title: string; problema?: "placa" | "azucar" | "inflamacion" | "sano"; kicker?: string; note?: string; etiqueta?: string }> = ({ durationInFrames: dur, title, problema = "placa", kicker, note, etiqueta }) => {
  const f = useCurrentFrame(); const t = f / dur;
  const grow = problema === "sano" ? 0 : sm((t - 0.22) / 0.5);
  const R = 1.05, Lv = 8;
  const clip = useMemo(() => [new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)], []);
  const cam = orbit(t, { r: 6.9, r1: 6.1, y: 2.0, a0: 0.5, a1: 0.12, look: [0, 1.65, -0.3], fov: 40 });
  const wall = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#c9584f", roughness: 0.45, sheen: 1, sheenColor: new THREE.Color("#ffb3a8"), clearcoat: 0.6, side: THREE.DoubleSide, clippingPlanes: clip }), [clip]);
  wall.emissive.set(problema === "inflamacion" ? "#ff3b1f" : "#000000"); wall.emissiveIntensity = problema === "inflamacion" ? grow * (0.25 + 0.15 * Math.sin(f / 5)) : 0;
  const cellGeo = useMemo(() => {
    const pts: THREE.Vector2[] = []; for (let i = 0; i <= 24; i++) { const a = (i / 24) * Math.PI; const x = Math.sin(a) * 0.2; const y = Math.cos(a) * (0.05 + 0.06 * Math.pow(Math.sin(a), 2) - 0.03 * Math.pow(Math.cos(a), 8)) ; pts.push(new THREE.Vector2(x, y)); }
    return new THREE.LatheGeometry(pts, 40);
  }, []);
  const cellMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#b3121b", roughness: 0.35, clearcoat: 0.7, sheen: 0.6, sheenColor: new THREE.Color("#ff6a5a") }), []);
  if (problema === "azucar") cellMat.color.set(new THREE.Color("#b3121b").lerp(new THREE.Color("#7a3a20"), grow * 0.6));
  const narrow = problema === "placa" ? grow * 0.55 : 0;
  const speed = lerp(0.9, 0.35, narrow * 1.4);
  const cells = Array.from({ length: 46 }, (_, i) => {
    const r = seeded(i * 53 + 11); const a = Math.PI * (0.5 + r()), rr = Math.sqrt(r()) * R * 0.78;
    const x = (((r() + t * speed * (0.8 + r() * 0.4)) % 1) - 0.5) * Lv;
    const squeeze = 1 - narrow * Math.exp(-x * x * 0.8);
    return { p: [x, Math.cos(a) * rr * squeeze, -Math.abs(Math.sin(a) * rr * squeeze) - 0.05] as V3, rot: [r() * 6 + t * 3, r() * 6, r() * 6 + t * 2] as V3 };
  });
  const plaque = useMemo(() => { const r = seeded(5); return Array.from({ length: 22 }, () => { const x = (r() - 0.5) * 2.4; const a = Math.PI * (0.5 + r()); return { x, a, s: 0.25 + r() * 0.25 }; }); }, []);
  const sugar = Array.from({ length: problema === "azucar" ? 60 : 0 }, (_, i) => {
    const r = seeded(i * 17 + 3); const a = Math.PI * (0.5 + r()), rr = Math.sqrt(r()) * R * 0.85;
    const x = (((r() + t * 0.5) % 1) - 0.5) * Lv; return { p: [x, Math.cos(a) * rr, -Math.abs(Math.sin(a) * rr) - 0.05] as V3, s: grow };
  });
  const TXT: Record<string, string> = { placa: "Placa de grasa", azucar: "Exceso de azúcar", inflamacion: "Inflamación", sano: "Flujo normal" };
  const labels: Lbl[] = [
    { at: [-2.6, 1.25 + R, -0.4], text: "Arteria", t0: 0.06, side: "l", dy: -60 },
    { at: [-1.6, 1.25, -0.4], text: "Glóbulos rojos", t0: 0.14, tone: "red", side: "l", dy: 60 },
    ...(problema !== "sano" ? [{ at: (problema === "placa" ? [0.4, 1.25 - R * 0.75, -0.5] : [1.2, 1.5, -0.4]) as V3, text: etiqueta || TXT[problema], t0: 0.45, tone: (problema === "placa" ? "yellow" : "red") as Tone, side: "r" as const, dy: problema === "placa" ? 70 : -70 }] : []),
  ];
  return (
    <Stage durationInFrames={dur} cam={cam} title={title} kicker={kicker} note={note} labels={labels} floorY={0}>
      <group position={[0, 1.25, 0]}>
        <mesh material={wall} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[R, R, Lv, 72, 1, true]} /></mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[R * 1.1, R * 1.1, Lv, 72, 1, true]} /><meshPhysicalMaterial color="#e48a7c" roughness={0.6} side={THREE.DoubleSide} clippingPlanes={clip} transparent opacity={0.55} /></mesh>
        {cells.map((c, i) => <mesh key={i} geometry={cellGeo} material={cellMat} position={c.p} rotation={c.rot} castShadow />)}
        {problema === "placa" && plaque.map((p, i) => {
          const k = grow * Math.exp(-p.x * p.x * 0.5);
          return <mesh key={i} position={[p.x, Math.cos(p.a) * R * 0.95, -Math.abs(Math.sin(p.a)) * R * 0.95]} scale={[p.s * 1.6 * k + 0.001, p.s * k * 1.4 + 0.001, p.s * 1.2 * k + 0.001]}><sphereGeometry args={[1, 24, 24]} /><meshPhysicalMaterial color="#f2c14e" roughness={0.5} clearcoat={0.5} /></mesh>;
        })}
        {sugar.map((s, i) => <mesh key={i} position={s.p} scale={s.s * 0.06 + 0.001} rotation={[i, i * 2, 0]}><boxGeometry args={[1, 1, 1]} /><meshPhysicalMaterial color="#ffffff" roughness={0.1} clearcoat={1} emissive="#ffffff" emissiveIntensity={0.15} /></mesh>)}
      </group>
    </Stage>
  );
};

/* ═════════════════ TODOS) BARRAS 3D ═════════════════ */
const PAL = ["#2f6fdf", "#e0533d", "#f2b632", "#2bb07f", "#8a5cf6"];
export const Barras3D: React.FC<D & { title: string; items: { label: string; value: number }[]; unidad?: string; destacar?: number; kicker?: string; note?: string }> = ({ durationInFrames: dur, title, items, unidad = "", destacar, kicker, note }) => {
  const f = useCurrentFrame(); const t = f / dur;
  const its = (items || []).slice(0, 5);
  const max = Math.max(...its.map((i) => i.value), 1);
  const gap = 1.5, x0 = -((its.length - 1) * gap) / 2;
  const cam = orbit(t, { r: 9.2, r1: 8.6, y: 3.4, a0: -0.32, a1: 0.18, look: [0, 1.5, 0], fov: 36 });
  const mats = useMemo(() => its.map((_, i) => paint(destacar === i ? "#d63a2f" : destacar != null ? "#9aa3ad" : PAL[i % PAL.length], 0.35)), [its.length, destacar]);
  const hs = its.map((it, i) => (it.value / max) * 3.4 * interpolate(f, [8 + i * 6, 8 + i * 6 + dur * 0.35], [0, 1], { ...cl, easing: OUT }));
  const labels: Lbl[] = its.map((it, i) => ({ at: [x0 + i * gap, hs[i] + 0.05, 0] as V3, text: `${Math.round(it.value * Math.min(1, hs[i] / ((it.value / max) * 3.4 || 1))).toLocaleString("es")}${unidad ? " " + unidad : ""}`, t0: 0.05 + i * 0.03, tone: (destacar === i ? "red" : "dark") as Tone, side: "r" as const, dy: -50 }));
  return (
    <Stage durationInFrames={dur} cam={cam} title={title} kicker={kicker} note={note} labels={labels} floorY={0} hud={<Barras3DNames its={its} x0={x0} gap={gap} cam={cam} />}>
      {its.map((it, i) => (
        <mesh key={i} material={mats[i]} position={[x0 + i * gap, Math.max(0.001, hs[i]) / 2, 0]} scale={[1, Math.max(0.001, hs[i]), 1]} castShadow receiveShadow>
          <boxGeometry args={[0.95, 1, 0.95]} />
        </mesh>
      ))}
      <mesh position={[0, -0.03, 0]} receiveShadow><boxGeometry args={[its.length * gap + 1, 0.06, 2.2]} /><meshPhysicalMaterial color="#e9ebee" roughness={0.6} clearcoat={0.3} /></mesh>
    </Stage>
  );
};
// nombres debajo de cada barra (HTML proyectado con la misma cámara)
export const Barras3DNames: React.FC<{ its: { label: string }[]; x0: number; gap: number; cam: Cam }> = ({ its, x0, gap, cam }) => (
  <>{its.map((it, i) => { const p = project(cam, [x0 + i * gap, -0.05, 1.1]); return <div key={i} style={{ position: "absolute", left: p.x, top: p.y + 10, transform: "translateX(-50%)", fontFamily: SANS, fontWeight: 800, fontSize: 36, color: "#151a1f", whiteSpace: "nowrap" }}>{it.label}</div>; })}</>
);
