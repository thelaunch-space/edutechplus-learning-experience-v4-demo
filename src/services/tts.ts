// ElevenLabs TTS with browser fallback
const ELEVENLABS_TTS_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

// Result type for synchronized playback
export interface TTSResult {
  duration: number;        // Audio duration in seconds
  playbackDone: Promise<void>;  // Resolves when audio finishes
}

// ElevenLabs voice config
// Using "Aria" — expressive, warm, young female voice (good for kid-facing tutor)
// Fallback to any available voice if this one isn't on the account
const VOICE_ID = '9BWtsMINqrJLrRacOk9x'; // Aria
const MODEL_ID = 'eleven_turbo_v2_5'; // Lowest latency model

let isAudioUnlocked = false;

// Unlock audio context on first user interaction (required for iOS)
export function unlockAudio(): void {
  if (isAudioUnlocked) return;

  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

    // Create and play a silent buffer to unlock
    const buffer = audioContext.createBuffer(1, 1, 22050);
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start();

    isAudioUnlocked = true;
    console.log('Audio context unlocked');
  } catch (error) {
    console.error('Failed to unlock audio:', error);
  }
}

export async function speakText(text: string): Promise<TTSResult> {
  console.log('🔊 TTS: Starting to speak:', text.substring(0, 50) + '...');
  const apiKey = import.meta.env.VITE_ELEVENLABS_KEY;

  if (!apiKey) {
    console.warn('⚠️ TTS: ElevenLabs API key not configured, using browser TTS fallback');
    return browserTTSFallback(text);
  }

  try {
    const url = `${ELEVENLABS_TTS_URL}/${VOICE_ID}`;
    console.log('📡 TTS: Calling ElevenLabs API with model:', MODEL_ID);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.4,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ TTS: ElevenLabs API error:', response.status, errorText);
      return browserTTSFallback(text);
    }

    console.log('✅ TTS: ElevenLabs API success, got audio');
    const audioBlob = await response.blob();
    console.log('🎵 TTS: Audio blob size:', audioBlob.size, 'bytes');
    const audioUrl = URL.createObjectURL(audioBlob);

    const audio = new Audio(audioUrl);

    // Wait for metadata to get duration, then start playback
    return new Promise((resolve, reject) => {
      audio.onloadedmetadata = () => {
        const duration = audio.duration;
        console.log('🎵 TTS: Audio duration:', duration, 'seconds');

        // Create promise that resolves when audio finishes
        const playbackDone = new Promise<void>((doneResolve, doneReject) => {
          audio.onended = () => {
            console.log('✅ TTS: Audio playback finished');
            URL.revokeObjectURL(audioUrl);
            doneResolve();
          };

          audio.onerror = (e) => {
            console.error('❌ TTS: Audio playback error:', e);
            URL.revokeObjectURL(audioUrl);
            doneReject(e);
          };
        });

        // Start playback
        console.log('▶️ TTS: Starting audio playback...');
        audio.play()
          .then(() => {
            resolve({ duration, playbackDone });
          })
          .catch(async (error) => {
            console.error('❌ TTS: Audio play() failed:', error);
            URL.revokeObjectURL(audioUrl);
            try {
              const fallbackResult = await browserTTSFallback(text);
              resolve(fallbackResult);
            } catch (fallbackError) {
              reject(fallbackError);
            }
          });
      };

      audio.onerror = (e) => {
        console.error('❌ TTS: Audio load error:', e);
        URL.revokeObjectURL(audioUrl);
        browserTTSFallback(text).then(resolve).catch(reject);
      };
    });
  } catch (error) {
    console.error('❌ TTS: ElevenLabs error:', error);
    console.log('⚠️ TTS: Falling back to browser TTS');
    return browserTTSFallback(text);
  }
}

// Browser-based TTS fallback
function browserTTSFallback(text: string): Promise<TTSResult> {
  console.log('🤖 TTS Fallback: Using browser speech synthesis');

  // Estimate duration: ~280ms per word for browser TTS
  const words = text.split(' ').length;
  const estimatedDuration = (words * 280) / 1000;

  return new Promise((resolve) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.15;

      // Try to pick a female English voice
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.name.includes('Samantha')) // macOS
        || voices.find(v => v.name.includes('Karen'))
        || voices.find(v => v.name.includes('Google UK English Female'))
        || voices.find(v => /female/i.test(v.name) && v.lang.startsWith('en'))
        || voices.find(v => v.lang.startsWith('en'));
      if (preferred) utterance.voice = preferred;

      const playbackDone = new Promise<void>((doneResolve) => {
        utterance.onend = () => {
          console.log('✅ TTS Fallback: Browser speech finished');
          doneResolve();
        };
        utterance.onerror = (e) => {
          console.error('❌ TTS Fallback: Browser speech error:', e);
          doneResolve();
        };
      });

      console.log('▶️ TTS Fallback: Starting browser speech...');
      window.speechSynthesis.speak(utterance);
      resolve({ duration: estimatedDuration, playbackDone });
    } else {
      console.warn('⚠️ TTS Fallback: Speech synthesis not supported');
      resolve({ duration: 0, playbackDone: Promise.resolve() });
    }
  });
}
