"use client"

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Loader2, FileAudio, Check, AlertCircle, Wand2, Info, Play, Music, Radio, File, Users, Globe2, Download, Plus, X, Subtitles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { transcribeAudio, getSubtitles, type TranscriptionResult, type CustomSpelling, type SubtitleFormat, SUPPORTED_LANGUAGES } from '@/lib/assembly-ai'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Image from 'next/image'

const FLAG_CODES: Record<string, string> = {
  'en': 'gb',
  'en_au': 'au',
  'en_uk': 'gb',
  'en_us': 'us',
  'es': 'es',
  'fr': 'fr',
  'de': 'de',
  'it': 'it',
  'pt': 'pt',
  'nl': 'nl',
  'hi': 'in',
  'ja': 'jp',
  'zh': 'cn',
  'fi': 'fi',
  'ko': 'kr',
  'pl': 'pl',
  'ru': 'ru',
  'tr': 'tr',
  'uk': 'ua',
  'vi': 'vn'
}

type TranscriptionStatus = 'idle' | 'uploading' | 'queued' | 'processing' | 'completed' | 'error'

interface StatusInfo {
  message: string
  description: string
  icon: React.ReactNode
}

interface SpellingRule {
  from: string
  to: string
}

const getFileIcon = (extension: string) => {
  switch (extension.toLowerCase()) {
    case 'mp3':
      return <Music className="w-4 h-4 text-primary" />
    case 'wav':
      return <Radio className="w-4 h-4 text-primary" />
    case 'm4a':
    case 'flac':
      return <FileAudio className="w-4 h-4 text-primary" />
    default:
      return <File className="w-4 h-4 text-primary" />
  }
}

