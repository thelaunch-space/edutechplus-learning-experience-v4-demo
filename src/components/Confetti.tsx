import { useEffect, useState, useCallback } from 'react';
import styles from './Confetti.module.css';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
  type: 'square' | 'circle' | 'star';
}

interface ConfettiProps {
  isActive: boolean;
  onComplete?: () => void;
}

const COLORS = [
  '#FF6B6B', // coral
  '#FFE66D', // sunshine
  '#4ECDC4', // teal
  '#A855F7', // purple
  '#F472B6', // pink
  '#38BDF8', // sky
  '#34D399', // mint
  '#FB923C', // orange
  '#FBBF24', // gold
];

const CONFETTI_SOUND = '/fractions-module-content/applets/A1. M2-Fraction Cut and Glue Practice/assets/sfx/confetti.mp3';

const CELEBRATION_EMOJIS = ['🎉', '⭐', '🌟', '✨', '💫', '🏆', '👏', '🎊'];

export function Confetti({ isActive, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [showMessage, setShowMessage] = useState(false);

  const createConfetti = useCallback(() => {
    const newPieces: ConfettiPiece[] = [];
    const pieceCount = 100; // More pieces for kids!

    for (let i = 0; i < pieceCount; i++) {
      const types: Array<'square' | 'circle' | 'star'> = ['square', 'circle', 'star'];
      newPieces.push({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 0.5,
        duration: 2.5 + Math.random() * 2,
        size: 12 + Math.random() * 16, // Bigger pieces
        rotation: Math.random() * 360,
        type: types[Math.floor(Math.random() * types.length)],
      });
    }

    setPieces(newPieces);
  }, []);

  useEffect(() => {
    if (isActive) {
      createConfetti();
      setShowMessage(true);

      // Play celebration sound
      const audio = new Audio(CONFETTI_SOUND);
      audio.volume = 0.7; // Louder for kids
      audio.play().catch(() => {
        // Audio play failed (autoplay policy)
      });

      // Hide message after a bit
      const messageTimeout = setTimeout(() => {
        setShowMessage(false);
      }, 2500);

      // Clear confetti after animation completes
      const timeout = setTimeout(() => {
        setPieces([]);
        onComplete?.();
      }, 3000);

      return () => {
        clearTimeout(timeout);
        clearTimeout(messageTimeout);
      };
    } else {
      setPieces([]);
      setShowMessage(false);
    }
  }, [isActive, createConfetti, onComplete]);

  if (pieces.length === 0 && !showMessage) return null;

  return (
    <div className={styles.container}>
      {/* Celebration message */}
      {showMessage && (
        <div className={styles.celebrationMessage}>
          <div className={styles.emojiBurst}>
            {CELEBRATION_EMOJIS.map((emoji, i) => (
              <span
                key={i}
                className={styles.burstEmoji}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  transform: `rotate(${i * 45}deg) translateY(-60px)`
                }}
              >
                {emoji}
              </span>
            ))}
          </div>
          <span className={styles.greatJob}>Great Job!</span>
          <span className={styles.starBadge}>⭐</span>
        </div>
      )}

      {/* Confetti pieces */}
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className={`${styles.piece} ${styles[piece.type]}`}
          style={{
            left: `${piece.x}%`,
            backgroundColor: piece.color,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
