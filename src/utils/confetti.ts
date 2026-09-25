import confetti from 'canvas-confetti';

export function triggerHeartConfetti(originX = 0.5, originY = 0.5) {
  // Soft romantic pastel colors
  const colors = ['#B76E79', '#E8BFC0', '#F3D6D0', '#F7EDEB', '#FFF9F5', '#FFD1DC'];

  // Heart shapes using canvas-confetti custom shape if supported, or circle & star confetti
  try {
    const heart = confetti.shapeFromText({ text: '♡' });
    const fullHeart = confetti.shapeFromText({ text: '♥' });
    const sparkle = confetti.shapeFromText({ text: '✦' });

    confetti({
      shapes: [heart, fullHeart, sparkle],
      scalar: 1.8,
      particleCount: 35,
      spread: 70,
      origin: { x: originX, y: originY },
      colors: colors,
      disableForReducedMotion: true,
      ticks: 180,
      gravity: 0.8
    });
  } catch {
    confetti({
      particleCount: 45,
      spread: 80,
      origin: { x: originX, y: originY },
      colors: colors,
      disableForReducedMotion: true
    });
  }
}

export function triggerBigCelebration() {
  const colors = ['#B76E79', '#E8BFC0', '#F3D6D0', '#FCECE9', '#D48C95', '#F5C2C7'];
  
  const end = Date.now() + 1500;
  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
}
