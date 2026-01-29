import { useState } from 'react';
import styles from './SlideViewer.module.css';

interface SlideViewerProps {
  slideUrl: string;
  onComplete: () => void;
}

export default function SlideViewer({ slideUrl, onComplete }: SlideViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    console.log('✅ Slide: Image loaded successfully');
    setIsLoaded(true);
  };

  const handleImageError = () => {
    console.error('❌ Slide: Failed to load image');
    setIsLoaded(true); // Still show the skip button
  };

  const handleSkip = () => {
    console.log('⏭️ Slide: Skip button clicked');
    onComplete();
  };

  return (
    <div className={styles.container}>
      {!isLoaded && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading slide...</p>
        </div>
      )}
      <img
        src={slideUrl}
        alt="Learning slide"
        className={styles.slide}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ opacity: isLoaded ? 1 : 0 }}
      />
      {isLoaded && (
        <button className={styles.skipButton} onClick={handleSkip}>
          Skip →
        </button>
      )}
    </div>
  );
}
