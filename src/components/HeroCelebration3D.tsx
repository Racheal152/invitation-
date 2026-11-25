import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import type { Language } from '../data/invitationContent';

interface HeroCelebration3DProps {
  active: boolean;
  lang?: Language;
}

const POSE_FRAMES = [
  {
    id: 'poised',
    src: '/src/assets/images/racheal_2026_front.jpg',
    liftY: 0,
  },
  {
    id: 'smile-lift',
    src: '/src/assets/images/racheal_pose_mid_1795518176373.jpg',
    liftY: -2,
  },
  {
    id: 'cheer-hands-up',
    src: '/src/assets/images/racheal_pose_cheer_1795518173585.jpg',
    liftY: -4,
  },
] as const;

// Hand-drawn editorial illustration choreography:
// Poised -> Smiling & lifting hands (right foot step) -> Beaming cheer with both hands raised (left heel pop) -> Smiling sway -> Poised
const CHOREOGRAPHY: Array<{ frameIndex: number; durationMs: number }> = [
  { frameIndex: 0, durationMs: 1350 },
  { frameIndex: 1, durationMs: 900 },
  { frameIndex: 2, durationMs: 1850 },
  { frameIndex: 1, durationMs: 850 },
];

export function HeroCelebration3D({ active, lang = 'en' }: HeroCelebration3DProps) {
  const [step, setStep] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  // Preload all three pose illustrations so transitions are completely seamless
  useEffect(() => {
    let cancelled = false;
    let count = 0;
    POSE_FRAMES.forEach((frame) => {
      const img = new Image();
      img.referrerPolicy = 'no-referrer';
      const done = () => {
        if (cancelled) return;
        count += 1;
        setLoadedCount(count);
      };
      img.onload = done;
      img.onerror = done;
      img.src = frame.src;
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const allReady = loadedCount >= POSE_FRAMES.length;

  // Step through the natural hand-illustrated gesture cycle
  useEffect(() => {
    if (!active || !allReady || reducedMotion) return;
    const currentDuration = CHOREOGRAPHY[step].durationMs;
    const timer = window.setTimeout(() => {
      setStep((prev) => (prev + 1) % CHOREOGRAPHY.length);
    }, currentDuration);
    return () => window.clearTimeout(timer);
  }, [active, allReady, reducedMotion, step]);

  const activeFrameIndex = reducedMotion ? 2 : CHOREOGRAPHY[step].frameIndex;
  const activeLiftY = reducedMotion ? 0 : POSE_FRAMES[activeFrameIndex].liftY;

  const altText =
    lang === 'sw'
      ? 'Mchoro wenye uhuishaji wa Racheal Kache Darasa la 2026 akitabasamu na kuinua mikono akiwa na shahada yake'
      : 'Animated illustration of Racheal Kache Class of 2026 smiling warmly and raising her hands with her rolled degree';

  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[380px] mx-auto flex flex-col items-center select-none">
      <div
        role="img"
        aria-label={altText}
        className="relative w-full aspect-[3/4] flex items-center justify-center"
      >
        {/* Subtle grounded watercolor floor shadow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[3.2%] left-1/2 -translate-x-1/2 w-[46%] h-4 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(136,88,96,0.18)_0%,rgba(190,136,144,0.07)_55%,rgba(253,251,249,0)_80%)]"
        />

        {/* Layered hand-drawn pose frames blended cleanly into the ivory invitation paper */}
        <motion.div
          animate={{ y: activeLiftY }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full h-full"
        >
          {POSE_FRAMES.map((frame, index) => {
            const isCurrent = index === activeFrameIndex;
            return (
              <img
                key={frame.id}
                src={frame.src}
                alt={index === 0 ? altText : ''}
                aria-hidden={index === 0 ? undefined : true}
                referrerPolicy="no-referrer"
                className={`absolute inset-0 w-full h-full object-contain mix-blend-multiply pointer-events-none select-none transition-opacity duration-[180ms] ease-out ${
                  isCurrent ? 'opacity-100' : 'opacity-0'
                }`}
              />
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
