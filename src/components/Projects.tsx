'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, useTransform } from 'framer-motion';
import { projects } from '@/lib/constants';
import { FaGithub } from 'react-icons/fa';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useMousePosition } from '@/hooks/useMousePosition';
import CharSplitHeading from './CharSplitHeading';

// Per-project accent colors from spec
const PROJECT_ACCENTS = ['#22d3ee', '#ff6400', '#7c6fff'];

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const accent = PROJECT_ACCENTS[index % PROJECT_ACCENTS.length];
  const num = String(index + 1).padStart(2, '0');

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  
  const { mouseX, mouseY, handleMouseMove } = useMousePosition(ref);

  const background = useTransform(
    [mouseX, mouseY],
    ([latestX, latestY]) => `radial-gradient(500px circle at ${latestX}px ${latestY}px, ${accent}10, transparent 40%)`
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      data-project-card="true"
      className="relative group/card"
      initial={{ y: 50, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
    >
      {/* HUD-style number label */}
      <div className="absolute -top-3 -left-3 z-30 pointer-events-none">
        <div className="flex items-center gap-2 bg-theme-card border border-theme px-3 py-1 pixel-border">
          <span className="text-[10px] font-bold tracking-widest text-theme-muted" style={{ fontFamily: 'var(--font-mono)' }}>ID:</span>
          <span className="text-[10px] font-bold tracking-widest text-cyan-400" style={{ fontFamily: 'var(--font-mono)' }}>{num}</span>
        </div>
      </div>

      <div
        className="relative z-10 border border-theme bg-theme-card backdrop-blur-lg overflow-hidden shadow-2xl transition-all duration-500 hover:border-cyan-400/30"
        style={{
          minHeight: 420,
        }}
      >
        {/* Dynamic glow tracking cursor */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"
          style={{ background }}
        />

        {/* Scanline overlay */}
        <div className="absolute inset-0 scanline opacity-30 pointer-events-none" />

        {/* Project Image */}
        {project.images?.[0] && (
          <div className="relative w-full h-56 overflow-hidden border-b border-theme">
            <Image 
              src={project.images[0]} 
              alt={`Interface of ${project.title}`} 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="w-full h-full object-cover object-top grayscale group-hover/card:grayscale-0 group-hover/card:scale-105 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent opacity-60" />
            
            {/* HUD element on image */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <div className="w-12 h-[1px] bg-theme-muted" />
                <span className="text-[8px] font-bold text-theme-muted uppercase tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>DEPLOYMENT_READY</span>
              </div>
              <div className="flex gap-3">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-theme bg-theme-card backdrop-blur-sm text-theme-muted hover:text-theme hover:border-theme transition-all hover:scale-110"
                  aria-label={`View ${project.title} source on GitHub`}
                >
                  <FaGithub size={16} />
                </a>
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-theme bg-theme-card backdrop-blur-sm text-theme-muted hover:text-cyan-400 hover:border-cyan-400/30 transition-all hover:scale-110"
                  aria-label={`View live demo of ${project.title}`}
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-1.5 h-1.5 bg-cyan-400" />
             <h3
              className="text-xl font-bold tracking-tight text-theme group-hover/card:translate-x-1 transition-transform duration-300"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              {project.title}
            </h3>
          </div>
          
          <p className="text-[13px] text-theme-dim leading-relaxed mb-6 md:mb-8 line-clamp-3" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            {project.description}
          </p>

          {/* Tags — consistent mono style */}
          <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 border border-theme bg-theme-card text-[9px] font-bold uppercase tracking-widest text-theme-muted"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Technical spec label */}
          <div className="pt-4 md:pt-5 border-t border-theme flex items-center justify-between">
            <span className="text-[9px] uppercase tracking-[0.2em] text-theme-muted font-bold" style={{ fontFamily: 'var(--font-mono)' }}>
              RESULT // 0x{index.toString(16)}
            </span>
            <span className="text-[9px] uppercase tracking-[0.1em] text-cyan-400/80 font-bold max-w-[70%] text-right" style={{ fontFamily: 'var(--font-mono)' }}>
              {project.outcome.replace('Outcome: ', '')}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function HoloGridBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = (e.clientY / window.innerHeight) * 2 - 1;
    };
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

    let w = 0, h = 0;
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      // Re-seed panels on resize
      for (const p of panels) {
        p.x = Math.random() * w; p.y = Math.random() * h;
        p.pw = Math.random() * 160 + 50; p.ph = Math.random() * 100 + 35;
      }
    };

    // Holographic panels with more varied depth
    const PALETTE = [
      [34, 211, 238],    // cyan
      [124, 111, 255],   // violet
      [96, 165, 250],    // blue-400
    ];
    const panels = Array.from({ length: 18 }, (_, i) => ({
      x: Math.random() * 800, y: 0, pw: 0, ph: 0,
      z: Math.random() * 3.5 + 0.8,
      speedY: (Math.random() - 0.5) * 0.35,
      phase: Math.random() * Math.PI * 2,
      colorIdx: i % PALETTE.length,
    }));

    window.addEventListener('resize', resize);
    resize();

    let frameId: number;
    let time = 0;

    const draw = () => {
      time += 0.005;
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.clearRect(0, 0, w, h);

      // ── Ambient depth orbs ──
      const breath = Math.sin(time * 1.2) * 0.5 + 0.5;
      ctx.globalCompositeOperation = 'screen';
      const ambients = [
        { cx: w * 0.2, cy: h * 0.25, r: 380, col: '34,211,238', a: 0.055 + breath * 0.03 },
        { cx: w * 0.8, cy: h * 0.75, r: 350, col: '124,111,255', a: 0.05 + breath * 0.025 },
        { cx: w * 0.5 + mx * -30, cy: h * 0.5 + my * -20, r: 420, col: '96,165,250', a: 0.03 + breath * 0.015 },
      ];
      ambients.forEach(({ cx, cy, r, col, a }) => {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `rgba(${col},${a})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      });
      ctx.globalCompositeOperation = 'source-over';

      // ── Moving perspective grid ──
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const gs = 90;
      const goy = ((time * 22 + my * 25) % gs + gs) % gs;
      const gox = ((mx * 25) % gs + gs) % gs;

      for (let gy = goy - gs; gy < h + gs; gy += gs) {
        const t = gy / h;
        ctx.strokeStyle = isLight ? `rgba(124,111,255,${0.02 + t * 0.03})` : `rgba(124,111,255,${0.04 + t * 0.05})`;
        ctx.lineWidth = 0.7 + t * 0.5;
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
      }
      for (let gx = gox - gs; gx < w + gs; gx += gs) {
        ctx.strokeStyle = isLight ? 'rgba(34,211,238,0.025)' : 'rgba(34,211,238,0.035)';
        ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
      }

      // Mouse spot-light
      const mwx = (mx * 0.5 + 0.5) * w, mwy = (my * 0.5 + 0.5) * h;
      const spot = ctx.createRadialGradient(mwx, mwy, 0, mwx, mwy, 300);
      spot.addColorStop(0, isLight ? 'rgba(34,211,238,0.04)' : 'rgba(34,211,238,0.06)');
      spot.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = spot; ctx.fillRect(0, 0, w, h);

      // ── Holo panels ──
      panels.forEach((p) => {
        p.y += p.speedY;
        if (p.y > h + p.ph) p.y = -p.ph;
        if (p.y < -p.ph) p.y = h + p.ph;

        const px = p.x + (mx * 80) / p.z;
        const py = p.y + (my * 50) / p.z;
        const distToMouse = Math.hypot(px + p.pw / 2 - mwx, py + p.ph / 2 - mwy);
        const proximityBoost = Math.max(0, 1 - distToMouse / 380);

        const pulse = Math.sin(time * 2 + p.phase) * 0.5 + 0.5;
        const [r, g, b] = PALETTE[p.colorIdx];
        const depthAlpha = 1 / (p.z * 0.65);
        const baseAlpha = (0.07 + pulse * 0.08 + proximityBoost * 0.18) * depthAlpha;

        // Panel fill
        ctx.fillStyle = `rgba(${r},${g},${b},${baseAlpha * 0.35})`;
        ctx.strokeStyle = `rgba(${r},${g},${b},${baseAlpha * 2.2})`;
        ctx.lineWidth = 0.9;
        ctx.beginPath(); ctx.rect(px, py, p.pw, p.ph);
        ctx.fill(); ctx.stroke();

        // Scan-line sweep inside panel
        const scanY = py + ((time * 35 + p.phase * 20) % p.ph);
        const sg = ctx.createLinearGradient(0, scanY - 6, 0, scanY + 6);
        sg.addColorStop(0, `rgba(${r},${g},${b},0)`);
        sg.addColorStop(0.5, `rgba(${r},${g},${b},${0.2 + proximityBoost * 0.25})`);
        sg.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.save();
        ctx.beginPath(); ctx.rect(px + 1, py + 1, p.pw - 2, p.ph - 2);
        ctx.clip();
        ctx.fillStyle = sg; ctx.fillRect(px, scanY - 6, p.pw, 12);
        ctx.restore();

        // Corner brackets
        const cs = 9;
        ctx.strokeStyle = `rgba(${r},${g},${b},${(baseAlpha + proximityBoost * 0.35) * 4.5})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(px, py + cs); ctx.lineTo(px, py); ctx.lineTo(px + cs, py);
        ctx.moveTo(px + p.pw - cs, py); ctx.lineTo(px + p.pw, py); ctx.lineTo(px + p.pw, py + cs);
        ctx.moveTo(px + p.pw, py + p.ph - cs); ctx.lineTo(px + p.pw, py + p.ph); ctx.lineTo(px + p.pw - cs, py + p.ph);
        ctx.moveTo(px + cs, py + p.ph); ctx.lineTo(px, py + p.ph); ctx.lineTo(px, py + p.ph - cs);
        ctx.stroke();
      });

      frameId = requestAnimationFrame(draw);
    };

    frameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

export default function Projects() {
  return (
    <section id="projects" className="relative py-28 md:py-40 overflow-hidden">
      <HoloGridBg />
      {/* Plus signs scattered */}
      {[
        { top: '5%', right: '3%', size: 28, opacity: 0.05 },
        { top: '80%', left: '1%', size: 22, opacity: 0.04 },
      ].map((p, i) => (
        <span
          key={i}
          className="plus-spin pointer-events-none absolute select-none text-cyan-400"
          style={{ top: p.top, right: (p as { right?: string }).right, left: (p as { left?: string }).left, fontSize: p.size, opacity: p.opacity }}
        >
          +
        </span>
      ))}

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Header */}
        <div className="flex items-start gap-6 mb-20">
          <span
            className="hidden md:block text-[10px] uppercase tracking-[0.4em] text-theme-muted -rotate-90 origin-left whitespace-nowrap pt-8"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            / PROJECTS
          </span>
          <div>
            <CharSplitHeading text="Selected Work" />
            <p className="mt-3 text-sm text-theme-muted max-w-md" style={{ fontFamily: 'var(--font-mono)' }}>
              Real products, real outcomes. No tutorial clones.
            </p>
          </div>
        </div>

        {/* Cards — different heights, NOT uniform */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}


