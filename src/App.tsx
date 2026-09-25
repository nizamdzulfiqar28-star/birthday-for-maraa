import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenId } from './types';
import { BackgroundElements } from './components/BackgroundElements';
import { HeartCursor } from './components/HeartCursor';
import { MusicController } from './components/MusicController';
import { EasterEggModal } from './components/EasterEggModal';
import { MicrophonePermissionModal } from './components/MicrophonePermissionModal';
import { Screen1Landing } from './components/Screen1Landing';
import { Screen2Cake } from './components/Screen2Cake';
import { Screen3MemoryGame } from './components/Screen3MemoryGame';
import { Screen4Calendar } from './components/Screen4Calendar';
import { Screen5Photos } from './components/Screen5Photos';
import { Screen6Menu } from './components/Screen6Menu';
import { FinalFooter } from './components/FinalFooter';
import { soundSystem } from './utils/audio';

// Clear any stale cached screen so the app ALWAYS starts fresh on screen1_landing
try {
  sessionStorage.removeItem('scrapbook_current_screen');
  sessionStorage.removeItem('scrapbook_max_screen');
  sessionStorage.removeItem('scrapbook_cake_blown');
  sessionStorage.removeItem('scrapbook_has_loaded');
} catch {}

const screenOrder: ScreenId[] = [
  'screen1_landing',
  'screen2_cake',
  'screen3_game',
  'screen4_calendar',
  'screen5_photos',
  'screen6_menu',
];

