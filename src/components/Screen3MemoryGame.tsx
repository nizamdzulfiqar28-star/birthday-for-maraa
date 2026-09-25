import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundSystem } from '../utils/audio';
import { triggerBigCelebration, triggerHeartConfetti } from '../utils/confetti';
import { MemoryCard } from '../types';
import { RotateCcw } from 'lucide-react';

interface Props {
  onComplete?: () => void;
  onContinue?: () => void;
}

const CARD_ITEMS = [
  { pairId: 1, emoji: '💌', label: 'Surat' },
  { pairId: 2, emoji: '🎂', label: 'Kue' },
  { pairId: 3, emoji: '🧸', label: 'Teddy' },
  { pairId: 4, emoji: '🎁', label: 'Kado' },
  { pairId: 5, emoji: '⭐', label: 'Bintang' },
  { pairId: 6, emoji: '🌹', label: 'Mawar' },
];

export const Screen3MemoryGame: React.FC<Props> = ({ onComplete, onContinue }) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [pairsFound, setPairsFound] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [gameFeedback, setGameFeedback] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  const handleProceed = () => {
    soundSystem.resumeAfterInterruption();
    if (onContinue) {
      onContinue();
    } else if (onComplete) {
      onComplete();
    }
  };

  // Initialize and shuffle 3x4 (12 cards)
  const initGame = () => {
    const deck: MemoryCard[] = [];
    CARD_ITEMS.forEach(item => {
      deck.push({
        id: Math.random(),
        pairId: item.pairId,
        emoji: item.emoji,
        label: item.label,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        id: Math.random(),
        pairId: item.pairId,
        emoji: item.emoji,
        label: item.label,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle
    const shuffled = deck.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndices([]);
    setIsLocked(false);
    setPairsFound(0);
    setSeconds(0);
    setIsGameStarted(false);
    setGameFeedback('');
    setIsCompleted(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    initGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer
  useEffect(() => {
    if (isGameStarted && !isCompleted && !timerRef.current) {
      timerRef.current = window.setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    if (isCompleted && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [isGameStarted, isCompleted]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleCardClick = (index: number) => {
    if (isLocked) return;
    const clickedCard = cards[index];
    if (clickedCard.isFlipped || clickedCard.isMatched) return;

    // Start timer on first flip
    if (!isGameStarted) {
      setIsGameStarted(true);
    }

    soundSystem.playCardFlip();

    // Flip card
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      const [idx1, idx2] = newFlipped;
      const card1 = newCards[idx1];
      const card2 = newCards[idx2];

      if (card1.pairId === card2.pairId) {
        // MATCH!
        setTimeout(() => {
          soundSystem.playCardMatch();
          if ('vibrate' in navigator) {
            navigator.vibrate(50);
          }
          triggerHeartConfetti(0.5, 0.5);

          const updated = [...newCards];
          updated[idx1].isMatched = true;
          updated[idx2].isMatched = true;
          setCards(updated);
          setFlippedIndices([]);
          setIsLocked(false);
          const newPairsCount = pairsFound + 1;
          setPairsFound(newPairsCount);
          setGameFeedback('yayy, ketemu pasangannya ♡');

          if (newPairsCount === 6) {
            // Completed!
            setTimeout(() => {
              setIsCompleted(true);
              triggerBigCelebration();
              soundSystem.playCelebration();
            }, 500);
          }
        }, 350);
      } else {
        // MISMATCH!
        setGameFeedback('hehe, belum jodoh kartunya 🙈');
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[idx1].isFlipped = false;
          resetCards[idx2].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
          setIsLocked(false);
        }, 650);
      }
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-4 py-8 select-none relative">
      <div className="max-w-md w-full flex flex-col items-center">
        {/* Title & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <h2 className="font-serif-elegant italic text-3xl sm:text-4xl text-[#2B2525]">
            Love Memory
          </h2>
          <p className="font-body text-xs sm:text-sm text-[#B76E79] font-medium mt-1">
            Find the matching pairs ♡
          </p>
        </motion.div>

        {/* Scoreboard: Pairs & Time */}
        <div className="w-full flex items-center justify-between px-4 py-2 mb-3 bg-[#FFFDFB] border border-[#F3D6D0] rounded-xl shadow-xs text-xs font-body text-[#817777]">
          <div className="flex items-center gap-1.5 font-semibold text-[#B76E79]">
            <span>♡</span>
            <span>Pairs: {pairsFound}/6</span>
          </div>

          <div className="flex items-center gap-2">
            <span>⏱️ Time: {formatTime(seconds)}</span>
            <button
              onClick={initGame}
              title="Reset Game"
              className="p-1 hover:text-[#B76E79] transition-colors cursor-pointer rounded-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Reaction feedback toast */}
        <div className="h-6 mb-2 flex items-center justify-center text-center">
          <AnimatePresence mode="wait">
            {gameFeedback && (
              <motion.span
                key={gameFeedback}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs font-medium text-[#B76E79] bg-[#FFF9F5] px-3 py-0.5 rounded-full border border-[#E8BFC0]/60 shadow-2xs"
              >
                {gameFeedback}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* 3 x 4 Grid (12 Cards) */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full max-w-[340px] perspective-1000">
          {cards.map((card, idx) => {
            const isRevealed = card.isFlipped || card.isMatched;

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(idx)}
                className="w-full aspect-square cursor-pointer select-none transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
              >
                <div
                  className={`relative w-full h-full rounded-2xl transform-style-3d transition-transform duration-500 shadow-sm ${
                    isRevealed ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* Card Front / Closed (Pastel Heart Pattern) */}
                  <div className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-[#FFFDFB] to-[#FCECE9] border border-[#F3D6D0] flex flex-col items-center justify-center p-2 shadow-2xs">
                    <div className="w-8 h-8 rounded-full bg-[#FFF9F5] flex items-center justify-center border border-[#E8BFC0]/50 shadow-2xs">
                      <span className="text-[#B76E79] text-base animate-soft-pulse">♡</span>
                    </div>
                  </div>

                  {/* Card Back / Revealed Emoji */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-[#FFFDFB] border-2 border-[#E8BFC0] flex flex-col items-center justify-center shadow-xs">
                    <span className="text-3xl sm:text-4xl filter drop-shadow-xs">
                      {card.emoji}
                    </span>
                    {card.isMatched && (
                      <span className="text-[10px] text-[#B76E79] font-medium mt-1">
                        matched ♡
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Skip or continue option */}
        <button
          onClick={handleProceed}
          className="mt-6 text-xs text-[#817777] hover:text-[#B76E79] transition-colors cursor-pointer font-serif-elegant italic"
        >
          Skip to calendar →
        </button>
      </div>

      {/* Celebration Modal when all matched */}
      <AnimatePresence>
        {isCompleted && (
          <div
            onClick={handleProceed}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-xs cursor-pointer"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-sm w-full bg-[#FFF9F5] paper-texture p-7 rounded-3xl border border-[#F3D6D0] shadow-2xl text-center cursor-default"
            >
              {/* Scrapbook washi tape */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 washi-tape rotate-1 rounded-xs" />

              <div className="text-4xl mb-2">🎉</div>
              <h3 className="font-script text-3xl sm:text-4xl text-[#2B2525] mb-2">
                Yayyy! You found them all ♡
              </h3>
              <p className="font-serif-elegant italic text-base text-[#B76E79] mb-5 leading-relaxed">
                "Maybe finding you was my favorite match."
              </p>

              <div className="text-xs text-[#817777] mb-6 flex justify-center gap-4">
                <span>⏱️ Selesai dalam {formatTime(seconds)}</span>
                <span>✨ 6/6 Pasangan</span>
              </div>

              <button
                onClick={handleProceed}
                className="w-full py-3 rounded-full bg-[#B76E79] hover:bg-[#A35D68] text-white font-serif-elegant italic text-lg tracking-wider transition-all duration-300 shadow-md cursor-pointer hover:shadow-lg active:scale-98"
              >
                Continue ♡
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
