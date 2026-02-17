import { useState, useEffect, useMemo } from 'react';
import { SpriteAnimator } from './SpriteAnimator/SpriteAnimator';
import styles from './MinionCharacter.module.css';

// Build sprite frame arrays (60 frames each)
function buildFrames(folder: string, prefix: string): string[] {
  return Array.from({ length: 60 }, (_, i) => {
    const num = String(i).padStart(2, '0');
    return `/tutor-assets/new/spark-sprites/${folder}/${prefix}_${num}.png`;
  });
}

const SPRITE_MAP: Record<string, string[]> = {
  neutral: buildFrames('bot-neutral', 'Bot_neutral'),
  celebration: buildFrames('celebration', 'Celenration'),
  giggling: buildFrames('giggling', 'Giggling'),
  nudging: buildFrames('nudging', 'Nudging'),
};

interface MinionCharacterProps {
  visible: boolean;
  expression?: string;
}

export function MinionCharacter({ visible, expression = 'neutral' }: MinionCharacterProps) {
  const [activeExpression, setActiveExpression] = useState(expression);
  const [fadingOut, setFadingOut] = useState(false);

  // Crossfade when expression changes
  useEffect(() => {
    if (expression !== activeExpression) {
      setFadingOut(true);
      const timer = setTimeout(() => {
        setActiveExpression(expression);
        setFadingOut(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [expression, activeExpression]);

  const frames = useMemo(
    () => SPRITE_MAP[activeExpression] || SPRITE_MAP.neutral,
    [activeExpression]
  );

  return (
    <div className={`${styles.minion} ${visible ? styles.visible : styles.hidden}`}>
      <div className={`${styles.spriteWrapper} ${fadingOut ? styles.crossfadeOut : styles.crossfadeIn}`}>
        <SpriteAnimator
          frames={frames}
          fps={24}
          loop={true}
          playing={visible}
          alt="Spark companion"
        />
      </div>
    </div>
  );
}
