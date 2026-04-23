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
          <p className="text-text-muted text-sm font-semibold tracking-widest uppercase mb-3">
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
            <div className="glass rounded-2xl card-spacing-lg neon-glow card-hover-lift">
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
                className="glass-strong rounded-xl card-spacing flex items-center gap-5 cursor-default border border-white/5 hover:border-white/20 transition-all duration-500"
                whileHover={{
                  y: -5,
                  x: 5,
                  scale: 1.02,
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-2xl text-white shrink-0 group-hover:scale-110 transition-transform duration-500">
                  {h.icon}
                </div>
                <div className="min-w-0 text-left">
                  <h3
                    className="text-lg font-bold text-white mb-1"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {h.title}
                  </h3>
                  <p className="text-text-muted text-sm font-medium">{h.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
