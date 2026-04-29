'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * Falling-character split heading with spring bounce.
 * Shared across About, Skills, Experience, and Contact sections.
 */
export default function CharSplitHeading({ text }: { text: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.h2
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="flex flex-wrap overflow-hidden"
      aria-label={text}
      style={{
        fontFamily: 'var(--font-syne)',
        fontWeight: 900,
        fontSize: 'clamp(2.4rem, 5vw, 4rem)',
        lineHeight: 1,
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
                    visible: { y: 0, opacity: 1, rotate: 0, transition: { type: 'spring', stiffness: 200, damping: 12, delay: i * 0.04 } }
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
