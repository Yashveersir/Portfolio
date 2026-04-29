'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * Falling-character split heading with spring bounce.
 * Hydration-safe: Animations only trigger after mounting.
 */
export default function CharSplitHeading({ 
  text, 
  className = "",
  fontSize = 'clamp(2.4rem, 5vw, 4rem)',
  lineHeight = 1
}: { 
  text: string;
  className?: string;
  fontSize?: string;
  lineHeight?: number | string;
}) {
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.h2
      ref={ref}
      initial="hidden"
      animate={mounted && isInView ? "visible" : "hidden"}
      className={`flex flex-wrap overflow-hidden ${className}`}
      aria-label={text}
      style={{
        fontFamily: 'var(--font-syne)',
        fontWeight: 900,
        fontSize,
        lineHeight,
        letterSpacing: '-0.03em',
      }}
    >
      {text.split(' ').map((word, wIdx, words) => {
        const prevChars = words.slice(0, wIdx).join('').length + wIdx;
        return (
          <span key={wIdx} className="inline-block mr-[0.3em] whitespace-nowrap">
            {word.split('').map((char, cIdx) => {
              const i = prevChars + cIdx;
              return (
                <motion.span
                  key={cIdx}
                  custom={i}
                  variants={{
                    hidden: { y: -60, opacity: 0, rotate: -8 },
                    visible: { 
                      y: 0, 
                      opacity: 1, 
                      rotate: 0, 
                      transition: { 
                        type: 'spring', 
                        stiffness: 200, 
                        damping: 12, 
                        delay: i * 0.04 
                      } 
                    }
                  }}
                  style={{ display: 'inline-block' }}
                  aria-hidden="true"
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
        );
      })}
    </motion.h2>
  );
}
