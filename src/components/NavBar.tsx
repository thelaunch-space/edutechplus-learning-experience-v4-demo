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

export function NavBar({ onSkip, onPTTStart, onPTTEnd, showPTT, isPTTActive, showSkip, showPTTHint }: NavBarProps) {
  return (
    <div className={styles.navbar}>
      {/* Empty left side for balance */}
      <div className={styles.side} />

      {/* PTT button — always centered */}
      <div className={styles.center}>
        {showPTT && (
          <div className={styles.pttWrapper}>
            {/* FTUE callout pill + bouncing arrow */}
            {showPTTHint && !isPTTActive && (
              <div className={styles.ftueHint}>
                <div className={styles.ftueLabel}>Press &amp; hold to talk</div>
                <div className={styles.ftueArrow}>&#x25BC;</div>
                <div className={styles.ftueRing} />
              </div>
            )}

            <button
              className={`${styles.pttButton} ${isPTTActive ? styles.pttActive : ''} ${showPTTHint && !isPTTActive ? styles.pttFtue : ''}`}
              onPointerDown={onPTTStart}
              onPointerUp={onPTTEnd}
              onPointerLeave={onPTTEnd}
              onContextMenu={(e) => e.preventDefault()}
            >
              {isPTTActive ? (
                <>
                  <span className={styles.recIndicator}>
                    <span className={styles.recDot} />
                    REC
                  </span>
                  <span className={styles.pttMainLabel}>Recording</span>
                  <span className={styles.pttSubLabel}>Release when done</span>
                </>
              ) : (
                <>
                  <span className={styles.micIcon}>&#x1F3A4;</span>
                  <span className={styles.pttMainLabel}>Hold to Speak</span>
                  <span className={styles.pttSubLabel}>Press &amp; hold</span>
                </>
              )}
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
