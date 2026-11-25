import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, RotateCcw, Loader2, Users } from 'lucide-react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import type { InvitationCopy, Language } from '../data/invitationContent';
import { GradCapMark } from './BotanicalIllustrations';
import { HostRsvpModal } from './HostRsvpModal';
import { db, handleFirestoreError, OperationType, RSVP_CONSTRAINTS } from '../firebase';

interface RsvpRecord {
  id: string;
  fullName: string;
  email: string;
  attending: 'accept' | 'decline';
  guests: number;
  message: string;
  submittedAt: string;
}

const STORAGE_KEY = 'racheal_kache_graduation_2026_rsvp';

function createValidRsvpDocId(): string {
  const rand =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 16)
      : Math.random().toString(36).slice(2, 14);
  return `rsvp_${Date.now()}_${rand}`;
}

interface RsvpSectionProps {
  copy: InvitationCopy['rsvp'];
  lang: Language;
}

export function RsvpSection({ copy, lang }: RsvpSectionProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [attending, setAttending] = useState<'accept' | 'decline' | ''>('');
  const [guests, setGuests] = useState<number>(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<RsvpRecord | null>(null);
  const [hostModalOpen, setHostModalOpen] = useState(false);

  const isSw = lang === 'sw';

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as RsvpRecord;
        setSubmitted(parsed);
        setFullName(parsed.fullName);
        setEmail(parsed.email);
        setAttending(parsed.attending);
        setGuests(parsed.guests || 1);
        setMessage(parsed.message);
      }
    } catch {
      // Ignore storage availability issues
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedName = fullName.trim().slice(0, RSVP_CONSTRAINTS.fullNameMax);
    const trimmedEmail = email.trim().toLowerCase().slice(0, RSVP_CONSTRAINTS.emailMax);
    const trimmedMessage = message.trim().slice(0, RSVP_CONSTRAINTS.messageMax);
    const emailValid =
      trimmedEmail.length >= RSVP_CONSTRAINTS.emailMin &&
      RSVP_CONSTRAINTS.emailPattern.test(trimmedEmail);

    if (
      trimmedName.length < RSVP_CONSTRAINTS.fullNameMin ||
      !emailValid ||
      (attending !== 'accept' && attending !== 'decline')
    ) {
      setError(copy.validationError);
      return;
    }

    const safeGuests =
      attending === 'accept'
        ? Math.min(
            RSVP_CONSTRAINTS.guestsMaxAccept,
            Math.max(RSVP_CONSTRAINTS.guestsMinAccept, Math.round(guests))
          )
        : 0;

    setError('');
    setIsSubmitting(true);

    const docId = createValidRsvpDocId();
    const docPath = `rsvps/${docId}`;

    try {
      await setDoc(doc(db, 'rsvps', docId), {
        fullName: trimmedName,
        email: trimmedEmail,
        attending,
        guests: safeGuests,
        message: trimmedMessage,
        language: lang,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const record: RsvpRecord = {
        id: docId,
        fullName: trimmedName,
        email: trimmedEmail,
        attending,
        guests: safeGuests,
        message: trimmedMessage,
        submittedAt: new Date().toISOString(),
      };

      setSubmitted(record);

      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
      } catch {
        // Ignore storage availability issues
      }
    } catch (err) {
      setError(
        isSw
          ? 'Hatukuweza kuhifadhi jibu lako kwa sasa. Tafadhali hakikisha una mtandao kisha ujaribu tena.'
          : 'We could not save your RSVP just now. Please check your connection and try again.'
      );
      try {
        handleFirestoreError(err, OperationType.CREATE, docPath);
      } catch {
        // Structured Firestore error already logged for diagnostics
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="scroll-mt-10 px-6 sm:px-10 py-14 text-center">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-[11px] tracking-[0.26em] text-[#9E8B89] uppercase">
          {copy.kicker}
        </p>
        <h2 className="mt-2 font-serif-editorial text-3xl sm:text-4xl tracking-[0.18em] text-[#352E2D] font-normal">
          {copy.title}
        </h2>
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center my-4"
        >
          <GradCapMark className="w-5 h-5" />
        </motion.div>
        <p className="text-[13px] sm:text-sm text-[#6E6260] max-w-xs mx-auto leading-relaxed">
          {copy.deadline}
        </p>
      </motion.div>

      {/* Form card with smooth state transitions */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="mt-7 rounded-2xl bg-[#FAF6F4] border border-[#F0E3E4] p-6 sm:p-8 text-left"
      >
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="rsvp-confirmed"
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="text-center py-4"
            >
              <motion.div
                initial={{ scale: 0.5, rotate: -14, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.08 }}
                className="mx-auto w-11 h-11 rounded-full bg-[#F5E0E4] flex items-center justify-center text-[#C56375]"
              >
                <CheckCircle2 className="w-5 h-5" />
              </motion.div>
              <h3 className="mt-4 font-serif-editorial text-2xl text-[#352E2D]">
                {submitted.attending === 'accept'
                  ? copy.confirmedTitleAccept
                  : copy.confirmedTitleDecline}
              </h3>
              <p className="mt-2 text-sm text-[#6C5E5C] leading-relaxed max-w-sm mx-auto">
                {submitted.fullName},{' '}
                {submitted.attending === 'accept'
                  ? copy.confirmedBodyAccept
                  : copy.confirmedBodyDecline}
              </p>
              {submitted.attending === 'accept' && (
                <p className="mt-3 text-xs tracking-wider text-[#9A7A7F]">
                  {copy.guestsLabel}: {submitted.guests} · {submitted.email}
                </p>
              )}
              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSubmitted(null)}
                className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[#E5CCD1] bg-white px-4 py-2 text-xs font-medium text-[#6C5458] hover:border-[#C96476] hover:text-[#B85063] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {copy.editResponse}
              </motion.button>
            </motion.div>
          ) : (
            <motion.form
              key="rsvp-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onSubmit={handleSubmit}
              noValidate
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="rsvp-name"
                  className="block text-xs font-medium text-[#524644] mb-1.5"
                >
                  {copy.fullNameLabel}
                </label>
                <input
                  id="rsvp-name"
                  type="text"
                  required
                  maxLength={RSVP_CONSTRAINTS.fullNameMax}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={copy.fullNamePlaceholder}
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-[#EAE0DF] bg-white px-3.5 py-2.5 text-sm text-[#352E2D] placeholder:text-[#B5A9A7] focus:border-[#C96476] focus:outline-none focus:ring-2 focus:ring-[#C96476]/20 transition-colors disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="rsvp-email"
                  className="block text-xs font-medium text-[#524644] mb-1.5"
                >
                  {copy.emailLabel}
                </label>
                <input
                  id="rsvp-email"
                  type="email"
                  required
                  maxLength={RSVP_CONSTRAINTS.emailMax}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={copy.emailPlaceholder}
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-[#EAE0DF] bg-white px-3.5 py-2.5 text-sm text-[#352E2D] placeholder:text-[#B5A9A7] focus:border-[#C96476] focus:outline-none focus:ring-2 focus:ring-[#C96476]/20 transition-colors disabled:opacity-60"
                />
              </div>

              <fieldset disabled={isSubmitting}>
                <legend className="block text-xs font-medium text-[#524644] mb-2.5">
                  {copy.attendingLabel}
                </legend>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2.5 cursor-pointer rounded-lg border border-transparent py-1.5 px-1 text-xs sm:text-[13px] text-[#4F4341] hover:text-[#2F2726] transition-colors">
                    <input
                      type="radio"
                      name="attending"
                      value="accept"
                      checked={attending === 'accept'}
                      onChange={() => setAttending('accept')}
                      className="h-4 w-4 accent-[#C96476] cursor-pointer"
                    />
                    <span>{copy.acceptOption}</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer rounded-lg border border-transparent py-1.5 px-1 text-xs sm:text-[13px] text-[#4F4341] hover:text-[#2F2726] transition-colors">
                    <input
                      type="radio"
                      name="attending"
                      value="decline"
                      checked={attending === 'decline'}
                      onChange={() => setAttending('decline')}
                      className="h-4 w-4 accent-[#C96476] cursor-pointer"
                    />
                    <span>{copy.declineOption}</span>
                  </label>
                </div>
              </fieldset>

              <AnimatePresence initial={false}>
                {attending === 'accept' && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <label
                      htmlFor="rsvp-guests"
                      className="block text-xs font-medium text-[#524644] mb-1.5"
                    >
                      {copy.guestsLabel}
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4].map((count) => (
                        <motion.button
                          key={count}
                          type="button"
                          disabled={isSubmitting}
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.94 }}
                          onClick={() => setGuests(count)}
                          className={`h-9 w-11 rounded-lg text-xs font-medium border transition-colors cursor-pointer tabular-nums disabled:opacity-60 ${
                            guests === count
                              ? 'bg-[#C96476] text-white border-[#C96476] shadow-sm'
                              : 'bg-white text-[#5C4E4C] border-[#E7DBDC] hover:border-[#C96476]'
                          }`}
                        >
                          {count}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="rsvp-message"
                    className="block text-xs font-medium text-[#524644]"
                  >
                    {copy.messageLabel}
                  </label>
                  {message.length > 750 && (
                    <span className="text-[10.5px] text-[#9E8B89] tabular-nums">
                      {message.length}/{RSVP_CONSTRAINTS.messageMax}
                    </span>
                  )}
                </div>
                <textarea
                  id="rsvp-message"
                  rows={3}
                  maxLength={RSVP_CONSTRAINTS.messageMax}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={copy.messagePlaceholder}
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-[#EAE0DF] bg-white px-3.5 py-2.5 text-sm text-[#352E2D] placeholder:text-[#B5A9A7] focus:border-[#C96476] focus:outline-none focus:ring-2 focus:ring-[#C96476]/20 transition-colors resize-none disabled:opacity-60"
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    role="alert"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-xs text-[#B3394D] font-medium"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={isSubmitting ? undefined : { y: -1.5 }}
                whileTap={isSubmitting ? undefined : { scale: 0.985 }}
                transition={{ duration: 0.16 }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#C96476] hover:bg-[#B85466] disabled:opacity-70 px-5 py-3 text-sm font-medium text-white shadow-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96476] focus-visible:ring-offset-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{isSw ? 'Inatuma jibu...' : 'Sending RSVP...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{copy.submitButton}</span>
                  </>
                )}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Discreet host-only link to review saved RSVP responses */}
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={() => setHostModalOpen(true)}
          className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase text-[#A99295] hover:text-[#C56375] transition-colors cursor-pointer py-1 px-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96476]/40"
        >
          <Users className="w-3 h-3" />
          <span>{isSw ? 'Orodha ya Wageni (Mwenyeji)' : 'Host Guest List'}</span>
        </button>
      </div>

      <HostRsvpModal
        open={hostModalOpen}
        onClose={() => setHostModalOpen(false)}
        lang={lang}
      />
    </section>
  );
}
