'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { navLinks } from '@/lib/constants';
import { Menu, X } from 'lucide-react';

// Scramble effect characters
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';

function ScrambleText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scramble = useCallback(() => {
    let iter = 0;
    clearInterval(intervalRef.current ?? undefined);
    intervalRef.current = setInterval(() => {
      setDisplayed(
        text
          .split('')
          .map((char, i) =>
            i < iter ? char : CHARS[Math.floor(Math.random() * CHARS.length)]
          )
          .join('')
      );
      iter += 0.35;
      if (iter >= text.length) {
        setDisplayed(text);
        clearInterval(intervalRef.current ?? undefined);
      }
    }, 25);
  }, [text]);

  useEffect(() => () => clearInterval(intervalRef.current ?? undefined), []);

  return (
    <span
      onMouseEnter={scramble}
      className="font-mono tracking-widest text-xs uppercase"
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
      const ids = navLinks.map((l) => document.getElementById(l.id));
      let cur = '';
      ids.forEach((el) => {
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY;
          if (window.scrollY >= y - 120) cur = el.id;
        }
      });
      setActive(cur);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Removed custom scrollTo since Lenis handles hash navigation

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed top-0 z-50 w-full"
      style={{
        background: scrolled ? 'rgba(5,5,15,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(34,211,238,0.06)' : 'none',
        transition: 'background 0.4s, border-color 0.4s',
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a
          href="#hero"
          onClick={() => setOpen(false)}
          className="group relative text-lg font-black tracking-[-0.05em] text-white"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          <span className="text-cyan-400">Y</span>
          <span className="text-white/30">·</span>
          <span className="group-hover:text-cyan-400 transition-colors">S</span>
          <span
            className="absolute -bottom-1 left-0 h-[1px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full"
          />
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById(link.id);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
              }}
              className="relative cursor-pointer"
              style={{ color: active === link.id ? '#22d3ee' : 'rgba(255,255,255,0.55)' }}
            >
              <ScrambleText text={link.title} />
              {active === link.id && (
                <motion.div
                  layoutId="nav-dot"
                  className="absolute -bottom-1.5 left-0 h-[1px] w-full bg-cyan-400"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}
          <a
            href="/Yashveer-Singh-Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-none border border-cyan-400/40 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-400 transition-all hover:bg-cyan-400 hover:text-black"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Resume
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="text-white md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-white/5 bg-black/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col items-center gap-7 py-10">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(false);
                    const target = document.getElementById(link.id);
                    if (target) target.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-sm uppercase tracking-widest transition-colors cursor-pointer"
                  style={{
                    color: active === link.id ? '#22d3ee' : 'rgba(255,255,255,0.6)',
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
                className="border border-cyan-400/40 px-6 py-2 text-xs font-bold uppercase tracking-widest text-cyan-400"
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
