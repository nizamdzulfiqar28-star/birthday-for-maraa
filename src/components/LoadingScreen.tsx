import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundSystem } from '../utils/audio';

interface Props {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<Props> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'special' | 'foryou' | 'done'>('special');

  useEffect(() => {
    // Attempt instant play on load
    soundSystem.tryPlay();

    const t1 = setTimeout(() => {
      setPhase('foryou');
    }, 700);

    const t2 = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 1400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  const handleTap = () => {
    soundSystem.play();
    setPhase('done');
    onComplete();
  };

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          onClick={handleTap}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FFF9F5] paper-texture cursor-pointer select-none"
        >
          <div className="flex flex-col items-center gap-4 text-center px-6">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
              className="text-4xl text-[#B76E79]"
            >
              ♡
            </motion.div>

            <AnimatePresence mode="wait">
              {phase === 'special' ? (
                <motion.p
                  key="special"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="font-serif-elegant italic text-2xl text-[#2B2525] tracking-wide"
                >
                  Preparing something special... <span className="text-[#B76E79]">♡</span>
                </motion.p>
              ) : (
                <motion.p
                  key="foryou"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="font-script text-4xl text-[#B76E79]"
                >
                  for you
                </motion.p>
              )}
            </AnimatePresence>

            <span className="text-[11px] text-[#817777]/60 font-body mt-2">
              (ketuk layar untuk mulai langsung ♪)
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

