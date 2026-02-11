import styles from './OnboardingWelcome.module.css';

export function OnboardingWelcome() {
  return (
    <div className={styles.container}>
      <div className={styles.decorTop}>&#x00BD; &nbsp; &#x00BC; &nbsp; &#x00BE;</div>
      <h1 className={styles.heading}>Welcome to Fractions!</h1>
      <p className={styles.subtitle}>Your adventure begins!</p>
      <div className={styles.decorBottom}>&#9733; &#9733; &#9733;</div>
    </div>
  );
}
