'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { Download } from 'lucide-react';

const Hero3D = dynamic(() => import('./Hero3D'), { ssr: false, loading: () => null });

/*
 * HERO COMPOSITION v3 — CINEMATIC MAGAZINE COVER
 * ────────────────────────────────────────────────
 *
 * Portrait is the DOMINANT element — large, centered, full-section presence.
 * Name elements are ABSOLUTELY POSITIONED overlays creating depth layers:
 *
 *   z=20  YASHVEER (solid) — top-left, partially behind portrait top
 *   z=10  PORTRAIT — large, centered, fades top+bottom
 *   z=20  SINGH (ghost outline) — bottom-right, sits on fading portrait edge
 *   z=0   3D ARTIFACT — deep background environment
 *
 * Portrait mask: fades in at top (YASHVEER shows through) and out at bottom
 * (SINGH letters float over the disappearing portrait edge).
 */

const spring = { stiffness: 38, damping: 20, mass: 0.9 };

export default function Hero() {
  const { data } = usePortfolioData();
  const sectionRef = useRef<HTMLElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, spring);
  const py = useSpring(rawY, spring);

  // Portrait moves with mouse — subtle parallax
  const portraitX = useTransform(px, [-1, 1], [-12, 12]);
  const portraitY = useTransform(py, [-1, 1], [-8, 8]);

  // YASHVEER moves INVERSE — creates parallax depth separation from portrait
  const yashveerX = useTransform(px, [-1, 1], [6, -6]);
  const yashveerY = useTransform(py, [-1, 1], [3, -3]);

  // SINGH moves WITH mouse — appears at same depth as portrait
  const singhX = useTransform(px, [-1, 1], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const r = sectionRef.current.getBoundingClientRect();
    rawX.set(((e.clientX - r.left) / r.width) * 2 - 1);
    rawY.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  const heroImage = data?.heroImage;
  const isValid = heroImage && heroImage.trim().length > 5 && heroImage !== 'null';
  const imageSrc = isValid ? heroImage : '/cutout.png';

  return (
    <section
      id="hero"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full overflow-hidden bg-transparent flex items-center justify-center"
      style={{ minHeight: '100svh' }}
      aria-label="Portfolio hero — Yashveer Singh"
    >
      {/* ─── Layer 0: 3D Sculptural environment ─── */}
      <Hero3D />

      {/* ─── Layer 1: Atmospheric depth overlays ─── */}
      <div className="absolute inset-0 z-[1] pointer-events-none select-none">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#05070B] via-[#05070B]/75 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#05070B] via-[#05070B]/55 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#05070B]/65 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#05070B]/65 to-transparent" />
        {/* Cyan bloom — centred on portrait area */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/3 w-[50vw] h-[50vh] bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.035)_0%,transparent_70%)]" />
      </div>

      {/* ─── Layer 30: PORTRAIT — absolute center, IN FRONT of name text ─── */}
      {/* Portrait is the highest z-layer — face appears over YASHVEER text     */}
      <motion.div
        className="absolute z-30 inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ x: portraitX, y: portraitY }}
        initial={{ opacity: 0, scale: 0.92, filter: 'blur(14px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
      >
        {/* Subtle atmospheric halo behind portrait */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 bottom-0"
          style={{
            width: 'clamp(280px, 40vw, 520px)',
            height: '60%',
            background: 'radial-gradient(ellipse at 50% 100%, rgba(34,211,238,0.08) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <img
          src={imageSrc}
          alt="Yashveer Singh"
          draggable={false}
          style={{
            height: 'clamp(440px, 70vh, 660px)',
            width: 'auto',
            objectFit: 'contain',
            objectPosition: 'center top',
            // Cinematic treatment
            filter: [
              'contrast(1.08)',
              'brightness(0.94)',
              'saturate(1.05)',
              'drop-shadow(0 56px 100px rgba(0,0,0,0.98))',
              'drop-shadow(0 0 80px rgba(34,211,238,0.06))',
            ].join(' '),
            // No top fade — face visible immediately and sharply
            // Bottom fade only — portrait emerges from the dark environment
            maskImage: 'linear-gradient(to bottom, black 0%, black 62%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 62%, transparent 100%)',
          }}
        />
      </motion.div>

      {/* ─── Layer 8: YASHVEER — BEHIND portrait, centered so letters frame it ─── */}
      {/* Portrait (z=30) appears IN FRONT — face is clear, letters visible on sides */}
      <motion.div
        className="absolute z-[8] inset-x-0 flex justify-center"
        style={{ top: '108px', x: yashveerX, y: yashveerY }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      >
        <h1
          className="font-black uppercase leading-[0.78] tracking-[-0.04em] text-[var(--text)] select-none whitespace-nowrap text-center"
          style={{
            fontFamily: 'var(--font-syne)',
            // Slightly larger — so letters span wider than portrait width,
            // revealing text on both sides of the portrait's silhouette
            fontSize: 'clamp(2.5rem, 12vw, 10rem)',
          }}
        >
          YASHVEER
        </h1>
      </motion.div>

      {/* ─── Layer 20: top-right — section indicator ─── */}
      <motion.div
        className="absolute z-20 top-[96px] sm:top-[104px] right-6 sm:right-10 lg:right-14 flex flex-col items-end gap-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4, duration: 0.9 }}
      >
        <span className="text-[8px] uppercase tracking-[0.38em] text-[var(--text-muted)] opacity-55" style={{ fontFamily: 'var(--font-mono)' }}>
          Portfolio
        </span>
        <span className="text-[8px] uppercase tracking-[0.38em] text-[var(--text-muted)] opacity-35" style={{ fontFamily: 'var(--font-mono)' }}>
          2026
        </span>
      </motion.div>

      {/* ─── Layer 20: SINGH — absolute bottom-right, ghost outline ─── */}
      <motion.div
        className="absolute z-20 right-6 sm:right-10 lg:right-14"
        style={{
          bottom: 'clamp(80px, 12vh, 110px)',
          x: singhX,
        }}
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.65 }}
      >
        <span
          className="font-black uppercase leading-[0.78] tracking-[-0.04em] select-none whitespace-nowrap block"
          style={{
            fontFamily: 'var(--font-syne)',
            fontSize: 'clamp(2.2rem, 11vw, 9rem)',
            // Ghost treatment — outline only, no fill
            color: 'transparent',
            WebkitTextStroke: '1px rgba(248,250,252,0.18)',
            // Subtle depth effect
            textShadow: '0 0 120px rgba(34,211,238,0.10)',
          }}
        >
          SINGH
        </span>
      </motion.div>

      {/* ─── Layer 20: Bottom strip — role + CTAs ─── */}
      <motion.div
        className="absolute z-20 bottom-5 sm:bottom-7 inset-x-6 sm:inset-x-10 lg:inset-x-14 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Role */}
        <div className="flex flex-col gap-1">
          <p
            className="text-[9px] uppercase tracking-[0.42em] text-[var(--text-dim)]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Full-Stack Engineer · AI Builder
          </p>
          <div className="flex items-center gap-2.5">
            <div className="h-px w-6 bg-[var(--cyan)]/25" />
            <p className="text-[8px] uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-45" style={{ fontFamily: 'var(--font-mono)' }}>
              Building systems with precision
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap shrink-0">
          <a
            id="hero-cta-work"
            href="#projects"
            className="group inline-flex items-center gap-1.5 px-5 py-2.5 bg-[var(--text)] text-[#05070B] text-[9px] font-black uppercase tracking-[0.22em] transition-all duration-300 hover:bg-[var(--cyan)]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Explore Work
            <span className="text-[11px] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
          </a>
          <a
            id="hero-cta-contact"
            href="#contact"
            className="inline-flex items-center px-5 py-2.5 border border-[rgba(248,250,252,0.16)] text-[var(--text-dim)] text-[9px] font-black uppercase tracking-[0.22em] transition-all duration-300 hover:border-[rgba(248,250,252,0.4)] hover:text-[var(--text)]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Contact
          </a>
          <a
            id="hero-cta-view-resume"
            href={data?.resumeUrl || '/api/resume'}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 px-5 py-2.5 border border-[var(--cyan)]/30 text-[var(--cyan)] text-[9px] font-black uppercase tracking-[0.22em] transition-all duration-300 hover:bg-[var(--cyan)]/10 hover:border-[var(--cyan)]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            View Resume
            <span className="text-[11px] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
          </a>
          <a
            id="hero-cta-download-resume"
            href={`${data?.resumeUrl || '/api/resume'}?download=true`}
            target="_blank"
            rel="noopener noreferrer"
            title="Download PDF"
            className="group flex items-center justify-center w-10 h-10 border border-[rgba(248,250,252,0.16)] text-white/70 hover:text-white hover:border-[rgba(248,250,252,0.4)] hover:bg-white/5 transition-all duration-300 ml-1"
          >
            <Download size={14} strokeWidth={2.5} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
          </a>
        </div>
      </motion.div>

      {/* ─── Scroll indicator ─── */}
      <motion.div
        className="absolute bottom-[100px] sm:bottom-[120px] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1.2 }}
      >
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-[var(--text-muted)]/30 to-transparent"
          animate={{ scaleY: [0.4, 1, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="text-[7px] uppercase tracking-[0.45em] text-[var(--text-muted)] opacity-35" style={{ fontFamily: 'var(--font-mono)' }}>
          Scroll
        </span>
      </motion.div>

    </section>
  );
}
