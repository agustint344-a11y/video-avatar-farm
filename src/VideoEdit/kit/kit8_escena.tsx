// kit8_escena.tsx — Escena3D: animación 3D ARMADA POR DATOS (pedido del usuario 2026-10-26: "no repitas ni una vez las mismas
// animaciones, hacé nuevas para cada video, usalas desde el principio"). En vez de 7 escenas fijas, cada animación combina
// objetos (32) + efectos (16) + cámaras (10, con cortes de plano cada pocos segundos) + fondos (7) + entradas (4) + dato/veredicto.
// El planificador la describe en JSON; cfg.mjs rechaza firmas repetidas (en el video y en videos anteriores del canal).
// FraseKinetica: tarjeta tipográfica con las palabras de la frase (relleno de huecos, nunca una 3D repetida).
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
type Obj = { tipo: string; etiqueta?: string; color?: string };
export type Escena3DProps = D & {
  title: string; kicker?: string; note?: string;
  objetos?: Obj[]; efectos?: string[]; camara?: string; fondo?: string; entrada?: string;
  dato?: { valor: number; unidad?: string; label?: string }; veredicto?: "bien" | "mal";
  pip?: boolean; // el avatar está en círculo abajo a la derecha: el dato/veredicto se corren
  plano?: number; // segundos por plano de cámara (lo pone build_mateo: más corto en los primeros 5 min)
};

const W = 1920, H = 1080;
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const sm = (x: number) => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const seeded = (s: number) => { s = Math.abs(Math.floor(s)) % 2147483646 + 1; return () => ((s = (s * 16807) % 2147483647) / 2147483647); };
const hash = (s: string) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return Math.abs(h); };
const GEO = new Map<string, THREE.BufferGeometry>();
const geo = (k: string, mk: () => THREE.BufferGeometry) => { if (!GEO.has(k)) GEO.set(k, mk()); return GEO.get(k)!; };

/* ─────────── fondos ─────────── */
const FONDOS: Record<string, { bg: string; ink: string; shadow: number; grid?: string; acc: string }> = {
  claro: { bg: "radial-gradient(ellipse at 50% 38%, #ffffff 0%, #eef0f2 55%, #d3d8dd 100%)", ink: "#151a1f", shadow: 0.22, acc: "#d63a2f" },
  plano: { bg: "radial-gradient(ellipse at 50% 40%, #1f4f8f 0%, #143a6e 60%, #0c2547 100%)", ink: "#ffffff", shadow: 0.35, grid: "rgba(255,255,255,.09)", acc: "#ffd43b" },
  cielo: { bg: "linear-gradient(180deg, #7fc4ff 0%, #bfe3ff 55%, #eef7ff 100%)", ink: "#0f2238", shadow: 0.2, acc: "#d63a2f" },
  atardecer: { bg: "linear-gradient(180deg, #ff9a6b 0%, #ffc59a 45%, #ffe9d6 100%)", ink: "#2a1508", shadow: 0.24, acc: "#b3261e" },
  noche: { bg: "radial-gradient(ellipse at 50% 35%, #2b3442 0%, #161b24 65%, #0b0e13 100%)", ink: "#ffffff", shadow: 0.45, acc: "#ff6b5e" },
  arena: { bg: "radial-gradient(ellipse at 50% 40%, #fbf3e4 0%, #efe0c4 60%, #dcc59c 100%)", ink: "#2b2014", shadow: 0.22, acc: "#c0392b" },
  menta: { bg: "radial-gradient(ellipse at 50% 40%, #f1fff8 0%, #d3f3e3 60%, #a8dcc2 100%)", ink: "#0f2a1e", shadow: 0.2, acc: "#d63a2f" },
};
const FONDO_KEYS = Object.keys(FONDOS);

/* ─────────── escena base ─────────── */
const Env: React.FC = () => {
  const { gl, scene } = useThree();
  useMemo(() => {
    scene.environment = studioEnv(gl);
    gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.0;
    gl.shadowMap.enabled = true; gl.shadowMap.type = THREE.PCFSoftShadowMap;
  }, [gl, scene]);
  return null;
};
const CamRig: React.FC<{ cam: Cam }> = ({ cam }) => {
  const { camera } = useThree();
  const c = camera as THREE.PerspectiveCamera;
  c.position.set(...cam.p); c.fov = cam.fov; c.aspect = W / H; c.near = 0.05; c.far = 120;
  c.lookAt(...cam.l); c.updateProjectionMatrix();
  return null;
};
const project = (cam: Cam, at: V3) => {
  const c = new THREE.PerspectiveCamera(cam.fov, W / H, 0.05, 120);
  c.position.set(...cam.p); c.lookAt(...cam.l); c.updateMatrixWorld(); c.updateProjectionMatrix();
  const v = new THREE.Vector3(...at).project(c);
  return { x: ((v.x + 1) / 2) * W, y: ((1 - v.y) / 2) * H, front: v.z < 1 };
};

/* ─────────── cámaras: 10 movimientos; cada plano usa uno distinto ─────────── */
const CAMS = ["orbita", "acercamiento", "cenital", "lateral", "rasante", "vuelta", "picado", "travelling", "contrapicado", "alejamiento"];
const camAt = (kind: string, u: number, o: { R: number; Hm: number; S: number; mx: number; mh: number }): Cam => {
  const k = Easing.inOut(Easing.cubic)(Math.min(1, Math.max(0, u)));
  const L: V3 = [0, o.Hm * 0.5, 0];
  const orb = (a: number, r: number, y: number, look: V3 = L, fov = 38): Cam => ({ p: [look[0] + Math.sin(a) * r, y, look[2] + Math.cos(a) * r], l: look, fov });
  switch (kind) {
    case "acercamiento": return orb(lerp(-0.35, -0.15, k), lerp(o.R * 1.05, o.R * 0.5, k), lerp(o.Hm + 1.4, o.mh * 0.8 + 0.6, k), [o.mx, o.mh * 0.55, 0]);
    case "alejamiento": return orb(lerp(0.2, 0.45, k), lerp(o.R * 0.5, o.R * 1.1, k), lerp(o.mh * 0.7 + 0.5, o.Hm + 2, k), [lerp(o.mx, 0, k), lerp(o.mh * 0.55, o.Hm * 0.5, k), 0]);
    case "cenital": return { p: [Math.sin(lerp(0, 0.5, k)) * 1.5, o.R * 1.05, Math.cos(lerp(0, 0.5, k)) * 1.5 + 0.8], l: [0, 0, 0], fov: 40 };
    case "lateral": return orb(lerp(1.0, 0.7, k), o.R * 0.92, o.Hm * 0.8 + 0.9);
    case "rasante": return orb(lerp(-0.3, 0.2, k), o.R * 0.9, 0.35, [0, o.Hm * 0.55, 0], 40);
    case "vuelta": return orb(lerp(-1.25, 1.25, k), o.R * 0.95, o.Hm * 0.7 + 1.4);
    case "picado": return orb(lerp(0.45, 0.2, k), o.R * 0.7, o.R * 0.75);
    case "travelling": { const x = lerp(-o.S * 0.45 - 0.6, o.S * 0.45 + 0.6, k); return { p: [x, o.Hm * 0.6 + 0.8, o.R * 0.78], l: [x * 0.8, o.Hm * 0.45, 0], fov: 38 }; }
    case "contrapicado": return orb(lerp(-0.4, -0.1, k), o.R * 0.68, 0.18, [0, o.Hm * 0.85, 0], 46);
    default: return orb(lerp(-0.62, -0.22, k), lerp(o.R, o.R * 0.9, k), o.Hm * 0.75 + 1.6);
  }
};

