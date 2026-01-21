import { useEffect, useState, useRef } from 'react';
import { useSessionStore } from './store/sessionStore';
import { useVoiceInteraction } from './hooks/useVoiceInteraction';
import { useMicrophone } from './hooks/useMicrophone';
import { WelcomeScreen } from './components/WelcomeScreen';
import { VoiceInteraction } from './components/VoiceInteraction';
import { VideoPlayer } from './components/VideoPlayer';
import { YouTubePlayer } from './components/YouTubePlayer';
import { AppletContainer } from './components/AppletContainer';
import { ProgressBar } from './components/ProgressBar';
import { CompletionScreen } from './components/CompletionScreen';
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
  } = useSessionStore();

  const {
    voiceState,
    lastResponse,
    displayedText,
    runGreetingInteraction,
    runPreChallengeInteraction,
    runPostChallengeInteraction,
    handlePTTStart,
    handlePTTEnd,
  } = useVoiceInteraction();

  const { requestPermission } = useMicrophone();

  const [isWelcome, setIsWelcome] = useState(true);

  // Guards to prevent React StrictMode from running effects twice
  const hasRunGreeting = useRef(false);
  const hasRunPreChallenge = useRef<number | null>(null);
  const hasRunPostChallenge = useRef<number | null>(null);

  const challenge = getCurrentChallenge();

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

  // Auto-run pre-challenge interaction
  useEffect(() => {
    if (phase === 'PRE_CHALLENGE' && hasRunPreChallenge.current !== currentChallengeIndex) {
      console.log(`🚀 App: Starting pre-challenge for challenge ${currentChallengeIndex + 1}`);
      hasRunPreChallenge.current = currentChallengeIndex;
      runPreChallengeInteraction();
    }
  }, [phase, currentChallengeIndex]);

  // Auto-run post-challenge interaction
  useEffect(() => {
    if (phase === 'POST_CHALLENGE' && hasRunPostChallenge.current !== currentChallengeIndex) {
      console.log(`🚀 App: Starting post-challenge for challenge ${currentChallengeIndex + 1}`);
      hasRunPostChallenge.current = currentChallengeIndex;
      runPostChallengeInteraction();
    }
  }, [phase, currentChallengeIndex]);

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
    resetSession();
    setIsWelcome(true);
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
    <div className={styles.container}>
      {/* Header with progress */}
      <header className={styles.header}>
        <ProgressBar
          current={currentChallengeIndex}
          total={challenges.length}
          title={challenge?.title || 'Math Adventure'}
        />
      </header>

      {/* Main content area */}
      <main className={styles.main}>
        {/* Voice interaction screens */}
        {(phase === 'GREETING' || phase === 'PRE_CHALLENGE' || phase === 'POST_CHALLENGE') && (
          <VoiceInteraction
            voiceState={voiceState}
            message={displayedText || lastResponse}
            onPTTStart={handlePTTStart}
            onPTTEnd={handlePTTEnd}
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
            ) : (
              <AppletContainer
                src={challenge.path}
                onComplete={handleChallengeComplete}
              />
            )}
          </>
        )}
      </main>

    </div>
  );
}

export default App;
