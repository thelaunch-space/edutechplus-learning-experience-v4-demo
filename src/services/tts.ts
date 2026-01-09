// Deepgram Aura TTS - supports browser CORS
const DEEPGRAM_TTS_URL = 'https://api.deepgram.com/v1/speak';

// Available Aura voices:
// aura-asteria-en - Female, warm, friendly (recommended for kids)
// aura-luna-en - Female, soft
// aura-stella-en - Female, upbeat
// aura-athena-en - Female, professional
// aura-hera-en - Female, authoritative
// aura-orion-en - Male, warm
// aura-arcas-en - Male, authoritative
// aura-perseus-en - Male, youthful
// aura-angus-en - Male, conversational
// aura-orpheus-en - Male, rich
// aura-helios-en - Male, enthusiastic
// aura-zeus-en - Male, authoritative

const VOICE = 'aura-asteria-en'; // Warm female voice, great for kids

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

export async function speakText(text: string): Promise<void> {
  console.log('🔊 TTS: Starting to speak:', text.substring(0, 50) + '...');
  const apiKey = import.meta.env.VITE_DEEPGRAM_KEY;

  if (!apiKey) {
    console.warn('⚠️ TTS: Deepgram API key not configured, using browser TTS fallback');
    return browserTTSFallback(text);
  }

  try {
    const url = `${DEEPGRAM_TTS_URL}?model=${VOICE}`;
    console.log('📡 TTS: Calling Deepgram API with voice:', VOICE);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ TTS: Deepgram API error:', response.status, errorText);
      return browserTTSFallback(text);
    }

    console.log('✅ TTS: Deepgram API success, got audio blob');
    const audioBlob = await response.blob();
    console.log('🎵 TTS: Audio blob size:', audioBlob.size, 'bytes');
    const audioUrl = URL.createObjectURL(audioBlob);

    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        console.log('✅ TTS: Audio playback finished');
        URL.revokeObjectURL(audioUrl);
        resolve();
      };

      audio.onerror = (e) => {
        console.error('❌ TTS: Audio playback error:', e);
        URL.revokeObjectURL(audioUrl);
        reject(e);
      };

      console.log('▶️ TTS: Starting audio playback...');
      audio.play().catch((error) => {
        console.error('❌ TTS: Audio play() failed:', error);
        console.log('⚠️ TTS: Falling back to browser TTS');
        // Try browser TTS as fallback
        browserTTSFallback(text).then(resolve).catch(reject);
      });
    });
  } catch (error) {
    console.error('❌ TTS: Deepgram error:', error);
    console.log('⚠️ TTS: Falling back to browser TTS');
    return browserTTSFallback(text);
  }
}

// Browser-based TTS fallback
function browserTTSFallback(text: string): Promise<void> {
  console.log('🤖 TTS Fallback: Using browser speech synthesis');
  return new Promise((resolve) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.onend = () => {
        console.log('✅ TTS Fallback: Browser speech finished');
        resolve();
      };
      utterance.onerror = (e) => {
        console.error('❌ TTS Fallback: Browser speech error:', e);
        resolve(); // Resolve even on error to not block
      };
      console.log('▶️ TTS Fallback: Starting browser speech...');
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('⚠️ TTS Fallback: Speech synthesis not supported');
      resolve();
    }
  });
}
