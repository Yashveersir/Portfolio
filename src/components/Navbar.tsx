'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { navLinks } from '@/lib/constants';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('hero');

  const pathname = usePathname();

  useEffect(() => {
    // Only setup observer if we are on the home page
    if (pathname !== '/') return;

    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Use a precise intersection line at 40% from top
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -59% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Give DOM a tiny moment to render the sections before querying
    const timeout = setTimeout(() => {
      ['hero', ...navLinks.map(l => l.id)].forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 100);

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [pathname]);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${
        scrolled ? 'w-[90%] max-w-4xl' : 'w-full px-6 max-w-7xl'
      }`}
      suppressHydrationWarning
    >
      <div
        className={`flex items-center justify-between px-6 py-3.5 transition-all duration-500 ease-in-out ${
          scrolled
            ? 'rounded-full border border-theme bg-theme-card/80 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
            : 'rounded-none border-transparent'
        }`}
      >
        {/* Brand */}
        <a
          href="/#hero"
          onClick={() => setOpen(false)}
          className="text-sm font-black tracking-tight text-theme uppercase"
          style={{ fontFamily: 'var(--font-syne)', letterSpacing: '-0.02em' }}
          aria-label="Yashveer Singh — Home"
        >
          YASHVEER.SINGH
        </a>

        {/* Availability badge — desktop */}
        <div className="hidden lg:flex items-center gap-2 ml-6">
          <div className="relative flex items-center gap-2 border border-theme rounded-full px-3 py-1 bg-theme-card/50">
            <span className="relative flex w-1.5 h-1.5">
              <span className="radar-ring absolute inline-flex h-full w-full rounded-full bg-[var(--cyan)] opacity-60" />
              <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-[var(--cyan)]" />
            </span>
            <span
              className="text-[9px] font-bold uppercase tracking-widest text-[var(--cyan)]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Available
            </span>
          </div>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7 ml-auto">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`/#${link.id}`}
              className="relative text-[11px] font-bold uppercase tracking-[0.14em] transition-colors duration-200"
              style={{
                fontFamily: 'var(--font-mono)',
                color: active === link.id ? 'var(--text)' : 'var(--text-dim)',
              }}
            >
              {link.title}
              {active === link.id && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 h-[1px] w-full bg-[var(--cyan)]"
                  style={{ boxShadow: '0 0 8px rgba(34,211,238,0.6)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
            </a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="text-theme md:hidden flex items-center justify-center w-8 h-8 ml-auto"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <motion.div animate={open ? 'open' : 'closed'} className="flex flex-col gap-1.5 w-5">
            <motion.span
              variants={{ open: { rotate: 45, y: 6 }, closed: { rotate: 0, y: 0 } }}
              className="block h-[1.5px] w-full bg-current origin-center transition-all"
            />
            <motion.span
              variants={{ open: { opacity: 0, x: -8 }, closed: { opacity: 1, x: 0 } }}
              className="block h-[1.5px] w-full bg-current"
            />
            <motion.span
              variants={{ open: { rotate: -45, y: -6 }, closed: { rotate: 0, y: 0 } }}
              className="block h-[1.5px] w-full bg-current origin-center transition-all"
            />
          </motion.div>
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute left-0 top-[calc(100%+8px)] w-full border border-theme bg-[#04060C]/95 backdrop-blur-xl rounded-2xl md:hidden shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col items-center gap-5 py-8">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`/#${link.id}`}
                  onClick={() => setOpen(false)}
                  className="text-xs uppercase tracking-[0.2em] transition-colors"
                  style={{
                    color: active === link.id ? 'var(--cyan)' : 'var(--text-dim)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {link.title}
                </a>
              ))}
              <div className="flex items-center gap-2 mt-2 px-4 py-2 border border-[var(--cyan)]/20 rounded-full bg-[var(--cyan)]/5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)] animate-pulse" />
                <span className="text-[9px] uppercase tracking-widest text-[var(--cyan)]" style={{ fontFamily: 'var(--font-mono)' }}>
                  Available for work
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
