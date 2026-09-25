import React, { useEffect, useState, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  symbol: string;
  color: string;
  size: number;
  angle: number;
}

export const HeartCursor: React.FC = () => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const isTouchDevice = useRef(false);

  useEffect(() => {
    isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // Check if hovering over clickable element
      const target = e.target as HTMLElement | null;
      if (target && (target.closest('button') || target.closest('a') || target.closest('.cursor-pointer') || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        setIsHoveringClickable(true);
      } else {
        setIsHoveringClickable(false);
      }
    };

    const spawnParticles = (x: number, y: number, count = 5) => {
      const symbols = ['♡', '♥', '✦', '✧', '🌸'];
      const colors = ['#B76E79', '#E8BFC0', '#D48C95', '#C47B85'];
      const newBatch: Particle[] = [];

      for (let i = 0; i < count; i++) {
        newBatch.push({
          id: Date.now() + Math.random(),
          x: x + (Math.random() * 20 - 10),
          y: y + (Math.random() * 20 - 10),
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 14 + Math.random() * 10,
          angle: (Math.random() * 360 * Math.PI) / 180
        });
      }

      setParticles(prev => [...prev.slice(-25), ...newBatch]);

      setTimeout(() => {
        setParticles(prev => prev.filter(p => !newBatch.some(nb => nb.id === p.id)));
      }, 900);
    };

    const handleClick = (e: MouseEvent) => {
      if (isTouchDevice.current) return;
      spawnParticles(e.clientX, e.clientY, 4);
    };

    const handleTouchStart = (e: TouchEvent) => {
      isTouchDevice.current = true;
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        spawnParticles(touch.clientX, touch.clientY, 3);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  return (
    <>
      {/* Desktop Heart Follower */}
      {mousePos && !isTouchDevice.current && (
        <div
          className="fixed pointer-events-none z-50 transition-transform duration-75 ease-out select-none"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            transform: `translate(-50%, -50%) scale(${isHoveringClickable ? 1.35 : 1})`,
          }}
        >
          <span className="text-[#B76E79] text-lg font-bold drop-shadow-[0_1px_2px_rgba(183,110,121,0.3)]">
            {isHoveringClickable ? '♥' : '♡'}
          </span>
        </div>
      )}

      {/* Tap / Click Burst Particles */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute transition-all duration-700 ease-out select-none opacity-0"
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              color: p.color,
              fontSize: `${p.size}px`,
              transform: `translate(${Math.cos(p.angle) * 35}px, ${Math.sin(p.angle) * 35 - 30}px) scale(0.6)`,
              opacity: 0,
              animation: 'burstFade 0.8s ease-out forwards',
            }}
          >
            {p.symbol}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes burstFade {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx, 0px), -40px) scale(0.4);
          }
        }
      `}</style>
    </>
  );
};
