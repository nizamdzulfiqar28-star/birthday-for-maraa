import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { soundSystem } from '../utils/audio';
import { triggerBigCelebration, triggerHeartConfetti } from '../utils/confetti';

interface Props {
  onContinue: () => void;
  micStream?: MediaStream | null;
  isListeningMic?: boolean;
  micDeniedOrSkipped?: boolean;
  onRequestMic?: () => void;
  onCandleBlown?: () => void;
  initialBlown?: boolean;
}

export const Screen2Cake: React.FC<Props> = ({
  onContinue,
  micStream = null,
  isListeningMic = false,
  onRequestMic,
  onCandleBlown,
  initialBlown = false,
}) => {
  const [isBlown, setIsBlown] = useState(initialBlown);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const autoContinueTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (initialBlown) {
      setIsBlown(true);
    }
  }, [initialBlown]);

  // Listen to blow when micStream is available
  useEffect(() => {
    soundSystem.resumeAfterInterruption();

    if (!micStream || isBlown) return;

    let animationFrameId: number;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(micStream);
      sourceRef.current = source;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        if (isBlown) return;
        analyser.getByteFrequencyData(dataArray);

        // Low-frequency volume detection for blowing
        let lowSum = 0;
        const lowBins = 15;
        for (let i = 0; i < lowBins; i++) {
          lowSum += dataArray[i];
        }
        const avgLow = lowSum / lowBins;

        // Friendly threshold for blowing detection
        if (avgLow > 140) {
          handleBlowOut();
          return;
        }

        animationFrameId = requestAnimationFrame(checkVolume);
      };

      animationFrameId = requestAnimationFrame(checkVolume);
    } catch {
      // AudioContext / analyser fallback
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      try {
        sourceRef.current?.disconnect();
        analyserRef.current?.disconnect();
      } catch {
        // ignore
      }
      // Note: Never call audioContextRef.current.close() because on mobile Chrome/Safari,
      // closing an AudioContext shuts down the hardware audio bus and kills background music!
      soundSystem.resumeAfterInterruption();
    };
  }, [micStream, isBlown]);

  // Clean up auto continue timer on unmount
  useEffect(() => {
    return () => {
      if (autoContinueTimerRef.current) {
        clearTimeout(autoContinueTimerRef.current);
      }
    };
  }, []);

  const handleBlowOut = () => {
    if (isBlown) return;
    setIsBlown(true);
    soundSystem.playCandleBlow();

    // Trigger celebration effects
    setTimeout(() => {
      triggerBigCelebration();
      triggerHeartConfetti(0.5, 0.4);
      soundSystem.playCelebration();
      // Ensure background music keeps playing
      soundSystem.resumeAfterInterruption();
    }, 180);

    // Stop mic stream tracks to release microphone hardware
    if (micStream) {
      micStream.getTracks().forEach((t) => t.stop());
    }

    if (onCandleBlown) {
      onCandleBlown();
    }

    // AUTOMATIC ADVANCE: After celebrating, automatically continue to next chapter
    // so user is never stuck and doesn't get kicked back!
    if (autoContinueTimerRef.current) {
      clearTimeout(autoContinueTimerRef.current);
    }
    autoContinueTimerRef.current = window.setTimeout(() => {
      onContinue();
    }, 2200);
  };

  const handleManualContinue = () => {
    if (autoContinueTimerRef.current) {
      clearTimeout(autoContinueTimerRef.current);
    }
    onContinue();
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 text-center select-none relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full flex flex-col items-center"
      >
        {/* Wish Header */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-script text-4xl sm:text-5xl text-[#2B2525] mb-2"
        >
          Make a wish...
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-body text-xs sm:text-sm text-[#817777] mb-8"
        >
          {isBlown ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-1"
            >
              <span className="text-[#B76E79] font-medium font-serif-elegant italic text-lg">
                Wish made! Lilin berhasil ditiup ♡
              </span>
              <span className="text-[11px] text-[#817777]">
                Melanjutkan ke halaman berikutnya... ✨
              </span>
            </motion.div>
          ) : (
            <div>
              <span>Tiup lilinnya dulu yaa... ♡</span>
              <div className="text-[11px] text-[#B76E79]/80 mt-1">
                {isListeningMic
                  ? '🎤 Mikrofon aktif: langsung tiup lubang mic hp kamu atau ketuk kuenya!'
                  : '(kamu bisa tiup mikrofon hp kamu atau ketuk lilinnya)'}
              </div>
            </div>
          )}
        </motion.div>

        {/* Cake Container */}
        <div
          onClick={handleBlowOut}
          className="relative cursor-pointer group flex flex-col items-center my-4"
          title="Tap to blow the candle"
        >
          {/* Candle & Flame */}
          <div className="relative flex flex-col items-center z-20">
            {/* Flame */}
            {!isBlown ? (
              <motion.div
                className="relative cursor-pointer"
                animate={{ scale: [1, 1.08, 0.95, 1] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
              >
                {/* Outer Glow */}
                <div className="absolute -inset-2 bg-amber-200/40 rounded-full blur-xs" />
                {/* Flame Teardrop SVG */}
                <svg width="24" height="32" viewBox="0 0 24 32" className="animate-flame">
                  <path
                    d="M12,0 C12,0 3,12 3,21 C3,27 7,32 12,32 C17,32 21,27 21,21 C21,12 12,0 12,0 Z"
                    fill="#FFB703"
                  />
                  <path
                    d="M12,8 C12,8 6,16 6,22 C6,26 9,29 12,29 C15,29 18,26 18,22 C18,16 12,8 12,8 Z"
                    fill="#FF8500"
                  />
                  <circle cx="12" cy="24" r="4" fill="#FFEAA7" />
                </svg>
              </motion.div>
            ) : (
              /* Smoke Animation */
              <div className="relative h-8 w-6 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0.8, y: 0, scale: 0.6 }}
                  animate={{ opacity: 0, y: -35, scale: 1.6, x: [0, 8, -6, 4] }}
                  transition={{ duration: 1.8, ease: 'easeOut' }}
                  className="text-gray-400 text-xs font-serif italic select-none"
                >
                  ~ ☁ ~
                </motion.div>
              </div>
            )}

            {/* Candle Wick */}
            <div className="w-1 h-2 bg-stone-700 rounded-t-xs -mt-1" />

            {/* Candle Body */}
            <div className="w-4 h-14 bg-gradient-to-r from-[#FCECE9] via-white to-[#F7D8D5] rounded-t-xs shadow-xs border border-[#E8BFC0]/60 relative overflow-hidden">
              {/* Cute diagonal pastel stripes */}
              <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(45deg,#B76E79,#B76E79_3px,transparent_3px,transparent_8px)]" />
            </div>
          </div>

          {/* Hand-illustrated Cute Cake SVG */}
          <div className="relative -mt-1 z-10 filter drop-shadow-[0_12px_20px_rgba(183,110,121,0.18)]">
            <svg width="220" height="150" viewBox="0 0 220 150">
              <defs>
                <linearGradient id="cakeCream" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFDFB" />
                  <stop offset="100%" stopColor="#FFF2EE" />
                </linearGradient>
                <linearGradient id="cakeSponge" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FCECE9" />
                  <stop offset="100%" stopColor="#F7D8D5" />
                </linearGradient>
              </defs>

              {/* Top Tier */}
              <rect
                x="45"
                y="25"
                width="130"
                height="45"
                rx="8"
                fill="url(#cakeSponge)"
                stroke="#E8BFC0"
                strokeWidth="1.5"
              />
              {/* Top Icing Drips */}
              <path
                d="M45,25 Q55,42 65,25 Q75,38 85,25 Q95,44 105,25 Q115,36 125,25 Q135,42 145,25 Q155,37 165,25 Q170,35 175,25 L175,22 Q110,18 45,22 Z"
                fill="url(#cakeCream)"
              />
              {/* Strawberries / cute berries on top tier */}
              <circle cx="65" cy="22" r="5" fill="#B76E79" />
              <circle cx="110" cy="20" r="6" fill="#B76E79" />
              <circle cx="155" cy="22" r="5" fill="#B76E79" />

              {/* Bottom Tier */}
              <rect
                x="20"
                y="70"
                width="180"
                height="60"
                rx="10"
                fill="url(#cakeSponge)"
                stroke="#E8BFC0"
                strokeWidth="1.5"
              />
              {/* Bottom Icing Drips */}
              <path
                d="M20,70 Q35,92 50,70 Q65,88 80,70 Q95,96 110,70 Q125,90 140,70 Q155,95 170,70 Q185,88 200,70 L200,66 Q110,62 20,66 Z"
                fill="url(#cakeCream)"
              />

              {/* Decorative Pearls & Hearts on Cake */}
              <circle cx="45" cy="115" r="3" fill="#FFF9F5" />
              <circle cx="75" cy="118" r="3.5" fill="#B76E79" opacity="0.6" />
              <circle cx="110" cy="115" r="4" fill="#FFF9F5" />
              <circle cx="145" cy="118" r="3.5" fill="#B76E79" opacity="0.6" />
              <circle cx="175" cy="115" r="3" fill="#FFF9F5" />

              {/* Little piped heart */}
              <path
                d="M110,95 C107,90 102,90 102,95 C102,100 110,105 110,105 C110,105 118,100 118,95 C118,90 113,90 110,95 Z"
                fill="#B76E79"
              />

              {/* Cake Stand / Plate */}
              <ellipse
                cx="110"
                cy="133"
                rx="105"
                ry="12"
                fill="#FFF9F5"
                stroke="#F3D6D0"
                strokeWidth="2"
              />
              <path
                d="M70,136 L85,148 L135,148 L150,136 Z"
                fill="#F7EDEB"
                stroke="#F3D6D0"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>

        {/* Mic Active status pill */}
        {isListeningMic && !isBlown && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 text-xs text-[#B76E79] bg-[#FFFDFB] border border-[#E8BFC0] px-4 py-1.5 rounded-full shadow-xs mt-2"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-serif-elegant italic">
              Mikrofon aktif! Tiup lilinnya sekarang... 💨
            </span>
          </motion.div>
        )}

        {/* Mic skipped or denied - option to enable or tap */}
        {!isListeningMic && !isBlown && (
          <div className="flex flex-col items-center gap-1.5 mt-2">
            <p className="text-[11px] text-[#817777] italic font-body">
              ✨ Kamu bisa langsung ketuk kuenya untuk memadamkan lilin!
            </p>
            {onRequestMic && (
              <button
                type="button"
                onClick={onRequestMic}
                className="text-xs text-[#B76E79] hover:underline font-serif-elegant italic mt-1 cursor-pointer flex items-center gap-1"
              >
                <span>🎙️ Mau tiup lilin pakai mikrofon?</span>
              </button>
            )}
          </div>
        )}

        {/* Continue Link Button */}
        {isBlown && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 flex flex-col items-center gap-2"
          >
            <button
              onClick={handleManualContinue}
              className="px-6 py-2.5 rounded-full bg-[#B76E79] text-white font-serif-elegant italic text-base shadow-sm hover:bg-[#A35D68] transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
            >
              <span>Lanjut ke Game Cinta ♡ →</span>
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
