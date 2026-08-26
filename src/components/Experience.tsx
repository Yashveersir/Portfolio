'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { experiences as DEFAULT_EXPERIENCES } from '@/lib/constants';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import CharSplitHeading from './CharSplitHeading';
import { ExternalLink } from 'lucide-react';

function ExperienceItem({ exp, index, total }: { exp: any; index: number; total: number }) {
  const isEven = index % 2 === 0;
  const isOngoing = exp.date.toLowerCase().includes('ongoing');
  
  const ref = useRef<HTMLDivElement>(null);

  // 3D Tilt & Spotlight states
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), { damping: 30, stiffness: 100 });
  const rotateY = useSpring(useMotionValue(0), { damping: 30, stiffness: 100 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseX.set(x);
    mouseY.set(y);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    rotateX.set(((y - centerY) / centerY) * -5); // subtle 5 deg tilt
    rotateY.set(((x - centerX) / centerX) * 5);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  // Generate an RGBA color for the spotlight based on the primary cyan color or a custom hex
  // Assuming exp.color might be a hex. If not provided, fallback to cyan.
  const spotlightColor = exp.color ? `${exp.color}30` : 'rgba(34, 211, 238, 0.15)'; 
  const nodeColor = exp.color || 'var(--cyan)';

  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between w-full mb-32 last:mb-0 group" style={{ perspective: 1200 }}>
      
      {/* Desktop Layout Helper: Left/Right Spacing */}
      <div className={`hidden md:flex w-[45%] flex-col justify-center ${isEven ? 'order-1 items-end text-right pr-16' : 'order-2 items-start text-left pl-16'}`}>
        <motion.div
          initial={{ opacity: 0, x: isEven ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 0.8, delay: 0.1, type: "spring" }}
          className="flex flex-col relative"
        >
          <span className="text-[12px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: nodeColor, fontFamily: 'var(--font-mono)' }}>
            {exp.date}
          </span>
          <h3 className="text-3xl font-bold text-white mb-2 tracking-tight" style={{ fontFamily: 'var(--font-syne)' }}>
            {exp.title}
          </h3>
          <p className="text-base text-[var(--text-dim)] font-medium tracking-wide" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            {exp.organization}
          </p>
        </motion.div>
      </div>

      {/* Central Node (Cyberpunk Diamond) */}
      <div className="order-1 md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 relative z-20 flex items-center justify-center mb-10 md:mb-0 group/node cursor-crosshair">
        {/* Glow aura on hover */}
        <div className="absolute inset-[-20px] rounded-full opacity-0 group-hover/node:opacity-100 blur-[15px] transition-opacity duration-500" style={{ background: nodeColor }} />
        
        <motion.div 
          initial={{ scale: 0, opacity: 0, rotate: 45 }}
          whileInView={{ scale: 1, opacity: 1, rotate: 45 }}
          viewport={{ once: true, margin: '-5%' }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          className="w-6 h-6 bg-[#0B1120] border-2 relative z-20 transition-all duration-500 group-hover:scale-110 group-hover/node:scale-150 group-hover/node:rotate-[225deg] group-hover/node:border-white group-hover/node:bg-white"
          style={{ 
            borderColor: nodeColor,
            boxShadow: `0 0 20px ${nodeColor}60`
          }}
        >
          {isOngoing && (
            <motion.div 
              animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
              className="absolute inset-0"
              style={{ background: nodeColor }}
            />
          )}
          {/* Inner core */}
          <div className="absolute inset-[3px] opacity-50 transition-all duration-300 group-hover:opacity-100 group-hover/node:opacity-0" style={{ background: nodeColor }} />
        </motion.div>
      </div>

      {/* Mobile Title (Hidden on Desktop) */}
      <div className="order-2 md:hidden w-full text-center mb-8 px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2 block" style={{ color: nodeColor, fontFamily: 'var(--font-mono)' }}>
            {exp.date}
          </span>
          <h3 className="text-2xl font-bold text-white mb-1 tracking-tight" style={{ fontFamily: 'var(--font-syne)' }}>
            {exp.title}
          </h3>
          <p className="text-sm text-[var(--text-dim)] font-medium" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            {exp.organization}
          </p>
        </motion.div>
      </div>

      {/* Content Area (Spotlight 3D Card) */}
      <div className={`w-full md:w-[45%] ${isEven ? 'order-2 pl-4 pr-4 md:pl-16 md:pr-0' : 'order-1 pl-4 pr-4 md:pr-16 md:pl-0'} relative z-30`}>
        <motion.div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
          className="relative group/card rounded-3xl p-[1px] shadow-2xl"
        >
          {/* Default subtle border */}
          <div className="absolute inset-0 rounded-3xl bg-white/5 transition-opacity duration-500 group-hover/card:opacity-0" />

          {/* Dynamic Glowing Border tracking mouse */}
          <motion.div
            className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  400px circle at ${mouseX}px ${mouseY}px,
                  ${nodeColor},
                  transparent 80%
                )
              `,
            }}
          />

          {/* Inner Card Background */}
          <div className="relative h-full w-full rounded-3xl bg-[#04060C]/40 backdrop-blur-3xl overflow-hidden p-8 md:p-10">
            
            {/* Subtle Blueprint Grid Texture */}
            <div className="absolute inset-0 blueprint-grid opacity-[0.03]" />

            {/* Spotlight Effect Overlay (Inside) */}
            <motion.div
              className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover/card:opacity-100"
              style={{
                background: useMotionTemplate`
                  radial-gradient(
                    500px circle at ${mouseX}px ${mouseY}px,
                    ${spotlightColor},
                    transparent 70%
                  )
                `,
              }}
            />

            {/* Elevated Content */}
            <div className="relative z-10" style={{ transform: 'translateZ(50px)' }}>
              <p className="text-sm md:text-base text-[var(--text-dim)] leading-relaxed mb-8" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                {exp.description}
              </p>

              <ul className="flex flex-col gap-5">
                {exp.achievements.map((a: string, ai: number) => (
                  <li key={ai} className="flex items-start gap-4 text-sm text-[var(--text-dim)] hover:text-white transition-colors duration-300" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    <span className="mt-1 shrink-0 text-[10px]" style={{ color: nodeColor }}>◆</span>
                    <span className="leading-relaxed">{a}</span>
                  </li>
                ))}
              </ul>

              {(exp as { certificate?: string }).certificate && (
                <div className="mt-8 pt-6 border-t border-white/5">
                  <a
                    href={(exp as { certificate?: string }).certificate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors font-mono group/btn"
                  >
                    <ExternalLink size={14} className="group-hover/btn:scale-110 group-hover/btn:rotate-12 transition-transform" /> View Certificate
                  </a>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Experience() {
  const { data } = usePortfolioData();
  const experiences = (data && Array.isArray(data.experiences) && data.experiences.length > 0) ? data.experiences : DEFAULT_EXPERIENCES;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start center", "end center"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="experience" className="relative py-28 md:py-40 bg-transparent min-h-screen">
      
      <div className="mx-auto max-w-6xl px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-24 md:mb-32">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--cyan)] mb-4 font-mono">
            / CAREER
          </span>
          <CharSplitHeading text="Experience" fontSize="clamp(2.5rem, 8vw, 6rem)" />
          <p className="mt-6 text-base text-[var(--text-dim)] max-w-lg font-dm-sans">
            Professional trajectory and organizational impact.
          </p>
        </div>

        <div ref={containerRef} className="relative mt-20">
          {/* Central Line (Animated) - Glow enhanced */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 bg-white/5 hidden md:block" />
          <motion.div 
            className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 hidden md:block origin-top shadow-[0_0_15px_var(--cyan)]"
            style={{ 
              scaleY,
              background: 'linear-gradient(to bottom, var(--cyan), transparent)'
            }}
          />

          <div className="flex flex-col relative z-10">
            {experiences.map((exp: any, i: number) => (
              <ExperienceItem key={exp.title} exp={exp} index={i} total={experiences.length} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
