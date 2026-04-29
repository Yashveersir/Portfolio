'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-[var(--cyan)] origin-left z-[100] shadow-[0_0_10px_var(--cyan)]"
      style={{ scaleX, opacity: 0.8 }}
      suppressHydrationWarning
    />
  );
}