/* ─────────── objetos: cada uno apoyado en y=0, centrado en x=0, con su ancho/alto ─────────── */
type Ctx = { t: number; f: number; col?: string; fx: Set<string>; r: () => number };
type Built = { w: number; h: number; node: React.ReactNode };
const M = {
  conc: (c = "#a7a49d") => <meshStandardMaterial color={c} roughness={0.93} />,
  plas: (c: string) => <meshPhysicalMaterial color={c} roughness={0.42} clearcoat={0.5} />,
  glass: (c = "#dfe9ee", o = 0.3) => <meshPhysicalMaterial color={c} roughness={0.1} transparent opacity={o} clearcoat={1} side={THREE.DoubleSide} depthWrite={false} />,
  water: (o = 0.55) => <meshPhysicalMaterial color="#4fb3ff" roughness={0.05} transparent opacity={o} clearcoat={1} emissive="#1f6fd1" emissiveIntensity={0.25} depthWrite={false} />,
  glow: (c: string, i = 1.6) => <meshStandardMaterial color={c} emissive={c} emissiveIntensity={i} toneMapped={false} />,
};
const corrugated = () => { const g = new THREE.PlaneGeometry(2.6, 1.8, 90, 1); const p = g.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getX(i) * Math.PI * 7) * 0.05); g.computeVertexNormals(); return g; };
const shield = () => { const s = new THREE.Shape(); s.moveTo(0, 0.95); s.quadraticCurveTo(0.45, 0.85, 0.75, 0.95); s.lineTo(0.75, 0.2); s.quadraticCurveTo(0.7, -0.55, 0, -0.95); s.quadraticCurveTo(-0.7, -0.55, -0.75, 0.2); s.lineTo(-0.75, 0.95); s.quadraticCurveTo(-0.45, 0.85, 0, 0.95);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.18, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 3 }); g.center(); return g; };
const bucket = () => new THREE.LatheGeometry([new THREE.Vector2(0.001, 0), new THREE.Vector2(0.45, 0), new THREE.Vector2(0.56, 0.8), new THREE.Vector2(0.53, 0.8), new THREE.Vector2(0.42, 0.04), new THREE.Vector2(0.001, 0.04)], 48);

