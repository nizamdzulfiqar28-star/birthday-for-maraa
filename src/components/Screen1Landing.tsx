import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CONFIG, ELEGANT_PLACEHOLDERS } from '../config';
import { soundSystem } from '../utils/audio';
import { triggerHeartConfetti } from '../utils/confetti';

interface Props {
  onOpen: () => void;
  onSecretTrigger: () => void;
}

export const Screen1Landing: React.FC<Props> = ({ onOpen, onSecretTrigger }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [heartTapCount, setHeartTapCount] = useState(0);
  const [photoSrc, setPhotoSrc] = useState(CONFIG.heroPhoto || ELEGANT_PLACEHOLDERS.hero);

  const handleHeartClick = () => {
    const next = heartTapCount + 1;
    setHeartTapCount(next);
    triggerHeartConfetti(0.5, 0.4);
    if (next >= 5) {
      setHeartTapCount(0);
      onSecretTrigger();
    }
  };

  const handleEnvelopeClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    soundSystem.playRomanticChime(587.33, 0.5, 0.1);
    soundSystem.play(); // trigger audio start
    triggerHeartConfetti(0.5, 0.7);

    setTimeout(() => {
      onOpen();
    }, 850);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-between py-10 px-5 text-center select-none">
      {/* Top Header / Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="pt-4 flex flex-col items-center"
      >
        <button
          onClick={handleHeartClick}
          title="♡"
          className="text-2xl text-[#B76E79] mb-1 animate-soft-pulse cursor-pointer hover:scale-125 transition-transform"
        >
          ♡
        </button>

        <h1 className="font-script text-5xl sm:text-6xl text-[#2B2525] leading-tight">
          Happy Birthday
        </h1>
        <h2 className="font-serif-elegant italic text-3xl sm:text-4xl text-[#B76E79] tracking-wide -mt-2">
          My Love
        </h2>

        <p className="font-body text-xs sm:text-sm text-[#817777] mt-2 font-medium tracking-wider">
          something little, made with a lot of love...
        </p>
      </motion.div>

      {/* Center: Heart Frame Photo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
        animate={{ opacity: 1, scale: 1, rotate: -2 }}
        transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
        className="relative my-6"
      >
        {/* Scrapbook washi tape top */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-7 washi-tape rotate-[-2deg] z-20 rounded-xs flex items-center justify-center">
          <span className="text-[10px] text-[#817777]/70 font-body">for {CONFIG.girlfriendName}</span>
        </div>

        {/* Handmade Scrapbook Heart Frame Container */}
        <div className="relative p-4 pb-6 bg-[#FFFDFB] rounded-2xl shadow-[0_8px_24px_rgba(183,110,121,0.14)] border border-[#F3D6D0]/80">
          {/* Heart mask container */}
          <div className="relative w-52 h-52 sm:w-60 sm:h-60 overflow-hidden flex items-center justify-center">
            {/* SVG Heart clip path definition */}
            <svg className="w-0 h-0 absolute">
              <defs>
                <clipPath id="heartClip" clipPathUnits="objectBoundingBox">
                  <path d="M0.5,0.88 C0.2,0.65,0,0.45,0,0.28 C0,0.12,0.12,0,0.28,0 C0.38,0,0.46,0.06,0.5,0.14 C0.54,0.06,0.62,0,0.72,0 C0.88,0,1,0.12,1,0.28 C1,0.45,0.8,0.65,0.5,0.88 Z" />
                </clipPath>
              </defs>
            </svg>

            {/* Heart shaped photo with fallback */}
            <div
              className="w-full h-full relative"
              style={{ clipPath: 'url(#heartClip)' }}
            >
              <img
                src={photoSrc}
                alt={`Photo of ${CONFIG.girlfriendName}`}
                onError={() => setPhotoSrc(ELEGANT_PLACEHOLDERS.hero)}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Subtle romantic frame border overlay */}
            <svg
              viewBox="0 0 100 90"
              className="absolute inset-0 w-full h-full pointer-events-none stroke-[#E8BFC0] fill-none stroke-[2.5]"
            >
              <path d="M50,86 C20,63,0,44,0,27 C0,12,12,0,28,0 C38,0,46,6,50,14 C54,6,62,0,72,0 C88,0,100,12,100,27 C100,44,80,63,50,86 Z" />
            </svg>
          </div>

          {/* Tiny handwritten tag underneath */}
          <p className="font-script text-2xl text-[#817777] mt-3">
            {CONFIG.girlfriendName} ♡
          </p>
        </div>

        {/* Small scrapbook decorative stickers */}
        <div className="absolute -bottom-2 -left-2 text-xl rotate-[-12deg] z-20">🌸</div>
        <div className="absolute -top-1 -right-2 text-sm text-[#B76E79] rotate-[15deg] z-20">✦</div>
      </motion.div>

      {/* Bottom: Love Letter Envelope Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
        className="pb-6 flex flex-col items-center"
      >
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onClick={handleEnvelopeClick}
          className="group relative cursor-pointer flex flex-col items-center"
        >
          {/* Subtle floating hearts on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: -24 }}
                exit={{ opacity: 0 }}
                className="absolute -top-7 text-sm text-[#B76E79] flex gap-2 pointer-events-none"
              >
                <span>♡</span>
                <span className="text-xs mt-1">♥</span>
                <span>♡</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Envelope Graphic */}
          <div
            className={`relative w-28 h-20 bg-[#F7EDEB] border-2 border-[#E8BFC0] rounded-lg shadow-md transition-all duration-300 flex items-center justify-center ${
              isHovered ? 'shadow-[0_8px_20px_rgba(183,110,121,0.25)] -translate-y-1' : ''
            } ${isOpening ? 'scale-110' : ''}`}
          >
            {/* Flap */}
            <div
              className={`absolute top-0 left-0 right-0 h-0 border-l-[54px] border-l-transparent border-r-[54px] border-r-transparent border-t-[42px] transition-transform duration-500 origin-top ${
                isOpening || isHovered ? '-rotate-180 border-t-[#F3D6D0]' : 'border-t-[#E8BFC0]'
              }`}
            />

            {/* Heart seal */}
            <div className="relative z-10 w-7 h-7 rounded-full bg-[#FFF9F5] border border-[#E8BFC0] flex items-center justify-center shadow-xs">
              <span className="text-[#B76E79] text-sm animate-soft-pulse">♡</span>
            </div>

            {/* Subtle letter sticking out when opening */}
            {isOpening && (
              <motion.div
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: -25, opacity: 1 }}
                className="absolute w-20 h-14 bg-white border border-[#F3D6D0] rounded-xs shadow-xs z-5"
              />
            )}
          </div>

          {/* Open text label */}
          <span className="mt-3 font-serif-elegant italic tracking-widest text-sm text-[#B76E79] group-hover:text-[#2B2525] transition-colors flex items-center gap-1.5">
            <span>O P E N</span>
            <span className="text-xs">♡</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
};
