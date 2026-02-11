export type SessionPhase =
  | 'ONBOARDING'
  | 'PRE_CHALLENGE'
  | 'IN_CHALLENGE'
  | 'POST_CHALLENGE'
  | 'COMPLETE';

// Checkpoint slide frame states
export type CheckpointFrame = 'intro' | 'question' | 'scaffold' | 'celebration';

// Checkpoint identifiers
export type CheckpointId = 'lo1' | 'lo2' | 'lo3';

// Dynamic slide frame states for FractionCompareSlide
export type SlideFrame =
  | 'question'      // Initial: just question + labels
  | 'cut'           // Show rectangles, wait for taps to split
  | 'highlight'     // Rectangles split, tap to highlight pieces
  | 'compare'       // Piece counts visible, ask question again
  | 'celebration';  // Answer revealed, confetti

// Interaction state for dynamic slide tap tracking
export interface SlideInteractionState {
  leftTapped: boolean;
  rightTapped: boolean;
  leftHighlighted: boolean;
  rightHighlighted: boolean;
}

// Tutor expression states (maps to character PNGs)
export type TutorExpression = 'neutral' | 'greeting' | 'celebration' | 'encouragement' | 'giggling' | 'listening' | 'nudging';

// Goofy moment script
export interface GoofyMomentScript {
  tutorLine: string;
  minionLine?: string;
  showMinion: boolean;
}

export type VoiceState =
  | 'IDLE'
  | 'MATH_MATE_SPEAKING'
  | 'WAITING_FOR_STUDENT'
  | 'STUDENT_RECORDING'
  | 'PROCESSING'
  | 'ERROR';

// Socratic scaffolding for turn-aware teaching
export interface Scaffolding {
  probe1: string;      // Turn 1: Probing question
  probe2: string;      // Turn 2: Different probe angle
  hint: string;        // Turn 3: Directional hint
  scaffold: string;    // Turn 4: Strong scaffold (fill-in-blank)
  reveal: string;      // Turn 5: Warm answer reveal
}

export interface Challenge {
  id: string;
  number: number;
  type: 'video' | 'applet' | 'slide' | 'onboarding' | 'checkpoint' | 'goofy';
  path: string;
  youtubeId?: string;  // For video type challenges (YouTube embed)
  slideUrl?: string;   // For slide type challenges (image path)
  slideNarration?: string;  // TTS narration content for narration slides
  isQuestionSlide?: boolean;  // True for question slides, false for narration slides
  hasDynamicSlide?: boolean;  // True if this challenge uses interactive dynamic slide for post-challenge
  title: string;
  duration: string;
  preScript: string;
  postQuestion: string;
  contextInfo: string;
  // Iteration 2: Multi-turn conversation support
  correctnessFilter?: string;
  scaffolding?: Scaffolding;
  maxTurns: number;
  isCheckpoint?: boolean;
  checkpointLO?: string;
  checkpointId?: CheckpointId;
  goofyScript?: GoofyMomentScript;
}

export interface EvaluationResult {
  response: string;
  isCorrect: boolean;
  shouldEnd: boolean;
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface SessionState {
  // Student info
  studentName: string;
  setStudentName: (name: string) => void;

  // Challenge progress
  currentChallengeIndex: number;
  challenges: Challenge[];
  getCurrentChallenge: () => Challenge | null;
  goToNextChallenge: () => void;

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