const OBJ: Record<string, (c: Ctx) => Built> = {
  losa: ({ col }) => ({ w: 2.6, h: 1.5, node: <>
    {[-1.05, 1.05].map((x, i) => <mesh key={i} position={[x, 0.66, 0]} castShadow receiveShadow><boxGeometry args={[0.3, 1.32, 1.2]} />{M.conc("#d8d2c4")}</mesh>)}
    <mesh position={[0, 1.32, 0]} castShadow receiveShadow><boxGeometry args={[2.6, 0.36, 1.6]} />{M.conc(col || "#a7a49d")}</mesh>
  </> }),
  pared: ({ col }) => {
    const bricks: React.ReactNode[] = [];
    for (let row = 0; row < 7; row++) for (let c = 0; c < 4; c++) { const x = -1.2 + (row % 2 ? 0.15 : 0) + c * 0.6 + 0.3; if (x > 1.15) continue;
      bricks.push(<mesh key={`${row}-${c}`} position={[x - 0.02, 0.15 + row * 0.28, 0.02]} castShadow><boxGeometry args={[0.56, 0.24, 0.42]} /><meshStandardMaterial color={row % 3 ? "#b4623e" : "#a85636"} roughness={0.9} /></mesh>); }
    return { w: 2.4, h: 2.0, node: <>
      <mesh position={[0, 1.0, -0.05]} castShadow receiveShadow><boxGeometry args={[2.4, 2.0, 0.4]} />{M.conc("#cfc8b8")}</mesh>
      {bricks}
      <mesh position={[0.45, 1.0, 0.26]} castShadow receiveShadow><boxGeometry args={[1.5, 2.0, 0.08]} /><meshStandardMaterial color={col || "#efeae0"} roughness={0.8} /></mesh>
    </> };
  },
  ladrillo: ({ col }) => ({ w: 1.8, h: 0.76, node: <>
    <mesh position={[0, 0.38, 0]} castShadow receiveShadow><boxGeometry args={[1.8, 0.76, 0.9]} /><meshStandardMaterial color={col || "#b85a34"} roughness={0.95} /></mesh>
    {[-0.5, 0, 0.5].map((x, i) => <mesh key={i} position={[x, 0.38, 0.452]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.14, 0.14, 0.01, 24]} /><meshStandardMaterial color="#3a1d10" /></mesh>)}
  </> }),
  cano: ({ col }) => ({ w: 2.8, h: 1.05, node: <>
    <mesh position={[0, 0.7, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.32, 0.32, 2.6, 48, 1, true]} />{M.glass(col || "#dfe9ee", 0.35)}</mesh>
    <mesh position={[0, 0.7, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.26, 0.26, 2.58, 40]} />{M.water(0.4)}</mesh>
    {[-1.3, 1.3].map((x, i) => <mesh key={i} position={[x, 0.7, 0]} rotation={[0, 0, Math.PI / 2]} castShadow material={metal("#b8bcc2", 0.3)}><cylinderGeometry args={[0.38, 0.38, 0.2, 40]} /></mesh>)}
    {[-0.9, 0.9].map((x, i) => <mesh key={i} position={[x, 0.2, 0]} castShadow><boxGeometry args={[0.16, 0.4, 0.5]} /><meshStandardMaterial color="#6d7177" /></mesh>)}
  </> }),
  codo: ({ col }) => ({ w: 1.8, h: 1.8, node: <>
    <mesh position={[-0.2, 0.9, 0]} rotation={[0, 0, 0]} castShadow><torusGeometry args={[0.6, 0.24, 24, 48, Math.PI / 2]} />{M.plas(col || "#e9e6df")}</mesh>
    <mesh position={[0.4, 0.45, 0]} castShadow><cylinderGeometry args={[0.24, 0.24, 0.9, 32]} />{M.plas(col || "#e9e6df")}</mesh>
    <mesh position={[-0.65, 1.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.24, 0.24, 0.9, 32]} />{M.plas(col || "#e9e6df")}</mesh>
  </> }),
  tanque: ({ t, col }) => { const lv = 0.25 + 0.55 * sm((t - 0.15) / 0.6); return { w: 1.7, h: 2.0, node: <>
    <mesh position={[0, 0.92, 0]}><cylinderGeometry args={[0.8, 0.8, 1.8, 48, 1, true]} />{M.glass(col || "#cfe0ea", 0.32)}</mesh>
    <mesh position={[0, 0.03 + (1.75 * lv) / 2, 0]}><cylinderGeometry args={[0.76, 0.76, 1.75 * lv, 48]} />{M.water(0.6)}</mesh>
    <mesh position={[0, 1.88, 0]} castShadow><cylinderGeometry args={[0.84, 0.84, 0.12, 48]} />{M.plas("#2c2f33")}</mesh>
    <mesh position={[0, 0.02, 0]} receiveShadow><cylinderGeometry args={[0.84, 0.84, 0.05, 48]} />{M.plas("#2c2f33")}</mesh>
  </> }; },
  chapa: ({ col }) => ({ w: 2.7, h: 1.7, node: <>
    {[[-1.15, -0.7], [1.15, -0.7], [-1.15, 0.7], [1.15, 0.7]].map(([x, z], i) => <mesh key={i} position={[x, z < 0 ? 0.75 : 0.55, z]} castShadow><boxGeometry args={[0.1, z < 0 ? 1.5 : 1.1, 0.1]} /><meshStandardMaterial color="#5b5e63" /></mesh>)}
    <mesh geometry={geo("chapa", corrugated)} position={[0, 1.38, 0]} rotation={[-Math.PI / 2 + 0.22, 0, 0]} castShadow receiveShadow material={metal(col || "#b9c0c7", 0.35)} />
  </> }),
  teja: ({ col }) => ({ w: 2.6, h: 1.5, node: <>
    <mesh position={[0, 0.5, 0]} castShadow receiveShadow><boxGeometry args={[2.6, 1.0, 1.6]} />{M.conc("#e7e0d2")}</mesh>
    <group position={[0, 1.12, 0]} rotation={[0.32, 0, 0]}>
      {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[-1.12 + i * 0.32, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.17, 0.17, 1.7, 20, 1, true, i % 2 ? 0 : Math.PI, Math.PI]} /><meshStandardMaterial color={col || "#c8643b"} roughness={0.7} side={THREE.DoubleSide} /></mesh>)}
    </group>
  </> }),
  canaleta: ({ col }) => ({ w: 2.8, h: 1.9, node: <>
    <mesh position={[0, 1.65, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.28, 0.28, 2.6, 32, 1, true, Math.PI, Math.PI]} /><meshStandardMaterial color={col || "#d9dde1"} metalness={0.6} roughness={0.35} side={THREE.DoubleSide} /></mesh>
    <mesh position={[1.25, 0.8, 0]} castShadow><cylinderGeometry args={[0.12, 0.12, 1.65, 24]} /><meshStandardMaterial color={col || "#d9dde1"} metalness={0.6} roughness={0.35} /></mesh>
  </> }),
  ventana: ({ col }) => ({ w: 2.0, h: 2.1, node: <>
    {[[0, 0.35, 1.9, 0.12], [0, 1.95, 1.9, 0.12], [-0.9, 1.15, 0.12, 1.7], [0.9, 1.15, 0.12, 1.7], [0, 1.15, 0.08, 1.6]].map(([x, y, w, h], i) => <mesh key={i} position={[x, y, 0]} castShadow><boxGeometry args={[w, h, 0.16]} />{M.plas(col || "#f4f4f2")}</mesh>)}
    <mesh position={[0, 1.15, 0]}><planeGeometry args={[1.7, 1.5]} />{M.glass("#cfeaff", 0.35)}</mesh>
    <mesh position={[0, 0.24, 0.12]} castShadow><boxGeometry args={[2.1, 0.08, 0.36]} />{M.conc("#d9d4c9")}</mesh>
  </> }),
  ceramica: ({ col }) => ({ w: 2.4, h: 0.32, node: <>
    <mesh position={[0, 0.1, 0]} receiveShadow castShadow><boxGeometry args={[2.4, 0.2, 1.8]} />{M.conc("#9d9a94")}</mesh>
    {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[-0.9 + (i % 4) * 0.6, 0.25, -0.6 + Math.floor(i / 4) * 0.6]} castShadow receiveShadow><boxGeometry args={[0.56, 0.08, 0.56]} /><meshPhysicalMaterial color={col || "#eef1f3"} roughness={0.15} clearcoat={1} /></mesh>)}
  </> }),
  balde: ({ col }) => ({ w: 1.2, h: 0.95, node: <>
    <mesh geometry={geo("balde", bucket)} castShadow receiveShadow><meshPhysicalMaterial color="#f2f2f0" roughness={0.4} clearcoat={0.4} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.66, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.52, 40]} /><meshPhysicalMaterial color={col || "#e9e4d6"} roughness={0.3} clearcoat={0.8} /></mesh>
    <mesh position={[0, 0.8, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.55, 0.02, 8, 40, Math.PI]} /><meshStandardMaterial color="#555" metalness={0.7} roughness={0.3} /></mesh>
  </> }),
  rodillo: ({ t, col }) => ({ w: 1.4, h: 1.3, node: <group position={[0, 0.2, 0]} rotation={[0, 0, 0.5]}>
    <mesh rotation={[t * 12, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.2, 0.2, 0.85, 32]} /><meshStandardMaterial color={col || "#f0ece2"} roughness={1} /></mesh>
    <mesh position={[0.45, 0.25, 0]} rotation={[0, 0, 0]} castShadow material={metal("#c9ccd0")}><cylinderGeometry args={[0.025, 0.025, 0.5, 12]} /></mesh>
    <mesh position={[0.45, 0.85, 0]} castShadow><cylinderGeometry args={[0.06, 0.05, 0.7, 20]} />{M.plas("#e0533d")}</mesh>
  </group> }),
  pincel: ({ col }) => ({ w: 1.0, h: 1.4, node: <group position={[0, 0.7, 0]} rotation={[0, 0, -0.35]}>
    <mesh position={[0, 0.3, 0]} castShadow><cylinderGeometry args={[0.07, 0.09, 0.8, 20]} /><meshStandardMaterial color="#9a6a3c" roughness={0.6} /></mesh>
    <mesh position={[0, -0.15, 0]} castShadow material={metal("#c9ccd0")}><boxGeometry args={[0.36, 0.18, 0.12]} /></mesh>
    <mesh position={[0, -0.42, 0]} castShadow><boxGeometry args={[0.34, 0.38, 0.1]} /><meshStandardMaterial color={col || "#2a2622"} roughness={1} /></mesh>
  </group> }),
  espatula: ({ col }) => ({ w: 1.3, h: 0.6, node: <group position={[0, 0.22, 0]} rotation={[0.2, 0.3, 0.12]}>
    <mesh castShadow material={metal(col || "#c3c7cc", 0.25)}><boxGeometry args={[1.0, 0.025, 0.55]} /></mesh>
    <mesh position={[0, 0.18, 0]} castShadow material={metal("#9aa0a6")}><cylinderGeometry args={[0.03, 0.03, 0.35, 10]} /></mesh>
    <mesh position={[0, 0.36, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.07, 0.07, 0.6, 20]} />{M.plas("#2f6fdf")}</mesh>
  </group> }),
  bidon: ({ col }) => ({ w: 0.9, h: 1.2, node: <>
    <mesh position={[0, 0.5, 0]} castShadow receiveShadow><boxGeometry args={[0.8, 1.0, 0.5]} />{M.plas(col || "#2f8fdf")}</mesh>
    <mesh position={[0.22, 1.06, 0]} castShadow><cylinderGeometry args={[0.1, 0.1, 0.14, 20]} />{M.plas("#f2b632")}</mesh>
    <mesh position={[-0.12, 1.02, 0]} castShadow><torusGeometry args={[0.13, 0.04, 10, 24, Math.PI]} />{M.plas(col || "#2f8fdf")}</mesh>
  </> }),
  casa: ({ col }) => ({ w: 2.0, h: 2.1, node: <>
    <mesh position={[0, 0.6, 0]} castShadow receiveShadow><boxGeometry args={[1.8, 1.2, 1.4]} /><meshStandardMaterial color={col || "#f1e7d6"} roughness={0.85} /></mesh>
    <mesh position={[0, 1.6, 0]} rotation={[0, Math.PI / 4, 0]} scale={[1.45, 1, 1.15]} castShadow><coneGeometry args={[0.95, 0.8, 4]} /><meshStandardMaterial color="#b5523a" roughness={0.7} /></mesh>
    <mesh position={[-0.35, 0.35, 0.71]}><boxGeometry args={[0.36, 0.7, 0.02]} /><meshStandardMaterial color="#7a4a2a" /></mesh>
    <mesh position={[0.4, 0.75, 0.71]}><boxGeometry args={[0.45, 0.38, 0.02]} />{M.glass("#bfe3ff", 0.8)}</mesh>
  </> }),
  termometro: ({ t, col }) => { const lv = 0.2 + 0.7 * sm((t - 0.2) / 0.55); return { w: 0.8, h: 2.1, node: <>
    <mesh position={[0, 0.25, 0]} castShadow><sphereGeometry args={[0.22, 32, 32]} />{M.glow(col || "#e0533d", 0.5)}</mesh>
    <mesh position={[0, 1.15, 0]}><cylinderGeometry args={[0.1, 0.1, 1.7, 24, 1, true]} />{M.glass()}</mesh>
    <mesh position={[0, 0.35 + (1.55 * lv) / 2, 0]}><cylinderGeometry args={[0.06, 0.06, 1.55 * lv, 16]} />{M.glow(col || "#e0533d", 0.5)}</mesh>
    {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[0.16, 0.5 + i * 0.2, 0]}><boxGeometry args={[0.12, 0.02, 0.02]} /><meshStandardMaterial color="#333" /></mesh>)}
  </> }; },
  reloj: ({ f, col }) => ({ w: 1.9, h: 2.0, node: <group position={[0, 1.0, 0]}>
    <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.9, 0.9, 0.12, 64]} /><meshPhysicalMaterial color="#fbfaf6" roughness={0.3} clearcoat={0.8} /></mesh>
    <mesh><torusGeometry args={[0.92, 0.07, 16, 64]} />{M.plas(col || "#2c2f33")}</mesh>
    <mesh position={[0, 0, 0.08]} rotation={[0, 0, -f * 0.12]}><boxGeometry args={[0.05, 1.3, 0.02]} /><meshStandardMaterial color="#d63a2f" /></mesh>
    <mesh position={[0, 0, 0.1]} rotation={[0, 0, -f * 0.01]}><boxGeometry args={[0.08, 0.9, 0.02]} /><meshStandardMaterial color="#1d2329" /></mesh>
  </group> }),
  monedas: ({ t, col }) => { const n = Math.round(lerp(2, 12, sm((t - 0.1) / 0.6))); return { w: 2.0, h: 1.0, node: <>
    {[-0.7, 0, 0.7].map((x, s) => Array.from({ length: Math.max(1, n - s * 3) }, (_, i) => <mesh key={`${s}-${i}`} position={[x, 0.04 + i * 0.075, 0]} castShadow material={metal(col || "#e2b53c", 0.25)}><cylinderGeometry args={[0.3, 0.3, 0.065, 40]} /></mesh>))}
  </> }; },
  gota: ({ f, col }) => ({ w: 1.3, h: 1.9, node: <group position={[0, 0.75 + Math.sin(f / 9) * 0.06, 0]}>
    <mesh castShadow><sphereGeometry args={[0.6, 48, 48]} /><meshPhysicalMaterial color={col || "#5bb6ff"} roughness={0.03} transmission={0.6} thickness={0.8} clearcoat={1} transparent opacity={0.9} /></mesh>
    <mesh position={[0, 0.72, 0]} castShadow><coneGeometry args={[0.5, 0.95, 48, 1, true]} /><meshPhysicalMaterial color={col || "#5bb6ff"} roughness={0.03} clearcoat={1} transparent opacity={0.9} /></mesh>
  </group> }),
  sol: ({ f, col }) => ({ w: 1.8, h: 2.4, node: <group position={[0, 1.5, 0]}>
    <mesh><sphereGeometry args={[0.55, 40, 40]} />{M.glow(col || "#ffb21f", 1.8)}</mesh>
    {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2 + f * 0.02; return <mesh key={i} position={[Math.cos(a) * 0.85, Math.sin(a) * 0.85, 0]} rotation={[0, 0, a]}><boxGeometry args={[0.35, 0.08, 0.08]} />{M.glow("#ffd43b", 1.4)}</mesh>; })}
    <pointLight intensity={4} distance={8} color="#ffcf70" />
  </group> }),
  nube: ({ col }) => ({ w: 2.2, h: 2.5, node: <group position={[0, 2.0, 0]}>
    {[[-0.6, 0, 0.45], [0, 0.18, 0.6], [0.6, 0, 0.45], [-0.25, -0.1, 0.45], [0.3, -0.1, 0.45]].map(([x, y, r], i) => <mesh key={i} position={[x, y, 0]} castShadow><sphereGeometry args={[r, 32, 32]} /><meshStandardMaterial color={col || "#f4f6f8"} roughness={0.9} /></mesh>)}
  </group> }),
  escudo: ({ col }) => ({ w: 1.6, h: 2.1, node: <mesh geometry={geo("escudo", shield)} position={[0, 1.05, 0]} castShadow material={paint(col || "#1f9d5a", 0.35)} /> }),
  lupa: ({ col }) => ({ w: 1.6, h: 2.0, node: <group position={[0, 1.25, 0]} rotation={[0, 0, 0.45]}>
    <mesh castShadow><torusGeometry args={[0.55, 0.07, 20, 60]} />{M.plas(col || "#1d2329")}</mesh>
    <mesh><circleGeometry args={[0.55, 48]} />{M.glass("#e8f6ff", 0.25)}</mesh>
    <mesh position={[0, -0.95, 0]} castShadow><cylinderGeometry args={[0.07, 0.08, 0.8, 20]} />{M.plas(col || "#1d2329")}</mesh>
  </group> }),
  tierra: ({ r, col }) => { const pb = Array.from({ length: 26 }, () => [(r() - 0.5) * 2.2, 0.1 + r() * 0.7, 0.66 + r() * 0.06, 0.04 + r() * 0.06] as number[]); return { w: 2.4, h: 0.95, node: <>
    <mesh position={[0, 0.45, 0]} castShadow receiveShadow><boxGeometry args={[2.4, 0.9, 1.3]} /><meshStandardMaterial color={col || "#6b4a2e"} roughness={1} /></mesh>
    {pb.map(([x, y, z, s], i) => <mesh key={i} position={[x, y, z]}><sphereGeometry args={[s, 10, 10]} /><meshStandardMaterial color="#9b8b78" roughness={0.9} /></mesh>)}
    <mesh position={[0, 0.91, 0]} receiveShadow><boxGeometry args={[2.4, 0.04, 1.3]} /><meshStandardMaterial color="#4f8a3a" roughness={1} /></mesh>
  </> }; },
  columna: ({ col }) => ({ w: 0.9, h: 2.3, node: <>
    <mesh position={[0, 1.1, 0]} castShadow receiveShadow><boxGeometry args={[0.6, 2.2, 0.6]} /><meshStandardMaterial color={col || "#b9b5ad"} roughness={0.9} transparent opacity={0.55} /></mesh>
    {[[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].map(([x, z], i) => <mesh key={i} position={[x, 1.1, z]} castShadow><cylinderGeometry args={[0.035, 0.035, 2.15, 10]} /><meshStandardMaterial color="#7b4a2d" metalness={0.6} roughness={0.5} /></mesh>)}
  </> }),
  membrana: ({ t, col }) => { const u = sm((t - 0.15) / 0.55); return { w: 2.6, h: 0.65, node: <>
    <mesh position={[lerp(-1.0, 1.0, u), 0.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.3 - u * 0.12, 0.3 - u * 0.12, 1.3, 32]} /><meshStandardMaterial color={col || "#2f3b46"} roughness={0.5} /></mesh>
    <mesh position={[lerp(-1.0, 1.0, u) / 2 - 0.5, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[Math.max(0.01, u * 2.0), 1.3]} /><meshStandardMaterial color={col || "#2f3b46"} roughness={0.5} /></mesh>
  </> }; },
  sellador: ({ t, col }) => { const u = sm((t - 0.2) / 0.5); return { w: 2.0, h: 0.6, node: <>
    <group position={[lerp(-0.8, 0.8, u), 0.4, 0]} rotation={[0, 0, -0.9]}>
      <mesh castShadow><cylinderGeometry args={[0.16, 0.16, 0.9, 28]} />{M.plas("#f2f2f0")}</mesh>
      <mesh position={[0, -0.6, 0]} castShadow><coneGeometry args={[0.08, 0.35, 20]} />{M.plas("#f2f2f0")}</mesh>
    </group>
    <mesh position={[(lerp(-0.8, 0.8, u) - 1.2) / 2 + 0.08, 0.04, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.045, 0.045, Math.max(0.01, lerp(-0.8, 0.8, u) + 1.0), 16]} /><meshPhysicalMaterial color={col || "#ffffff"} roughness={0.3} clearcoat={1} /></mesh>
  </> }; },
  enchufe: ({ col }) => ({ w: 1.0, h: 1.1, node: <>
    <mesh position={[0, 0.6, 0]} castShadow><boxGeometry args={[0.8, 1.0, 0.18]} /><meshPhysicalMaterial color={col || "#f3f3f1"} roughness={0.4} clearcoat={0.6} /></mesh>
    {[-0.14, 0.14].map((x, i) => <mesh key={i} position={[x, 0.65, 0.1]}><boxGeometry args={[0.06, 0.2, 0.02]} /><meshStandardMaterial color="#222" /></mesh>)}
  </> }),
  foco: ({ t, col }) => { const on = sm((t - 0.2) / 0.2); return { w: 1.2, h: 1.8, node: <group position={[0, 0.3, 0]}>
    <mesh castShadow material={metal("#c9b37a", 0.3)}><cylinderGeometry args={[0.24, 0.2, 0.45, 32]} /></mesh>
    <mesh position={[0, 0.75, 0]} castShadow><sphereGeometry args={[0.6, 40, 40]} /><meshPhysicalMaterial color="#fffaf0" emissive={col || "#ffd27a"} emissiveIntensity={on * 1.6} roughness={0.2} transparent opacity={0.92} /></mesh>
    <pointLight position={[0, 0.8, 0.8]} intensity={on * 5} distance={6} color="#ffd890" />
  </group> }; },
  canilla: ({ col }) => ({ w: 1.4, h: 1.6, node: <>
    <mesh position={[-0.4, 0.75, 0]} castShadow material={metal(col || "#cfd3d8", 0.18)}><cylinderGeometry args={[0.09, 0.09, 1.5, 24]} /></mesh>
    <mesh position={[0.05, 1.42, 0]} rotation={[0, 0, Math.PI / 2]} castShadow material={metal(col || "#cfd3d8", 0.18)}><cylinderGeometry args={[0.08, 0.08, 0.9, 24]} /></mesh>
    <mesh position={[0.48, 1.3, 0]} castShadow material={metal(col || "#cfd3d8", 0.18)}><cylinderGeometry args={[0.07, 0.09, 0.25, 24]} /></mesh>
    <mesh position={[-0.4, 1.62, 0]} castShadow><boxGeometry args={[0.5, 0.1, 0.12]} />{M.plas("#d63a2f")}</mesh>
  </> }),
  inodoro: ({ col }) => ({ w: 1.2, h: 1.6, node: <>
    <mesh position={[0, 0.25, 0.1]} castShadow><cylinderGeometry args={[0.32, 0.25, 0.5, 32]} /><meshPhysicalMaterial color={col || "#fbfbfa"} roughness={0.15} clearcoat={1} /></mesh>
    <mesh position={[0, 0.52, 0.2]} castShadow scale={[1, 0.3, 1.25]}><sphereGeometry args={[0.42, 32, 16]} /><meshPhysicalMaterial color={col || "#fbfbfa"} roughness={0.15} clearcoat={1} /></mesh>
    <mesh position={[0, 0.95, -0.35]} castShadow><boxGeometry args={[0.8, 0.75, 0.3]} /><meshPhysicalMaterial color={col || "#fbfbfa"} roughness={0.15} clearcoat={1} /></mesh>
  </> }),
  escalera: ({ col }) => ({ w: 1.2, h: 2.3, node: <group rotation={[-0.25, 0, 0]} position={[0, 0, 0.3]}>
    {[-0.4, 0.4].map((x, i) => <mesh key={i} position={[x, 1.1, 0]} castShadow material={metal(col || "#c9ccd0", 0.35)}><boxGeometry args={[0.07, 2.3, 0.1]} /></mesh>)}
    {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[0, 0.25 + i * 0.36, 0]} castShadow material={metal(col || "#c9ccd0", 0.35)}><boxGeometry args={[0.8, 0.05, 0.14]} /></mesh>)}
  </group> }),
};
// alias que el planificador puede usar
const ALIAS: Record<string, string> = { techo: "losa", terraza: "losa", azotea: "losa", muro: "pared", tubo: "cano", caño: "cano", cañeria: "cano", cañería: "cano", desague: "codo", desagüe: "codo", sifon: "codo", sifón: "codo", tinaco: "tanque", lamina: "chapa", lámina: "chapa", tejas: "teja", piso: "ceramica", azulejo: "ceramica", azulejos: "ceramica", baño: "ceramica", pintura: "balde", cubeta: "balde", brocha: "pincel", llana: "espatula", espátula: "espatula", plata: "monedas", dinero: "monedas", costo: "monedas", tiempo: "reloj", agua: "gota", lluvia: "nube", proteccion: "escudo", protección: "escudo", diagnostico: "lupa", diagnóstico: "lupa", suelo: "tierra", cimiento: "tierra", viga: "columna", silicona: "sellador", sellador: "sellador", luz: "foco", grifo: "canilla", llave: "canilla", vivienda: "casa", temperatura: "termometro", termómetro: "termometro" };
export const ESCENA_OBJETOS = Object.keys(OBJ);
const bloque = (c: Ctx): Built => ({ w: 1.4, h: 1.2, node: <mesh position={[0, 0.6, 0]} castShadow receiveShadow><boxGeometry args={[1.4, 1.2, 1.1]} />{M.plas(c.col || "#9aa3ad")}</mesh> });
const objFn = (tipo: string) => { const k = String(tipo || "").toLowerCase().trim(); return OBJ[k] || OBJ[ALIAS[k]] || bloque; };

