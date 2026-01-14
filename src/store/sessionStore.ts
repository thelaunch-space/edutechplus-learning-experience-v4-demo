import { create } from 'zustand';
import { challenges } from '../config/challenges';
import type { SessionPhase, VoiceState, Challenge, Message } from '../types';

interface SessionState {
  // Student info
  studentName: string;
  setStudentName: (name: string) => void;

  // Challenge progress
  currentChallengeIndex: number;
  challenges: Challenge[];
  getCurrentChallenge: () => Challenge | null;
  goToNextChallenge: () => boolean;

  // Session phase
  phase: SessionPhase;
  setPhase: (phase: SessionPhase) => void;

  // Voice state
  voiceState: VoiceState;
  setVoiceState: (state: VoiceState) => void;

  // Conversation history per challenge
  conversationHistory: Record<string, Message[]>;
  addMessage: (challengeId: string, message: Message) => void;
  getConversationHistory: (challengeId: string) => Message[];

  // Turn tracking for multi-turn conversations
  currentTurn: number;
  resetTurn: () => void;
  incrementTurn: () => void;

  // Error handling
  lastError: string | null;
  setError: (error: string | null) => void;

  // Session controls
  resetSession: () => void;
  skipToChallenge: (index: number) => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  // Student info
  studentName: 'Friend',
  setStudentName: (name) => set({ studentName: name || 'Friend' }),

  // Challenge progress
  currentChallengeIndex: 0,
  challenges: challenges,
  getCurrentChallenge: () => {
    const { currentChallengeIndex, challenges } = get();
    return challenges[currentChallengeIndex] || null;
  },
  goToNextChallenge: () => {
    const state = get();
    const nextIndex = state.currentChallengeIndex + 1;
    const isComplete = nextIndex >= state.challenges.length;
    if (!isComplete) {
      set({ currentChallengeIndex: nextIndex });
    }
    return isComplete;
  },

  // Session phase
  phase: 'GREETING',
  setPhase: (phase) => set({ phase }),

  // Voice state
  voiceState: 'IDLE',
  setVoiceState: (voiceState) => set({ voiceState }),

  // Conversation history
  conversationHistory: {},
  addMessage: (challengeId, message) => set((state) => ({
    conversationHistory: {
      ...state.conversationHistory,
      [challengeId]: [...(state.conversationHistory[challengeId] || []), message]
    }
  })),
  getConversationHistory: (challengeId) => get().conversationHistory[challengeId] || [],

  // Turn tracking
  currentTurn: 0,
  resetTurn: () => set({ currentTurn: 0 }),
  incrementTurn: () => set((state) => ({ currentTurn: state.currentTurn + 1 })),

  // Error handling
  lastError: null,
  setError: (lastError) => set({ lastError }),

  // Session controls
  resetSession: () => set({
    studentName: 'Friend',
    currentChallengeIndex: 0,
    phase: 'GREETING',
    voiceState: 'IDLE',
    conversationHistory: {},
    currentTurn: 0,
    lastError: null
  }),
  skipToChallenge: (index) => set({
    currentChallengeIndex: Math.min(index, challenges.length - 1),
    phase: 'PRE_CHALLENGE'
  })
}));
