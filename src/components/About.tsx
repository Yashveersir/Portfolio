'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import CharSplitHeading from './CharSplitHeading';
import { usePortfolioData } from '@/hooks/usePortfolioData';

const DEFAULT_STATS = [
  { value: '8.6', label: 'CGPA', sub: 'Computer Science' },
  { value: 'MERN', label: 'Specialization', sub: 'Full-Stack Architecture' },
  { value: '3+', label: 'Live Projects', sub: 'Deployed in production' },
  { value: '13+', label: 'Certifications', sub: 'Verified credentials' },
];

function StatCard({ s, i, mounted, isStatsInView }: { s: any, i: number, mounted: boolean, isStatsInView: boolean }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPosition({ x, y });
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotX = ((y - centerY) / centerY) * -12; // Max 12 deg
    const rotY = ((x - centerX) / centerX) * 12;
    
    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div style={{ perspective: 1200 }}>
      <motion.div
        ref={divRef}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={mounted && isStatsInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.8, delay: i * 0.1, type: 'spring' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setOpacity(1)}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          animate={{ rotateX, rotateY }}
          transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.5 }}
          className="p-8 md:p-10 flex flex-col justify-between min-h-[240px] relative overflow-hidden group bg-gradient-to-br from-[#0B1120]/40 to-[#050810]/40 backdrop-blur-2xl border border-[var(--card-border)] rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-shadow hover:shadow-[0_20px_60px_rgba(34,211,238,0.15)]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div 
            className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 rounded-3xl"
            style={{
              opacity,
              background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(34,211,238,0.2), transparent 40%)`
            }}
          />
          
          <div className="absolute inset-0 rounded-3xl border border-white/0 group-hover:border-[var(--cyan)]/30 transition-colors duration-500 pointer-events-none" style={{ transform: 'translateZ(20px)' }} />
          
          <div className="flex flex-col gap-1 z-10" style={{ transform: 'translateZ(30px)' }}>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--cyan)] font-bold flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)] shadow-[0_0_10px_var(--cyan)] animate-pulse" />
              {String(i + 1).padStart(2, '0')} // {s.label}
            </p>
            <p className="text-xs text-white/40 font-dm-sans mt-2 tracking-wide uppercase">
              {s.sub}
            </p>
          </div>
          
          <div className="mt-10 z-10 flex items-end justify-between" style={{ transform: 'translateZ(40px)' }}>
            <p className={`font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/20 tracking-tighter ${String(s.value).length > 3 ? 'text-3xl sm:text-4xl' : 'text-5xl md:text-7xl'}`} style={{ fontFamily: 'var(--font-syne)' }}>
              {s.value}
            </p>

          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function About() {
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const { data } = usePortfolioData();
  
  const stats = (data && Array.isArray(data.aboutStats) && data.aboutStats.length > 0) ? data.aboutStats : DEFAULT_STATS;

  useEffect(() => { setMounted(true); }, []);

  const isTextInView = useInView(textRef, { once: true, margin: '-10%' });
  const isStatsInView = useInView(statsRef, { once: true, margin: '-10%' });

  return (
    <section id="about" ref={sectionRef} className="relative py-32 md:py-48 overflow-hidden bg-transparent">
      
      {/* Background structure */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-[0.02]" />
        
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[var(--cyan)] rounded-full blur-[150px] opacity-[0.05]" 
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-600 rounded-full blur-[150px] opacity-[0.05]" 
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center text-center mb-24 md:mb-32"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--cyan)]" />
            <span className="text-[9px] uppercase tracking-[0.4em] text-[var(--cyan)]" style={{ fontFamily: 'var(--font-mono)' }}>
              01 / Identity
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--cyan)]" />
          </div>
          <CharSplitHeading text="Architecting" fontSize="clamp(2rem, 10vw, 6rem)" />
          <CharSplitHeading text="Digital Reality." fontSize="clamp(2rem, 10vw, 6rem)" />
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start relative">
          
          {/* Left: Editorial Bio */}
          <div className="w-full lg:w-[48%] relative flex flex-col justify-center" ref={textRef}>
            
            {/* Magazine Pull-Quote Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={mounted && isTextInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-12"
            >
              <div className="absolute -left-6 top-2 bottom-2 w-1 bg-gradient-to-b from-[var(--cyan)] to-transparent rounded-full opacity-50" />
              <p
                className="text-3xl md:text-5xl lg:text-[3.25rem] leading-[1.1] text-white/90 font-bold tracking-tighter"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                Building <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--cyan)] to-blue-500">scalable systems</span> that bridge the gap between imagination and reality.
              </p>
            </motion.div>

            {/* Glassmorphic Bio Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={mounted && isTextInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="relative bg-[#04060C]/40 backdrop-blur-2xl border border-[var(--card-border)] p-8 md:p-10 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden group"
            >
              {/* Subtle Blueprint Texture inside the card */}
              <div className="absolute inset-0 blueprint-grid opacity-[0.03]" />
              
              <p className="text-lg md:text-xl leading-[1.8] text-[var(--text-dim)] relative z-10 font-light" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                I am a Computer Science student architecting secure REST APIs, real-time WebSocket systems, and <span className="text-white font-medium">AI-powered pipelines</span>. I believe technical precision must be matched with product-quality design to create truly memorable digital experiences.
              </p>
              
              {/* Status Badge integrated into the card */}
              <div className="mt-10 pt-6 border-t border-white/5 relative z-10 flex items-center gap-4">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--cyan)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--cyan)] shadow-[0_0_10px_var(--cyan)]"></span>
                </div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/70 font-mono">
                  Open to tackle new challenges
                </p>
              </div>
            </motion.div>

          </div>

          {/* Right: Architectural Stats Ledger */}
          <div className="w-full lg:w-1/2" ref={statsRef}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stats.map((s: any, i: number) => (
                <StatCard key={s.label} s={s} i={i} mounted={mounted} isStatsInView={isStatsInView} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
