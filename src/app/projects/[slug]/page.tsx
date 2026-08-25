import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import Image from 'next/image';

import { projects as DEFAULT_PROJECTS } from '@/lib/constants';

async function getProject(slug: string) {
  // Use static data since we removed backend portfolio fetching
  const projects = DEFAULT_PROJECTS;
  return projects.find((p: any) => p.slug === slug);
}

export default async function ProjectCaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project || !project.caseStudy) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-transparent text-theme transition-theme pt-32 pb-20 selection:bg-cyan-500/30">
      <div className="noise-overlay" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <Link 
          href="/#projects" 
          className="inline-flex items-center gap-2 text-theme-muted hover:text-cyan-400 transition-colors mb-12 font-mono text-sm uppercase tracking-widest"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>

        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[var(--text)] to-[var(--text-muted)]" style={{ fontFamily: 'var(--font-syne)' }}>
            {project.title}
          </h1>
          <p className="text-xl text-theme-muted mb-8 max-w-2xl leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            {project.tags?.map((t: string) => (
              <span key={t} className="px-3 py-1.5 border border-cyan-900/50 bg-cyan-900/10 text-xs font-mono text-cyan-400 uppercase tracking-widest rounded">
                {t}
              </span>
            ))}
          </div>

          {(project.role || project.outcome) && (
            <div className="mb-10 p-6 bg-theme-card border border-theme rounded-xl space-y-4 transition-theme">
              {project.role && (
                <div>
                  <h3 className="text-xs font-mono text-theme-muted uppercase tracking-widest mb-1">Role</h3>
                  <p className="text-theme-dim">{project.role}</p>
                </div>
              )}
              {project.outcome && (
                <div>
                  <h3 className="text-xs font-mono text-theme-muted uppercase tracking-widest mb-1">Outcome</h3>
                  <p className="text-cyan-400">{project.outcome}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4">
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-cyan-500 text-black font-bold uppercase tracking-widest text-sm hover:bg-cyan-400 transition-colors rounded">
                <ExternalLink size={16} />
                Live Demo
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 border border-theme hover:border-cyan-400 transition-colors uppercase tracking-widest text-sm font-bold rounded">
                <FaGithub size={16} />
                Source Code
              </a>
            )}
          </div>
        </div>

        {/* Hero Image */}
        {(project.images && project.images.length > 0) && (
          <div className="relative w-full aspect-video border border-theme rounded-xl overflow-hidden mb-20 group transition-theme">
            <Image 
              src={project.images[0]} 
              alt={project.title || "Project Image"} 
              fill 
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-1000" 
            />
          </div>
        )}

        {/* Case Study Content */}
        <div className="space-y-20">
          {project.caseStudy.overview && (
            <section>
              <h2 className="text-2xl font-bold mb-6 text-cyan-400 flex items-center gap-4">
                <span className="text-xs font-mono text-theme-muted tracking-widest uppercase">01</span>
                Overview
              </h2>
              <div className="max-w-none text-theme-dim leading-loose text-lg">
                {project.caseStudy.overview}
              </div>
            </section>
          )}

          {project.caseStudy.architecture && (
            <section>
              <h2 className="text-2xl font-bold mb-6 text-cyan-400 flex items-center gap-4">
                <span className="text-xs font-mono text-theme-muted tracking-widest uppercase">02</span>
                Architecture & Tech Stack
              </h2>
              <div className="max-w-none text-theme-dim leading-loose text-lg">
                {project.caseStudy.architecture}
              </div>
            </section>
          )}

          {project.caseStudy.challenges && (
            <section className="p-8 border border-red-500/20 bg-red-500/5 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
              </div>
              <h2 className="text-2xl font-bold mb-6 text-red-400 flex items-center gap-4 relative z-10">
                <span className="text-xs font-mono text-red-500/50 tracking-widest uppercase">03</span>
                Challenges
              </h2>
              <div className="max-w-none text-theme-dim leading-loose text-lg relative z-10">
                {project.caseStudy.challenges}
              </div>
            </section>
          )}

          {project.caseStudy.solutions && (
            <section className="p-8 border border-green-500/20 bg-green-500/5 rounded-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h2 className="text-2xl font-bold mb-6 text-green-400 flex items-center gap-4 relative z-10">
                <span className="text-xs font-mono text-green-500/50 tracking-widest uppercase">04</span>
                Solutions
              </h2>
              <div className="max-w-none text-theme-dim leading-loose text-lg relative z-10">
                {project.caseStudy.solutions}
              </div>
            </section>
          )}

          {project.features && project.features.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 text-cyan-400 flex items-center gap-4">
                <span className="text-xs font-mono text-theme-muted tracking-widest uppercase">05</span>
                Key Features
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-theme-dim text-lg">
                {project.features.map((feature: string, idx: number) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Footer Link */}
        <div className="mt-32 pt-10 border-t border-theme transition-theme text-center">
          <Link href="/#contact" className="text-cyan-400 hover:text-theme transition-colors text-xl font-bold" style={{ fontFamily: 'var(--font-syne)' }}>
            Like what you see? Let's talk.
          </Link>
        </div>
      </div>
    </div>
  );
}