/* ─────────── etiqueta proyectada ─────────── */
const Pill: React.FC<{ at: V3; text: string; k: number; cam: Cam; tone: string; side: "l" | "r" }> = ({ at, text, k, cam, tone, side }) => {
  if (k <= 0) return null;
  const p = project(cam, at); if (!p.front || p.x < 80 || p.x > W - 80 || p.y < 120 || p.y > H - 60) return null;
  const dx = side === "r" ? 60 : -60, dy = -50;
  return (<>
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}><line x1={p.x} y1={p.y} x2={p.x + dx * k} y2={p.y + dy * k} stroke={tone} strokeWidth={4} strokeLinecap="round" /><circle cx={p.x} cy={p.y} r={8 * k} fill="#fff" stroke={tone} strokeWidth={4} /></svg>
    <div style={{ position: "absolute", left: p.x + dx, top: p.y + dy, transform: `translate(${side === "r" ? "0" : "-100%"}, -50%) scale(${0.6 + 0.4 * k})`, transformOrigin: side === "r" ? "left center" : "right center", opacity: k,
      background: tone, color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 38, padding: "10px 26px", borderRadius: 999, whiteSpace: "nowrap", boxShadow: "0 10px 30px rgba(0,0,0,.25)" }}>{text}</div>
  </>);
};

