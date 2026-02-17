import { useEffect, useState, useRef, useCallback } from 'react';
import { useSessionStore } from './store/sessionStore';
import { useVoiceInteraction } from './hooks/useVoiceInteraction';
import { useMicrophone } from './hooks/useMicrophone';
import { WelcomeScreen } from './components/WelcomeScreen';
import { YouTubePlayer } from './components/YouTubePlayer';
import { AppletContainer } from './components/AppletContainer';
import { CompletionScreen } from './components/CompletionScreen';
import { ChatPane } from './components/ChatPane';
import { LandscapePrompt } from './components/LandscapePrompt';
import { Confetti } from './components/Confetti';
import { FractionCompareSlide } from './components/FractionCompareSlide/FractionCompareSlide';
import { TutorCharacter } from './components/TutorCharacter';
import { MinionCharacter } from './components/MinionCharacter';
import { NavBar } from './components/NavBar';
import { CheckpointSlide } from './components/CheckpointSlide/CheckpointSlide';
import { OnboardingWelcome } from './components/OnboardingWelcome';
import { DynamicSlideRenderer } from './components/DynamicSlides/DynamicSlideRenderer';
import styles from './App.module.css';

function App() {
  const {
    phase,
    setPhase,
    studentName,
    currentChallengeIndex,
    getCurrentChallenge,
    resetSession,
    allMessages,
    showConfetti,
    clearConfetti,
    dynamicSlideFrame,
    slideInteractionState,
    updateSlideInteraction,
    tutorExpression,
    setTutorExpression,
    showMinion,
    checkpointFrame,
    questionSlideFrame,
    questionSlideState,
    updateQuestionSlideState,
  } = useSessionStore();

  const {
    voiceState,
    displayedText,
    runOnboardingInteraction,
    runPreChallengeInteraction,
    runPostChallengeInteraction,
    runSlideInteraction,
    runFractionCompareInteraction,
    runCheckpointInteraction,
    runGoofyMomentInteraction,
    runDynamicQuestionInteraction,
    speak,
    handlePTTStart,
    handlePTTEnd,
  } = useVoiceInteraction();

  const { requestPermission } = useMicrophone();

  const [isWelcome, setIsWelcome] = useState(true);

  // Track whether Max is mid-portal-animation — interactions wait for this
  const [isTutorEntering, setIsTutorEntering] = useState(true);
  const prevTutorVisibleRef = useRef(true);

  // Guards to prevent React StrictMode from running effects twice
  const hasRunOnboarding = useRef(false);
  const hasRunPreChallenge = useRef<number | null>(null);
  const hasRunPostChallenge = useRef<number | null>(null);
  const hasRunSlide = useRef<number | null>(null);
  const hasRunDynamicSlide = useRef<number | null>(null);
  const hasRunCheckpoint = useRef<number | null>(null);
  const hasRunGoofy = useRef<number | null>(null);
  const hasRunDynamicQuestion = useRef<number | null>(null);

  const challenge = getCurrentChallenge();

  // Check if we should show dynamic slide (Node with hasDynamicSlide in POST_CHALLENGE)
  const showDynamicSlide = phase === 'POST_CHALLENGE' && challenge?.hasDynamicSlide;

  // Check if we should show dynamic question slide (nodes with dynamicSlideTemplate)
  const showDynamicQuestion = phase === 'POST_CHALLENGE' && challenge?.dynamicSlideTemplate && !challenge?.hasDynamicSlide;
  // Also show during question slide Q&A (nodes 15, 17 — type=slide with dynamicSlideTemplate)
  const showDynamicQuestionSlide = challenge?.type === 'slide' && challenge?.dynamicSlideTemplate && phase === 'IN_CHALLENGE';

  // Determine character visibility — hide during video/applet playback
  const isContentPlaying = phase === 'IN_CHALLENGE' && (challenge?.type === 'video' || challenge?.type === 'applet');
  const tutorVisible = !isContentPlaying;

  // When tutor goes from hidden → visible, mark as entering (animation starting)
  useEffect(() => {
    if (tutorVisible && !prevTutorVisibleRef.current) {
      setIsTutorEntering(true);
    }
    prevTutorVisibleRef.current = tutorVisible;
  }, [tutorVisible]);

  // Called when TutorCharacter portal animation finishes
  const handleTutorEntryComplete = useCallback(() => {
    setIsTutorEntering(false);
  }, []);

  // Derive Spark expression from context (without touching voice hook)
  const sparkExpression = (() => {
    if (showConfetti) return 'celebration';
    if (tutorExpression === 'giggling') return 'giggling';
    if (tutorExpression === 'nudging') return 'nudging';
    return 'neutral';
  })();

  // Handle welcome screen start
  const handleStart = async () => {
    console.log('🎤 App: Requesting microphone permission...');
    await requestPermission();
    setIsWelcome(false);
    setPhase('ONBOARDING');
  };

  // Auto-run onboarding interaction — waits for portal animation to finish
  useEffect(() => {
    console.log(`🔄 App: Phase changed to ${phase}`);
    if (phase === 'ONBOARDING' && !isWelcome && !hasRunOnboarding.current && !isTutorEntering) {
      console.log('🚀 App: Starting onboarding interaction');
      hasRunOnboarding.current = true;
      runOnboardingInteraction();
    }
  }, [phase, isWelcome, isTutorEntering]);

  // Auto-run pre-challenge interaction OR slide interaction
  useEffect(() => {
    if (isTutorEntering) return;
    if (phase === 'PRE_CHALLENGE') {
      const currentChallenge = getCurrentChallenge();

      // Check if current challenge is a slide
      if (currentChallenge?.type === 'slide' && hasRunSlide.current !== currentChallengeIndex) {
        // Question slides with dynamic templates use the dynamic question flow
        if (currentChallenge.dynamicSlideTemplate && currentChallenge.isQuestionSlide) {
          console.log(`🚀 App: Starting dynamic question slide for challenge ${currentChallengeIndex + 1}`);
          hasRunSlide.current = currentChallengeIndex;
          hasRunDynamicQuestion.current = currentChallengeIndex;
          // Speak preScript, show slide, then run dynamic interaction
          (async () => {
            setTutorExpression('neutral');
            await speak(currentChallenge.preScript);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setPhase('IN_CHALLENGE');
            await new Promise(resolve => setTimeout(resolve, 500));
            runDynamicQuestionInteraction();
          })();
        } else {
          console.log(`🚀 App: Starting slide interaction for challenge ${currentChallengeIndex + 1}`);
          hasRunSlide.current = currentChallengeIndex;
          runSlideInteraction();
        }
      } else if (currentChallenge?.type !== 'slide' && currentChallenge?.type !== 'checkpoint' && currentChallenge?.type !== 'goofy' && hasRunPreChallenge.current !== currentChallengeIndex) {
        console.log(`🚀 App: Starting pre-challenge for challenge ${currentChallengeIndex + 1}`);
        hasRunPreChallenge.current = currentChallengeIndex;
        runPreChallengeInteraction();
      }
    }
  }, [phase, currentChallengeIndex, isTutorEntering, getCurrentChallenge, runPreChallengeInteraction, runSlideInteraction, runDynamicQuestionInteraction]);

  // Auto-run checkpoint interaction
  useEffect(() => {
    if (isTutorEntering) return;
    if (phase === 'PRE_CHALLENGE') {
      const currentChallenge = getCurrentChallenge();
      if (currentChallenge?.type === 'checkpoint' && hasRunCheckpoint.current !== currentChallengeIndex) {
        hasRunCheckpoint.current = currentChallengeIndex;
        runCheckpointInteraction();
      }
    }
  }, [phase, currentChallengeIndex, isTutorEntering]);

  // Auto-run goofy moment interaction
  useEffect(() => {
    if (isTutorEntering) return;
    if (phase === 'PRE_CHALLENGE') {
      const currentChallenge = getCurrentChallenge();
      if (currentChallenge?.type === 'goofy' && hasRunGoofy.current !== currentChallengeIndex) {
        hasRunGoofy.current = currentChallengeIndex;
        runGoofyMomentInteraction();
      }
    }
  }, [phase, currentChallengeIndex, isTutorEntering]);

  // Auto-run post-challenge interaction (or dynamic slide interaction)
  useEffect(() => {
    if (isTutorEntering) return;
    if (phase === 'POST_CHALLENGE' && hasRunPostChallenge.current !== currentChallengeIndex) {
      const currentChallenge = getCurrentChallenge();

      // Check if this challenge uses the original FractionCompareSlide (Node 4)
      if (currentChallenge?.hasDynamicSlide && hasRunDynamicSlide.current !== currentChallengeIndex) {
        console.log(`🚀 App: Starting dynamic slide interaction for challenge ${currentChallengeIndex + 1}`);
        hasRunPostChallenge.current = currentChallengeIndex;
        hasRunDynamicSlide.current = currentChallengeIndex;
        runFractionCompareInteraction();
      }
      // Check if this challenge uses new dynamic question templates (tap-based)
      else if (currentChallenge?.dynamicSlideTemplate && !currentChallenge?.hasDynamicSlide && hasRunDynamicQuestion.current !== currentChallengeIndex) {
        console.log(`🚀 App: Starting dynamic question interaction (${currentChallenge.dynamicSlideTemplate}) for challenge ${currentChallengeIndex + 1}`);
        hasRunPostChallenge.current = currentChallengeIndex;
        hasRunDynamicQuestion.current = currentChallengeIndex;
        runDynamicQuestionInteraction();
      }
      // Regular voice-only post-challenge
      else if (!currentChallenge?.hasDynamicSlide && !currentChallenge?.dynamicSlideTemplate) {
        console.log(`🚀 App: Starting post-challenge for challenge ${currentChallengeIndex + 1}`);
        hasRunPostChallenge.current = currentChallengeIndex;
        runPostChallengeInteraction();
      }
    }
  }, [phase, currentChallengeIndex, isTutorEntering, getCurrentChallenge, runPostChallengeInteraction, runFractionCompareInteraction, runDynamicQuestionInteraction]);

  // Handle challenge completion
  const handleChallengeComplete = () => {
    console.log('✅ App: Challenge completed, moving to POST_CHALLENGE');
    setPhase('POST_CHALLENGE');
  };

  // Handle skip (used by NavBar for video/applet skip)
  const handleSkip = () => {
    handleChallengeComplete();
  };

  // Handle restart
  const handleRestart = () => {
    hasRunOnboarding.current = false;
    hasRunPreChallenge.current = null;
    hasRunPostChallenge.current = null;
    hasRunSlide.current = null;
    hasRunDynamicSlide.current = null;
    hasRunCheckpoint.current = null;
    hasRunGoofy.current = null;
    hasRunDynamicQuestion.current = null;
    setIsTutorEntering(true);
    resetSession();
    setIsWelcome(true);
  };

  // Dynamic slide tap handlers (FractionCompareSlide — Node 4)
  const handleLeftTap = () => updateSlideInteraction({ leftTapped: true });
  const handleRightTap = () => updateSlideInteraction({ rightTapped: true });
  const handleLeftHighlight = () => updateSlideInteraction({ leftHighlighted: true });
  const handleRightHighlight = () => updateSlideInteraction({ rightHighlighted: true });

  // Dynamic question slide tap handlers (new templates)
  const handlePieceTap = (index: number) => {
    const current = useSessionStore.getState().questionSlideState;
    if (!current.tappedPieces.includes(index)) {
      updateQuestionSlideState({ tappedPieces: [...current.tappedPieces, index] });
    }
  };
  const handleChoiceTap = (index: number) => {
    updateQuestionSlideState({ selectedIndex: index });
  };
  const handleOptionTap = (index: number) => {
    updateQuestionSlideState({ selectedIndex: index });
  };

  // Render welcome screen
  if (isWelcome) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  // Render completion screen
  if (phase === 'COMPLETE') {
    return (
      <CompletionScreen
        studentName={studentName}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className={styles.appContainer}>
      {/* Landscape orientation prompt */}
      <LandscapePrompt />

      {/* Celebration confetti */}
      <Confetti isActive={showConfetti} onComplete={clearConfetti} />

      {/* Left sidebar - chat */}
      <div className={styles.sidebar}>
        <ChatPane
          messages={allMessages}
          currentMessage={displayedText}
          voiceState={voiceState}
        />
      </div>

      {/* Right side — 3-panel layout */}
      <div className={styles.rightSide}>
        <div className={styles.panelStack}>
          {/* Top panel */}
          <div className={styles.topPanel} />

          {/* Center panel — content area */}
          <div className={styles.centerPanel}>
            <div className={styles.contentPane}>
              {/* Onboarding welcome content */}
              {challenge?.type === 'onboarding' && <OnboardingWelcome />}

              {/* Video content */}
              {challenge?.type === 'video' && phase === 'IN_CHALLENGE' && (
                challenge.youtubeId ? (
                  <YouTubePlayer videoId={challenge.youtubeId} onComplete={handleChallengeComplete} />
                ) : null
              )}

              {/* Applet content */}
              {challenge?.type === 'applet' && phase === 'IN_CHALLENGE' && (
                <AppletContainer src={challenge.path} onComplete={handleChallengeComplete} />
              )}

              {/* Slide content — static image (only if no dynamic template) */}
              {challenge?.type === 'slide' && phase === 'IN_CHALLENGE' && !challenge.dynamicSlideTemplate && (
                <div className={styles.slideContainer}>
                  <img src={challenge.slideUrl} alt={challenge.title} className={styles.slideImage} />
                </div>
              )}

              {/* Checkpoint content */}
              {challenge?.type === 'checkpoint' && challenge.checkpointId && (
                <CheckpointSlide checkpointId={challenge.checkpointId} frame={checkpointFrame} />
              )}

              {/* Dynamic slide for Node with hasDynamicSlide */}
              {showDynamicSlide && (
                <FractionCompareSlide
                  frame={dynamicSlideFrame}
                  interactionState={slideInteractionState}
                  onLeftTap={handleLeftTap}
                  onRightTap={handleRightTap}
                  onLeftHighlight={handleLeftHighlight}
                  onRightHighlight={handleRightHighlight}
                />
              )}

              {/* Dynamic question slides (new templates — FractionBuilder, MultipleChoice, TapToSelect) */}
              {(showDynamicQuestion || showDynamicQuestionSlide) && challenge?.dynamicSlideTemplate && challenge?.dynamicSlideId && (
                <DynamicSlideRenderer
                  template={challenge.dynamicSlideTemplate}
                  slideId={challenge.dynamicSlideId}
                  frame={questionSlideFrame}
                  state={questionSlideState}
                  onPieceTap={handlePieceTap}
                  onChoiceTap={handleChoiceTap}
                  onOptionTap={handleOptionTap}
                />
              )}

              {/* Static slide backdrop during POST_CHALLENGE Q&A for regular nodes */}
              {phase === 'POST_CHALLENGE' && !showDynamicSlide && !showDynamicQuestion && challenge?.type !== 'checkpoint' && challenge?.slideUrl && (
                <div className={styles.slideContainer}>
                  <img src={challenge.slideUrl} alt={challenge.title} className={styles.slideImage} />
                </div>
              )}
            </div>
          </div>

          {/* Bottom panel — NavBar lives here */}
          <div className={styles.bottomPanel}>
            <NavBar
              onSkip={handleSkip}
              onPTTStart={handlePTTStart}
              onPTTEnd={handlePTTEnd}
              showPTT={voiceState === 'WAITING_FOR_STUDENT' || voiceState === 'STUDENT_RECORDING'}
              isPTTActive={voiceState === 'STUDENT_RECORDING'}
              showSkip={phase === 'IN_CHALLENGE' && (challenge?.type === 'video' || challenge?.type === 'applet')}
              voiceState={voiceState}
            />
          </div>
        </div>
      </div>

      {/* Character at bottom-left */}
      <div className={styles.characterArea}>
        <TutorCharacter
          expression={tutorExpression}
          visible={tutorVisible}
          onEntryComplete={handleTutorEntryComplete}
        />
      </div>

      {/* Minion to the left of character */}
      <div className={styles.minionArea}>
        <MinionCharacter visible={showMinion} expression={sparkExpression} />
      </div>
    </div>
  );
}

export default App;
