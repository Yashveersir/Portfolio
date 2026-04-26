'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const ROLES = [
  'Full-Stack Developer',
  'Generative AI Enthusiast',
  'Backend Systems Engineer',
  'MERN Stack Specialist',
];

/* ──────────────── typing effect ──────────────── */
function TypingEffect() {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = ROLES[idx];
    const speed = deleting ? 28 : 72;
    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, text.length + 1));
        if (text === current) setTimeout(() => setDeleting(true), 1800);
      } else {
        setText(current.slice(0, text.length - 1));
        if (text === '') { setDeleting(false); setIdx((p) => (p + 1) % ROLES.length); }
      }
    }, text === current && !deleting ? 1800 : speed);
    return () => clearTimeout(timeout);
  }, [text, deleting, idx]);

  return (
    <span className="text-cyan-400" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem' }}>
      {'>'} {text}<span className="animate-pulse ml-0.5">_</span>
    </span>
  );
}

import HeroBg from './HeroBg';

/* ──────────────── photo frame ──────────────── */
function PhotoFrame() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ type: 'spring' as const, stiffness: 80, damping: 18, delay: 0.6 }}
      className="relative flex-shrink-0"
    >
      {/* Outer glow ring */}
      <div
        className="absolute inset-[-12px] rounded-2xl pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(34,211,238,0.15) 0%, transparent 70%)',
          filter: 'blur(12px)',
        }}
      />

      {/* Animated dashed border */}
      <svg
        className="absolute inset-[-6px] w-[calc(100%+12px)] h-[calc(100%+12px)] pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
      >
        <motion.rect
          x="0" y="0" width="100" height="100"
          rx="8"
          fill="none"
          stroke="rgba(34,211,238,0.5)"
          strokeWidth="0.5"
          strokeDasharray="6 4"
          animate={{ strokeDashoffset: [0, -40] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Photo container */}
      <div
        className="relative overflow-hidden"
        style={{
          width: 'clamp(220px, 22vw, 340px)',
          height: 'clamp(280px, 28vw, 430px)',
          clipPath: 'polygon(0 0, 94% 0, 100% 6%, 100% 100%, 6% 100%, 0 94%)',
        }}
      >
        <img
          src="/myImage.jpeg"
          alt="Yashveer Singh"
          className="w-full h-full object-cover object-center"
          style={{ filter: 'contrast(1.08) saturate(0.9)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, rgba(34,211,238,0.12) 0%, transparent 50%, rgba(124,111,255,0.08) 100%)' }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)' }}
        />
        <motion.div
          className="absolute left-0 right-0 h-[2px] pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.6), transparent)' }}
          animate={{ top: ['-2%', '102%'] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'linear', repeatDelay: 1 }}
        />
      </div>

      {/* Corner accents */}
      {[
        { top: -6, left: -6, rot: 0 },
        { top: -6, right: -6, rot: 90 },
        { bottom: -6, right: -6, rot: 180 },
        { bottom: -6, left: -6, rot: 270 },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-5 h-5 pointer-events-none"
          style={{
            ...('top' in pos ? { top: pos.top } : { bottom: (pos as { bottom: number }).bottom }),
            ...('left' in pos ? { left: pos.left } : { right: (pos as { right: number }).right }),
            border: '1.5px solid rgba(34,211,238,0.8)',
            clipPath: 'polygon(0 0, 40% 0, 40% 40%, 100% 40%, 100% 100%, 0 100%)',
            transform: `rotate(${pos.rot}deg)`,
          }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
        />
      ))}

      {/* Name badge below photo */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mt-4 flex items-center justify-between"
      >
        <div>
          <p className="text-xs font-bold text-white/80 uppercase tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>
            Yashveer Singh
          </p>
          <p className="text-[10px] text-cyan-400/70 uppercase tracking-[0.2em]" style={{ fontFamily: 'var(--font-mono)' }}>
            Burdwan, WB · India
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[9px] text-cyan-400/60 uppercase tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>
            Available
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ──────────────── main hero ──────────────── */
export default function Hero() {
  const springConfig = { type: 'spring' as const, stiffness: 120, damping: 14 };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      <HeroBg />
      <div className="absolute inset-0 dot-grid pointer-events-none" style={{ opacity: 0.04 }} />

      {/* Radar badge */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="absolute top-24 md:top-28 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-10 z-20"
      >
        <div className="flex items-center gap-2.5 border border-cyan-400/20 bg-cyan-400/5 backdrop-blur px-4 py-2">
          <div className="relative w-3 h-3">
            <div className="absolute inset-0 rounded-full bg-cyan-400/70 radar-ring" />
            <div className="absolute inset-0 rounded-full bg-cyan-400/40 radar-ring-2" />
            <div className="relative w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.9)]" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400" style={{ fontFamily: 'var(--font-mono)' }}>
            Open to Work
          </span>
        </div>
      </motion.div>

      {/* Split layout */}
      <div className="relative z-10 min-h-screen flex items-center px-6 md:px-16 lg:px-24">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-14 lg:gap-8 pt-28 pb-20">

          {/* LEFT — text */}
          <div className="flex-1 max-w-2xl">
            <div className="mb-6" data-hero-headline="true">
              <div className="overflow-hidden mb-1">
                <motion.div
                  initial={{ opacity: 0, x: -60, rotate: -2 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  transition={{ ...springConfig, delay: 0.5 }}
                  style={{
                    fontFamily: 'var(--font-syne)', fontWeight: 200,
                    fontSize: 'clamp(2.4rem, 6vw, 5.5rem)', lineHeight: 1.0,
                    color: 'rgba(255,255,255,0.7)', letterSpacing: '-0.03em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  I Build
                </motion.div>
              </div>

              <div className="overflow-hidden mb-1" style={{ marginLeft: 'clamp(12px, 2.5vw, 40px)' }}>
                <motion.div
                  initial={{ opacity: 0, x: 60, rotate: 2 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  transition={{ ...springConfig, delay: 0.65 }}
                  style={{
                    fontFamily: 'var(--font-syne)', fontWeight: 900,
                    fontSize: 'clamp(3.5rem, 9vw, 8rem)', lineHeight: 0.95,
                    letterSpacing: '-0.04em',
                    background: 'linear-gradient(135deg, #fff 30%, #22d3ee 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    paddingRight: '0.1em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Things
                </motion.div>
              </div>

              <div className="overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, y: 40, rotate: 1 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ ...springConfig, delay: 0.8 }}
                  style={{
                    fontFamily: 'var(--font-syne)', fontWeight: 200,
                    fontSize: 'clamp(1.8rem, 4.5vw, 4rem)', lineHeight: 1.1,
                    color: 'rgba(255,255,255,0.6)', letterSpacing: '-0.02em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  That Live Online.
                </motion.div>
              </div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05 }} className="mb-10 h-7">
              <TypingEffect />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.25, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#projects"
                className="inline-block group relative overflow-hidden border border-cyan-400 bg-cyan-400 px-8 py-3 text-sm font-bold uppercase tracking-widest text-black transition-all hover:bg-transparent hover:text-cyan-400 cursor-pointer"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                View Work
              </a>
              <a
                href="#contact"
                className="inline-block border border-white/15 px-8 py-3 text-sm font-bold uppercase tracking-widest text-white/70 transition-all hover:border-white/40 hover:text-white cursor-pointer"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Let&apos;s Talk
              </a>
              <a
                href="/Yashveer-Singh-Resume.pdf"
                download="Yashveer-Singh-Resume.pdf"
                className="border border-violet-500/40 px-8 py-3 text-sm font-bold uppercase tracking-widest text-violet-400/80 transition-all hover:border-violet-400 hover:text-violet-300 hover:bg-violet-500/5 cursor-pointer"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                ↓ Resume
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mt-12 flex gap-8">
              {[
                { value: '8.6', label: 'CGPA' },
                { value: '3+', label: 'Live Projects' },
                { value: '13+', label: 'Certifications' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-black text-white" style={{ fontFamily: 'var(--font-syne)', letterSpacing: '-0.03em' }}>
                    {s.value}
                  </p>
                  <p className="text-[9px] uppercase tracking-widest text-white/30" style={{ fontFamily: 'var(--font-mono)' }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — photo */}
          <div className="flex-shrink-0">
            <PhotoFrame />
          </div>

        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.25), transparent)' }}
      />

      {/* Scroll nudge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] uppercase tracking-[0.3em] text-white/20" style={{ fontFamily: 'var(--font-mono)' }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="w-[1px] h-10 bg-gradient-to-b from-cyan-400/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
