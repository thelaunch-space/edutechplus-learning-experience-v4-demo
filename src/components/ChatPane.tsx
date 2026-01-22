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
      {/* Chat history */}
      <div className={styles.historyWrapper}>
        <ChatHistory messages={messages} currentMessage={currentMessage} />
      </div>

      {/* Status indicator */}
      <div className={styles.statusBar}>
        {voiceState === 'MATH_MATE_SPEAKING' && (
          <span className={styles.statusText}>
            <span className={styles.statusDot} />
            Math Mate is talking...
          </span>
        )}
        {voiceState === 'PROCESSING' && (
          <span className={styles.statusText}>
            <span className={styles.statusDot} />
            Thinking...
          </span>
        )}
        {voiceState === 'WAITING_FOR_STUDENT' && (
          <span className={styles.statusText}>Your turn!</span>
        )}
        {voiceState === 'STUDENT_RECORDING' && (
          <span className={`${styles.statusText} ${styles.recording}`}>
            <span className={styles.recordingDot} />
            Listening...
          </span>
        )}
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
