import styles from './ChatMessage.module.css';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  speaker?: 'max' | 'spark' | 'student';
  isCurrentMessage?: boolean;
}

function SpeakerAvatar({ speaker }: { speaker: 'max' | 'spark' | 'student' }) {
  if (speaker === 'max') {
    return (
      <div className={`${styles.avatar} ${styles.avatarMax}`}>
        <span className={styles.avatarInitial}>M</span>
      </div>
    );
  }
  if (speaker === 'spark') {
    return (
      <div className={`${styles.avatar} ${styles.avatarSpark}`}>
        <span className={styles.avatarInitial}>S</span>
      </div>
    );
  }
  return null;
}

export function ChatMessage({ role, content, speaker, isCurrentMessage = false }: ChatMessageProps) {
  const speakerClass = speaker ? styles[speaker] : '';

  return (
    <div className={`${styles.messageWrapper} ${styles[role]} ${speakerClass}`}>
      <div className={`${styles.bubble} ${isCurrentMessage ? styles.current : ''}`}>
        {role === 'assistant' && speaker && (
          <SpeakerAvatar speaker={speaker} />
        )}
        <p className={styles.content}>{content}</p>
      </div>
    </div>
  );
}
