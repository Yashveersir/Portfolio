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
    
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
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
          whileHover={{ scale: 1.02 }}
          onClick={(e) => {
            e.preventDefault();
            setMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="relative w-10 h-10 flex items-center justify-center rounded-[10px] bg-dark-100 border border-white/10 group-hover:border-white/30 transition-all duration-300 shadow-md">
            <span className="relative font-heading font-black text-xl text-white tracking-tight drop-shadow-md">
              YS
            </span>
          </div>
          <span className="text-white font-black tracking-tight hidden sm:inline">Yashveer<span className="text-primary-light">.</span></span>
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
          href="/Yashveer-Singh-Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex btn-primary !py-2 !px-5 !text-sm"
        >
          <span>Resume</span>
        </a>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-xl text-text bg-transparent border-none cursor-pointer p-2 z-50"
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 top-[70px] z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setMenuOpen(false)}
            />
            
            {/* Content */}
            <motion.div
              className="relative glass-strong mx-4 mt-2 rounded-2xl overflow-hidden border border-white/10"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <ul className="list-none m-0 p-4 flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <button
                      onClick={() => handleClick(link.id)}
                      className={`w-full text-left px-5 py-4 rounded-xl text-base font-semibold border-none cursor-pointer transition-all duration-200 ${
                        activeSection === link.id
                          ? 'bg-primary/10 text-primary-light'
                          : 'bg-transparent text-text-muted hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      {link.title}
                    </button>
                  </motion.li>
                ))}
                <li className="mt-4 pt-4 border-t border-white/10">
                  <a 
                    href="/Yashveer-Singh-Resume.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-primary w-full justify-center !py-4 !text-base"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>View Resume</span>
                  </a>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
