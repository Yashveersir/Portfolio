import { useState, useRef } from 'react';
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

            {/* Description */}
            <p className="text-text-muted text-sm leading-relaxed mb-5">
              {project.description}
            </p>

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
                    className="text-text-dim text-xs py-1 pl-4 relative before:content-['▹'] before:absolute before:left-0 before:text-primary-light"
                  >
                    {f}
                  </li>
                ))}
              </motion.ul>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
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

            {/* Action Buttons */}
            <div className="flex gap-3 mt-auto">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline !py-2 !px-4 !text-xs flex-1 justify-center whitespace-nowrap"
              >
                <FaGithub /> GitHub
              </a>
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary !py-2 !px-4 !text-xs flex-1 justify-center whitespace-nowrap"
              >
                <span>Live Demo</span>
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
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] rounded-full bg-primary/[0.04] blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-secondary/[0.04] blur-[120px]" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          variants={textVariant()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <p className="text-primary-light text-sm font-semibold tracking-widest uppercase mb-3">
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
