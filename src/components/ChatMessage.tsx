import styles from './ChatMessage.module.css';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isCurrentMessage?: boolean;
}

export function ChatMessage({ role, content, isCurrentMessage = false }: ChatMessageProps) {
  return (
    <div className={`${styles.messageWrapper} ${styles[role]}`}>
      <div className={`${styles.bubble} ${isCurrentMessage ? styles.current : ''}`}>
        {role === 'assistant' && (
          <span className={styles.avatar}>🤖</span>
        )}
        <p className={styles.content}>{content}</p>
      </div>
    </div>
  );
}
