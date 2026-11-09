import React from 'react';

export const SpeedLines = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
      <div
        key={i}
        className="absolute top-1/2 left-1/2 h-[1px] w-[50vw] bg-gradient-to-r from-transparent via-white/50 to-transparent origin-left"
        style={{
          transform: `translate(-50%, -50%) rotate(${deg}deg) translateZ(0)`
        }}
      />
    ))}
  </div>
);
