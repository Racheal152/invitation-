import React, { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { Language } from '../data/invitationContent';

interface HeroCelebration3DProps {
  active: boolean;
  lang?: Language;
}

const PORTRAIT_SRC = '/src/assets/images/racheal_2026_front.jpg';

// Exact normalized coordinates measured directly on racheal_2026_front.jpg
// Right forearm/hand/blush-ribbon/diploma emerges cleanly out of the draped black bell sleeve at (0.344, 0.376).
const ARM_PIVOT = { x: 0.344, y: 0.376 };
// Gold 2026 tassel hangs cleanly from the mortarboard cap corner at (0.590, 0.088).
const TASSEL_PIVOT = { x: 0.59, y: 0.088 };
// Heels ground anchor so celebratory bounce/sway stays firmly planted on the watercolor shadow.
const GROUND_PIVOT = { x: 0.5, y: 0.945 };

const GRID_COLS = 26;
const GRID_ROWS = 34;

interface CelebrationParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRot: number;
  alpha: number;
  life: number;
  maxLife: number;
  kind: 'sparkle' | 'petal' | 'ribbon';
  color: string;
}

interface AmbientSparkle {
  baseX: number;
  baseY: number;
  phase: number;
  speed: number;
  size: number;
  driftX: number;
  driftY: number;
  color: string;
}

interface ProcessedPortrait {
  sprite: HTMLCanvasElement;
  depthRim: HTMLCanvasElement;
  width: number;
  height: number;
}

