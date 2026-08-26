'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

/*
 * CustomCursor — Frosted Glass Lens
 * Turns the cursor into a tiny magnifying glass with a glowing core.
 */
export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  const springCfg = { stiffness: 400, damping: 28, mass: 0.5 };
  const trailX = useSpring(mouseX, springCfg);
  const trailY = useSpring(mouseY, springCfg);

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
      const clickable  = target.closest('a, button, [role="button"], input, select, textarea');
      const projectCard = target.closest('[data-project-card="true"]');

      if (projectCard) {
        setIsHovering(true);
        setCursorText('VIEW');
      } else if (clickable) {
        setIsHovering(true);
        setCursorText('');
      } else {
        setIsHovering(false);
        setCursorText('');
      }
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
      {/* Exact glowing core — follows mouse precisely */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-[var(--cyan)]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          width: 5,
          height: 5,
          boxShadow: '0 0 10px rgba(34, 211, 238, 0.8), 0 0 20px rgba(34, 211, 238, 0.4)',
        }}
        animate={{
          scale: isHovering ? 0 : 1, // Core disappears when hovering over a button
          opacity: isHovering ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Frosted Glass Lens — spring physics trailing ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full flex items-center justify-center overflow-hidden"
        style={{
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovering ? 64 : 32,
          height: isHovering ? 64 : 32,
          // Use highly performant simple opacity/border changes
          backgroundColor: isHovering ? 'rgba(34, 211, 238, 0.1)' : 'rgba(255, 255, 255, 0.05)',
          border: isHovering ? '1px solid rgba(34, 211, 238, 0.3)' : '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: isHovering ? '0 0 20px rgba(34, 211, 238, 0.2)' : 'none',
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <AnimatePresence>
          {cursorText && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center text-[9px] font-black tracking-[0.2em] uppercase"
              style={{ 
                fontFamily: 'var(--font-mono)', 
                whiteSpace: 'nowrap',
                color: 'var(--cyan)'
              }}
            >
              {cursorText}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
