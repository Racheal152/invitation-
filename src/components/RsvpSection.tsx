import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, RotateCcw } from 'lucide-react';
import type { InvitationCopy } from '../data/invitationContent';
import { HeartMark } from './BotanicalIllustrations';

interface RsvpRecord {
  fullName: string;
  email: string;
  attending: 'accept' | 'decline';
  guests: number;
  message: string;
  submittedAt: string;
}

const STORAGE_KEY = 'racheal_kache_graduation_2026_rsvp';

interface RsvpSectionProps {
  copy: InvitationCopy['rsvp'];
}

export function RsvpSection({ copy }: RsvpSectionProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [attending, setAttending] = useState<'accept' | 'decline' | ''>('');
  const [guests, setGuests] = useState<number>(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState<RsvpRecord | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as RsvpRecord;
        setSubmitted(parsed);
        setFullName(parsed.fullName);
        setEmail(parsed.email);
        setAttending(parsed.attending);
        setGuests(parsed.guests);
        setMessage(parsed.message);
      }
    } catch {
      // Ignore storage availability issues
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    if (!trimmedName || !emailValid || !attending) {
      setError(copy.validationError);
      return;
    }

    setError('');
    const record: RsvpRecord = {
      fullName: trimmedName,
      email: trimmedEmail,
      attending,
      guests: attending === 'accept' ? guests : 0,
      message: message.trim(),
      submittedAt: new Date().toISOString(),
    };

    setSubmitted(record);

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch {
      // Ignore storage availability issues
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
          <HeartMark className="w-4 h-4" />
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
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={copy.fullNamePlaceholder}
                  className="w-full rounded-lg border border-[#EAE0DF] bg-white px-3.5 py-2.5 text-sm text-[#352E2D] placeholder:text-[#B5A9A7] focus:border-[#C96476] focus:outline-none focus:ring-2 focus:ring-[#C96476]/20 transition-colors"
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={copy.emailPlaceholder}
                  className="w-full rounded-lg border border-[#EAE0DF] bg-white px-3.5 py-2.5 text-sm text-[#352E2D] placeholder:text-[#B5A9A7] focus:border-[#C96476] focus:outline-none focus:ring-2 focus:ring-[#C96476]/20 transition-colors"
                />
              </div>

              <fieldset>
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
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.94 }}
                          onClick={() => setGuests(count)}
                          className={`h-9 w-11 rounded-lg text-xs font-medium border transition-colors cursor-pointer tabular-nums ${
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
                <label
                  htmlFor="rsvp-message"
                  className="block text-xs font-medium text-[#524644] mb-1.5"
                >
                  {copy.messageLabel}
                </label>
                <textarea
                  id="rsvp-message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={copy.messagePlaceholder}
                  className="w-full rounded-lg border border-[#EAE0DF] bg-white px-3.5 py-2.5 text-sm text-[#352E2D] placeholder:text-[#B5A9A7] focus:border-[#C96476] focus:outline-none focus:ring-2 focus:ring-[#C96476]/20 transition-colors resize-none"
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
                whileHover={{ y: -1.5 }}
                whileTap={{ scale: 0.985 }}
                transition={{ duration: 0.16 }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#C96476] hover:bg-[#B85466] px-5 py-3 text-sm font-medium text-white shadow-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96476] focus-visible:ring-offset-2"
              >
                <Send className="w-3.5 h-3.5" />
                {copy.submitButton}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
