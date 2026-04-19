import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { navLinks } from '../constants';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);

      /* Detect active section */
      const sections = navLinks.map((l) => document.getElementById(l.id));
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i] && sections[i].getBoundingClientRect().top <= 120) {
          setActiveSection(navLinks[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'glass-strong py-3' : 'py-5 bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="#"
          className="flex items-center gap-3 text-xl font-bold no-underline group"
          whileHover={{ scale: 1.05 }}
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-[#080808] border border-white/10 group-hover:border-primary/50 transition-colors shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-xl" />
            <span className="relative font-heading font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              YS
            </span>
          </div>
          <span className="gradient-text hidden sm:inline tracking-wide">Yashveer</span>
        </motion.a>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-6 list-none m-0 p-0 lg:gap-8">
          {navLinks.map((link) => (
            <li key={link.id}>
              <button
                onClick={() => handleClick(link.id)}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg border-none cursor-pointer transition-all duration-300 bg-transparent ${
                  activeSection === link.id
                    ? 'text-white'
                    : 'text-text-muted hover:text-white'
                }`}
              >
                {activeSection === link.id && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-lg bg-white/[0.08]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.title}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Resume Button (Desktop) */}
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex btn-primary !py-2 !px-5 !text-sm"
        >
          <span>Resume</span>
        </a>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-xl text-text bg-transparent border-none cursor-pointer p-2"
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden glass-strong mt-2 mx-4 rounded-2xl overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="list-none m-0 p-4 flex flex-col gap-3">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <button
                    onClick={() => handleClick(link.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium border-none cursor-pointer transition-all duration-200 ${
                      activeSection === link.id
                        ? 'bg-white/[0.08] text-white'
                        : 'bg-transparent text-text-muted hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {link.title}
                  </button>
                </motion.li>
              ))}
              <li className="mt-2">
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center !text-sm">
                  <span>View Resume</span>
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
