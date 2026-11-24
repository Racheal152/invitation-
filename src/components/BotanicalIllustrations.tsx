import React, { useState } from 'react';
import type { JourneyMilestone, ProgramItem } from '../data/invitationContent';

const INK = '#6E5A58';
const ROSE = '#E8B6BF';
const ROSE_DEEP = '#C97A89';
const GOLD_MUTED = '#D3A673';
const BLUSH = '#F7DFE4';

const RIBBON_BOW_IMG = '/src/assets/images/ribbon_bow_delicate_1795420504143.jpg';
const GRAD_RIBBON_DIVIDER_IMG = '/src/assets/images/grad_ribbon_divider_1795521905084.jpg';
const RIBBON_FLORAL_CREST_IMG = '/src/assets/images/ribbon_floral_crest_1795420504345.jpg';
const RIBBON_GARLAND_IMG = '/src/assets/images/ribbon_garland_divider_1795420504816.jpg';
const RIBBON_ARCH_IMG = '/src/assets/images/ribbon_draped_arch_1795420519353.jpg';

const JOURNEY_IMAGES: Record<JourneyMilestone['illustration'], { src: string; alt: string }> = {
  desk: {
    src: '/src/assets/images/story_campus_laptop_1795521906673.jpg',
    alt: 'Watercolor illustration of a university study corner with an open laptop, lined notebook, fountain pen, textbooks, coffee cup, and blush roses',
  },
  books: {
    src: '/src/assets/images/story_books_swe_1795426469491.jpg',
    alt: 'Watercolor illustration of stacked linen Software Engineering study books tied with a blush satin bow beside a coffee cup',
  },
  trunk: {
    src: '/src/assets/images/story_swe_internship_1795521905553.jpg',
    alt: 'Watercolor illustration of a Software Engineering internship workspace with an open laptop displaying code wireframes, spiral notebook, eyeglasses, coffee mug, and a blush rose',
  },
  arch: {
    src: '/src/assets/images/story_thesis_box_1795423193800.jpg',
    alt: 'Watercolor illustration of an open silk presentation box holding a graduation-cap-embossed rolled diploma and blush roses',
  },
  graduate: {
    src: '/src/assets/images/racheal_2026_front.jpg',
    alt: 'Fine-line ink and watercolor graduation fashion portrait of Racheal Kache Class of 2026 holding her rolled degree',
  },
};

const PROGRAM_IMAGES: Record<ProgramItem['illustration'], { src: string; alt: string }> = {
  flutes: {
    src: '/src/assets/images/program_grad_toast_1795521904909.jpg',
    alt: 'Watercolor sketch of two clinking rosé champagne flutes tied with pale blush satin bows and sage olive sprigs',
  },
  hall: {
    src: '/src/assets/images/program_sorbonne_hall_1795423196113.jpg',
    alt: 'Watercolor architectural sketch of the classical university hall framed by trees for morning matriculation',
  },
  cocktail: {
    src: '/src/assets/images/program_cocktail_glass_1795423194449.jpg',
    alt: 'Watercolor sketch of a crystal cocktail glass with olive garnish for afternoon refreshments',
  },
  dinner: {
    src: '/src/assets/images/program_dinner_plate_1795423193444.jpg',
    alt: 'Watercolor overhead sketch of a porcelain dinner plate with blush bow napkin, fork, and knife',
  },
  orb: {
    src: '/src/assets/images/program_speeches_mic_1795521915663.jpg',
    alt: 'Watercolor sketch of a vintage champagne-gold microphone beside blush-ribboned speech cards, a toast glass, and olive sprigs',
  },
  music: {
    src: '/src/assets/images/program_grad_music_1795521904851.jpg',
    alt: 'Watercolor sketch of a vinyl record peeking from a blush-ribboned paper sleeve with olive leaves and sketched musical notes',
  },
  farewell: {
    src: '/src/assets/images/program_grad_farewell_1795521905034.jpg',
    alt: 'Watercolor sketch of keepsake graduation Polaroid photos beside a golden tassel and a blush-ribboned bouquet of white lilies',
  },
};

const TRAVEL_LUGGAGE_IMG = '/src/assets/images/travel_luggage_sketch_1795423195581.jpg';

/**
 * Delicate dusty-rose fine-line graduation mortarboard cap with a tiny champagne-gold tassel.
 */
