import { useState, useEffect } from 'react';
import styles from './TutorCharacter.module.css';

const EXPRESSION_MAP: Record<string, string> = {
  neutral: '/tutor-assets/Character/Neutral.png',
  greeting: '/tutor-assets/Character/Greeting.png',
  celebration: '/tutor-assets/Character/Celebration.png',
  encouragement: '/tutor-assets/Character/Encouragment.png',
  giggling: '/tutor-assets/Character/Giggling.png',
  listening: '/tutor-assets/Character/Listening.png',
  nudging: '/tutor-assets/Character/Nudging.png',
};

interface TutorCharacterProps {
  expression: string;
}

export function TutorCharacter({ expression }: TutorCharacterProps) {
  const [currentSrc, setCurrentSrc] = useState(EXPRESSION_MAP[expression] || EXPRESSION_MAP.neutral);
  const [nextSrc, setNextSrc] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const newSrc = EXPRESSION_MAP[expression] || EXPRESSION_MAP.neutral;
    if (newSrc !== currentSrc) {
      setNextSrc(newSrc);
      setTransitioning(true);
      const timer = setTimeout(() => {
        setCurrentSrc(newSrc);
        setNextSrc(null);
        setTransitioning(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [expression, currentSrc]);

  return (
    <div className={styles.character}>
      <img
        src={currentSrc}
        alt="Max the tutor"
        className={`${styles.characterImage} ${transitioning ? styles.fadeOut : ''}`}
        draggable={false}
      />
      {nextSrc && (
        <img
          src={nextSrc}
          alt="Max the tutor"
          className={`${styles.characterImage} ${styles.next} ${transitioning ? styles.fadeIn : ''}`}
          draggable={false}
        />
      )}
    </div>
  );
}
