import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './YouTubePlayer.module.css';

interface YouTubePlayerProps {
  videoId: string;
  onComplete: () => void;
}

// Extend Window interface for YouTube API
declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

// YouTube Player State Constants
const PlayerState = {
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
};

export function YouTubePlayer({ videoId, onComplete }: YouTubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const hasEndedRef = useRef(false);

  // Load YouTube iFrame API
  useEffect(() => {
    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      setIsApiLoaded(true);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
    if (existingScript) {
      // Wait for it to load
      const checkLoaded = setInterval(() => {
        if (window.YT && window.YT.Player) {
          setIsApiLoaded(true);
          clearInterval(checkLoaded);
        }
      }, 100);
      return () => clearInterval(checkLoaded);
    }

    // Load the API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Set up callback
    window.onYouTubeIframeAPIReady = () => {
      console.log('YouTube API loaded');
      setIsApiLoaded(true);
    };

    return () => {
      // Cleanup callback
      window.onYouTubeIframeAPIReady = () => {};
    };
  }, []);

  // Handle video completion
  const handleVideoEnd = useCallback(() => {
    if (hasEndedRef.current) return;
    hasEndedRef.current = true;
    console.log('YouTube video ended, calling onComplete');
    onComplete();
  }, [onComplete]);

  // Create player when API is ready
  useEffect(() => {
    if (!isApiLoaded || !containerRef.current) return;

    console.log('Creating YouTube player for video:', videoId);
    hasEndedRef.current = false;

    // Create a unique container for the player
    const playerId = `youtube-player-${videoId}`;

    // Create player div if it doesn't exist
    let playerDiv = document.getElementById(playerId);
    if (!playerDiv) {
      playerDiv = document.createElement('div');
      playerDiv.id = playerId;
      containerRef.current.appendChild(playerDiv);
    }

    // Destroy existing player if any
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }

    // Create new player
    playerRef.current = new window.YT.Player(playerId, {
      videoId: videoId,
      width: '100%',
      height: '100%',
      playerVars: {
        autoplay: 1,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        showinfo: 0,
        fs: 0,
        disablekb: 1,
      },
      events: {
        onReady: (event: YT.PlayerEvent) => {
          console.log('YouTube player ready');
          setIsReady(true);
          // Auto-play with a small delay
          setTimeout(() => {
            event.target.playVideo();
          }, 500);
        },
        onStateChange: (event: YT.OnStateChangeEvent) => {
          console.log('YouTube player state:', event.data);
          if (event.data === PlayerState.ENDED) {
            handleVideoEnd();
          }
        },
        onError: (event: YT.OnErrorEvent) => {
          console.error('YouTube player error:', event.data);
        },
      },
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [isApiLoaded, videoId, handleVideoEnd]);

  return (
    <div className={styles.container}>
      {!isReady && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading video...</p>
        </div>
      )}
      <div
        ref={containerRef}
        className={styles.playerContainer}
        style={{ opacity: isReady ? 1 : 0 }}
      />
    </div>
  );
}
