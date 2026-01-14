export type SessionPhase =
  | 'GREETING'
  | 'PRE_CHALLENGE'
  | 'IN_CHALLENGE'
  | 'POST_CHALLENGE'
  | 'COMPLETE';

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
  type: 'video' | 'applet';
  path: string;
  title: string;
  duration: string;
  preScript: string;
  postQuestion: string;
  contextInfo: string;
  // Iteration 2: Multi-turn conversation support
  correctnessFilter: string;
  scaffolding: Scaffolding;
  maxTurns: number;
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
