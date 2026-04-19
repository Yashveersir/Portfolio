import { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CursorGlow from './components/CursorGlow';
import ScrollProgress from './components/ScrollProgress';
import Footer from './components/Footer';

/* Lazy-load heavy components */
const ParticleField = lazy(() => import('./components/ParticleField'));
const About = lazy(() => import('./components/About'));
const Skills = lazy(() => import('./components/Skills'));
const Projects = lazy(() => import('./components/Projects'));
const Certifications = lazy(() => import('./components/Certifications'));
const Experience = lazy(() => import('./components/Experience'));
const Contact = lazy(() => import('./components/Contact'));

/* Loading fallback */
function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="loader-ring" />
    </div>
  );
}

/* Initial loading screen */
function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        return p + Math.random() * 15 + 5;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="loader">
      <div className="flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold animate-pulse">
          Y
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1 rounded-full bg-dark-200 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{
              width: `${Math.min(progress, 100)}%`,
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)',
            }}
          />
        </div>

        <p className="text-text-dim text-xs font-mono">
          Loading experience...
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />;
  }

  return (
    <div className="relative bg-grid">
      {/* Global effects */}
      <CursorGlow />
      <ScrollProgress />
      <Navbar />

      {/* 3D Background */}
      <Suspense fallback={null}>
        <ParticleField />
      </Suspense>

      {/* Main Content */}
      <main className="relative z-10">
        <Hero />

        <Suspense fallback={<SectionLoader />}>
          <About />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <Skills />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <Projects />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <Certifications />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <Experience />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <Contact />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
