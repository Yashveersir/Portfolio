'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { socialLinks as DEFAULT_SOCIAL_LINKS } from '@/lib/constants';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { FaArrowUp, FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const [atBottom, setAtBottom] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [year, setYear] = useState(2026);
  const [time, setTime] = useState('');
  const { data } = usePortfolioData();
  const socialLinks = data?.socialLinks?.email ? data.socialLinks : DEFAULT_SOCIAL_LINKS;

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
      { threshold: 0.1 }
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
      className="relative overflow-hidden bg-transparent pt-32 pb-8"
      suppressHydrationWarning
    >
      {/* ─── Glowing Depth Overlay ─── */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120vw] h-[300px] bg-[radial-gradient(ellipse_at_bottom,rgba(34,211,238,0.15)_0%,transparent_60%)] pointer-events-none" />

      {/* ─── Massive Cinematic Marquee ─── */}
      <div className="w-full overflow-hidden border-y border-white/5 py-6 mb-16 bg-[#04060C]/40 backdrop-blur-xl relative z-10 pointer-events-none select-none">
        <motion.div
          className="flex whitespace-nowrap"
          animate={atBottom && mounted ? { x: ['0%', '-50%'] } : { x: '0%' }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 40 }}
        >
          <span className="text-[6vw] leading-none font-black uppercase text-transparent bg-clip-text bg-gradient-to-b from-white/90 to-white/10 tracking-tighter mr-8" style={{ fontFamily: 'var(--font-syne)' }}>
            YASHVEER SINGH <span className="text-[var(--cyan)]">•</span> FULL-STACK ENGINEER <span className="text-[var(--cyan)]">•</span> YASHVEER SINGH <span className="text-[var(--cyan)]">•</span> FULL-STACK ENGINEER <span className="text-[var(--cyan)]">•</span>
          </span>
        </motion.div>
      </div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        
        {/* Back to top button */}
        <div className="flex justify-center mb-16">
          <button
            onClick={() => {
              const win = window as unknown as { lenis?: { scrollTo: (y: number) => void } };
              if (win.lenis) {
                win.lenis.scrollTo(0);
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="w-12 h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center text-white/50 hover:text-[var(--cyan)] hover:border-[var(--cyan)]/50 hover:bg-[var(--cyan)]/10 transition-all group shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            aria-label="Back to top"
          >
            <FaArrowUp size={16} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t border-white/10">
          
          {/* Left — Copyright & Time */}
          <div className="flex flex-col items-center md:items-start gap-2 w-full md:w-1/3">
            <p
              className="text-[10px] uppercase tracking-[0.2em] text-white/40"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              © {mounted ? year : '2026'} Yashveer Singh
            </p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse" />
              <p className="text-[9px] text-white/40 uppercase tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>
                Burdwan, IN — {mounted ? time : '--:-- --'} IST
              </p>
            </div>
          </div>

          {/* Center — Social Pill */}
          <div className="flex justify-center w-full md:w-1/3">
            <div className="flex items-center gap-6 px-8 py-3 bg-[#04060C]/60 backdrop-blur-md border border-white/10 rounded-full shadow-xl">
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white hover:scale-110 transition-all duration-300" aria-label="GitHub Profile">
                <FaGithub size={18} aria-hidden="true" />
              </a>
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[#0077b5] hover:scale-110 transition-all duration-300" aria-label="LinkedIn Profile">
                <FaLinkedin size={18} aria-hidden="true" />
              </a>
              <a href="mailto:yashveersingh.work@gmail.com" className="text-white/50 hover:text-[var(--cyan)] hover:scale-110 transition-all duration-300" aria-label="Send Email">
                <FaEnvelope size={18} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Right — Built with */}
          <div className="flex justify-center md:justify-end w-full md:w-1/3">
            <p
              className="text-[10px] uppercase tracking-widest text-white/40 text-center md:text-right"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Designed & Built by<br />Yashveer Singh
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
