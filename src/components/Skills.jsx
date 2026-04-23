import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { skillCategories } from '../constants';
import { fadeIn, textVariant, staggerContainer } from '../utils/motion';

export default function Skills() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="skills" className="relative section-padding bg-dots">
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
            My Toolkit
          </p>
          <h2 className="section-title gradient-text">Skills & Technologies</h2>
          <p className="section-subtitle">
            Technologies I use to build scalable, secure applications
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          variants={fadeIn('up', 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {skillCategories.map((cat, i) => (
            <motion.button
              key={cat.title}
              onClick={() => setActiveTab(i)}
              className={`px-6 py-3 rounded-xl font-semibold text-sm border cursor-pointer transition-all duration-300 ${
                activeTab === i
                  ? 'text-white border-transparent'
                  : 'bg-transparent text-text-muted border-white/10 hover:border-white/20 hover:text-white'
              }`}
              style={
                activeTab === i
                  ? {
                      background: `linear-gradient(135deg, ${cat.color}33, ${cat.color}11)`,
                      borderColor: `${cat.color}55`,
                      boxShadow: `0 0 25px ${cat.color}20`,
                    }
                  : {}
              }
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat.title}
            </motion.button>
          ))}
        </motion.div>

        {/* Skill Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={staggerContainer(0.08)}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: 20 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-4xl mx-auto"
          >
            {skillCategories[activeTab].skills.map((skill, i) => (
              <motion.div
                key={skill.name}
                variants={fadeIn('up', i * 0.05)}
                className="glass rounded-2xl card-spacing flex flex-col items-center gap-3 cursor-default group gradient-border card-hover-lift"
                whileHover={{
                  scale: 1.08,
                  boxShadow: `0 0 30px ${skillCategories[activeTab].color}25`,
                }}
              >
                {skill.image ? (
                  <div className="w-16 h-16 rounded-xl bg-white/90 border border-white/30 p-2 flex items-center justify-center shadow-lg">
                    <img
                      src={skill.image}
                      alt={skill.name}
                      className="w-full h-full object-contain transition-all duration-300 group-hover:scale-110 drop-shadow-md"
                    />
                  </div>
                ) : (
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl transition-all duration-300 group-hover:scale-110 shadow-lg border border-white/10 group-hover:border-white/30"
                    style={{
                      background: `${skillCategories[activeTab].color}15`,
                      color: skillCategories[activeTab].color,
                    }}
                  >
                    {skill.icon ? <skill.icon /> : <span className="text-xl font-bold">{skill.name[0]}</span>}
                  </div>
                )}
                <span className="text-sm font-medium text-text-muted group-hover:text-white transition-colors text-center">
                  {skill.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
