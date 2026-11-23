import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface EnvelopeCoverProps {
  isOpen: boolean;
  onStartOpen: () => void;
  onRevealHero: () => void;
  onCompleteOpen: () => void;
  tapToOpenLabel: string;
  monogramAriaLabel: string;
}

const ENVELOPE_IMG = '/src/assets/images/wax_seal_envelope_rk_1795426319887.jpg';

// Exact scalloped flap & RK wax seal contour for the 768x1376 artwork.
// Inside an aspect-locked 768/1376 full-screen cover stage, these coordinates stay
// pixel-aligned on every phone, tablet, and desktop viewport.
const UPPER_FLAP_CLIP =
  'polygon(0% 0%, 100% 0%, 100% 35.1%, 94.5% 37.9%, 88.5% 43.1%, 81.5% 45.9%, 75.5% 47.1%, 69.5% 50.1%, 66.8% 52.6%, 63.5% 56.6%, 58% 59.7%, 50% 61.1%, 42% 59.7%, 36.5% 56.6%, 33.2% 52.6%, 30.5% 50.1%, 24.5% 47.1%, 18.5% 45.9%, 11.5% 43.1%, 5.5% 37.9%, 0% 35.1%)';

const LOWER_POCKET_CLIP =
  'polygon(0% 34.7%, 5.5% 37.5%, 11.5% 42.7%, 18.5% 45.5%, 24.5% 46.7%, 30.5% 49.7%, 33.2% 52.2%, 36.5% 56.2%, 42% 59.3%, 50% 60.7%, 58% 59.3%, 63.5% 56.2%, 66.8% 52.2%, 69.5% 49.7%, 75.5% 46.7%, 81.5% 45.5%, 88.5% 42.7%, 94.5% 37.5%, 100% 34.7%, 100% 100%, 0% 100%)';

const SILK_EASE: [number, number, number, number] = [0.24, 0.06, 0.18, 1];

type IntroStage = 'sealed' | 'opening' | 'dissolving';

