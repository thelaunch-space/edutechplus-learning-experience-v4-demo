import { useState, useEffect } from 'react';
import styles from './LiquidLoader.module.css';

interface LiquidLoaderProps {
  size?: 'small' | 'medium' | 'large';
  bars?: number;
}

const colorClasses = [
  styles.purple,
  styles.blue,
  styles.cyan,
  styles.green,
  styles.yellow,
  styles.orange,
  styles.red,
];

const MAX_HEIGHTS = {
  small: 24,
  medium: 50,
  large: 100,
};

const DEFAULT_BARS = {
  small: 5,
  medium: 5,
  large: 9,
};

export function LiquidLoader({ size = 'medium', bars }: LiquidLoaderProps) {
  const barCount = bars ?? DEFAULT_BARS[size];
  const [heights, setHeights] = useState<number[]>(Array(barCount).fill(0));
  const [droplets, setDroplets] = useState<boolean[]>(Array(barCount).fill(false));

  const maxHeight = MAX_HEIGHTS[size];

  useEffect(() => {
    const interval = setInterval(() => {
      const time = Date.now() * 0.001;

      setHeights(prev => prev.map((_, index) => {
        const delay = index * 0.8;

        // Primary wave with bounce effect
        const primaryWave = Math.sin(time + delay);
        // Secondary bounce wave
        const bounceWave = Math.sin(time * 4 + delay) * 0.15;
        // Tertiary ripple
        const ripple = Math.sin(time * 8 + delay) * 0.05;

        const combinedWave = primaryWave + bounceWave + ripple;
        return maxHeight * combinedWave;
      }));

      // Animate droplets at wave peaks
      setDroplets(prev => prev.map((_, index) => {
        const delay = index * 0.8;
        const waveValue = Math.sin(time + delay);
        return waveValue > 0.8;
      }));
    }, 32);

    return () => clearInterval(interval);
  }, [barCount, maxHeight]);

  const sizeClass = size === 'small' ? styles.small : size === 'large' ? styles.large : '';

  return (
    <div className={`${styles.container} ${sizeClass}`}>
      {heights.map((height, index) => {
        const colorClass = colorClasses[index % colorClasses.length];
        const absHeight = Math.abs(height);

        return (
          <div key={index} className={styles.barContainer}>
            {/* Top droplet */}
            <div
              className={`${styles.droplet} ${colorClass}`}
              style={{
                opacity: droplets[index] ? 1 : 0,
                transform: droplets[index]
                  ? `translateY(${Math.sin(Date.now() * 0.008 + index * 0.5) * 2}px) scale(${0.8 + Math.sin(Date.now() * 0.006 + index * 0.3) * 0.3})`
                  : 'translateY(5px) scale(0.5)',
              }}
            />

            {/* Main liquid bar */}
            <div
              className={`${styles.bar} ${colorClass}`}
              style={{
                height: `${absHeight}px`,
                transform: height < 0 ? 'scaleY(-1)' : 'scaleY(1)',
                transformOrigin: 'bottom',
              }}
            >
              <div
                className={styles.barSurface}
                style={{
                  transform: `translateY(${Math.sin(Date.now() * 0.003 + index * 0.5) * 1}px)`,
                }}
              />
              <div
                className={styles.barShimmer}
                style={{
                  transform: `translateX(${Math.sin(Date.now() * 0.0015 + index * 0.7) * 6}px)`,
                }}
              />
              <div
                className={styles.barBubble}
                style={{
                  top: `${20 + Math.sin(Date.now() * 0.003 + index * 0.8) * 10}%`,
                  left: `${30 + Math.sin(Date.now() * 0.002 + index * 0.6) * 15}%`,
                  opacity: Math.sin(Date.now() * 0.005 + index * 0.9) * 0.3 + 0.3,
                }}
              />
            </div>

            {/* Base droplet */}
            <div
              className={`${styles.baseDrop} ${colorClass}`}
              style={{
                opacity: Math.sin(Date.now() * 0.003 + index * 0.9) * 0.4 + 0.6,
                transform: `scale(${0.6 + Math.sin(Date.now() * 0.002 + index * 0.6) * 0.4})`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
