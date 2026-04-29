'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { socialLinks } from '@/lib/constants';
import { FaArrowUp, FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const [atBottom, setAtBottom] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [year, setYear] = useState(2026);
  const [time, setTime] = useState('');

  useEffect(() => {
    setMounted(true);
    setYear(new Date().getFullYear());
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }));
    };
    tick();
    const interval = setInterval(tick, 60000);

    const observer = new IntersectionObserver(
      ([entry]) => setAtBottom(entry.isIntersecting),
      { threshold: 0.6 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return (
    <footer
      ref={ref}
      className="relative border-t border-theme pt-14 pb-8 overflow-hidden"
      style={{ background: 'var(--bg)' }}
      suppressHydrationWarning
    >
      {/* Infinite scrolling marquee background */}
      <div className="absolute top-0 left-0 w-full overflow-hidden border-b border-theme py-3 pointer-events-none select-none bg-theme-card">
        <motion.div
          className="flex whitespace-nowrap"
          animate={atBottom && mounted ? { x: ['0%', '-50%'] } : { x: '0%' }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 20 }}
        >
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-cyan-400/50 mr-4" style={{ fontFamily: 'var(--font-syne)' }}>
            LET&apos;S BUILD SOMETHING GREAT · OPEN TO WORK · GET IN TOUCH · LET&apos;S BUILD SOMETHING GREAT · OPEN TO WORK · GET IN TOUCH · LET&apos;S BUILD SOMETHING GREAT · OPEN TO WORK · GET IN TOUCH · LET&apos;S BUILD SOMETHING GREAT · OPEN TO WORK · GET IN TOUCH · LET&apos;S BUILD SOMETHING GREAT · OPEN TO WORK · GET IN TOUCH · LET&apos;S BUILD SOMETHING GREAT · OPEN TO WORK · GET IN TOUCH ·
          </span>
        </motion.div>
      </div>
      <div className="mx-auto max-w-7xl px-6 pt-8">
        {/* Back to top button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => {
              const win = window as unknown as { lenis?: { scrollTo: (y: number) => void } };
              if (win.lenis) {
                win.lenis.scrollTo(0);
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="w-10 h-10 rounded-full border border-theme bg-theme-card flex items-center justify-center text-theme-dim hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-400/10 transition-all group"
            aria-label="Back to top"
          >
            <FaArrowUp size={14} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t border-theme">
          {/* Left — copyright & time */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <p
              className="text-[10px] uppercase tracking-[0.2em] text-theme-muted"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              © {mounted ? year : '2026'} Yashveer Singh
            </p>
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[9px] text-theme-muted uppercase tracking-widest" style={{ fontFamily: 'var(--font-mono)', opacity: 0.7 }}>
                Burdwan, IN — {mounted ? time : '--:-- --'} IST
              </p>
            </div>
          </div>

          {/* Center — hire me & social */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-4">
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-theme-muted hover:text-theme transition-colors" aria-label="GitHub Profile">
                <FaGithub size={16} aria-hidden="true" />
              </a>
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-theme-muted hover:text-blue-400 transition-colors" aria-label="LinkedIn Profile">
                <FaLinkedin size={16} aria-hidden="true" />
              </a>
              <a href="mailto:yashveersingh.work@gmail.com" className="text-theme-muted hover:text-cyan-400 transition-colors" aria-label="Send Email">
                <FaEnvelope size={16} aria-hidden="true" />
              </a>
            </div>
            <AnimatePresence>
              {atBottom && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.6 }}
                  className="text-[10px] text-cyan-400/40 uppercase tracking-[0.2em]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  Ready for new challenges.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Right — built with */}
          <p
            className="text-[10px] uppercase tracking-widest text-theme-muted"
            style={{ fontFamily: 'var(--font-mono)', opacity: 0.7 }}
          >
            Designed & Built by Yashveer Singh
          </p>
        </div>
      </div>
    </footer>
  );
}
