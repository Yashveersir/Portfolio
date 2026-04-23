import { motion } from 'framer-motion';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { experiences } from '../constants';
import { textVariant } from '../utils/motion';

export default function Experience() {
  return (
    <section id="experience" className="relative section-padding">
      {/* Background glow */}
      <div className="absolute top-1/3 right-0 w-[300px] h-[300px] rounded-full bg-secondary/[0.04] blur-[100px]" />

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
            Leadership & Service
          </p>
          <h2 className="section-title gradient-text">Experience</h2>
          <p className="section-subtitle">
            Roles where I built leadership, communication, and community impact
          </p>
        </motion.div>

        {/* Timeline */}
        <VerticalTimeline lineColor="rgba(99, 102, 241, 0.2)">
          {experiences.map((exp) => (
            <VerticalTimelineElement
              key={exp.title}
              date={exp.date}
              dateClassName="text-text-muted !font-medium"
              icon={
                <div className="w-full h-full flex items-center justify-center text-xl bg-dark-200 rounded-full">
                  {exp.icon}
                </div>
              }
              iconStyle={{
                background: '#0a0a2e',
                border: `3px solid ${exp.color}`,
                boxShadow: `0 0 20px ${exp.color}40`,
              }}
              contentStyle={{
                background: 'rgba(15, 15, 40, 0.6)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(99, 102, 241, 0.15)',
                borderRadius: '16px',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
                padding: '1.5rem 2rem',
              }}
              contentArrowStyle={{
                borderRight: `7px solid ${exp.color}40`,
              }}
            >
              <h3
                className="text-lg font-bold text-white mb-1"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {exp.title}
              </h3>
              <h4 className="text-sm font-semibold mb-3" style={{ color: exp.color }}>
                {exp.organization}
              </h4>
              <p className="text-text-muted text-sm leading-relaxed m-0">
                {exp.description}
              </p>
              {exp.achievements?.length > 0 && (
                <ul className="mt-3 mb-0 pl-4">
                  {exp.achievements.map((achievement) => (
                    <li key={achievement} className="text-text-dim text-xs leading-relaxed mb-1">
                      {achievement}
                    </li>
                  ))}
                </ul>
              )}
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </div>
    </section>
  );
}
