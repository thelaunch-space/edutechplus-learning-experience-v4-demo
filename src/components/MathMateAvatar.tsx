import styles from './MathMateAvatar.module.css';
import { LiquidLoader } from './LiquidLoader';
import type { VoiceState } from '../types';

interface MathMateAvatarProps {
  state: VoiceState;
  size?: 'small' | 'medium' | 'large';
  showBranding?: boolean; // Only show branding on welcome screen
}

export function MathMateAvatar({ state, size = 'large', showBranding = false }: MathMateAvatarProps) {
  const renderAnimation = () => {
    switch (state) {
      case 'PROCESSING':
        // Thinking - colorful liquid loader
        return (
          <div className={styles.thinkingContainer}>
            <span className={styles.stateText}>Thinking...</span>
            <LiquidLoader size={size} />
          </div>
        );

      case 'MATH_MATE_SPEAKING':
        // Speaking - loudspeaker with pulsing sound waves
        return (
          <div className={styles.speakingContainer}>
            <span className={styles.stateText}>Speaking...</span>
            <div className={styles.speakerIcon}>
              <span className={styles.speakerEmoji}>🔊</span>
              <div className={styles.soundWaves}>
                <div className={styles.wave} />
                <div className={styles.wave} />
                <div className={styles.wave} />
              </div>
            </div>
          </div>
        );

      case 'WAITING_FOR_STUDENT':
        // Waiting - friendly prompt with mic icon
        return (
          <div className={styles.waitingContainer}>
            <span className={styles.stateText}>Your turn! Hold the button to talk</span>
            <div className={styles.micPrompt}>
              <span className={styles.micEmoji}>🎤</span>
              <div className={styles.pulseRing} />
            </div>
          </div>
        );

      case 'STUDENT_RECORDING':
        // Listening - ear with sound waves coming in
        return (
          <div className={styles.listeningContainer}>
            <span className={styles.stateText}>Listening...</span>
            <div className={styles.earIcon}>
              <div className={styles.incomingWaves}>
                <div className={styles.inWave} />
                <div className={styles.inWave} />
                <div className={styles.inWave} />
              </div>
              <span className={styles.earEmoji}>👂</span>
            </div>
          </div>
        );

      case 'ERROR':
        return (
          <div className={styles.errorAnimation}>
            <span className={styles.stateText}>Oops!</span>
            <span className={styles.errorEmoji}>😅</span>
          </div>
        );

      default:
        // Idle - only show branding on welcome screen
        if (!showBranding) return null;
        return (
          <div className={styles.idleContainer}>
            <div className={styles.mascotWrapper}>
              <span className={styles.mascotEmoji}>🌟</span>
              <div className={styles.sparkles}>
                <span className={styles.sparkle}>✨</span>
                <span className={styles.sparkle}>✨</span>
                <span className={styles.sparkle}>✨</span>
              </div>
            </div>
            <div className={styles.brandName}>
              <span className={styles.brandText}>Math Mate</span>
            </div>
          </div>
        );
    }
  };

  const getContainerClass = () => {
    const classes = [styles.container, styles[size]];
    if (state === 'ERROR') classes.push(styles.error);
    return classes.join(' ');
  };

  return (
    <div className={getContainerClass()}>
      <div className={styles.animationArea}>
        {renderAnimation()}
      </div>
    </div>
  );
}
