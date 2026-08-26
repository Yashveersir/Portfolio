'use client';

import { useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useMotionTemplate } from 'framer-motion';
import { certifications as DEFAULT_CERTIFICATIONS } from '@/lib/constants';
import { ExternalLink, Award } from 'lucide-react';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import CharSplitHeading from './CharSplitHeading';

const CERT_COLORS = [
  '34, 211, 238',   // cyan
  '167, 139, 250',  // purple
  '244, 114, 182',  // pink
  '52, 211, 153',   // emerald
  '251, 191, 36',   // amber
  '96, 165, 250',   // blue
  '248, 113, 113',  // red
];

// Extracted into a separate component so each card manages its own spotlight coordinates efficiently
function CertificationCard({ 
  cert, 
  index, 
  isHovered, 
  isDimmed, 
  onMouseEnter, 
  onMouseLeave 
}: { 
  cert: any; 
  index: number; 
  isHovered: boolean; 
  isDimmed: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const colorRGB = CERT_COLORS[index % CERT_COLORS.length];

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  return (
    <motion.a
      ref={cardRef}
      href={cert.pdf}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.5) }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={handleMouseMove}
      className={`group/cert relative p-[1px] rounded-2xl transition-all duration-500 min-h-[180px] block ${
        isDimmed ? 'opacity-30 scale-[0.98]' : 'opacity-100'
      } ${isHovered ? 'z-10 scale-[1.02] -translate-y-1 shadow-[0_20px_40px_rgba(0,0,0,0.5)]' : 'z-0'}`}
    >
      {/* Subtle Default Border */}
      <div className="absolute inset-0 rounded-2xl bg-white/5 transition-opacity duration-500 group-hover/cert:opacity-0" />

      {/* Glowing Spotlight Border */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover/cert:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              300px circle at ${mouseX}px ${mouseY}px,
              rgba(${colorRGB}, 1),
              transparent 80%
            )
          `,
        }}
      />

      {/* Inner Glass Card */}
      <div className="relative h-full bg-[#04060C]/40 backdrop-blur-3xl rounded-2xl p-6 flex flex-col justify-between overflow-hidden">
        {/* Blueprint Texture */}
        <div className="absolute inset-0 blueprint-grid opacity-[0.03]" />
        
        {/* Inner Glowing Spotlight */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover/cert:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                400px circle at ${mouseX}px ${mouseY}px,
                rgba(${colorRGB}, 0.08),
                transparent 70%
              )
            `,
          }}
        />

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] font-mono text-white/30 tracking-[0.2em]">
              #{String(index + 1).padStart(3, '0')}
            </span>
            <div 
              className={`p-2 rounded-full transition-colors duration-300 ${isHovered ? '' : 'bg-white/5 text-white/40'}`}
              style={isHovered ? { backgroundColor: `rgba(${colorRGB}, 0.2)`, color: `rgb(${colorRGB})` } : {}}
            >
              <Award size={16} />
            </div>
          </div>
          
          <h3 className="text-sm md:text-base font-bold text-white mb-2 leading-snug drop-shadow-md" style={{ fontFamily: 'var(--font-syne)' }}>
            {cert.title}
          </h3>
        </div>
        
        <div className="relative z-10 flex items-center justify-between mt-6">
          <div className="flex items-center gap-2">
            <div 
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${isHovered ? '' : 'bg-white/20'}`} 
              style={isHovered ? { backgroundColor: `rgb(${colorRGB})`, boxShadow: `0 0 10px rgb(${colorRGB})` } : {}}
            />
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/60 font-mono">
              {cert.issuer}
            </span>
          </div>
          <ExternalLink 
            size={14} 
            className={`transition-all duration-300 ${isHovered ? 'translate-x-1 -translate-y-1' : 'text-transparent'}`} 
            style={isHovered ? { color: `rgb(${colorRGB})` } : {}}
          />
        </div>
      </div>
    </motion.a>
  );
}

export default function Certifications() {
  const { data } = usePortfolioData();
  const certifications = (data && Array.isArray(data.certifications) && data.certifications.length > 0) ? data.certifications : DEFAULT_CERTIFICATIONS;
  
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="certifications" className="relative py-32 md:py-48 bg-transparent">
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-full h-[800px] bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.05),transparent_50%)] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        
        {/* Header (Stacked like Projects section) */}
        <div className="flex flex-col items-start gap-6 mb-16 md:mb-24">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--cyan)] font-mono flex items-center gap-4">
            <span className="w-8 h-[1px] bg-[var(--cyan)]"></span>
            CREDENTIALS
          </span>
          <CharSplitHeading text="Certifications" fontSize="clamp(3rem, 7vw, 6rem)" />
          
          <p className="text-base md:text-lg text-white/60 font-light leading-relaxed max-w-2xl mt-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            13+ verified credentials across AI, cloud architecture, and full-stack engineering, presented in a secure digital archive.
          </p>
        </div>

        {/* Dense Archive Grid / Slider on Mobile */}
        <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8 snap-x snap-mandatory cert-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
          {certifications.map((cert: any, i: number) => (
            <div key={cert.title} className="w-[85vw] sm:w-[320px] shrink-0 md:w-auto snap-center md:snap-none">
              <CertificationCard
                cert={cert}
                index={i}
                isHovered={hoveredIndex === i}
                isDimmed={hoveredIndex !== null && hoveredIndex !== i}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
