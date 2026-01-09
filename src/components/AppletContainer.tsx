import { useEffect, useRef } from 'react';
import styles from './AppletContainer.module.css';

interface AppletContainerProps {
  src: string;
  onComplete: () => void;
}

export function AppletContainer({ src, onComplete }: AppletContainerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    // Reset completion flag when src changes
    hasCompletedRef.current = false;

    const handleMessage = (event: MessageEvent) => {
      // Handle completion message from applet
      // Applets send: { type: 'ASSET_COMPLETE' } or similar
      if (
        event.data?.type === 'ASSET_COMPLETE' ||
        event.data?.type === 'APPLET_COMPLETE' ||
        event.data?.complete === true
      ) {
        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true;
          console.log('Applet completed via postMessage');
          onComplete();
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [src, onComplete]);

  // URL-encode the path to handle spaces in folder names
  const encodedSrc = encodeURI(src);

  return (
    <div className={styles.container}>
      <iframe
        ref={iframeRef}
        className={styles.iframe}
        src={encodedSrc}
        title="Learning Activity"
        allow="autoplay; microphone"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />

      {/* Manual complete button for applets that don't send postMessage */}
      <button
        className={styles.completeButton}
        onClick={() => {
          if (!hasCompletedRef.current) {
            hasCompletedRef.current = true;
            onComplete();
          }
        }}
      >
        Done! Next Challenge →
      </button>
    </div>
  );
}
