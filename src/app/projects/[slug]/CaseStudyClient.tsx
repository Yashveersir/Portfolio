'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ExternalLink, ChevronRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import CaseStudyBackground3D from '@/components/CaseStudyBackground3D';

export default function CaseStudyClient({ project }: { project: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 3D Hero Parallax & Tilt
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), { damping: 30, stiffness: 100 });
  const rotateY = useSpring(useMotionValue(0), { damping: 30, stiffness: 100 });

  function handleHeroMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseX.set(x);
    mouseY.set(y);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    rotateX.set(((y - centerY) / centerY) * -5);
    rotateY.set(((x - centerX) / centerX) * 5);
  }

  function handleHeroMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  const primaryColor = project.color || '#22d3ee';
  const glowColor = `${primaryColor}40`;

  // Glass Card Spotlight logic
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardMouseX = useMotionValue(0);
  const cardMouseY = useMotionValue(0);

  function handleCardMouseMove(e: React.MouseEvent<HTMLDivElement>, index: number) {
    const el = cardRefs.current[index];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    cardMouseX.set(e.clientX - rect.left);
    cardMouseY.set(e.clientY - rect.top);
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[#030509] text-white selection:bg-[var(--cyan)]/30 overflow-x-hidden relative">
      
      {/* 3D Wave Background */}
      <CaseStudyBackground3D color={primaryColor} />

      {/* Cinematic Hero Section */}
      <section 
        className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden perspective-[2000px]"
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
      >
        {/* Blurred Background Image */}
        {(project.images && project.images.length > 0) && (
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0 pointer-events-none">
            <Image 
              src={project.images[0]} 
              alt={project.title} 
              fill 
              className="object-cover blur-3xl opacity-30 saturate-200" 
            />
            {/* Fade the image to transparent so the 3D background is visible underneath */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#030509]/80 via-[#030509]/50 to-transparent" />
          </motion.div>
        )}

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-20">
          <Link 
            href="/#projects" 
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-12 font-mono text-[10px] uppercase tracking-[0.2em] group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24"
          >
            {/* Left: Titles */}
            <div className="w-full lg:w-1/2">
              <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]" style={{ fontFamily: 'var(--font-syne)' }}>
                {project.title}
              </h1>
              <p className="text-xl md:text-2xl text-white/60 mb-8 max-w-xl leading-relaxed" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                {project.subtitle || project.description}
              </p>

              <div className="flex gap-4">
                {project.demo && (
                  <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-8 py-4 bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-[var(--cyan)] hover:shadow-[0_0_30px_var(--cyan)] transition-all duration-300 rounded-full group/btn">
                    <ExternalLink size={16} className="group-hover/btn:rotate-12 transition-transform" />
                    Live Demo
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-8 py-4 border border-white/20 hover:border-white/60 transition-colors uppercase tracking-[0.2em] text-[10px] font-bold rounded-full group/btn">
                    <FaGithub size={16} className="group-hover/btn:scale-110 transition-transform" />
                    Source Code
                  </a>
                )}
              </div>
            </div>

            {/* Right: 3D Image Diorama */}
            {(project.images && project.images.length > 0) && (
              <div className="w-full lg:w-1/2 perspective-[2000px]">
                <motion.div 
                  style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                  className="relative aspect-video rounded-2xl border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.8)] overflow-hidden"
                >
                  <motion.div style={{ transform: 'translateZ(30px)' }} className="absolute inset-0">
                    <Image 
                      src={project.images[0]} 
                      alt={project.title} 
                      fill 
                      unoptimized
                      className="object-cover scale-110" 
                    />
                  </motion.div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Bento Box Content Grid */}
      <section className="relative z-20 w-full max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-24">
            
            {project.caseStudy?.overview && (
              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-4" style={{ fontFamily: 'var(--font-syne)', color: primaryColor }}>
                  <span className="text-[10px] font-mono text-white/30 tracking-[0.2em] uppercase">01</span>
                  Overview
                </h2>
                <div className="text-white/60 leading-relaxed text-lg md:text-xl font-light" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  {project.caseStudy.overview}
                </div>
              </motion.div>
            )}

            {project.caseStudy?.architecture && (
              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-4" style={{ fontFamily: 'var(--font-syne)', color: primaryColor }}>
                  <span className="text-[10px] font-mono text-white/30 tracking-[0.2em] uppercase">02</span>
                  Architecture & Tech
                </h2>
                <div className="text-white/60 leading-relaxed text-lg md:text-xl font-light" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  {project.caseStudy.architecture}
                </div>
              </motion.div>
            )}

            {/* Challenges Card */}
            {project.caseStudy?.challenges && (
              <motion.div 
                ref={(el) => { cardRefs.current[0] = el; }}
                onMouseMove={(e) => handleCardMouseMove(e, 0)}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
                className="relative group/card p-[1px] rounded-3xl"
              >
                <div className="absolute inset-0 rounded-3xl bg-red-500/10 transition-opacity duration-500 group-hover/card:opacity-0" />
                <motion.div
                  className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                  style={{ background: useMotionTemplate`radial-gradient(600px circle at ${cardMouseX}px ${cardMouseY}px, rgba(239,68,68,0.4), transparent 80%)` }}
                />
                
                <div className="relative h-full bg-[#030509]/90 backdrop-blur-3xl rounded-3xl p-10 md:p-12 overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
                  <motion.div
                    className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover/card:opacity-100"
                    style={{ background: useMotionTemplate`radial-gradient(800px circle at ${cardMouseX}px ${cardMouseY}px, rgba(239,68,68,0.1), transparent 70%)` }}
                  />

                  <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-6 text-red-400 flex items-center gap-4" style={{ fontFamily: 'var(--font-syne)' }}>
                      <span className="text-[10px] font-mono text-red-500/50 tracking-[0.2em] uppercase">03</span>
                      Challenges
                    </h2>
                    <div className="text-white/70 leading-relaxed text-lg font-light" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                      {project.caseStudy.challenges}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Solutions Card */}
            {project.caseStudy?.solutions && (
              <motion.div 
                ref={(el) => { cardRefs.current[1] = el; }}
                onMouseMove={(e) => handleCardMouseMove(e, 1)}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
                className="relative group/card p-[1px] rounded-3xl"
              >
                <div className="absolute inset-0 rounded-3xl bg-emerald-500/10 transition-opacity duration-500 group-hover/card:opacity-0" />
                <motion.div
                  className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                  style={{ background: useMotionTemplate`radial-gradient(600px circle at ${cardMouseX}px ${cardMouseY}px, rgba(16,185,129,0.4), transparent 80%)` }}
                />
                
                <div className="relative h-full bg-[#030509]/90 backdrop-blur-3xl rounded-3xl p-10 md:p-12 overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
                  <motion.div
                    className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover/card:opacity-100"
                    style={{ background: useMotionTemplate`radial-gradient(800px circle at ${cardMouseX}px ${cardMouseY}px, rgba(16,185,129,0.1), transparent 70%)` }}
                  />

                  <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-6 text-emerald-400 flex items-center gap-4" style={{ fontFamily: 'var(--font-syne)' }}>
                      <span className="text-[10px] font-mono text-emerald-500/50 tracking-[0.2em] uppercase">04</span>
                      Solutions
                    </h2>
                    <div className="text-white/70 leading-relaxed text-lg font-light" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                      {project.caseStudy.solutions}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sticky Sidebar (Metadata) */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-32 flex flex-col gap-12">
              
              <div className="space-y-8 p-8 border border-white/5 bg-white/[0.02] backdrop-blur-md rounded-2xl">
                {project.role && (
                  <div>
                    <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-2">Role</h3>
                    <p className="text-white/80 font-medium">{project.role.replace('Role: ', '')}</p>
                  </div>
                )}
                
                {project.outcome && (
                  <div>
                    <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-2">Impact</h3>
                    <p className="text-white/80 font-medium">{project.outcome.replace('Outcome: ', '')}</p>
                  </div>
                )}
                
                {project.tags && (
                  <div>
                    <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-4">Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((t: string) => (
                        <span key={t} className="px-3 py-1.5 border border-white/10 bg-black/50 text-[9px] font-mono text-white/60 uppercase tracking-[0.2em] rounded-full">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {project.features && project.features.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-4">Key Features</h3>
                  <ul className="flex flex-col gap-3">
                    {project.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-white/60">
                        <span className="mt-1 shrink-0 text-[8px]" style={{ color: primaryColor }}>◆</span>
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
            </div>
          </div>

        </div>

        {/* Footer CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-40 pt-20 border-t border-white/10 text-center flex flex-col items-center"
        >
          <span className="text-[10px] font-mono text-white/30 tracking-[0.2em] uppercase mb-6 block">Next Steps</span>
          <Link href="/#contact" className="text-4xl md:text-6xl font-black text-white hover:text-[var(--cyan)] transition-colors inline-block" style={{ fontFamily: 'var(--font-syne)' }}>
            Like what you see? Let's talk.
          </Link>
        </motion.div>

      </section>
    </div>
  );
}
