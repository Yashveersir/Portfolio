'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { projects as DEFAULT_PROJECTS } from '@/lib/constants';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { ExternalLink, ChevronRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import CharSplitHeading from './CharSplitHeading';

type Project = {
  title: string;
  subtitle?: string;
  slug?: string;
  role?: string;
  outcome?: string;
  description?: string;
  tags?: string[];
  features?: string[];
  github?: string;
  demo?: string;
  images?: string[];
  color?: string;
  caseStudy?: object;
  [key: string]: unknown;
};

function ProjectPanel({ project, index }: { project: Project; index: number }) {
  const num = String(index + 1).padStart(2, '0');
  const isEven = index % 2 === 0;
  
  // Outer diorama ref
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start end", "end start"] });
  
  // Inner card ref for spotlight
  const cardRef = useRef<HTMLDivElement>(null);
  
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  // 3D Tilt states for Diorama wrapper
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), { damping: 30, stiffness: 100 });
  const rotateY = useSpring(useMotionValue(0), { damping: 30, stiffness: 100 });

  // Spotlight states for inner card
  const cardMouseX = useMotionValue(0);
  const cardMouseY = useMotionValue(0);

  function handleWrapperMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseX.set(x);
    mouseY.set(y);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Very subtle tilt for the large diorama
    rotateX.set(((y - centerY) / centerY) * -3);
    rotateY.set(((x - centerX) / centerX) * 3);
  }

  function handleCardMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardMouseX.set(x);
    cardMouseY.set(y);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  const spotlightColor = project.color ? `${project.color}25` : 'rgba(34, 211, 238, 0.15)';
  const nodeColor = project.color || 'var(--cyan)';

  return (
    <motion.div 
      ref={wrapperRef} 
      onMouseMove={handleWrapperMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative w-full min-h-[70vh] flex flex-col lg:flex-row items-center py-16 md:py-24 group perspective-[2000px]"
    >
      
      {/* Number Watermark (Slightly floating in 3D) */}
      <div className="absolute top-0 right-8 text-[15vw] font-black text-[var(--text-muted)] opacity-5 pointer-events-none select-none transition-transform duration-500" style={{ fontFamily: 'var(--font-syne)', lineHeight: 0.8, transform: 'translateZ(-50px)' }}>
        {num}
      </div>

      <div className={`w-full flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-0 relative z-10`} style={{ transformStyle: "preserve-3d" }}>
        
        {/* Image Area - Professional sizing */}
        <div className="w-full lg:w-[55%] relative aspect-video lg:aspect-[16/10] overflow-hidden rounded-2xl border border-white/5 bg-[#030509] shadow-2xl transition-transform duration-500 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)]" style={{ transform: 'translateZ(30px)' }}>
           {/* Color shifting overlay */}
           <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-700 z-10 pointer-events-none" />
           <motion.div style={{ scale: imgScale, y: imgY, transformOrigin: 'center' }} className="w-full h-[110%] absolute -top-[5%]">
             {project.images?.[0] ? (
               <Image 
                  src={project.images[0]} 
                  alt={project.title} 
                  fill 
                  className="object-cover saturate-50 group-hover:saturate-100 transition-all duration-700" 
                  sizes="(max-width: 1024px) 100vw, 55vw"
               />
             ) : (
               <div className="w-full h-full bg-[var(--bg-shift)]/50" />
             )}
           </motion.div>
           <div className="absolute inset-0 bg-gradient-to-t from-[#04060C] via-transparent to-transparent opacity-80 z-10 pointer-events-none" />
        </div>

        {/* Content Area - Glowing Glass Card floating even higher */}
        <div className={`w-full lg:w-[50%] flex flex-col ${isEven ? 'lg:-ml-12' : 'lg:-mr-12'} relative z-20`} style={{ transform: 'translateZ(60px)' }}>
          <motion.div 
            ref={cardRef}
            onMouseMove={handleCardMouseMove}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative group/card rounded-3xl p-[1px] shadow-[0_30px_60px_rgba(0,0,0,0.7)]"
          >
            {/* Default subtle border */}
            <div className="absolute inset-0 rounded-3xl bg-white/5 transition-opacity duration-500 group-hover/card:opacity-0" />

            {/* Dynamic Glowing Border tracking mouse */}
            <motion.div
              className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
              style={{
                background: useMotionTemplate`
                  radial-gradient(
                    400px circle at ${cardMouseX}px ${cardMouseY}px,
                    ${nodeColor},
                    transparent 80%
                  )
                `,
              }}
            />

            {/* Inner Card Background */}
            <div className="relative h-full w-full rounded-3xl bg-[#04060C]/40 backdrop-blur-3xl overflow-hidden p-8 md:p-12">
              
              {/* Subtle Blueprint Grid Texture */}
              <div className="absolute inset-0 blueprint-grid opacity-[0.03]" />

              {/* Spotlight Effect Overlay (Inside) */}
              <motion.div
                className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover/card:opacity-100"
                style={{
                  background: useMotionTemplate`
                    radial-gradient(
                      500px circle at ${cardMouseX}px ${cardMouseY}px,
                      ${spotlightColor},
                      transparent 70%
                    )
                  `,
                }}
              />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[12px] font-bold font-mono tracking-widest" style={{ color: nodeColor }}>0{index + 1}</span>
                  <div className="h-[1px] flex-grow bg-white/10" />
                </div>

                <h3 className="text-3xl md:text-4xl font-black mb-3 text-white tracking-tight" style={{ fontFamily: 'var(--font-syne)' }}>
                  {project.title}
                </h3>
                
                <p className="text-[11px] uppercase tracking-widest font-mono mb-6" style={{ color: nodeColor }}>
                  {project.subtitle || 'Production Application'}
                </p>

                <p className="text-[var(--text-dim)] text-sm md:text-base leading-relaxed mb-8" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags?.map(tag => (
                    <span key={tag} className="px-3 py-1.5 border border-white/5 bg-black/40 rounded-full text-[9px] uppercase tracking-widest text-[var(--text-dim)] font-mono hover:border-white/20 hover:text-white transition-colors cursor-default">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-white/10 pt-6 mt-auto">
                  <div className="flex items-center gap-6 w-full sm:w-auto">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] uppercase font-mono tracking-widest text-[var(--text-dim)] hover:text-white transition-colors group/link">
                        <FaGithub size={16} className="group-hover/link:scale-110 transition-transform" /> Source
                      </a>
                    )}
                    {project.demo && (
                      <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] uppercase font-mono tracking-widest hover:text-white transition-colors group/link" style={{ color: nodeColor }}>
                        <ExternalLink size={16} className="group-hover/link:scale-110 group-hover/link:rotate-12 transition-transform" /> Live Demo
                      </a>
                    )}
                  </div>
                  
                  {project.slug && project.caseStudy && (
                    <Link href={`/projects/${project.slug}`} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--cyan)] transition-colors hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                      Case Study <ChevronRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}

export default function Projects() {
  const { data } = usePortfolioData();
  const projects = (data && Array.isArray(data.projects) && data.projects.length > 0) ? data.projects : DEFAULT_PROJECTS;

  return (
    <section id="projects" className="relative py-28 md:py-40 bg-transparent overflow-hidden">
      
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 relative z-10">
        
        <div className="flex flex-col items-center text-center mb-24 md:mb-32">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--cyan)] mb-4 font-mono">
            / WORK
          </span>
          <CharSplitHeading text="Selected Projects" fontSize="clamp(2.5rem, 8vw, 6rem)" />
          <p className="mt-6 text-base text-[var(--text-dim)] max-w-lg font-dm-sans">
            Real products, real outcomes. A selection of systems I&apos;ve built and deployed.
          </p>
        </div>

        <div className="flex flex-col gap-24 md:gap-32">
          {projects.map((project: Project, i: number) => (
            <ProjectPanel key={project.title} project={project} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
