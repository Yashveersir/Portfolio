import { motion } from 'framer-motion';
import { aboutText } from '../constants';
import { fadeIn, textVariant } from '../utils/motion';
import { FaGraduationCap, FaCode, FaBrain } from 'react-icons/fa';

const highlights = [
  { icon: <FaGraduationCap />, title: '8.6 CGPA', subtitle: 'Computer Science Engineering' },
  { icon: <FaCode />, title: 'MERN Stack', subtitle: 'Full-Stack Development' },
  { icon: <FaBrain />, title: 'Gen AI', subtitle: 'AI Integration Expert' },
];

export default function About() {
  return (
    <section id="about" className="relative section-padding">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          variants={textVariant()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <p className="text-primary-light text-sm font-semibold tracking-widest uppercase mb-3">
            Introduction
          </p>
          <h2 className="section-title gradient-text">About Me</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: About Card */}
          <motion.div
            variants={fadeIn('right', 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="glass rounded-2xl card-spacing-lg neon-glow">
              <p className="text-text-muted leading-relaxed text-lg mb-8">
                {aboutText}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: '3+', label: 'Projects' },
                  { value: '4', label: 'Certifications' },
                  { value: '8.6', label: 'CGPA' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl font-bold gradient-text mb-1">{stat.value}</p>
                    <p className="text-text-dim text-xs font-medium uppercase tracking-wider">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Highlight Cards */}
          <motion.div
            variants={fadeIn('left', 0.4)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-col gap-4"
          >
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                className="glass rounded-xl card-spacing flex items-center gap-5 cursor-default gradient-border"
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 0 30px rgba(99, 102, 241, 0.15)',
                }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl text-primary-light shrink-0">
                  {h.icon}
                </div>
                <div className="min-w-0 text-left">
                  <h3
                    className="text-lg font-bold text-white mb-1"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {h.title}
                  </h3>
                  <p className="text-text-muted text-sm">{h.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
