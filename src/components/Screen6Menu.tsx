import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuModalType } from '../types';
import { triggerHeartConfetti, triggerBigCelebration } from '../utils/confetti';
import { soundSystem } from '../utils/audio';
import { Send, CheckCircle2, ArrowLeft } from 'lucide-react';

interface Props {
  onBackToStart?: () => void;
}

export const Screen6Menu: React.FC<Props> = ({ onBackToStart }) => {
  const [activeModal, setActiveModal] = useState<MenuModalType>('none');

  // Kado state
  const [isGiftOpened, setIsGiftOpened] = useState(false);

  // Surat state
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [lastSentText, setLastSentText] = useState<string>('');
  const [isReplySent, setIsReplySent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Clear any previously saved replies from localStorage as requested
  useEffect(() => {
    try {
      localStorage.removeItem('birthday_reply');
    } catch {
      // localStorage not accessible
    }

    return () => {
      // Ensure we restore default main music if component unmounts
      soundSystem.switchTrack('default');
    };
  }, []);

  const openModal = (type: MenuModalType) => {
    setActiveModal(type);
    triggerHeartConfetti(0.5, 0.5);
    soundSystem.playRomanticChime(659.25, 0.4, 0.08);
    // Note: Do NOT switch track yet. For Surat, the music starts only when the letter is opened!
  };

  const closeModal = () => {
    // Switch music back to main song automatically
    soundSystem.switchTrack('default');
    setActiveModal('none');
    setIsGiftOpened(false);
    setIsEnvelopeOpened(false);
  };

  // Gift open
  const handleOpenGift = () => {
    if (isGiftOpened) return;
    setIsGiftOpened(true);
    triggerBigCelebration();
    soundSystem.playCelebration();
  };

  // Envelope open in Letter view -> words appear, music switches to surat track
  const handleOpenEnvelopeLetter = () => {
    if (isEnvelopeOpened) return;
    setIsEnvelopeOpened(true);
    triggerHeartConfetti(0.5, 0.4);
    soundSystem.playRomanticChime(587.33, 0.4, 0.09);

    // Switch music to surat track now that the letter is opened and words are shown!
    soundSystem.switchTrack('surat');
  };

  // Send reply directly to WhatsApp (ONLY contains what she typed, no greeting template, no saved history)
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = replyText.trim();
    if (!trimmed) return;

    setIsSending(true);
    soundSystem.playRomanticChime(784, 0.4, 0.1);
    triggerHeartConfetti(0.5, 0.6);

    const targetPhone = '62895365185464';
    // Only the exact text she typed - no extra words or templates
    const waText = trimmed;
    const waUrl = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(waText)}`;

    setLastSentText(trimmed);

    // Automatically open WhatsApp
    try {
      const newWin = window.open(waUrl, '_blank');
      if (!newWin) {
        window.location.href = waUrl;
      }
    } catch {
      window.location.href = waUrl;
    }

    setTimeout(() => {
      setIsSending(false);
      setIsReplySent(true);
      setReplyText('');
    }, 350);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center py-10 px-4 select-none">
      {/* Menu Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="font-serif-elegant italic text-3xl sm:text-4xl text-[#2B2525]">
          There's still more for you...
        </h2>
        <p className="font-script text-3xl text-[#B76E79] mt-1">
          Choose one, my love ♡
        </p>
      </motion.div>

      {/* 3 Main Menu Cards: KADO, SURAT CINTA, MEMORIES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-lg mb-12">
        {/* CARD 1: KADO */}
        <motion.div
          whileHover={{ y: -6, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openModal('kado')}
          className="bg-[#FFFDFB] paper-texture p-5 rounded-2xl border border-[#F3D6D0] shadow-[0_8px_20px_rgba(183,110,121,0.1)] cursor-pointer flex flex-col items-center text-center transition-shadow hover:shadow-[0_12px_24px_rgba(183,110,121,0.2)] group relative overflow-hidden"
        >
          {/* Scrapbook Tape */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 washi-tape rotate-1 rounded-xs" />

          <div className="w-16 h-16 rounded-full bg-[#FCECE9] flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform">
            🎁
          </div>

          <h3 className="font-serif-elegant italic text-xl text-[#2B2525] group-hover:text-[#B76E79] transition-colors">
            KADO
          </h3>
          <p className="text-[11px] font-body text-[#817777] mt-1">
            a little special wish for your birthday
          </p>
          <span className="mt-3 text-xs text-[#B76E79] font-medium">Buka ♡</span>
        </motion.div>

        {/* CARD 2: SURAT CINTA */}
        <motion.div
          whileHover={{ y: -6, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openModal('surat')}
          className="bg-[#FFFDFB] paper-texture p-5 rounded-2xl border border-[#F3D6D0] shadow-[0_8px_20px_rgba(183,110,121,0.1)] cursor-pointer flex flex-col items-center text-center transition-shadow hover:shadow-[0_12px_24px_rgba(183,110,121,0.2)] group relative overflow-hidden"
        >
          {/* Scrapbook Tape */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 washi-tape rotate-[-2deg] rounded-xs" />

          <div className="w-16 h-16 rounded-full bg-[#FCECE9] flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform">
            💌
          </div>

          <h3 className="font-serif-elegant italic text-xl text-[#2B2525] group-hover:text-[#B76E79] transition-colors">
            SURAT CINTA
          </h3>
          <p className="text-[11px] font-body text-[#817777] mt-1">
            from my heart to yours
          </p>
          <span className="mt-3 text-xs text-[#B76E79] font-medium">Baca ♡</span>
        </motion.div>

        {/* CARD 3: MEMORIES */}
        <motion.div
          whileHover={{ y: -6, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openModal('memories')}
          className="bg-[#FFFDFB] paper-texture p-5 rounded-2xl border border-[#F3D6D0] shadow-[0_8px_20px_rgba(183,110,121,0.1)] cursor-pointer flex flex-col items-center text-center transition-shadow hover:shadow-[0_12px_24px_rgba(183,110,121,0.2)] group relative overflow-hidden"
        >
          {/* Scrapbook Tape */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 washi-tape rotate-2 rounded-xs" />

          <div className="w-16 h-16 rounded-full bg-[#FCECE9] flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform">
            📷
          </div>

          <h3 className="font-serif-elegant italic text-xl text-[#2B2525] group-hover:text-[#B76E79] transition-colors">
            MEMORIES
          </h3>
          <p className="text-[11px] font-body text-[#817777] mt-1">
            our story and moments
          </p>
          <span className="mt-3 text-xs text-[#B76E79] font-medium">Lihat ♡</span>
        </motion.div>
      </div>

      {/* Return to Landing Screen Option */}
      {onBackToStart && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8 text-center"
        >
          <button
            onClick={onBackToStart}
            className="px-5 py-2.5 rounded-full bg-[#FFFDFB] text-[#B76E79] border border-[#E8BFC0] hover:bg-[#FCECE9] font-serif-elegant italic text-xs sm:text-sm transition-all shadow-xs hover:shadow-sm cursor-pointer flex items-center gap-2 mx-auto active:scale-95"
          >
            <span>← Kembali ke Halaman Awal ♡</span>
          </button>
        </motion.div>
      )}

      {/* ======================================================== */}
      {/* 13. MODAL: KADO */}
      {/* ======================================================== */}
      <AnimatePresence>
        {activeModal === 'kado' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-md w-full my-8 bg-[#FFF9F5] paper-texture p-6 sm:p-8 rounded-3xl border border-[#F3D6D0] shadow-2xl text-center"
            >
              {/* Back button */}
              <button
                onClick={closeModal}
                className="absolute top-4 left-4 flex items-center gap-1 text-xs text-[#817777] hover:text-[#B76E79] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back ♡</span>
              </button>

              {/* Top decoration balloons & stars */}
              <div className="text-2xl pt-4 mb-1">🎈 🎂 🎈</div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FCECE9] text-[#B76E79] text-[11px] font-serif-elegant italic mb-2 border border-[#E8BFC0]/60">
                <span>Spesial untuk Marwah ♡</span>
              </div>

              {!isGiftOpened ? (
                <div
                  onClick={handleOpenGift}
                  className="cursor-pointer flex flex-col items-center py-6 group"
                >
                  {/* Shaking Gift Box Illustration */}
                  <motion.div
                    className="relative text-7xl select-none animate-wiggle group-hover:scale-110 transition-transform"
                    animate={{ rotate: [-3, 3, -3] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    🎁
                  </motion.div>

                  <p className="font-serif-elegant italic text-lg text-[#B76E79] mt-4">
                    Ketuk kadonya untuk membuka... ♡
                  </p>
                  <span className="text-xs text-[#817777] font-body mt-1">
                    (ada pesan hangat di dalamnya)
                  </span>
                </div>
              ) : (
                /* Opened Gift Content */
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col items-center mt-2"
                >
                  <h3 className="font-script text-3xl sm:text-4xl text-[#B76E79] mb-3">
                    happy birthday, maraa 🎂 ✨
                  </h3>

                  <div className="bg-[#FFFDFB] p-5 sm:p-6 rounded-2xl border border-[#F3D6D0] shadow-xs text-left text-xs sm:text-sm text-[#2B2525]/90 font-body leading-relaxed space-y-3.5">
                    <p>
                      hari ini adalah hari yang spesial buat kamu. dan sekarangg kamu udah masuk umur 14 tahun. doa terbaik dari aku semoga di umur baru ini banyak hal baik yang datang ke kamu. semoga semua urusan kamu dimudahkan, dan apa yang kamu perjuangkan bisa mendapatkan hasil yang terbaik ♡
                    </p>
                    <p>
                      tetap jadi marwah yang cantikk, ceriaa, pintar, dan punya banyak mimpi. ketika kamu berusaha untuk menggapai sesuatu jangan lupa buat istirahat, dan aku siap jadi tempat kamu buat istirahat. jangan terlalu keras sama diri sendiri dan nikmatin setiap proses nya yaaa 🤍
                    </p>
                    <p className="font-serif-elegant italic text-sm sm:text-base text-[#B76E79] font-medium pt-1">
                      semoga tahun ini bisa jadi chapter yang berkesan buat kamu 🫶🏻
                    </p>
                  </div>

                  <button
                    onClick={closeModal}
                    className="mt-6 px-6 py-2.5 rounded-full bg-[#B76E79] text-white font-serif-elegant italic text-base shadow-sm hover:bg-[#A35D68] transition-colors cursor-pointer"
                  >
                    Back ♡
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 14. MODAL: SURAT CINTA + REPLY FEATURE */}
      {/* ======================================================== */}
      <AnimatePresence>
        {activeModal === 'surat' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-lg w-full my-6 bg-[#FFF9F5] paper-texture p-6 sm:p-8 rounded-3xl border border-[#F3D6D0] shadow-2xl text-center max-h-[92vh] overflow-y-auto"
            >
              {/* Back button */}
              <button
                onClick={closeModal}
                className="sticky top-0 z-20 flex items-center gap-1 text-xs text-[#817777] hover:text-[#B76E79] transition-colors cursor-pointer bg-[#FFF9F5]/90 py-1 px-2 rounded-md mb-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back ♡</span>
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FCECE9] text-[#B76E79] text-[11px] font-serif-elegant italic mb-2 border border-[#E8BFC0]/60">
                {isEnvelopeOpened ? (
                  <>
                    <span className="animate-spin text-xs">♪</span>
                    <span>Lagu Surat Cinta diputar ♡</span>
                  </>
                ) : (
                  <span>Surat Spesial untuk Marwah ♡</span>
                )}
              </div>

              {!isEnvelopeOpened ? (
                /* Unopened Envelope */
                <div
                  onClick={handleOpenEnvelopeLetter}
                  className="flex flex-col items-center py-10 cursor-pointer group"
                >
                  <div className="relative w-44 h-32 bg-[#F7EDEB] border-2 border-[#E8BFC0] rounded-xl shadow-md flex items-center justify-center group-hover:scale-105 transition-transform">
                    {/* Flap */}
                    <div className="absolute top-0 left-0 right-0 h-0 border-l-[88px] border-l-transparent border-r-[88px] border-r-transparent border-t-[64px] border-t-[#E8BFC0] transition-colors group-hover:border-t-[#F3D6D0]" />

                    {/* Wax seal */}
                    <div className="relative z-10 w-9 h-9 rounded-full bg-[#FFF9F5] border border-[#E8BFC0] flex items-center justify-center shadow-xs">
                      <span className="text-[#B76E79] text-base animate-soft-pulse">♡</span>
                    </div>
                  </div>

                  <p className="font-serif-elegant italic text-xl text-[#B76E79] mt-6">
                    For you...
                  </p>
                  <span className="text-xs text-[#817777] font-body mt-1">
                    Ketuk amplop untuk membuka surat cinta ♡
                  </span>
                </div>
              ) : (
                /* Opened Letter & Reply section */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-left"
                >
                  {/* Letter Sheet */}
                  <div className="bg-[#FFFDFB] p-6 sm:p-7 rounded-2xl border border-[#F3D6D0] shadow-sm relative mb-6">
                    {/* Corner stamp/tape */}
                    <div className="absolute -top-3 right-6 w-16 h-5 washi-tape rotate-[-2deg]" />

                    <h4 className="font-script text-3xl text-[#B76E79] mb-4">
                      dear my love &lt;3
                    </h4>

                    <div className="font-serif-elegant text-sm sm:text-base text-[#2B2525] leading-relaxed space-y-3.5">
                      <p>
                        di ulang tahun kamu ini, aku cuman pengen kamu tau satu hal. aku bersyukur banget bisa dipertemukan sama kamu, aku juga senengg bangett bisa mengenal kamu
                      </p>
                      <p>
                        makasih yaaa udahh ada buat aku, kamu itu bukan cuma orang yang aku sayangg tapi kehadiran kamu juga berarti banget buat aku. obrolan kecil, cara kamu bicara, cara kamu memperlakukan orang lain, bahkan sebuah momen kecil gatau kenapa semuanya ada dipikiran aku, dan aku menyukai semua itu. walaupun komunikasi kita kadang berhenti karena aku gatau apa yang harus dibicarakan, tapi percayalah ngobrol sama kamu itu bagian favorite aku. communicate or not, you will always the favorite person i love 🤍. dan maaf yaaa kalo terkadang aku membuat kamu merasa kurang disayangi hehe ☺️
                      </p>
                      <p>
                        aku suka banget ngeliat kamu punya mimpi, selalu berusaha buat ngejar apa yang kamu inginkan, dan tertawa sama hal kecil. gatau kenapa senyum kamu bisa bikin hati aku ketarik dan nempel di pikiran aku wkwk.
                      </p>
                      <p>
                        kalo suatu hari kamu ngerasa semuanya berat, i hope you remember : kamu itu sangat berarti bagi seseorang dan ada aku disini yang siap nemenin kamu ♡ 🫂
                      </p>
                      <p>
                        kalo nanti kamu buka web ini lagi dan membaca suratnya. aku berharap kamu bisa tersenyum hihii :)
                      </p>
                      <p className="italic text-[#817777]">
                        surat ini aku buat dari seluruh isi hati aku
                      </p>
                      <p className="pt-2 font-script text-2xl sm:text-3xl text-[#B76E79]">
                        btw don't forget to smile okayy ? because i love your smile and it's so cute, hihii ☺️ 💗
                      </p>
                    </div>
                  </div>

                  {/* 15. REPLY FEATURE */}
                  <div className="bg-[#FFF9F5] border border-[#E8BFC0] p-5 rounded-2xl shadow-2xs">
                    <h5 className="font-serif-elegant italic text-base text-[#2B2525] mb-2 flex items-center gap-1.5">
                      <span>Want to leave something for me?</span>
                      <span className="text-[#B76E79]">♡</span>
                    </h5>

                    {isReplySent ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 bg-[#FCECE9] rounded-xl border border-[#E8BFC0] text-center"
                      >
                        <CheckCircle2 className="w-5 h-5 text-[#B76E79] mx-auto mb-1" />
                        <p className="font-serif-elegant italic text-sm text-[#2B2525]">
                          Pesanmu telah dikirim ke WhatsApp ♡
                        </p>
                        <p className="text-[11px] text-[#817777] font-body mt-1">
                          Aplikasi WhatsApp dibuka otomatis untuk mengirimkan pesanmu ke +62895365185464.
                        </p>
                        {lastSentText && (
                          <div className="mt-3">
                            <a
                              href={`https://api.whatsapp.com/send?phone=62895365185464&text=${encodeURIComponent(lastSentText)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-serif-elegant italic text-xs shadow-xs transition-colors"
                            >
                              <span>Buka Chat WhatsApp (+62895365185464) 💬</span>
                            </a>
                          </div>
                        )}
                        <button
                          onClick={() => {
                            setIsReplySent(false);
                            setLastSentText('');
                          }}
                          className="mt-3 block mx-auto text-xs text-[#B76E79] underline cursor-pointer"
                        >
                          Tulis balasan lagi
                        </button>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSendReply} className="flex flex-col gap-2">
                        <textarea
                          rows={3}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your reply here..."
                          className="w-full p-3 text-xs sm:text-sm bg-white border border-[#F3D6D0] rounded-xl font-body text-[#2B2525] placeholder:text-[#817777]/60 focus:outline-none focus:border-[#B76E79] transition-colors resize-none"
                        />
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-[11px] text-[#817777] italic font-serif-elegant">
                            Kirim ke WhatsApp 💬
                          </span>
                          <button
                            type="submit"
                            disabled={isSending || !replyText.trim()}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#B76E79] hover:bg-[#A35D68] disabled:opacity-50 text-white font-serif-elegant italic text-xs transition-colors cursor-pointer shadow-xs"
                          >
                            <Send className="w-3 h-3" />
                            <span>Kirim ke WhatsApp 💌</span>
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  <div className="mt-6 text-center">
                    <button
                      onClick={closeModal}
                      className="px-6 py-2 rounded-full bg-[#F7EDEB] text-[#B76E79] font-serif-elegant italic text-sm hover:bg-[#F3D6D0] transition-colors cursor-pointer border border-[#E8BFC0]"
                    >
                      Back ♡
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 16. MODAL: MEMORIES */}
      {/* ======================================================== */}
      <AnimatePresence>
        {activeModal === 'memories' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-sm w-full bg-[#FFF9F5] paper-texture p-7 rounded-3xl border border-[#F3D6D0] shadow-2xl text-center"
            >
              {/* Back button */}
              <button
                onClick={closeModal}
                className="absolute top-4 left-4 flex items-center gap-1 text-xs text-[#817777] hover:text-[#B76E79] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back ♡</span>
              </button>

              {/* Scrapbook Tape */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 washi-tape rotate-1 rounded-xs" />

              {/* Camera Illustration */}
              <div className="pt-4 pb-2">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-[#FCECE9] border border-[#F3D6D0] flex items-center justify-center text-4xl shadow-inner animate-soft-pulse">
                  📷
                </div>
              </div>

              <h3 className="font-script text-3xl sm:text-4xl text-[#2B2525] mt-3">
                our memories
              </h3>

              <div className="bg-[#FFFDFB] p-4 rounded-2xl border border-[#F3D6D0] my-4 shadow-2xs">
                <p className="font-body text-xs sm:text-sm text-[#2B2525] leading-relaxed">
                  "waduhh kayaknya kita belum punya foto kenangan nihh wkwk, jadi kapan mau bikin kenangannya hihi ♡"
                </p>
              </div>

              <p className="font-serif-elegant italic text-xs text-[#817777] mb-6">
                "Maybe this page is waiting for our first memory."
              </p>

              <button
                onClick={closeModal}
                className="px-6 py-2.5 rounded-full bg-[#B76E79] text-white font-serif-elegant italic text-base hover:bg-[#A35D68] transition-colors cursor-pointer shadow-xs"
              >
                Back ♡
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
