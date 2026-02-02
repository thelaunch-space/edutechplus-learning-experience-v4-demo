import { useEffect, useState, useRef } from 'react';
import { useSessionStore } from './store/sessionStore';
import { useVoiceInteraction } from './hooks/useVoiceInteraction';
import { useMicrophone } from './hooks/useMicrophone';
import { WelcomeScreen } from './components/WelcomeScreen';
import { VideoPlayer } from './components/VideoPlayer';
import { YouTubePlayer } from './components/YouTubePlayer';
import { AppletContainer } from './components/AppletContainer';
import { ProgressBar } from './components/ProgressBar';
import { CompletionScreen } from './components/CompletionScreen';
import { ChatPane } from './components/ChatPane';
import { MathMateAvatar } from './components/MathMateAvatar';
import { LandscapePrompt } from './components/LandscapePrompt';
import { Confetti } from './components/Confetti';
import { FractionCompareSlide } from './components/FractionCompareSlide/FractionCompareSlide';
import styles from './App.module.css';

function App() {
  const {
    phase,
    setPhase,
    studentName,
    currentChallengeIndex,
    challenges,
    getCurrentChallenge,
    resetSession,
    allMessages,
    showConfetti,
    clearConfetti,
    dynamicSlideFrame,
    slideInteractionState,
    updateSlideInteraction,
  } = useSessionStore();

  const {
    voiceState,
    displayedText,
    runGreetingInteraction,
    runPreChallengeInteraction,
    runPostChallengeInteraction,
    runSlideInteraction,
    runFractionCompareInteraction,
    handlePTTStart,
    handlePTTEnd,
  } = useVoiceInteraction();

  const { requestPermission } = useMicrophone();

  const [isWelcome, setIsWelcome] = useState(true);

  // Guards to prevent React StrictMode from running effects twice
  const hasRunGreeting = useRef(false);
  const hasRunPreChallenge = useRef<number | null>(null);
  const hasRunPostChallenge = useRef<number | null>(null);
  const hasRunSlide = useRef<number | null>(null);
  const hasRunDynamicSlide = useRef<number | null>(null);

  const challenge = getCurrentChallenge();

  // Check if we should show dynamic slide (Node 4 in POST_CHALLENGE)
  const showDynamicSlide = phase === 'POST_CHALLENGE' && challenge?.hasDynamicSlide;

  // Chat pane visibility logic:
  // HIDE during IN_CHALLENGE phase for videos/applets (full-screen content)
  // SHOW for slides, conversation phases, and dynamic slide phases (companion mode)
  const shouldShowChatPane = !(
    phase === 'IN_CHALLENGE' &&
    (challenge?.type === 'video' || challenge?.type === 'applet')
  ) || showDynamicSlide;

  // Handle welcome screen start
  const handleStart = async () => {
    // Request mic permission upfront
    console.log('🎤 App: Requesting microphone permission...');
    await requestPermission();
    setIsWelcome(false);
    setPhase('GREETING');
  };

  // Auto-run greeting interaction when phase changes to GREETING
  useEffect(() => {
    console.log(`🔄 App: Phase changed to ${phase}`);
    if (phase === 'GREETING' && !isWelcome && !hasRunGreeting.current) {
      console.log('🚀 App: Starting greeting interaction');
      hasRunGreeting.current = true;
      runGreetingInteraction();
    }
  }, [phase, isWelcome]);

  // Auto-run pre-challenge interaction OR slide interaction
  useEffect(() => {
    if (phase === 'PRE_CHALLENGE') {
      const currentChallenge = getCurrentChallenge();

      // Check if current challenge is a slide
      if (currentChallenge?.type === 'slide' && hasRunSlide.current !== currentChallengeIndex) {
        console.log(`🚀 App: Starting slide interaction for challenge ${currentChallengeIndex + 1}`);
        hasRunSlide.current = currentChallengeIndex;
        runSlideInteraction();
      } else if (currentChallenge?.type !== 'slide' && hasRunPreChallenge.current !== currentChallengeIndex) {
        console.log(`🚀 App: Starting pre-challenge for challenge ${currentChallengeIndex + 1}`);
        hasRunPreChallenge.current = currentChallengeIndex;
        runPreChallengeInteraction();
      }
    }
  }, [phase, currentChallengeIndex, getCurrentChallenge, runPreChallengeInteraction, runSlideInteraction]);

  // Auto-run post-challenge interaction (or dynamic slide interaction for Node 4)
  useEffect(() => {
    if (phase === 'POST_CHALLENGE' && hasRunPostChallenge.current !== currentChallengeIndex) {
      const currentChallenge = getCurrentChallenge();

      // Check if this challenge uses dynamic slide
      if (currentChallenge?.hasDynamicSlide && hasRunDynamicSlide.current !== currentChallengeIndex) {
        console.log(`🚀 App: Starting dynamic slide interaction for challenge ${currentChallengeIndex + 1}`);
        hasRunPostChallenge.current = currentChallengeIndex;
        hasRunDynamicSlide.current = currentChallengeIndex;
        runFractionCompareInteraction();
      } else if (!currentChallenge?.hasDynamicSlide) {
        console.log(`🚀 App: Starting post-challenge for challenge ${currentChallengeIndex + 1}`);
        hasRunPostChallenge.current = currentChallengeIndex;
        runPostChallengeInteraction();
      }
    }
  }, [phase, currentChallengeIndex, getCurrentChallenge, runPostChallengeInteraction, runFractionCompareInteraction]);

  // Handle challenge completion
  const handleChallengeComplete = () => {
    console.log('✅ App: Challenge completed, moving to POST_CHALLENGE');
    setPhase('POST_CHALLENGE');
  };

  // Handle restart
  const handleRestart = () => {
    // Reset the guards
    hasRunGreeting.current = false;
    hasRunPreChallenge.current = null;
    hasRunPostChallenge.current = null;
    hasRunSlide.current = null;
    hasRunDynamicSlide.current = null;
    resetSession();
    setIsWelcome(true);
  };

  // Dynamic slide tap handlers
  const handleLeftTap = () => updateSlideInteraction({ leftTapped: true });
  const handleRightTap = () => updateSlideInteraction({ rightTapped: true });
  const handleLeftHighlight = () => updateSlideInteraction({ leftHighlighted: true });
  const handleRightHighlight = () => updateSlideInteraction({ rightHighlighted: true });

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
    <div className={styles.appStage}>
      <div className={styles.tvFrame}>
        <div className={styles.container}>
          {/* Landscape orientation prompt for mobile */}
          <LandscapePrompt />

          {/* Celebration confetti */}
          <Confetti isActive={showConfetti} onComplete={clearConfetti} />

          {/* Header with progress */}
          <header className={styles.header}>
            <ProgressBar
              current={currentChallengeIndex}
              total={challenges.length}
              title={challenge?.title || 'Math Adventure'}
            />
          </header>

          {/* Main content area - Two-pane layout */}
          <main className={styles.main}>
            <div className={styles.twoPaneContainer}>
              {/* Chat Pane - Desktop/Tablet: sidebar */}
              {shouldShowChatPane && (
                <div className={styles.chatPaneDesktop}>
                  <ChatPane
                    messages={allMessages}
                    currentMessage={displayedText}
                    voiceState={voiceState}
                    onPTTStart={handlePTTStart}
                    onPTTEnd={handlePTTEnd}
                  />
                </div>
              )}

              {/* Content Pane - Full-screen when chat hidden */}
              <div className={`${styles.contentPane} ${!shouldShowChatPane ? styles.fullScreen : ''}`}>
            {/* Avatar display during voice interactions (greeting/pre/post without dynamic slide) */}
            {(phase === 'GREETING' || phase === 'PRE_CHALLENGE' || (phase === 'POST_CHALLENGE' && !showDynamicSlide)) && (
              <div className={styles.avatarContainer}>
                <MathMateAvatar state={voiceState} size="large" />
              </div>
            )}

            {/* Dynamic slide for Node 4 (FractionCompareSlide) */}
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

            {/* Challenge content */}
            {phase === 'IN_CHALLENGE' && challenge && (
              <>
                {challenge.type === 'video' ? (
                  challenge.youtubeId ? (
                    <YouTubePlayer
                      videoId={challenge.youtubeId}
                      onComplete={handleChallengeComplete}
                    />
                  ) : (
                    <VideoPlayer
                      src={challenge.path}
                      onComplete={handleChallengeComplete}
                    />
                  )
                ) : challenge.type === 'slide' ? (
                  <div className={styles.slideContainer}>
                    <img
                      src={challenge.slideUrl}
                      alt={challenge.title}
                      className={styles.slideImage}
                    />
                  </div>
                ) : (
                  <AppletContainer
                    src={challenge.path}
                    onComplete={handleChallengeComplete}
                  />
                )}
              </>
            )}
          </div>

          {/* Chat Pane - Mobile: overlay */}
          {shouldShowChatPane && (
            <div className={styles.chatPaneMobile}>
              <ChatPane
                messages={allMessages}
                currentMessage={displayedText}
                voiceState={voiceState}
                onPTTStart={handlePTTStart}
                onPTTEnd={handlePTTEnd}
                isOverlay={true}
              />
            </div>
          )}
        </div>
      </main>

        </div>
      </div>
    </div>
  );
}

export default App;
