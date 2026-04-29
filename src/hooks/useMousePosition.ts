'use client';

import { useState, useCallback } from 'react';

export function useMousePosition(ref: React.RefObject<HTMLElement | null>) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, [ref]);

  return { mousePos, handleMouseMove };
}
