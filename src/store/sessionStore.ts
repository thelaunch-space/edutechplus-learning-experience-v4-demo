import { create } from 'zustand';
import { challenges } from '../config/challenges';
import type { SessionPhase, VoiceState, Challenge, Message, SlideFrame, SlideInteractionState, TutorExpression, CheckpointFrame } from '../types';

// Module-level promise resolver for confetti completion
let confettiResolver: (() => void) | null = null;
let confettiPromise: Promise<void> | null = null;
let lastConfettiTime = 0;

// Extended message type for unified chat history
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

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

  // Unified chat history for UI display (across all phases)
  allMessages: ChatMessage[];
  addChatMessage: (role: 'user' | 'assistant', content: string) => void;
  clearChatMessages: () => void;

  // Turn tracking for multi-turn conversations
  currentTurn: number;
  resetTurn: () => void;
  incrementTurn: () => void;

  // Error handling
  lastError: string | null;
  setError: (error: string | null) => void;

  // Celebration state
  showConfetti: boolean;
  triggerConfetti: () => void;
  clearConfetti: () => void;
  waitForConfetti: () => Promise<void>;

  // Session controls
  resetSession: () => void;
  skipToChallenge: (index: number) => void;

  // Dynamic slide state (for FractionCompareSlide)
  dynamicSlideFrame: SlideFrame;
  setDynamicSlideFrame: (frame: SlideFrame) => void;
  slideInteractionState: SlideInteractionState;
  updateSlideInteraction: (update: Partial<SlideInteractionState>) => void;
  resetSlideState: () => void;

  // Tutor expression (maps to character PNGs)
  tutorExpression: TutorExpression;
  setTutorExpression: (expression: TutorExpression) => void;

  // Checkpoint slide state
  checkpointFrame: CheckpointFrame;
  setCheckpointFrame: (frame: CheckpointFrame) => void;

  // Minion visibility
  showMinion: boolean;
  setShowMinion: (show: boolean) => void;
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
  phase: 'ONBOARDING',
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

  // Unified chat history for UI
  allMessages: [],
  addChatMessage: (role, content) => set((state) => ({
    allMessages: [
      ...state.allMessages,
      {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        role,
        content,
        timestamp: Date.now()
      }
    ]
  })),
  clearChatMessages: () => set({ allMessages: [] }),

  // Turn tracking
  currentTurn: 0,
  resetTurn: () => set({ currentTurn: 0 }),
  incrementTurn: () => set((state) => ({ currentTurn: state.currentTurn + 1 })),

  // Error handling
  lastError: null,
  setError: (lastError) => set({ lastError }),

  // Celebration state
  showConfetti: false,
  triggerConfetti: () => {
    // Debounce confetti to prevent double-firing (6 second cooldown)
    const now = Date.now();
    if (now - lastConfettiTime < 6000) {
      console.log('⏸️ Confetti debounced (triggered too soon, cooldown active)');
      return;
    }
    lastConfettiTime = now;

    // Create a new promise that will resolve when confetti completes
    confettiPromise = new Promise<void>((resolve) => {
      confettiResolver = resolve;
    });
    set({ showConfetti: true });
  },
  clearConfetti: () => {
    set({ showConfetti: false });
    // Resolve the waiting promise if one exists
    if (confettiResolver) {
      confettiResolver();
      confettiResolver = null;
      confettiPromise = null;
    }
  },
  waitForConfetti: () => {
    // Return the current promise, or resolve immediately if no confetti is active
    return confettiPromise || Promise.resolve();
  },

  // Session controls
  resetSession: () => set({
    studentName: 'Friend',
    currentChallengeIndex: 0,
    phase: 'ONBOARDING',
    voiceState: 'IDLE',
    conversationHistory: {},
    allMessages: [],
    currentTurn: 0,
    lastError: null,
    showConfetti: false,
    dynamicSlideFrame: 'question',
    slideInteractionState: {
      leftTapped: false,
      rightTapped: false,
      leftHighlighted: false,
      rightHighlighted: false
    },
    tutorExpression: 'neutral',
    checkpointFrame: 'intro',
    showMinion: false,
  }),
  skipToChallenge: (index) => set({
    currentChallengeIndex: Math.min(index, challenges.length - 1),
    phase: 'PRE_CHALLENGE'
  }),

  // Dynamic slide state
  dynamicSlideFrame: 'question',
  setDynamicSlideFrame: (frame) => set({ dynamicSlideFrame: frame }),
  slideInteractionState: {
    leftTapped: false,
    rightTapped: false,
    leftHighlighted: false,
    rightHighlighted: false
  },
  updateSlideInteraction: (update) => set((state) => ({
    slideInteractionState: {
      ...state.slideInteractionState,
      ...update
    }
  })),
  resetSlideState: () => set({
    dynamicSlideFrame: 'question',
    slideInteractionState: {
      leftTapped: false,
      rightTapped: false,
      leftHighlighted: false,
      rightHighlighted: false
    }
  }),

  // Tutor expression
  tutorExpression: 'neutral' as TutorExpression,
  setTutorExpression: (expression) => set({ tutorExpression: expression }),

  // Checkpoint slide state
  checkpointFrame: 'intro' as CheckpointFrame,
  setCheckpointFrame: (frame) => set({ checkpointFrame: frame }),

  // Minion visibility
  showMinion: false,
  setShowMinion: (show) => set({ showMinion: show }),
}));
