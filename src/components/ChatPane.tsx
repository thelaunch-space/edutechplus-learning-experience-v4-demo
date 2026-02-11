import { ChatHistory } from './ChatHistory';
import type { ChatMessage } from '../store/sessionStore';
import type { VoiceState } from '../types';
import styles from './ChatPane.module.css';

interface ChatPaneProps {
  messages: ChatMessage[];
  currentMessage?: string;
  voiceState: VoiceState;
}

export function ChatPane({ messages, currentMessage, voiceState }: ChatPaneProps) {
  return (
    <div className={styles.container}>
      <div className={styles.historyWrapper}>
        <ChatHistory
          messages={messages}
          currentMessage={currentMessage}
          voiceState={voiceState}
        />
      </div>
    </div>
  );
}
