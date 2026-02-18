import { ChatHistory } from './ChatHistory';
import { Waveform } from './Waveform';
import type { ChatMessage } from '../store/sessionStore';
import type { VoiceState } from '../types';
import styles from './ChatPane.module.css';

interface ChatPaneProps {
  messages: ChatMessage[];
  currentMessage?: string;
  voiceState: VoiceState;
  currentSpeaker: 'max' | 'spark';
}

// Map voiceState to waveform variant
function getWaveformVariant(voiceState: VoiceState): 'speaking' | 'recording' | 'waiting' | 'idle' {
  switch (voiceState) {
    case 'MATH_MATE_SPEAKING': return 'speaking';
    case 'WAITING_FOR_STUDENT': return 'waiting';
    case 'STUDENT_RECORDING': return 'recording';
    default: return 'idle';
  }
}

export function ChatPane({ messages, currentMessage, voiceState, currentSpeaker }: ChatPaneProps) {
  const waveformVariant = getWaveformVariant(voiceState);

  return (
    <div className={styles.container}>
      <div className={styles.waveformArea}>
        <Waveform
          variant={waveformVariant}
          speaker={waveformVariant === 'speaking' ? currentSpeaker : undefined}
          size="medium"
        />
      </div>
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
