const DEEPGRAM_API_URL = 'https://api.deepgram.com/v1/listen';

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const apiKey = import.meta.env.VITE_DEEPGRAM_KEY;

  if (!apiKey) {
    console.warn('Deepgram API key not configured');
    return '';
  }

  try {
    const response = await fetch(`${DEEPGRAM_API_URL}?model=nova-2&smart_format=true`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': audioBlob.type || 'audio/webm',
      },
      body: audioBlob,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Deepgram API error:', response.status, errorText);
      return '';
    }

    const data = await response.json();
    const transcript = data.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';

    console.log('Transcribed:', transcript);
    return transcript.trim();
  } catch (error) {
    console.error('Deepgram transcription error:', error);
    return '';
  }
}
