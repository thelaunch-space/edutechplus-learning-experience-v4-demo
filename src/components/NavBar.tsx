import styles from './NavBar.module.css';
import type { VoiceState } from '../types';

interface NavBarProps {
  onSkip: () => void;
  onPTTStart: () => void;
  onPTTEnd: () => void;
  showPTT: boolean;
  isPTTActive: boolean;
  showSkip: boolean;
  voiceState: VoiceState;
  showPTTHint?: boolean;
}

function getPTTImage(voiceState: VoiceState, isPTTActive: boolean): string {
  if (isPTTActive) return '/tutor-assets/new/Push2.png';
  if (voiceState === 'WAITING_FOR_STUDENT') return '/tutor-assets/new/Push1.png';
  return '/tutor-assets/new/Push.png';
}

export function NavBar({ onSkip, onPTTStart, onPTTEnd, showPTT, isPTTActive, showSkip, voiceState, showPTTHint }: NavBarProps) {
  return (
    <div className={styles.navbar}>
      {/* Empty left side for balance */}
      <div className={styles.side} />

      {/* PTT button — always centered */}
      <div className={styles.center}>
        {showPTT && (
          <div className={styles.pttWrapper}>
            {showPTTHint && !isPTTActive && (
              <div className={styles.ftueHint}>
                <div className={styles.ftueRing} />
                <div className={styles.ftueLabel}>Tap & hold to speak</div>
              </div>
            )}
            <button
              className={`${styles.pttButton} ${isPTTActive ? styles.pttActive : ''}`}
              onPointerDown={onPTTStart}
              onPointerUp={onPTTEnd}
              onPointerLeave={onPTTEnd}
              onContextMenu={(e) => e.preventDefault()}
            >
              <img
                src={getPTTImage(voiceState, isPTTActive)}
                alt="Hold to talk"
                className={styles.pttImage}
                draggable={false}
              />
            </button>
          </div>
        )}
      </div>

      {/* Skip/Next button — right side */}
      <div className={`${styles.side} ${styles.sideRight}`}>
        {showSkip && (
          <button className={styles.skipButton} onClick={onSkip}>
            <img
              src="/tutor-assets/new/buttonA1.png"
              alt="Next"
              className={styles.skipImage}
              draggable={false}
            />
            <img
              src="/tutor-assets/new/buttonA2.png"
              alt="Next"
              className={`${styles.skipImage} ${styles.skipImageHover}`}
              draggable={false}
            />
          </button>
        )}
      </div>
    </div>
  );
}
