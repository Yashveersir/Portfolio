'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { certifications } from '@/lib/constants';
import { ExternalLink } from 'lucide-react';

function CharSplitHeading({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true });
  return (
    <h2
      ref={ref}
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
          initial={{ y: -60, opacity: 0, rotate: -8 }}
          animate={isInView ? { y: 0, opacity: 1, rotate: 0 } : {}}
          transition={{ type: 'spring' as const, stiffness: 200, damping: 12, delay: i * 0.04 }}
          style={{ display: 'inline-block', minWidth: char === ' ' ? '0.3em' : undefined }}
        >
          {char}
        </motion.span>
      ))}
    </h2>
  );
}

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
            className="hidden md:block text-[10px] uppercase tracking-[0.4em] text-white/25 -rotate-90 origin-left whitespace-nowrap pt-8"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            / CERTS
          </span>
          <div>
            <CharSplitHeading text="Certifications" />
            <p className="mt-3 text-sm text-white/35 max-w-md" style={{ fontFamily: 'var(--font-mono)' }}>
              13 verified credentials across AI, cloud, and full-stack development.
            </p>
          </div>
        </div>

        {/* Horizontal scroll strip */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory"
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
          className="mt-5 text-[10px] uppercase tracking-widest text-white/20 text-right"
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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: 'spring' as const, stiffness: 100, damping: 16, delay: Math.min(index * 0.06, 0.5) }}
      className="snap-start flex-shrink-0 relative border border-white/6 bg-[#0a0a14]/80 backdrop-blur-xl overflow-hidden group tilt-card"
      style={{
        width: 'clamp(220px, 30vw, 280px)',
        borderTop: `1.5px solid ${cert.color}30`,
      }}
    >
      {/* Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at 50% 0%, ${cert.color}10, transparent 60%)` }}
      />

      <div className="p-6 flex flex-col h-full min-h-[180px]">
        {/* Number + icon row */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-3xl"
            role="img"
            aria-label={cert.title}
          >
            {cert.icon}
          </span>
          <span
            className="text-[10px] uppercase tracking-widest"
            style={{ color: cert.color, fontFamily: 'var(--font-mono)' }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Title */}
        <h3
          className="text-sm font-bold leading-snug mb-1 flex-1"
          style={{ fontFamily: 'var(--font-syne)', color: '#fff' }}
        >
          {cert.title}
        </h3>

        {/* Issuer */}
        <p
          className="text-[10px] uppercase tracking-widest mb-4"
          style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}
        >
          {cert.issuer}
        </p>

        {/* View PDF link */}
        <a
          href={cert.pdf}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest transition-colors group/link"
          style={{ color: cert.color, fontFamily: 'var(--font-mono)' }}
        >
          <ExternalLink size={11} />
          <span className="group-hover/link:underline">View Certificate</span>
        </a>
      </div>
    </motion.div>
  );
}
