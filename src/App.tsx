import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, MotionConfig, useScroll, useSpring } from 'motion/react';
import {
  Globe,
  Volume2,
  VolumeX,
  ChevronDown,
  Clock,
  MapPin,
  Navigation,
  CalendarPlus,
  Sparkles,
  Mail,
  Check,
  Gift,
} from 'lucide-react';
import { INVITATION_CONTENT, type Language } from './data/invitationContent';
import { EnvelopeCover } from './components/EnvelopeCover';
import { FloatingPetals } from './components/FloatingPetals';
import { HeroCelebration3D } from './components/HeroCelebration3D';
import { CountdownTimer } from './components/CountdownTimer';
import { RsvpSection } from './components/RsvpSection';
import {
  HeartMark,
  TinyBowDivider,
  RibbonHeartDivider,
  RibbonBowCrest,
  FloralGarlandDivider,
  JourneyIllustration,
  ProgramIllustration,
  VenueMapPreview,
} from './components/BotanicalIllustrations';
import { ambientMusic } from './utils/audio';
import { downloadGraduationCalendarEvent } from './utils/calendar';

const VENUE_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=PP8H%2BQ7V+Nairobi';

const EDITORIAL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const VIEWPORT_ONCE = { once: true, amount: 0.2 } as const;

export default function App() {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [heroRevealed, setHeroRevealed] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  const [musicOn, setMusicOn] = useState(false);
  const [calendarDownloaded, setCalendarDownloaded] = useState(false);
  const [isGiftListOpen, setIsGiftListOpen] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const journeyRailRef = useRef<HTMLDivElement | null>(null);
  const programRailRef = useRef<HTMLDivElement | null>(null);

  // Page reading-progress silk thread
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    restDelta: 0.001,
  });

  // Scroll-drawn vertical timeline rails for Journey & Day Program
  const { scrollYProgress: journeyProgress } = useScroll({
    target: journeyRailRef,
    offset: ['start 80%', 'end 65%'],
  });
  const smoothJourneyScale = useSpring(journeyProgress, {
    stiffness: 90,
    damping: 24,
  });

  const { scrollYProgress: programProgress } = useScroll({
    target: programRailRef,
    offset: ['start 80%', 'end 65%'],
  });
  const smoothProgramScale = useSpring(programProgress, {
    stiffness: 90,
    damping: 24,
  });

  const copy = INVITATION_CONTENT[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    return () => {
      ambientMusic.stop();
    };
  }, []);

  const handleStartOpenEnvelope = () => {
    const started = ambientMusic.start();
    setMusicOn(started);
  };

  const handleRevealHero = () => {
    // Smoothly settle the live Hero into place right as the rising ivory card dissolves
    setHeroRevealed(true);
  };

  const handleCompleteOpenEnvelope = () => {
    setEnvelopeOpen(true);
    setHeroRevealed(true);
  };

  const handleReplayEnvelope = () => {
    window.scrollTo({ top: 0 });
    setHeroRevealed(false);
    setEnvelopeOpen(false);
  };

  const handleToggleMusic = () => {
    const playing = ambientMusic.toggle();
    setMusicOn(playing);
  };

  const handleToggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'fr' : 'en'));
  };

  const handleScrollToRsvp = () => {
    document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownloadCalendar = () => {
    downloadGraduationCalendarEvent();
    setCalendarDownloaded(true);
    window.setTimeout(() => setCalendarDownloaded(false), 2600);
  };

  const markImageFailed = (key: string) => {
    setFailedImages((prev) => ({ ...prev, [key]: true }));
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,#FBF0EC_0%,#F2DCD4_52%,#F6E4DD_100%)] text-[#4E4341]">
        {/* Delicate drifting blush petals in the outer ambient backdrop */}
        <FloatingPetals />

        {/* Full-viewport embossed blush wax-seal envelope with slow luminous unfold */}
        <EnvelopeCover
          isOpen={envelopeOpen}
          onStartOpen={handleStartOpenEnvelope}
          onRevealHero={handleRevealHero}
          onCompleteOpen={handleCompleteOpenEnvelope}
          tapToOpenLabel={copy.cover.tapToOpen}
          monogramAriaLabel={copy.cover.monogramLabel}
        />

        {/* Quiet left-margin chapter index on wide desktop screens (1280px+) */}
        {envelopeOpen && (
          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: EDITORIAL_EASE }}
            aria-label="Invitation sections"
            className="hidden xl:flex fixed left-8 top-1/2 -translate-y-1/2 z-30 flex-col gap-3.5 text-[11px] tracking-[0.2em] uppercase text-[#9A7A76]"
          >
            {[
              { href: '#journey', label: copy.nav.story },
              { href: '#program', label: copy.nav.program },
              { href: '#details', label: copy.nav.details },
              { href: '#rsvp', label: copy.nav.rsvp },
            ].map((item, idx) => (
              <motion.a
                key={item.href}
                href={item.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + idx * 0.06, ease: EDITORIAL_EASE }}
                whileHover={{ x: 4 }}
                className="hover:text-[#B95768] transition-colors whitespace-nowrap"
              >
                {item.label}
              </motion.a>
            ))}
            <motion.button
              type="button"
              onClick={handleReplayEnvelope}
              whileHover={{ x: 4 }}
              className="mt-3 pt-3 border-t border-[#E3C8C0] text-left text-[10px] tracking-[0.22em] text-[#AC8882] hover:text-[#B95768] transition-colors cursor-pointer whitespace-nowrap"
            >
              {copy.cover.replayEnvelope}
            </motion.button>
          </motion.aside>
        )}

        {/* Main Centered Editorial Stationery Sheet */}
        <div className="relative z-10 sm:py-8 md:py-12 sm:px-4 flex justify-center">
          <main className="relative w-full max-w-[540px] md:max-w-[580px] bg-[#FDFBF9] sm:rounded-[34px] shadow-[0_28px_90px_rgba(145,86,98,0.16)] border border-[#F3E2E5]/90 overflow-hidden">
            {/* Ultra-delicate silk scroll-progress ribbon along top edge of sheet */}
            {envelopeOpen && (
              <div
                aria-hidden="true"
                className="sticky top-0 z-40 h-[2.5px] w-full bg-transparent overflow-hidden pointer-events-none"
              >
                <motion.div
                  style={{ scaleX: smoothProgress, transformOrigin: '0% 50%' }}
                  className="h-full w-full bg-gradient-to-r from-[#E6B8C1] via-[#C96476] to-[#DFB07C]"
                />
              </div>
            )}

            {/* Floating Language Switcher (top-right inside invitation) */}
            <div className="sticky top-4 z-30 flex justify-end px-4 sm:px-5 h-0 overflow-visible pointer-events-none">
              <motion.button
                type="button"
                onClick={handleToggleLanguage}
                whileHover={{ y: -1, scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                aria-label={
                  lang === 'en' ? 'Switch invitation to French' : 'Switch invitation to English'
                }
                className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#EDE0E2] px-3.5 py-1.5 text-[11px] font-medium tracking-wider text-[#5A4D4B] shadow-sm hover:border-[#D497A3] hover:text-[#B95768] transition-colors cursor-pointer whitespace-nowrap"
              >
                <Globe className="w-3.5 h-3.5 text-[#8A7578]" />
                <span>{lang === 'en' ? 'FR' : 'EN'}</span>
              </motion.button>
            </div>

            {/* =========================================================
                1. HERO SECTION — LIVE BEHIND THE OPENING ENVELOPE
               ========================================================= */}
            <section className="relative min-h-[88vh] sm:min-h-[800px] flex flex-col items-center justify-between pt-14 pb-8 px-6 text-center">
              <div className="mt-2">
                <motion.p
                  initial={false}
                  animate={heroRevealed ? { y: 0, scale: 1 } : { y: 12, scale: 0.97 }}
                  transition={{ duration: 1.6, delay: 0.25, ease: EDITORIAL_EASE }}
                  className="text-[11px] sm:text-xs tracking-[0.28em] text-[#C87A88] uppercase"
                >
                  {copy.hero.kicker}
                </motion.p>
                <motion.h1
                  initial={false}
                  animate={heroRevealed ? { y: 0, scale: 1 } : { y: 16, scale: 0.96 }}
                  transition={{ duration: 1.75, delay: 0.35, ease: EDITORIAL_EASE }}
                  className="mt-3 font-script text-5xl sm:text-[62px] leading-[1.1] text-[#C66E7D] font-normal"
                >
                  {copy.hero.graduateName}
                </motion.h1>
                <motion.p
                  initial={false}
                  animate={heroRevealed ? { y: 0 } : { y: 14 }}
                  transition={{ duration: 1.65, delay: 0.45, ease: EDITORIAL_EASE }}
                  className="mt-2 font-serif-editorial italic text-[16px] sm:text-[17px] text-[#7D6C6A] max-w-xs mx-auto leading-snug"
                >
                  {copy.hero.degree}
                </motion.p>
                <motion.p
                  initial={false}
                  animate={heroRevealed ? { y: 0 } : { y: 12 }}
                  transition={{ duration: 1.6, delay: 0.55, ease: EDITORIAL_EASE }}
                  className="mt-2.5 text-[11px] sm:text-xs tracking-[0.26em] text-[#C87A88] uppercase"
                >
                  {copy.hero.date}
                </motion.p>
              </div>

              {/* Centerpiece 3D Sculpted Celebratory Graduation Portrait (waving degree + interactive confetti) */}
              <motion.div
                initial={false}
                animate={heroRevealed ? { scale: 1, y: 0 } : { scale: 0.95, y: 16 }}
                transition={{ duration: 1.85, delay: 0.4, ease: EDITORIAL_EASE }}
                className="w-full my-2 flex items-center justify-center"
              >
                <HeroCelebration3D active={heroRevealed} lang={lang} />
              </motion.div>

              {/* Confirm Attendance Scroll Prompt */}
              <motion.button
                type="button"
                onClick={handleScrollToRsvp}
                initial={false}
                animate={heroRevealed ? { y: 0 } : { y: 12 }}
                transition={{ duration: 1.5, delay: 0.7, ease: EDITORIAL_EASE }}
                whileHover={{ y: 2 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex flex-col items-center gap-1.5 text-[#756765] hover:text-[#C56375] transition-colors cursor-pointer pt-2 pb-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C56B7A] rounded-lg px-4"
              >
                <span className="text-[11px] tracking-[0.28em] uppercase">
                  {copy.hero.confirmAttendance}
                </span>
                <ChevronDown className="w-4 h-4 text-[#B48A92] animate-soft-float" />
              </motion.button>
            </section>

            {/* =========================================================
                2. YOU ARE INVITED & COUNTDOWN
               ========================================================= */}
            <section className="px-6 sm:px-10 pt-10 pb-14 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: 0.85, ease: EDITORIAL_EASE }}
                className="font-script text-5xl sm:text-[56px] text-[#C66E7D] leading-tight"
              >
                {copy.invited.title}
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: 0.7, delay: 0.1, ease: EDITORIAL_EASE }}
              >
                <TinyBowDivider />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: 0.85, delay: 0.15, ease: EDITORIAL_EASE }}
                className="font-serif-editorial italic text-[19px] sm:text-[21px] leading-[1.6] text-[#5B504E] max-w-[360px] mx-auto"
              >
                {copy.invited.message}
              </motion.p>

              {/* Open Diploma Envelope & Champagne Coupe Illustration with gentle sway */}
              <motion.div
                initial={{ opacity: 0, y: 22, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: 0.95, delay: 0.12, ease: EDITORIAL_EASE }}
                className="my-7 max-w-[360px] mx-auto"
              >
                {!failedImages.diplomaGlasses ? (
                  <img
                    src="/src/assets/images/diploma_envelope_glasses_1795412582743.jpg"
                    alt="Vintage ink illustration of an ivory graduation envelope tied with a blush bow beside two rosé champagne coupe glasses"
                    referrerPolicy="no-referrer"
                    onError={() => markImageFailed('diplomaGlasses')}
                    className="w-full h-auto object-contain mix-blend-multiply select-none animate-gentle-sway"
                  />
                ) : (
                  <div className="h-44 rounded-xl bg-[#FAF2F3] border border-[#EED9DD] flex items-center justify-center">
                    <span className="font-serif-editorial italic text-[#9C767D]">
                      {copy.invited.title}
                    </span>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: 0.7, ease: EDITORIAL_EASE }}
              >
                <TinyBowDivider />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: 0.8, ease: EDITORIAL_EASE }}
              >
                <h2 className="mt-7 font-script text-5xl sm:text-[56px] text-[#C66E7D] leading-tight">
                  {copy.invited.countingTitle}
                </h2>
                <p className="mt-1 font-serif-editorial italic text-base sm:text-lg text-[#786A68]">
                  {copy.invited.countingSubtitle}
                </p>
              </motion.div>

              <CountdownTimer
                labels={{
                  days: copy.invited.days,
                  hours: copy.invited.hours,
                  minutes: copy.invited.minutes,
                  seconds: copy.invited.seconds,
                }}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: 0.85, ease: EDITORIAL_EASE }}
                className="mt-8"
              >
                <RibbonHeartDivider />
              </motion.div>
            </section>

            {/* =========================================================
                3. MY JOURNEY / ACADEMIC STORY TIMELINE
               ========================================================= */}
            <section id="journey" className="scroll-mt-10 px-6 sm:px-10 pt-8 pb-14">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: 0.85, ease: EDITORIAL_EASE }}
                className="text-center"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={VIEWPORT_ONCE}
                  transition={{ duration: 0.8, ease: EDITORIAL_EASE }}
                >
                  <RibbonBowCrest withFlora />
                </motion.div>
                <p className="mt-1 font-script text-[28px] text-[#C87886] leading-none">
                  {copy.journey.kicker}
                </p>
                <h2 className="mt-1 font-script text-5xl sm:text-[56px] text-[#2B2524] leading-[1.15]">
                  {copy.journey.title}
                </h2>
                <div className="flex justify-center mt-3 mb-10">
                  <HeartMark className="w-4 h-4" />
                </div>
              </motion.div>

              {/* Scroll-drawn vertical blush timeline rail */}
              <div ref={journeyRailRef} className="relative pl-7 sm:pl-9">
                <div
                  className="absolute left-[7px] top-2 bottom-4 w-px bg-[#F5E4E8]"
                  aria-hidden="true"
                />
                <motion.div
                  style={{ scaleY: smoothJourneyScale, transformOrigin: 'top' }}
                  className="absolute left-[7px] top-2 bottom-4 w-px bg-[#D792A0]"
                  aria-hidden="true"
                />

                <div className="space-y-10">
                  {copy.journey.milestones.map((milestone) => (
                    <article
                      key={milestone.year}
                      className="relative flex items-center justify-between gap-4 sm:gap-6"
                    >
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={VIEWPORT_ONCE}
                        transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                        className="absolute -left-[27px] sm:-left-[35px] top-1.5 w-3.5 h-3.5 flex items-center justify-center bg-[#FDFBF9]"
                        aria-hidden="true"
                      >
                        <svg viewBox="0 0 16 16" className="w-2.5 h-2.5" fill="#C97080">
                          <path d="M8 14S2 10.1 2 5.9C2 3.8 3.6 2.3 5.5 2.3C6.7 2.3 7.5 3 8 3.9C8.5 3 9.3 2.3 10.5 2.3C12.4 2.3 14 3.8 14 5.9C14 10.1 8 14 8 14Z" />
                        </svg>
                      </motion.span>

                      <motion.div
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={VIEWPORT_ONCE}
                        transition={{ duration: 0.75, ease: EDITORIAL_EASE }}
                        className="flex-1 min-w-0"
                      >
                        <span className="block text-[11px] font-medium tracking-[0.14em] text-[#C57785] tabular-nums">
                          {milestone.year}
                        </span>
                        <h3 className="mt-0.5 font-script text-[29px] sm:text-[32px] text-[#2E2726] leading-snug">
                          {milestone.title}
                        </h3>
                        <p className="mt-1 font-serif-editorial italic text-[14.5px] sm:text-[15.5px] leading-[1.55] text-[#6B5E5C]">
                          {milestone.description}
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 18, rotate: -2 }}
                        whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                        viewport={VIEWPORT_ONCE}
                        transition={{ duration: 0.8, delay: 0.08, ease: EDITORIAL_EASE }}
                        whileHover={{ y: -4, rotate: 1.5 }}
                        className="shrink-0"
                      >
                        <JourneyIllustration type={milestone.illustration} />
                      </motion.div>
                    </article>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: 0.85, ease: EDITORIAL_EASE }}
                className="mt-14"
              >
                <FloralGarlandDivider />
              </motion.div>
            </section>

            {/* =========================================================
                4. DAY PROGRAM — HOW OUR DAY UNFOLDS
               ========================================================= */}
            <section id="program" className="scroll-mt-10 px-5 sm:px-10 pt-6 pb-14">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: 0.85, ease: EDITORIAL_EASE }}
                className="text-center"
              >
                <RibbonBowCrest />
                <h2 className="-mt-1 font-script text-5xl sm:text-[56px] text-[#2B2524] leading-tight">
                  {copy.program.title}
                </h2>
                <p className="mt-1 text-[10.5px] sm:text-[11px] tracking-[0.34em] text-[#9A8A88] uppercase">
                  {copy.program.subtitle}
                </p>
                <div className="flex justify-center mt-4 mb-10">
                  <HeartMark className="w-4 h-4" />
                </div>
              </motion.div>

              {/* Center scroll-drawn hairline timeline with alternating directional entrances */}
              <div ref={programRailRef} className="relative">
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-[#F6E5E9]"
                  aria-hidden="true"
                />
                <motion.div
                  style={{ scaleY: smoothProgramScale, transformOrigin: 'top' }}
                  className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-[#DCA1AE]"
                  aria-hidden="true"
                />

                <div className="space-y-8 sm:space-y-10">
                  {copy.program.items.map((item, index) => {
                    const textOnLeft = index % 2 === 0;
                    return (
                      <div
                        key={`${item.time}-${item.title}`}
                        className="relative grid grid-cols-2 items-center gap-6 sm:gap-10 min-h-[84px]"
                      >
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          viewport={VIEWPORT_ONCE}
                          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FDFBF9] p-1 z-10"
                          aria-hidden="true"
                        >
                          <HeartMark className="w-3.5 h-3.5" />
                        </motion.span>

                        {textOnLeft ? (
                          <>
                            <motion.div
                              initial={{ opacity: 0, x: -18 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={VIEWPORT_ONCE}
                              transition={{ duration: 0.72, ease: EDITORIAL_EASE }}
                              className="text-left pr-2 sm:pr-4"
                            >
                              <span className="inline-block bg-[#FBF0F2] px-2.5 py-0.5 text-[10.5px] tracking-[0.16em] text-[#C56E7E] font-medium tabular-nums">
                                {item.time}
                              </span>
                              <h3 className="mt-1.5 font-serif-editorial text-sm sm:text-[15.5px] tracking-[0.14em] text-[#3B3231] font-medium uppercase">
                                {item.title}
                              </h3>
                              <p className="mt-0.5 font-serif-editorial italic text-[13.5px] text-[#7B6E6C] leading-snug">
                                {item.subtitle}
                              </p>
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0, x: 18, scale: 0.94 }}
                              whileInView={{ opacity: 1, x: 0, scale: 1 }}
                              viewport={VIEWPORT_ONCE}
                              transition={{ duration: 0.75, delay: 0.08, ease: EDITORIAL_EASE }}
                              whileHover={{ y: -4, scale: 1.04 }}
                              className="flex justify-center pl-2 sm:pl-4"
                            >
                              <div
                                className="animate-gentle-sway"
                                style={{ animationDelay: `${(index % 4) * 0.8}s` }}
                              >
                                <ProgramIllustration type={item.illustration} />
                              </div>
                            </motion.div>
                          </>
                        ) : (
                          <>
                            <motion.div
                              initial={{ opacity: 0, x: -18, scale: 0.94 }}
                              whileInView={{ opacity: 1, x: 0, scale: 1 }}
                              viewport={VIEWPORT_ONCE}
                              transition={{ duration: 0.75, delay: 0.08, ease: EDITORIAL_EASE }}
                              whileHover={{ y: -4, scale: 1.04 }}
                              className="flex justify-center pr-2 sm:pr-4"
                            >
                              <div
                                className="animate-gentle-sway"
                                style={{ animationDelay: `${(index % 4) * 0.8}s` }}
                              >
                                <ProgramIllustration type={item.illustration} />
                              </div>
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0, x: 18 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={VIEWPORT_ONCE}
                              transition={{ duration: 0.72, ease: EDITORIAL_EASE }}
                              className="text-left pl-2 sm:pl-4"
                            >
                              <span className="inline-block bg-[#FBF0F2] px-2.5 py-0.5 text-[10.5px] tracking-[0.16em] text-[#C56E7E] font-medium tabular-nums">
                                {item.time}
                              </span>
                              <h3 className="mt-1.5 font-serif-editorial text-sm sm:text-[15.5px] tracking-[0.14em] text-[#3B3231] font-medium uppercase">
                                {item.title}
                              </h3>
                              <p className="mt-0.5 font-serif-editorial italic text-[13.5px] text-[#7B6E6C] leading-snug">
                                {item.subtitle}
                              </p>
                            </motion.div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* =========================================================
                5. EVENT DETAILS — PRIVATE RESIDENCE, NAIROBI
               ========================================================= */}
            <section
              id="details"
              className="scroll-mt-10 relative px-5 sm:px-8 py-12 overflow-hidden"
            >
              {/* Soft watercolor floral backdrop framing the white card */}
              {!failedImages.floralBg ? (
                <motion.img
                  initial={{ opacity: 0, scale: 1.04 }}
                  whileInView={{ opacity: 0.55, scale: 1 }}
                  viewport={VIEWPORT_ONCE}
                  transition={{ duration: 1.1, ease: EDITORIAL_EASE }}
                  src="/src/assets/images/floral_pattern_bg_1795412583793.jpg"
                  alt=""
                  aria-hidden="true"
                  referrerPolicy="no-referrer"
                  onError={() => markImageFailed('floralBg')}
                  className="pointer-events-none absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#F8E6EA_0%,#FDF6F7_100%)]"
                  aria-hidden="true"
                />
              )}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#FDFBF9] to-transparent"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FDFBF9] to-transparent"
                aria-hidden="true"
              />

              <div className="relative z-10 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT_ONCE}
                  transition={{ duration: 0.8, ease: EDITORIAL_EASE }}
                >
                  <p className="text-[11px] tracking-[0.26em] text-[#C47483] uppercase">
                    {copy.details.kicker}
                  </p>
                  <h2 className="mt-1.5 font-serif-editorial text-3xl sm:text-4xl text-[#2F2827]">
                    {copy.details.title}
                  </h2>
                  <p className="mt-2 text-[13px] sm:text-sm text-[#6C5E5C] max-w-xs mx-auto leading-relaxed">
                    {copy.details.subtitle}
                  </p>
                </motion.div>

                {/* Inner white residence details card */}
                <motion.div
                  initial={{ opacity: 0, y: 26, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={VIEWPORT_ONCE}
                  transition={{ duration: 0.85, delay: 0.1, ease: EDITORIAL_EASE }}
                  className="mt-6 rounded-2xl bg-white/95 backdrop-blur-sm border border-[#F0DFE2] shadow-[0_12px_36px_rgba(155,98,110,0.09)] p-6 sm:p-7"
                >
                  <motion.div
                    initial={{ scale: 0.7, rotate: -15, opacity: 0 }}
                    whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
                    viewport={VIEWPORT_ONCE}
                    transition={{ type: 'spring', stiffness: 240, damping: 18, delay: 0.18 }}
                    className="mx-auto w-10 h-10 rounded-full bg-[#FBF0F2] flex items-center justify-center text-[#C86E7D]"
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>

                  <h3 className="mt-3.5 font-serif-editorial text-2xl text-[#352E2D]">
                    {copy.details.ceremonyTitle}
                  </h3>

                  <div className="mt-2.5 flex flex-col items-center gap-1 text-[13px] text-[#665957]">
                    <p className="inline-flex items-center gap-1.5 font-medium text-[#524644]">
                      <Clock className="w-3.5 h-3.5 text-[#C87886]" />
                      <span>{copy.details.time}</span>
                    </p>
                    <p className="inline-flex items-center gap-1.5 font-medium text-[#524644]">
                      <MapPin className="w-3.5 h-3.5 text-[#C87886]" />
                      <span>{copy.details.venueName}</span>
                    </p>
                    <p className="text-xs text-[#887977]">{copy.details.addressLine1}</p>
                    <p className="text-xs text-[#887977]">{copy.details.addressLine2}</p>
                  </div>

                  {/* Stylized Nairobi Private Residence Map Card */}
                  <VenueMapPreview
                    venueName={copy.details.venueName}
                    mapsUrl={VENUE_MAPS_URL}
                  />

                  <p className="text-xs sm:text-[13px] leading-relaxed text-[#726462] max-w-xs mx-auto">
                    {copy.details.note}
                  </p>

                  <div className="mt-5 space-y-2.5">
                    <motion.a
                      href={VENUE_MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -1.5 }}
                      whileTap={{ scale: 0.985 }}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-[#ECE0E1] bg-[#FDFBF9] hover:border-[#C96476] hover:text-[#B95265] px-4 py-2.5 text-xs font-medium text-[#5A4E4C] transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#C87886]" />
                      <span>{copy.details.openMaps}</span>
                    </motion.a>

                    <motion.button
                      type="button"
                      onClick={handleDownloadCalendar}
                      whileHover={{ y: -1.5 }}
                      whileTap={{ scale: 0.985 }}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-[#ECE0E1] bg-[#FDFBF9] hover:border-[#C96476] hover:text-[#B95265] px-4 py-2.5 text-xs font-medium text-[#5A4E4C] transition-colors cursor-pointer"
                    >
                      {calendarDownloaded ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#5A8B66]" />
                          <span>{copy.details.calendarAdded}</span>
                        </>
                      ) : (
                        <>
                          <CalendarPlus className="w-3.5 h-3.5 text-[#C87886]" />
                          <span>{copy.details.addCalendar}</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* =========================================================
                6. DRESS CODE & DOVES CREST
               ========================================================= */}
            <section className="px-6 sm:px-10 pt-10 pb-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: 0.8, ease: EDITORIAL_EASE }}
              >
                <h2 className="font-script text-5xl sm:text-[54px] text-[#2B2524] leading-tight">
                  {copy.dressCode.title}
                </h2>
                <p className="mt-1.5 text-[10.5px] sm:text-[11px] tracking-[0.26em] text-[#C87A88] uppercase">
                  {copy.dressCode.subtitle}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: 0.8, delay: 0.08, ease: EDITORIAL_EASE }}
                className="mt-6 rounded-2xl bg-[#FAF6F4] border border-[#F0E4E5] px-6 py-7 space-y-4"
              >
                {copy.dressCode.paragraphs.map((paragraph, idx) => (
                  <motion.p
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VIEWPORT_ONCE}
                    transition={{ duration: 0.65, delay: 0.12 + idx * 0.1, ease: EDITORIAL_EASE }}
                    className="font-serif-editorial italic text-[16px] sm:text-[17px] leading-[1.6] text-[#635654]"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.93 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: 0.9, delay: 0.1, ease: EDITORIAL_EASE }}
                className="mt-9 max-w-[220px] mx-auto"
              >
                {!failedImages.dovesCrest ? (
                  <img
                    src="/src/assets/images/doves_graduation_crest_1795412585734.jpg"
                    alt="Vintage ink illustration of two white doves framed by olive branches and a blush silk ribbon bow"
                    referrerPolicy="no-referrer"
                    onError={() => markImageFailed('dovesCrest')}
                    className="w-full h-auto object-contain mix-blend-multiply select-none animate-soft-float"
                  />
                ) : (
                  <RibbonBowCrest withFlora />
                )}
              </motion.div>
            </section>

            {/* =========================================================
                7. BE OUR GUEST — RSVP
               ========================================================= */}
            <RsvpSection copy={copy.rsvp} />

            {/* =========================================================
                8. A QUIET LITTLE NOTE ON GIFTS (HIDDEN UNTIL CLICKED)
               ========================================================= */}
            <section id="gifts" className="scroll-mt-10 px-6 sm:px-10 pt-4 pb-12 text-center">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: 0.8, ease: EDITORIAL_EASE }}
              >
                <TinyBowDivider />
                <p className="mt-4 text-[10.5px] tracking-[0.26em] text-[#A89290] uppercase">
                  {copy.gifts.kicker}
                </p>
                <h2 className="mt-1 font-script text-5xl sm:text-[52px] text-[#C66E7D] leading-tight">
                  {copy.gifts.title}
                </h2>
                <p className="mt-3 font-serif-editorial italic text-[16px] sm:text-[17px] leading-[1.65] text-[#665957] max-w-[390px] mx-auto">
                  {copy.gifts.intro}
                </p>

                <motion.button
                  type="button"
                  onClick={() => setIsGiftListOpen((prev) => !prev)}
                  aria-expanded={isGiftListOpen}
                  aria-controls="gift-wishlist-panel"
                  whileHover={{ y: -1.5 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 inline-flex items-center gap-2.5 rounded-lg border border-[#E6CFD3] bg-[#FAF6F4] hover:border-[#C96476] hover:text-[#B85063] px-5 py-2.5 text-xs font-medium tracking-[0.06em] text-[#6A575A] shadow-[0_4px_16px_rgba(155,98,110,0.06)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96476]/40"
                >
                  <Gift className="w-3.5 h-3.5 text-[#C87886]" />
                  <span>
                    {isGiftListOpen ? copy.gifts.hideListLabel : copy.gifts.showListLabel}
                  </span>
                  <motion.span
                    animate={{ rotate: isGiftListOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: EDITORIAL_EASE }}
                    className="inline-flex"
                  >
                    <ChevronDown className="w-3.5 h-3.5 text-[#B48A92]" />
                  </motion.span>
                </motion.button>
              </motion.div>

              <AnimatePresence initial={false}>
                {isGiftListOpen && (
                  <motion.div
                    id="gift-wishlist-panel"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.55, ease: EDITORIAL_EASE }}
                    className="overflow-hidden"
                  >
                    <div className="mt-6 rounded-2xl bg-[#FAF6F4] border border-[#F0E3E4] px-6 py-7 sm:px-8 text-left">
                      <p className="text-center font-serif-editorial italic text-[15px] text-[#7D6C6A] mb-4">
                        {copy.gifts.listIntro}
                      </p>

                      <ul className="divide-y divide-[#EFE0E2] border-t border-b border-[#EFE0E2]">
                        {copy.gifts.items.map((item, idx) => (
                          <motion.li
                            key={item.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.45,
                              delay: 0.06 + idx * 0.045,
                              ease: EDITORIAL_EASE,
                            }}
                            className="py-3.5 flex items-start gap-3"
                          >
                            <span
                              className="mt-2 h-1.5 w-1.5 rounded-full bg-[#D38A98] shrink-0"
                              aria-hidden="true"
                            />
                            <div className="min-w-0">
                              <p className="font-serif-editorial text-[16px] sm:text-[17px] text-[#352E2D] leading-snug">
                                {item.name}
                              </p>
                              {item.note && (
                                <p className="mt-0.5 font-serif-editorial italic text-[14px] text-[#7A6B69] leading-relaxed">
                                  {item.note}
                                </p>
                              )}
                            </div>
                          </motion.li>
                        ))}
                      </ul>

                      <p className="mt-5 text-center font-serif-editorial italic text-[14px] text-[#8A7876]">
                        {copy.gifts.closingNote}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* =========================================================
                9. CLOSING SIGNATURE & DIRECTIONS CONTACT
               ========================================================= */}
            <footer className="pt-4 pb-16 px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: 0.8, ease: EDITORIAL_EASE }}
                className="mb-10"
              >
                <p className="font-serif-editorial italic text-[15px] text-[#6E615F] max-w-xs mx-auto">
                  {copy.travel.questionsIntro}
                </p>
                <div className="mt-3 flex flex-col items-center gap-1.5 text-xs text-[#C66E7D]">
                  <motion.a
                    whileHover={{ y: -1 }}
                    href={`mailto:${copy.travel.email}`}
                    className="inline-flex items-center gap-2 hover:underline"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{copy.travel.email}</span>
                  </motion.a>
                  <motion.a
                    whileHover={{ y: -1 }}
                    href={VENUE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:underline"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{copy.travel.phone}</span>
                  </motion.a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: 0.9, delay: 0.1, ease: EDITORIAL_EASE }}
              >
                <RibbonBowCrest />
                <p className="-mt-1 font-script text-5xl sm:text-[54px] text-[#2B2524] leading-tight">
                  {copy.hero.graduateName}
                </p>
                <p className="mt-2 text-[11px] tracking-[0.32em] text-[#C87A88] uppercase">
                  {copy.footer.date}
                </p>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={VIEWPORT_ONCE}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.2 }}
                  className="flex justify-center my-4"
                >
                  <HeartMark className="w-3.5 h-3.5" />
                </motion.div>
                <p className="font-serif-editorial italic text-[16px] text-[#6D5F5D]">
                  {copy.footer.thankYou}
                </p>
                <p className="mt-2 text-[10px] tracking-[0.26em] text-[#A28F8D] uppercase">
                  {copy.footer.madeWith}
                </p>
                <p className="mt-4 text-xs tracking-[0.12em] text-[#B59C9F]">
                  {copy.footer.hashtag}
                </p>
              </motion.div>
            </footer>

            {/* Floating Bottom-Right Audio Button */}
            {envelopeOpen && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                transition={{ duration: 0.35, ease: EDITORIAL_EASE }}
                onClick={handleToggleMusic}
                aria-label={musicOn ? copy.audio.mute : copy.audio.unmute}
                title={musicOn ? copy.audio.mute : copy.audio.unmute}
                className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-40 w-11 h-11 rounded-full bg-white/95 backdrop-blur-md border border-[#EAD7DB] shadow-[0_6px_22px_rgba(140,86,98,0.16)] flex items-center justify-center text-[#6F5C5F] hover:text-[#C56375] hover:border-[#D9A2AC] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96476]"
              >
                {musicOn ? (
                  <Volume2 className="w-4 h-4 text-[#C56375]" />
                ) : (
                  <VolumeX className="w-4 h-4 text-[#8B7A7C]" />
                )}
              </motion.button>
            )}
          </main>
        </div>
      </div>
    </MotionConfig>
  );
}
