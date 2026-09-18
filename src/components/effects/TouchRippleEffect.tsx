import React, { useEffect, useRef } from 'react';

export const TouchRippleEffect: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const ripple = document.createElement('span');
      ripple.className = 'absolute w-20 h-20 -ml-10 -mt-10 rounded-full bg-blue-400/25 border border-blue-400/35 animate-ripple pointer-events-none';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;

      container.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 550);
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-50 overflow-hidden" />;
};