/* ═════════════════ ESCENA 3D ═════════════════ */
const TONES = ["#1d2329", "#d63a2f", "#1f6fd1", "#1f9d5a", "#c98a0b"];
const ENTRADAS = ["cae", "pop", "sube", "desliza"];
export const Escena3D: React.FC<Escena3DProps> = (p) => {
  const { durationInFrames: dur, title, kicker, note, dato, veredicto } = p;
  const f = useCurrentFrame(); const t = f / dur;
  const objs = (p.objetos && p.objetos.length ? p.objetos : [{ tipo: "bloque" }]).slice(0, 4);
  const fx = new Set((p.efectos || []).map((e) => String(e).toLowerCase()));
  const seed = hash(`${title}|${objs.map((o) => o.tipo).join(",")}|${[...fx].join(",")}`);
  const fondo = FONDOS[p.fondo || ""] ? p.fondo! : FONDO_KEYS[seed % FONDO_KEYS.length];
  const F = FONDOS[fondo];
  const entrada = ENTRADAS.includes(p.entrada || "") ? p.entrada! : ENTRADAS[(seed >> 3) % ENTRADAS.length];
  const titleRight = (seed >> 5) % 3 === 0;

  // objetos en fila (el primero es el protagonista, al centro si hay 3)
  const built = objs.map((o, i) => objFn(o.tipo)({ t, f, col: o.color, fx, r: seeded(seed + i * 101) }));
  const gap = 0.7;
  const order = objs.length === 3 ? [1, 0, 2] : objs.map((_, i) => i);
  const slots: number[] = []; { const ws = order.map((i) => built[i].w); const tot = ws.reduce((a, b) => a + b, 0) + gap * (ws.length - 1); let x = -tot / 2; order.forEach((i, j) => { slots[i] = x + ws[j] / 2; x += ws[j] + gap; }); }
  const S = slots.length > 1 ? Math.max(...slots.map((x, i) => Math.abs(x) + built[i].w / 2)) * 2 : built[0].w;
  const Hm = Math.max(...built.map((b) => b.h));
  const R = Math.max(5.2, S * 1.15 + 3.2, Hm * 2.2 + 2.5);
  const mx = slots[0], mh = built[0].h, mw = built[0].w;

  // planos de cámara: el primero es el pedido, el resto rota por los 10 movimientos (cortes duros con flash)
  const plano = Math.max(2.5, p.plano || 5) * 30;
  const nPl = Math.max(1, Math.min(8, Math.round(dur / plano)));
  const plLen = dur / nPl, pi = Math.min(nPl - 1, Math.floor(f / plLen));
  const c0 = Math.max(0, CAMS.indexOf(p.camara || "")) || (seed % CAMS.length);
  const step = [3, 7, 9][seed % 3];
  const cam = camAt(CAMS[(c0 + pi * step) % CAMS.length], (f - pi * plLen) / plLen, { R, Hm, S, mx, mh });
  const cutK = pi > 0 ? interpolate(f - pi * plLen, [0, 5], [1, 0], cl) : 0;

  // entrada de cada objeto
  const enter = (i: number) => {
    const k = interpolate(t, [0.02 + i * 0.07, 0.14 + i * 0.07], [0, 1], cl);
    if (entrada === "cae") return { y: (1 - Easing.bounce(k)) * 4, s: 1, x: 0 };
    if (entrada === "sube") return { y: -(1 - OUT(k)) * 2.5, s: Math.max(0.001, OUT(k)), x: 0 };
    if (entrada === "desliza") return { y: 0, s: 1, x: (1 - OUT(k)) * (i % 2 ? 6 : -6) };
    return { y: 0, s: Math.max(0.001, Easing.out(Easing.back(1.8))(k)), x: 0 };
  };
  const fxK = sm((t - 0.2) / 0.55);
  const front = 0.75; // frente aproximado del protagonista

  const E: React.ReactNode[] = [];
  if (fx.has("lluvia")) for (let i = 0; i < 46; i++) { const rr = seeded(seed + i * 7); const x = (rr() - 0.5) * (S + 2.5), z = (rr() - 0.5) * 2; const top = slots.reduce((y, sx, j) => (Math.abs(x - sx) < built[j].w / 2 ? Math.max(y, built[j].h) : y), 0); const ph = (rr() + t * (1.5 + rr() * 0.5)) % 1;
    E.push(<mesh key={`ll${i}`} position={[x, lerp(Hm + 3.5, top, ph * ph), z]} scale={[1, 2.4, 1]}><sphereGeometry args={[0.035, 8, 8]} /><meshStandardMaterial color="#8fd0ff" emissive="#2d8cff" emissiveIntensity={0.5} transparent opacity={ph < 0.92 ? 0.9 : 0} /></mesh>); }
  if (fx.has("goteo")) { for (let i = 0; i < 9; i++) { const ph = (i / 9 + t * 1.1) % 1; E.push(<mesh key={`go${i}`} position={[mx + ((i % 3) - 1) * 0.15, lerp(mh * 0.75, 0.05, ph * ph), 0.25 * ((i % 2) * 2 - 1)]} scale={[1, 1.4, 1]}><sphereGeometry args={[0.05, 12, 12]} /><meshStandardMaterial color="#3aa0ff" emissive="#1f6fd1" emissiveIntensity={0.6} transparent opacity={fxK * Math.sin(ph * Math.PI)} /></mesh>); }
    E.push(<mesh key="charco" position={[mx, 0.006, 0.2]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.1 + fxK * 0.7, 40]} /><meshPhysicalMaterial color="#5bb6ff" roughness={0.05} clearcoat={1} transparent opacity={0.55 * fxK} depthWrite={false} /></mesh>); }
  if (fx.has("sube")) E.push(<mesh key="sube" position={[mx, (mh * 0.65 * fxK) / 2, front]}><boxGeometry args={[mw * 0.96, Math.max(0.001, mh * 0.65 * fxK), 0.02]} /><meshStandardMaterial color="#2d8cff" transparent opacity={0.4} emissive="#1f6fd1" emissiveIntensity={0.35} depthWrite={false} /></mesh>);
  if (fx.has("mancha")) E.push(<mesh key="mancha" position={[mx + mw * 0.1, mh * 0.55, front + 0.01]}><circleGeometry args={[0.05 + fxK * Math.min(mw, mh) * 0.38, 40]} /><meshStandardMaterial color="#5e4a32" transparent opacity={0.75} depthWrite={false} /></mesh>);
  if (fx.has("moho")) for (let i = 0; i < 70; i++) { const rr = seeded(seed + i * 13); if (rr() > fxK) continue; E.push(<mesh key={`mo${i}`} position={[mx + (rr() - 0.5) * mw * 0.85, mh * (0.45 + rr() * 0.5), front + 0.02]}><sphereGeometry args={[0.02 + rr() * 0.05, 8, 8]} /><meshStandardMaterial color={rr() > 0.5 ? "#26331f" : "#3c4a2a"} /></mesh>); }
  if (fx.has("grieta")) { const rr = seeded(seed + 77); let x = mx - mw * 0.3, y = mh * 0.9, a = -1.1; const n = Math.round(16 * fxK);
    for (let i = 0; i < n; i++) { a += (rr() - 0.5) * 0.9; const nx = x + Math.cos(a) * 0.12, ny = y + Math.sin(a) * 0.12; E.push(<mesh key={`gr${i}`} position={[(x + nx) / 2, (y + ny) / 2, front + 0.02]} rotation={[0, 0, a]}><boxGeometry args={[0.13, 0.03 + (1 - i / 16) * 0.03, 0.01]} /><meshStandardMaterial color="#141210" /></mesh>); x = nx; y = Math.max(0.05, ny); } }
  if (fx.has("sellar")) E.push(<mesh key="sel" position={[mx - mw / 2 + (mw * fxK) / 2, mh + 0.03, 0]} castShadow><boxGeometry args={[Math.max(0.001, mw * fxK), 0.06, 1.6]} /><meshPhysicalMaterial color="#2f8fdf" roughness={0.25} clearcoat={1} /></mesh>);
  if (fx.has("vapor")) for (let i = 0; i < 28; i++) { const rr = seeded(seed + i * 17); const ph = (rr() + t * 0.6) % 1; E.push(<mesh key={`va${i}`} position={[mx + (rr() - 0.5) * mw + Math.sin(ph * 6 + i) * 0.1, mh + ph * 2, (rr() - 0.5)]}><sphereGeometry args={[0.06 + ph * 0.12, 10, 10]} /><meshStandardMaterial color="#ffffff" transparent opacity={(1 - ph) * 0.55} depthWrite={false} /></mesh>); }
  if (fx.has("calor")) { E.push(<group key="calsol" position={[-S / 2 - 1.2, Hm + 2.2, -1.5]}><mesh><sphereGeometry args={[0.6, 32, 32]} />{M.glow("#ffb21f", 2)}</mesh><pointLight intensity={5} distance={14} color="#ffb070" /></group>);
    for (let i = 0; i < 24; i++) { const rr = seeded(seed + i * 23); const ph = (rr() + t * 0.8) % 1; E.push(<mesh key={`ca${i}`} position={[(rr() - 0.5) * (S + 1), Hm * 0.3 + ph * 2.2, (rr() - 0.5) * 1.5]}><sphereGeometry args={[0.04, 8, 8]} />{M.glow("#ff8a3d", 1.2)}</mesh>); } }
  if (fx.has("frio")) for (let i = 0; i < 40; i++) { const rr = seeded(seed + i * 29); const ph = (rr() + t * 0.35) % 1; E.push(<mesh key={`fr${i}`} position={[(rr() - 0.5) * (S + 2) + Math.sin(ph * 8 + i) * 0.2, lerp(Hm + 3, 0, ph), (rr() - 0.5) * 2]} rotation={[ph * 4, ph * 3, 0]}><octahedronGeometry args={[0.05]} /><meshStandardMaterial color="#e8f6ff" emissive="#9fd8ff" emissiveIntensity={0.5} /></mesh>); }
  if (fx.has("flujo")) for (let i = 0; i < 40; i++) { const rr = seeded(seed + i * 31); const ph = (rr() + t * 0.9) % 1; E.push(<mesh key={`fl${i}`} position={[lerp(-S / 2 - 0.8, S / 2 + 0.8, ph), mh * 0.6 + (rr() - 0.5) * 0.3, (rr() - 0.5) * 0.4]}><sphereGeometry args={[0.045, 10, 10]} /><meshStandardMaterial color="#9fdcff" emissive="#2d8cff" emissiveIntensity={0.7} /></mesh>); }
  if (fx.has("viento")) for (let i = 0; i < 18; i++) { const rr = seeded(seed + i * 37); const ph = (rr() + t * 1.4) % 1; E.push(<mesh key={`vi${i}`} position={[lerp(-S / 2 - 3, S / 2 + 3, ph), 0.4 + rr() * (Hm + 1), (rr() - 0.5) * 2.5]}><boxGeometry args={[0.7, 0.015, 0.015]} /><meshStandardMaterial color="#ffffff" transparent opacity={Math.sin(ph * Math.PI) * 0.8} /></mesh>); }
  if (fx.has("rayosx")) E.push(<mesh key="rx" position={[mx - mw / 2 - 0.3 + (mw + 0.6) * ((t * 1.3) % 1), mh / 2, 0]}><boxGeometry args={[0.04, mh + 0.6, 2.0]} />{M.glow("#38e1ff", 1.5)}</mesh>);
  if (fx.has("brillo")) for (let i = 0; i < 10; i++) { const rr = seeded(seed + i * 41); const k = sm((t - 0.55 - i * 0.025) / 0.08) * (1 - sm((t - 0.85 - i * 0.01) / 0.1)); E.push(<mesh key={`br${i}`} position={[mx + (rr() - 0.5) * (mw + 0.8), rr() * (mh + 0.6) + 0.2, 0.6 + rr() * 0.4]} scale={k * 0.12 + 0.001} rotation={[0, 0, f * 0.1]}><octahedronGeometry args={[1]} />{M.glow("#fff3a0", 2.2)}</mesh>); }
  if (fx.has("dinero")) for (let i = 0; i < 14; i++) { const rr = seeded(seed + i * 43); const ph = (rr() + t * 0.9) % 1; E.push(<mesh key={`di${i}`} position={[(rr() - 0.5) * (S + 1.5), lerp(Hm + 3, 0.05, ph), (rr() - 0.5) * 1.6]} rotation={[ph * 9, ph * 5, 0]} material={metal("#e2b53c", 0.25)}><cylinderGeometry args={[0.14, 0.14, 0.03, 24]} /></mesh>); }
  const spin = fx.has("giro") ? t * Math.PI * 0.8 : 0;

  const labels = objs.map((o, i) => o.etiqueta ? { at: [slots[i], built[i].h + 0.12, 0.3] as V3, text: o.etiqueta, k: interpolate(t, [0.1 + i * 0.1, 0.16 + i * 0.1], [0, 1], { ...cl, easing: OUT }), tone: TONES[(i + 1) % TONES.length], side: (slots[i] >= 0 ? "r" : "l") as "l" | "r" } : null).filter(Boolean) as { at: V3; text: string; k: number; tone: string; side: "l" | "r" }[];
  const out = interpolate(f, [dur - 6, dur], [1, 0], cl);
  const inK = interpolate(f, [0, 12], [0, 1], { ...cl, easing: OUT });
  const dShown = dato ? Math.round(interpolate(f, [dur * 0.25, dur * 0.65], [0, dato.valor], { ...cl, easing: OUT }) * 10) / 10 : 0;
  const rOff = p.pip ? 470 : 0;
  const vK = veredicto ? interpolate(t, [0.6, 0.66], [0, 1], cl) : 0;
  return (
    <AbsoluteFill style={{ opacity: out, background: F.bg, overflow: "hidden" }}>
      {F.grid ? <AbsoluteFill style={{ backgroundImage: `linear-gradient(${F.grid} 1px, transparent 1px), linear-gradient(90deg, ${F.grid} 1px, transparent 1px)`, backgroundSize: "60px 60px" }} /> : null}
      <AbsoluteFill style={{ opacity: inK, transform: `scale(${(0.96 + 0.04 * inK) * (1 + cutK * 0.04)})` }}>
        <ThreeCanvas shadows width={W} height={H} gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }} camera={{ fov: cam.fov, position: cam.p }}>
          <Env />
          <CamRig cam={cam} />
          <ambientLight intensity={fondo === "noche" || fondo === "plano" ? 0.5 : 0.35} />
          <directionalLight position={[-5, 9, 7]} intensity={1.6} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={9} shadow-camera-bottom={-9} shadow-bias={-0.0004} />
          <directionalLight position={[6, 4, -4]} intensity={0.45} color="#cfe6ff" />
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[80, 80]} /><shadowMaterial opacity={F.shadow} /></mesh>
          {built.map((b, i) => { const e = enter(i); return <group key={i} position={[slots[i] + e.x, e.y, 0]} scale={e.s} rotation={[0, i === 0 ? spin : 0, 0]}>{b.node}</group>; })}
          {E}
        </ThreeCanvas>
      </AbsoluteFill>
      {labels.map((l, i) => <Pill key={i} {...l} cam={cam} />)}
      <div style={{ position: "absolute", top: 64, ...(titleRight ? { right: 90, textAlign: "right" as const } : { left: 90 }), opacity: inK, transform: `translateY(${(1 - inK) * -20}px)` }}>
        {kicker ? <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: F.acc, textTransform: "uppercase" }}>{kicker}</div> : null}
        <div style={{ fontFamily: STAMP, fontSize: 88, lineHeight: 1.02, color: F.ink, maxWidth: 1050, textTransform: "uppercase", textShadow: F.ink === "#ffffff" ? "0 4px 18px rgba(0,0,0,.35)" : "none" }}>{title}</div>
      </div>
      {note ? <div style={{ position: "absolute", left: 90, bottom: 70, maxWidth: 1000, fontFamily: SANS, fontWeight: 700, fontSize: 40, color: "#151a1f", background: "rgba(255,255,255,.9)", padding: "16px 28px", borderLeft: `10px solid ${F.acc}`, borderRadius: 10,
        opacity: interpolate(f, [dur * 0.5, dur * 0.5 + 12], [0, 1], cl) }}>{note}</div> : null}
      {dato ? <div style={{ position: "absolute", right: 90 + rOff, bottom: 80, background: "#151a1f", color: "#fff", borderRadius: 18, padding: "22px 34px", fontFamily: SANS, opacity: interpolate(f, [dur * 0.22, dur * 0.22 + 10], [0, 1], cl) }}>
        {dato.label ? <div style={{ fontWeight: 700, fontSize: 28, opacity: 0.75 }}>{dato.label}</div> : null}
        <div style={{ fontFamily: STAMP, fontSize: 104, lineHeight: 1, color: "#ffd43b" }}>{dShown.toLocaleString("es")}{dato.unidad ? ` ${dato.unidad}` : ""}</div>
      </div> : null}
      {veredicto && vK > 0 ? <div style={{ position: "absolute", right: (dato ? 520 : 110) + rOff, bottom: 90, width: 170, height: 170, borderRadius: 999, background: veredicto === "bien" ? "#1f9d5a" : "#d63a2f", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: STAMP, fontSize: 120, transform: `scale(${Easing.out(Easing.back(2))(vK)}) rotate(${(1 - vK) * -30}deg)`, boxShadow: "0 18px 40px rgba(0,0,0,.3)" }}>{veredicto === "bien" ? "✓" : "✗"}</div> : null}
      {cutK > 0 ? <AbsoluteFill style={{ background: "#fff", opacity: cutK * 0.35 }} /> : null}
    </AbsoluteFill>
  );
};

