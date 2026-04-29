'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const METRICS = [
  {
    value: '100K+',
    label: 'Lines of Code',
    sub: 'Mostly bugs, but they look pretty.',
    color: 'var(--cyan)',
  },
  {
    value: '500+',
    label: 'Cups of Coffee',
    sub: 'The true fuel of development.',
    color: 'var(--amber)',
  },
  {
    value: '50+',
    label: 'Bugs Fixed',
    sub: '...and probably 100+ created.',
    color: 'var(--violet)',
  },
  {
    value: '13+',
    label: 'Certifications',
    sub: 'Because learning never stops.',
    color: 'var(--purple-500)',
  },
];

function MetricCard({ metric, index }: { metric: typeof METRICS[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
      className="group relative p-8 border border-theme bg-theme-card hover:bg-cyan-400/5 transition-all duration-300"
    >
      <div
        className="absolute top-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${metric.color}, transparent)` }}
      />
      
      <p
        className="text-4xl md:text-5xl font-black mb-2"
        style={{ fontFamily: 'var(--font-syne)', color: metric.color }}
      >
        {metric.value}
      </p>
      <p
        className="text-xs uppercase tracking-[0.2em] font-bold text-theme-dim mb-1"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {metric.label}
      </p>
      <p className="text-[10px] text-theme-muted uppercase tracking-widest leading-relaxed">
        {metric.sub}
      </p>
    </motion.div>
  );
}

export default function ByTheNumbers() {
  return (
    <section className="relative py-28 md:py-40 overflow-hidden border-y border-theme">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute inset-0 bg-grid-slate-500/[0.2] [mask-image:radial-gradient(white,transparent_85%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="mb-20 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] uppercase tracking-[0.5em] text-cyan-500 mb-4"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            / QUANTIFIED
          </motion.p>
          <h2
            className="text-4xl md:text-6xl font-black text-theme"
            style={{ fontFamily: 'var(--font-syne)', letterSpacing: '-0.04em' }}
          >
            By the Numbers
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {METRICS.map((m, i) => (
            <MetricCard key={m.label} metric={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
