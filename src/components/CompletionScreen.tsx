import { MathMateAvatar } from './MathMateAvatar';
import styles from './CompletionScreen.module.css';

interface CompletionScreenProps {
  studentName: string;
  onRestart: () => void;
}

export function CompletionScreen({ studentName, onRestart }: CompletionScreenProps) {
  return (
    <div className={styles.container}>
      <div className={styles.confetti}>
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className={styles.confettiPiece}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              backgroundColor: ['#10b981', '#f59e0b', '#6366f1', '#ef4444', '#ec4899'][i % 5],
            }}
          />
        ))}
      </div>

      <div className={styles.content}>
        <div className={styles.trophy}>🏆</div>

        <MathMateAvatar state="IDLE" size="large" />

        <h1 className={styles.title}>Amazing Job, {studentName}!</h1>
        <p className={styles.subtitle}>
          You completed all 7 challenges!
          <br />
          You're a Fraction Master now!
        </p>

        <div className={styles.stars}>
          {Array.from({ length: 7 }).map((_, i) => (
            <span key={i} className={styles.star} style={{ animationDelay: `${i * 0.1}s` }}>
              ⭐
            </span>
          ))}
        </div>

        <button className={styles.restartButton} onClick={onRestart}>
          Play Again! 🔄
        </button>
      </div>
    </div>
  );
}
