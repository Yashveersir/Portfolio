'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);

  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const scale = useRef(1);
  
  const isHoverRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // First effect: mark as mounted (avoids hydration mismatch)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const mobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
    setIsMobile(mobile);
    if (mobile) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };

      const target = e.target as HTMLElement | null;
      if (!target) return;
      
      // Check if hovering over clickable elements
      const isPointer = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') !== null ||
        target.closest('button') !== null;
      
      isHoverRef.current = isPointer;
    };

    let raf: number;
    const animate = () => {
      if (document.visibilityState === 'hidden') {
        raf = requestAnimationFrame(animate);
        return;
      }

      // Lerp ring position (smooth trailing)
      const dx = pos.current.x - ringPos.current.x;
      const dy = pos.current.y - ringPos.current.y;
      
      // Slightly increased lerp factor for tighter, more responsive tracking
      ringPos.current.x += dx * 0.2;
      ringPos.current.y += dy * 0.2;

      // Lerp scale for hover effect
      const targetScale = isHoverRef.current ? 1.6 : 1;
      scale.current += (targetScale - scale.current) * 0.2;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) scale(${scale.current})`;
      }

      raf = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [mounted]);

  // Server and initial client render: return null (matches on both sides)
  if (!mounted || isMobile) return null;

  return (
    <div
      ref={ringRef}
      className="pointer-events-none fixed top-0 left-0 z-[9998] w-8 h-8 rounded-full border border-cyan-400/30"
      suppressHydrationWarning
      style={{
        willChange: 'transform',
        marginLeft: '-16px', // Center offset
        marginTop: '-16px',
      }}
    />
  );
}
