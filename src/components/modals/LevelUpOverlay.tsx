import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowRight } from 'lucide-react';
import { SpeedLines } from '../effects/SpeedLines';
import { Burst } from '../effects/Burst';

interface LevelUpOverlayProps {
  showLevelUp: number | null;
  setShowLevelUp: (level: number | null) => void;
}

export const LevelUpOverlay: React.FC<LevelUpOverlayProps> = ({
  showLevelUp,
  setShowLevelUp
}) => {
  return (
    <AnimatePresence>
      {showLevelUp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[500] flex items-center justify-center bg-black/90 overflow-hidden"
          onClick={() => {
            setShowLevelUp(null);
          }}
        >
          <SpeedLines />
          <Burst color="bg-amber-400" count={8} />
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 18, stiffness: 200 }}
            className="text-center space-y-8 p-8 relative z-10"
          >
            <div className="relative inline-block">
              <div
                className="relative bg-gradient-to-b from-amber-300 to-amber-600 p-1.5 rounded-full shadow-[0_0_30px_rgba(251,191,36,0.4)]"
              >
                <div className="bg-theme-card rounded-full p-8 md:p-10">
                  <Trophy size={80} className="text-amber-500 md:w-[100px] md:h-[100px]" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <motion.h2 
                initial={{ opacity: 0, scale: 2 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-6xl md:text-8xl font-theme-heading font-black text-white tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
              >
                LEVEL UP!
              </motion.h2>
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-6 text-amber-400 font-bold"
              >
                <span className="text-3xl opacity-60">Lv.{showLevelUp ? showLevelUp - 1 : ''}</span>
                <ArrowRight size={32} className="text-white/40" />
                <span className="text-white text-6xl md:text-7xl drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">{showLevelUp}</span>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="text-white/40 text-lg font-bold tracking-[0.3em] uppercase animate-pulse"
            >
              Tap to continue
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
