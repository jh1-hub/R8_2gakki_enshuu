import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const GachaRollingOverlay = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[700] bg-slate-950 flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="relative z-10 flex flex-col items-center" style={{ perspective: 1000 }}>
        {/* 3D Spinning Holographic Card - Smooth GPU Transform */}
        <motion.div 
          animate={{ rotateY: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          style={{ transformStyle: 'preserve-3d' }}
          className="w-32 h-48 md:w-40 md:h-56 rounded-2xl border-2 border-cyan-400 bg-gradient-to-b from-cyan-950/80 to-slate-900/90 shadow-lg shadow-cyan-500/20 flex flex-col items-center justify-center p-4 relative mb-6 will-change-transform"
        >
          <div className="absolute inset-2 border border-cyan-400/30 rounded-xl pointer-events-none" />
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="w-14 h-14 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300"
          >
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          </motion.div>
          <span className="mt-4 text-[10px] md:text-xs font-mono font-bold tracking-widest text-cyan-300 uppercase">ANALYZING</span>
        </motion.div>

        <div className="text-center space-y-3">
          <h2 className="text-cyan-400 text-lg font-mono tracking-[0.25em] uppercase">
            Data Analyzing...
          </h2>
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
