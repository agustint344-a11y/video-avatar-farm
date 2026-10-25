// Look "real" para los objetos 3D: estudio fotográfico HDR (softboxes) como reflejo, metal cepillado con rayones
// procedurales (roughness + bump), pintura con clearcoat y sombras suaves sobre un piso. Sin descargas: todo por código.
import * as THREE from "three";

let rng = 12345;
const rnd = () => ((rng = (rng * 16807) % 2147483647) / 2147483647);

// Estudio: caja oscura + 1 softbox grande arriba, 2 tiras laterales (una fría) y un rebote cálido abajo.
export function studioEnv(gl: THREE.WebGLRenderer) {
  const s = new THREE.Scene();
  const room = new THREE.Mesh(new THREE.BoxGeometry(30, 20, 30), new THREE.MeshBasicMaterial({ color: new THREE.Color("#5a636e"), side: THREE.BackSide }));
  s.add(room);
  const panel = (w: number, h: number, col: string, k: number, pos: [number, number, number], look: [number, number, number] = [0, 0, 0]) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(k), side: THREE.DoubleSide }));
    m.position.set(...pos); m.lookAt(...look); s.add(m);
  };
  panel(16, 10, "#ffffff", 5, [0, 9.5, 2]);          // key cenital
  panel(3, 16, "#fff4e6", 6, [-11, 2, 4]);        // tira izquierda
  panel(3, 16, "#bfe9ff", 6, [11, 2, -3]);        // tira derecha (fría, marca del canal)
  panel(14, 8, "#ffffff", 2.2, [0, 3, 14.5]);            // fill frontal
  panel(26, 26, "#6a6e74", 1.0, [0, -9.5, 0]);      // rebote del piso
  const pm = new THREE.PMREMGenerator(gl);
  const tex = pm.fromScene(s, 0.02).texture;
  pm.dispose();
  return tex;
}

// Mapa de metal cepillado: vetas horizontales + rayones finos al azar + manchas suaves (huellas).
let brushed: THREE.CanvasTexture | null = null;
export function brushedTex() {
  if (brushed) return brushed;
  const N = 1024, c = document.createElement("canvas"); c.width = c.height = N;
  const x = c.getContext("2d")!;
  x.fillStyle = "#7a7a7a"; x.fillRect(0, 0, N, N);
  for (let i = 0; i < 2600; i++) { const y = rnd() * N, v = 90 + rnd() * 80; x.strokeStyle = `rgba(${v},${v},${v},${0.15 + rnd() * 0.25})`; x.lineWidth = 0.5 + rnd() * 1.5; x.beginPath(); x.moveTo(0, y); x.lineTo(N, y + (rnd() - 0.5) * 6); x.stroke(); }
  for (let i = 0; i < 40; i++) { const cx = rnd() * N, cy = rnd() * N, r = 30 + rnd() * 110; const gr = x.createRadialGradient(cx, cy, 0, cx, cy, r); gr.addColorStop(0, "rgba(170,170,170,0.18)"); gr.addColorStop(1, "rgba(170,170,170,0)"); x.fillStyle = gr; x.fillRect(cx - r, cy - r, 2 * r, 2 * r); }
  for (let i = 0; i < 260; i++) { const x0 = rnd() * N, y0 = rnd() * N, a = rnd() * Math.PI, L = 10 + rnd() * 120; x.strokeStyle = `rgba(${rnd() < 0.5 ? 220 : 30},${rnd() < 0.5 ? 220 : 30},${rnd() < 0.5 ? 220 : 30},${0.25 + rnd() * 0.35})`; x.lineWidth = 0.4 + rnd() * 0.8; x.beginPath(); x.moveTo(x0, y0); x.lineTo(x0 + Math.cos(a) * L, y0 + Math.sin(a) * L); x.stroke(); }
  brushed = new THREE.CanvasTexture(c);
  brushed.wrapS = brushed.wrapT = THREE.RepeatWrapping;
  brushed.colorSpace = THREE.NoColorSpace;
  brushed.anisotropy = 8;
  return brushed;
}

type P = Partial<THREE.MeshPhysicalMaterialParameters>;
// metal real: cepillado + rayones; rough = rugosidad media
export const metal = (color: string, rough = 0.28, extra: P = {}, rep = 0.35) => {
  const t = brushedTex().clone(); t.needsUpdate = true; t.repeat.set(rep, rep);
  return new THREE.MeshPhysicalMaterial({ color, metalness: 1, roughness: rough * 1.6, roughnessMap: t, bumpMap: t, bumpScale: 0.35, envMapIntensity: 1.25, ...extra });
};
// pintura / plástico con barniz (clearcoat) y un poco de rayón en la capa base
export const paint = (color: string, rough = 0.45, extra: P = {}) => {
  const t = brushedTex().clone(); t.needsUpdate = true; t.repeat.set(0.5, 0.5);
  return new THREE.MeshPhysicalMaterial({ color, metalness: 0.05, roughness: rough, roughnessMap: t, clearcoat: 0.8, clearcoatRoughness: 0.12, bumpMap: t, bumpScale: 0.12, ...extra });
};
// madera simple con veta
export const wood = (color = "#8a5a32") => {
  const t = brushedTex().clone(); t.needsUpdate = true; t.repeat.set(0.15, 2); t.rotation = Math.PI / 2;
  return new THREE.MeshPhysicalMaterial({ color, metalness: 0, roughness: 0.75, bumpMap: t, bumpScale: 0.6, sheen: 0.3 });
};

// activa sombras en todo lo que tenga malla (llamar en cada frame es barato: solo flags)
export const castAll = (root: THREE.Object3D) => root.traverse((o) => { if ((o as THREE.Mesh).isMesh) { o.castShadow = true; o.receiveShadow = true; } });
