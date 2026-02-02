import { useCallback, useState, useRef } from 'react';
import { useMicrophone } from './useMicrophone';
import { transcribeAudio } from '../services/deepgram';
import { speakText, type TTSResult } from '../services/tts';
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
  runSlideInteraction: () => Promise<void>;
  runFractionCompareInteraction: () => Promise<void>;

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
    addChatMessage,
    triggerConfetti,
    waitForConfetti,
    setDynamicSlideFrame,
    updateSlideInteraction,
    resetSlideState,
  } = useSessionStore();

  // Speak text using TTS with word-by-word reveal synchronized to audio
  const speak = useCallback(async (text: string): Promise<void> => {
    try {
      console.log('🎤 Voice: Math Mate speaking:', text.substring(0, 50) + '...');
      setVoiceState('MATH_MATE_SPEAKING');
      setLastResponse(text);
      setDisplayedText(''); // Clear previous text

      // DON'T add to chat history here - wait until speaking is done
      // to avoid duplicate display (word-by-word + full message)

      const words = text.split(' ');

      // Start TTS and wait for audio to BEGIN playing (returns when audio starts)
      const { duration, playbackDone }: TTSResult = await speakText(text);

      // Calculate word duration based on actual audio length
      // Use minimum 100ms per word to ensure readability even for fast audio
      const wordDuration = duration > 0
        ? Math.max(100, (duration * 1000) / words.length)
        : 280; // Fallback to 280ms if no duration available

      console.log(`📝 Typewriter: ${words.length} words, ${duration.toFixed(2)}s audio, ${wordDuration.toFixed(0)}ms/word`);

      // Progressively reveal words in sync with audio
      for (let i = 0; i < words.length; i++) {
        setDisplayedText(words.slice(0, i + 1).join(' '));
        await new Promise(resolve => setTimeout(resolve, wordDuration));
      }

      // Wait for audio to finish playing
      await playbackDone;

      // NOW add to chat history (after word-by-word reveal is complete)
      addChatMessage('assistant', text);

      // Clear displayedText since it's now in allMessages
      setDisplayedText('');

      console.log('✅ Voice: Math Mate finished speaking');
      setVoiceState('IDLE');
    } catch (err) {
      console.error('❌ Voice: Speech error:', err);
      setVoiceState('ERROR');
      setError('Failed to play audio');
    }
  }, [addChatMessage]);

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

      // Add student's response to chat history
      if (transcript.trim()) {
        addChatMessage('user', transcript);
      }

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
  }, [speak, listenAndTranscribe, setStudentName, setPhase, addChatMessage]);

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

  // Slide interaction with conditional multi-turn for question slides
  const runSlideInteraction = useCallback(async (): Promise<void> => {
    try {
      console.log('🖼️ === SLIDE INTERACTION START ===');
      setError(null);
      const challenge = getCurrentChallenge();

      if (!challenge) {
        console.log('❌ Slide: No challenge found, moving to COMPLETE');
        setPhase('COMPLETE');
        return;
      }

      if (challenge.type !== 'slide') {
        console.log('❌ Slide: Challenge is not a slide type, skipping');
        setPhase('IN_CHALLENGE');
        return;
      }

      console.log(`🎯 Slide: Challenge ${challenge.number} - ${challenge.title}`);
      console.log(`📊 Question slide: ${challenge.isQuestionSlide || false}`);

      // Speak the pre-script
      console.log('🎤 Slide: Speaking pre-script...');
      await speak(challenge.preScript);

      // Wait before showing slide
      console.log('⏱️ Slide: Waiting 1000ms before showing slide...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Set phase to show the slide
      console.log('✅ Slide: Setting phase to IN_CHALLENGE to display slide');
      setPhase('IN_CHALLENGE');

      // Wait a moment for slide to render
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if this is a narration slide or question slide
      if (challenge.isQuestionSlide === false) {
        // Narration slide - speak narration and auto-advance
        console.log('📢 Slide: Narration slide - speaking slideNarration...');
        if (challenge.slideNarration) {
          await speak(challenge.slideNarration);
        }

        // Wait before auto-advancing
        console.log('⏱️ Slide: Waiting 1500ms before auto-advancing...');
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Auto-advance to next challenge (NO CONFETTI for narration slides)
        console.log('✅ === NARRATION SLIDE COMPLETE === Moving to next challenge');
        const isComplete = goToNextChallenge();
        if (isComplete) {
          console.log('🏁 All challenges complete!');
          setPhase('COMPLETE');
        } else {
          console.log('➡️ Moving to PRE_CHALLENGE for next challenge');
          setPhase('PRE_CHALLENGE');
        }
      } else {
        // Question slide - run multi-turn Socratic dialogue
        console.log('❓ Slide: Question slide - starting multi-turn dialogue...');

        // Reset turn counter for this challenge
        resetTurn();

        // Ask the post question
        console.log('🎤 Slide: Asking question...');
        await speak(challenge.postQuestion);

        // Multi-turn conversation loop (same as runPostChallengeInteraction)
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

          // Add student's response to unified chat history
          if (transcript.trim()) {
            addChatMessage('user', transcript);
          }

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

        // Trigger celebration confetti
        console.log('🎉 Triggering celebration confetti!');
        triggerConfetti();

        // Wait for confetti animation to complete (5 seconds)
        console.log('⏱️ Waiting for confetti to complete...');
        await waitForConfetti();
        console.log('✅ Confetti complete!');

        // Move to next challenge
        console.log('✅ === QUESTION SLIDE COMPLETE === Moving to next challenge');
        const isComplete = goToNextChallenge();
        if (isComplete) {
          console.log('🏁 All challenges complete!');
          setPhase('COMPLETE');
        } else {
          console.log('➡️ Moving to PRE_CHALLENGE for next challenge');
          setPhase('PRE_CHALLENGE');
        }
      }
    } catch (err) {
      console.error('❌ Slide interaction error:', err);
      // On error, still move forward
      await speak("Good job! Let's continue!");
      const isComplete = goToNextChallenge();
      setPhase(isComplete ? 'COMPLETE' : 'PRE_CHALLENGE');
    }
  }, [speak, listenAndTranscribe, getCurrentChallenge, studentName, goToNextChallenge, setPhase, resetTurn, incrementTurn, addMessage, getConversationHistory, addChatMessage, triggerConfetti, waitForConfetti, setVoiceState, setError]);

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

        // Add student's response to unified chat history
        if (transcript.trim()) {
          addChatMessage('user', transcript);
        }

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
          // Pause after acknowledgement for student to process
          console.log('⏸️ Pausing 1 second to let student process acknowledgement...');
          await new Promise(resolve => setTimeout(resolve, 1000));
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

      // Trigger celebration confetti and wait for it to complete
      console.log('🎉 Triggering celebration confetti!');
      triggerConfetti();

      // Wait for confetti animation to complete (5 seconds)
      console.log('⏱️ Waiting for confetti to complete...');
      await waitForConfetti();
      console.log('✅ Confetti complete!');

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
  }, [speak, listenAndTranscribe, getCurrentChallenge, studentName, goToNextChallenge, setPhase, resetTurn, incrementTurn, addMessage, getConversationHistory, addChatMessage, triggerConfetti, waitForConfetti]);

  // Fraction Compare interaction with dynamic slide (Node 4 specific)
  const runFractionCompareInteraction = useCallback(async (): Promise<void> => {
    try {
      console.log('🎯 === FRACTION COMPARE INTERACTION START ===');
      setError(null);
      const challenge = getCurrentChallenge();

      if (!challenge) {
        console.log('❌ FractionCompare: No challenge found, moving to COMPLETE');
        setPhase('COMPLETE');
        return;
      }

      console.log(`🎯 FractionCompare: Challenge ${challenge.number} - ${challenge.title}`);

      // Reset slide state
      resetSlideState();

      // Set initial frame (question only - labels visible)
      setDynamicSlideFrame('question');

      // Wait for slide to render
      await new Promise(resolve => setTimeout(resolve, 500));

      // Speak the question
      console.log('🎤 FractionCompare: Asking question...');
      await speak(challenge.postQuestion);

      // Wait before listening
      await new Promise(resolve => setTimeout(resolve, 500));

      // Listen for student's first answer
      console.log('👂 FractionCompare: Listening for answer...');
      const transcript = await listenAndTranscribe();
      console.log('📝 FractionCompare: Got transcript:', transcript);

      // Add student's response to chat
      if (transcript.trim()) {
        addChatMessage('user', transcript);
      }

      // Check if correct using correctness filter
      const correctPattern = new RegExp(challenge.correctnessFilter, 'i');
      const isCorrect = correctPattern.test(transcript);

      if (isCorrect) {
        // PATH A: Correct first try - quick animated summary
        console.log('✅ FractionCompare: Correct! Running quick summary...');

        // Acknowledge
        await speak("Yes! Let's see why!");

        // Show cut frame with both rectangles auto-split
        setDynamicSlideFrame('cut');
        updateSlideInteraction({ leftTapped: true, rightTapped: true });
        await new Promise(resolve => setTimeout(resolve, 800));

        // Show highlight frame with both highlighted
        setDynamicSlideFrame('highlight');
        updateSlideInteraction({ leftHighlighted: true, rightHighlighted: true });
        await new Promise(resolve => setTimeout(resolve, 800));

        // Show compare frame
        setDynamicSlideFrame('compare');
        await new Promise(resolve => setTimeout(resolve, 600));

        // Speak summary
        await speak("1/4 has 4 pieces, and 1/6 has 6 pieces.");

        // Show celebration
        setDynamicSlideFrame('celebration');
        await speak("6 is more than 4, so 1/6 has MORE pieces! Great job!");

      } else {
        // PATH B: Wrong answer - interactive scaffolding
        console.log('❌ FractionCompare: Incorrect. Starting interactive scaffolding...');

        // Acknowledge and transition to interactive mode
        await speak("Let's find out together! Tap each rectangle to cut it into pieces.");

        // Show cut frame
        setDynamicSlideFrame('cut');

        // Wait for both rectangles to be tapped
        console.log('⏳ FractionCompare: Waiting for taps to split rectangles...');

        // Poll for both taps (with timeout)
        let tapWaitTime = 0;
        const maxTapWait = 15000; // 15 second timeout
        while (tapWaitTime < maxTapWait) {
          const state = useSessionStore.getState().slideInteractionState;
          if (state.leftTapped && state.rightTapped) {
            break;
          }
          await new Promise(resolve => setTimeout(resolve, 200));
          tapWaitTime += 200;
        }

        // If timeout, auto-complete the taps
        const currentState = useSessionStore.getState().slideInteractionState;
        if (!currentState.leftTapped || !currentState.rightTapped) {
          console.log('⏱️ FractionCompare: Auto-completing taps due to timeout');
          updateSlideInteraction({ leftTapped: true, rightTapped: true });
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        // Move to highlight frame
        await speak("Now tap a piece in each rectangle to highlight it.");
        setDynamicSlideFrame('highlight');

        // Wait for both highlights (with timeout)
        let highlightWaitTime = 0;
        const maxHighlightWait = 15000;
        while (highlightWaitTime < maxHighlightWait) {
          const state = useSessionStore.getState().slideInteractionState;
          if (state.leftHighlighted && state.rightHighlighted) {
            break;
          }
          await new Promise(resolve => setTimeout(resolve, 200));
          highlightWaitTime += 200;
        }

        // Auto-complete if needed
        const highlightState = useSessionStore.getState().slideInteractionState;
        if (!highlightState.leftHighlighted || !highlightState.rightHighlighted) {
          console.log('⏱️ FractionCompare: Auto-completing highlights due to timeout');
          updateSlideInteraction({ leftHighlighted: true, rightHighlighted: true });
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        // Move to compare frame
        setDynamicSlideFrame('compare');
        await speak("Look! 1/4 has 4 pieces, and 1/6 has 6 pieces. Which number is bigger - 4 or 6?");

        // Wait for verbal answer
        await new Promise(resolve => setTimeout(resolve, 500));
        const compareTranscript = await listenAndTranscribe();

        if (compareTranscript.trim()) {
          addChatMessage('user', compareTranscript);
        }

        // Check for "6" in answer
        if (/6|six/i.test(compareTranscript)) {
          await speak("Yes! 6 is bigger!");
        } else {
          await speak("6 is bigger than 4!");
        }

        // Show celebration
        setDynamicSlideFrame('celebration');
        await speak("So 1/6 has MORE pieces! You figured it out!");
      }

      // Trigger celebration confetti
      console.log('🎉 FractionCompare: Triggering confetti!');
      triggerConfetti();

      // Wait for confetti
      console.log('⏱️ FractionCompare: Waiting for confetti...');
      await waitForConfetti();

      // Move to next challenge
      console.log('✅ === FRACTION COMPARE COMPLETE === Moving to next challenge');
      const isComplete = goToNextChallenge();
      if (isComplete) {
        console.log('🏁 All challenges complete!');
        setPhase('COMPLETE');
      } else {
        console.log('➡️ Moving to PRE_CHALLENGE for next challenge');
        setPhase('PRE_CHALLENGE');
      }
    } catch (err) {
      console.error('❌ FractionCompare interaction error:', err);
      // On error, still move forward
      await speak("Good job! Let's continue!");
      const isComplete = goToNextChallenge();
      setPhase(isComplete ? 'COMPLETE' : 'PRE_CHALLENGE');
    }
  }, [speak, listenAndTranscribe, getCurrentChallenge, studentName, goToNextChallenge, setPhase, addChatMessage, triggerConfetti, waitForConfetti, setDynamicSlideFrame, updateSlideInteraction, resetSlideState]);

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
    runSlideInteraction,
    runFractionCompareInteraction,
    speak,
    listenAndRespond,
    // PTT controls
    handlePTTStart,
    handlePTTEnd,
  };
}
