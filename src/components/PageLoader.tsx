'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_MESSAGES = [
  'INITIALIZING SYSTEM',
  'LOADING NEURAL NETWORKS',
  'COMPILING 3D SHADERS',
  'ESTABLISHING CONNECTION',
  'SYSTEM READY'
];

export default function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const duration = 1600; // slightly longer for dramatic effect
    const interval = 16;
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        
        // Update message based on progress
        if (next > 85) setMessageIndex(4);
        else if (next > 65) setMessageIndex(3);
        else if (next > 40) setMessageIndex(2);
        else if (next > 15) setMessageIndex(1);

        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsComplete(true);
            document.body.style.overflow = 'unset';
          }, 300); // Brief pause at 100% before opening doors
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

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ scale: 1, opacity: 1 }}
          exit={{
            scale: 1.5, // Flies towards the camera
            opacity: 0, // Fades out simultaneously
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#05070B] overflow-hidden origin-center"
        >
          {/* Subtle dot grid */}
          <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
          
          {/* Huge glowing background aura */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.05)_0%,transparent_70%)] pointer-events-none" />

          <div className="relative flex flex-col items-center gap-12 w-full max-w-[320px] px-6">

            {/* Monogram / Logo Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-3 relative"
            >
              <div className="absolute -inset-10 bg-[var(--cyan)]/5 blur-3xl rounded-full" />
              <span
                className="text-[64px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 tracking-[-0.05em] leading-none drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] relative z-10"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                YS
              </span>
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-[var(--cyan)] to-transparent relative z-10" />
              <span
                className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--cyan)] relative z-10"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Portfolio // 26
              </span>
            </motion.div>

            {/* Terminal & Progress Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="w-full flex flex-col gap-3"
            >
              {/* Terminal Text */}
              <div className="flex justify-between items-end">
                <span
                  key={messageIndex}
                  className="text-[8px] text-[var(--text-muted)] uppercase tracking-[0.2em] animate-pulse"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  &gt; {LOADING_MESSAGES[messageIndex]}
                </span>
                <span
                  className="text-[10px] font-bold text-white tabular-nums tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {Math.round(progress)}%
                </span>
              </div>

              {/* Laser Progress Bar */}
              <div className="relative h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-[var(--cyan)] rounded-full"
                  style={{
                    width: `${progress}%`,
                    boxShadow: '0 0 15px var(--cyan), 0 0 5px white',
                  }}
                  transition={{ duration: 0.05, ease: "linear" }}
                />
                {/* Laser head glow */}
                <motion.div 
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full blur-[4px]"
                  style={{ left: `calc(${progress}% - 8px)` }}
                />
              </div>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
