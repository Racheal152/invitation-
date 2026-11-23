import React from 'react';

interface PetalSpec {
  id: number;
  left: string;
  size: number;
  delay: string;
  duration: string;
  opacity: number;
}

const PETALS: PetalSpec[] = [
  { id: 1, left: '6%', size: 14, delay: '0s', duration: '15s', opacity: 0.5 },
  { id: 2, left: '14%', size: 11, delay: '4s', duration: '19s', opacity: 0.4 },
  { id: 3, left: '22%', size: 16, delay: '8s', duration: '17s', opacity: 0.45 },
  { id: 4, left: '78%', size: 13, delay: '2s', duration: '16s', opacity: 0.45 },
  { id: 5, left: '86%', size: 15, delay: '6s', duration: '21s', opacity: 0.5 },
  { id: 6, left: '93%', size: 11, delay: '10s', duration: '18s', opacity: 0.4 },
  { id: 7, left: '30%', size: 10, delay: '12s', duration: '22s', opacity: 0.35 },
  { id: 8, left: '70%', size: 12, delay: '5s', duration: '20s', opacity: 0.38 },
];

export function FloatingPetals() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
      {PETALS.map((petal) => (
        <svg
          key={petal.id}
          viewBox="0 0 24 18"
          width={petal.size}
          height={petal.size * 0.75}
          className="animate-petal absolute -top-6"
          style={{
            left: petal.left,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            opacity: petal.opacity,
          }}
        >
          <path
            d="M2 10C4 3 13 1 21 5C23 11 16 17 8 16C4 15.5 1 13 2 10Z"
            fill="#E9B8C2"
          />
        </svg>
      ))}
    </div>
  );
}