export function EnvelopeCover({
  isOpen,
  onStartOpen,
  onRevealHero,
  onCompleteOpen,
  tapToOpenLabel,
  monogramAriaLabel,
}: EnvelopeCoverProps) {
  const [imgError, setImgError] = useState(false);
  const [stage, setStage] = useState<IntroStage>('sealed');
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  useEffect(() => {
    if (!isOpen) {
      clearTimers();
      setStage('sealed');
    }
    return () => clearTimers();
  }, [isOpen]);

  const schedule = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
  };

  const handleTapEnvelope = () => {
    if (stage !== 'sealed' || isOpen) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    onStartOpen();

    if (prefersReducedMotion) {
      setStage('dissolving');
      onRevealHero();
      schedule(() => onCompleteOpen(), 750);
      return;
    }

    // Phase 1 (0s -> 2.65s): Slow full-screen scalloped flap lift with V-crease interior depth
    // and luminous warm ivory bloom washing gracefully across the envelope (matching intro.mp4)
    setStage('opening');

    // Phase 2 (2.55s -> 3.9s): At peak warm ivory bloom, reveal the live Hero and dissolve the veil slowly
    schedule(() => {
      onRevealHero();
      setStage('dissolving');
    }, 2550);

    // Phase 3: Cleanly unmount once the luminous ivory veil has completely melted away
    schedule(() => {
      onCompleteOpen();
    }, 3950);
  };

  const isOpening = stage !== 'sealed';
  const isDissolving = stage === 'dissolving';

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          key="envelope-cover"
          initial={{ opacity: 1 }}
          animate={{ opacity: isDissolving ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: isDissolving ? 1.35 : 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`fixed inset-0 z-50 overflow-hidden ${
            isDissolving ? 'pointer-events-none' : 'pointer-events-auto'
          }`}
        >
          {/* Full-screen interactive envelope cover */}
          <button
            type="button"
            onClick={handleTapEnvelope}
            disabled={isOpening}
            aria-label={monogramAriaLabel}
            className="group relative w-full h-full flex items-center justify-center overflow-hidden cursor-pointer disabled:cursor-default focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#C56B7A]/60 bg-[#F4DDD5] select-none"
          >
            {!imgError ? (
              /* Aspect-locked 768/1376 full-screen cover stage with subtle cinematic push-in */
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: isOpening ? 1.055 : 1 }}
                transition={{
                  duration: 2.75,
                  ease: [0.22, 0.08, 0.2, 1],
                }}
                style={{
                  width: 'max(100vw, calc(100dvh * 768 / 1376))',
                  height: 'max(100dvh, calc(100vw * 1376 / 768))',
                  perspective: '1500px',
                }}
                className="relative shrink-0 will-change-transform"
              >
                {/* LAYER 0: Warm Interior Envelope Liner + Authentic V-Crease Fold Shadow revealed as the flap lifts */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_46%,#FAF1EB_0%,#F2DFD6_54%,#E8CEC4_100%)]"
                >
                  {/* Soft warm rose-terracotta V-pocket depth shadows along both diagonals under the lifting scalloped flap */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isOpening ? [0, 0.78, 0.55] : 0 }}
                    transition={{
                      duration: 2.45,
                      delay: isOpening ? 0.25 : 0,
                      times: isOpening ? [0, 0.58, 1] : undefined,
                      ease: 'easeInOut',
                    }}
                    className="absolute inset-0 bg-[linear-gradient(150deg,rgba(146,84,72,0.52)_0%,rgba(164,102,88,0.22)_26%,transparent_48%),linear-gradient(210deg,rgba(146,84,72,0.52)_0%,rgba(164,102,88,0.22)_26%,transparent_48%)]"
                  />
                  {/* Soft warm inner sunlight glow rising from the center of the opening envelope */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: isOpening ? 1 : 0,
                      scale: isOpening ? 1.15 : 0.9,
                    }}
                    transition={{
                      duration: 2.2,
                      delay: isOpening ? 0.5 : 0,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_44%,rgba(255,253,250,0.92)_0%,rgba(253,247,242,0.55)_42%,transparent_72%)]"
                  />
                </div>

                {/* LAYER 1: Intact Resting Envelope Photograph (zero seam at idle, instant smooth handoff on tap) */}
                <motion.img
                  src={ENVELOPE_IMG}
                  alt="Warm blush embossed floral graduation envelope sealed with an RK wax monogram"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: isOpening ? 0 : 1 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                  className="pointer-events-none absolute inset-0 z-30 w-full h-full object-fill transition-transform duration-1000 ease-out group-hover:scale-[1.008]"
                />

                {/* LAYER 2: Lower Embossed Pocket — stays grounded in place just like intro.mp4 */}
                <div
                  style={{ clipPath: LOWER_POCKET_CLIP }}
                  className="pointer-events-none absolute inset-0 z-10"
                >
                  <img
                    src={ENVELOPE_IMG}
                    alt=""
                    aria-hidden="true"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-fill"
                  />
                  {/* Realistic soft V-crease lip shadow cast onto the lower scalloped pocket as the upper flap lifts */}
                  <motion.div
                    aria-hidden="true"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isOpening ? [0, 0.52, 0.22] : 0 }}
                    transition={{
                      duration: 2.35,
                      delay: isOpening ? 0.2 : 0,
                      times: isOpening ? [0, 0.52, 1] : undefined,
                      ease: 'easeInOut',
                    }}
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(152deg,rgba(128,70,58,0.48)_28%,transparent_49%),linear-gradient(208deg,rgba(128,70,58,0.48)_28%,transparent_49%)]"
                  />
                </div>

                {/* LAYER 3: Upper Scalloped Flap + RK Wax Seal — hinges slowly upward in 3D while catching warm light */}
                <motion.div
                  initial={{ rotateX: 0, y: '0%' }}
                  animate={
                    isOpening
                      ? {
                          rotateX: [0, 20, 62],
                          y: ['0%', '-1.5%', '-6.5%'],
                        }
                      : { rotateX: 0, y: '0%' }
                  }
                  transition={{
                    rotateX: {
                      duration: 2.45,
                      delay: isOpening ? 0.18 : 0,
                      times: isOpening ? [0, 0.36, 1] : undefined,
                      ease: SILK_EASE,
                    },
                    y: {
                      duration: 2.45,
                      delay: isOpening ? 0.18 : 0,
                      times: isOpening ? [0, 0.36, 1] : undefined,
                      ease: SILK_EASE,
                    },
                  }}
                  style={{
                    transformOrigin: '50% 0%',
                    transformStyle: 'preserve-3d',
                  }}
                  className="pointer-events-none absolute inset-0 z-20 will-change-transform"
                >
                  <div
                    style={{ clipPath: UPPER_FLAP_CLIP }}
                    className="absolute inset-0"
                  >
                    <img
                      src={ENVELOPE_IMG}
                      alt=""
                      aria-hidden="true"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-fill"
                    />
                    {/* Luminous light catching the lifting flap as it tilts upward (exact intro.mp4 glow) */}
                    <motion.div
                      aria-hidden="true"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isOpening ? 0.72 : 0 }}
                      transition={{
                        duration: 1.9,
                        delay: isOpening ? 0.55 : 0,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,252,249,0.72)_0%,rgba(255,250,246,0.88)_65%,rgba(255,253,251,0.96)_100%)]"
                    />
                  </div>
                </motion.div>

                {/* LAYER 4: Soft Dreamy Warm-Ivory Sunlight Bloom sweeping over the entire envelope (exact intro.mp4 frames 9-11) */}
                <motion.div
                  aria-hidden="true"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isOpening ? 1 : 0 }}
                  transition={{
                    duration: 1.5,
                    delay: isOpening ? 1.15 : 0,
                    ease: [0.35, 0.04, 0.25, 1],
                  }}
                  className="pointer-events-none absolute inset-0 z-35 bg-[radial-gradient(ellipse_at_50%_42%,#FFFFFF_0%,#FDFBF9_48%,#FAF2EC_100%)]"
                />

                {/* Quiet breathing halo around the central RK wax seal while waiting */}
                <motion.span
                  aria-hidden="true"
                  animate={{
                    opacity: isOpening ? 0 : 1,
                    scale: isOpening ? 1.12 : 1,
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="pointer-events-none absolute left-1/2 top-[51%] -translate-x-1/2 -translate-y-1/2 z-40 w-[32%] aspect-square rounded-full animate-seal-breathe"
                />
              </motion.div>
            ) : (
              <motion.div
                animate={{ opacity: isOpening ? 0 : 1, scale: isOpening ? 1.04 : 1 }}
                transition={{ duration: 1.8, ease: SILK_EASE }}
                className="w-full h-full bg-[radial-gradient(circle_at_50%_45%,#F6E0D7_0%,#E8C3B9_100%)] flex items-center justify-center"
              >
                <div className="w-36 h-36 rounded-full bg-[#ECCAC2] border-4 border-[#DFB5AC] shadow-xl flex items-center justify-center">
                  <span className="font-serif-editorial text-4xl tracking-wider text-[#9A655D]">
                    RK
                  </span>
                </div>
              </motion.div>
            )}

            {/* Whisper-quiet TAP TO OPEN prompt near the bottom of the full-screen envelope */}
            <motion.div
              aria-hidden="true"
              animate={{
                opacity: isOpening ? 0 : 1,
                y: isOpening ? 10 : 0,
              }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-36 bg-gradient-to-t from-[#B9877E]/38 via-[#C7978E]/10 to-transparent flex flex-col items-center justify-end pb-9 sm:pb-11"
            >
              <span className="font-serif-editorial text-sm sm:text-[15px] tracking-[0.38em] text-white/95 drop-shadow-[0_1px_8px_rgba(112,64,58,0.48)] transition-transform duration-500 group-hover:-translate-y-0.5 uppercase">
                {tapToOpenLabel}
              </span>
            </motion.div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
