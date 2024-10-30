const API_KEY = process.env.NEXT_PUBLIC_ASSEMBLYAI_API_KEY || '08bc580efe91430aa2abe475dd776f65'
const API_BASE_URL = 'https://api.assemblyai.com/v2'

export type TranscriptionMode = 'full' | 'word' | 'sentence' | 'speaker'
export type SubtitleFormat = 'srt' | 'vtt'

export interface CustomSpelling {
  from: string[]
  to: string
}

export interface TranscriptionResult {
  full: string
  word: string
  sentence: string
  speaker: Array<{
    speaker: string
    text: string
  }>
  detectedLanguage?: string
  languageCode?: string
  transcriptId?: string
}

interface TranscriptResponse {
  id: string
  status: 'queued' | 'processing' | 'completed' | 'error'
  text: string
  language_code?: string
  utterances?: Array<{
    speaker: string
    text: string
  }>
  error?: string
}

export const SUPPORTED_LANGUAGES: Record<string, { name: string, flag: string }> = {
  'en': { name: 'Global English', flag: '🌐' },
  'en_au': { name: 'Australian English', flag: '🇦🇺' },
  'en_uk': { name: 'British English', flag: '🇬🇧' },
  'en_us': { name: 'US English', flag: '🇺🇸' },
  'es': { name: 'Spanish', flag: '🇪🇸' },
  'fr': { name: 'French', flag: '🇫🇷' },
  'de': { name: 'German', flag: '🇩🇪' },
  'it': { name: 'Italian', flag: '🇮🇹' },
  'pt': { name: 'Portuguese', flag: '🇵🇹' },
  'nl': { name: 'Dutch', flag: '🇳🇱' },
  'hi': { name: 'Hindi', flag: '🇮🇳' },
  'ja': { name: 'Japanese', flag: '🇯🇵' },
  'zh': { name: 'Chinese', flag: '🇨🇳' },
  'fi': { name: 'Finnish', flag: '🇫🇮' },
  'ko': { name: 'Korean', flag: '🇰🇷' },
  'pl': { name: 'Polish', flag: '🇵🇱' },
  'ru': { name: 'Russian', flag: '🇷🇺' },
  'tr': { name: 'Turkish', flag: '🇹🇷' },
  'uk': { name: 'Ukrainian', flag: '🇺🇦' },
  'vi': { name: 'Vietnamese', flag: '🇻🇳' }
}

async function uploadAudio(file: File): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': API_KEY,
    },
    body: file
  })

  if (!response.ok) {
    throw new Error('Failed to upload audio file')
  }

  const { upload_url } = await response.json()
  return upload_url
}

async function submitTranscription(audioUrl: string, speakersExpected?: number, customSpelling?: CustomSpelling[]): Promise<string> {
  const params: any = {
    audio_url: audioUrl,
    speaker_labels: true,
    language_detection: true,
    speakers_expected: Math.max(2, Math.min(10, speakersExpected || 2))
  }

  if (customSpelling && customSpelling.length > 0) {
    params.custom_spelling = customSpelling
  }

  const response = await fetch(`${API_BASE_URL}/transcript`, {
    method: 'POST',
    headers: {
      'Authorization': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params)
  })

  if (!response.ok) {
    throw new Error('Failed to submit transcription')
  }

  const { id } = await response.json()
  return id
}

async function pollTranscriptionResult(transcriptId: string): Promise<TranscriptResponse> {
  const maxAttempts = 60 // 5 minutes maximum (with 5-second intervals)
  let attempts = 0

  while (attempts < maxAttempts) {
    const response = await fetch(`${API_BASE_URL}/transcript/${transcriptId}`, {
      headers: {
        'Authorization': API_KEY,
      }
    })

    if (!response.ok) {
      throw new Error('Failed to get transcription status')
    }

    const result: TranscriptResponse = await response.json()

    if (result.status === 'completed') {
      return result
    }

    if (result.status === 'error') {
      throw new Error(result.error || 'Transcription failed')
    }

    if (result.status === 'queued' || result.status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 5000)) // Wait 5 seconds before next attempt
      attempts++
      continue
    }

    throw new Error('Unknown transcription status')
  }

  throw new Error('Transcription timed out')
}

export async function getSubtitles(transcriptId: string, format: SubtitleFormat, charsPerCaption?: number): Promise<string> {
  const url = `${API_BASE_URL}/transcript/${transcriptId}/subtitles`
  const params = new URLSearchParams({
    format,
    ...(charsPerCaption && { chars_per_caption: charsPerCaption.toString() })
  })

  const response = await fetch(`${url}?${params}`, {
    headers: {
      'Authorization': API_KEY,
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to get ${format.toUpperCase()} subtitles`)
  }

  return await response.text()
}

export async function transcribeAudio(
  file: File, 
  speakersExpected?: number,
  customSpelling?: CustomSpelling[]
): Promise<TranscriptionResult> {
  try {
    const uploadUrl = await uploadAudio(file)
    const transcriptId = await submitTranscription(uploadUrl, speakersExpected, customSpelling)
    const result = await pollTranscriptionResult(transcriptId)

    const languageInfo = result.language_code ? SUPPORTED_LANGUAGES[result.language_code] : undefined

    return {
      full: result.text,
      word: result.text.split(' ').join('\n'),
      sentence: result.text.split(/[.!?]+\s+/).filter(Boolean).join('\n\n'),
      speaker: result.utterances?.map(u => ({
        speaker: u.speaker,
        text: u.text.trim()
      })) || [],
      detectedLanguage: languageInfo?.name,
      languageCode: result.language_code,
      transcriptId
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Transcription failed')
  }
}