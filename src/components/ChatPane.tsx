import { ChatHistory } from './ChatHistory';
import type { ChatMessage } from '../store/sessionStore';
import type { VoiceState } from '../types';
import styles from './ChatPane.module.css';

interface ChatPaneProps {
  messages: ChatMessage[];
  currentMessage?: string;
  voiceState: VoiceState;
  onPTTStart: () => void;
  onPTTEnd: () => void;
  isOverlay?: boolean;
}

export function ChatPane({
  messages,
  currentMessage,
  voiceState,
  onPTTStart,
  onPTTEnd,
  isOverlay = false,
}: ChatPaneProps) {
  const showPTT = voiceState === 'WAITING_FOR_STUDENT' || voiceState === 'STUDENT_RECORDING';
  const isRecording = voiceState === 'STUDENT_RECORDING';

  return (
    <div className={`${styles.container} ${isOverlay ? styles.overlay : ''}`}>
      {/* Chat history with typing indicator integrated */}
      <div className={styles.historyWrapper}>
        <ChatHistory
          messages={messages}
          currentMessage={currentMessage}
          voiceState={voiceState}
        />
      </div>

      {/* PTT Button */}
      {showPTT && (
        <div className={styles.pttContainer}>
          <button
            className={`${styles.pttButton} ${isRecording ? styles.pttActive : ''}`}
            onMouseDown={onPTTStart}
            onMouseUp={onPTTEnd}
            onMouseLeave={onPTTEnd}
            onTouchStart={(e) => {
              e.preventDefault();
              onPTTStart();
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              onPTTEnd();
            }}
          >
            <span className={styles.pttIcon}>🎤</span>
            <span className={styles.pttText}>
              {isRecording ? 'Listening...' : 'Hold to Talk'}
            </span>
            {isRecording && (
              <div className={styles.waveform}>
                <div className={styles.waveBar} />
                <div className={styles.waveBar} />
                <div className={styles.waveBar} />
                <div className={styles.waveBar} />
                <div className={styles.waveBar} />
              </div>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
