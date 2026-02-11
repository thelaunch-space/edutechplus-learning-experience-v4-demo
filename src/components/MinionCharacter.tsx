import styles from './MinionCharacter.module.css';

interface MinionCharacterProps {
  visible: boolean;
}

export function MinionCharacter({ visible }: MinionCharacterProps) {
  return (
    <div className={`${styles.minion} ${visible ? styles.visible : styles.hidden}`}>
      <img
        src="/tutor-assets/bot.png"
        alt="Bot companion"
        className={styles.minionImage}
        draggable={false}
      />
    </div>
  );
}