/* ═════════════════ FRASE KINÉTICA (relleno sin repetir: las palabras que se están diciendo) ═════════════════ */
const KBG = [["#151a1f", "#ffd43b", "#ffffff"], ["#d63a2f", "#151a1f", "#ffffff"], ["#1f6fd1", "#ffd43b", "#ffffff"], ["#f4efe6", "#d63a2f", "#151a1f"], ["#1f9d5a", "#151a1f", "#ffffff"]];
export const FraseKinetica: React.FC<D & { texto: string; variante?: number }> = ({ durationInFrames: dur, texto, variante }) => {
  const f = useCurrentFrame();
  const words = String(texto || "").split(/\s+/).filter(Boolean).slice(0, 22);
  const v = (variante ?? hash(texto)) % KBG.length; const [bg, hi, ink] = KBG[v];
  const longest = words.reduce((a, w, i) => (w.replace(/[^\p{L}\d]/gu, "").length > words[a].replace(/[^\p{L}\d]/gu, "").length ? i : a), 0);
  const per = Math.max(3, Math.min(10, (dur * 0.6) / Math.max(1, words.length)));
  const out = interpolate(f, [dur - 6, dur], [1, 0], cl);
  const z = 1 + 0.05 * (f / dur);
  return (
    <AbsoluteFill style={{ background: bg, opacity: out, alignItems: "center", justifyContent: "center", padding: 140 }}>
      <div style={{ transform: `scale(${z})`, display: "flex", flexWrap: "wrap", gap: "10px 26px", justifyContent: "center", maxWidth: 1600 }}>
        {words.map((w, i) => { const k = interpolate(f, [i * per, i * per + 6], [0, 1], { ...cl, easing: OUT });
          return <span key={i} style={{ fontFamily: STAMP, fontSize: words.length > 12 ? 96 : 124, lineHeight: 1.05, textTransform: "uppercase", color: i === longest ? hi : ink, opacity: k, transform: `translateY(${(1 - k) * 40}px) scale(${0.85 + 0.15 * k})`, display: "inline-block" }}>{w}</span>; })}
      </div>
    </AbsoluteFill>
  );
};
