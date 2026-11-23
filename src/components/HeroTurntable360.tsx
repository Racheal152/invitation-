import React, { useEffect, useState } from 'react';
import type { Language } from '../data/invitationContent';

interface HeroTurntable360Props {
  active: boolean;
  lang?: Language;
}

const FRONT_SRC = '/src/assets/images/racheal_2026_front.jpg';
const BACK_SRC = '/src/assets/images/racheal_2026_back.jpg';

interface CutoutPair {
  frontUrl: string;
  backUrl: string;
  edgeUrl: string;
}

/**
 * Loads an illustration and removes ONLY exterior paper background via
 * border-seeded BFS flood-fill so interior ivory highlights (diploma, skin,
 * 2026 lettering, bow necklace) stay 100% solid opaque. Also normalizes both
 * front and back portraits to identical cap-to-heel height and spine axis.
 */
function buildNormalizedCutout(
  img: HTMLImageElement,
  outW = 640,
  outH = 854
): { colorUrl: string; edgeUrl: string } | null {
  const workW = img.naturalWidth;
  const workH = img.naturalHeight;
  if (!workW || !workH) return null;

  const work = document.createElement('canvas');
  work.width = workW;
  work.height = workH;
  const ctx = work.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  ctx.drawImage(img, 0, 0, workW, workH);
  const imgData = ctx.getImageData(0, 0, workW, workH);
  const data = imgData.data;

  // Border-seeded BFS flood-fill to mark ONLY connected outer white paper pixels
  const total = workW * workH;
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
    const idx = y * workW + x;
    if (visited[idx]) return;
    visited[idx] = 1;
    if (isPaperLike(idx)) {
      isBg[idx] = 1;
      queue[tail++] = idx;
    }
  };

  for (let x = 0; x < workW; x += 1) {
    enqueue(x, 0);
    enqueue(x, workH - 1);
  }
  for (let y = 0; y < workH; y += 1) {
    enqueue(0, y);
    enqueue(workW - 1, y);
  }

  while (head < tail) {
    const idx = queue[head++];
    const x = idx % workW;
    const y = (idx - x) / workW;
    if (x > 0) enqueue(x - 1, y);
    if (x < workW - 1) enqueue(x + 1, y);
    if (y > 0) enqueue(x, y - 1);
    if (y < workH - 1) enqueue(x, y + 1);
  }

  // Softly feather 1px edge next to background so ink outlines remain silky anti-aliased
  let minY = workH;
  let maxY = 0;
  for (let y = 0; y < workH; y += 1) {
    for (let x = 0; x < workW; x += 1) {
      const idx = y * workW + x;
      const o = idx * 4;
      if (isBg[idx]) {
        data[o + 3] = 0;
      } else {
        // Check if adjacent to background for 1px smooth anti-alias feather
        const nearBg =
          (x > 0 && isBg[idx - 1]) ||
          (x < workW - 1 && isBg[idx + 1]) ||
          (y > 0 && isBg[idx - workW]) ||
          (y < workH - 1 && isBg[idx + workW]);
        if (nearBg) {
          const lum = 0.299 * data[o] + 0.587 * data[o + 1] + 0.114 * data[o + 2];
          if (lum > 205) {
            data[o + 3] = Math.round(255 * Math.max(0.15, (242 - lum) / 40));
          }
        }
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxY <= minY) return null;
  ctx.putImageData(imgData, 0, 0);

  // Compute stable spine/heels vertical axis (head top 19% + heels bottom 14%)
  const figH = maxY - minY;
  const headBottom = minY + Math.round(figH * 0.19);
  const footTop = maxY - Math.round(figH * 0.14);
  let wx = 0;
  let wt = 0;
  for (let y = minY; y <= maxY; y += 2) {
    const isFoot = y >= footTop;
    const isHead = y <= headBottom;
    if (!isFoot && !isHead) continue;
    const bandWeight = isFoot ? 2.4 : 1.0;
    for (let x = 0; x < workW; x += 2) {
      const idx = y * workW + x;
      if (!isBg[idx]) {
        const o = idx * 4;
        const lum = 0.299 * data[o] + 0.587 * data[o + 1] + 0.114 * data[o + 2];
        const w = Math.max(0.15, (255 - lum) / 255) * bandWeight;
        wx += x * w;
        wt += w;
      }
    }
  }

  const pivotX = wt > 0 ? wx / wt : workW * 0.5;

  // Draw onto normalized output canvas with exact locked top, heel baseline, and center axis
  const targetH = outH * 0.89;
  const targetTop = outH * 0.045;
  const scale = targetH / figH;
  const drawW = workW * scale;
  const drawH = workH * scale;
  const dx = outW * 0.5 - pivotX * scale;
  const dy = targetTop - minY * scale;

  const out = document.createElement('canvas');
  out.width = outW;
  out.height = outH;
  const outCtx = out.getContext('2d');
  if (!outCtx) return null;
  outCtx.drawImage(work, dx, dy, drawW, drawH);

  // Create subtle warm-sepia silhouette depth slice for realistic 3D figurine thickness
  const edge = document.createElement('canvas');
  edge.width = outW;
  edge.height = outH;
  const edgeCtx = edge.getContext('2d');
  if (!edgeCtx) return null;
  edgeCtx.drawImage(out, 0, 0);
  edgeCtx.globalCompositeOperation = 'source-in';
  edgeCtx.fillStyle = '#534643';
  edgeCtx.fillRect(0, 0, outW, outH);

  return {
    colorUrl: out.toDataURL('image/png'),
    edgeUrl: edge.toDataURL('image/png'),
  };
}

export function HeroTurntable360({ active, lang = 'en' }: HeroTurntable360Props) {
  const [cutouts, setCutouts] = useState<CutoutPair | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadImg = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.referrerPolicy = 'no-referrer';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    Promise.all([loadImg(FRONT_SRC), loadImg(BACK_SRC)])
      .then(([frontImg, backImg]) => {
        if (cancelled) return;
        const frontRes = buildNormalizedCutout(frontImg);
        const backRes = buildNormalizedCutout(backImg);
        if (frontRes && backRes) {
          setCutouts({
            frontUrl: frontRes.colorUrl,
            backUrl: backRes.colorUrl,
            edgeUrl: frontRes.edgeUrl,
          });
        } else {
          setLoadError(true);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const altText =
    lang === 'fr'
      ? 'Illustration fine de Racheal Kache diplômée 2026 tenant son diplôme en rotation fluide à 360 degrés'
      : 'Fine-line graduation fashion illustration of Racheal Kache Class of 2026 holding her rolled degree in smooth 360-degree rotation';

  return (
    <div className="relative w-full max-w-[330px] sm:max-w-[370px] mx-auto flex flex-col items-center select-none">
      <div
        className="relative w-full aspect-[3/4] flex items-center justify-center"
        style={{ perspective: '1150px' }}
      >
        {/* Soft blush-sepia watercolor shadow grounding her heels */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[4.5%] left-1/2 -translate-x-1/2 w-[46%] h-5 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(148,100,108,0.22)_0%,rgba(196,144,152,0.09)_55%,rgba(253,251,249,0)_78%)]"
        />

        {cutouts ? (
          <div
            role="img"
            aria-label={altText}
            className={`relative z-10 w-full h-full ${active ? 'animate-hero-turn-360' : ''}`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Subtle sculpted sepia depth layers so she never vanishes edge-on at 90°/270° */}
            <img
              src={cutouts.edgeUrl}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="pointer-events-none absolute inset-0 w-full h-full object-contain opacity-65"
              style={{ transform: 'translateZ(0px)' }}
            />
            <img
              src={cutouts.edgeUrl}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="pointer-events-none absolute inset-0 w-full h-full object-contain opacity-45"
              style={{ transform: 'translateZ(1.5px)' }}
            />
            <img
              src={cutouts.edgeUrl}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="pointer-events-none absolute inset-0 w-full h-full object-contain opacity-45"
              style={{ transform: 'translateZ(-1.5px)' }}
            />

            {/* Front Face (0°) — longer knee-grazing black dress & 2026 sash */}
            <img
              src={cutouts.frontUrl}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="pointer-events-none absolute inset-0 w-full h-full object-contain"
              style={{
                transform: 'translateZ(2.8px)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            />

            {/* Back Face (180°) — exact matched gown, braids, 2026 tassel & held-out degree */}
            <img
              src={cutouts.backUrl}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="pointer-events-none absolute inset-0 w-full h-full object-contain"
              style={{
                transform: 'rotateY(180deg) translateZ(2.8px)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            />
          </div>
        ) : (
          <img
            src={FRONT_SRC}
            alt={altText}
            referrerPolicy="no-referrer"
            onError={() => setLoadError(true)}
            className={`relative z-10 w-full h-full object-contain mix-blend-multiply pointer-events-none select-none ${
              loadError ? 'opacity-0' : 'opacity-100'
            }`}
          />
        )}
      </div>
    </div>
  );
}
