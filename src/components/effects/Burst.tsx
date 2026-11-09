import React, { useMemo } from 'react';

export const Burst = ({ color, count }: { color: string; count: number }) => {
  const actualCount = Math.min(count, 8);
  const particles = useMemo(() => {
    return Array.from({ length: actualCount }, (_, i) => {
      const angle = (i * 360) / actualCount;
      const rad = (angle * Math.PI) / 180;
      const dist = 75 + (i % 3) * 20;
      return {
        x: Math.round(Math.cos(rad) * dist),
        y: Math.round(Math.sin(rad) * dist)
      };
    });
  }, [actualCount]);

  if (actualCount <= 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
      {particles.map((p, i) => (
        <div
          key={i}
          className={`absolute w-2 h-2 rounded-full ${color} opacity-0 animate-ping`}
          style={{
            transform: `translate(${p.x}px, ${p.y}px) translateZ(0)`,
            animationDuration: '0.8s',
            animationIterationCount: 1,
            animationFillMode: 'forwards'
          }}
        />
      ))}
    </div>
  );
};
