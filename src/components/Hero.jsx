import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FaArrowRight, FaDownload, FaGithub, FaLinkedin, FaReact, FaNodeJs } from 'react-icons/fa';
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
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1 relative">
            {/* Background glowing orb for text */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary opacity-10 rounded-full blur-[100px] pointer-events-none" />

            {/* Status badge */}
            <motion.div
              variants={fadeIn('down', 0)}
              initial="hidden"
              animate="show"
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 text-sm group cursor-default"
            >
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </div>
              <span className="text-text-muted font-medium tracking-wide group-hover:text-white transition-colors">Available for Opportunities</span>
            </motion.div>

            {/* Name */}
            <motion.h1
              variants={textVariant(0.1)}
              initial="hidden"
              animate="show"
              className="text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-black mb-4 leading-[1.05] tracking-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <span className="text-white drop-shadow-sm">HI, I'M </span>
              <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent animate-gradient bg-[length:200%_auto] pb-2 drop-shadow-md">YASHVEER</span>
            </motion.h1>

            {/* Futuristic divider */}
            <motion.div
               variants={fadeIn('up', 0.2)}
               initial="hidden"
               animate="show"
               className="w-2/3 max-w-sm h-[2px] bg-gradient-to-r from-secondary via-primary to-transparent my-6 opacity-80"
            />

            {/* Typing animation */}
            <motion.div
              variants={fadeIn('up', 0.3)}
              initial="hidden"
              animate="show"
              className="h-16 mb-12 flex items-center justify-center lg:justify-start w-full"
            >
              <span className="text-xl sm:text-2xl md:text-3xl font-body flex items-center">
                <TypeAnimation
                  sequence={typingSequence}
                  wrapper="span"
                  speed={60}
                  repeat={Infinity}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary animate-gradient bg-[length:200%_auto] font-semibold tracking-wide drop-shadow-[0_0_10px_rgba(0,223,216,0.3)]"
                  cursor={true}
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
              <a href="/Yashveer-Singh-Resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-outline">
                <FaDownload />
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
            style={{ perspective: '1500px' }}
          >
            <div 
              className="relative w-full max-w-sm aspect-[4/5] group transition-all duration-1000 ease-out hover:!transform-none"
              style={{ transform: 'rotateY(-15deg) rotateX(10deg)', transformStyle: 'preserve-3d' }}
            >
              {/* Deep 3D Shadow Backdrop */}
              <div 
                className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-[2rem] opacity-30 blur-[40px] transition-all duration-1000 group-hover:opacity-50 group-hover:blur-[50px]"
                style={{ transform: 'translateZ(-50px) translate(20px, 20px)' }}
              />
              
              {/* Thick 3D Frame Base */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/80 rounded-[2rem]"
                style={{ transform: 'translateZ(-10px)' }}
              />
              
              {/* Image Container */}
              <div 
                className="relative w-full h-full rounded-[2rem] p-[2px] bg-gradient-to-br from-white/40 via-white/5 to-white/10 overflow-hidden z-10 shadow-2xl"
                style={{ transform: 'translateZ(0px)', transformStyle: 'preserve-3d' }}
              >
                <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-[#0a0a0a]">
                  <img
                    src="/myImage.jpeg?v=2"
                    alt="Yashveer Singh"
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-700"
                  />
                </div>
              </div>
              
              {/* Floating Tech Orbits */}
              <motion.div 
                className="absolute top-[10%] -left-8 w-14 h-14 rounded-xl glass border border-white/10 flex items-center justify-center text-[#61dafb] text-3xl z-20 shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                animate={{ y: [-15, 15, -15], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transform: 'translateZ(80px)' }}
              >
                <FaReact />
              </motion.div>
              
              <motion.div 
                className="absolute top-[20%] -right-8 w-12 h-12 rounded-xl glass border border-white/10 flex items-center justify-center text-[#68a063] text-2xl z-20 shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                animate={{ y: [10, -10, 10], rotate: [0, -10, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                style={{ transform: 'translateZ(60px)' }}
              >
                <FaNodeJs />
              </motion.div>

              <motion.div 
                className="absolute bottom-[20%] -left-6 w-12 h-12 rounded-xl glass border border-white/10 flex items-center justify-center text-[#4db33d] text-2xl z-20 shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                animate={{ y: [-10, 15, -10], rotate: [0, 15, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                style={{ transform: 'translateZ(40px)' }}
              >
                <SiMongodb />
              </motion.div>

              <motion.div 
                className="absolute bottom-[10%] -right-10 w-16 h-16 rounded-xl glass border border-white/10 flex items-center justify-center text-[#38b2ac] text-3xl z-20 shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                animate={{ y: [15, -15, 15], rotate: [0, -15, 15, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                style={{ transform: 'translateZ(90px)' }}
              >
                <SiTailwindcss />
              </motion.div>
              
              {/* Floating Accents */}
              <motion.div 
                className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br from-primary to-transparent opacity-40 blur-xl pointer-events-none"
                animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div 
                className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-gradient-to-tr from-secondary to-transparent opacity-30 blur-2xl pointer-events-none"
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
