import { useRef, useEffect, useState } from 'react';
import styles from './VideoPlayer.module.css';

interface VideoPlayerProps {
  src: string;
  onComplete: () => void;
}

export function VideoPlayer({ src, onComplete }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log('🎬 Video: Loading video:', src);
    setIsReady(false);

    // Load the video
    video.load();

    // Wait for video to be ready
    const handleCanPlay = () => {
      console.log('✅ Video: Video ready to play');
      setIsReady(true);

      // Wait 500ms before auto-playing to ensure TTS is done
      setTimeout(() => {
        console.log('▶️ Video: Starting playback...');
        video.play().catch((error) => {
          console.error('❌ Video: Play failed:', error);
        });
      }, 500);
    };

    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [src]);

  const handleEnded = () => {
    console.log('✅ Video: Video ended, calling onComplete');
    onComplete();
  };

  const handleSkip = () => {
    console.log('⏭️ Video: Skip button clicked');
    const video = videoRef.current;
    if (video) {
      video.pause();
    }
    onComplete();
  };

  return (
    <div className={styles.container}>
      {!isReady && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading video...</p>
        </div>
      )}
      <video
        ref={videoRef}
        className={styles.video}
        src={src}
        playsInline
        onEnded={handleEnded}
        controls={false}
        style={{ opacity: isReady ? 1 : 0 }}
      />
      {isReady && (
        <button className={styles.skipButton} onClick={handleSkip}>
          Skip →
        </button>
      )}
    </div>
  );
}
