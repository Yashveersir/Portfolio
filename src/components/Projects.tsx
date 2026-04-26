'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { projects } from '@/lib/constants';
import { FaGithub } from 'react-icons/fa';
import { ExternalLink } from 'lucide-react';

// Per-project accent colors from spec
const PROJECT_ACCENTS = ['#22d3ee', '#ff6400', '#7c6fff'];

// Tag styles — mix of outlined, filled, plain text
function Tag({ label, index }: { label: string; index: number }) {
  const variant = index % 3;
  if (variant === 0) {
    return (
      <span
        className="border border-current px-2.5 py-0.5 text-[10px] uppercase tracking-widest"
        style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-mono)' }}
      >
        {label}
      </span>
    );
  }
  if (variant === 1) {
    return (
      <span
        className="bg-white/8 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-white/60"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {label}
      </span>
    );
  }
  return (
    <span
      className="text-[10px] uppercase tracking-widest text-white/35"
      style={{ fontFamily: 'var(--font-mono)' }}
    >
      {label}
    </span>
  );
}

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const accent = PROJECT_ACCENTS[index % PROJECT_ACCENTS.length];
  const num = String(index + 1).padStart(2, '0');

  const isFirst = index === 0;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      data-project-card="true"
      className="relative"
      initial={{ y: 40, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: index * 0.15 }}
    >
      {/* Faded large number texture behind card */}
      <div
        className="pointer-events-none absolute select-none"
        style={{
          fontFamily: 'var(--font-syne)',
          fontSize: '22vw',
          fontWeight: 900,
          color: accent,
          opacity: 0.04,
          top: '-15%',
          left: '-5%',
          lineHeight: 1,
          zIndex: 0,
          userSelect: 'none',
        }}
      >
        {num}
      </div>

      {/* Diagonal dog-ear on card 01 */}
      {isFirst && (
        <svg
          className="absolute top-0 right-0 pointer-events-none z-20"
          width="48"
          height="48"
          viewBox="0 0 48 48"
        >
          <line x1="0" y1="0" x2="48" y2="48" stroke={accent} strokeWidth="0.8" strokeOpacity="0.5" />
        </svg>
      )}

      <div
        className="relative z-10 border border-white/6 bg-[#0a0a14] overflow-hidden group hover-float-card"
        style={{
          minHeight: index === 1 ? 380 : 340,
          borderTop: `1.5px solid ${accent}30`,
        }}
      >
        {/* Glow top edge */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}60, transparent)` }}
        />

        {/* Number label */}
        <div className="flex items-start justify-between p-7 pb-4">
          <span
            className="text-[11px] uppercase tracking-widest"
            style={{ color: accent, fontFamily: 'var(--font-mono)' }}
          >
            {num}
          </span>
          <div className="flex gap-4 relative z-50 pointer-events-auto">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 -m-1 text-white/40 hover:text-white transition-colors cursor-pointer pointer-events-auto z-50"
            >
              <FaGithub size={36} />
            </a>
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 -m-1 text-white/40 hover:text-cyan-400 transition-colors cursor-pointer pointer-events-auto z-50"
            >
              <ExternalLink size={36} />
            </a>
          </div>
        </div>

        {/* Project Image */}
        {project.images?.[0] && (
          <div className="relative w-full h-48 sm:h-56 overflow-hidden border-y border-white/5">
            <img 
              src={project.images[0]} 
              alt={project.title} 
              className="w-full h-full object-cover object-top opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] to-transparent opacity-80" />
          </div>
        )}

        {/* Content */}
        <div className="px-7 pb-7">
          <h3
            className="text-xl md:text-2xl font-black mb-2 leading-tight"
            style={{ fontFamily: 'var(--font-syne)', color: accent }}
          >
            {project.title}
          </h3>
          <p
            className="text-[11px] uppercase tracking-widest mb-4"
            style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}
          >
            {project.subtitle}
          </p>
          <p className="text-sm text-white/85 leading-relaxed mb-6">
            {project.description}
          </p>

          {/* Tags — mixed styles */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, ti) => (
              <Tag key={tag} label={tag} index={ti} />
            ))}
          </div>

          {/* Outcome pill */}
          <div
            className="mt-6 pt-4 border-t border-white/8 text-xs text-white/60"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {project.outcome}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function HoloGridBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

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
      const gs = 90;
      const goy = ((time * 22 + my * 25) % gs + gs) % gs;
      const gox = ((mx * 25) % gs + gs) % gs;

      for (let gy = goy - gs; gy < h + gs; gy += gs) {
        const t = gy / h;
        ctx.strokeStyle = `rgba(124,111,255,${0.04 + t * 0.05})`;
        ctx.lineWidth = 0.7 + t * 0.5;
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
      }
      for (let gx = gox - gs; gx < w + gs; gx += gs) {
        ctx.strokeStyle = 'rgba(34,211,238,0.035)';
        ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
      }

      // Mouse spot-light
      const mwx = (mx * 0.5 + 0.5) * w, mwy = (my * 0.5 + 0.5) * h;
      const spot = ctx.createRadialGradient(mwx, mwy, 0, mwx, mwy, 300);
      spot.addColorStop(0, 'rgba(34,211,238,0.06)');
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
            className="hidden md:block text-[10px] uppercase tracking-[0.4em] text-white/25 -rotate-90 origin-left whitespace-nowrap pt-8"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            / PROJECTS
          </span>
          <div>
            <CharSplitHeading text="Selected Work" />
            <p className="mt-3 text-sm text-white/35 max-w-md" style={{ fontFamily: 'var(--font-mono)' }}>
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

// Reused char-split heading
function CharSplitHeading({ text }: { text: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.h2
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="flex flex-wrap overflow-hidden"
      style={{
        fontFamily: 'var(--font-syne)',
        fontWeight: 900,
        fontSize: 'clamp(2.4rem, 5vw, 4rem)',
        lineHeight: 1,
        letterSpacing: '-0.03em',
      }}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { y: -60, opacity: 0, rotate: -8 },
            visible: { y: 0, opacity: 1, rotate: 0, transition: { type: 'spring', stiffness: 200, damping: 12, delay: i * 0.04 } }
          }}
          style={{ display: 'inline-block', minWidth: char === ' ' ? '0.3em' : undefined }}
        >
          {char}
        </motion.span>
      ))}
    </motion.h2>
  );
}
