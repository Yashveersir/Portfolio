import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FaArrowRight, FaEnvelope, FaGithub, FaLinkedin, FaReact, FaNodeJs } from 'react-icons/fa';
import { SiMongodb, SiExpress, SiTailwindcss } from 'react-icons/si';
import { typingLines, socialLinks } from '../constants';
import { fadeIn, textVariant } from '../utils/motion';

export default function Hero() {
  const typingSequence = typingLines.flatMap((line) => [line, 2000]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center section-padding pt-28"
    >
      <div className="container-custom relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column - Text Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
            {/* Status badge */}
            <motion.div
              variants={fadeIn('down', 0)}
              initial="hidden"
              animate="show"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-text-muted">Available for opportunities</span>
            </motion.div>

            {/* Name */}
            <motion.h1
              variants={textVariant(0.1)}
              initial="hidden"
              animate="show"
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <span className="text-white">Hi, I'm </span>
              <span className="gradient-text-hero">Yashveer</span>
            </motion.h1>

            {/* Title */}
            <motion.p
              variants={fadeIn('up', 0.2)}
              initial="hidden"
              animate="show"
              className="text-lg sm:text-xl md:text-2xl text-text-muted mb-4 font-medium"
            >
              Full-Stack Developer &nbsp;|&nbsp; MERN &nbsp;|&nbsp; Gen AI
            </motion.p>

            {/* Typing animation */}
            <motion.div
              variants={fadeIn('up', 0.3)}
              initial="hidden"
              animate="show"
              className="h-10 mb-10 flex items-center justify-center lg:justify-start"
            >
              <span className="text-lg sm:text-xl font-mono text-accent flex items-center">
                <span className="mr-3">{'>'}</span>
                <TypeAnimation
                  sequence={typingSequence}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                  className="text-primary-light"
                />
              </span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeIn('up', 0.4)}
              initial="hidden"
              animate="show"
              className="flex flex-wrap gap-4 justify-center lg:justify-start mb-12"
            >
              <a href="#projects" className="btn-primary">
                <span>View Projects</span>
                <FaArrowRight className="relative z-10 text-sm" />
              </a>
              <a href="/Yashveer_Singh_Resume_2026-04-10.pdf" target="_blank" rel="noopener noreferrer" className="btn-outline">
                <FaEnvelope className="hidden" /> {/* Just to keep spacing uniform if needed, or replace icon */}
                <span>Download Resume</span>
              </a>
              <a href="#contact" className="btn-outline border-transparent hover:bg-white/5">
                <span>Contact Me</span>
              </a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              variants={fadeIn('up', 0.5)}
              initial="hidden"
              animate="show"
              className="flex items-center gap-4 justify-center lg:justify-start"
            >
              {[
                { icon: <FaGithub />, href: socialLinks.github, label: 'GitHub' },
                { icon: <FaLinkedin />, href: socialLinks.linkedin, label: 'LinkedIn' },
              ].map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl glass flex items-center justify-center text-text-muted hover:text-white transition-all duration-300 text-lg"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={s.label}
                >
                  {s.icon}
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Prominent Profile Image */}
          <motion.div
            variants={fadeIn('left', 0.3)}
            initial="hidden"
            animate="show"
            className="flex justify-center items-center order-1 lg:order-2"
          >
            <div className="relative w-full max-w-sm aspect-[4/5] group">
              {/* Outer Glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary via-secondary to-accent opacity-30 blur-2xl group-hover:opacity-50 transition-opacity duration-700" />
              
              {/* Image Container */}
              <div className="relative w-full h-full rounded-[2rem] p-1 bg-gradient-to-bl from-white/20 to-white/5 overflow-hidden z-10">
                <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-[#0a0a0a]">
                  <img
                    src="/myImage.jpeg?v=2"
                    alt="Yashveer Singh"
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                </div>
              </div>
              
              {/* Floating Tech Orbits */}
              <motion.div 
                className="absolute top-[10%] -left-8 w-14 h-14 rounded-xl glass border border-white/10 flex items-center justify-center text-[#61dafb] text-3xl z-20 shadow-2xl"
                animate={{ y: [-15, 15, -15], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <FaReact />
              </motion.div>
              
              <motion.div 
                className="absolute top-[20%] -right-8 w-12 h-12 rounded-xl glass border border-white/10 flex items-center justify-center text-[#68a063] text-2xl z-20 shadow-2xl"
                animate={{ y: [10, -10, 10], rotate: [0, -10, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <FaNodeJs />
              </motion.div>

              <motion.div 
                className="absolute bottom-[20%] -left-6 w-12 h-12 rounded-xl glass border border-white/10 flex items-center justify-center text-[#4db33d] text-2xl z-20 shadow-2xl"
                animate={{ y: [-10, 15, -10], rotate: [0, 15, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <SiMongodb />
              </motion.div>

              <motion.div 
                className="absolute bottom-[10%] -right-10 w-16 h-16 rounded-xl glass border border-white/10 flex items-center justify-center text-[#38b2ac] text-3xl z-20 shadow-2xl"
                animate={{ y: [15, -15, 15], rotate: [0, -15, 15, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              >
                <SiTailwindcss />
              </motion.div>
              
              {/* Floating Accents */}
              <motion.div 
                className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br from-primary to-transparent opacity-40 blur-xl"
                animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div 
                className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-gradient-to-tr from-secondary to-transparent opacity-30 blur-2xl"
                animate={{ y: [0, 20, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              />
            </div>
          </motion.div>

        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2 backdrop-blur-sm">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
