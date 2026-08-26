'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { skillCategories as DEFAULT_SKILLS } from '@/lib/constants';
import CharSplitHeading from './CharSplitHeading';
import { usePortfolioData } from '@/hooks/usePortfolioData';

// Replaced heavy canvas with a subtle CSS blueprint grid
function CoreSystemBg() {
  return (
    <div className="absolute inset-0 blueprint-grid opacity-[0.025] pointer-events-none" aria-hidden="true" />
  );
}

function ConstellationNode({ 
  category, 
  index, 
  total,
  selectedCategory,
  setSelectedCategory
}: { 
  category: any; 
  index: number; 
  total: number;
  selectedCategory: string | null;
  setSelectedCategory: (s: string | null) => void;
}) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2; // start from top
  const radius = 280; // Distance from center
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  
  const isSelected = selectedCategory === category.title;
  const isFaded = selectedCategory !== null && !isSelected;
  const isBottom = y > 100; // Determine if node is in the bottom half

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 hidden lg:flex flex-col items-center justify-center cursor-pointer"
      style={{ 
        x: `calc(-50% + ${x}px)`, 
        y: `calc(-50% + ${y}px)`,
        zIndex: isSelected ? 50 : 20
      }}
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 + index * 0.1, duration: 0.5, type: 'spring' }}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedCategory(isSelected ? null : category.title);
      }}
      animate={{
        opacity: isFaded ? 0.3 : 1,
        scale: isSelected ? 1.05 : 1,
      }}
      whileHover={{ scale: isSelected ? 1.05 : 1.1 }}
    >
      <div className="relative flex items-center justify-center">
        {isSelected && (
          <motion.div layoutId="glow" className="absolute inset-0 rounded-full blur-[20px]" style={{ background: category.color || '#22d3ee', opacity: 0.4 }} />
        )}
        <div 
          className="relative px-6 py-3 border border-[var(--card-border)] bg-[#0B1120]/40 backdrop-blur-md rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-colors"
          style={{ borderColor: isSelected ? category.color : 'var(--card-border)' }}
        >
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: category.color || '#22d3ee', fontFamily: 'var(--font-mono)' }}>
            {category.title}
          </span>
        </div>
      </div>
      
      {/* Beautiful Inside Content */}
      <AnimatePresence>
        {isSelected && (
          <motion.div 
            initial={{ opacity: 0, y: isBottom ? 20 : -20, x: '-50%', scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, x: '-50%', scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: isBottom ? 20 : -20, x: '-50%', scale: 0.9, filter: 'blur(10px)' }}
            transition={{ delay: 0.4, type: 'spring', damping: 20, stiffness: 100 }}
            className={`absolute ${isBottom ? 'bottom-full mb-6' : 'top-full mt-6'} left-1/2 w-[90vw] sm:w-[340px] bg-[#050914]/40 backdrop-blur-2xl border p-6 rounded-2xl shadow-2xl z-50 pointer-events-auto`}
            style={{ 
               borderColor: `${category.color}40`,
               boxShadow: `0 30px 60px rgba(0,0,0,0.8), inset 0 0 0 1px ${category.color}20`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`absolute ${isBottom ? 'bottom-0' : 'top-0'} left-1/2 -translate-x-1/2 w-1/2 h-[2px]`} style={{ background: `linear-gradient(90deg, transparent, ${category.color}, transparent)` }} />
            <div className={`absolute ${isBottom ? 'bottom-0' : 'top-0'} left-1/2 -translate-x-1/2 w-1/4 h-[10px] blur-[10px]`} style={{ background: category.color, opacity: 0.5 }} />
            
            <div className="flex flex-col gap-6 relative z-10">
               <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--card-border)' }}>
                 <h4 className="text-[12px] uppercase tracking-[0.3em] font-bold text-white/90" style={{ fontFamily: 'var(--font-mono)' }}>
                   {category.title}
                 </h4>
                 <div className="text-[10px] text-white/40 font-mono tracking-widest">
                   [{category.skills?.length || 0} SYS]
                 </div>
               </div>
               
               <div className="grid grid-cols-2 gap-2">
                {category.skills?.map((s: any, idx: number) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.05 }}
                    key={s.name} 
                    className="px-3 py-2 border border-white/5 bg-white/[0.02] hover:bg-white/[0.08] transition-colors rounded-lg text-[10px] uppercase tracking-widest text-[var(--text-dim)] flex items-center gap-2" 
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: category.color, boxShadow: `0 0 5px ${category.color}` }} />
                    <span className="truncate">{s.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Skills() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data } = usePortfolioData();
  const skillCategories = (data && Array.isArray(data.skills) && data.skills.length > 0) ? data.skills : DEFAULT_SKILLS;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Max rotation 8 degrees for a subtle 3D tilt
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setMousePos({ rotateX, rotateY });
  };

  return (
    <section id="skills" className="relative py-28 md:py-40 overflow-hidden bg-transparent min-h-[900px]" onClick={() => setSelectedCategory(null)}>
      <CoreSystemBg />
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 lg:mb-0 relative z-20">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--cyan)] mb-4" style={{ fontFamily: 'var(--font-mono)' }}>
            / STACK
          </span>
          <CharSplitHeading text="Technology" fontSize="clamp(3rem, 7vw, 6rem)" />
          <p className="mt-4 text-base md:text-lg text-[var(--text-dim)] max-w-lg" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            The languages, frameworks, and tools I use to build scalable, high-performance systems.
          </p>
        </div>

        {/* Desktop Constellation */}
        <div 
          className="hidden lg:block relative flex-1 min-h-[600px] mt-12"
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setMousePos({ rotateX: 0, rotateY: 0 })}
          style={{ perspective: 1200 }}
        >
          <motion.div 
            className="absolute inset-0 w-full h-full"
            animate={{ rotateX: mousePos.rotateX, rotateY: mousePos.rotateY }}
            transition={{ type: 'spring', stiffness: 100, damping: 30, mass: 1 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div style={{ transform: 'translateZ(50px)' }} className="absolute inset-0 w-full h-full">
              {/* SVG Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: 'visible' }}>
            <g style={{ transform: 'translate(50%, 50%)' }}>
              {skillCategories.map((cat: any, i: number) => {
                const angle = (i / skillCategories.length) * Math.PI * 2 - Math.PI / 2;
                const radius = 280;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const isSelected = selectedCategory === cat.title;
                
                return (
                  <g key={`line-${cat.title}`}>
                    <line x1="0" y1="0" x2={x} y2={y} stroke="var(--card-border)" strokeWidth="1" opacity="0.3" />
                    <AnimatePresence>
                      {isSelected && (
                        <motion.line 
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          exit={{ pathLength: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: 'easeInOut' }}
                          x1="0" y1="0" x2={x} y2={y} 
                          stroke={cat.color || '#22d3ee'} 
                          strokeWidth="2"
                          style={{ filter: `drop-shadow(0 0 8px ${cat.color || '#22d3ee'})` }}
                        />
                      )}
                    </AnimatePresence>
                  </g>
                )
              })}
            </g>
          </svg>

              {/* Central Node */}
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-30 pointer-events-none"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, type: 'spring' }}
              >
                <div className="relative flex items-center justify-center w-40 h-40">
                  <div className="absolute inset-0 rounded-full border border-[var(--cyan)]/30 bg-[var(--cyan)]/[0.05] shadow-[0_0_40px_rgba(34,211,238,0.2)] animate-[spin_10s_linear_infinite]" style={{ borderTopColor: 'transparent', borderBottomColor: 'transparent' }} />
                  <div className="absolute inset-2 rounded-full border border-[var(--cyan)]/20 animate-[spin_15s_linear_infinite_reverse]" style={{ borderLeftColor: 'transparent', borderRightColor: 'transparent' }} />
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,var(--cyan)_0%,transparent_60%)] blur-[20px] opacity-[0.15] animate-pulse" />
                  <span className="relative text-[11px] font-bold uppercase tracking-[0.3em] text-white text-center leading-relaxed" style={{ fontFamily: 'var(--font-mono)', textShadow: '0 0 10px rgba(34,211,238,0.8)' }}>
                    Engineering<br/>Stack
                  </span>
                </div>
              </motion.div>

          {/* Orbiting Nodes */}
          {skillCategories.map((cat: any, i: number) => (
            <ConstellationNode 
              key={cat.title} 
              category={cat} 
              index={i} 
              total={skillCategories.length} 
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          ))}
            </div>
          </motion.div>
        </div>

        {/* Mobile/Tablet Grid Fallback */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
          {skillCategories.map((cat: any, i: number) => (
            <motion.div 
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group bg-gradient-to-br from-[#0B1120]/40 to-[#050810]/40 backdrop-blur-2xl border border-[var(--card-border)] rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.5)]"
            >
              <div className="absolute inset-0 rounded-3xl border border-white/0 group-hover:border-[var(--cyan)]/30 transition-colors duration-500 pointer-events-none" />
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-2 h-2 rounded-full shadow-[0_0_10px_var(--cyan)] animate-pulse" style={{ background: cat.color || '#22d3ee', boxShadow: `0 0 15px ${cat.color || '#22d3ee'}` }} />
                <h3 className="text-[12px] uppercase tracking-[0.3em] font-bold text-white/90" style={{ fontFamily: 'var(--font-mono)' }}>
                  {cat.title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2 relative z-10">
                {cat.skills?.map((s: any) => (
                  <div key={s.name} className="px-3 py-1.5 border border-white/5 bg-white/[0.02] rounded-lg text-[10px] uppercase tracking-widest text-[var(--text-dim)] flex items-center gap-2" style={{ fontFamily: 'var(--font-mono)' }}>
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cat.color || '#22d3ee' }} />
                    {s.name}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
