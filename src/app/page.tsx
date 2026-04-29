'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import ScrollReveal from '@/components/ScrollReveal';
import SectionBg from '@/components/SectionBg';

const Projects = dynamic(() => import('@/components/Projects'), { ssr: true });
const Certifications = dynamic(() => import('@/components/Certifications'), { ssr: true });
const Experience = dynamic(() => import('@/components/Experience'), { ssr: true });
const Contact = dynamic(() => import('@/components/Contact'), { ssr: true });

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Expose lenis to window for use in other components (e.g., Footer)
    (window as any).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero — no scroll reveal, has its own canvas bg */}
      <Hero />

      {/* About */}
      <ScrollReveal direction="left">
        <About />
      </ScrollReveal>

      {/* Skills */}
      <ScrollReveal direction="scale">
        <Skills />
      </ScrollReveal>

      {/* Projects */}
      <ScrollReveal direction="right">
        <Projects />
      </ScrollReveal>

      {/* Certifications — soft bokeh */}
      <div className="relative">
        <SectionBg variant="bokeh" color="#a855f7" opacity={0.6} />
        <ScrollReveal direction="up">
          <Certifications />
        </ScrollReveal>
      </div>

      {/* Experience */}
      <ScrollReveal direction="left">
        <Experience />
      </ScrollReveal>

      {/* Contact — back to glowing grid */}
      <div className="relative">
        <SectionBg variant="grid" color="#7c6fff" opacity={0.6} />
        <ScrollReveal direction="scale" parallax={20}>
          <Contact />
        </ScrollReveal>
      </div>
    </div>
  );
}
