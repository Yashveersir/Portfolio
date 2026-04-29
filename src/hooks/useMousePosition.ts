'use client';

import { useCallback } from 'react';
import { useMotionValue } from 'framer-motion';

export function useMousePosition(ref: React.RefObject<HTMLElement | null>) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  }, [ref, x, y]);

  return { mouseX: x, mouseY: y, handleMouseMove };
}
