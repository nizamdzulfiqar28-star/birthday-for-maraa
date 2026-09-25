import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CONFIG } from '../config';
import { X } from 'lucide-react';

interface Props {
  onContinue: () => void;
}

interface PhotoItem {
  id: number;
  url: string;
  caption: string;
  tapeColor: string;
  rotation: string;
  delay: number;
}

const PHOTOS_LIST: PhotoItem[] = [
  {
    id: 1,
    url: CONFIG.photo1 || 'https://mp3tourl.com/images/1790331727997-1abae14f-e909-41b9-9e34-0709fca7293d.jpg',
    caption: 'my favorite person ♡',
    tapeColor: 'washi-tape rotate-[-4deg]',
    rotation: '-rotate-2 sm:-rotate-3',
    delay: 0.15,
  },
  {
    id: 2,
    url: CONFIG.photo2 || 'https://mp3tourl.com/images/1790331819304-dea0ec24-573d-4fd5-a2c3-725ec3b2d0b0.jpg',
    caption: 'pretty smile ✨',
    tapeColor: 'washi-tape-dark rotate-[3deg]',
    rotation: 'rotate-2 sm:rotate-2',
    delay: 0.3,
  },
  {
    id: 3,
    url: CONFIG.photo3 || 'https://mp3tourl.com/images/1790331788723-e7ee10e7-ffa5-4fdb-b88f-373a281aef76.jpg',
    caption: 'always in my mind 🌸',
    tapeColor: 'washi-tape rotate-[-2deg]',
    rotation: '-rotate-1 sm:-rotate-2',
    delay: 0.45,
  },
  {
    id: 4,
    url: CONFIG.photo4 || 'https://mp3tourl.com/images/1790331848067-47161d64-d647-433e-ae80-ebbf316a0fd3.jpg',
    caption: 'forever grateful ♡',
    tapeColor: 'washi-tape rotate-[4deg]',
    rotation: 'rotate-2 sm:rotate-3',
    delay: 0.6,
  },
];

export const Screen5Photos: React.FC<Props> = ({ onContinue }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-4 py-10 select-none">
      <div className="max-w-2xl w-full flex flex-col items-center">
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
          <p className="font-serif-elegant italic text-xs sm:text-sm text-[#B76E79] mt-1">
            "every little moment with you is my favorite"
          </p>
        </motion.div>

        {/* 4 Photos Scrapbook Polaroid Grid (2 columns on mobile & tablet) */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-xl my-2">
          {PHOTOS_LIST.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: item.delay }}
              whileHover={{ rotate: 0, scale: 1.03, zIndex: 30 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPhoto(item)}
              className={`relative bg-[#FFFDFB] p-2.5 sm:p-3 pb-4 sm:pb-5 rounded-sm shadow-[0_8px_20px_rgba(183,110,121,0.15)] border border-[#F3D6D0]/70 cursor-pointer transition-all duration-300 ${item.rotation}`}
            >
              {/* Scrapbook Washi Tape */}
              <div
                className={`absolute -top-3 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-4 sm:h-5 ${item.tapeColor} z-20 rounded-xs shadow-2xs`}
              />

              {/* Photo Frame Container */}
              <div className="w-full aspect-[4/5] sm:aspect-square bg-[#F7EDEB] overflow-hidden rounded-xs border border-[#F3D6D0] relative">
                <img
                  src={item.url}
                  alt={item.caption}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Handwritten Scrapbook Caption */}
              <p className="font-script text-lg sm:text-2xl text-[#817777] text-center mt-2.5 sm:mt-3 leading-none truncate px-1">
                {item.caption}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Light Photo Preview Modal */}
        <AnimatePresence>
          {selectedPhoto && (
            <div
              onClick={() => setSelectedPhoto(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs cursor-pointer"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-sm sm:max-w-md w-full bg-[#FFFDFB] p-4 pb-6 rounded-2xl border border-[#F3D6D0] shadow-2xl text-center cursor-default"
              >
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-[#817777] hover:text-[#B76E79] shadow-xs cursor-pointer z-30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="w-full max-h-[65vh] overflow-hidden rounded-xl border border-[#F3D6D0] bg-[#F7EDEB]">
                  <img
                    src={selectedPhoto.url}
                    alt={selectedPhoto.caption}
                    className="w-full h-auto max-h-[65vh] object-contain mx-auto"
                  />
                </div>

                <p className="font-script text-3xl text-[#B76E79] mt-3">
                  {selectedPhoto.caption}
                </p>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Continue Button to Screen 6 Menu */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 sm:mt-10"
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
