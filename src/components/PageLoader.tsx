'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_STEPS = [
  'INITIALIZING_CORE_SYSTEM',
  'ESTABLISHING_NEURAL_LINK',
  'LOADING_ASSETS_CACHE',
  'SYNCING_UI_MODULES',
  'SYSTEM_READY',
];

export default function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = 'hidden';

    const duration = 800; // 0.8 seconds for the loader
    const interval = 10;
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsComplete(true);
            document.body.style.overflow = 'unset';
          }, 500);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const stepIndex = Math.floor((progress / 100) * (LOADING_STEPS.length - 1));
    setStep(stepIndex);
  }, [progress]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            y: -20,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#05050f]"
        >
          {/* Background Grid */}
          <div className="absolute inset-0 dot-grid opacity-[0.03]" />
          
          <div className="relative w-full max-w-xs px-6">
            {/* Logo Scramble/Reveal */}
            <div className="mb-12 flex justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative w-16 h-16 flex items-center justify-center border border-cyan-400/30 bg-cyan-400/5 overflow-hidden"
              >
                <div className="absolute inset-0 bg-cyan-400/10" />
                <motion.span 
                  className="relative text-3xl font-black text-cyan-400"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >
                  Y
                </motion.span>
                {/* Scanning line */}
                <motion.div 
                  className="absolute inset-x-0 h-[2px] bg-cyan-400/50 z-10"
                  animate={{ top: ['-10%', '110%'] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                />
              </motion.div>
            </div>

            {/* Progress Info */}
            <div className="flex justify-between items-end mb-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-cyan-400/60 font-mono tracking-widest uppercase mb-1">
                  Status
                </span>
                <span className="text-[11px] text-cyan-400 font-mono tracking-[0.2em] h-4">
                  {LOADING_STEPS[step]}
                </span>
              </div>
              <span className="text-xl font-black text-theme" style={{ fontFamily: 'var(--font-syne)' }}>
                {Math.round(progress)}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-[2px] w-full bg-white/5 overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Subtext */}
            <div className="mt-8 flex justify-center">
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-1 bg-cyan-400/20"
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom readout */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full px-12 flex justify-between items-center opacity-20">
             <span className="text-[9px] font-mono tracking-[0.3em] uppercase">YS_V.2026_INITIALIZE</span>
             <span className="text-[9px] font-mono tracking-[0.3em] uppercase">EST_LINK_88%</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
