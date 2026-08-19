'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useTransform, useMotionValue } from 'framer-motion';
import Image from 'next/image';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import Hero3D from './Hero3D';

const DEFAULT_ROLES = [
  'Full-Stack Developer',
  'Generative AI Enthusiast',
  'Backend Systems Engineer',
  'MERN Stack Specialist',
];

/* ──────────────── typing effect ──────────────── */
function TypingEffect({ roles }: { roles: string[] }) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!roles || roles.length === 0) return;
    const current = roles[idx % roles.length];
    
    if (text === current && !deleting) {
      const timeout = setTimeout(() => {
        setDeleting(true);
      }, 1800);
      return () => clearTimeout(timeout);
    } else if (text === '' && deleting) {
      const timeout = setTimeout(() => {
        setDeleting(false);
        setIdx((p) => (p + 1) % roles.length);
      }, 0);
      return () => clearTimeout(timeout);
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
  }, [text, deleting, idx, roles]);

  return (
    <span className="text-[var(--cyan)]" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem' }}>
      {'>'} {text}<span className="animate-pulse ml-0.5">_</span>
    </span>
  );
}

import HeroBg from './HeroBg';

/* ──────────────── photo frame ──────────────── */
function PhotoFrame({ heroImage, dataUpdatedAt }: { heroImage?: string, dataUpdatedAt?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: '0px' });

  // 3D Tilt & Parallax state
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 60, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 60, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ['2deg', '-2deg']);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ['-2deg', '2deg']);
  
  // Subtle parallax for layers
  const bgTranslateX = useTransform(mouseX, [-0.5, 0.5], ['-5px', '5px']);
  const bgTranslateY = useTransform(mouseY, [-0.5, 0.5], ['-5px', '5px']);
  const fgTranslateX = useTransform(mouseX, [-0.5, 0.5], ['8px', '-8px']);
  const fgTranslateY = useTransform(mouseY, [-0.5, 0.5], ['8px', '-8px']);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    // Disable heavy parallax on very small touch devices implicitly by tracking mouse
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    x.set(mouseXPos / width - 0.5);
    y.set(mouseYPos / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Use the exact URL from the backend to avoid breaking signed URLs or strict APIs
  const isValidUrl = heroImage && heroImage.trim().length > 5 && heroImage !== 'null' && heroImage !== 'undefined';
  const imageSrc = isValidUrl ? heroImage : "/cutout.png";

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
      className="relative flex-shrink-0 perspective-1200 w-[85%] max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] mx-auto lg:mx-auto group/wrapper"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative w-full flex justify-center"
      >
        {/* LAYER 1: Environment - Atmospheric bridge to typography */}
        <motion.div
          style={{ x: bgTranslateX, y: bgTranslateY, transform: 'translateZ(-40px)' }}
          className="absolute inset-0 -left-20 -right-10 -top-10 -bottom-10 pointer-events-none opacity-50 group-hover/wrapper:opacity-80 transition-opacity duration-1000"
        >
          {/* Base ambient glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--cyan)_0%,transparent_65%)] blur-[50px] opacity-40 mix-blend-screen" />
          {/* Directional light spill pointing left toward typography */}
          <div className="absolute inset-y-0 left-0 w-1/2 bg-[radial-gradient(ellipse_at_right,var(--cyan)_0%,transparent_70%)] blur-[40px] opacity-20 mix-blend-screen" />
        </motion.div>

        {/* Floating motion container for Portrait & HUD */}
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-full aspect-[4/5] z-10"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* LAYER 2: Portrait - The emergent shape */}
          <div
            className="absolute inset-0 flex justify-center items-end"
            style={{
              transform: 'translateZ(10px)'
            }}
          >
            {/* Subtle atmospheric glow behind the person (not a gradient overlay) */}
            <div className="absolute inset-x-0 bottom-0 top-[30%] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.1)_0%,transparent_70%)] pointer-events-none" style={{ transform: 'translateZ(-10px)' }} />

            {/* The Image (Cutout) */}
            <img
              src={imageSrc}
              alt="Yashveer Singh"
              className="absolute inset-x-0 bottom-0 w-full h-[110%] object-contain object-bottom transition-transform duration-1000 ease-out z-10"
              style={{ 
                filter: 'contrast(1.02) saturate(0.95) brightness(0.98) drop-shadow(-10px 0 15px rgba(34,211,238,0.15)) drop-shadow(10px 0 15px rgba(168,85,247,0.15)) drop-shadow(0 20px 30px rgba(0,0,0,0.6))',
                WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
              }}
            />
            
            {/* Atmospheric energy wisps overlapping silhouette edges */}
            <div className="absolute inset-0 pointer-events-none z-20 mix-blend-screen opacity-40" style={{ transform: 'translateZ(15px)' }}>
               <div className="absolute top-[40%] -left-[10%] w-32 h-32 bg-[radial-gradient(circle_at_center,var(--cyan)_0%,transparent_60%)] blur-[25px]" />
               <div className="absolute bottom-[20%] -right-[10%] w-40 h-40 bg-[radial-gradient(circle_at_center,var(--purple)_0%,transparent_60%)] blur-[30px]" />
            </div>
          </div>

          {/* LAYER 3: Interface & Parallax FG */}
          <motion.div style={{ x: fgTranslateX, y: fgTranslateY, transformStyle: 'preserve-3d', transform: 'translateZ(30px)' }} className="absolute inset-0 pointer-events-none">
            


            {/* Top Left Corner - Near shoulder */}
            <div className="absolute top-[20%] left-[5%] w-8 h-8 opacity-60">
               <svg width="100%" height="100%" viewBox="0 0 56 56" fill="none">
                  <path d="M0 56V14L14 0H56" stroke="var(--cyan)" strokeWidth="1.5" strokeOpacity="0.8" />
                  <path d="M4 56V16L16 4H56" stroke="var(--cyan)" strokeWidth="0.5" strokeOpacity="0.3" />
               </svg>
            </div>
            
            {/* Bottom Right Corner - Near hip */}
            <div className="absolute bottom-[25%] right-[5%] w-6 h-6 opacity-60">
               <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none">
                  <path d="M40 0V30L30 40H0" stroke="var(--cyan)" strokeWidth="1.5" strokeOpacity="0.6" />
               </svg>
            </div>

            {/* Technical Microcopy - Tracking beside the head */}
            <div className="absolute top-[30%] -right-[5%] z-30 hidden md:block" style={{ transform: 'translateZ(40px)' }}>
              <div className="flex flex-col gap-1 text-[7.5px] font-bold text-cyan-400/80 uppercase tracking-[0.3em]" style={{ fontFamily: 'var(--font-mono)' }}>
                <span>SYS_OPT // 99</span>
                <div className="flex gap-1.5 items-center mt-0.5">
                  <motion.div 
                    animate={{ opacity: [1, 0.3, 1] }} 
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className="w-1.5 h-1.5 bg-cyan-400 shadow-[0_0_5px_var(--cyan)]" 
                  />
                  <span className="text-cyan-400">ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Bottom Data Bar - Tracking the torso */}
            <div className="absolute bottom-[15%] -left-[5%] z-30 hidden md:block" style={{ transform: 'translateZ(30px)' }}>
              <div className="flex items-center gap-3 border border-cyan-400/15 bg-theme-card/30 backdrop-blur-md px-3 py-1.5 shadow-[0_4px_20px_rgba(0,255,255,0.05)]" style={{ clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0 100%)' }}>
                <span className="text-[7px] font-bold text-cyan-400/90 uppercase tracking-[0.25em]" style={{ fontFamily: 'var(--font-mono)' }}>
                  ID_VERIFIED
                </span>
                <div className="flex gap-0.5">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="w-0.5 h-2.5 bg-cyan-400/70"
                      animate={{ scaleY: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
                      style={{ originY: 1 }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Signature Visual Element: Rotating Orbital Ring (Behind subject lower left) */}
            <div className="absolute bottom-[5%] left-[5%] w-48 h-48 opacity-25 mix-blend-screen" style={{ transform: 'translateZ(-10px)' }}>
              <motion.svg 
                width="100%" height="100%" viewBox="0 0 100 100" fill="none"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              >
                <circle cx="50" cy="50" r="48" stroke="var(--cyan)" strokeWidth="0.5" strokeDasharray="2 8" />
                <circle cx="50" cy="50" r="40" stroke="var(--cyan)" strokeWidth="1" strokeDasharray="20 40" strokeOpacity="0.5" />
                <circle cx="50" cy="90" r="2.5" fill="var(--cyan)" />
              </motion.svg>
            </div>

          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ──────────────── main hero ──────────────── */
export default function Hero() {
  const springConfig = { type: 'spring' as const, stiffness: 100, damping: 15 };
  const { data } = usePortfolioData();

  const heroHeadline1 = data?.heroHeadline1 || 'I Build';
  const heroHeadline2 = data?.heroHeadline2 || 'Things';
  const heroHeadline3 = data?.heroHeadline3 || 'That Live Online.';
  const roles = (data && Array.isArray(data.heroRoles) && data.heroRoles.length > 0) ? data.heroRoles : DEFAULT_ROLES;

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full overflow-hidden flex items-center"
      style={{ background: 'var(--bg)' }}
      suppressHydrationWarning
    >
      <HeroBg />
      <Hero3D />
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
                  transition={{ ...springConfig, delay: 1.8 }}
                  style={{
                    fontFamily: 'var(--font-syne)', fontWeight: 200,
                    fontSize: 'clamp(2rem, 5vw, 4.5rem)', lineHeight: 1,
                    color: 'var(--text)', opacity: 0.95, letterSpacing: '-0.02em',
                  }}
                >
                  {heroHeadline1}
                </motion.div>
              </div>

              <div className="overflow-hidden mb-2">
                <motion.div
                  initial={{ opacity: 0, y: 80 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springConfig, delay: 1.95 }}
                  className="bg-gradient-to-br from-[var(--text)] to-[var(--cyan)] text-transparent bg-clip-text"
                  style={{
                    fontFamily: 'var(--font-syne)', fontWeight: 800,
                    fontSize: 'clamp(3.8rem, 10vw, 8.5rem)', lineHeight: 0.9,
                    letterSpacing: '-0.05em',
                    paddingRight: '0.05em'
                  }}
                >
                  {heroHeadline2}
                </motion.div>
              </div>

              <div className="overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springConfig, delay: 2.1 }}
                  style={{
                    fontFamily: 'var(--font-syne)', fontWeight: 200,
                    fontSize: 'clamp(1.6rem, 4vw, 3.8rem)', lineHeight: 1.1,
                    color: 'var(--text)', opacity: 0.85, letterSpacing: '-0.01em',
                  }}
                >
                  {heroHeadline3}
                </motion.div>
              </div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }} className="mb-12 h-6 flex justify-center lg:justify-start">
              <TypingEffect roles={roles} />
            </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.6, duration: 0.6 }}
              className="flex flex-wrap gap-5 justify-center lg:justify-start"
            >
              <a
                href="#projects"
                className="group relative px-10 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--bg)] overflow-hidden transition-all hover:text-[var(--cyan)]"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                <div className="absolute inset-0 bg-[var(--cyan)] transition-transform duration-300 group-hover:scale-x-0 origin-right" />
                <div className="absolute inset-0 border border-[var(--cyan)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
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

              <a
                href={`${data?.resumeUrl || '/api/resume'}?download=true`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-10 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--amber)] border border-[var(--amber)]/30 overflow-hidden hover:text-[var(--amber)] hover:border-[var(--amber)] transition-all cursor-pointer shadow-[0_0_15px_rgba(255,100,0,0.1)] hover:shadow-[0_0_20px_rgba(255,100,0,0.2)] text-center inline-block"
                style={{ fontFamily: 'var(--font-mono)' }}
                aria-label="Download my resume"
              >
                <div className="absolute inset-0 bg-[var(--amber)]/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                <span className="relative z-10">↓ Resume</span>
              </a>
            </motion.div>
          </div>

          {/* RIGHT — photo */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-center mt-12 md:mt-16 lg:mt-0 relative z-20">
            <PhotoFrame heroImage={data?.heroImage} dataUpdatedAt={data?.updatedAt} />
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

