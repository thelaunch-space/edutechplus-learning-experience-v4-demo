import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './SpriteAnimator.module.css';

interface SpriteAnimatorProps {
  frames: string[];
  fps?: number;
  loop?: boolean;
  playing?: boolean;
  onComplete?: () => void;
  className?: string;
  alt?: string;
}

export function SpriteAnimator({
  frames,
  fps = 24,
  loop = true,
  playing = true,
  onComplete,
  className,
  alt = '',
}: SpriteAnimatorProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const frameRef = useRef(0);
  const playingRef = useRef(playing);
  const [loaded, setLoaded] = useState(false);

  // Keep ref in sync
  playingRef.current = playing;

  // Preload all frames on mount
  useEffect(() => {
    if (frames.length === 0) return;
    let cancelled = false;
    const promises = frames.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = src;
        })
    );
    Promise.all(promises).then(() => {
      if (!cancelled) setLoaded(true);
    });
    return () => { cancelled = true; };
  }, [frames]);

  // Reset frame when frames array changes
  useEffect(() => {
    frameRef.current = 0;
    setCurrentFrame(0);
  }, [frames]);

  // Animation loop
  const animate = useCallback(
    (time: number) => {
      if (!playingRef.current) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = time - lastTimeRef.current;
      const interval = 1000 / fps;

      if (delta >= interval) {
        lastTimeRef.current = time - (delta % interval);
        const nextFrame = frameRef.current + 1;

        if (nextFrame >= frames.length) {
          if (loop) {
            frameRef.current = 0;
            setCurrentFrame(0);
          } else {
            // Hold last frame, fire callback
            onComplete?.();
            return; // Stop the loop
          }
        } else {
          frameRef.current = nextFrame;
          setCurrentFrame(nextFrame);
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    },
    [fps, frames.length, loop, onComplete]
  );

  useEffect(() => {
    if (!loaded || frames.length === 0) return;
    lastTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loaded, animate, frames]);

  if (frames.length === 0) return null;

  return (
    <img
      src={frames[currentFrame] || frames[0]}
      alt={alt}
      className={`${styles.sprite} ${className || ''}`}
      draggable={false}
    />
  );
}
