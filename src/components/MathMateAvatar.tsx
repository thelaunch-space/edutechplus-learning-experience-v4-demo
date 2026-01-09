import styles from './MathMateAvatar.module.css';
import type { VoiceState } from '../types';

interface MathMateAvatarProps {
  state: VoiceState;
  size?: 'small' | 'medium' | 'large';
}

export function MathMateAvatar({ state, size = 'medium' }: MathMateAvatarProps) {
  const getAvatarClass = () => {
    switch (state) {
      case 'MATH_MATE_SPEAKING':
        return styles.speaking;
      case 'WAITING_FOR_STUDENT':
      case 'STUDENT_RECORDING':
        return styles.listening;
      case 'PROCESSING':
        return styles.thinking;
      case 'ERROR':
        return styles.error;
      default:
        return '';
    }
  };

  const getEmoji = () => {
    switch (state) {
      case 'MATH_MATE_SPEAKING':
        return '🗣️';
      case 'WAITING_FOR_STUDENT':
        return '👂';
      case 'STUDENT_RECORDING':
        return '🎤';
      case 'PROCESSING':
        return '🤔';
      case 'ERROR':
        return '😅';
      default:
        return '😊';
    }
  };

  return (
    <div className={`${styles.avatar} ${styles[size]} ${getAvatarClass()}`}>
      <div className={styles.face}>
        <span className={styles.emoji}>{getEmoji()}</span>
      </div>
      <div className={styles.name}>Math Mate</div>
    </div>
  );
}
