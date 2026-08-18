import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import Image from 'next/image';

async function getProject(slug: string) {
  // Use absolute URL since fetch runs on server during build/SSR
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  const baseUrl = backendUrl.replace(/\/$/, '');
  
  try {
    const res = await fetch(`${baseUrl}/api/portfolio`, {
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.projects?.find((p: any) => p.slug === slug);
  } catch (err) {
    console.error('Failed to fetch project:', err);
    return null;
  }
}

export default async function ProjectCaseStudy({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);

  if (!project || !project.caseStudy) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-20 selection:bg-cyan-500/30">
      <div className="noise-overlay" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <Link 
          href="/#projects" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-12 font-mono text-sm uppercase tracking-widest"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>

        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500" style={{ fontFamily: 'var(--font-syne)' }}>
            {project.title}
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            {project.tech?.map((t: string) => (
              <span key={t} className="px-3 py-1.5 border border-theme bg-theme-card text-xs font-mono text-theme-muted uppercase tracking-widest">
                {t}
              </span>
            ))}
          </div>

          <div className="flex gap-4">
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-cyan-500 text-black font-bold uppercase tracking-widest text-sm hover:bg-cyan-400 transition-colors">
                <ExternalLink size={16} />
                Live Demo
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 border border-gray-700 hover:border-gray-400 transition-colors uppercase tracking-widest text-sm font-bold">
                <FaGithub size={16} />
                Source Code
              </a>
            )}
          </div>
        </div>

        {/* Hero Image */}
        {project.image && (
          <div className="relative w-full aspect-video border border-gray-800 rounded-xl overflow-hidden mb-20 group">
            <Image 
              src={project.image} 
              alt={project.title} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-1000" 
            />
          </div>
        )}

        {/* Case Study Content */}
        <div className="space-y-20">
          <section>
            <h2 className="text-2xl font-bold mb-6 text-cyan-400 flex items-center gap-4">
              <span className="text-xs font-mono text-gray-500 tracking-widest uppercase">01</span>
              Overview
            </h2>
            <div className="prose prose-invert max-w-none text-gray-300 leading-loose text-lg">
              {project.caseStudy.overview}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 text-cyan-400 flex items-center gap-4">
              <span className="text-xs font-mono text-gray-500 tracking-widest uppercase">02</span>
              Architecture & Tech Stack
            </h2>
            <div className="prose prose-invert max-w-none text-gray-300 leading-loose text-lg">
              {project.caseStudy.architecture}
            </div>
          </section>

          <section className="p-8 border border-red-500/20 bg-red-500/5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </div>
            <h2 className="text-2xl font-bold mb-6 text-red-400 flex items-center gap-4 relative z-10">
              <span className="text-xs font-mono text-red-500/50 tracking-widest uppercase">03</span>
              Challenges
            </h2>
            <div className="prose prose-invert max-w-none text-red-200/80 leading-loose text-lg relative z-10">
              {project.caseStudy.challenges}
            </div>
          </section>

          <section className="p-8 border border-green-500/20 bg-green-500/5 rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h2 className="text-2xl font-bold mb-6 text-green-400 flex items-center gap-4 relative z-10">
              <span className="text-xs font-mono text-green-500/50 tracking-widest uppercase">04</span>
              Solutions & Outcome
            </h2>
            <div className="prose prose-invert max-w-none text-green-200/80 leading-loose text-lg relative z-10">
              {project.caseStudy.solutions}
            </div>
          </section>
        </div>

        {/* Footer Link */}
        <div className="mt-32 pt-10 border-t border-gray-800 text-center">
          <Link href="/#contact" className="text-cyan-400 hover:text-white transition-colors text-xl font-bold" style={{ fontFamily: 'var(--font-syne)' }}>
            Like what you see? Let's talk.
          </Link>
        </div>
      </div>
    </div>
  );
}
