import React from 'react';
import { triggerHeartConfetti } from '../utils/confetti';

export const FinalFooter: React.FC = () => {
  const handleHeartClick = () => {
    triggerHeartConfetti(0.5, 0.9);
  };

  return (
    <footer className="w-full max-w-lg mx-auto pt-14 pb-16 px-6 text-center select-none">
      {/* Decorative floral divider */}
      <div className="flex items-center justify-center gap-3 text-[#B76E79]/40 mb-8">
        <span className="h-px w-12 bg-[#F3D6D0]" />
        <span className="text-xs">🌸</span>
        <button
          onClick={handleHeartClick}
          className="text-sm text-[#B76E79] hover:scale-125 transition-transform cursor-pointer"
        >
          ♡
        </button>
        <span className="text-xs">🌸</span>
        <span className="h-px w-12 bg-[#F3D6D0]" />
      </div>

      <p className="font-serif-elegant italic text-base text-[#817777] mb-1">
        That's all for now...
      </p>

      <h3 className="font-script text-3xl sm:text-4xl text-[#2B2525] mb-3">
        Happy Birthday, My Love ♡
      </h3>

      <p className="font-serif-elegant italic text-xs sm:text-sm text-[#817777] max-w-xs mx-auto leading-relaxed mb-6">
        "Maybe this isn't the biggest gift, but I hope it becomes a little memory you'll keep."
      </p>

      <p className="font-script text-2xl text-[#B76E79] mb-4">
        Made with love ♡
      </p>

      <div className="text-[11px] text-[#817777]/70 font-body">
        Made by <span className="font-medium text-[#B76E79]">Nizam DzR.Dev</span>
      </div>
    </footer>
  );
};