function clamp(v: number, min: number, max: number) {
  return v < min ? min : v > max ? max : v;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Computes how strongly a normalized grid point (u, v) belongs to the raised right arm,
 * hand, blush ribbon, and rolled degree — falling off silkily to 0 right inside the draped
 * bell sleeve so waving bends seamlessly with zero cutout seams.
 */
function getArmWeight(u: number, v: number): number {
  const leftRegion = 1 - smoothstep(0.325, 0.372, u);
  const upperRegion = 1 - smoothstep(0.352, 0.402, v);
  const topBound = smoothstep(0.11, 0.16, v);
  const distFromPivot = Math.hypot((u - ARM_PIVOT.x) * 1.1, v - ARM_PIVOT.y);
  const pivotBlend = smoothstep(0.015, 0.075, distFromPivot);
  return leftRegion * upperRegion * topBound * pivotBlend;
}

/**
 * Computes how strongly a normalized grid point (u, v) belongs to the hanging gold 2026 tassel
 * on the right side of the mortarboard cap.
 */
function getTasselWeight(u: number, v: number): number {
  const rightSide = smoothstep(0.568, 0.584, u) * (1 - smoothstep(0.625, 0.655, u));
  const verticalSpan = smoothstep(0.088, 0.106, v) * (1 - smoothstep(0.215, 0.242, v));
  return rightSide * verticalSpan;
}

/**
 * Builds a clean transparent, softly 3D-sculpted portrait sprite + warm rim-depth layer
 * from racheal_2026_front.jpg using border-seeded BFS flood-fill (preserving interior ivory
 * highlights like the diploma, eyes, and 2026 lettering) and a smooth volumetric distance-field
 * shading pass so she reads with warm sculptural 3D dimension.
 */
function buildSculpted3DPortrait(img: HTMLImageElement): ProcessedPortrait | null {
  const srcW = img.naturalWidth;
  const srcH = img.naturalHeight;
  if (!srcW || !srcH) return null;

  // Work at crisp retina portrait resolution while keeping processing near-instant
  const outW = 600;
  const outH = 800;

  const work = document.createElement('canvas');
  work.width = outW;
  work.height = outH;
  const ctx = work.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  ctx.drawImage(img, 0, 0, outW, outH);
  const imgData = ctx.getImageData(0, 0, outW, outH);
  const data = imgData.data;

  // 1. Border-seeded BFS flood-fill to strip ONLY outer white paper background
  const total = outW * outH;
  const visited = new Uint8Array(total);
  const isBg = new Uint8Array(total);
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;

  const isPaperLike = (idx: number) => {
    const o = idx * 4;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const chroma = Math.max(r, g, b) - Math.min(r, g, b);
    return lum > 224 && chroma < 22;
  };

  const enqueue = (x: number, y: number) => {
    const idx = y * outW + x;
    if (visited[idx]) return;
    visited[idx] = 1;
    if (isPaperLike(idx)) {
      isBg[idx] = 1;
      queue[tail++] = idx;
    }
  };

  for (let x = 0; x < outW; x += 1) {
    enqueue(x, 0);
    enqueue(x, outH - 1);
  }
  for (let y = 0; y < outH; y += 1) {
    enqueue(0, y);
    enqueue(outW - 1, y);
  }

  while (head < tail) {
    const idx = queue[head++];
    const x = idx % outW;
    const y = (idx - x) / outW;
    if (x > 0) enqueue(x - 1, y);
    if (x < outW - 1) enqueue(x + 1, y);
    if (y > 0) enqueue(x, y - 1);
    if (y < outH - 1) enqueue(x, y + 1);
  }

  // 2. Clean alpha mask + silky 1px edge anti-alias feather
  const alphaMask = new Float32Array(total);
  for (let y = 0; y < outH; y += 1) {
    for (let x = 0; x < outW; x += 1) {
      const idx = y * outW + x;
      const o = idx * 4;
      if (isBg[idx]) {
        data[o + 3] = 0;
        alphaMask[idx] = 0;
      } else {
        const nearBg =
          (x > 0 && isBg[idx - 1]) ||
          (x < outW - 1 && isBg[idx + 1]) ||
          (y > 0 && isBg[idx - outW]) ||
          (y < outH - 1 && isBg[idx + outW]);
        if (nearBg) {
          const lum = 0.299 * data[o] + 0.587 * data[o + 1] + 0.114 * data[o + 2];
          if (lum > 205) {
            const a = clamp((242 - lum) / 40, 0.12, 1);
            data[o + 3] = Math.round(255 * a);
            alphaMask[idx] = a;
          } else {
            alphaMask[idx] = 1;
          }
        } else {
          alphaMask[idx] = 1;
        }
      }
    }
  }

  // 3. Fast chamfer distance-to-edge field for soft volumetric 3D figurine shading
  const dist = new Float32Array(total);
  const INF = 1e6;
  for (let i = 0; i < total; i += 1) {
    dist[i] = isBg[i] ? 0 : INF;
  }
  for (let y = 1; y < outH - 1; y += 1) {
    for (let x = 1; x < outW - 1; x += 1) {
      const i = y * outW + x;
      if (dist[i] === 0) continue;
      let d = dist[i];
      if (dist[i - 1] + 1 < d) d = dist[i - 1] + 1;
      if (dist[i - outW] + 1 < d) d = dist[i - outW] + 1;
      if (dist[i - outW - 1] + 1.414 < d) d = dist[i - outW - 1] + 1.414;
      if (dist[i - outW + 1] + 1.414 < d) d = dist[i - outW + 1] + 1.414;
      dist[i] = d;
    }
  }
  for (let y = outH - 2; y >= 1; y -= 1) {
    for (let x = outW - 2; x >= 1; x -= 1) {
      const i = y * outW + x;
      if (dist[i] === 0) continue;
      let d = dist[i];
      if (dist[i + 1] + 1 < d) d = dist[i + 1] + 1;
      if (dist[i + outW] + 1 < d) d = dist[i + outW] + 1;
      if (dist[i + outW + 1] + 1.414 < d) d = dist[i + outW + 1] + 1.414;
      if (dist[i + outW - 1] + 1.414 < d) d = dist[i + outW - 1] + 1.414;
      dist[i] = d;
    }
  }

  // 4. Apply subtle 3D studio key-light + warm sculpted rim-light + gentle dimensional contrast
  // Enhances cylindrical volume & sheen while staying 100% faithful to Racheal's likeness and warm palette
  for (let y = 2; y < outH - 2; y += 1) {
    for (let x = 2; x < outW - 2; x += 1) {
      const idx = y * outW + x;
      if (isBg[idx]) continue;

      const d = dist[idx];
      // Approximate smooth outward 3D surface normal from distance field gradient
      const gx = (dist[idx + 2] - dist[idx - 2]) * 0.25;
      const gy = (dist[idx + outW * 2] - dist[idx - outW * 2]) * 0.25;
      const dome = smoothstep(0, 34, d);
      const nz = 0.55 + dome * 0.9;
      const len = Math.hypot(gx, gy, nz) || 1;
      const nx = -gx / len;
      const ny = -gy / len;
      const nzz = nz / len;

      // Key light from front-top-left (-0.42, -0.52, 0.74)
      const keyDot = clamp(nx * -0.42 + ny * -0.52 + nzz * 0.74, 0, 1);
      // Warm champagne-blush rim light along the outer sculptural edge
      const rim = Math.pow(1 - clamp(nzz, 0, 1), 2.1) * (1 - smoothstep(10, 22, d));
      const rightRim = rim * smoothstep(-0.1, 0.65, nx);
      const spec = Math.pow(clamp(nx * -0.35 + ny * -0.48 + nzz * 0.8, 0, 1), 14) * dome;

      const o = idx * 4;
      let r = data[o];
      let g = data[o + 1];
      let b = data[o + 2];

      // Subtle volumetric light curve + crisp warmth
      const shade = 0.88 + keyDot * 0.2;
      r = r * shade + spec * 24 + rightRim * 34;
      g = g * shade + spec * 20 + rightRim * 22;
      b = b * shade + spec * 18 + rightRim * 25;

      // Subtle warmth saturation boost so skin, blush ribbon, and gold stole feel rich & 3D
      const avg = (r + g + b) / 3;
      const satBoost = 1.16;
      data[o] = clamp(Math.round(avg + (r - avg) * satBoost), 0, 255);
      data[o + 1] = clamp(Math.round(avg + (g - avg) * satBoost), 0, 255);
      data[o + 2] = clamp(Math.round(avg + (b - avg) * satBoost), 0, 255);
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // 5. Create soft warm-sepia 3D extrusion silhouette for subtle dimensional relief behind the figure
  const depthRim = document.createElement('canvas');
  depthRim.width = outW;
  depthRim.height = outH;
  const rimCtx = depthRim.getContext('2d');
  if (!rimCtx) return null;
  rimCtx.drawImage(work, 0, 0);
  rimCtx.globalCompositeOperation = 'source-in';
  const grad = rimCtx.createLinearGradient(0, 0, outW, outH);
  grad.addColorStop(0, '#6F5856');
  grad.addColorStop(0.5, '#544341');
  grad.addColorStop(1, '#7D5F62');
  rimCtx.fillStyle = grad;
  rimCtx.fillRect(0, 0, outW, outH);

  return {
    sprite: work,
    depthRim,
    width: outW,
    height: outH,
  };
}

/**
 * Draws an affine-mapped textured triangle on a 2D canvas with slight 0.45px overlap
 * expansion to guarantee zero hairline seams between mesh triangles.
 */
function drawTexturedTriangle(
  ctx: CanvasRenderingContext2D,
  img: HTMLCanvasElement,
  sx0: number,
  sy0: number,
  sx1: number,
  sy1: number,
  sx2: number,
  sy2: number,
  dx0: number,
  dy0: number,
  dx1: number,
  dy1: number,
  dx2: number,
  dy2: number
) {
  const denom = (sx1 - sx0) * (sy2 - sy0) - (sx2 - sx0) * (sy1 - sy0);
  if (Math.abs(denom) < 1e-6) return;

  // Expand destination triangle slightly outward from its centroid to eliminate sub-pixel seams
  const cx = (dx0 + dx1 + dx2) / 3;
  const cy = (dy0 + dy1 + dy2) / 3;
  const expand = (x: number, y: number): [number, number] => {
    const vx = x - cx;
    const vy = y - cy;
    const len = Math.hypot(vx, vy) || 1;
    return [x + (vx / len) * 0.45, y + (vy / len) * 0.45];
  };
  const [ex0, ey0] = expand(dx0, dy0);
  const [ex1, ey1] = expand(dx1, dy1);
  const [ex2, ey2] = expand(dx2, dy2);

  const a = ((dx1 - dx0) * (sy2 - sy0) - (dx2 - dx0) * (sy1 - sy0)) / denom;
  const b = ((dy1 - dy0) * (sy2 - sy0) - (dy2 - dy0) * (sy1 - sy0)) / denom;
  const c = ((dx2 - dx0) * (sx1 - sx0) - (dx1 - dx0) * (sx2 - sx0)) / denom;
  const d = ((dy2 - dy0) * (sx1 - sx0) - (dy1 - dy0) * (sx2 - sx0)) / denom;
  const e = dx0 - a * sx0 - c * sy0;
  const f = dy0 - b * sx0 - d * sy0;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(ex0, ey0);
  ctx.lineTo(ex1, ey1);
  ctx.lineTo(ex2, ey2);
  ctx.closePath();
  ctx.clip();
  ctx.transform(a, b, c, d, e, f);
  ctx.drawImage(img, 0, 0);
  ctx.restore();
}

function drawFourPointStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  rotation: number,
  color: string,
  alpha: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = clamp(alpha, 0, 1);
  ctx.fillStyle = color;
  ctx.beginPath();
  const inner = radius * 0.28;
  for (let i = 0; i < 8; i += 1) {
    const r = i % 2 === 0 ? radius : inner;
    const angle = (i * Math.PI) / 4;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

const AMBIENT_SPARKLES: AmbientSparkle[] = [
  { baseX: 0.19, baseY: 0.18, phase: 0.2, speed: 1.5, size: 6.5, driftX: 5, driftY: 8, color: '#DFB273' },
  { baseX: 0.31, baseY: 0.12, phase: 1.7, speed: 1.8, size: 5.0, driftX: 4, driftY: 6, color: '#D98998' },
  { baseX: 0.14, baseY: 0.31, phase: 2.9, speed: 1.3, size: 4.8, driftX: 6, driftY: 7, color: '#E4BC82' },
  { baseX: 0.72, baseY: 0.16, phase: 0.9, speed: 1.4, size: 5.5, driftX: 5, driftY: 7, color: '#DFB273' },
  { baseX: 0.78, baseY: 0.34, phase: 3.6, speed: 1.2, size: 4.5, driftX: 4, driftY: 6, color: '#DC94A2' },
  { baseX: 0.24, baseY: 0.44, phase: 4.4, speed: 1.6, size: 4.2, driftX: 5, driftY: 5, color: '#E6C18E' },
];

export function HeroCelebration3D({ active, lang = 'en' }: HeroCelebration3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const portraitRef = useRef<ProcessedPortrait | null>(null);
  const particlesRef = useRef<CelebrationParticle[]>([]);
  const celebrateBoostRef = useRef<number>(0);
  const pointerTiltRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });
  const currentTiltRef = useRef<{ rx: number; ry: number }>({ rx: 0, ry: 0 });
  const hasPlayedEntranceBurstRef = useRef(false);

  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [stageTransform, setStageTransform] = useState('rotateX(0deg) rotateY(0deg)');
  const [shadowShift, setShadowShift] = useState({ x: 0, scale: 1 });

  // Spawn shimmering blush & champagne-gold celebratory confetti around her raised degree
  const triggerCelebrationBurst = (originX = 0.28, originY = 0.25, count = 24) => {
    celebrateBoostRef.current = 1;
    const palette = ['#D88394', '#DFB273', '#E8B8C1', '#F0CFA0', '#C96D7E', '#F4D8DC'];
    const kinds: CelebrationParticle['kind'][] = ['sparkle', 'petal', 'ribbon'];
    const next: CelebrationParticle[] = [];

    for (let i = 0; i < count; i += 1) {
      const angle = -Math.PI * 0.85 + Math.random() * Math.PI * 0.95;
      const speed = 1.1 + Math.random() * 2.5;
      next.push({
        x: originX + (Math.random() - 0.5) * 0.24,
        y: originY + (Math.random() - 0.5) * 0.14,
        vx: Math.cos(angle) * speed * 0.0022,
        vy: Math.sin(angle) * speed * 0.0026 - 0.0018,
        size: 3.5 + Math.random() * 5.2,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.09,
        alpha: 0.95,
        life: 0,
        maxLife: 1.5 + Math.random() * 1.15,
        kind: kinds[i % kinds.length],
        color: palette[i % palette.length],
      });
    }
    particlesRef.current = [...particlesRef.current.slice(-40), ...next];
  };

  // Load and sculpt 3D portrait once
  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.referrerPolicy = 'no-referrer';
    img.onload = () => {
      if (cancelled) return;
      const processed = buildSculpted3DPortrait(img);
      if (processed) {
        portraitRef.current = processed;
        setIsReady(true);
      } else {
        setLoadError(true);
      }
    };
    img.onerror = () => {
      if (!cancelled) setLoadError(true);
    };
    img.src = PORTRAIT_SRC;

    return () => {
      cancelled = true;
    };
  }, []);

  // Gentle welcome celebration burst right when the envelope finishes revealing the Hero
  useEffect(() => {
    if (active && isReady && !hasPlayedEntranceBurstRef.current) {
      hasPlayedEntranceBurstRef.current = true;
      const id = window.setTimeout(() => {
        triggerCelebrationBurst(0.28, 0.24, 18);
      }, 650);
      return () => window.clearTimeout(id);
    }
  }, [active, isReady]);

  // Precompute static mesh weights once
  const meshWeightsRef = useRef<{ arm: Float32Array; tassel: Float32Array } | null>(null);
  if (!meshWeightsRef.current) {
    const count = (GRID_COLS + 1) * (GRID_ROWS + 1);
    const arm = new Float32Array(count);
    const tassel = new Float32Array(count);
    for (let r = 0; r <= GRID_ROWS; r += 1) {
      const v = r / GRID_ROWS;
      for (let c = 0; c <= GRID_COLS; c += 1) {
        const u = c / GRID_COLS;
        const i = r * (GRID_COLS + 1) + c;
        arm[i] = getArmWeight(u, v);
        tassel[i] = getTasselWeight(u, v);
      }
    }
    meshWeightsRef.current = { arm, tassel };
  }

  // 60fps Canvas articulated degree-waving + 3D relief + celebratory particles loop
  useEffect(() => {
    if (!isReady) return;
    const canvas = canvasRef.current;
    const portrait = portraitRef.current;
    const weights = meshWeightsRef.current;
    if (!canvas || !portrait || !weights) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = 460;
    const ch = 614;
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const vx = new Float32Array((GRID_COLS + 1) * (GRID_ROWS + 1));
    const vy = new Float32Array((GRID_COLS + 1) * (GRID_ROWS + 1));

    let rafId = 0;
    let lastTime = performance.now();
    let elapsed = 0;
    let frameCounter = 0;

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      if (active && !prefersReducedMotion) {
        elapsed += dt;
      }

      // Smoothly decay celebratory boost triggered by taps/welcome
      celebrateBoostRef.current = Math.max(0, celebrateBoostRef.current - dt * 0.58);
      const boost = celebrateBoostRef.current;

      // Subtle, sculptural 3D front-facing parallax (never flat 360 spin!)
      const idleRy = prefersReducedMotion ? 0 : Math.sin(elapsed * 0.72) * 7.2;
      const idleRx = prefersReducedMotion ? 0 : Math.cos(elapsed * 0.55) * 2.4;
      const targetRy = pointerTiltRef.current.active
        ? pointerTiltRef.current.x * 13.5
        : idleRy;
      const targetRx = pointerTiltRef.current.active
        ? -pointerTiltRef.current.y * 8.5
        : idleRx;

      currentTiltRef.current.ry += (targetRy - currentTiltRef.current.ry) * Math.min(1, dt * 6);
      currentTiltRef.current.rx += (targetRx - currentTiltRef.current.rx) * Math.min(1, dt * 6);

      // Rhythmic celebratory degree wave + gentle joyful body bounce + cap tassel swing
      const baseWave = prefersReducedMotion
        ? 0
        : Math.sin(elapsed * 2.35) * 0.145 + Math.sin(elapsed * 4.7) * 0.032;
      const boostWave = prefersReducedMotion
        ? 0
        : Math.sin(elapsed * 9.2) * 0.14 * boost;
      const armAngle = baseWave + boostWave; // radians (~-9° to +13° joyful degree wave)

      const bodySway = prefersReducedMotion
        ? 0
        : Math.sin(elapsed * 1.18) * 0.024 + Math.sin(elapsed * 4.6) * 0.014 * boost;
      const bounceY = prefersReducedMotion
        ? 0
        : -(Math.sin(elapsed * 2.35 - 0.35) * 0.5 + 0.5) * 0.0085 -
          Math.abs(Math.sin(elapsed * 6.5)) * 0.012 * boost;
      const tasselAngle = prefersReducedMotion
        ? 0
        : Math.sin(elapsed * 2.35 - 0.9) * 0.13 + Math.sin(elapsed * 7.5) * 0.1 * boost;

      // Compute deformed 2D mesh vertices
      const padX = cw * 0.04;
      const drawW = cw * 0.92;
      const drawH = ch * 0.94;
      const padY = ch * 0.03;

      const cosBody = Math.cos(bodySway);
      const sinBody = Math.sin(bodySway);
      const cosArm = Math.cos(armAngle);
      const sinArm = Math.sin(armAngle);
      const cosTassel = Math.cos(tasselAngle);
      const sinTassel = Math.sin(tasselAngle);

      // Slight horizontal 3D sculptural depth shift for volumetric feel
      const ryNorm = currentTiltRef.current.ry / 14;

      for (let r = 0; r <= GRID_ROWS; r += 1) {
        const v = r / GRID_ROWS;
        for (let c = 0; c <= GRID_COLS; c += 1) {
          const u = c / GRID_COLS;
          const idx = r * (GRID_COLS + 1) + c;

          let nu = u;
          let nv = v;

          // 1. Articulated joyful degree wave around sleeve-cuff pivot
          const wArm = weights.arm[idx];
          if (wArm > 0.001) {
            const du = nu - ARM_PIVOT.x;
            const dv = nv - ARM_PIVOT.y;
            const ru = ARM_PIVOT.x + du * cosArm - dv * sinArm;
            const rv = ARM_PIVOT.y + du * sinArm + dv * cosArm - 0.006 * Math.max(0, armAngle);
            nu = nu + (ru - nu) * wArm;
            nv = nv + (rv - nv) * wArm;
          }

          // 2. Cap tassel pendulum swing
          const wTassel = weights.tassel[idx];
          if (wTassel > 0.001) {
            const du = nu - TASSEL_PIVOT.x;
            const dv = nv - TASSEL_PIVOT.y;
            const ru = TASSEL_PIVOT.x + du * cosTassel - dv * sinTassel;
            const rv = TASSEL_PIVOT.y + du * sinTassel + dv * cosTassel;
            nu = nu + (ru - nu) * wTassel;
            nv = nv + (rv - nv) * wTassel;
          }

          // 3. Gentle celebratory body sway & breathing bounce (heels stay grounded at GROUND_PIVOT)
          const heightFactor = clamp((GROUND_PIVOT.y - nv) / 0.88, 0, 1);
          const duG = nu - GROUND_PIVOT.x;
          const dvG = nv - GROUND_PIVOT.y;
          const swayU = GROUND_PIVOT.x + duG * cosBody - dvG * sinBody;
          const swayV = GROUND_PIVOT.y + duG * sinBody + dvG * cosBody;
          nu = nu + (swayU - nu) * heightFactor;
          nv = nv + (swayV - nv) * heightFactor + bounceY * heightFactor;

          // 4. Subtle 3D cylindrical foreshortening cue when tilting left/right
          const centerDist = nu - 0.5;
          nu += ryNorm * 0.012 * (1 - Math.abs(centerDist) * 1.4);

          vx[idx] = padX + nu * drawW;
          vy[idx] = padY + nv * drawH;
        }
      }

      // Draw frame
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);

      // Soft ambient blush-champagne studio aura directly behind her
      const auraGrad = ctx.createRadialGradient(
        cw * (0.48 - ryNorm * 0.05),
        ch * 0.42,
        18,
        cw * 0.5,
        ch * 0.46,
        cw * 0.46
      );
      auraGrad.addColorStop(0, `rgba(246, 224, 228, ${0.42 + boost * 0.16})`);
      auraGrad.addColorStop(0.55, 'rgba(248, 234, 226, 0.16)');
      auraGrad.addColorStop(1, 'rgba(253, 251, 249, 0)');
      ctx.fillStyle = auraGrad;
      ctx.fillRect(0, 0, cw, ch);

      // Draw subtle sculpted 3D extrusion rim offset opposite to current 3D tilt
      const extrudeX = -ryNorm * 4.5;
      const extrudeY = (currentTiltRef.current.rx / 10) * 3.0 + 2.2;
      ctx.save();
      ctx.globalAlpha = 0.24;
      ctx.translate(extrudeX, extrudeY);
      const cellW = portrait.width / GRID_COLS;
      const cellH = portrait.height / GRID_ROWS;
      // Fast coarse rim pass (step 2) so 3D depth rim stays super smooth at 60fps
      for (let r = 0; r < GRID_ROWS; r += 2) {
        for (let c = 0; c < GRID_COLS; c += 2) {
          const i00 = r * (GRID_COLS + 1) + c;
          const i10 = i00 + 2;
          const i01 = (r + 2) * (GRID_COLS + 1) + c;
          const i11 = i01 + 2;
          const sx0 = c * cellW;
          const sy0 = r * cellH;
          const sx1 = (c + 2) * cellW;
          const sy1 = (r + 2) * cellH;
          drawTexturedTriangle(
            ctx,
            portrait.depthRim,
            sx0, sy0, sx1, sy0, sx0, sy1,
            vx[i00], vy[i00], vx[i10], vy[i10], vx[i01], vy[i01]
          );
          drawTexturedTriangle(
            ctx,
            portrait.depthRim,
            sx1, sy0, sx1, sy1, sx0, sy1,
            vx[i10], vy[i10], vx[i11], vy[i11], vx[i01], vy[i01]
          );
        }
      }
      ctx.restore();

      // Draw full high-resolution articulated 3D-sculpted character mesh
      for (let r = 0; r < GRID_ROWS; r += 1) {
        for (let c = 0; c < GRID_COLS; c += 1) {
          const i00 = r * (GRID_COLS + 1) + c;
          const i10 = i00 + 1;
          const i01 = (r + 1) * (GRID_COLS + 1) + c;
          const i11 = i01 + 1;

          const sx0 = c * cellW;
          const sy0 = r * cellH;
          const sx1 = (c + 1) * cellW;
          const sy1 = (r + 1) * cellH;

          drawTexturedTriangle(
            ctx,
            portrait.sprite,
            sx0, sy0, sx1, sy0, sx0, sy1,
            vx[i00], vy[i00], vx[i10], vy[i10], vx[i01], vy[i01]
          );
          drawTexturedTriangle(
            ctx,
            portrait.sprite,
            sx1, sy0, sx1, sy1, sx0, sy1,
            vx[i10], vy[i10], vx[i11], vy[i11], vx[i01], vy[i01]
          );
        }
      }

      // Draw delicate ambient champagne-gold & blush celebratory sparkles floating around her raised degree
      if (!prefersReducedMotion) {
        for (const sp of AMBIENT_SPARKLES) {
          const twinkle = 0.25 + 0.75 * Math.pow(0.5 + 0.5 * Math.sin(elapsed * sp.speed + sp.phase), 2);
          const x = sp.baseX * cw + Math.sin(elapsed * 0.9 + sp.phase) * sp.driftX;
          const y = sp.baseY * ch + Math.cos(elapsed * 1.1 + sp.phase) * sp.driftY;
          drawFourPointStar(
            ctx,
            x,
            y,
            sp.size * (0.75 + twinkle * 0.35 + boost * 0.2),
            elapsed * 0.4 + sp.phase,
            sp.color,
            twinkle * (0.65 + boost * 0.3)
          );
        }
      }

      // Update and render tap-to-celebrate blush petals & champagne confetti
      if (particlesRef.current.length > 0) {
        const alive: CelebrationParticle[] = [];
        for (const p of particlesRef.current) {
          p.life += dt;
          if (p.life >= p.maxLife) continue;
          p.vy += 0.0022 * dt; // soft floaty gravity
          p.vx *= 0.988;
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.vRot;
          const progress = p.life / p.maxLife;
          const fade = progress < 0.15 ? progress / 0.15 : 1 - (progress - 0.15) / 0.85;
          const px = p.x * cw;
          const py = p.y * ch;

          if (p.kind === 'sparkle') {
            drawFourPointStar(ctx, px, py, p.size, p.rotation, p.color, fade * p.alpha);
          } else if (p.kind === 'petal') {
            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(p.rotation);
            ctx.globalAlpha = clamp(fade * p.alpha, 0, 1);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size * 0.85, p.size * 0.45, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else {
            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(p.rotation);
            ctx.globalAlpha = clamp(fade * p.alpha, 0, 1);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size * 0.75, -p.size * 0.25, p.size * 1.5, p.size * 0.5);
            ctx.restore();
          }
          alive.push(p);
        }
        particlesRef.current = alive;
      }

      // Sync lightweight 3D perspective stage transform & floor shadow every 2nd frame
      frameCounter += 1;
      if (frameCounter % 2 === 0) {
        const rx = currentTiltRef.current.rx.toFixed(2);
        const ry = currentTiltRef.current.ry.toFixed(2);
        setStageTransform(`rotateX(${rx}deg) rotateY(${ry}deg)`);
        setShadowShift({
          x: -currentTiltRef.current.ry * 0.55,
          scale: 1 + bounceY * 8.5,
        });
      }

      rafId = window.requestAnimationFrame(render);
    };

    rafId = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(rafId);
  }, [active, isReady]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = clamp(((e.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
    const ny = clamp(((e.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
    pointerTiltRef.current = { x: nx, y: ny, active: true };
  };

  const handlePointerLeave = () => {
    pointerTiltRef.current.active = false;
  };

  const handleCelebrateClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (rect) {
      const ox = clamp((e.clientX - rect.left) / rect.width, 0.15, 0.85);
      const oy = clamp((e.clientY - rect.top) / rect.height, 0.12, 0.72);
      triggerCelebrationBurst(ox, oy, 26);
    } else {
      triggerCelebrationBurst();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerCelebrationBurst(0.28, 0.24, 26);
    }
  };

  const altText =
    lang === 'fr'
      ? 'Portrait 3D animé de Racheal Kache diplômée 2026 agitant joyeusement son diplôme'
      : 'Animated 3D graduation portrait of Racheal Kache Class of 2026 joyfully waving her rolled degree';

  const celebrateHint =
    lang === 'fr' ? 'Touchez pour célébrer' : 'Tap to celebrate';

  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[380px] mx-auto flex flex-col items-center select-none">
      <div
        ref={stageRef}
        role="button"
        tabIndex={0}
        aria-label={altText}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleCelebrateClick}
        onKeyDown={handleKeyDown}
        style={{ perspective: '1050px' }}
        className="group relative w-full aspect-[3/4] flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96476]/50 rounded-2xl"
      >
        {/* Dynamic sculpted blush-sepia floor shadow moving gently with her celebratory bounce & 3D tilt */}
        <div
          aria-hidden="true"
          style={{
            transform: `translate3d(calc(-50% + ${shadowShift.x.toFixed(1)}px), 0, 0) scale(${shadowShift.scale.toFixed(3)})`,
          }}
          className="pointer-events-none absolute bottom-[3.8%] left-1/2 w-[50%] h-6 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(136,88,96,0.28)_0%,rgba(190,136,144,0.12)_52%,rgba(253,251,249,0)_78%)] transition-transform duration-150 ease-out"
        />

        {isReady ? (
          <div
            style={{
              transform: stageTransform,
              transformStyle: 'preserve-3d',
            }}
            className="relative z-10 w-full h-full will-change-transform"
          >
            <canvas
              ref={canvasRef}
              aria-hidden="true"
              className="w-full h-full block pointer-events-none"
            />
          </div>
        ) : (
          <img
            src={PORTRAIT_SRC}
            alt={altText}
            referrerPolicy="no-referrer"
            onError={() => setLoadError(true)}
            className={`relative z-10 w-full h-full object-contain mix-blend-multiply pointer-events-none select-none ${
              loadError ? 'opacity-0' : 'opacity-100'
            }`}
          />
        )}
      </div>

      {/* Quiet, unboxed interactive celebration cue */}
      <button
        type="button"
        onClick={() => triggerCelebrationBurst(0.28, 0.24, 26)}
        className="mt-0.5 inline-flex items-center gap-1.5 text-[11px] tracking-[0.22em] uppercase text-[#B5828C] hover:text-[#C56375] transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96476]/40 rounded px-2 py-1"
      >
        <Sparkles className="w-3 h-3 text-[#D39E63]" />
        <span>{celebrateHint}</span>
      </button>
    </div>
  );
}