export function GradCapMark({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 5L2.5 9.8L12 14.6L21.5 9.8L12 5Z"
        stroke={ROSE_DEEP}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.4 12V16.4C6.4 17.6 8.9 19 12 19C15.1 19 17.6 17.6 17.6 16.4V12"
        stroke={ROSE_DEEP}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.5 10.9V16.2"
        stroke={GOLD_MUTED}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="19.5" cy="17.2" r="1.1" fill={GOLD_MUTED} />
    </svg>
  );
}

/**
 * Delicate symmetrical twin olive-laurel sprigs meeting at a tiny central graduation emblem.
 */
export function LaurelMark({ className = 'w-7 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 20" fill="none" className={className} aria-hidden="true">
      {/* Left olive sprig */}
      <path
        d="M18.5 13.5C13.5 13.2 8.2 10.6 4.5 6.5"
        stroke={ROSE_DEEP}
        strokeWidth="1.15"
        strokeLinecap="round"
      />
      <path
        d="M13 12C11.5 9.5 11.8 7.5 13.2 6.8M9 9.8C7.5 7.8 7.6 5.8 9 5M14.5 12.6C13.2 14.4 11.2 15.2 9.4 14.6"
        stroke={ROSE_DEEP}
        strokeWidth="1.05"
        strokeLinecap="round"
      />
      {/* Right olive sprig */}
      <path
        d="M21.5 13.5C26.5 13.2 31.8 10.6 35.5 6.5"
        stroke={ROSE_DEEP}
        strokeWidth="1.15"
        strokeLinecap="round"
      />
      <path
        d="M27 12C28.5 9.5 28.2 7.5 26.8 6.8M31 9.8C32.5 7.8 32.4 5.8 31 5M25.5 12.6C26.8 14.4 28.8 15.2 30.6 14.6"
        stroke={ROSE_DEEP}
        strokeWidth="1.05"
        strokeLinecap="round"
      />
      {/* Center champagne-gold knot / diamond */}
      <path
        d="M20 10.5L22.2 13L20 15.5L17.8 13L20 10.5Z"
        fill={BLUSH}
        stroke={GOLD_MUTED}
        strokeWidth="1.05"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Compact filled dusty-rose graduation cap & tassel node for vertical timeline rails.
 */
export function TasselDotMark({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
      <path d="M9 3.2L1.8 6.8L9 10.4L16.2 6.8L9 3.2Z" fill={ROSE_DEEP} />
      <path
        d="M4.8 8.8V12.1C4.8 13 6.7 14 9 14C11.3 14 13.2 13 13.2 12.1V8.8"
        stroke={ROSE_DEEP}
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path d="M14.8 7.7V11.8" stroke={GOLD_MUTED} strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="14.8" cy="12.6" r="1" fill={GOLD_MUTED} />
    </svg>
  );
}

export function TinyBowDivider() {
  const [failed, setFailed] = useState(false);

  return (
    <div className="flex items-center justify-center gap-3 my-5" aria-hidden="true">
      <span className="h-px w-14 sm:w-16 bg-[#EED4D9]" />
      {!failed ? (
        <img
          src={RIBBON_BOW_IMG}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="w-12 h-7 object-contain mix-blend-multiply select-none shrink-0"
        />
      ) : (
        <svg viewBox="0 0 40 24" className="w-7 h-4 shrink-0" fill="none">
          <path d="M20 11C17 7.5 11.5 6 9.5 9C8 11.3 12 14 20 12.2" fill={BLUSH} stroke={ROSE_DEEP} strokeWidth="0.9" />
          <path d="M20 11C23 7.5 28.5 6 30.5 9C32 11.3 28 14 20 12.2" fill={BLUSH} stroke={ROSE_DEEP} strokeWidth="0.9" />
          <circle cx="20" cy="11.6" r="1.8" fill={ROSE} stroke={ROSE_DEEP} strokeWidth="0.8" />
        </svg>
      )}
      <span className="h-px w-14 sm:w-16 bg-[#EED4D9]" />
    </div>
  );
}

export function GraduationRibbonDivider() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex items-center justify-center gap-4 my-4" aria-hidden="true">
        <span className="h-px w-24 bg-[#EED4D9]" />
        <GradCapMark className="w-5 h-5" />
        <span className="h-px w-24 bg-[#EED4D9]" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[360px] mx-auto overflow-hidden" aria-hidden="true">
      <img
        src={GRAD_RIBBON_DIVIDER_IMG}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="w-full h-24 sm:h-28 object-cover object-center mix-blend-multiply select-none"
      />
    </div>
  );
}

