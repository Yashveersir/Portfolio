'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useTransform } from 'framer-motion';
import { experiences } from '@/lib/constants';
import { useMousePosition } from '@/hooks/useMousePosition';
import CharSplitHeading from './CharSplitHeading';

function PathFlowBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const [isVisible, setIsVisible] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.getAttribute('data-theme') as 'dark' | 'light' || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    // Observe theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme') as 'dark' | 'light' || 'dark';
          setTheme(newTheme);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => { mouseRef.current.x = e.clientX; mouseRef.current.y = e.clientY; };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    let animationFrameId: number;
    let w = 0, h = 0;
    interface Path { x: number; speed: number; pulseY: number; color: [number,number,number]; alpha: number; length: number; width: number; }
    let paths: Path[] = [];
    const isLight = theme === 'light';
    const PALETTE: [number,number,number][] = isLight 
      ? [[8,145,178], [124,58,237], [79,70,229]]
      : [[34,211,238], [124,111,255], [168,85,247]];
      
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = (canvas.parentElement?.clientHeight || window.innerHeight) * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${canvas.parentElement?.clientHeight || window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      w = window.innerWidth; h = canvas.parentElement?.clientHeight || window.innerHeight;
      
      paths = [];
      const n = Math.floor(w / 100); // Fewer paths
      for (let i = 0; i < n; i++) {
        paths.push({ x: (i/n)*w + Math.random()*40, speed: 0.5+Math.random()*0.8, pulseY: Math.random()*h,
          color: PALETTE[Math.floor(Math.random()*PALETTE.length)], alpha: 0.15+Math.random()*0.2,
          length: 70+Math.random()*100, width: 1 });
      }
    };
    window.addEventListener('resize', resize); resize();
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      
      // Draw grid only once or simplified
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= 6; i++) {
        const gy = (h/6)*i;
        ctx.strokeStyle = isLight ? `rgba(34,211,238,0.015)` : `rgba(34,211,238,0.025)`;
        ctx.beginPath(); ctx.moveTo(0,gy); ctx.lineTo(w,gy); ctx.stroke();
      }

      paths.forEach(p => {
        const [r,g,b]=p.color;
        
        // Background line
        ctx.beginPath(); ctx.moveTo(p.x,0); ctx.lineTo(p.x,h);
        ctx.strokeStyle=`rgba(${r},${g},${b},0.02)`; ctx.lineWidth=1; ctx.stroke();
        
        p.pulseY += p.speed;
        if (p.pulseY > h+p.length) { p.pulseY=-p.length; p.x=Math.random()*w; }
        
        const py0=p.pulseY-p.length, py1=p.pulseY+p.length;
        
        // Simplified gradient pulse
        ctx.beginPath(); ctx.moveTo(p.x,Math.max(0,py0)); ctx.lineTo(p.x,Math.min(h,py1));
        const gr=ctx.createLinearGradient(0,py0,0,py1);
        gr.addColorStop(0,`rgba(${r},${g},${b},0)`);
        gr.addColorStop(0.5,`rgba(${r},${g},${b},${p.alpha})`);
        gr.addColorStop(1,`rgba(${r},${g},${b},0)`);
        ctx.strokeStyle=gr; ctx.lineWidth=p.width; ctx.stroke();

        // Smaller glow
        const glowR = 12;
        const hg=ctx.createRadialGradient(p.x,p.pulseY,0,p.x,p.pulseY,glowR);
        hg.addColorStop(0,`rgba(${r},${g},${b},${p.alpha*0.4})`); hg.addColorStop(1,`rgba(${r},${g},${b},0)`);
        ctx.fillStyle=hg; ctx.beginPath(); ctx.arc(p.x,p.pulseY,glowR,0,Math.PI*2); ctx.fill();
      });
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener('resize',resize); cancelAnimationFrame(animationFrameId); };
  }, [isVisible, theme]);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />
  );
}

