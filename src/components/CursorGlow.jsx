import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const glowRef = useRef(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    let x = 0, y = 0;
    let targetX = 0, targetY = 0;
    let animId;

    const move = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      x += (targetX - x) * 0.12;
      y += (targetY - y) * 0.12;
      glow.style.left = `${x}px`;
      glow.style.top = `${y}px`;
      animId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', move);
    animId = requestAnimationFrame(animate);

    /* Hide on mobile */
    const mql = window.matchMedia('(max-width: 768px)');
    const handleMql = (e) => { glow.style.display = e.matches ? 'none' : 'block'; };
    handleMql(mql);
    mql.addEventListener('change', handleMql);

    return () => {
      window.removeEventListener('mousemove', move);
      mql.removeEventListener('change', handleMql);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <div ref={glowRef} className="cursor-glow" />;
}
