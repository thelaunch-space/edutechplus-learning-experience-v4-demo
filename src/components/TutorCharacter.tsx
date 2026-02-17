import { useState, useEffect, useMemo } from 'react';
import { SpriteAnimator } from './SpriteAnimator/SpriteAnimator';
import styles from './TutorCharacter.module.css';

// Build sprite frame arrays (60 frames each)
function buildFrames(folder: string, prefix: string): string[] {
  return Array.from({ length: 60 }, (_, i) => {
    const num = String(i).padStart(2, '0');
    return `/tutor-assets/new/tutor-sprites/${folder}/${prefix}_${num}.png`;
  });
}

const SPRITE_MAP: Record<string, string[]> = {
  neutral: buildFrames('neutral', 'Neutral'),
  greeting: buildFrames('greeting', 'Greeting'),
  celebration: buildFrames('celebration', 'Celebration'),
  encouragement: buildFrames('encouragement', 'Encouragment'),
  giggling: buildFrames('giggling', 'Giggling'),
  listening: buildFrames('listening', 'Listening'),
  nudging: buildFrames('nudging', 'Nudging'),
};

// Build tutor entry frames array (75 frames: Entry_00 to Entry_74)
const ENTRY_FRAMES = Array.from({ length: 75 }, (_, i) => {
  const num = String(i).padStart(2, '0');
  return `/tutor-assets/new/tutor-entry/Entry_${num}.png`;
});

type CharacterState = 'hidden' | 'entering' | 'present' | 'exiting';

interface TutorCharacterProps {
  expression: string;
  visible?: boolean;
  onEntryComplete?: () => void;
}

export function TutorCharacter({ expression, visible = true, onEntryComplete }: TutorCharacterProps) {
  const [charState, setCharState] = useState<CharacterState>(visible ? 'entering' : 'hidden');
  const [activeExpression, setActiveExpression] = useState(expression);
  const [fadingOut, setFadingOut] = useState(false);

  // Handle visible prop changes — always play portal animation on re-entry
  useEffect(() => {
    if (visible) {
      if (charState === 'hidden' || charState === 'exiting') {
        setCharState('entering');
      }
    } else {
      if (charState === 'present' || charState === 'entering') {
        setCharState('exiting');
      }
    }
  }, [visible]);

  // Handle exit animation completion
  useEffect(() => {
    if (charState === 'exiting') {
      const timer = setTimeout(() => setCharState('hidden'), 400);
      return () => clearTimeout(timer);
    }
  }, [charState]);

  // Entry animation complete callback
  const handleEntryComplete = () => {
    setCharState('present');
    onEntryComplete?.();
  };

  // Crossfade when expression changes (only when present)
  useEffect(() => {
    if (charState !== 'present') return;
    if (expression !== activeExpression) {
      setFadingOut(true);
      const timer = setTimeout(() => {
        setActiveExpression(expression);
        setFadingOut(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [expression, activeExpression, charState]);

  // Entry frame list (memoized)
  const entryFrames = useMemo(() => ENTRY_FRAMES, []);

  const expressionFrames = useMemo(
    () => SPRITE_MAP[activeExpression] || SPRITE_MAP.neutral,
    [activeExpression]
  );

  if (charState === 'hidden') return null;

  return (
    <div className={`${styles.character} ${charState === 'exiting' ? styles.exiting : ''}`}>
      {charState === 'entering' && (
        <SpriteAnimator
          frames={entryFrames}
          fps={30}
          loop={false}
          playing={true}
          onComplete={handleEntryComplete}
          className={styles.characterImage}
          alt="Max entering"
        />
      )}

      {charState === 'present' && (
        <div className={`${styles.spriteWrapper} ${fadingOut ? styles.crossfadeOut : styles.crossfadeIn}`}>
          <SpriteAnimator
            frames={expressionFrames}
            fps={24}
            loop={true}
            playing={true}
            className={styles.characterImage}
            alt="Max the tutor"
          />
        </div>
      )}
    </div>
  );
}
