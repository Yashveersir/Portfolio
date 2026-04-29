'use client';

import { motion } from 'framer-motion';

const ARSENAL = [
  {
    category: 'Software Stack',
    items: ['Next.js', 'React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Framer Motion', 'GSAP'],
  },
  {
    category: 'AI Tools',
    items: ['Gemini Pro', 'OpenAI API', 'LangChain', 'Hugging Face', 'Claude', 'Midjourney'],
  },
  {
    category: 'Development Gear',
    items: ['VS Code', 'Git', 'Docker', 'Vercel', 'Postman', 'Figma', 'Windows Subsystem for Linux (WSL)'],
  },
];

export default function Arsenal() {
  return (
    <section id="arsenal" className="relative py-28 md:py-40 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-start gap-12 mb-20">
          <div className="w-full md:w-1/3">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[10px] uppercase tracking-[0.5em] text-cyan-400 mb-4"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              / ARSENAL
            </motion.p>
            <h2
              className="text-4xl md:text-6xl font-black text-theme"
              style={{ fontFamily: 'var(--font-syne)', letterSpacing: '-0.04em' }}
            >
              My Tools
            </h2>
            <p className="mt-6 text-sm text-theme-muted max-w-xs leading-relaxed" style={{ fontFamily: 'var(--font-mono)' }}>
              A curated collection of the technologies and tools I use to bring ideas to life.
            </p>
          </div>

          <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-12">
            {ARSENAL.map((group, i) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <h3
                  className="text-xs uppercase tracking-widest font-bold text-theme mb-6 flex items-center gap-3"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  {group.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1.5 border border-theme bg-theme-card text-[10px] uppercase tracking-widest text-theme-dim hover:border-cyan-400/30 hover:text-cyan-400 transition-all duration-300"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