export function TranscriptionForm() {
  const [status, setStatus] = useState<TranscriptionStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [speakersExpected, setSpeakersExpected] = useState<number>(2)
  const [spellingRules, setSpellingRules] = useState<SpellingRule[]>([])
  const [newRule, setNewRule] = useState<SpellingRule>({ from: '', to: '' })
  const [charsPerCaption, setCharsPerCaption] = useState<number>(32)
  const [isDownloadingSubtitles, setIsDownloadingSubtitles] = useState(false)
  const { toast } = useToast()

  const statusInfo: Record<TranscriptionStatus, StatusInfo> = {
    idle: {
      message: 'Upload Audio File',
      description: 'Drag & drop your audio file here, or click to select',
      icon: <Upload className="w-8 h-8 text-primary" />
    },
    uploading: {
      message: 'Uploading...',
      description: 'Uploading your audio file to our servers',
      icon: <Loader2 className="w-8 h-8 text-primary animate-spin" />
    },
    queued: {
      message: 'In Queue',
      description: 'Your file is queued for processing',
      icon: <Info className="w-8 h-8 text-primary" />
    },
    processing: {
      message: 'Processing...',
      description: 'Converting your audio to text',
      icon: <Loader2 className="w-8 h-8 text-primary animate-spin" />
    },
    completed: {
      message: 'Transcription Complete',
      description: 'Your transcription is ready',
      icon: <Check className="w-8 h-8 text-primary" />
    },
    error: {
      message: 'Transcription Failed',
      description: 'An error occurred during transcription',
      icon: <AlertCircle className="w-8 h-8 text-destructive" />
    }
  }

  const addSpellingRule = () => {
    if (newRule.from && newRule.to) {
      setSpellingRules([...spellingRules, newRule])
      setNewRule({ from: '', to: '' })
      toast({
        title: "Spelling rule added",
        description: `${newRule.from} will be replaced with ${newRule.to}`
      })
    }
  }

  const removeSpellingRule = (index: number) => {
    setSpellingRules(spellingRules.filter((_, i) => i !== index))
    toast({
      title: "Spelling rule removed",
      description: "The custom spelling rule has been removed."
    })
  }

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    setErrorMessage('')

    if (file.size > 25 * 1024 * 1024) {
      setStatus('error')
      setErrorMessage('File size exceeds 25MB limit')
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload an audio file smaller than 25MB."
      })
      return
    }

    setSelectedFile(file)
    toast({
      title: "File selected",
      description: "Click 'Start Transcription' when you're ready to begin."
    })
  }

  const startTranscription = async () => {
    if (!selectedFile) return

    try {
      setStatus('uploading')
      setProgress(25)

      setStatus('queued')
      setProgress(35)

      setStatus('processing')
      setProgress(50)
      
      const customSpelling: CustomSpelling[] = spellingRules.map(rule => ({
        from: [rule.from],
        to: rule.to
      }))
      
      const result = await transcribeAudio(selectedFile, speakersExpected, customSpelling)
      
      setProgress(100)
      setStatus('completed')
      setTranscriptionResult(result)
      
      toast({
        title: "Transcription completed",
        description: "Your audio has been successfully transcribed."
      })
    } catch (error) {
      setStatus('error')
      const errorMsg = error instanceof Error ? error.message : "Unknown error occurred"
      setErrorMessage(errorMsg)
      toast({
        variant: "destructive",
        title: "Transcription failed",
        description: errorMsg
      })
    }
  }

  const resetTranscription = () => {
    setStatus('idle')
    setTranscriptionResult(null)
    setProgress(0)
    setErrorMessage('')
    setSelectedFile(null)
    setSpeakersExpected(2)
    setSpellingRules([])
    setNewRule({ from: '', to: '' })
  }

  const copyToClipboard = (content?: string) => {
    const textToCopy = content || document.querySelector('[role="tabpanel"]:not([hidden]) pre, [role="tabpanel"]:not([hidden]) p')?.textContent || ''
    navigator.clipboard.writeText(textToCopy)
    toast({
      title: "Copied to clipboard",
      description: "The transcription has been copied to your clipboard."
    })
  }

  const downloadTranscription = (content: string, type: string) => {
    const fileName = `transcription_${type}_${new Date().toISOString().slice(0, 10)}.txt`
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast({
      title: "Download started",
      description: `Your ${type} transcription is being downloaded.`
    })
  }

  const downloadSubtitles = async (format: SubtitleFormat) => {
    if (!transcriptionResult?.transcriptId) return

    try {
      setIsDownloadingSubtitles(true)
      const subtitles = await getSubtitles(transcriptionResult.transcriptId, format, charsPerCaption)
      const fileName = `transcription_${format}_${charsPerCaption}chars_${new Date().toISOString().slice(0, 10)}.${format}`
      const blob = new Blob([subtitles], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast({
        title: "Subtitles downloaded",
        description: `Your ${format.toUpperCase()} file has been downloaded.`
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: error instanceof Error ? error.message : "Failed to download subtitles"
      })
    } finally {
      setIsDownloadingSubtitles(false)
    }
  }

  const getFlagForLanguage = (languageCode?: string) => {
    if (!languageCode) return null
    const flagCode = FLAG_CODES[languageCode]
    if (!flagCode) return null
    return flagCode
  }

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop() || ''
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.flac']
    },
    maxFiles: 1,
    disabled: status === 'uploading' || status === 'processing' || status === 'queued'
  })

  const currentStatus = statusInfo[status]

  return (
    <div className="space-y-8">
      <Card className={`p-8 border-2 border-dashed transition-all duration-300 ${
        isDragActive 
          ? 'border-primary bg-primary/5 dark:bg-primary/10 scale-102 shadow-lg' 
          : 'border-border hover:border-primary/50 hover:bg-muted/50 dark:hover:bg-muted/50'
      }`} {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          <div className="p-4 mb-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 dark:to-transparent">
            {currentStatus.icon}
          </div>
          
          <h3 className="text-xl font-semibold mb-3">
            {currentStatus.message}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4">
            {currentStatus.description}
          </p>

          {selectedFile && status === 'idle' && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg mt-4">
              {getFileIcon(getFileExtension(selectedFile.name))}
              <span className="text-sm font-medium">{selectedFile.name}</span>
            </div>
          )}

          {(status === 'uploading' || status === 'processing' || status === 'queued') && (
            <div className="w-full max-w-xs">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">{progress}% complete</p>
            </div>
          )}

          {status === 'idle' && !selectedFile && (
            <div className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
              <Wand2 className="w-3 h-3" />
              Supports MP3, WAV, M4A, FLAC (max 25MB)
            </div>
          )}
        </div>
      </Card>

      {selectedFile && status === 'idle' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Multi-Speaker Settings</h3>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="speakers">Expected Number of Speakers</Label>
                <Input
                  id="speakers"
                  type="number"
                  min="2"
                  max="10"
                  value={speakersExpected}
                  onChange={(e) => setSpeakersExpected(parseInt(e.target.value))}
                  className="max-w-[200px]"
                />
                <p className="text-sm text-muted-foreground">
                  For better accuracy, specify the number of speakers in your audio (2-10 speakers)
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Custom Spelling Rules</h3>
              </div>
              
              <div className="grid gap-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="from">Replace</Label>
                    <Input
                      id="from"
                      value={newRule.from}
                      onChange={(e) => setNewRule({ ...newRule, from: e.target.value })}
                      placeholder="e.g., gettleman"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="to">With</Label>
                    <Input
                      id="to"
                      value={newRule.to}
                      onChange={(e) => setNewRule({ ...newRule, to: e.target.value })}
                      placeholder="e.g., Gettleman"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={addSpellingRule}
                      disabled={!newRule.from || !newRule.to}
                      className="mb-0.5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Rule
                    </Button>
                  </div>
                </div>

                {spellingRules.length > 0 && (
                  <div className="space-y-2">
                    <Label>Active Rules</Label>
                    <div className="grid gap-2">
                      {spellingRules.map((rule, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-md bg-muted"
                        >
                          <span className="text-sm">
                            Replace <span className="font-mono bg-primary/10 px-1.5 py-0.5 rounded">{rule.from}</span>
                            {' '}with{' '}
                            <span className="font-mono bg-primary/10 px-1.5 py-0.5 rounded">{rule.to}</span>
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSpellingRule(index)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <div className="flex justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 space-x-2"
              onClick={startTranscription}
            >
              <Play className="w-5 h-5" />
              <span>Start Transcription</span>
            </Button>
          </div>
        </div>
      )}

      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {transcriptionResult && (
        <Card className="p-6 border border-border/40 shadow-lg backdrop-blur-sm bg-card/95">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              {transcriptionResult.languageCode && (
                <Badge variant="secondary" className="text-sm flex items-center gap-2">
                  <div className="relative w-5 h-4 rounded-sm overflow-hidden">
                    <Image
                      src={`https://flagcdn.com/w40/${getFlagForLanguage(transcriptionResult.languageCode)}.png`}
                      alt={transcriptionResult.detectedLanguage || ''}
                      fill
                      className="object-cover"
                      sizes="20px"
                    />
                  </div>
                  {transcriptionResult.detectedLanguage}
                </Badge>
              )}
            </div>
            <div className="flex gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Subtitles className="w-4 h-4" />
                    Download Subtitles
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="chars-per-caption">Characters per Caption</Label>
                      <Input
                        id="chars-per-caption"
                        type="number"
                        min="1"
                        max="100"
                        value={charsPerCaption}
                        onChange={(e) => setCharsPerCaption(parseInt(e.target.value))}
                      />
                      <p className="text-xs text-muted-foreground">
                        Maximum number of characters per caption line (1-100)
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => downloadSubtitles('srt')}
                        disabled={isDownloadingSubtitles}
                        className="w-full"
                      >
                        {isDownloadingSubtitles ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4 mr-2" />
                        )}
                        SRT
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => downloadSubtitles('vtt')}
                        disabled={isDownloadingSubtitles}
                        className="w-full"
                      >
                        {isDownloadingSubtitles ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4 mr-2" />
                        )}
                        VTT
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                variant="outline"
                onClick={resetTranscription}
                className="hover:bg-muted dark:hover:bg-muted"
              >
                New Transcription
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="speaker" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="speaker">By Speaker</TabsTrigger>
              <TabsTrigger value="full">Full</TabsTrigger>
              <TabsTrigger value="word">Word by Word</TabsTrigger>
              <TabsTrigger value="sentence">By Sentence</TabsTrigger>
            </TabsList>

            <TabsContent value="speaker">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Speaker-by-Speaker Transcription</h3>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(transcriptionResult.speaker.map(s => `Speaker ${s.speaker}: ${s.text}`).join('\n\n'))}
                  >
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadTranscription(transcriptionResult.speaker.map(s => `Speaker ${s.speaker}: ${s.text}`).join('\n\n'), 'speaker')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              <div className="rounded-lg border bg-muted/50 dark:bg-muted/30 p-4">
                <div className="space-y-4">
                  {transcriptionResult.speaker.map((segment, index) => (
                    <p key={index} className="text-sm leading-relaxed">
                      <span className="font-semibold">Speaker {segment.speaker}:</span> {segment.text}
                    </p>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileAudio className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Full Transcription</h3>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(transcriptionResult.full)}
                  >
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadTranscription(transcriptionResult.full, 'full')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              <div className="rounded-lg border bg-muted/50 dark:bg-muted/30 p-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {transcriptionResult.full}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="word">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileAudio className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Word-by-Word Transcription</h3>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(transcriptionResult.word)}
                  >
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadTranscription(transcriptionResult.word, 'word')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              <div className="rounded-lg border bg-muted/50 dark:bg-muted/30 p-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {transcriptionResult.word}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="sentence">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileAudio className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Sentence-by-Sentence Transcription</h3>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(transcriptionResult.sentence)}
                  >
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadTranscription(transcriptionResult.sentence, 'sentence')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              <div className="rounded-lg border bg-muted/50 dark:bg-muted/30 p-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {transcriptionResult.sentence}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </div>
  )
}