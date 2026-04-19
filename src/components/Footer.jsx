import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaHeart, FaArrowUp } from 'react-icons/fa';
import { socialLinks } from '../constants';

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative border-t border-white/[0.06]">
      {/* Top gradient line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container-custom py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Brand */}
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
              Y
            </span>
            <div>
              <p className="text-white font-bold text-sm" style={{ fontFamily: 'var(--font-heading)' }}>
                Yashveer Singh
              </p>
              <p className="text-text-dim text-xs">Full-Stack Developer</p>
            </div>
          </div>

          {/* Center: Social */}
          <div className="flex items-center gap-3">
            {[
              { icon: <FaGithub />, href: socialLinks.github, label: 'GitHub' },
              { icon: <FaLinkedin />, href: socialLinks.linkedin, label: 'LinkedIn' },
              { icon: <FaEnvelope />, href: `mailto:${socialLinks.email}`, label: 'Email' },
            ].map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl glass flex items-center justify-center text-text-muted hover:text-white transition-all duration-300"
                whileHover={{ scale: 1.1, y: -2 }}
                aria-label={s.label}
              >
                {s.icon}
              </motion.a>
            ))}
          </div>

          {/* Right: Back to top */}
          <motion.button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-xl glass flex items-center justify-center text-text-muted hover:text-white bg-transparent border-none cursor-pointer transition-all duration-300"
            whileHover={{ scale: 1.1, y: -2 }}
            aria-label="Back to top"
          >
            <FaArrowUp />
          </motion.button>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
          <p className="text-text-dim text-xs flex items-center justify-center gap-1">
            Built with <FaHeart className="text-accent-pink text-[10px]" /> by Yashveer Singh &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
