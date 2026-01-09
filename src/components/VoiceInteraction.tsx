import { useEffect } from 'react';
import { MathMateAvatar } from './MathMateAvatar';
import styles from './VoiceInteraction.module.css';
import type { VoiceState } from '../types';

interface VoiceInteractionProps {
  voiceState: VoiceState;
  message: string;
  onStart?: () => void;
}

export function VoiceInteraction({ voiceState, message, onStart }: VoiceInteractionProps) {
  // Auto-start the interaction when component mounts
  useEffect(() => {
    if (onStart && voiceState === 'IDLE') {
      const timer = setTimeout(() => {
        onStart();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const getStatusText = () => {
    switch (voiceState) {
      case 'MATH_MATE_SPEAKING':
        return 'Math Mate is talking...';
      case 'WAITING_FOR_STUDENT':
        return 'Your turn! Say something!';
      case 'STUDENT_RECORDING':
        return '🎤 Listening...';
      case 'PROCESSING':
        return 'Thinking...';
      case 'ERROR':
        return 'Oops! Let me try again...';
      default:
        return 'Get ready!';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <MathMateAvatar state={voiceState} size="large" />

        <div className={styles.statusBubble}>
          <span className={styles.statusText}>{getStatusText()}</span>
        </div>

        {message && (
          <div className={styles.messageBubble}>
            <p className={styles.message}>{message}</p>
          </div>
        )}

        {voiceState === 'STUDENT_RECORDING' && (
          <div className={styles.recordingIndicator}>
            <div className={styles.recordingDot} />
            <div className={styles.recordingDot} />
            <div className={styles.recordingDot} />
          </div>
        )}
      </div>
    </div>
  );
}