// Using shared CharSplitHeading component

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative py-28 md:py-40 overflow-hidden"
    >
      <PathFlowBg />
      {/* Corner bracket decoration */}
      <div
        className="pointer-events-none absolute bottom-12 left-6 select-none text-theme"
        style={{ fontFamily: 'var(--font-syne)', fontWeight: 900, fontSize: '12rem', lineHeight: 1, opacity: 0.03 }}
      >
        {'{'}
      </div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="flex items-start gap-6 mb-16">
          <span
            className="hidden md:block text-[10px] uppercase tracking-[0.4em] text-theme-muted -rotate-90 origin-left whitespace-nowrap pt-8"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            / EXP
          </span>
          <div>
            <CharSplitHeading text="Experience" />
            <p className="mt-3 text-sm text-theme-muted max-w-md" style={{ fontFamily: 'var(--font-mono)' }}>
              Work, community, and things that actually happened.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto mt-10 md:mt-20">
          {/* Vertical line */}
          <div
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2"
            style={{ background: 'linear-gradient(to bottom, rgba(34,211,238,0.3), rgba(168,85,247,0.1), transparent)' }}
          />

          <div className="flex flex-col gap-10 md:gap-16">
            {experiences.map((exp, i) => (
              <ExperienceItem key={exp.title} exp={exp} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceItem({ exp, index }: { exp: typeof experiences[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-60px' });
  const { mouseX, mouseY, handleMouseMove } = useMousePosition(ref);

  const isEven = index % 2 === 0;
  const isOngoing = exp.date.toLowerCase().includes('ongoing');

  // Motion values for radial gradient
  const background = useTransform(
    [mouseX, mouseY],
    ([latestX, latestY]) => `radial-gradient(400px circle at ${latestX}px ${latestY}px, ${exp.color}08, transparent 40%)`
  );

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, x: isEven ? -40 : 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -40 : 40 }}
      transition={{ type: 'spring' as const, stiffness: 90, damping: 18, delay: index * 0.1 }}
      className={`relative flex w-full group md:justify-between items-center ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'}`}
    >
      {/* Spacer for desktop */}
      <div className="hidden md:block w-5/12" />

      {/* Timeline dot */}
      <div
        className="absolute left-4 md:left-1/2 top-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-125 group-hover:brightness-125 z-10"
        style={{ width: 16, height: 16, transform: 'translate(-50%, -50%)' }}
      >
        <div
          className="w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 relative"
          style={{ borderColor: exp.color, background: '#0a0a14', boxShadow: `0 0 12px ${exp.color}60` }}
        >
          {isOngoing && (
            <div 
              className="absolute inset-[-4px] rounded-full border border-current animate-ping opacity-40"
              style={{ color: exp.color }}
            />
          )}
        </div>
      </div>

      {/* Card Wrapper */}
      <div className={`w-full pl-12 md:pl-0 md:w-5/12 ${isEven ? 'md:pr-10' : 'md:pl-10'}`}>
        <div
          ref={ref}
          onMouseMove={handleMouseMove}
          className="bg-theme-card backdrop-blur-xl p-8 relative overflow-hidden transition-all border border-theme hover:border-cyan-400/30 group/expcard"
          style={{ willChange: 'transform' }}
        >
          {/* HUD details: Corner markers */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-theme opacity-30" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-theme opacity-30" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-theme opacity-30" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-theme opacity-30" />

          {/* HUD detail: Hex timestamp */}
          <div className="absolute top-3 right-4 opacity-10 group-hover/expcard:opacity-30 transition-opacity">
            <span className="text-[7px] font-mono tracking-widest text-theme uppercase">LOC_COORD: 23.23N 87.86E</span>
          </div>

          {/* Highlight line */}
          <div 
             className={`absolute inset-y-0 w-[1px] pointer-events-none left-0 ${isEven ? 'md:left-auto md:right-0' : ''}`}
             style={{ backgroundColor: `${exp.color}40` }}
          />
        
        {/* Dynamic glow tracking cursor */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{ background }}
        />

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center bg-theme-shift border border-theme group-hover/expcard:border-cyan-400/30 transition-colors">
              <span className="text-xl" role="img" aria-hidden="true">{exp.icon}</span>
            </div>
            <div>
              <h3
                className="text-lg font-bold group-hover/expcard:translate-x-1 transition-transform"
                style={{ fontFamily: 'var(--font-syne)', color: exp.color }}
              >
                {exp.title}
              </h3>
              <p
                className="text-[10px] uppercase tracking-[0.25em] text-theme-muted font-bold"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {exp.organization}
              </p>
            </div>
          </div>
          <span
            className="text-[9px] uppercase tracking-[0.2em] text-theme-dim whitespace-nowrap border border-theme px-3 py-1.5 bg-theme-card backdrop-blur-sm"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {exp.date}
          </span>
        </div>

        {/* Description */}
        <p className="text-[13px] text-theme-dim leading-relaxed mb-6" style={{ fontFamily: 'var(--font-dm-sans)' }}>
          {exp.description}
        </p>

        {/* Achievements */}
        <ul className="flex flex-col gap-3">
          {exp.achievements.map((a, ai) => (
            <li
              key={ai}
              className="flex items-start gap-3 text-[11px] text-theme-muted group-hover/expcard:text-theme-dim transition-colors"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              <span style={{ color: exp.color, marginTop: 1, flexShrink: 0 }} className="group-hover/expcard:translate-x-1 transition-transform" aria-hidden="true">»</span>
              <span className="leading-relaxed">{a}</span>
            </li>
          ))}
        </ul>

        {/* View Certificate */}
        {(exp as { certificate?: string }).certificate && (
          <div className="mt-5 flex">
            <a
              href={(exp as { certificate?: string }).certificate}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-amber-500 hover:text-amber-400 border border-amber-500/25 hover:border-amber-500/50 px-4 py-2 bg-amber-500/5 hover:bg-amber-500/10 transition-all duration-300"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="7" />
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
              </svg>
              View Certificate
            </a>
          </div>
        )}

        {/* Card footer detail */}
        <div className="mt-8 pt-4 border-t border-theme flex justify-between items-center">
          <div className="flex gap-1">
             {[0,1,2].map(i => <div key={i} className="w-1 h-1 bg-theme-muted opacity-20" />)}
          </div>
          <span className="text-[7px] font-mono text-theme-muted opacity-30 tracking-[0.4em]">SYSTEM_VERIFIED_LOG_0x{index.toString(16).toUpperCase()}</span>
        </div>
      </div>
      </div>
    </motion.div>
  );
}
