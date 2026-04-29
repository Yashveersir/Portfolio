'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { navLinks } from '@/lib/constants';
import ThemeToggle from './ThemeToggle';

// Scramble effect characters
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';

function ScrambleText({ text, active }: { text: string; active?: boolean }) {
  const [displayed, setDisplayed] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scramble = useCallback(() => {
    let iter = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    // Slowed down from 30ms to 40ms to save CPU cycles
    intervalRef.current = setInterval(() => {
      setDisplayed(
        text
          .split('')
          .map((char, i) =>
            i < Math.floor(iter) ? char : CHARS[Math.floor(Math.random() * CHARS.length)]
          )
          .join('')
      );
      iter += 1 / 2; // Slower iteration
      if (iter >= text.length) {
        setDisplayed(text);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, 40);
  }, [text]);

  useEffect(() => {
    if (active) scramble();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [active, scramble]);

  return (
    <span
      onMouseEnter={scramble}
      className="font-mono tracking-[0.2em] text-[10px] uppercase transition-colors"
      style={{ fontFamily: 'var(--font-mono)' }}
    >
      {displayed}
    </span>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Use IntersectionObserver for active section tracking
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -50% 0px', // Target the middle of the screen
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    navLinks.forEach((link) => {
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  // Removed custom scrollTo since Lenis handles hash navigation

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${
        scrolled || open ? 'w-[90%] md:w-auto' : 'w-full px-6'
      }`}
      style={{
        willChange: 'transform, width',
      }}
      suppressHydrationWarning
    >
      <div 
        className={`mx-auto flex items-center justify-between gap-4 md:gap-8 px-6 py-3 transition-all duration-500 ease-in-out ${
          scrolled || open 
            ? 'max-w-4xl rounded-full border border-theme bg-theme-card backdrop-blur-md shadow-2xl' 
            : 'max-w-6xl rounded-none border-transparent'
        }`}
        style={{
          background: scrolled || open ? 'var(--card-bg)' : 'transparent',
          backdropFilter: scrolled || open ? 'blur(8px)' : 'blur(0px)',
          WebkitBackdropFilter: scrolled || open ? 'blur(8px)' : 'blur(0px)',
          willChange: 'background-color, backdrop-filter, border-color',
        }}
      >
        {/* Logo */}
        <a
          href="#hero"
          onClick={() => setOpen(false)}
          className="group relative flex items-center gap-4 text-xl font-black tracking-[-0.05em] text-theme"
          style={{ fontFamily: 'var(--font-syne)' }}
          aria-label="Yashveer Singh - Home"
        >
          <div className="relative w-8 h-8 flex items-center justify-center border border-cyan-400/20 bg-cyan-400/5 group-hover:border-cyan-400/50 transition-colors overflow-hidden">
            <div className="absolute inset-0 bg-cyan-400/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative text-cyan-400">Y</span>
          </div>
          <span className="hidden sm:inline-block group-hover:text-cyan-400 transition-colors uppercase text-[10px] tracking-[0.3em] font-mono mt-1" style={{ fontFamily: 'var(--font-mono)' }}>Singh</span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={() => {
                setOpen(false);
              }}
              className="relative cursor-pointer py-1"
              style={{ color: active === link.id ? 'var(--cyan)' : 'var(--text-dim)' }}
            >
              <ScrambleText text={link.title} active={active === link.id} />
              {active === link.id && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 h-[2px] w-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:block w-[1px] h-4 bg-theme-muted mx-2" />
          <ThemeToggle />
          
          <a
            href="/Yashveer-Singh-Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:block group relative px-4 py-2 overflow-hidden border border-amber-500/40 text-[9px] font-bold uppercase tracking-[0.2em] text-amber-500 transition-all hover:text-black"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            <div className="absolute inset-0 bg-amber-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            <span className="relative z-10">Resume</span>
          </a>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="relative z-50 text-theme md:hidden flex items-center justify-center w-10 h-10 -mr-2"
            aria-label="Toggle menu"
          >
            {open ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+16px)] w-[calc(100vw-2rem)] max-w-sm overflow-hidden border border-theme bg-theme-card backdrop-blur-xl rounded-2xl md:hidden shadow-2xl"
          >
            <div className="flex flex-col items-center gap-8 py-12">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="text-sm uppercase tracking-[0.25em] transition-colors cursor-pointer py-2"
                  style={{
                    color: active === link.id ? 'var(--cyan)' : 'var(--text-dim)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {link.title}
                </a>
              ))}
              <a
                href="/Yashveer-Singh-Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 border border-amber-500/40 px-10 py-4 text-[11px] font-bold uppercase tracking-widest text-amber-500 rounded-full hover:bg-amber-500/10 transition-colors"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
