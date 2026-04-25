import { useState, useRef } from 'react';
/* eslint-disable-next-line no-unused-vars */
import { motion } from 'framer-motion';
import { projects } from '../constants';
import { fadeIn, textVariant, staggerContainer } from '../utils/motion';
import { FaGithub, FaExternalLinkAlt, FaStar, FaChevronRight } from 'react-icons/fa';

/* ========== Custom 3D Tilt Card ========== */
function TiltCard({ children, className = '' }) {
  const ref = useRef(null);
  const [style, setStyle] = useState({});

  const handleMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease',
    });
  };

  const handleLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease',
    });
  };

  return (
    <div
      ref={ref}
      className={className}
      style={style}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
}

/* ========== Project Card ========== */
function ProjectCard({ project, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div variants={fadeIn('up', index * 0.15)} className="h-full">
      <TiltCard className="h-full">
        <div
          className={`glass rounded-2xl overflow-hidden h-full flex flex-col gradient-border card-hover-lift group ${
            project.featured ? 'neon-glow' : ''
          }`}
        >
          {/* Header Bar */}
          <div
            className="h-1.5 w-full"
            style={{
              background: `linear-gradient(90deg, ${project.color}, ${project.color}66)`,
            }}
          />

          {project.images?.[0] && (
            <div className="px-4 pt-4 sm:px-5 sm:pt-5">
              <div className="relative overflow-hidden rounded-xl border border-white/10">
              <img
                src={project.images[0]}
                alt={`${project.title} preview`}
                className="w-full h-44 object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                draggable="false"
              />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/65 to-transparent" />
                <span
                  className="absolute left-3 bottom-2 text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: project.color }}
                >
                  Live Preview
                </span>
              </div>
            </div>
          )}

          <div className="card-spacing-lg flex flex-col flex-1">
            {/* Featured badge */}
            {project.featured && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-3">
                <FaStar /> FEATURED PROJECT
              </div>
            )}

            {/* Title */}
            <h3
              className="text-xl sm:text-2xl font-bold text-white mb-1"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {project.title}
            </h3>
            <p className="text-sm font-medium mb-4" style={{ color: project.color }}>
              {project.subtitle}
            </p>
            <p className="text-xs text-text-dim mb-1">{project.role}</p>
            <p className="text-xs text-primary-light mb-4">{project.outcome}</p>

            {/* Description Bullets */}
            <ul className="list-none m-0 p-0 mb-5 space-y-2">
              {(project.descriptionBullets || [project.description]).map((point) => (
                <li
                  key={point}
                  className="text-text-muted text-sm leading-relaxed flex items-start gap-2"
                >
                  <span className="text-primary-light font-bold mt-[2px] leading-none">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            {/* Features */}
            <div className="mb-5">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-xs font-semibold text-primary-light bg-transparent border-none cursor-pointer mb-2 p-0"
              >
                Key Features
                <motion.span
                  animate={{ rotate: expanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaChevronRight className="text-[10px]" />
                </motion.span>
              </button>

              <motion.ul
                className="list-none m-0 p-0 overflow-hidden"
                initial={false}
                animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {project.features.map((f) => (
                  <li
                    key={f}
                    className="text-text-dim text-xs py-1 flex items-start gap-2"
                  >
                    <span className="text-primary-light mt-[2px] leading-none">▹</span>
                    <span>{f}</span>
                  </li>
                ))}
              </motion.ul>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg text-xs font-medium"
                  style={{
                    background: `${project.color}12`,
                    color: project.color,
                    border: `1px solid ${project.color}25`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

          </div>

          {/* Card Footer Actions */}
          <div className="relative z-20 border-t border-white/10 px-5 py-4 sm:px-6 min-h-[84px] flex items-center">
            <div className="flex gap-3 w-full">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline !py-2 !px-4 !text-xs flex-1 justify-center whitespace-nowrap"
              >
                <FaGithub className="relative z-10" /> 
                <span className="relative z-10">GitHub</span>
              </a>
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary !py-2 !px-4 !text-xs flex-1 justify-center whitespace-nowrap"
              >
                <span className="relative z-10">Live Demo</span>
                <FaExternalLinkAlt className="relative z-10 text-[10px]" />
              </a>
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

/* ========== Main Export ========== */
export default function Projects() {
  return (
    <section id="projects" className="relative section-padding">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] rounded-full bg-primary/[0.04] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-secondary/[0.04] blur-[120px] pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          variants={textVariant()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <p className="text-text-muted text-sm font-semibold tracking-widest uppercase mb-3">
            What I've Built
          </p>
          <h2 className="section-title gradient-text">Featured Projects</h2>
          <p className="section-subtitle">
            Real-world applications showcasing backend expertise and full-stack capabilities
          </p>
        </motion.div>

        {/* Project Grid */}
        <motion.div
          variants={staggerContainer(0.15)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
