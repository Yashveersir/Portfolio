'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { usePortfolioData } from '@/hooks/usePortfolioData';

const DEFAULT_METRICS = [
  {
    value: '4',
    label: 'Featured Projects',
    sub: 'Shipped and deployed to production.',
    colorRGB: '34, 211, 238', // cyan
  },
  {
    value: '2',
    label: 'Internships',
    sub: 'Real-world engineering experience.',
    colorRGB: '251, 191, 36', // amber
  },
  {
    value: '13+',
    label: 'Certifications',
    sub: 'Verified credentials across AI, cloud, and dev.',
    colorRGB: '167, 139, 250', // purple
  },
  {
    value: '8.6',
    label: 'Academic CGPA',
    sub: 'Computer Science Engineering.',
    colorRGB: '244, 114, 182', // pink
  },
];

function AnimatedCounter({ value, colorRGB }: { value: string; colorRGB: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  // Extract number and suffix (like "+")
  const numericMatch = value.match(/[\d\.]+/);
  const numericValue = numericMatch ? parseFloat(numericMatch[0]) : 0;
  const hasDecimal = value.includes(".");
  const suffix = value.replace(/[\d\.]+/, "");

  const springValue = useSpring(0, { damping: 50, stiffness: 100, mass: 1 });
  
  useEffect(() => {
    if (isInView) {
      springValue.set(numericValue);
    }
  }, [isInView, numericValue, springValue]);

  const displayValue = useTransform(springValue, (current) => {
    return hasDecimal ? current.toFixed(1) : Math.floor(current).toString();
  });

  return (
    <span ref={ref} className="flex items-start tracking-tighter" style={{ color: `rgb(${colorRGB})` }}>
      <motion.span>{displayValue}</motion.span>
      {suffix && (
        <span className="text-3xl md:text-4xl mt-2 ml-1 opacity-70">
          {suffix}
        </span>
      )}
    </span>
  );
}

function MetricCard({ metric, index }: { metric: any; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Spotlight tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // 3D Tilt
  const rotateX = useSpring(useMotionValue(0), { damping: 30, stiffness: 100 });
  const rotateY = useSpring(useMotionValue(0), { damping: 30, stiffness: 100 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseX.set(x);
    mouseY.set(y);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    rotateX.set(((y - centerY) / centerY) * -10);
    rotateY.set(((x - centerX) / centerX) * 10);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  // Handle dynamic data or fallback
  const rgb = metric.colorRGB || '34, 211, 238';

  return (
    <div className="perspective-[1000px] w-full h-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
        className="group/metric relative p-[1px] rounded-3xl h-full transition-transform duration-300"
      >
        {/* Subtle Default Border */}
        <div className="absolute inset-0 rounded-3xl bg-white/5 transition-opacity duration-500 group-hover/metric:opacity-0" />

        {/* Dynamic Glowing Border */}
        <motion.div
          className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover/metric:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                300px circle at ${mouseX}px ${mouseY}px,
                rgba(${rgb}, 1),
                transparent 80%
              )
            `,
          }}
        />

        {/* Inner Glass Card */}
        <div className="relative h-full bg-[#04060C]/40 backdrop-blur-3xl rounded-3xl p-8 flex flex-col justify-between overflow-hidden shadow-2xl">
          {/* Blueprint Texture */}
          <div className="absolute inset-0 blueprint-grid opacity-[0.03]" />
          
          {/* Inner Glowing Spotlight */}
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover/metric:opacity-100"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  400px circle at ${mouseX}px ${mouseY}px,
                  rgba(${rgb}, 0.1),
                  transparent 70%
                )
              `,
            }}
          />

          <div className="relative z-10" style={{ transform: 'translateZ(30px)' }}>
            <div className="text-5xl md:text-6xl font-black mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" style={{ fontFamily: 'var(--font-syne)' }}>
              <AnimatedCounter value={metric.value} colorRGB={rgb} />
            </div>
            
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-white mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
              {metric.label}
            </p>
            <p className="text-xs text-white/50 leading-relaxed font-light" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              {metric.sub}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ByTheNumbers() {
  const { data } = usePortfolioData();
  const metrics = (data && Array.isArray(data.numbers) && data.numbers.length > 0) ? data.numbers : DEFAULT_METRICS;

  return (
    <section className="relative py-32 md:py-48 bg-transparent">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <div className="absolute inset-0 bg-grid-slate-500/[0.2] [mask-image:radial-gradient(white,transparent_85%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="mb-24 flex flex-col items-center text-center">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--cyan)] mb-4 font-mono flex items-center gap-4">
            <span className="w-8 h-[1px] bg-[var(--cyan)]"></span>
            QUANTIFIED
            <span className="w-8 h-[1px] bg-[var(--cyan)]"></span>
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white" style={{ fontFamily: 'var(--font-syne)', letterSpacing: '-0.04em' }}>
            By the Numbers
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {metrics.map((m: any, i: number) => (
            <MetricCard key={m.label} metric={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
