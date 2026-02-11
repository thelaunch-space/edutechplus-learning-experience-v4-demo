import { useState } from 'react';
import { unlockAudio } from '../services/tts';
import styles from './WelcomeScreen.module.css';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = () => {
    setIsStarting(true);
    // Unlock audio on first user interaction (required for iOS)
    unlockAudio();
    // Small delay for visual feedback
    setTimeout(onStart, 300);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <img
          src="/tutor-assets/Character/Greeting.png"
          alt="Max greeting"
          className={styles.characterImage}
          draggable={false}
        />

        <h1 className={styles.title}>Welcome to Fractions!</h1>
        <p className={styles.subtitle}>
          Learn fractions with Max!
        </p>

        <button
          className={`${styles.startButton} ${isStarting ? styles.starting : ''}`}
          onClick={handleStart}
          disabled={isStarting}
        >
          {isStarting ? 'Starting...' : "Let's Go!"}
        </button>

        <p className={styles.hint}>
          Make sure your microphone is ready!
        </p>
      </div>
    </div>
  );
}
