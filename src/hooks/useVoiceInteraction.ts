import { useCallback, useState, useRef } from 'react';
import { useMicrophone } from './useMicrophone';
import { transcribeAudio } from '../services/deepgram';
import { speakText } from '../services/tts';
import { generateResponse, generateGreeting, generateEvaluatedResponse } from '../services/openrouter';
import { useSessionStore } from '../store/sessionStore';
import type { VoiceState } from '../types';

const MAX_RECORDING_MS = 15000; // 15 seconds safety cap for PTT

// Extract name from transcript like "I'm Krishna Gautam" -> "Krishna"
function extractName(transcript: string): string {
  if (!transcript.trim()) return 'Friend';

  // Remove common prefixes
  const cleaned = transcript
    .replace(/^(i'm|i am|my name is|this is|hey|hi|hello|it's|its)\s*/i, '')
    .trim();

  // Take first word as name
  const words = cleaned.split(/\s+/);
  const name = words[0] || 'Friend';

  // Remove any punctuation and capitalize
  const cleanName = name.replace(/[.,!?]/g, '');

  if (!cleanName) return 'Friend';

  // Capitalize first letter
  return cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
}

interface UseVoiceInteractionReturn {
  voiceState: VoiceState;
  lastTranscript: string;
  lastResponse: string;
  displayedText: string; // Word-by-word revealed text
  error: string | null;

  // High-level interactions
  runGreetingInteraction: () => Promise<void>;
  runPreChallengeInteraction: () => Promise<void>;
  runPostChallengeInteraction: () => Promise<void>;

  // Low-level controls
  speak: (text: string) => Promise<void>;
  listenAndRespond: (question: string, contextInfo: string) => Promise<string>;

  // PTT (Push-to-Talk) controls
  handlePTTStart: () => Promise<void>;
  handlePTTEnd: () => Promise<void>;
}

