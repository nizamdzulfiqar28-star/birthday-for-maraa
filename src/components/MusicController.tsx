import React, { useEffect, useState } from 'react';
import { soundSystem } from '../utils/audio';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const MusicController: React.FC = () => {
  const [status, setStatus] = useState(soundSystem.getStatus());
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    soundSystem.init();

    const unsubscribe = soundSystem.subscribe(() => {
      const s = soundSystem.getStatus();
      setStatus(s);
      if (s.autoplayFailed && !s.isPlaying) {
        setShowPrompt(true);
      } else {
        setShowPrompt(false);
      }
    });

    // Check after mount
    const timer = setTimeout(() => {
      const s = soundSystem.getStatus();
      if (!s.isPlaying) {
        setShowPrompt(true);
      }
    }, 1200);

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  const handleToggle = () => {
    soundSystem.togglePlay();
    setShowPrompt(false);
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundSystem.toggleMute();
  };

  return (
    <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
      {/* Autoplay blocked gentle notice */}
      <AnimatePresence>
        {showPrompt && !status.isPlaying && (
          <motion.button
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            onClick={handleToggle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF9F5]/90 border border-[#E8BFC0] shadow-sm text-xs font-body text-[#817777] hover:text-[#B76E79] hover:bg-[#F7EDEB] transition-colors cursor-pointer"
          >
            <span className="text-[#B76E79]">♪</span>
            <span>Tap to play music</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Active Track indicator (when switched to Kado or Surat) */}
      <AnimatePresence>
        {status.isPlaying && status.activeTrack !== 'default' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 10 }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF9F5]/95 border border-[#B76E79]/40 shadow-xs text-xs font-serif-elegant italic text-[#B76E79]"
          >
            <span>{status.trackTitle}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Music Button */}
      <div className="flex items-center bg-[#FFF9F5]/90 backdrop-blur-xs border border-[#F3D6D0] rounded-full p-1 shadow-xs">
        <button
          onClick={handleToggle}
          title={status.isPlaying ? 'Pause music' : 'Play music'}
          className={`relative p-2 rounded-full transition-all duration-300 cursor-pointer ${
            status.isPlaying
              ? 'bg-[#F7EDEB] text-[#B76E79]'
              : 'bg-transparent text-[#817777] hover:text-[#B76E79]'
          }`}
        >
          <Music className={`w-4 h-4 ${status.isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          {status.isPlaying && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B76E79] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B76E79]"></span>
            </span>
          )}
        </button>

        {status.isPlaying && (
          <button
            onClick={handleMuteToggle}
            title={status.isMuted ? 'Unmute' : 'Mute'}
            className="p-2 text-[#817777] hover:text-[#B76E79] transition-colors cursor-pointer rounded-full"
          >
            {status.isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
};
