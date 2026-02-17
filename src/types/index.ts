export type SessionPhase =
  | 'ONBOARDING'
  | 'PRE_CHALLENGE'
  | 'IN_CHALLENGE'
  | 'POST_CHALLENGE'
  | 'COMPLETE';

// Checkpoint slide frame states
export type CheckpointFrame = 'intro' | 'question' | 'scaffold' | 'celebration';

// Checkpoint identifiers
export type CheckpointId = 'lo1' | 'lo2' | 'lo3' | 'lo4' | 'lo5';

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

// Goofy moment script (legacy standalone goofy nodes)
export interface GoofyMomentScript {
  tutorLine: string;
  minionLine?: string;
  showMinion: boolean;
}

// Minion moment — embedded Spark interjection before a node's preScript
// Minion speaks first, tutor responds. Plays before preScript.
export interface MinionMoment {
  minionLine: string;   // Spark/minion speaks first
  tutorLine: string;    // Max/tutor responds
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
  scaffold?: string;   // Turn 4: Strong scaffold (optional — some nodes skip straight to reveal)
  reveal: string;      // Turn 5: Warm answer reveal
}

// ===== DYNAMIC QUESTION SLIDE TYPES =====

// Template types for the 3 reusable dynamic question slide patterns
export type DynamicSlideTemplate = 'fraction-builder' | 'multiple-choice' | 'tap-to-select';

// Generic frame for dynamic question slides (simpler than FractionCompareSlide's 5 frames)
export type QuestionSlideFrame = 'question' | 'scaffold' | 'reveal';

// FractionBuilder: tap pieces to count → number fills fraction slot
export interface FractionBuilderConfig {
  shape: 'pizza' | 'bar';
  totalPieces: number;
  highlightedPieces: number;
  fractionAnswer: string;    // e.g. "1/4"
  fractionLabel: string;     // e.g. "One-fourth!"
  questionText: string;
}

// MultipleChoice: tap word/answer buttons
export interface MultipleChoiceConfig {
  questionText: string;
  fractionDisplay: string;         // e.g. "3/4"
  highlightPosition: 'numerator' | 'denominator';
  choices: string[];
  correctIndex: number;
  visual: {
    type: 'cake' | 'bar';
    totalPieces: number;
    highlightedPieces: number;
  };
  scaffoldHint: string;            // fallback hint if no per-choice hint
  choiceHints?: string[];          // per-choice wrong feedback (same length as choices)
  revealLabel: string;             // e.g. "Numerator = counts pieces you HAVE"
  bonusLabel?: string;             // e.g. "Denominator = total pieces" (shown dimmer)
}

// TapToSelect: tap the correct option from 2 visual options
export interface TapToSelectConfig {
  questionText: string;
  options: Array<{
    label: string;
    isCorrect: boolean;
    visual: {
      type: 'bar';
      totalPieces: number;
      highlightedPieces: number;
      displayedPieces?: number;    // For "wrong" diagrams (e.g. labeled 2/6 but shows 4 pieces)
      isEqual: boolean;            // Whether pieces are equal size
    };
  }>;
  correctFeedback: string;
  wrongFeedback: string;
  revealText: string;
}

// Unified state tracked in store for all dynamic question slide interactions
export interface QuestionSlideState {
  // FractionBuilder state
  tappedPieces: number[];
  numeratorFilled: boolean;
  denominatorFilled: boolean;
  // MultipleChoice state
  selectedIndex: number | null;
  eliminatedIndices: number[];
  // TapToSelect state
  inspecting: boolean;
  countedPieces: number[];
}

export const INITIAL_QUESTION_SLIDE_STATE: QuestionSlideState = {
  tappedPieces: [],
  numeratorFilled: false,
  denominatorFilled: false,
  selectedIndex: null,
  eliminatedIndices: [],
  inspecting: false,
  countedPieces: [],
};

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
  dynamicSlideTemplate?: DynamicSlideTemplate;  // Which template to use for dynamic question slides
  dynamicSlideId?: string;   // Key into dynamicSlideContent config
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
  minionMoment?: MinionMoment;
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