export default function App() {
  // Always begin on the first opening landing screen
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('screen1_landing');
  const [maxScreenReached, setMaxScreenReached] = useState<number>(1);
  const [isCakeBlown, setIsCakeBlown] = useState<boolean>(false);

  const [showEasterEgg, setShowEasterEgg] = useState(false);

  // Microphone permission modal state
  const [showMicModal, setShowMicModal] = useState(false);
  const [hasAskedMic, setHasAskedMic] = useState(false);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [micDeniedOrSkipped, setMicDeniedOrSkipped] = useState(false);

  const navigateTo = (screen: ScreenId) => {
    const idx = screenOrder.indexOf(screen) + 1;
    if (idx > maxScreenReached) {
      setMaxScreenReached(idx);
    }

    soundSystem.playRomanticChime(523.25, 0.3, 0.06);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // When navigating to the cake screen, open mic modal if not asked yet
    if (screen === 'screen2_cake' && !hasAskedMic && !isCakeBlown) {
      setShowMicModal(true);
    }
  };

  // Request browser microphone only when user clicks "boleh donggg ♡"
  const handleAllowMic = async () => {
    setShowMicModal(false);
    setHasAskedMic(true);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setMicDeniedOrSkipped(true);
        soundSystem.resumeAfterInterruption();
        return;
      }

      // Directly invoke system microphone prompt from user gesture click
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStream(stream);
      setIsListeningMic(true);
      setMicDeniedOrSkipped(false);
      soundSystem.playRomanticChime(659.25, 0.3, 0.08);
    } catch {
      // Permission denied or dismissed in browser prompt
      setIsListeningMic(false);
      setMicDeniedOrSkipped(true);
    } finally {
      // Explicitly keep background audio running smoothly
      soundSystem.resumeAfterInterruption();
      setTimeout(() => soundSystem.resumeAfterInterruption(), 150);
      setTimeout(() => soundSystem.resumeAfterInterruption(), 400);
    }
  };

  const handleDismissMic = () => {
    setShowMicModal(false);
    setHasAskedMic(true);
    setMicDeniedOrSkipped(true);
    soundSystem.resumeAfterInterruption();
  };

  const handleCandleBlown = () => {
    setIsCakeBlown(true);
    setIsListeningMic(false);
    if (micStream) {
      micStream.getTracks().forEach((track) => track.stop());
    }
    soundSystem.resumeAfterInterruption();
  };

  const currentStepIndex = screenOrder.indexOf(currentScreen);

  return (
    <div className="min-h-screen w-full bg-[#FFF9F5] text-[#2B2525] relative font-body overflow-x-hidden selection:bg-[#F3D6D0] selection:text-[#B76E79]">
      {/* Romantic Paper Texture & Gentle Floating Hearts */}
      <BackgroundElements />

      {/* Custom Heart Cursor (Desktop) & Tap Particle Emitter (Mobile) */}
      <HeartCursor />

      {/* Background Music Controller */}
      <MusicController />

      {/* Secret Easter Egg Modal */}
      <EasterEggModal
        isOpen={showEasterEgg}
        onClose={() => setShowEasterEgg(false)}
      />

      {/* Microphone Permission Modal (appears before system mic prompt) */}
      <MicrophonePermissionModal
        isOpen={showMicModal}
        onAllow={handleAllowMic}
        onDismiss={handleDismissMic}
      />

      {/* Scrapbook Chapter Stepper Header (unlocks as user progresses) */}
      {maxScreenReached > 1 && (
        <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-[#FFF9F5]/85 border-b border-[#F3D6D0]/60 px-4 py-2 flex items-center justify-between shadow-2xs">
          <button
            onClick={() => setShowEasterEgg(true)}
            className="font-script text-2xl text-[#B76E79] hover:scale-105 transition-transform cursor-pointer"
            title="Easter egg secret ♡"
          >
            My Love ♡
          </button>

          {/* Stepper Dots */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {[
              { id: 'screen1_landing', label: 'Surat' },
              { id: 'screen2_cake', label: 'Kue' },
              { id: 'screen3_game', label: 'Game' },
              { id: 'screen4_calendar', label: 'Kalender' },
              { id: 'screen5_photos', label: 'Foto' },
              { id: 'screen6_menu', label: 'Menu' },
            ].map((step, idx) => {
              const isUnlocked = idx + 1 <= maxScreenReached;
              const isCurrent = currentStepIndex === idx;

              return (
                <button
                  key={step.id}
                  disabled={!isUnlocked}
                  onClick={() => navigateTo(step.id as ScreenId)}
                  title={step.label}
                  className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-serif-elegant italic transition-all duration-300 ${
                    isCurrent
                      ? 'bg-[#B76E79] text-white shadow-xs'
                      : isUnlocked
                      ? 'bg-[#F7EDEB] text-[#817777] hover:text-[#B76E79] cursor-pointer'
                      : 'opacity-30 text-[#817777] cursor-not-allowed'
                  }`}
                >
                  {step.label}
                </button>
              );
            })}
          </div>
        </header>
      )}

      {/* Main Screen Content with Page Transitions */}
      <main className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        <AnimatePresence mode="wait">
          {currentScreen === 'screen1_landing' && (
            <motion.section
              key="screen1"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="w-full"
            >
              <Screen1Landing
                onOpen={() => navigateTo('screen2_cake')}
                onSecretTrigger={() => setShowEasterEgg(true)}
              />
            </motion.section>
          )}

          {currentScreen === 'screen2_cake' && (
            <motion.section
              key="screen2"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="w-full"
            >
              <Screen2Cake
                onContinue={() => navigateTo('screen3_game')}
                micStream={micStream}
                isListeningMic={isListeningMic}
                micDeniedOrSkipped={micDeniedOrSkipped}
                onRequestMic={() => setShowMicModal(true)}
                onCandleBlown={handleCandleBlown}
                initialBlown={isCakeBlown}
              />
            </motion.section>
          )}

          {currentScreen === 'screen3_game' && (
            <motion.section
              key="screen3"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="w-full"
            >
              <Screen3MemoryGame
                onContinue={() => navigateTo('screen4_calendar')}
                onComplete={() => navigateTo('screen4_calendar')}
              />
            </motion.section>
          )}

          {currentScreen === 'screen4_calendar' && (
            <motion.section
              key="screen4"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="w-full"
            >
              <Screen4Calendar onContinue={() => navigateTo('screen5_photos')} />
            </motion.section>
          )}

          {currentScreen === 'screen5_photos' && (
            <motion.section
              key="screen5"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="w-full"
            >
              <Screen5Photos onContinue={() => navigateTo('screen6_menu')} />
            </motion.section>
          )}

          {currentScreen === 'screen6_menu' && (
            <motion.section
              key="screen6"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="w-full"
            >
              <Screen6Menu onBackToStart={() => navigateTo('screen1_landing')} />
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Scrapbook Footer */}
      <FinalFooter />
    </div>
  );
}
