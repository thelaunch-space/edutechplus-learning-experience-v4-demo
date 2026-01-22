import { useEffect, useState } from 'react';
import styles from './LandscapePrompt.module.css';

export function LandscapePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      // Only show prompt on mobile devices (width < 768px) in portrait mode
      const isMobile = window.innerWidth < 768;
      const isPortrait = window.innerHeight > window.innerWidth;
      setShowPrompt(isMobile && isPortrait);
    };

    // Try to lock orientation if supported
    const lockOrientation = async () => {
      try {
        const orientation = screen.orientation as ScreenOrientation & { lock?: (orientation: string) => Promise<void> };
        if (orientation && typeof orientation.lock === 'function') {
          await orientation.lock('landscape');
        }
      } catch {
        // Orientation lock not supported or permission denied
        // This is expected on most browsers, so we show the prompt instead
      }
    };

    checkOrientation();
    lockOrientation();

    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!showPrompt) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <div className={styles.phoneIcon}>
          <div className={styles.phone}>
            <div className={styles.screen} />
          </div>
          <div className={styles.arrow} />
        </div>
        <h2 className={styles.title}>Rotate Your Device</h2>
        <p className={styles.message}>
          Please turn your phone sideways for the best learning experience!
        </p>
      </div>
    </div>
  );
}
