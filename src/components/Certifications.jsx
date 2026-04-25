import { motion } from 'framer-motion';
import { certifications } from '../constants';
import { fadeIn, textVariant, staggerContainer } from '../utils/motion';
import { FaCertificate, FaExternalLinkAlt } from 'react-icons/fa';

export default function Certifications() {
  return (
    <section id="certifications" className="relative section-padding bg-dots">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          variants={textVariant()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-4"
        >
          <p className="text-text-muted text-sm font-semibold tracking-widest uppercase mb-3">
            Credentials
          </p>
          <h2 className="section-title gradient-text">Certifications</h2>
          <p className="section-subtitle">
            {certifications.length} professional certifications in AI, ML, and modern development
          </p>
        </motion.div>

        {/* Count Badge */}
        <motion.div
          variants={fadeIn('up', 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex items-center gap-4 glass rounded-full px-6 py-2">
            {[
              { label: 'IBM', count: certifications.filter(c => c.issuer.includes('IBM')).length, color: '#22d3ee' },
              { label: 'Google', count: certifications.filter(c => c.issuer.includes('Google')).length, color: '#a855f7' },
              { label: 'Courses', count: certifications.filter(c => c.issuer === 'Certified Course').length, color: '#ec4899' },
              { label: 'Anthropic', count: certifications.filter(c => c.issuer === 'Anthropic').length, color: '#6366f1' },
            ].map((g) => (
              <span key={g.label} className="flex items-center gap-1.5 text-xs font-medium text-text-muted">
                <span className="w-2 h-2 rounded-full" style={{ background: g.color }} />
                {g.label} ({g.count})
              </span>
            ))}
          </div>
        </motion.div>

        {/* ALL Certification Cards */}
        <motion.div
          variants={staggerContainer(0.06)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.05 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto"
        >
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.title}
              variants={fadeIn('up', i * 0.04)}
              className="glass rounded-2xl card-spacing cursor-default group gradient-border relative overflow-hidden card-hover-lift"
              whileHover={{
                scale: 1.03,
                boxShadow: `0 0 35px ${cert.color}20`,
              }}
            >
              {/* Glow circle */}
              <div
                className="absolute -top-8 -right-8 w-20 h-20 rounded-full blur-[35px] opacity-15 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none"
                style={{ background: cert.color }}
              />

              <div className="flex items-start gap-4 relative">
                {/* Icon */}
                <div className="text-3xl shrink-0 mt-0.5">{cert.icon}</div>

                <div className="flex-1 min-w-0">
                  {/* Issuer Badge */}
                  <div
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2"
                    style={{
                      background: `${cert.color}15`,
                      color: cert.color,
                      border: `1px solid ${cert.color}30`,
                    }}
                  >
                    <FaCertificate className="text-[8px]" /> {cert.issuer}
                  </div>

                  {/* Title */}
                  <h3
                    className="text-sm font-bold text-white leading-snug mb-3"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {cert.title}
                  </h3>

                  {/* View Button */}
                  {cert.pdf && (
                    <a
                      href={cert.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold no-underline transition-all duration-300 opacity-60 group-hover:opacity-100"
                      style={{ color: cert.color }}
                    >
                      View Certificate <FaExternalLinkAlt className="text-[9px]" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
