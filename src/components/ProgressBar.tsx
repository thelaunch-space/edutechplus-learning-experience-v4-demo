import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  current: number;
  total: number;
  title?: string;
}

export function ProgressBar({ current, total, title }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>{title || 'Progress'}</span>
        <span className={styles.count}>
          {current} of {total}
        </span>
      </div>

      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${percentage}%` }}
        />
        {/* Stars for each challenge */}
        <div className={styles.stars}>
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`${styles.star} ${i < current ? styles.completed : ''}`}
            >
              {i < current ? '⭐' : '☆'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
