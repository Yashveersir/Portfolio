'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const [atBottom, setAtBottom] = useState(false);
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
    const observer = new IntersectionObserver(
      ([entry]) => setAtBottom(entry.isIntersecting),
      { threshold: 0.6 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={ref}
      className="relative border-t border-white/5 pt-14 pb-8 overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      {/* Infinite scrolling marquee background */}
      <div className="absolute top-0 left-0 w-full overflow-hidden border-b border-white/5 py-3 pointer-events-none select-none bg-[#050505]">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 20 }}
        >
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-cyan-400/50 mr-4" style={{ fontFamily: 'var(--font-syne)' }}>
            LET'S BUILD SOMETHING GREAT · OPEN TO WORK · GET IN TOUCH · LET'S BUILD SOMETHING GREAT · OPEN TO WORK · GET IN TOUCH · LET'S BUILD SOMETHING GREAT · OPEN TO WORK · GET IN TOUCH · LET'S BUILD SOMETHING GREAT · OPEN TO WORK · GET IN TOUCH · LET'S BUILD SOMETHING GREAT · OPEN TO WORK · GET IN TOUCH · LET'S BUILD SOMETHING GREAT · OPEN TO WORK · GET IN TOUCH ·
          </span>
        </motion.div>
      </div>
      <div className="mx-auto max-w-7xl px-6 pt-8">
        {/* Back to top button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/50 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-400/10 transition-all group"
            aria-label="Back to top"
          >
            <FaArrowUp size={14} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left — copyright */}
          <p
            className="text-[10px] uppercase tracking-widest text-white/20"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            © {year} Yashveer Singh · All rights reserved
          </p>

          {/* Center — conditional hire me message */}
          <AnimatePresence>
            {atBottom && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.6 }}
                className="text-xs text-white/40 text-center"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                You made it to the bottom. Now hire me. 👋
              </motion.p>
            )}
          </AnimatePresence>

          {/* Right — built with */}
          <p
            className="text-[10px] uppercase tracking-widest text-white/15"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Built with Next.js · Framer Motion
          </p>
        </div>
      </div>
    </footer>
  );
}
