import React from 'react';
import { Rarity } from '../../data/quizData';

export const HaloEffect = ({ rarity }: { rarity: Rarity }) => {
  const getGradient = () => {
    switch (rarity) {
      case 'UR':
        return 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, rgba(236,72,153,0.18) 40%, rgba(251,146,60,0.08) 65%, transparent 80%)';
      case 'SR':
        return 'radial-gradient(circle, rgba(250,204,21,0.3) 0%, rgba(249,115,22,0.12) 50%, transparent 75%)';
      case 'R':
        return 'radial-gradient(circle, rgba(59,130,246,0.25) 0%, rgba(79,70,229,0.1) 50%, transparent 75%)';
      default:
        return 'radial-gradient(circle, rgba(148,163,184,0.15) 0%, transparent 65%)';
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
      <div
        className="w-[85vmin] h-[85vmin] max-w-[650px] max-h-[650px] rounded-full pointer-events-none"
        style={{
          background: getGradient(),
          transform: 'translateZ(0)',
          willChange: 'opacity'
        }}
      />
    </div>
  );
};
