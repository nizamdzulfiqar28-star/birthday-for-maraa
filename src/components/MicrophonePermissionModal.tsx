import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface MicrophonePermissionModalProps {
  isOpen: boolean;
  onAllow: () => void;
  onDismiss?: () => void;
}

export const MicrophonePermissionModal: React.FC<MicrophonePermissionModalProps> = ({
  isOpen,
  onAllow,
  onDismiss,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="relative max-w-sm w-full bg-[#FFF9F5] paper-texture p-6 pt-8 rounded-3xl border-2 border-[#E8BFC0] shadow-2xl text-center"
          >
            {/* Scrapbook Washi Tape Header */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 h-7 washi-tape rotate-[-1deg] rounded-xs flex items-center justify-center shadow-xs">
              <span className="text-[11px] font-serif-elegant italic text-[#817777] font-semibold tracking-wider">
                TIUP LILIN ♡
              </span>
            </div>

            {/* Cute Mic Icon with Soft Glow Pulse */}
            <div className="relative inline-block mb-3">
              <span className="absolute -inset-2 rounded-full bg-[#F3D6D0]/50 blur-sm animate-ping" />
              <div className="relative text-4xl text-[#B76E79] animate-soft-pulse">
                🎙️
              </div>
            </div>

            {/* Exact Requested Message */}
            <p className="font-serif-elegant italic text-base sm:text-lg text-[#2B2525] leading-relaxed mb-6 px-1">
              biar seru kayak tiup lilin benaran, boleh ga kalo aku pinjem mikrofon hp kamu dengan mengizinkan akses mikrofon hp. sebentar aja untuk mendeteksi tiupan kamu ♡ ?
            </p>

            {/* Main Action Button: 'boleh donggg ♡' */}
            <button
              type="button"
              onClick={onAllow}
              className="w-full py-3.5 px-4 rounded-full bg-[#B76E79] hover:bg-[#A35D68] active:scale-95 text-white font-serif-elegant italic text-lg tracking-wide transition-all shadow-md hover:shadow-lg cursor-pointer mb-2.5 flex items-center justify-center gap-2"
            >
              <span>boleh donggg ♡</span>
            </button>

            {/* Secondary Dismiss Option */}
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="text-xs text-[#817777] hover:text-[#B76E79] transition-colors py-1 cursor-pointer font-body underline underline-offset-4 decoration-[#E8BFC0]"
              >
                Nanti aja, aku ketuk kuenya aja ♡
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
