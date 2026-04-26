'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

/**
 * ScrollReveal — wraps any section with scroll-triggered parallax + fade.
 * Each section gets a different entrance direction for visual variety.
 */
type Direction = 'up' | 'left' | 'right' | 'scale';

interface Props {
  children: React.ReactNode;
  direction?: Direction;
  /** Extra class on wrapper */
  className?: string;
  /** Parallax amount (px) */
  parallax?: number;
}

export default function ScrollReveal({
  children,
  direction = 'up',
  className = '',
  parallax = 40,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Scroll-linked parallax
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const yParallax = useTransform(scrollYProgress, [0, 1], [parallax, -parallax]);

  const variants = {
    hidden: {
      opacity: 0,
      ...(direction === 'up' && { y: 60 }),
      ...(direction === 'left' && { x: -60 }),
      ...(direction === 'right' && { x: 60 }),
      ...(direction === 'scale' && { scale: 0.92 }),
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
    },
  };

  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      style={{ y: yParallax }}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
