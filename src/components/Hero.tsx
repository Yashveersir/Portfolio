'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useTransform, useMotionValue } from 'framer-motion';
import Image from 'next/image';

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
    
    if (text === current && !deleting) {
      const timeout = setTimeout(() => {
        setDeleting(true);
      }, 1800);
      return () => clearTimeout(timeout);
    } else if (text === '' && deleting) {
      setDeleting(false);
      setIdx((p) => (p + 1) % ROLES.length);
      return;
    }

    const speed = deleting ? 28 : 72;
    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, text.length + 1));
      } else {
        setText(current.slice(0, text.length - 1));
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [text, deleting, idx]);

  return (
    <span className="text-[var(--cyan)]" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem' }}>
      {'>'} {text}<span className="animate-pulse ml-0.5">_</span>
    </span>
  );
}

import HeroBg from './HeroBg';

/* ──────────────── photo frame ──────────────── */
function PhotoFrame() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: '0px' });

  // 3D Tilt state
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 100, damping: 25 });
  const mouseY = useSpring(y, { stiffness: 100, damping: 25 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ['12deg', '-12deg']);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ['-12deg', '12deg']);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    x.set(mouseXPos / width - 0.5);
    y.set(mouseYPos / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 1.3 }}
      className="relative flex-shrink-0 perspective-1200"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* HUD Label: TOP LEFT */}
      <motion.div 
        className="absolute -top-12 -left-8 z-20 pointer-events-none"
        style={{ translateZ: '60px' }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-cyan-400/80 uppercase tracking-[0.3em]" style={{ fontFamily: 'var(--font-mono)' }}>
            [ SYSTEM_READY ]
          </span>
          <div className="flex gap-1">
            <div className="w-8 h-[1px] bg-cyan-400/40" />
            <div className="w-2 h-[1px] bg-cyan-400/20" />
          </div>
        </div>
      </motion.div>

      {/* HUD Label: BOTTOM RIGHT */}
      <motion.div 
        className="absolute -bottom-8 -right-12 z-20 pointer-events-none"
        style={{ translateZ: '70px' }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <div className="flex items-center gap-3 border border-theme bg-theme-card backdrop-blur-md px-4 py-2 pixel-border">
          <div className="w-2 h-2 rounded-none bg-[var(--cyan)] animate-pulse" />
          <span className="text-[9px] font-bold text-theme-muted uppercase tracking-[0.25em]" style={{ fontFamily: 'var(--font-mono)' }}>
            CORE_ID // YS.V26
          </span>
        </div>
      </motion.div>

      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative group/photo"
      >
        {/* Outer glow ring */}
        <div
          className="absolute inset-[-20px] rounded-full pointer-events-none opacity-0 group-hover/photo:opacity-100 transition-opacity duration-700"
          style={{
            background: 'radial-gradient(circle at 50% 50%, var(--cyan) 0%, transparent 70%)',
            filter: 'blur(24px)',
            opacity: 0.2,
            transform: 'translateZ(-20px)'
          }}
        />

        {/* Animated dashed border */}
        <svg
          className="absolute inset-[-10px] w-[calc(100%+20px)] h-[calc(100%+20px)] pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ overflow: 'visible', transform: 'translateZ(15px)' }}
        >
          <motion.rect
            x="0" y="0" width="100" height="100"
            fill="none"
            stroke="var(--cyan)"
            style={{ opacity: 0.4 }}
            strokeWidth="0.5"
            strokeDasharray="4 6"
            animate={isInView ? { strokeDashoffset: [0, -100] } : { strokeDashoffset: 0 }}
            transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Photo container */}
        <div
          className="relative overflow-hidden scanline"
          style={{
            width: 'clamp(240px, 25vw, 380px)',
            height: 'clamp(300px, 32vw, 480px)',
            clipPath: 'polygon(0 0, 92% 0, 100% 8%, 100% 100%, 8% 100%, 0 92%)',
            transform: 'translateZ(30px)',
            border: '1px solid var(--card-border)'
          }}
        >
          <Image
            src="/myImage.jpeg"
            alt="Yashveer Singh"
            width={400}
            height={500}
            priority
            className="w-full h-full object-cover object-center scale-105 group-hover/photo:scale-110 transition-transform duration-1000"
            style={{ filter: 'contrast(1.1) saturate(0.85) brightness(0.95)' }}
          />
          <div
            className="absolute inset-0 bg-[var(--cyan)]/5 mix-blend-overlay"
          />
          <motion.div
            className="absolute left-0 right-0 h-[1px] pointer-events-none z-20"
            style={{ background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)' }}
            animate={isInView ? { top: ['-5%', '105%'] } : { top: '-5%' }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear', repeatDelay: 2 }}
          />
        </div>

        {/* Corner accents */}
        {[
          { top: -10, left: -10, rot: 0, z: '45px' },
          { top: -10, right: -10, rot: 90, z: '45px' },
          { bottom: -10, right: -10, rot: 180, z: '45px' },
          { bottom: -10, left: -10, rot: 270, z: '45px' },
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-6 h-6 pointer-events-none"
            style={{
              ...('top' in pos ? { top: pos.top } : { bottom: (pos as { bottom: number }).bottom }),
              ...('left' in pos ? { left: pos.left } : { right: (pos as { right: number }).right }),
              border: '2px solid var(--cyan)',
              opacity: 0.6,
              clipPath: 'polygon(0 0, 35% 0, 35% 35%, 100% 35%, 100% 100%, 0 100%)',
              transform: `rotate(${pos.rot}deg) translateZ(${pos.z})`,
            }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ repeat: Infinity, duration: 3, delay: i * 0.7 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ──────────────── main hero ──────────────── */
export default function Hero() {
  const springConfig = { type: 'spring' as const, stiffness: 100, damping: 15 };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full overflow-hidden flex items-center"
      style={{ background: 'var(--bg)' }}
      suppressHydrationWarning
    >
      <HeroBg />
      <div className="absolute inset-0 dot-grid pointer-events-none" style={{ opacity: 0.05 }} />
      
      {/* Decorative vertical line */}
      <motion.div 
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.5, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-8 md:left-12 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent hidden md:block origin-top" 
      />

      {/* Main content container */}
      <div className="relative z-10 w-full px-6 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-12 pt-32 md:pt-20 pb-16">

          {/* LEFT — text */}
          <div className="flex-1 w-full text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="inline-flex items-center gap-3 border border-theme bg-theme-card backdrop-blur-xl px-4 py-2 pixel-border mb-8 lg:mb-12"
            >
              <div className="relative w-2 h-2">
                <div className="absolute inset-0 rounded-none bg-[var(--cyan)]/60 radar-ring" />
                <div className="relative w-2 h-2 rounded-none bg-[var(--cyan)] shadow-[0_0_8px_var(--cyan)]" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--cyan)]" style={{ fontFamily: 'var(--font-mono)' }}>
                STATUS: ACTIVE
              </span>
            </motion.div>

            <div className="mb-8" data-hero-headline="true">
              <h1 className="sr-only">Yashveer Singh — I Build Things That Live Online</h1>
              
              <div className="overflow-hidden mb-2">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springConfig, delay: 0.9 }}
                  style={{
                    fontFamily: 'var(--font-syne)', fontWeight: 200,
                    fontSize: 'clamp(2rem, 5vw, 4.5rem)', lineHeight: 1,
                    color: 'var(--text)', opacity: 0.95, letterSpacing: '-0.02em',
                  }}
                >
                  I Build
                </motion.div>
              </div>

              <div className="overflow-hidden mb-2">
                <motion.div
                  initial={{ opacity: 0, y: 80 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springConfig, delay: 1.05 }}
                  style={{
                    fontFamily: 'var(--font-syne)', fontWeight: 800,
                    fontSize: 'clamp(3.8rem, 10vw, 8.5rem)', lineHeight: 0.9,
                    letterSpacing: '-0.05em',
                    background: 'linear-gradient(135deg, var(--text) 20%, var(--cyan) 80%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    paddingRight: '0.05em',
                    filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))'
                  }}
                >
                  Things
                </motion.div>
              </div>

              <div className="overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springConfig, delay: 1.2 }}
                  style={{
                    fontFamily: 'var(--font-syne)', fontWeight: 200,
                    fontSize: 'clamp(1.6rem, 4vw, 3.8rem)', lineHeight: 1.1,
                    color: 'var(--text)', opacity: 0.85, letterSpacing: '-0.01em',
                  }}
                >
                  That Live Online.
                </motion.div>
              </div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mb-12 h-6 flex justify-center lg:justify-start">
              <TypingEffect />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 0.6 }}
              className="flex flex-wrap gap-5 justify-center lg:justify-start"
            >
              <a
                href="#projects"
                className="group relative px-10 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-black overflow-hidden transition-all hover:text-cyan-400"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                <div className="absolute inset-0 bg-cyan-400 transition-transform duration-300 group-hover:scale-x-0 origin-right" />
                <div className="absolute inset-0 border border-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                <span className="relative z-10">Exploration</span>
              </a>
              
              <a
                href="#contact"
                className="group relative px-10 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-theme border border-theme overflow-hidden hover:text-[var(--cyan)] transition-colors"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                <div className="absolute inset-0 bg-[var(--cyan)]/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                <span className="relative z-10">Contact</span>
              </a>

              <button
                onClick={async () => {
                  const res = await fetch('/api/resume?download=true');
                  const blob = await res.blob();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'Yashveer-Singh-Resume.pdf';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className="group relative px-10 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--amber)] border border-[var(--amber)]/30 overflow-hidden hover:text-[var(--amber)] hover:border-[var(--amber)] transition-all cursor-pointer shadow-[0_0_15px_rgba(255,100,0,0.1)] hover:shadow-[0_0_20px_rgba(255,100,0,0.2)]"
                style={{ fontFamily: 'var(--font-mono)' }}
                aria-label="Download my resume"
              >
                <div className="absolute inset-0 bg-[var(--amber)]/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                <span className="relative z-10">↓ Resume</span>
              </button>
            </motion.div>
          </div>

          {/* RIGHT — photo */}
          <div className="flex-shrink-0 lg:mr-10">
            <PhotoFrame />
          </div>

        </div>
      </div>

      {/* Bottom info bar */}
      <div className="absolute bottom-0 left-0 right-0 h-16 border-t border-theme flex items-center px-4 md:px-16 justify-between bg-theme-card backdrop-blur-sm">
        <div className="flex gap-6 md:gap-10">
          {[
            { value: '8.6', label: 'CGPA' },
            { value: '3+', label: 'Live' },
          ].map((s) => (
            <div key={s.label} className="flex flex-col">
              <span className="text-[11px] md:text-xs font-black text-theme" style={{ fontFamily: 'var(--font-mono)' }}>{s.value}</span>
              <span className="text-[7px] md:text-[8px] uppercase tracking-widest text-theme-muted" style={{ fontFamily: 'var(--font-mono)' }}>{s.label}</span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-3 md:gap-6">
          <span className="text-[7px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.4em] text-theme-muted" style={{ fontFamily: 'var(--font-mono)' }}>
            <span className="hidden xs:inline">SCROLL_TO_EXPLORE</span>
            <span className="xs:hidden">SCROLL</span>
          </span>
          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-8 md:w-12 h-[1px] bg-cyan-400/30"
          />
        </div>
      </div>
    </section>
  );
}

