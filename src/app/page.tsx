'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import ByTheNumbers from '@/components/ByTheNumbers';
import ScrollReveal from '@/components/ScrollReveal';

const AboutBackground3D = dynamic(() => import('@/components/AboutBackground3D'), { ssr: false });

const Projects      = dynamic(() => import('@/components/Projects'),      { ssr: true });
const Certifications = dynamic(() => import('@/components/Certifications'), { ssr: true });
const Experience    = dynamic(() => import('@/components/Experience'),    { ssr: true });
const Contact       = dynamic(() => import('@/components/Contact'),       { ssr: true });

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

    (window as unknown as { lenis: Lenis }).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (backendUrl) {
      fetch(backendUrl).catch(() => {});
    }

    return () => { lenis.destroy(); };
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative bg-[var(--bg)]" suppressHydrationWarning>
      {/* Base Global 3D Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <AboutBackground3D />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col">
        <Hero />

        <ScrollReveal direction="left">
          <About />
        </ScrollReveal>

        <ScrollReveal direction="scale">
          <Skills />
        </ScrollReveal>

        <ScrollReveal direction="up">
          <ByTheNumbers />
        </ScrollReveal>

        <ScrollReveal direction="right">
          <Projects />
        </ScrollReveal>

        <ScrollReveal direction="up">
          <Certifications />
        </ScrollReveal>

        <ScrollReveal direction="left">
          <Experience />
        </ScrollReveal>

        <ScrollReveal direction="scale">
          <Contact />
        </ScrollReveal>
      </div>
    </div>
  );
}
