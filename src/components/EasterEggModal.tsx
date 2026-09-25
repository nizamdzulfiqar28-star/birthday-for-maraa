import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { triggerHeartConfetti } from '../utils/confetti';
import { soundSystem } from '../utils/audio';
import { Music, Check, Settings2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const EasterEggModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [mainUrl, setMainUrl] = useState('');
  const [kadoUrl, setKadoUrl] = useState('');
  const [suratUrl, setSuratUrl] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      triggerHeartConfetti(0.5, 0.4);
      setMainUrl(soundSystem.getTrackUrl('default'));
      setKadoUrl(soundSystem.getTrackUrl('kado'));
      setSuratUrl(soundSystem.getTrackUrl('surat'));
      setSavedSuccess(false);
    }
  }, [isOpen]);

  const handleSaveMusic = (e: React.FormEvent) => {
    e.preventDefault();
    soundSystem.setCustomTrackUrl('default', mainUrl);
    soundSystem.setCustomTrackUrl('kado', kadoUrl);
    soundSystem.setCustomTrackUrl('surat', suratUrl);
    setSavedSuccess(true);
    triggerHeartConfetti(0.5, 0.5);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative max-w-sm w-full bg-[#FFF9F5] paper-texture p-6 rounded-3xl border border-[#F3D6D0] shadow-xl text-center max-h-[90vh] overflow-y-auto"
          >
            {/* Scrapbook washi tape top */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 washi-tape rotate-1 rounded-xs" />

            <div className="text-4xl mb-2 animate-soft-pulse text-[#B76E79]">♡</div>

            <p className="font-serif-elegant italic text-xl text-[#2B2525] mb-1">
              psst...
            </p>
            <p className="font-script text-3xl text-[#B76E79] mb-2">
              I really love you ♡
            </p>
            <p className="text-xs text-[#817777] font-body mb-4 leading-relaxed">
              You found the secret message! You make my whole world brighter.
            </p>

            {/* Optional Music URL configuration toggle */}
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className="inline-flex items-center gap-1.5 text-xs text-[#817777] hover:text-[#B76E79] mb-4 cursor-pointer underline transition-colors"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>{showSettings ? 'Tutup Pengaturan Musik' : 'Atur Link Musik (Kado, Surat, Utama)'}</span>
            </button>

            {showSettings && (
              <form onSubmit={handleSaveMusic} className="bg-white/80 border border-[#F3D6D0] rounded-2xl p-3.5 text-left mb-4 shadow-2xs space-y-3">
                <div className="flex items-center gap-1.5 text-[#B76E79] font-serif-elegant italic text-xs font-semibold">
                  <Music className="w-3.5 h-3.5" />
                  <span>Kustomisasi Link Audio MP3</span>
                </div>

                <div>
                  <label className="block text-[11px] font-body text-[#817777] mb-1">
                    🎵 Musik Utama (Halaman Awal):
                  </label>
                  <input
                    type="url"
                    value={mainUrl}
                    onChange={(e) => setMainUrl(e.target.value)}
                    placeholder="https://.../music.mp3"
                    className="w-full px-2.5 py-1.5 text-xs bg-[#FFFDFB] border border-[#E8BFC0] rounded-lg focus:outline-none focus:border-[#B76E79]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-body text-[#817777] mb-1">
                    🎁 Musik Bagian KADO:
                  </label>
                  <input
                    type="url"
                    value={kadoUrl}
                    onChange={(e) => setKadoUrl(e.target.value)}
                    placeholder="https://.../kado.mp3 (opsional)"
                    className="w-full px-2.5 py-1.5 text-xs bg-[#FFFDFB] border border-[#E8BFC0] rounded-lg focus:outline-none focus:border-[#B76E79]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-body text-[#817777] mb-1">
                    💌 Musik Bagian SURAT:
                  </label>
                  <input
                    type="url"
                    value={suratUrl}
                    onChange={(e) => setSuratUrl(e.target.value)}
                    placeholder="https://.../surat.mp3 (opsional)"
                    className="w-full px-2.5 py-1.5 text-xs bg-[#FFFDFB] border border-[#E8BFC0] rounded-lg focus:outline-none focus:border-[#B76E79]"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-[#817777] italic">
                    Kosongkan untuk pakai musik romantis bawaan
                  </span>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-full bg-[#B76E79] text-white text-xs font-serif-elegant italic hover:bg-[#A35D68] cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    {savedSuccess ? <Check className="w-3 h-3" /> : null}
                    <span>{savedSuccess ? 'Tersimpan!' : 'Simpan ♡'}</span>
                  </button>
                </div>
              </form>
            )}

            <div>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-full bg-[#F7EDEB] text-[#B76E79] text-xs font-semibold hover:bg-[#F3D6D0] transition-colors cursor-pointer border border-[#E8BFC0]"
              >
                Love you more ♡
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
