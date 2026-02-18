import { ChatHistory } from './ChatHistory';
import type { ChatMessage } from '../store/sessionStore';
import type { VoiceState } from '../types';
import styles from './ChatPane.module.css';

interface ChatPaneProps {
  messages: ChatMessage[];
  currentMessage?: string;
  voiceState: VoiceState;
  currentSpeaker: 'max' | 'spark';
}

export function ChatPane({ messages, currentMessage, voiceState, currentSpeaker }: ChatPaneProps) {
  return (
    <div className={styles.container}>
      <div className={styles.historyWrapper}>
        <ChatHistory
          messages={messages}
          currentMessage={currentMessage}
          voiceState={voiceState}
          currentSpeaker={currentSpeaker}
        />
      </div>
    </div>
  );
}
