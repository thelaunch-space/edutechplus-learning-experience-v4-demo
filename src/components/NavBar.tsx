import styles from './NavBar.module.css';

interface NavBarProps {
  onSkip: () => void;
  onPTTStart: () => void;
  onPTTEnd: () => void;
  showPTT: boolean;
  isPTTActive: boolean;
  showSkip: boolean;
}

export function NavBar({ onSkip, onPTTStart, onPTTEnd, showPTT, isPTTActive, showSkip }: NavBarProps) {
  return (
    <div className={styles.navbar}>
      {/* Empty left side for balance */}
      <div className={styles.side} />

      {/* PTT button — always centered */}
      <div className={styles.center}>
        {showPTT && (
          <button
            className={`${styles.pttButton} ${isPTTActive ? styles.pttActive : ''}`}
            onPointerDown={onPTTStart}
            onPointerUp={onPTTEnd}
            onPointerLeave={onPTTEnd}
            onContextMenu={(e) => e.preventDefault()}
          >
            <img
              src="/tutor-assets/Button.png"
              alt="Hold to talk"
              className={styles.pttImage}
              draggable={false}
            />
          </button>
        )}
      </div>

      {/* Skip/Next button — right side */}
      <div className={`${styles.side} ${styles.sideRight}`}>
        {showSkip && (
          <button className={styles.skipButton} onClick={onSkip}>
            Next
            <span className={styles.skipArrow}>&rarr;</span>
          </button>
        )}
      </div>
    </div>
  );
}
