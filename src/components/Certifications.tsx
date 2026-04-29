'use client';

import { useRef } from 'react';
import { motion, useInView, useTransform } from 'framer-motion';
import { certifications } from '@/lib/constants';
import { ExternalLink } from 'lucide-react';
import { useMousePosition } from '@/hooks/useMousePosition';
import CharSplitHeading from './CharSplitHeading';


export default function Certifications() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="certifications"
      className="relative py-28 md:py-40 overflow-hidden"
    >
      {/* Large watermark */}
      <div
        className="pointer-events-none absolute top-0 right-0 select-none"
        style={{
          fontFamily: 'var(--font-syne)',
          fontSize: 'clamp(6rem, 18vw, 13rem)',
          color: 'rgba(168,85,247,0.03)',
          fontWeight: 900,
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        13+
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="flex items-start gap-6 mb-14">
          <span
            className="hidden md:block text-[10px] uppercase tracking-[0.4em] text-theme-muted -rotate-90 origin-left whitespace-nowrap pt-8"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            / CERTS
          </span>
          <div>
            <CharSplitHeading text="Certifications" fontSize="clamp(1.8rem, 8vw, 4rem)" />
            <p className="mt-3 text-sm text-theme-muted max-w-md" style={{ fontFamily: 'var(--font-mono)' }}>
              13 verified credentials across AI, cloud, and full-stack development.
            </p>
          </div>
        </div>

        {/* Horizontal scroll strip */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory cert-scrollbar"
        >
          {certifications.map((cert, i) => (
            <CertCard key={cert.title} cert={cert} index={i} />
          ))}
        </div>

        {/* Scroll hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-5 text-[10px] uppercase tracking-widest text-theme-muted text-right"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          ← scroll to explore →
        </motion.p>
      </div>
    </section>
  );
}

function CertCard({ cert, index }: { cert: typeof certifications[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const { mouseX, mouseY, handleMouseMove } = useMousePosition(ref);

  const background = useTransform(
    [mouseX, mouseY],
    ([latestX, latestY]) => `radial-gradient(400px circle at ${latestX}px ${latestY}px, ${cert.color}15, transparent 40%)`
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: 'spring' as const, stiffness: 100, damping: 16, delay: Math.min(index * 0.06, 0.5) }}
      className="snap-start flex-shrink-0 relative border border-theme bg-theme-card backdrop-blur-xl overflow-hidden group/cert hover-float-card pixel-border scanline"
      style={{
        width: 'clamp(240px, 32vw, 300px)',
      }}
    >
      {/* Dynamic glow tracking cursor */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover/cert:opacity-100 transition-opacity duration-700"
        style={{ background }}
      />

      {/* Holographic overlay effect */}
      <div className="absolute inset-0 opacity-0 group-hover/cert:opacity-20 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, transparent 45%, ${cert.color} 50%, transparent 55%)`,
          backgroundSize: '200% 200%',
          animation: 'hologram 3s linear infinite'
        }}
      />

      <style jsx>{`
        @keyframes hologram {
          0% { background-position: 200% 0%; }
          100% { background-position: -200% 0%; }
        }
      `}</style>

      <div className="p-8 flex flex-col h-full min-h-[200px] relative z-10">
        {/* Header row: ID + Icon */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-12 h-12 flex items-center justify-center bg-theme-shift border border-theme group-hover/cert:border-cyan-400/30 transition-colors">
            <span
              className="text-2xl grayscale group-hover/cert:grayscale-0 transition-all duration-500"
              role="img"
              aria-label={cert.title}
            >
              {cert.icon}
            </span>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-mono text-theme-muted uppercase tracking-widest mb-1">CRED_ID</p>
            <p
              className="text-[10px] font-mono font-bold tracking-widest"
              style={{ color: cert.color }}
            >
              #{String(index + 1).padStart(3, '0')}
            </p>
          </div>
        </div>

        {/* Title */}
        <h3
          className="text-sm font-bold leading-tight mb-2 flex-1 text-theme group-hover/cert:text-cyan-400 transition-colors"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          {cert.title}
        </h3>

        {/* Issuer */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-1 rounded-none rotate-45" style={{ background: cert.color }} />
          <p
            className="text-[9px] uppercase tracking-[0.2em] text-theme-muted font-bold"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {cert.issuer}
          </p>
        </div>

        {/* Action row */}
        <div className="flex items-center justify-between pt-4 border-t border-theme">
          <a
            href={cert.pdf}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] transition-all group/link"
            style={{ color: cert.color, fontFamily: 'var(--font-mono)' }}
            aria-label={`View certificate for ${cert.title}`}
          >
            <ExternalLink size={12} aria-hidden="true" />
            <span className="group-hover/link:underline">VERIFY_KEY</span>
          </a>
          <div className="flex gap-1">
             <div className="w-1 h-1 bg-theme-muted opacity-20" />
             <div className="w-3 h-1 bg-theme-muted opacity-20" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