export function useVoiceInteraction(): UseVoiceInteractionReturn {
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [lastTranscript, setLastTranscript] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [error, setError] = useState<string | null>(null);

  // PTT (Push-to-Talk) refs
  const pttResolverRef = useRef<((blob: Blob | null) => void) | null>(null);
  const pttTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { startRecording, stopRecording, requestPermission } = useMicrophone();

  const {
    studentName,
    setStudentName,
    getCurrentChallenge,
    setPhase,
    goToNextChallenge,
    resetTurn,
    incrementTurn,
    addMessage,
    getConversationHistory,
  } = useSessionStore();

  // Speak text using TTS with word-by-word reveal
  const speak = useCallback(async (text: string): Promise<void> => {
    try {
      console.log('🎤 Voice: Math Mate speaking:', text.substring(0, 50) + '...');
      setVoiceState('MATH_MATE_SPEAKING');
      setLastResponse(text);
      setDisplayedText(''); // Clear previous text

      const words = text.split(' ');
      const avgWordDuration = 280; // ~280ms per word for natural TTS pace

      // Start TTS playback (don't await yet)
      const ttsPromise = speakText(text);

      // Progressively reveal words
      for (let i = 0; i < words.length; i++) {
        setDisplayedText(words.slice(0, i + 1).join(' '));
        await new Promise(resolve => setTimeout(resolve, avgWordDuration));
      }

      // Wait for TTS to finish
      await ttsPromise;

      console.log('✅ Voice: Math Mate finished speaking');
      setVoiceState('IDLE');
    } catch (err) {
      console.error('❌ Voice: Speech error:', err);
      setVoiceState('ERROR');
      setError('Failed to play audio');
    }
  }, []);

  // Helper to stop PTT recording (used by both handlePTTEnd and safety timeout)
  const stopPTTRecording = useCallback(async (): Promise<void> => {
    // Clear safety timeout
    if (pttTimeoutRef.current) {
      clearTimeout(pttTimeoutRef.current);
      pttTimeoutRef.current = null;
    }

    console.log('🎤 PTT: Stopping recording...');
    const audioBlob = await stopRecording();

    // Resolve the waiting promise with the audio blob
    if (pttResolverRef.current) {
      pttResolverRef.current(audioBlob);
      pttResolverRef.current = null;
    }
  }, [stopRecording]);

  // PTT Start: Called when user presses the talk button
  const handlePTTStart = useCallback(async (): Promise<void> => {
    try {
      console.log('🎤 PTT: Button pressed, starting recording...');

      // Ensure we have mic permission
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        setError('Microphone access needed');
        return;
      }

      setVoiceState('STUDENT_RECORDING');
      await startRecording();

      // Safety timeout - auto-stop after MAX_RECORDING_MS
      pttTimeoutRef.current = setTimeout(async () => {
        console.log('⏱️ PTT: Max recording time reached, auto-stopping...');
        await stopPTTRecording();
      }, MAX_RECORDING_MS);

    } catch (err) {
      console.error('❌ PTT Start error:', err);
      setVoiceState('ERROR');
      setError('Failed to start recording');
    }
  }, [startRecording, requestPermission, stopPTTRecording]);

  // PTT End: Called when user releases the talk button
  const handlePTTEnd = useCallback(async (): Promise<void> => {
    // Only process if we're actually recording
    if (voiceState !== 'STUDENT_RECORDING') {
      return;
    }

    try {
      await stopPTTRecording();
    } catch (err) {
      console.error('❌ PTT End error:', err);
      if (pttResolverRef.current) {
        pttResolverRef.current(null);
        pttResolverRef.current = null;
      }
    }
  }, [voiceState, stopPTTRecording]);

  // Wait for PTT input: Returns a Promise that resolves when user completes PTT
  const listenAndTranscribe = useCallback(async (): Promise<string> => {
    try {
      setVoiceState('WAITING_FOR_STUDENT');
      console.log('👂 Waiting for PTT input...');

      // Create a promise that will be resolved when PTT ends
      const audioBlob = await new Promise<Blob | null>((resolve) => {
        pttResolverRef.current = resolve;
      });

      if (!audioBlob || audioBlob.size === 0) {
        console.warn('No audio recorded');
        setVoiceState('IDLE');
        return '';
      }

      setVoiceState('PROCESSING');
      console.log('🔄 Transcribing audio...');
      const transcript = await transcribeAudio(audioBlob);
      setLastTranscript(transcript);

      return transcript;
    } catch (err) {
      console.error('Listen error:', err);
      setVoiceState('ERROR');
      return '';
    }
  }, []);

  // Full greeting interaction flow
  const runGreetingInteraction = useCallback(async (): Promise<void> => {
    try {
      console.log('👋 === GREETING INTERACTION START ===');
      setError(null);

      // Math Mate introduces itself and asks for name
      console.log('🎤 Greeting: Step 1 - Introducing Math Mate and asking name');
      await speak("Hi! I'm Math Mate, your friend! What's your name?");

      // Wait a moment
      console.log('⏱️ Greeting: Waiting 500ms before listening...');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Listen for student's name
      console.log('👂 Greeting: Step 2 - Listening for student name...');
      const transcript = await listenAndTranscribe();
      console.log('📝 Greeting: Got transcript:', transcript);

      // Extract name from transcript (handles "I'm Krishna Gautam" -> "Krishna")
      const name = extractName(transcript);
      console.log('✅ Greeting: Extracted name:', name);
      setStudentName(name);

      // Generate personalized greeting
      console.log('🤖 Greeting: Step 3 - Generating personalized greeting...');
      setVoiceState('PROCESSING');
      const greeting = await generateGreeting(name);
      console.log('✅ Greeting: Got greeting:', greeting);

      // Speak the greeting
      console.log('🎤 Greeting: Step 4 - Speaking personalized greeting');
      await speak(greeting);

      // Wait a bit before moving on to give breathing room
      console.log('⏱️ Greeting: Waiting 1000ms before moving to first challenge...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Move to first challenge
      console.log('✅ === GREETING COMPLETE === Moving to PRE_CHALLENGE');
      setPhase('PRE_CHALLENGE');
    } catch (err) {
      console.error('❌ Greeting interaction error:', err);
      setError('Something went wrong. Let\'s continue!');
      setStudentName('Friend');
      setPhase('PRE_CHALLENGE');
    }
  }, [speak, listenAndTranscribe, setStudentName, setPhase]);

  // Pre-challenge interaction (Math Mate introduces the challenge)
  const runPreChallengeInteraction = useCallback(async (): Promise<void> => {
    try {
      console.log('📢 === PRE-CHALLENGE INTERACTION START ===');
      setError(null);
      const challenge = getCurrentChallenge();

      if (!challenge) {
        console.log('❌ Pre-Challenge: No challenge found, moving to COMPLETE');
        setPhase('COMPLETE');
        return;
      }

      console.log(`🎯 Pre-Challenge: Challenge ${challenge.number} - ${challenge.title}`);
      console.log('🎤 Pre-Challenge: Speaking introduction...');

      // Speak the pre-script
      await speak(challenge.preScript);

      // Longer pause to ensure TTS completes and give breathing room
      console.log('⏱️ Pre-Challenge: Waiting 1500ms before starting challenge...');
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('✅ === PRE-CHALLENGE COMPLETE === Moving to IN_CHALLENGE');
      setPhase('IN_CHALLENGE');
    } catch (err) {
      console.error('❌ Pre-challenge interaction error:', err);
      setPhase('IN_CHALLENGE');
    }
  }, [speak, getCurrentChallenge, setPhase]);

  // Post-challenge interaction with multi-turn loop
  const runPostChallengeInteraction = useCallback(async (): Promise<void> => {
    try {
      console.log('💬 === POST-CHALLENGE INTERACTION START ===');
      setError(null);
      const challenge = getCurrentChallenge();

      if (!challenge) {
        console.log('❌ Post-Challenge: No challenge found, moving to COMPLETE');
        setPhase('COMPLETE');
        return;
      }

      console.log(`🎯 Post-Challenge: Challenge ${challenge.number} - ${challenge.title}`);
      console.log(`📊 Max turns: ${challenge.maxTurns}, Correctness filter: ${challenge.correctnessFilter}`);

      // Reset turn counter for this challenge
      resetTurn();

      // Ask the initial question
      console.log('🎤 Post-Challenge: Asking initial question...');
      await speak(challenge.postQuestion);

      // Multi-turn conversation loop
      let shouldContinue = true;
      let turnCount = 0;
      const maxSafetyTurns = challenge.maxTurns + 1; // Safety cap

      while (shouldContinue && turnCount < maxSafetyTurns) {
        console.log(`\n🔄 Turn ${turnCount + 1} of ${challenge.maxTurns}`);

        // Wait before listening
        await new Promise(resolve => setTimeout(resolve, 500));

        // Listen for student's response
        console.log('👂 Listening for student response...');
        const transcript = await listenAndTranscribe();
        console.log('📝 Got transcript:', transcript);

        // Get conversation history for context
        const conversationHistory = getConversationHistory(challenge.id);

        // Generate evaluated response
        console.log('🤖 Evaluating response with LLM...');
        setVoiceState('PROCESSING');
        const result = await generateEvaluatedResponse(
          transcript,
          studentName,
          challenge.correctnessFilter,
          challenge.scaffolding,
          turnCount,
          challenge.maxTurns,
          conversationHistory
        );
        console.log('✅ Evaluation result:', result);

        // Add messages to conversation history
        addMessage(challenge.id, { role: 'user', content: transcript });
        addMessage(challenge.id, { role: 'assistant', content: result.response });

        // Speak the response
        console.log('🎤 Speaking response:', result.response);
        await speak(result.response);

        // Check exit conditions
        if (result.isCorrect) {
          console.log('✅ Student answered correctly!');
          shouldContinue = false;
        } else if (result.shouldEnd) {
          console.log('⏹️ LLM signaled to end conversation');
          shouldContinue = false;
        } else if (turnCount >= challenge.maxTurns - 1) {
          console.log('⏹️ Max turns reached');
          shouldContinue = false;
        } else {
          // Continue to next turn
          incrementTurn();
          turnCount++;
        }
      }

      // Pause before moving to next challenge
      console.log('⏱️ Waiting 1000ms before moving to next challenge...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('✅ === POST-CHALLENGE COMPLETE === Moving to next challenge');
      const isComplete = goToNextChallenge();
      if (isComplete) {
        console.log('🏁 All challenges complete!');
        setPhase('COMPLETE');
      } else {
        console.log('➡️ Moving to PRE_CHALLENGE for next challenge');
        setPhase('PRE_CHALLENGE');
      }
    } catch (err) {
      console.error('❌ Post-challenge interaction error:', err);
      // On error, still move forward
      await speak("Good job! Let's continue!");
      const isComplete = goToNextChallenge();
      setPhase(isComplete ? 'COMPLETE' : 'PRE_CHALLENGE');
    }
  }, [speak, listenAndTranscribe, getCurrentChallenge, studentName, goToNextChallenge, setPhase, resetTurn, incrementTurn, addMessage, getConversationHistory]);

  // Listen and generate response (for custom interactions)
  const listenAndRespond = useCallback(async (
    question: string,
    contextInfo: string
  ): Promise<string> => {
    const transcript = await listenAndTranscribe();

    if (!transcript) {
      return "Great! Let's keep going!";
    }

    const challenge = getCurrentChallenge();
    const response = await generateResponse(
      transcript,
      studentName,
      challenge?.number || 0,
      question,
      contextInfo
    );

    return response;
  }, [listenAndTranscribe, getCurrentChallenge, studentName]);

  return {
    voiceState,
    lastTranscript,
    lastResponse,
    displayedText,
    error,
    runGreetingInteraction,
    runPreChallengeInteraction,
    runPostChallengeInteraction,
    speak,
    listenAndRespond,
    // PTT controls
    handlePTTStart,
    handlePTTEnd,
  };
}
