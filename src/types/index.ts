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

  // Error handling
  lastError: string | null;
  setError: (error: string | null) => void;

  // Session controls
  resetSession: () => void;
  skipToChallenge: (index: number) => void;
}
