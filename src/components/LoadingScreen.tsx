import { useEffect, useState, useRef } from 'react';
import styles from './LoadingScreen.module.css';

const FUN_MESSAGES = [
  'Slicing up some math puzzles...',
  'Teaching Spark not to eat the whole pizza...',
  'Counting ALL the pieces...',
  'Almost ready! Just a fraction more...',
  'Setting up the fraction lab...',
];

function buildAssetUrls(): string[] {
  const urls: string[] = [];

  // Layout images (5)
  const layoutImages = [
    '/tutor-assets/new/main-bg.jpg',
    '/tutor-assets/new/center-panel.png',
    '/tutor-assets/new/center-panel-bg.jpg',
    '/tutor-assets/new/top-panel.png',
    '/tutor-assets/new/bottom-panel.png',
  ];
  urls.push(...layoutImages);

  // Portal entry frames (75)
  for (let i = 0; i <= 74; i++) {
    const frame = String(i).padStart(2, '0');
    urls.push(`/tutor-assets/new/tutor-entry/Entry_${frame}.png`);
  }

  // Greeting first frame (1)
  urls.push('/tutor-assets/new/tutor-sprites/greeting/Greeting_00.png');

  return urls;
}

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [loaded, setLoaded] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [messageFading, setMessageFading] = useState(false);
  const totalRef = useRef(0);
  const completeCalled = useRef(false);

  const urls = useRef(buildAssetUrls());
  const total = urls.current.length;
  totalRef.current = total;

  // Preload all images
  useEffect(() => {
    let count = 0;
    const increment = () => {
      count++;
      setLoaded(count);
      if (count >= totalRef.current && !completeCalled.current) {
        completeCalled.current = true;
        setTimeout(() => onComplete(), 500);
      }
    };

    urls.current.forEach((url) => {
      const img = new Image();
      img.onload = increment;
      img.onerror = increment; // Count errors too so we don't get stuck
      img.src = url;
    });
  }, [onComplete]);

  // Rotate fun messages every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageFading(true);
      setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % FUN_MESSAGES.length);
        setMessageFading(false);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const percent = total > 0 ? Math.round((loaded / total) * 100) : 0;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Math Mate</h1>

        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${percent}%` }}
          />
        </div>

        <p className={styles.progressText}>
          {loaded} / {total} pieces loaded
        </p>

        <p
          className={`${styles.message} ${messageFading ? styles.messageFading : ''}`}
        >
          {FUN_MESSAGES[messageIndex]}
        </p>
      </div>
    </div>
  );
}