export function RibbonBowCrest({ withFlora = false }: { withFlora?: boolean }) {
  const [failed, setFailed] = useState(false);

  if (withFlora) {
    if (failed) {
      return <TinyBowDivider />;
    }
    return (
      <div
        className="w-full max-w-[270px] h-28 sm:h-32 mx-auto overflow-hidden flex items-end justify-center"
        aria-hidden="true"
      >
        <img
          src={RIBBON_FLORAL_CREST_IMG}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="w-[116%] max-w-none h-[142%] object-cover object-bottom translate-y-2 mix-blend-multiply select-none"
        />
      </div>
    );
  }

  if (failed) {
    return <TinyBowDivider />;
  }

  return (
    <div className="w-48 sm:w-56 h-20 sm:h-24 mx-auto overflow-hidden flex items-center justify-center" aria-hidden="true">
      <img
        src={RIBBON_BOW_IMG}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="w-full h-full object-contain scale-[1.12] mix-blend-multiply select-none"
      />
    </div>
  );
}

export function FloralGarlandDivider() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <TinyBowDivider />;
  }

  return (
    <div className="w-full max-w-[370px] mx-auto overflow-hidden" aria-hidden="true">
      <img
        src={RIBBON_GARLAND_IMG}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="w-full h-24 sm:h-28 object-cover object-center brightness-[1.04] contrast-[1.06] mix-blend-multiply select-none"
      />
    </div>
  );
}

export function DrapedTravelRibbon() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <TinyBowDivider />;
  }

  return (
    <div className="w-full max-w-[440px] mx-auto -mb-14 sm:-mb-20 overflow-hidden" aria-hidden="true">
      <img
        src={RIBBON_ARCH_IMG}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="w-full h-auto object-contain mix-blend-multiply select-none"
      />
    </div>
  );
}

export function TinyTipBow() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <GradCapMark className="w-4 h-4" />;
  }

  return (
    <img
      src={RIBBON_BOW_IMG}
      alt=""
      aria-hidden="true"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="w-11 h-6 object-contain mix-blend-multiply select-none"
    />
  );
}

