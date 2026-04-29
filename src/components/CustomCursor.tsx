'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Mouse positions
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring physics for smooth trailing
  const springConfig = { stiffness: 400, damping: 28, mass: 0.5 };
  const trailX = useSpring(mouseX, springConfig);
  const trailY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      const clickable = target.closest('a, button, [role="button"], input, select, textarea');
      const projectCard = target.closest('[data-project-card="true"]');
      const heroHeadline = target.closest('[data-hero-headline="true"]');

      let newIsHovering = false;
      let newCursorText = '';

      if (clickable) {
        newIsHovering = true;
      } else if (projectCard) {
        newIsHovering = true;
        newCursorText = 'VIEW';
      } else if (heroHeadline) {
        newIsHovering = true;
        newCursorText = 'HI';
      }

      // Only update state if something changed to save renders
      setIsHovering((prev) => (prev !== newIsHovering ? newIsHovering : prev));
      setCursorText((prev) => (prev !== newCursorText ? newCursorText : prev));
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY, isMobile]);

  if (!mounted || isMobile) return null;

  return (
    <>
      {/* Primary HUD Point */}
      <motion.div
        className="fixed top-0 left-0 w-1 h-1 bg-[var(--cyan)] z-[9999] pointer-events-none"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* HUD Trailing Crosshair */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none flex items-center justify-center"
        style={{
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
          width: isHovering ? 60 : 32,
          height: isHovering ? 60 : 32,
        }}
      >
        {/* Corner Brackets */}
        {[
          { t: 0, l: 0, r: '0deg' },
          { t: 0, right: 0, r: '90deg' },
          { b: 0, right: 0, r: '180deg' },
          { b: 0, l: 0, r: '270deg' },
        ].map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 border-t border-l border-[var(--cyan)]/60"
            style={{
              top: p.t, left: p.l, right: (p as { right?: number }).right, bottom: (p as { b?: number }).b,
              transform: `rotate(${p.r})`,
            }}
            animate={{
              scale: isHovering ? 1.5 : 1,
              borderColor: isHovering ? 'var(--cyan)' : 'color-mix(in srgb, var(--cyan), transparent 40%)',
            }}
          />
        ))}

        {/* Center Cross Lines */}
        <motion.div 
          className="absolute w-full h-[1px] bg-[var(--cyan)]/10"
          animate={{ scaleX: isHovering ? 1.2 : 0.4 }}
        />
        <motion.div 
          className="absolute h-full w-[1px] bg-[var(--cyan)]/10"
          animate={{ scaleY: isHovering ? 1.2 : 0.4 }}
        />

        <AnimatePresence>
          {cursorText && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -bottom-8 bg-theme-card border border-[var(--cyan)]/30 px-2 py-0.5 backdrop-blur-sm"
            >
              <span className="text-[8px] font-bold tracking-[0.2em] text-[var(--cyan)] uppercase font-mono">
                {cursorText}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Reactive Glow */}
      <motion.div
        className="fixed top-0 left-0 w-48 h-48 rounded-full pointer-events-none z-[9997]"
        style={{
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, color-mix(in srgb, var(--cyan), transparent 90%) 0%, transparent 70%)',
          opacity: isHovering ? 0.3 : 0.1,
        }}
      />
    </>
  );
}
