'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView, useReducedMotion } from 'framer-motion';

/**
 * ScrollReveal — wraps any section with scroll-triggered entrance.
 * Respects prefers-reduced-motion for accessibility.
 */
type Direction = 'up' | 'left' | 'right' | 'scale';

interface Props {
  children: React.ReactNode;
  direction?: Direction;
  className?: string;
  parallax?: number;
}

export default function ScrollReveal({
  children,
  direction = 'up',
  className = '',
  parallax = 30,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const yParallax = useTransform(scrollYProgress, [0, 1], [prefersReduced ? 0 : parallax, prefersReduced ? 0 : -parallax]);

  if (prefersReduced) {
    // No animation — just render children directly
    return <div className={className}>{children}</div>;
  }

  const variants = {
    hidden: {
      opacity: 0,
      ...(direction === 'up'    && { y: 50 }),
      ...(direction === 'left'  && { x: -50 }),
      ...(direction === 'right' && { x: 50 }),
      ...(direction === 'scale' && { scale: 0.94 }),
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
    },
  };

  return (
    <motion.div
      ref={ref}
      style={{ y: yParallax }}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
