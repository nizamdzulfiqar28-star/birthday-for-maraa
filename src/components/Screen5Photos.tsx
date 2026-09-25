import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CONFIG, ELEGANT_PLACEHOLDERS } from '../config';

interface Props {
  onContinue: () => void;
}

export const Screen5Photos: React.FC<Props> = ({ onContinue }) => {
  const [img1, setImg1] = useState(CONFIG.photo1 || ELEGANT_PLACEHOLDERS.photo1);
  const [img2, setImg2] = useState(CONFIG.photo2 || ELEGANT_PLACEHOLDERS.photo2);
  const [img3, setImg3] = useState(CONFIG.photo3 || ELEGANT_PLACEHOLDERS.photo3);

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-4 py-10 select-none">
      <div className="max-w-xl w-full flex flex-col items-center">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="font-script text-4xl sm:text-5xl text-[#2B2525]">
            Memories of You
          </h2>
          <p className="font-serif-elegant italic text-sm text-[#B76E79]">
            "every little moment with you is my favorite"
          </p>
        </motion.div>

        {/* 3 Photos Layout: [ Polaroid ] [ Heart Frame ] [ Polaroid ] */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-4 my-4">
          {/* Photo 1: Left Polaroid (-4deg) */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -8 }}
            animate={{ opacity: 1, y: 0, rotate: -4 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ rotate: -1, scale: 1.04, zIndex: 30 }}
            className="relative w-48 sm:w-44 bg-[#FFFDFB] p-3 pb-5 rounded-sm shadow-[0_8px_20px_rgba(183,110,121,0.15)] border border-[#F3D6D0]/60 transition-transform duration-300"
          >
            {/* Washi tape on top */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 washi-tape rotate-[-6deg] z-20" />

            <div className="w-full aspect-square bg-[#F7EDEB] overflow-hidden rounded-xs border border-[#F3D6D0]">
              <img
                src={img1}
                alt="Memory 1"
                onError={() => setImg1(ELEGANT_PLACEHOLDERS.photo1)}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <p className="font-script text-2xl text-[#817777] text-center mt-3 leading-none">
              my favorite person
            </p>
          </motion.div>

          {/* Photo 2: Center Heart Frame (0deg) */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05, zIndex: 30 }}
            className="relative w-56 sm:w-52 bg-[#FFFDFB] p-4 pb-6 rounded-2xl shadow-[0_12px_28px_rgba(183,110,121,0.2)] border border-[#F3D6D0] z-10 transition-transform duration-300"
          >
            {/* Center Washi Tape */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-24 h-6 washi-tape-dark rotate-1 z-20 rounded-xs flex items-center justify-center">
              <span className="text-[10px] text-white/90 font-serif-elegant italic">LOVE</span>
            </div>

            {/* Small decorative flower */}
            <div className="absolute -bottom-2 -right-2 text-2xl rotate-12 z-20">
              🌸
            </div>

            {/* Heart Frame Mask */}
            <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden">
              <div
                className="w-full h-full relative"
                style={{
                  clipPath: 'path("M 100,175 C 40,126 0,88 0,54 C 0,24 24,0 56,0 C 76,0 92,12 100,28 C 108,12 124,0 144,0 C 176,0 200,24 200,54 C 200,88 160,126 100,175 Z")',
                }}
              >
                <img
                  src={img2}
                  alt="Memory Center Heart"
                  onError={() => setImg2(ELEGANT_PLACEHOLDERS.photo2)}
                  className="w-full h-full object-cover scale-110"
                  loading="lazy"
                />
              </div>

              {/* Heart SVG Outline border */}
              <svg
                viewBox="0 0 200 180"
                className="absolute inset-0 w-full h-full pointer-events-none stroke-[#E8BFC0] fill-none stroke-[3]"
              >
                <path d="M 100,175 C 40,126 0,88 0,54 C 0,24 24,0 56,0 C 76,0 92,12 100,28 C 108,12 124,0 144,0 C 176,0 200,24 200,54 C 200,88 160,126 100,175 Z" />
              </svg>
            </div>

            <p className="font-script text-2xl text-[#B76E79] text-center mt-3 leading-none">
              pretty moments ♡
            </p>
          </motion.div>

          {/* Photo 3: Right Polaroid (+4deg) */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: 8 }}
            animate={{ opacity: 1, y: 0, rotate: 4 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ rotate: 1, scale: 1.04, zIndex: 30 }}
            className="relative w-48 sm:w-44 bg-[#FFFDFB] p-3 pb-5 rounded-sm shadow-[0_8px_20px_rgba(183,110,121,0.15)] border border-[#F3D6D0]/60 transition-transform duration-300"
          >
            {/* Washi tape on top right */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 washi-tape rotate-[5deg] z-20" />

            <div className="w-full aspect-square bg-[#F7EDEB] overflow-hidden rounded-xs border border-[#F3D6D0]">
              <img
                src={img3}
                alt="Memory 3"
                onError={() => setImg3(ELEGANT_PLACEHOLDERS.photo3)}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <p className="font-script text-2xl text-[#817777] text-center mt-3 leading-none">
              you ♡
            </p>
          </motion.div>
        </div>

        {/* Continue Button to Screen 6 Menu */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10"
        >
          <button
            onClick={onContinue}
            className="font-script text-3xl sm:text-4xl text-[#B76E79] hover:text-[#2B2525] transition-all hover:scale-105 cursor-pointer underline decoration-[#E8BFC0] underline-offset-8"
          >
            Special Surprises Ahead →
          </button>
        </motion.div>
      </div>
    </div>
  );
};