export function JourneyIllustration({ type }: { type: JourneyMilestone['illustration'] }) {
  const [failed, setFailed] = useState(false);
  const asset = JOURNEY_IMAGES[type];

  if (failed) {
    return (
      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-[#FAF2F4] border border-[#EED9DD] flex items-center justify-center shrink-0">
        <GradCapMark className="w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center">
      <img
        src={asset.src}
        alt={asset.alt}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="w-full h-full object-contain mix-blend-multiply select-none"
      />
    </div>
  );
}

export function ProgramIllustration({ type }: { type: ProgramItem['illustration'] }) {
  const [failed, setFailed] = useState(false);
  const asset = PROGRAM_IMAGES[type];

  if (failed) {
    return (
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#FAF2F4] border border-[#EED9DD] flex items-center justify-center">
        <GradCapMark className="w-5 h-5" />
      </div>
    );
  }

  return (
    <div className="w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
      <img
        src={asset.src}
        alt={asset.alt}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="w-full h-full object-contain mix-blend-multiply select-none"
      />
    </div>
  );
}

export function TravelHeaderIllustration() {
  const [failed, setFailed] = useState(false);

  return (
    <div className="flex items-end justify-between gap-2 my-5 px-1">
      <div className="w-32 h-32 sm:w-36 sm:h-36 shrink-0 flex items-center justify-center">
        {!failed ? (
          <img
            src={TRAVEL_LUGGAGE_IMG}
            alt="Watercolor illustration of stacked vintage travel suitcases topped with blush roses and a satin ribbon bow"
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className="w-full h-full object-contain mix-blend-multiply select-none"
          />
        ) : (
          <div className="w-28 h-28 rounded-2xl bg-[#FAF2F4] border border-[#EED9DD] flex items-center justify-center">
            <GradCapMark className="w-6 h-6" />
          </div>
        )}
      </div>

      <svg viewBox="0 0 160 80" className="w-36 sm:w-44 h-20 shrink-0 mb-3" fill="none" aria-hidden="true">
        <path
          d="M6 58C34 72 62 60 70 42C75 30 61 23 54 32C47 41 64 56 94 49C116 44 130 30 138 19"
          stroke={ROSE_DEEP}
          strokeWidth="1.05"
          strokeDasharray="3.5 3.5"
          strokeLinecap="round"
        />
        <g transform="translate(134 9) rotate(-26)">
          <path
            d="M0 7.5L18 5L0 2.5L3.5 5L0 7.5Z"
            fill={BLUSH}
            stroke={INK}
            strokeWidth="0.9"
            strokeLinejoin="round"
          />
          <path d="M7 5L4.5 0L10.5 4.4" stroke={INK} strokeWidth="0.85" strokeLinejoin="round" />
          <path d="M7 5L4.5 10L10.5 5.6" stroke={INK} strokeWidth="0.85" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

export function VenueMapPreview({
  venueName,
  mapsUrl,
}: {
  venueName: string;
  mapsUrl: string;
}) {
  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${venueName} on Google Maps`}
      className="group relative block w-full h-44 rounded-xl overflow-hidden border border-[#EBDADF] bg-[#EAF2EE] my-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C56B7A]"
    >
      <svg viewBox="0 0 420 200" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" fill="none">
        <rect width="420" height="200" fill="#F2EFEA" />
        <path d="M0 120C45 112 78 135 95 200H0V120Z" fill="#D4EAD8" />
        <path d="M270 10C318 8 368 25 420 18V95C368 92 318 76 270 72V10Z" fill="#D7ECDC" />
        <path d="M0 24C108 10 218 42 420 16V40C220 66 108 32 0 48V24Z" fill="#C9E2F5" />
        <rect x="115" y="64" width="66" height="44" rx="4" fill="#E6E1DA" />
        <rect x="195" y="74" width="84" height="50" rx="4" fill="#E8DFE0" />
        <rect x="122" y="122" width="60" height="52" rx="4" fill="#E6E1DA" />
        <rect x="292" y="102" width="82" height="58" rx="4" fill="#E6E1DA" />
        <path d="M0 106L420 82" stroke="#FFFFFF" strokeWidth="9" />
        <path d="M0 106L420 82" stroke="#F8E2C8" strokeWidth="4" />
        <path d="M186 0L198 200" stroke="#FFFFFF" strokeWidth="10" />
        <path d="M286 0L272 200" stroke="#FFFFFF" strokeWidth="7" />
        <path d="M84 44L114 200" stroke="#FFFFFF" strokeWidth="6" />
        <path d="M108 164L420 148" stroke="#FFFFFF" strokeWidth="6" />
        <text x="26" y="101" fill="#8B7E7C" fontSize="9.5" fontFamily="DM Sans, sans-serif" letterSpacing="0.06em" transform="rotate(-3.2 26 101)">
          NAIROBI · KENYA
        </text>
        <text x="150" y="168" fill="#8B7E7C" fontSize="8.5" fontFamily="DM Sans, sans-serif" letterSpacing="0.05em" transform="rotate(86 150 168)">
          PP8H+Q7V
        </text>
        <text x="304" y="48" fill="#688B72" fontSize="8.5" fontFamily="DM Sans, sans-serif">
          Garden Courtyard
        </text>
        <text x="14" y="176" fill="#688B72" fontSize="8.5" fontFamily="DM Sans, sans-serif">
          Quiet Residential Lane
        </text>
        <g transform="translate(232 91)">
          <ellipse cx="0" cy="4" rx="13" ry="5" fill="#C9596C" fillOpacity="0.28" className="animate-pin-ring" />
          <ellipse cx="0" cy="4" rx="11" ry="4" fill="#C56B7A" fillOpacity="0.22" />
          <path
            d="M0 -30C-9 -30 -16 -23 -16 -14C-16 -3 0 4 0 4C0 4 16 -3 16 -14C16 -23 9 -30 0 -30Z"
            fill="#C9596C"
            stroke="#FFFFFF"
            strokeWidth="2"
          />
          <circle cx="0" cy="-14" r="5" fill="#FFFFFF" />
        </g>
        <g transform="translate(250 70)">
          <rect x="0" y="0" width="140" height="32" rx="6" fill="#FFFFFF" fillOpacity="0.94" stroke="#EED8DC" strokeWidth="1" />
          <text x="10" y="14" fill="#B5495C" fontSize="10" fontWeight="600" fontFamily="DM Sans, sans-serif">
            Private Residence
          </text>
          <text x="10" y="25" fill="#7D6F6D" fontSize="8.5" fontFamily="DM Sans, sans-serif">
            PP8H+Q7V · Nairobi
          </text>
        </g>
      </svg>

      <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded bg-white/95 px-2.5 py-1 text-[11px] font-medium text-[#5A4F4D] shadow-sm border border-[#EDE0E2]">
        Maps ↗
      </span>
    </a>
  );
}
