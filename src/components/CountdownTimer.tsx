import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CEREMONY_TARGET_ISO } from '../data/invitationContent';

interface CountdownTimerProps {
  labels: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeRemaining(): TimeRemaining {
  const target = new Date(CEREMONY_TARGET_ISO).getTime();
  const diff = Math.max(0, target - Date.now());

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

export function CountdownTimer({ labels }: CountdownTimerProps) {
  const [time, setTime] = useState<TimeRemaining>(getTimeRemaining);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTime(getTimeRemaining());
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const units = [
    { key: 'days', value: String(time.days), label: labels.days },
    { key: 'hours', value: String(time.hours).padStart(2, '0'), label: labels.hours },
    { key: 'minutes', value: String(time.minutes).padStart(2, '0'), label: labels.minutes },
    { key: 'seconds', value: String(time.seconds).padStart(2, '0'), label: labels.seconds },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-4 divide-x divide-[#F0D9DE] max-w-[400px] mx-auto my-8"
      role="timer"
      aria-live="off"
    >
      {units.map((unit, idx) => (
        <motion.div
          key={unit.key}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center px-2"
        >
          <div className="relative h-10 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={unit.value}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif-editorial text-3xl sm:text-[34px] leading-none text-[#C66E7D] tabular-nums block"
              >
                {unit.value}
              </motion.span>
            </AnimatePresence>
          </div>
          <span className="mt-2 text-[10px] sm:text-[11px] tracking-[0.18em] text-[#8E7F7D] font-normal">
            {unit.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
