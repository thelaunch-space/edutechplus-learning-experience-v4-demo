import { useState, useEffect } from 'react';
import styles from './Waveform.module.css';

interface WaveformProps {
  variant: 'speaking' | 'recording' | 'idle' | 'waiting';
  size?: 'medium' | 'large';
}

const BAR_COUNT = {
  medium: 5,
  large: 9,
};

export function Waveform({ variant, size = 'large' }: WaveformProps) {
  const [heights, setHeights] = useState<number[]>(Array(BAR_COUNT[size]).fill(20));
  const barCount = BAR_COUNT[size];

  useEffect(() => {
    if (variant === 'idle') {
      // Gentle breathing animation
      const interval = setInterval(() => {
        const time = Date.now() * 0.001;
        setHeights(
          Array(barCount)
            .fill(0)
            .map((_, i) => {
              const wave = Math.sin(time * 1.5 + i * 0.4) * 0.3 + 0.5;
              return 20 + wave * 30;
            })
        );
      }, 50);
      return () => clearInterval(interval);
    }

    if (variant === 'waiting') {
      // Subtle pulsing invite
      const interval = setInterval(() => {
        const time = Date.now() * 0.001;
        setHeights(
          Array(barCount)
            .fill(0)
            .map((_, i) => {
              const pulse = Math.sin(time * 2 + i * 0.3) * 0.5 + 0.5;
              return 15 + pulse * 25;
            })
        );
      }, 50);
      return () => clearInterval(interval);
    }

    if (variant === 'speaking') {
      // Sound wave ripples expanding outward
      const interval = setInterval(() => {
        const time = Date.now() * 0.001;
        const center = (barCount - 1) / 2;
        setHeights(
          Array(barCount)
            .fill(0)
            .map((_, i) => {
              const distFromCenter = Math.abs(i - center) / center;
              const wave = Math.sin(time * 6 - distFromCenter * 3) * 0.5 + 0.5;
              const amplitude = 1 - distFromCenter * 0.3; // Higher in center
              return 20 + wave * 80 * amplitude;
            })
        );
      }, 30);
      return () => clearInterval(interval);
    }

    if (variant === 'recording') {
      // Reactive voice bars
      const interval = setInterval(() => {
        const time = Date.now() * 0.001;
        setHeights(
          Array(barCount)
            .fill(0)
            .map((_, i) => {
              // Simulate voice input with randomized waves
              const base = Math.sin(time * 4 + i * 0.5);
              const noise = Math.sin(time * 12 + i * 1.2) * 0.3;
              const wave = (base + noise) * 0.5 + 0.5;
              return 25 + wave * 75;
            })
        );
      }, 30);
      return () => clearInterval(interval);
    }
  }, [variant, barCount]);

  const getVariantClass = () => {
    switch (variant) {
      case 'speaking':
        return styles.speaking;
      case 'recording':
        return styles.recording;
      case 'waiting':
        return styles.waiting;
      default:
        return styles.idle;
    }
  };

  return (
    <div className={`${styles.container} ${styles[size]} ${getVariantClass()}`}>
      {heights.map((height, i) => (
        <div
          key={i}
          className={styles.bar}
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}
