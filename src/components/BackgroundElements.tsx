import React from 'react';

export const BackgroundElements: React.FC = () => {
  // A subtle set of floating romantic symbols (hearts, sparkles, tiny flowers)
  const floatingItems = [
    { text: '♡', left: '8%', top: '15%', size: 'text-sm', delay: '0s', duration: '7s' },
    { text: '✦', left: '92%', top: '22%', size: 'text-xs', delay: '1.5s', duration: '9s' },
    { text: '🌸', left: '85%', top: '65%', size: 'text-xs', delay: '3s', duration: '8s' },
    { text: '♥', left: '12%', top: '78%', size: 'text-xs', delay: '2s', duration: '10s' },
    { text: '✨', left: '78%', top: '42%', size: 'text-xs', delay: '0.8s', duration: '11s' },
    { text: '♡', left: '6%', top: '48%', size: 'text-base', delay: '2.5s', duration: '8.5s' },
    { text: '✦', left: '48%', top: '90%', size: 'text-xs', delay: '4s', duration: '7.5s' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Paper texture overlay */}
      <div className="absolute inset-0 paper-texture opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFF9F5]/40 via-transparent to-[#F7EDEB]/40 pointer-events-none" />

      {/* Floating gentle particles */}
      {floatingItems.map((item, i) => (
        <div
          key={i}
          className={`absolute text-[#B76E79]/25 select-none ${item.size} animate-float-particle`}
          style={{
            left: item.left,
            top: item.top,
            animationDelay: item.delay,
            animationDuration: item.duration,
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
};
