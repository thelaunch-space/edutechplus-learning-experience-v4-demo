import { useCallback, useState } from 'react';
import { useMicrophone } from './useMicrophone';
import { transcribeAudio } from '../services/deepgram';
import { speakText } from '../services/tts';
import { generateResponse, generateGreeting } from '../services/openrouter';
import { useSessionStore } from '../store/sessionStore';
import type { VoiceState } from '../types';

const RECORDING_DURATION_MS = 5000; // 5 seconds max recording

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
  error: string | null;

  // High-level interactions
  runGreetingInteraction: () => Promise<void>;
  runPreChallengeInteraction: () => Promise<void>;
  runPostChallengeInteraction: () => Promise<void>;

  // Low-level controls
  speak: (text: string) => Promise<void>;
  listenAndRespond: (question: string, contextInfo: string) => Promise<string>;
}

export function useVoiceInteraction(): UseVoiceInteractionReturn {
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [lastTranscript, setLastTranscript] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { startRecording, stopRecording, requestPermission } = useMicrophone();

  const {
    studentName,
    setStudentName,
    getCurrentChallenge,
    setPhase,
    goToNextChallenge,
  } = useSessionStore();

  // Speak text using TTS
  const speak = useCallback(async (text: string): Promise<void> => {
    try {
      console.log('🎤 Voice: Math Mate speaking:', text.substring(0, 50) + '...');
      setVoiceState('MATH_MATE_SPEAKING');
      setLastResponse(text);
      await speakText(text);
      console.log('✅ Voice: Math Mate finished speaking');
      setVoiceState('IDLE');
    } catch (err) {
      console.error('❌ Voice: Speech error:', err);
      setVoiceState('ERROR');
      setError('Failed to play audio');
    }
  }, []);

  // Record and transcribe student speech
  const listenAndTranscribe = useCallback(async (): Promise<string> => {
    try {
      setVoiceState('WAITING_FOR_STUDENT');

      // Ensure we have mic permission
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        setError('Microphone access needed');
        return '';
      }

      setVoiceState('STUDENT_RECORDING');
      await startRecording();

      // Record for specified duration
      await new Promise(resolve => setTimeout(resolve, RECORDING_DURATION_MS));

      const audioBlob = await stopRecording();

      if (!audioBlob || audioBlob.size === 0) {
        console.warn('No audio recorded');
        return '';
      }

      setVoiceState('PROCESSING');
      const transcript = await transcribeAudio(audioBlob);
      setLastTranscript(transcript);

      return transcript;
    } catch (err) {
      console.error('Listen error:', err);
      setVoiceState('ERROR');
      return '';
    }
  }, [startRecording, stopRecording, requestPermission]);

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

  // Post-challenge interaction (ask question, get response)
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

      // Ask the post-challenge question
      console.log('🎤 Post-Challenge: Step 1 - Asking question...');
      await speak(challenge.postQuestion);

      // Wait a moment
      console.log('⏱️ Post-Challenge: Waiting 500ms before listening...');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Listen for student's response
      console.log('👂 Post-Challenge: Step 2 - Listening for student response...');
      const transcript = await listenAndTranscribe();
      console.log('📝 Post-Challenge: Got transcript:', transcript);

      // Generate contextual response
      console.log('🤖 Post-Challenge: Step 3 - Generating response from LLM...');
      setVoiceState('PROCESSING');
      const response = await generateResponse(
        transcript,
        studentName,
        challenge.number,
        challenge.postQuestion,
        challenge.contextInfo
      );
      console.log('✅ Post-Challenge: Got LLM response:', response);

      // Speak the response
      console.log('🎤 Post-Challenge: Step 4 - Speaking response');
      await speak(response);

      // Longer pause before moving to next challenge
      console.log('⏱️ Post-Challenge: Waiting 1000ms before moving to next challenge...');
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
  }, [speak, listenAndTranscribe, getCurrentChallenge, studentName, goToNextChallenge, setPhase]);

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
    error,
    runGreetingInteraction,
    runPreChallengeInteraction,
    runPostChallengeInteraction,
    speak,
    listenAndRespond,
  };
}
