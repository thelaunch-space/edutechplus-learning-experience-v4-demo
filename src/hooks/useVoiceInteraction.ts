import { useCallback, useState, useRef } from 'react';
import { useMicrophone } from './useMicrophone';
import { transcribeAudio } from '../services/deepgram';
import { speakText, type TTSResult } from '../services/tts';
import { generateEvaluatedResponse, generateNameAcknowledgment, generateSparkGoofyResponse, generateCheckpointResponse, generateMicroConversationResponse } from '../services/openrouter';
import { useSessionStore } from '../store/sessionStore';
import type { VoiceState, Challenge } from '../types';
import { fractionBuilderSlides, multipleChoiceSlides, tapToSelectSlides } from '../config/dynamicSlideContent';

const MAX_RECORDING_MS = 15000; // 15 seconds safety cap for PTT

// Rotating wrap-up phrases for dynamic question slides (avoid repetition)
const WRAP_UP_PHRASES = [
  "Nice work! Let's keep going!",
  "You're getting the hang of this! Ready for the next one?",
  "Awesome! Onward!",
  "Look at you go! Next one!",
  "Great job! Let's see what's next!",
];
let lastWrapUpIndex = -1;

// Extract name from transcript like "I'm Krishna Gautam" -> "Krishna"
// Hardened: catches garbage single-letter names, common words, numbers
function extractName(transcript: string): string {
  if (!transcript.trim()) return 'Friend';

  // Remove common prefixes
  const cleaned = transcript
    .replace(/^(i'm|i am|my name is|this is|hey|hi|hello|it's|its|they call me|people call me|you can call me)\s*/i, '')
    .trim();

  // Take first word as name
  const words = cleaned.split(/\s+/);
  const name = words[0] || 'Friend';

  // Remove any punctuation and capitalize
  const cleanName = name.replace(/[.,!?'"]/g, '').trim();

  if (!cleanName) return 'Friend';

  // Garbage detection: single letters, common words, numbers, short gibberish
  const GARBAGE_NAMES = [
    'i', 'a', 'u', 'no', 'yes', 'um', 'uh', 'the', 'what', 'why', 'how',
    'idk', 'nothing', 'ok', 'okay', 'like', 'well', 'so', 'me', 'my',
    'dont', 'know', 'hmm', 'huh', 'nah', 'yeah', 'yep', 'nope', 'hi',
    'hello', 'hey', 'it', 'is', 'and', 'or', 'but', 'not', 'this', 'that',
  ];

  const lower = cleanName.toLowerCase();

  // Reject if: in garbage list, single character, all numbers, under 2 chars
  if (
    GARBAGE_NAMES.includes(lower) ||
    cleanName.length < 2 ||
    /^\d+$/.test(cleanName)
  ) {
    return 'Friend';
  }

  // Capitalize first letter
  return cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
}

interface UseVoiceInteractionReturn {
  voiceState: VoiceState;
  currentSpeaker: 'max' | 'spark';
  displayedText: string; // Word-by-word revealed text
  error: string | null;

  // High-level interactions
  runOnboardingInteraction: () => Promise<void>;
  runPreChallengeInteraction: () => Promise<void>;
  runPostChallengeInteraction: () => Promise<void>;
  runSlideInteraction: () => Promise<void>;
  runFractionCompareInteraction: () => Promise<void>;
  runCheckpointInteraction: () => Promise<void>;
  runGoofyMomentInteraction: () => Promise<void>;
  runDynamicQuestionInteraction: () => Promise<void>;

  // Low-level controls
  speak: (text: string) => Promise<void>;

  // PTT (Push-to-Talk) controls
  handlePTTStart: () => Promise<void>;
  handlePTTEnd: () => Promise<void>;
}

export function useVoiceInteraction(): UseVoiceInteractionReturn {
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [currentSpeaker, setCurrentSpeaker] = useState<'max' | 'spark'>('max');
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
    setTutorExpression,
    setShowMinion,
    setShowPTTHint,
    setCheckpointFrame,
    setQuestionSlideFrame,
    resetQuestionSlideState,
    setShowScreenHighlight,
  } = useSessionStore();

  // Speak text using TTS with word-by-word reveal synchronized to audio
  const speak = useCallback(async (text: string): Promise<void> => {
    try {
      console.log('🎤 Voice: Max speaking:', text.substring(0, 50) + '...');
      setCurrentSpeaker('max');
      setVoiceState('MATH_MATE_SPEAKING');

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
      addChatMessage('assistant', text, 'max');

      // Clear displayedText since it's now in allMessages
      setDisplayedText('');

      console.log('✅ Voice: Max finished speaking');
      setVoiceState('IDLE');
    } catch (err) {
      console.error('❌ Voice: Speech error:', err);
      setVoiceState('ERROR');
      setError('Failed to play audio');
    }
  }, [addChatMessage]);

  // Speak as Spark (robot sidekick) using Aria voice
  const speakAsSpark = useCallback(async (text: string): Promise<void> => {
    try {
      console.log('🤖 Voice: Spark speaking:', text.substring(0, 50) + '...');
      setCurrentSpeaker('spark');
      setVoiceState('MATH_MATE_SPEAKING');

      setDisplayedText('');

      const words = text.split(' ');
      const { duration, playbackDone }: TTSResult = await speakText(text, 'spark');

      const wordDuration = duration > 0
        ? Math.max(100, (duration * 1000) / words.length)
        : 280;

      for (let i = 0; i < words.length; i++) {
        setDisplayedText(words.slice(0, i + 1).join(' '));
        await new Promise(resolve => setTimeout(resolve, wordDuration));
      }

      await playbackDone;
      addChatMessage('assistant', text, 'spark');
      setDisplayedText('');
      console.log('✅ Voice: Spark finished speaking');
      setVoiceState('IDLE');
    } catch (err) {
      console.error('❌ Voice: Spark speech error:', err);
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
      setTutorExpression('listening');
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
  }, [startRecording, requestPermission, stopPTTRecording, setTutorExpression]);

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


      return transcript;
    } catch (err) {
      console.error('Listen error:', err);
      setVoiceState('ERROR');
      return '';
    }
  }, []);

  // Micro-conversation: single-turn LLM-powered exchange to break dead zones
  const runMicroConversation = useCallback(async (challenge: Challenge): Promise<void> => {
    const mc = challenge.microConversation;
    if (!mc) return;

    console.log(`💬 === MICRO-CONVERSATION START (${mc.type}) ===`);

    // Max asks the scripted question (speak() adds to chat internally)
    setTutorExpression('encouragement');
    await speak(mc.prompt);
    await new Promise(resolve => setTimeout(resolve, 300));

    // Student responds (1 PTT turn)
    setTutorExpression('listening');
    const transcript = await listenAndTranscribe();
    if (transcript.trim()) {
      addChatMessage('user', transcript, 'student');
    }
    setTutorExpression('neutral');

    // LLM acknowledges (no follow-up question)
    setVoiceState('PROCESSING');
    const response = await generateMicroConversationResponse(
      transcript,
      studentName,
      mc.context,
      mc.transitionTo,
      mc.type,
      mc.fallback
    );

    // speak() adds to chat internally — don't double-add
    setTutorExpression('encouragement');
    await speak(response);
    setTutorExpression('neutral');

    console.log(`✅ === MICRO-CONVERSATION COMPLETE ===`);
    await new Promise(resolve => setTimeout(resolve, 800));
  }, [speak, listenAndTranscribe, addChatMessage, studentName, setTutorExpression, setVoiceState]);

  // Onboarding interaction — 7-beat FTUE flow with PTT training and Spark interaction
  const runOnboardingInteraction = useCallback(async (): Promise<void> => {
    try {
      console.log('👋 === ONBOARDING INTERACTION START (7-Beat FTUE) ===');
      setError(null);

      const challenge = getCurrentChallenge();

      // ========================================
      // BEAT 1: MAX ENTERS PORTAL (Scripted)
      // ========================================
      console.log('🎤 Beat 1: Max warm self-intro');
      setTutorExpression('greeting');

      const introScript = challenge?.preScript ||
        "Hey! I'm Max, your math tutor. I love teaching math — especially when it involves pizza and puzzles!";
      await speak(introScript);

      await new Promise(resolve => setTimeout(resolve, 600));

      // ========================================
      // BEAT 2: PTT TRAINING (Scripted + FTUE hint)
      // ========================================
      console.log('🎤 Beat 2: PTT Training');
      setTutorExpression('encouragement');
      // Show PTT hint BEFORE speaking about it so the button is visible
      setShowPTTHint(true);
      await new Promise(resolve => setTimeout(resolve, 700));
      await speak("See that button down there? Press and hold it like a walkie-talkie to talk to me. Try it now — tell me your name!");

      // ========================================
      // BEAT 3: STUDENT SAYS NAME (PTT #1)
      // ========================================
      console.log('👂 Beat 3: Listening for student name...');
      let nameTranscript = await listenAndTranscribe();
      setShowPTTHint(false);
      console.log('📝 Beat 3: Got transcript:', nameTranscript);

      if (nameTranscript.trim()) {
        addChatMessage('user', nameTranscript, 'student');
      }

      // Extract name with hardened logic — catches garbage
      let name = extractName(nameTranscript);
      if (name === 'Friend') {
        console.log('🔄 Beat 3: Name not captured, re-asking...');
        await speak("Haha, I didn't catch that! What should I call you?");

        const retryTranscript = await listenAndTranscribe();
        if (retryTranscript.trim()) {
          addChatMessage('user', retryTranscript, 'student');
        }

        name = extractName(retryTranscript);
        if (name === 'Friend') {
          name = 'Buddy';
          console.log('✅ Beat 3: Still no name, using "Buddy"');
        } else {
          console.log('✅ Beat 3: Got name on retry:', name);
        }
      } else {
        console.log('✅ Beat 3: Extracted name:', name);
      }
      setStudentName(name);

      // ========================================
      // BEAT 4: MAX ACKNOWLEDGES NAME (LLM #1) + SPARK INTRO
      // ========================================
      console.log('🎤 Beat 4: Name acknowledgment (LLM) + Spark intro');
      setTutorExpression('celebration');

      setVoiceState('PROCESSING');
      const nameAck = await generateNameAcknowledgment(name);
      await speak(nameAck);

      await new Promise(resolve => setTimeout(resolve, 400));

      // Show Spark BEFORE speaking about him
      setShowMinion(true);
      setTutorExpression('giggling');
      await speak("See this little guy? That's Spark, my robot buddy! Say something to him — he loves meeting new people!");

      // ========================================
      // BEAT 5: STUDENT TALKS TO SPARK (PTT #2)
      // ========================================
      console.log('👂 Beat 5: Listening for student talking to Spark...');
      setTutorExpression('listening');
      const sparkTranscript = await listenAndTranscribe();
      console.log('📝 Beat 5: Got transcript:', sparkTranscript);

      if (sparkTranscript.trim()) {
        addChatMessage('user', sparkTranscript, 'student');
      }

      // ========================================
      // BEAT 6: SPARK RESPONDS (LLM #2, Spark voice)
      // ========================================
      console.log('🤖 Beat 6: Spark goofy response (LLM)');
      setVoiceState('PROCESSING');
      const sparkResponse = await generateSparkGoofyResponse(name, sparkTranscript);
      await speakAsSpark(sparkResponse);

      await new Promise(resolve => setTimeout(resolve, 600));

      // ========================================
      // BEAT 7: INTERFACE WALKTHROUGH + AUTO-ADVANCE
      // Show-first: highlight right panel, pause, THEN speak
      // ========================================
      console.log('🎤 Beat 7: Interface walkthrough + auto-advance');
      setTutorExpression('encouragement');

      // Show overlay + nudge FIRST so student sees the right panel highlighted
      setShowScreenHighlight(true);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // NOW speak about it
      await speak("See that screen on your right? That's where I'll show you videos, games, and puzzles. I'll guide you through everything. We're gonna learn about fractions today — let's gooo!");

      // Clear overlay
      setShowScreenHighlight(false);

      setShowMinion(false);
      setTutorExpression('neutral');

      const isComplete = goToNextChallenge();
      if (isComplete) {
        setPhase('COMPLETE');
      } else {
        setPhase('PRE_CHALLENGE');
      }

      console.log('✅ === ONBOARDING COMPLETE ===');
    } catch (err) {
      console.error('❌ Onboarding interaction error:', err);
      setError('Something went wrong. Let\'s continue!');
      setStudentName('Friend');
      setShowMinion(false);
      setShowPTTHint(false);
      setShowScreenHighlight(false);
      setTutorExpression('neutral');
      const isComplete = goToNextChallenge();
      if (isComplete) {
        setPhase('COMPLETE');
      } else {
        setPhase('PRE_CHALLENGE');
      }
    }
  }, [speak, speakAsSpark, listenAndTranscribe, setStudentName, setPhase, addChatMessage, getCurrentChallenge, setTutorExpression, setShowMinion, setShowPTTHint, setShowScreenHighlight, goToNextChallenge, setVoiceState]);

  // Pre-challenge interaction (Max introduces the challenge)
  const runPreChallengeInteraction = useCallback(async (): Promise<void> => {
    try {
      console.log('📢 === PRE-CHALLENGE INTERACTION START ===');
      setError(null);
      setTutorExpression('neutral');
      const challenge = getCurrentChallenge();

      if (!challenge) {
        console.log('❌ Pre-Challenge: No challenge found, moving to COMPLETE');
        setPhase('COMPLETE');
        return;
      }

      console.log(`🎯 Pre-Challenge: Challenge ${challenge.number} - ${challenge.title}`);

      // Play minion moment if present (Spark speaks first, tutor responds)
      if (challenge.minionMoment) {
        console.log('🤖 Pre-Challenge: Playing minion moment...');
        setTutorExpression('giggling');
        setShowMinion(true);
        await speakAsSpark(challenge.minionMoment.minionLine);
        await new Promise(resolve => setTimeout(resolve, 500));
        await speak(challenge.minionMoment.tutorLine);
        await new Promise(resolve => setTimeout(resolve, 800));
        setShowMinion(false);
        setTutorExpression('neutral');

        // Micro-conversation injection point (after minion moment)
        if (challenge.microConversation?.position === 'after_minion') {
          await runMicroConversation(challenge);
        }
      }

      // Speak the pre-script (skip if empty — micro-conversation may serve as intro)
      if (challenge.preScript.trim()) {
        console.log('🎤 Pre-Challenge: Speaking introduction...');
        await speak(challenge.preScript);
      }

      // Micro-conversation injection point (after preScript)
      if (challenge.microConversation?.position === 'after_prescript') {
        await runMicroConversation(challenge);
      }

      // Longer pause to ensure TTS completes and give breathing room
      console.log('⏱️ Pre-Challenge: Waiting 1500ms before starting challenge...');
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('✅ === PRE-CHALLENGE COMPLETE === Moving to IN_CHALLENGE');
      setPhase('IN_CHALLENGE');
    } catch (err) {
      console.error('❌ Pre-challenge interaction error:', err);
      setPhase('IN_CHALLENGE');
    }
  }, [speak, speakAsSpark, listenAndTranscribe, getCurrentChallenge, setPhase, setTutorExpression, setShowMinion, runMicroConversation]);

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

      // Play minion moment if present (Spark speaks first, tutor responds)
      if (challenge.minionMoment) {
        console.log('🤖 Slide: Playing minion moment...');
        setTutorExpression('giggling');
        setShowMinion(true);
        await speakAsSpark(challenge.minionMoment.minionLine);
        await new Promise(resolve => setTimeout(resolve, 500));
        await speak(challenge.minionMoment.tutorLine);
        await new Promise(resolve => setTimeout(resolve, 800));
        setShowMinion(false);
        setTutorExpression('neutral');
      }

      // For narration slides: show slide FIRST, then speak preScript over it
      // For question slides: speak preScript first, then show slide (existing behavior)
      if (challenge.isQuestionSlide === false) {
        // Show slide before preScript so student sees the visual while Max talks
        console.log('✅ Slide: Showing narration slide before preScript');
        setPhase('IN_CHALLENGE');
        await new Promise(resolve => setTimeout(resolve, 500));

        // Speak preScript while slide is visible
        console.log('🎤 Slide: Speaking pre-script (slide visible)...');
        await speak(challenge.preScript);
      } else {
        // Question slides: speak preScript first, then show slide
        console.log('🎤 Slide: Speaking pre-script...');
        await speak(challenge.preScript);

        console.log('⏱️ Slide: Waiting 1000ms before showing slide...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('✅ Slide: Setting phase to IN_CHALLENGE to display slide');
        setPhase('IN_CHALLENGE');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Check if this is a narration slide or question slide
      if (challenge.isQuestionSlide === false) {
        // Narration slide - speak narration and auto-advance
        setTutorExpression('neutral');
        console.log('📢 Slide: Narration slide - speaking slideNarration...');
        if (challenge.slideNarration) {
          await speak(challenge.slideNarration);
        }

        // Micro-conversation injection point (after narration)
        if (challenge.microConversation?.position === 'after_narration') {
          await runMicroConversation(challenge);
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
        setTutorExpression('nudging');

        // Reset turn counter for this challenge
        resetTurn();

        // Ask the post question
        console.log('🎤 Slide: Asking question...');
        await speak(challenge.postQuestion);

        // Fallback values for optional fields
        const correctnessFilter = challenge.correctnessFilter ?? '';
        const scaffolding = challenge.scaffolding ?? { probe1: '', probe2: '', hint: '', scaffold: '', reveal: '' };

        // Multi-turn conversation loop (same as runPostChallengeInteraction)
        let shouldContinue = true;
        let turnCount = 0;
        const maxSafetyTurns = challenge.maxTurns + 1; // Safety cap
        let emptyTranscriptCount = 0;

        while (shouldContinue && turnCount < maxSafetyTurns) {
          console.log(`\n🔄 Turn ${turnCount + 1} of ${challenge.maxTurns}`);

          // Wait before listening
          await new Promise(resolve => setTimeout(resolve, 500));

          // Listen for student's response
          console.log('👂 Listening for student response...');
          const transcript = await listenAndTranscribe();
          console.log('📝 Got transcript:', transcript);

          // Empty transcript guard — re-prompt without consuming a turn
          if (!transcript.trim()) {
            emptyTranscriptCount++;
            if (emptyTranscriptCount >= 2) {
              // Give up after 2 consecutive silent attempts
              await speak("No worries! Let me help you out.");
              // Fall through to LLM which will trigger next scaffold level
            } else {
              await speak("Hmm, I didn't hear that. Try again!");
              continue;
            }
          } else {
            emptyTranscriptCount = 0;
          }

          // Add student's response to unified chat history
          if (transcript.trim()) {
            addChatMessage('user', transcript, 'student');
          }

          // Get conversation history for context
          const conversationHistory = getConversationHistory(challenge.id);

          // Generate evaluated response
          console.log('🤖 Evaluating response with LLM...');
          setVoiceState('PROCESSING');
          const result = await generateEvaluatedResponse(
            transcript,
            studentName,
            correctnessFilter,
            scaffolding,
            turnCount,
            challenge.maxTurns,
            conversationHistory
          );
          console.log('✅ Evaluation result:', result);

          // Add messages to conversation history
          addMessage(challenge.id, { role: 'user', content: transcript });
          addMessage(challenge.id, { role: 'assistant', content: result.response });

          // Set expression based on result
          if (result.isCorrect) {
            setTutorExpression('celebration');
          } else {
            setTutorExpression('encouragement');
          }

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
            setTutorExpression('nudging');
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

        setTutorExpression('neutral');

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
  }, [speak, speakAsSpark, listenAndTranscribe, getCurrentChallenge, studentName, goToNextChallenge, setPhase, resetTurn, incrementTurn, addMessage, getConversationHistory, addChatMessage, triggerConfetti, waitForConfetti, setVoiceState, setError, setTutorExpression, setShowMinion, runMicroConversation]);

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
      setTutorExpression('nudging');
      console.log('🎤 Post-Challenge: Asking initial question...');
      await speak(challenge.postQuestion);

      // Fallback values for optional fields
      const correctnessFilter = challenge.correctnessFilter ?? '';
      const scaffolding = challenge.scaffolding ?? { probe1: '', probe2: '', hint: '', scaffold: '', reveal: '' };

      // Multi-turn conversation loop
      let shouldContinue = true;
      let turnCount = 0;
      const maxSafetyTurns = challenge.maxTurns + 1; // Safety cap
      let emptyTranscriptCount = 0;

      while (shouldContinue && turnCount < maxSafetyTurns) {
        console.log(`\n🔄 Turn ${turnCount + 1} of ${challenge.maxTurns}`);

        // Wait before listening
        await new Promise(resolve => setTimeout(resolve, 500));

        // Listen for student's response
        console.log('👂 Listening for student response...');
        const transcript = await listenAndTranscribe();
        console.log('📝 Got transcript:', transcript);

        // Empty transcript guard — re-prompt without consuming a turn
        if (!transcript.trim()) {
          emptyTranscriptCount++;
          if (emptyTranscriptCount >= 2) {
            // Give up after 2 consecutive silent attempts
            await speak("No worries! Let me help you out.");
            // Fall through to LLM which will trigger next scaffold level
          } else {
            await speak("Hmm, I didn't hear that. Try again!");
            continue;
          }
        } else {
          emptyTranscriptCount = 0;
        }

        // Add student's response to unified chat history
        if (transcript.trim()) {
          addChatMessage('user', transcript, 'student');
        }

        // Get conversation history for context
        const conversationHistory = getConversationHistory(challenge.id);

        // Generate evaluated response
        console.log('🤖 Evaluating response with LLM...');
        setVoiceState('PROCESSING');
        const result = await generateEvaluatedResponse(
          transcript,
          studentName,
          correctnessFilter,
          scaffolding,
          turnCount,
          challenge.maxTurns,
          conversationHistory
        );
        console.log('✅ Evaluation result:', result);

        // Add messages to conversation history
        addMessage(challenge.id, { role: 'user', content: transcript });
        addMessage(challenge.id, { role: 'assistant', content: result.response });

        // Set expression based on result
        if (result.isCorrect) {
          setTutorExpression('celebration');
        } else {
          setTutorExpression('encouragement');
        }

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
          setTutorExpression('nudging');
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

      setTutorExpression('neutral');

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
  }, [speak, listenAndTranscribe, getCurrentChallenge, studentName, goToNextChallenge, setPhase, resetTurn, incrementTurn, addMessage, getConversationHistory, addChatMessage, triggerConfetti, waitForConfetti, setTutorExpression]);

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
      setTutorExpression('nudging');

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
        addChatMessage('user', transcript, 'student');
      }

      // Check if correct using correctness filter (with null check)
      const filterStr = challenge.correctnessFilter ?? '';
      const correctPattern = new RegExp(filterStr, 'i');
      const isCorrect = filterStr ? correctPattern.test(transcript) : false;

      if (isCorrect) {
        // PATH A: Correct first try - quick animated summary
        console.log('✅ FractionCompare: Correct! Running quick summary...');
        setTutorExpression('celebration');

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
        setTutorExpression('encouragement');

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
        setTutorExpression('nudging');
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
        setTutorExpression('nudging');
        setDynamicSlideFrame('compare');
        await speak("Look! 1/4 has 4 pieces, and 1/6 has 6 pieces. Which number is bigger - 4 or 6?");

        // Wait for verbal answer
        await new Promise(resolve => setTimeout(resolve, 500));
        const compareTranscript = await listenAndTranscribe();

        if (compareTranscript.trim()) {
          addChatMessage('user', compareTranscript, 'student');
        }

        // Check for "6" in answer
        if (/6|six/i.test(compareTranscript)) {
          setTutorExpression('celebration');
          await speak("Yes! 6 is bigger!");
        } else {
          await speak("6 is bigger than 4!");
        }

        // Show celebration
        setDynamicSlideFrame('celebration');
        setTutorExpression('celebration');
        await speak("So 1/6 has MORE pieces! You figured it out!");
      }

      // Trigger celebration confetti
      console.log('🎉 FractionCompare: Triggering confetti!');
      triggerConfetti();

      // Wait for confetti
      console.log('⏱️ FractionCompare: Waiting for confetti...');
      await waitForConfetti();

      setTutorExpression('neutral');

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
  }, [speak, listenAndTranscribe, getCurrentChallenge, studentName, goToNextChallenge, setPhase, addChatMessage, triggerConfetti, waitForConfetti, setDynamicSlideFrame, updateSlideInteraction, resetSlideState, setTutorExpression]);

  // Checkpoint interaction (celebratory review of learning)
  const runCheckpointInteraction = useCallback(async (): Promise<void> => {
    try {
      console.log('🏁 === CHECKPOINT INTERACTION START ===');
      setError(null);
      const challenge = getCurrentChallenge();

      if (!challenge) {
        console.log('❌ Checkpoint: No challenge found, moving to COMPLETE');
        setPhase('COMPLETE');
        return;
      }

      console.log(`🎯 Checkpoint: Challenge ${challenge.number} - ${challenge.title}`);

      // Play minion moment if present (Spark speaks first, tutor responds)
      if (challenge.minionMoment) {
        console.log('🤖 Checkpoint: Playing minion moment...');
        setTutorExpression('giggling');
        setShowMinion(true);
        await speakAsSpark(challenge.minionMoment.minionLine);
        await new Promise(resolve => setTimeout(resolve, 500));
        await speak(challenge.minionMoment.tutorLine);
        await new Promise(resolve => setTimeout(resolve, 800));
        setShowMinion(false);
      }

      // Set intro frame
      setCheckpointFrame('intro');

      // Set celebration expression
      setTutorExpression('celebration');

      // Speak preScript (celebration summary)
      console.log('🎤 Checkpoint: Speaking celebration summary...');
      await speak(challenge.preScript);

      // Wait
      await new Promise(resolve => setTimeout(resolve, 500));

      // Transition to question frame
      setCheckpointFrame('question');

      // Speak postQuestion (review question)
      setTutorExpression('nudging');
      console.log('🎤 Checkpoint: Asking review question...');
      await speak(challenge.postQuestion);

      // Reset turn counter
      resetTurn();

      // Fallback values for optional fields
      const correctnessFilter = challenge.correctnessFilter ?? '';
      const scaffolding = challenge.scaffolding ?? { probe1: '', probe2: '', hint: '', scaffold: '', reveal: '' };

      // Multi-turn loop
      let shouldContinue = true;
      let turnCount = 0;
      const maxSafetyTurns = challenge.maxTurns + 1;
      let emptyTranscriptCount = 0;

      while (shouldContinue && turnCount < maxSafetyTurns) {
        console.log(`\n🔄 Checkpoint turn ${turnCount + 1} of ${challenge.maxTurns}`);

        // Wait before listening
        await new Promise(resolve => setTimeout(resolve, 500));

        // Listen for student's response
        console.log('👂 Checkpoint: Listening for response...');
        const transcript = await listenAndTranscribe();
        console.log('📝 Checkpoint: Got transcript:', transcript);

        // Empty transcript guard — re-prompt without consuming a turn
        if (!transcript.trim()) {
          emptyTranscriptCount++;
          if (emptyTranscriptCount >= 2) {
            // Give up after 2 consecutive silent attempts
            await speak("No worries! Let me help you out.");
            // Fall through to LLM which will trigger next scaffold level
          } else {
            await speak("Hmm, I didn't hear that. Try again!");
            continue;
          }
        } else {
          emptyTranscriptCount = 0;
        }

        // Add to chat
        if (transcript.trim()) {
          addChatMessage('user', transcript, 'student');
        }

        // Get conversation history
        const conversationHistory = getConversationHistory(challenge.id);

        // Choose evaluation method based on available data
        let result;
        setVoiceState('PROCESSING');

        if (correctnessFilter && challenge.scaffolding) {
          // Use full evaluated response with scaffolding
          result = await generateEvaluatedResponse(
            transcript,
            studentName,
            correctnessFilter,
            scaffolding,
            turnCount,
            challenge.maxTurns,
            conversationHistory
          );
        } else {
          // Use checkpoint-specific response
          result = await generateCheckpointResponse(
            transcript,
            studentName,
            challenge.checkpointLO || '',
            conversationHistory
          );

          // Also do client-side correctness check if filter exists
          if (correctnessFilter && transcript.trim()) {
            const filterPatterns = correctnessFilter.split('|').map(p => p.trim().toLowerCase());
            const studentLower = transcript.toLowerCase();
            const clientCorrect = filterPatterns.some(pattern => {
              const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              return new RegExp(`\\b${escaped}\\b`, 'i').test(studentLower);
            });
            if (clientCorrect) {
              result.isCorrect = true;
              result.shouldEnd = true;
            }
          }
        }

        console.log('✅ Checkpoint evaluation:', result);

        // Add messages to conversation history
        addMessage(challenge.id, { role: 'user', content: transcript });
        addMessage(challenge.id, { role: 'assistant', content: result.response });

        // Set expression and checkpoint frame based on result
        if (result.isCorrect) {
          setTutorExpression('celebration');
          setCheckpointFrame('celebration');
        } else {
          setTutorExpression('encouragement');
          // Show scaffold frame on turn 2+ or wrong answer
          if (turnCount >= 1) {
            setCheckpointFrame('scaffold');
          }
        }

        // Speak response
        await speak(result.response);

        // Check exit conditions
        if (result.isCorrect) {
          console.log('✅ Checkpoint: Student answered correctly!');
          shouldContinue = false;
        } else if (result.shouldEnd) {
          console.log('⏹️ Checkpoint: Should end');
          setCheckpointFrame('celebration');
          shouldContinue = false;
        } else if (turnCount >= challenge.maxTurns - 1) {
          console.log('⏹️ Checkpoint: Max turns reached');
          setCheckpointFrame('celebration');
          shouldContinue = false;
        } else {
          setTutorExpression('nudging');
          incrementTurn();
          turnCount++;
        }
      }

      // Trigger confetti and wait
      console.log('🎉 Checkpoint: Triggering confetti!');
      triggerConfetti();
      await waitForConfetti();

      setTutorExpression('neutral');

      // Advance to next challenge
      console.log('✅ === CHECKPOINT COMPLETE === Moving to next challenge');
      const isComplete = goToNextChallenge();
      if (isComplete) {
        console.log('🏁 All challenges complete!');
        setPhase('COMPLETE');
      } else {
        console.log('➡️ Moving to PRE_CHALLENGE for next challenge');
        setPhase('PRE_CHALLENGE');
      }
    } catch (err) {
      console.error('❌ Checkpoint interaction error:', err);
      await speak("Great job! Let's keep going!");
      const isComplete = goToNextChallenge();
      setPhase(isComplete ? 'COMPLETE' : 'PRE_CHALLENGE');
    }
  }, [speak, speakAsSpark, listenAndTranscribe, getCurrentChallenge, studentName, goToNextChallenge, setPhase, resetTurn, incrementTurn, addMessage, getConversationHistory, addChatMessage, triggerConfetti, waitForConfetti, setTutorExpression, setCheckpointFrame, setShowMinion]);

  // Dynamic question slide interaction (voice-first check + tap scaffold — FractionBuilder, MultipleChoice, TapToSelect)
  const runDynamicQuestionInteraction = useCallback(async (): Promise<void> => {
    try {
      console.log('🎯 === DYNAMIC QUESTION INTERACTION START ===');
      setError(null);
      const challenge = getCurrentChallenge();

      if (!challenge || !challenge.dynamicSlideTemplate || !challenge.dynamicSlideId) {
        console.log('❌ DynamicQuestion: No challenge or template found, skipping');
        const isComplete = goToNextChallenge();
        setPhase(isComplete ? 'COMPLETE' : 'PRE_CHALLENGE');
        return;
      }

      const template = challenge.dynamicSlideTemplate;
      const slideId = challenge.dynamicSlideId;
      console.log(`🎯 DynamicQuestion: Template=${template}, SlideId=${slideId}`);

      // Reset question slide state
      resetQuestionSlideState();

      // Set initial frame
      setQuestionSlideFrame('question');
      setTutorExpression('nudging');

      // Wait for slide to render
      await new Promise(resolve => setTimeout(resolve, 500));

      // Speak the question
      console.log('🎤 DynamicQuestion: Asking question...');
      await speak(challenge.postQuestion);

      // ===== VOICE-FIRST CHECK: Listen for verbal answer =====
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('👂 DynamicQuestion: Listening for answer...');
      const transcript = await listenAndTranscribe();
      console.log('📝 DynamicQuestion: Got transcript:', transcript);

      if (transcript.trim()) {
        addChatMessage('user', transcript, 'student');
      }

      // Check correctness using filter
      const filterStr = challenge.correctnessFilter ?? '';
      const correctPattern = new RegExp(filterStr, 'i');
      const isCorrect = filterStr ? correctPattern.test(transcript) : false;
      console.log(`🧠 DynamicQuestion: isCorrect=${isCorrect} (filter="${filterStr}", transcript="${transcript}")`);

      if (isCorrect) {
        // ===== PATH A: Correct first try — quick auto-animation, no taps =====
        console.log('✅ DynamicQuestion: Correct! Quick animation...');
        setTutorExpression('celebration');
        await speak("That's right!");

        // Quick fly-through: question → scaffold (auto-filled) → reveal
        setQuestionSlideFrame('scaffold');

        if (template === 'fraction-builder') {
          const config = fractionBuilderSlides[slideId];
          if (config) {
            const allPieces = Array.from({ length: config.totalPieces }, (_, i) => i);
            useSessionStore.getState().updateQuestionSlideState({
              tappedPieces: allPieces,
              numeratorFilled: true,
              denominatorFilled: true,
            });
          }
        } else if (template === 'multiple-choice') {
          const config = multipleChoiceSlides[slideId];
          if (config) {
            useSessionStore.getState().updateQuestionSlideState({
              selectedIndex: config.correctIndex,
            });
          }
        } else if (template === 'tap-to-select') {
          const config = tapToSelectSlides[slideId];
          if (config) {
            const correctIdx = config.options.findIndex(o => o.isCorrect);
            useSessionStore.getState().updateQuestionSlideState({
              selectedIndex: correctIdx,
            });
          }
        }

        await new Promise(resolve => setTimeout(resolve, 800));

        // Show reveal
        setQuestionSlideFrame('reveal');
        if (template === 'fraction-builder') {
          const config = fractionBuilderSlides[slideId];
          if (config) await speak(config.fractionLabel);
        } else if (template === 'multiple-choice') {
          const config = multipleChoiceSlides[slideId];
          if (config) await speak(config.revealLabel);
        } else if (template === 'tap-to-select') {
          const config = tapToSelectSlides[slideId];
          if (config) await speak(config.correctFeedback);
        }

      } else {
        // ===== PATH B: Wrong answer — interactive tap scaffolding =====
        console.log('❌ DynamicQuestion: Wrong answer, showing tap scaffold...');
        setTutorExpression('encouragement');
        await speak("Good try! Let me help you figure this out.");
        setTutorExpression('nudging');
        await new Promise(resolve => setTimeout(resolve, 500));

      // ===== TEMPLATE-SPECIFIC INTERACTION FLOW =====

      if (template === 'fraction-builder') {
        const config = fractionBuilderSlides[slideId];
        if (!config) throw new Error(`No FractionBuilder config for ${slideId}`);

        // Transition to scaffold frame (tapping enabled)
        setQuestionSlideFrame('scaffold');
        await speak("Tap the colored pieces to count them!");

        // Phase 1: Wait for all highlighted pieces to be tapped
        console.log(`⏳ DynamicQuestion: Waiting for ${config.highlightedPieces} highlighted pieces to be tapped...`);
        let waitTime = 0;
        const maxWait = 20000;
        while (waitTime < maxWait) {
          const state = useSessionStore.getState().questionSlideState;
          if (state.tappedPieces.length >= config.highlightedPieces) break;
          await new Promise(resolve => setTimeout(resolve, 200));
          waitTime += 200;
        }

        // Auto-complete if timeout
        const state1 = useSessionStore.getState().questionSlideState;
        if (state1.tappedPieces.length < config.highlightedPieces) {
          console.log('⏱️ DynamicQuestion: Auto-completing highlighted piece taps');
          await speak("Let me help! Watch...");
          const autoTapped = Array.from({ length: config.highlightedPieces }, (_, i) => i);
          useSessionStore.getState().updateQuestionSlideState({ tappedPieces: autoTapped });
        }

        // Fill numerator
        await new Promise(resolve => setTimeout(resolve, 300));
        useSessionStore.getState().updateQuestionSlideState({ numeratorFilled: true });
        await speak(`${config.highlightedPieces}! Now tap ALL the pieces to count the total!`);

        // Phase 2: Wait for ALL pieces to be tapped
        console.log(`⏳ DynamicQuestion: Waiting for all ${config.totalPieces} pieces to be tapped...`);
        waitTime = 0;
        while (waitTime < maxWait) {
          const state = useSessionStore.getState().questionSlideState;
          if (state.tappedPieces.length >= config.totalPieces) break;
          await new Promise(resolve => setTimeout(resolve, 200));
          waitTime += 200;
        }

        // Auto-complete if timeout
        const state2 = useSessionStore.getState().questionSlideState;
        if (state2.tappedPieces.length < config.totalPieces) {
          console.log('⏱️ DynamicQuestion: Auto-completing all piece taps');
          await speak("Let me count the rest!");
          const autoTapped = Array.from({ length: config.totalPieces }, (_, i) => i);
          useSessionStore.getState().updateQuestionSlideState({ tappedPieces: autoTapped });
        }

        // Fill denominator
        await new Promise(resolve => setTimeout(resolve, 300));
        useSessionStore.getState().updateQuestionSlideState({ denominatorFilled: true });

        // Reveal
        await new Promise(resolve => setTimeout(resolve, 500));
        setQuestionSlideFrame('reveal');
        setTutorExpression('celebration');
        await speak(`${config.fractionLabel} You built it!`);

      } else if (template === 'multiple-choice') {
        const config = multipleChoiceSlides[slideId];
        if (!config) throw new Error(`No MultipleChoice config for ${slideId}`);

        // Set scaffold frame (choices tappable)
        setQuestionSlideFrame('scaffold');
        await speak("Tap the answer you think is right!");

        // Wait for tap — loop until correct or all eliminated
        let attempts = 0;
        const maxAttempts = config.choices.length;

        while (attempts < maxAttempts) {
          console.log(`⏳ DynamicQuestion: Waiting for choice tap (attempt ${attempts + 1})...`);

          // Wait for selectedIndex to change
          let waitTime = 0;
          const prevSelected = useSessionStore.getState().questionSlideState.selectedIndex;
          while (waitTime < 20000) {
            const state = useSessionStore.getState().questionSlideState;
            if (state.selectedIndex !== null && state.selectedIndex !== prevSelected) break;
            await new Promise(resolve => setTimeout(resolve, 200));
            waitTime += 200;
          }

          const state = useSessionStore.getState().questionSlideState;
          const selected = state.selectedIndex;

          if (selected === null) {
            // Timeout — auto-select correct
            console.log('⏱️ DynamicQuestion: Auto-selecting correct answer');
            setTutorExpression('encouragement');
            await speak("No worries! Let me show you.");
            useSessionStore.getState().updateQuestionSlideState({ selectedIndex: config.correctIndex });
            break;
          }

          if (selected === config.correctIndex) {
            // Correct!
            console.log('✅ DynamicQuestion: Correct choice tapped!');
            break;
          } else {
            // Wrong — eliminate and give choice-specific hint
            console.log(`❌ DynamicQuestion: Wrong choice ${selected}, eliminating...`);
            const currentEliminated = useSessionStore.getState().questionSlideState.eliminatedIndices;
            useSessionStore.getState().updateQuestionSlideState({
              eliminatedIndices: [...currentEliminated, selected],
              selectedIndex: null, // Reset so they can tap again
            });
            setTutorExpression('encouragement');
            const hint = config.choiceHints?.[selected] || config.scaffoldHint;
            await speak(hint);
            setTutorExpression('nudging');
            attempts++;
          }
        }

        // Reveal
        await new Promise(resolve => setTimeout(resolve, 300));
        useSessionStore.getState().updateQuestionSlideState({ selectedIndex: config.correctIndex });
        setQuestionSlideFrame('reveal');
        setTutorExpression('celebration');
        await speak(config.revealLabel);

      } else if (template === 'tap-to-select') {
        const config = tapToSelectSlides[slideId];
        if (!config) throw new Error(`No TapToSelect config for ${slideId}`);

        // Set scaffold frame (options tappable)
        setQuestionSlideFrame('scaffold');
        await speak("Tap the one you think is right!");

        // Wait for tap
        let resolved = false;
        let attempts = 0;

        while (!resolved && attempts < 3) {
          console.log(`⏳ DynamicQuestion: Waiting for option tap (attempt ${attempts + 1})...`);

          let waitTime = 0;
          while (waitTime < 20000) {
            const state = useSessionStore.getState().questionSlideState;
            if (state.selectedIndex !== null) break;
            await new Promise(resolve => setTimeout(resolve, 200));
            waitTime += 200;
          }

          const state = useSessionStore.getState().questionSlideState;
          const selected = state.selectedIndex;

          if (selected === null) {
            // Timeout — auto-select correct
            console.log('⏱️ DynamicQuestion: Tap timeout, showing answer');
            setTutorExpression('encouragement');
            await speak("No worries! Let me show you.");
            const correctIdx = config.options.findIndex(o => o.isCorrect);
            useSessionStore.getState().updateQuestionSlideState({ selectedIndex: correctIdx });
            resolved = true;
          } else {
            const tappedOption = config.options[selected];
            if (tappedOption?.isCorrect) {
              // Correct tap
              console.log('✅ DynamicQuestion: Correct option tapped!');
              resolved = true;
            } else {
              // Wrong tap — give feedback, reset selection
              console.log('❌ DynamicQuestion: Wrong option tapped');
              setTutorExpression('encouragement');
              await speak(config.wrongFeedback);
              setTutorExpression('nudging');
              useSessionStore.getState().updateQuestionSlideState({ selectedIndex: null });
              attempts++;
            }
          }
        }

        // If still not resolved, force correct
        if (!resolved) {
          const correctIdx = config.options.findIndex(o => o.isCorrect);
          useSessionStore.getState().updateQuestionSlideState({ selectedIndex: correctIdx });
        }

        // Reveal
        await new Promise(resolve => setTimeout(resolve, 300));
        setQuestionSlideFrame('reveal');
        setTutorExpression('celebration');
        await speak(config.correctFeedback);
      }

      } // end PATH B (else)

      // ===== CELEBRATION & ADVANCE =====

      // Trigger confetti
      console.log('🎉 DynamicQuestion: Triggering confetti!');
      triggerConfetti();
      await waitForConfetti();

      // Node-specific or generic wrap-up
      setTutorExpression('celebration');
      const wrapUpText = challenge.wrapUp;
      if (wrapUpText) {
        await speak(wrapUpText);
      } else {
        // Fallback to existing rotating generic phrases
        let wrapUpIndex = Math.floor(Math.random() * WRAP_UP_PHRASES.length);
        if (wrapUpIndex === lastWrapUpIndex) {
          wrapUpIndex = (wrapUpIndex + 1) % WRAP_UP_PHRASES.length;
        }
        lastWrapUpIndex = wrapUpIndex;
        await speak(WRAP_UP_PHRASES[wrapUpIndex]);
      }
      await new Promise(resolve => setTimeout(resolve, 300));

      setTutorExpression('neutral');

      // Move to next challenge
      console.log('✅ === DYNAMIC QUESTION COMPLETE === Moving to next challenge');
      const isComplete = goToNextChallenge();
      if (isComplete) {
        console.log('🏁 All challenges complete!');
        setPhase('COMPLETE');
      } else {
        console.log('➡️ Moving to PRE_CHALLENGE for next challenge');
        setPhase('PRE_CHALLENGE');
      }
    } catch (err) {
      console.error('❌ Dynamic question interaction error:', err);
      await speak("Great job! Let's keep going!");
      const isComplete = goToNextChallenge();
      setPhase(isComplete ? 'COMPLETE' : 'PRE_CHALLENGE');
    }
  }, [speak, listenAndTranscribe, addChatMessage, getCurrentChallenge, goToNextChallenge, setPhase, triggerConfetti, waitForConfetti, setTutorExpression, setQuestionSlideFrame, resetQuestionSlideState]);

  // Goofy moment interaction (auto-play, no PTT)
  const runGoofyMomentInteraction = useCallback(async (): Promise<void> => {
    try {
      console.log('🤪 === GOOFY MOMENT INTERACTION START ===');
      setError(null);
      const challenge = getCurrentChallenge();

      if (!challenge) {
        console.log('❌ Goofy: No challenge found, moving to COMPLETE');
        setPhase('COMPLETE');
        return;
      }

      const goofyScript = challenge.goofyScript;
      if (!goofyScript) {
        console.log('❌ Goofy: No goofy script found, skipping');
        const isComplete = goToNextChallenge();
        setPhase(isComplete ? 'COMPLETE' : 'PRE_CHALLENGE');
        return;
      }

      console.log(`🎯 Goofy: Challenge ${challenge.number} - ${challenge.title}`);

      // Set expression to giggling
      setTutorExpression('giggling');

      // Show minion if needed
      if (goofyScript.showMinion) {
        setShowMinion(true);
      }

      // Speak tutor line
      console.log('🎤 Goofy: Speaking tutor line...');
      await speak(goofyScript.tutorLine);

      // Speak minion line if present (Spark's voice)
      if (goofyScript.minionLine) {
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('🎤 Goofy: Speaking minion line...');
        await speakAsSpark(goofyScript.minionLine);
      }

      // Micro-conversation injection point (after goofy moment)
      if (challenge.microConversation?.position === 'after_goofy') {
        await runMicroConversation(challenge);
      }

      // Wait before advancing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Hide minion, reset expression
      setShowMinion(false);
      setTutorExpression('neutral');

      // Auto-advance to next challenge
      console.log('✅ === GOOFY MOMENT COMPLETE === Moving to next challenge');
      const isComplete = goToNextChallenge();
      if (isComplete) {
        console.log('🏁 All challenges complete!');
        setPhase('COMPLETE');
      } else {
        console.log('➡️ Moving to PRE_CHALLENGE for next challenge');
        setPhase('PRE_CHALLENGE');
      }
    } catch (err) {
      console.error('❌ Goofy moment error:', err);
      setShowMinion(false);
      setTutorExpression('neutral');
      const isComplete = goToNextChallenge();
      setPhase(isComplete ? 'COMPLETE' : 'PRE_CHALLENGE');
    }
  }, [speak, speakAsSpark, listenAndTranscribe, getCurrentChallenge, goToNextChallenge, setPhase, setTutorExpression, setShowMinion, runMicroConversation]);

  return {
    voiceState,
    currentSpeaker,
    displayedText,
    error,
    runOnboardingInteraction,
    runPreChallengeInteraction,
    runPostChallengeInteraction,
    runSlideInteraction,
    runFractionCompareInteraction,
    runCheckpointInteraction,
    runGoofyMomentInteraction,
    runDynamicQuestionInteraction,
    speak,
    // PTT controls
    handlePTTStart,
    handlePTTEnd,
  };
}
