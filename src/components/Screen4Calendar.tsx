import React from 'react';
import { motion } from 'motion/react';
import { triggerHeartConfetti } from '../utils/confetti';

interface Props {
  onContinue: () => void;
}

export const Screen4Calendar: React.FC<Props> = ({ onContinue }) => {
  // September 2026
  // Sep 1, 2026 is Tuesday (Sun=0, Mon=1, Tue=2)
  // Total days = 30
  const daysInMonth = 30;
  const startDayOfWeek = 2; // Tuesday
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const emptyCells = Array.from({ length: startDayOfWeek });
  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleHeartClick = () => {
    triggerHeartConfetti(0.5, 0.45);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-4 py-10 select-none">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-md w-full flex flex-col items-center"
      >
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="font-serif-elegant italic text-3xl sm:text-4xl text-[#2B2525]">
            Save This Day
          </h2>
          <p className="font-body text-xs sm:text-sm text-[#817777] mt-1 font-medium">
            Your Special Day ♡
          </p>
        </div>

        {/* Vintage Scrapbook Calendar Card */}
        <div className="relative w-full max-w-[340px] bg-[#FFFDFB] paper-texture p-6 pt-7 rounded-3xl border border-[#F3D6D0] shadow-[0_12px_32px_rgba(183,110,121,0.12)]">
          {/* Scrapbook Tape Top */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 h-7 washi-tape rotate-[-1deg] rounded-xs shadow-xs flex items-center justify-center">
            <span className="text-[10px] tracking-widest text-[#817777]/80 font-serif-elegant italic">
              SPECIAL MEMORY
            </span>
          </div>

          {/* Paper Clip on corner */}
          <div className="absolute -top-2 -right-1 text-2xl rotate-12 z-20 opacity-85">
            📎
          </div>

          {/* Tiny Flower */}
          <div className="absolute -bottom-2 -left-2 text-2xl rotate-[-15deg] z-20">
            🌸
          </div>

          {/* Small star */}
          <div className="absolute top-10 -right-2 text-sm text-[#B76E79] rotate-45 z-20">
            ✦
          </div>

          {/* Calendar Header */}
          <div className="flex items-center justify-between border-b border-[#F3D6D0] pb-3 mb-4">
            <div>
              <span className="font-serif-elegant tracking-widest text-xs text-[#817777] uppercase block">
                2026
              </span>
              <span className="font-script text-3xl sm:text-4xl text-[#2B2525] leading-none">
                September
              </span>
            </div>

            {/* Handwritten "my love" */}
            <div className="text-right">
              <span className="font-script text-2xl text-[#B76E79] block -rotate-6">
                my love ♡
              </span>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {daysOfWeek.map((day, idx) => (
              <span
                key={idx}
                className="text-xs font-semibold text-[#817777] font-body py-1"
              >
                {day}
              </span>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {emptyCells.map((_, i) => (
              <div key={`empty-${i}`} className="h-9" />
            ))}

            {dayNumbers.map((day) => {
              const isBirthday = day === 26;

              return (
                <div
                  key={day}
                  className="h-9 flex items-center justify-center relative"
                >
                  {isBirthday ? (
                    <motion.button
                      onClick={handleHeartClick}
                      whileTap={{ scale: 0.9 }}
                      className="relative w-9 h-9 rounded-full flex flex-col items-center justify-center cursor-pointer group"
                      title="Happy Birthday 26 September!"
                    >
                      {/* Pulsing heart background & soft glow */}
                      <div className="absolute inset-0 bg-[#B76E79] rounded-full shadow-[0_0_15px_rgba(183,110,121,0.65)] animate-soft-pulse" />
                      
                      {/* Heart outline icon */}
                      <span className="relative z-10 text-white font-bold text-xs font-body">
                        26
                      </span>
                      <span className="relative z-10 text-[9px] text-white/90 leading-none -mt-0.5">
                        ♥
                      </span>
                    </motion.button>
                  ) : (
                    <span className="text-xs text-[#2B2525]/80 font-body font-medium">
                      {day}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Caption underneath */}
          <div className="mt-5 pt-3 border-t border-[#F3D6D0]/60 text-center">
            <p className="font-serif-elegant italic text-xs sm:text-sm text-[#817777] leading-relaxed">
              "the day someone very special came into this world ♡"
            </p>
          </div>
        </div>

        {/* Continue to Photos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <button
            onClick={onContinue}
            className="font-script text-3xl sm:text-4xl text-[#B76E79] hover:text-[#2B2525] transition-all hover:scale-105 cursor-pointer underline decoration-[#E8BFC0] underline-offset-8"
          >
            See Our Photos →
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};
