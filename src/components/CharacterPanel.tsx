import { useEffect, useRef, useCallback } from 'react';
import type { VoiceState } from '../types';
import styles from './CharacterPanel.module.css';

type VisualizerState = 'speaking' | 'listening' | 'recording' | 'processing' | 'idle';

interface CharacterPanelProps {
  voiceState: VoiceState;
  currentSpeaker: 'max' | 'spark';
}

const BAR_COUNT = 24;

function mapVoiceState(voiceState: VoiceState): VisualizerState {
  switch (voiceState) {
    case 'MATH_MATE_SPEAKING': return 'speaking';
    case 'WAITING_FOR_STUDENT': return 'listening';
    case 'STUDENT_RECORDING': return 'recording';
    case 'PROCESSING': return 'processing';
    default: return 'idle';
  }
}

function getActiveCharacter(voiceState: VoiceState, currentSpeaker: 'max' | 'spark'): 'max' | 'spark' | 'student' {
  if (voiceState === 'STUDENT_RECORDING' || voiceState === 'WAITING_FOR_STUDENT') return 'student';
  return currentSpeaker;
}

export function CharacterPanel({ voiceState, currentSpeaker }: CharacterPanelProps) {
  const barsRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const visualizerState = mapVoiceState(voiceState);
  const activeCharacter = getActiveCharacter(voiceState, currentSpeaker);

  const animate = useCallback(() => {
    if (!barsRef.current) return;
    const bars = barsRef.current.children;
    if (!bars.length) return;

    const now = performance.now() * 0.001;
    const center = (BAR_COUNT - 1) / 2;

    for (let i = 0; i < bars.length; i++) {
      const bar = bars[i] as HTMLElement;
      const distFromCenter = Math.abs(i - center) / center;
      let height: number;

      switch (visualizerState) {
        case 'speaking': {
          // Organic wave emanating from center — layered sine waves
          const wave1 = Math.sin(now * 5.5 - distFromCenter * 4) * 0.4;
          const wave2 = Math.sin(now * 8.2 + i * 0.7) * 0.2;
          const wave3 = Math.sin(now * 3.1 - i * 0.3) * 0.15;
          const envelope = 1 - distFromCenter * 0.35;
          const combined = (wave1 + wave2 + wave3) * 0.5 + 0.55;
          height = 12 + combined * 78 * envelope;
          break;
        }
        case 'recording': {
          // Energetic voice bars — randomized, reactive feel
          const base = Math.sin(now * 4.8 + i * 0.6) * 0.35;
          const jitter = Math.sin(now * 13.5 + i * 1.8) * 0.25;
          const pulse = Math.sin(now * 2.3) * 0.1;
          const combined = (base + jitter + pulse) * 0.5 + 0.55;
          height = 15 + combined * 75;
          break;
        }
        case 'listening': {
          // Gentle breathing invitation
          const breathe = Math.sin(now * 1.8 + i * 0.25) * 0.35 + 0.5;
          const ripple = Math.sin(now * 3.2 - distFromCenter * 2) * 0.1;
          height = 10 + (breathe + ripple) * 30;
          break;
        }
        case 'processing': {
          // Pulsing wave — thinking/loading feel
          const sweep = Math.sin(now * 3 - i * 0.3) * 0.3;
          const pulse = Math.sin(now * 1.5) * 0.25 + 0.5;
          height = 10 + (sweep + pulse) * 35;
          break;
        }
        default: {
          // Idle — barely-there ambient breath
          const wave = Math.sin(now * 1.2 + i * 0.35) * 0.2 + 0.5;
          height = 6 + wave * 14;
          break;
        }
      }

      bar.style.height = `${Math.max(4, Math.min(95, height))}%`;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [visualizerState]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  const characterLabel = activeCharacter === 'max' ? 'Max' : activeCharacter === 'spark' ? 'Spark' : 'You';
  const stateLabel = visualizerState === 'speaking' ? 'Speaking' :
    visualizerState === 'recording' ? 'Recording' :
    visualizerState === 'listening' ? 'Listening' :
    visualizerState === 'processing' ? 'Thinking' : '';

  return (
    <div className={styles.panel}>
      {/* Character avatar */}
      <div className={`${styles.avatarZone} ${styles[activeCharacter]}`}>
        <div className={`${styles.avatar} ${styles[`avatar_${activeCharacter}`]} ${visualizerState === 'speaking' || visualizerState === 'recording' ? styles.avatarActive : ''}`}>
          <span className={styles.avatarInitial}>
            {activeCharacter === 'max' ? 'M' : activeCharacter === 'spark' ? 'S' : 'Y'}
          </span>
        </div>
        <div className={styles.characterMeta}>
          <span className={styles.characterName}>{characterLabel}</span>
          {stateLabel && (
            <span className={`${styles.stateLabel} ${styles[`state_${visualizerState}`]}`}>
              {visualizerState === 'recording' && <span className={styles.recDot} />}
              {stateLabel}
            </span>
          )}
        </div>
      </div>

      {/* Bar visualizer */}
      <div className={`${styles.visualizer} ${styles[`vis_${visualizerState}`]} ${styles[`vis_${activeCharacter}`]}`} ref={barsRef}>
        {Array.from({ length: BAR_COUNT }, (_, i) => (
          <div key={i} className={styles.bar} style={{ height: '8%' }} />
        ))}
      </div>
    </div>
  );
}
