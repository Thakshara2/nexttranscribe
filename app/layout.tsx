import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { ThemeToggle } from '@/components/theme-toggle'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://audioscribe.vercel.app'),
  title: {
    default: 'AudioScribe - Free Online Audio to Text Converter & Transcription Service',
    template: '%s | AudioScribe'
  },
  description: 'Professional audio to text converter with AI-powered transcription. Free online tool for converting voice recordings, MP3s, and video files to text. Supports multiple languages and speakers.',
  keywords: [
    'audio to text converter online',
    'speech to text converter free',
    'voice recording to text',
    'transcribe audio file to text',
    'mp3 to text converter',
    'AI powered transcription',
    'automatic caption generator',
    'multilingual transcription services',
    'youtube video transcription',
    'podcast transcription service'
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://audioscribe.vercel.app',
    title: 'AudioScribe - Free Online Audio to Text Converter & Transcription Service',
    description: 'Professional audio to text converter with AI-powered transcription. Free online tool for converting voice recordings, MP3s, and video files to text.',
    siteName: 'AudioScribe',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'AudioScribe - Audio to Text Converter'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AudioScribe - Free Online Audio to Text Converter',
    description: 'Professional audio to text converter with AI-powered transcription. Free online tool for converting voice recordings, MP3s, and video files to text.',
    images: ['/og-image.png']
  },
  alternates: {
    canonical: 'https://audioscribe.vercel.app'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="schema-org" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "AudioScribe",
              "applicationCategory": "Utility",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Professional audio to text converter with AI-powered transcription. Free online tool for converting voice recordings, MP3s, and video files to text.",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1250"
              },
              "featureList": [
                "Multiple language support",
                "Speaker detection",
                "AI-powered transcription",
                "Subtitle generation",
                "Real-time processing"
              ]
            }
          `}
        </Script>
      </head>
      <body className={`${inter.className} min-h-screen bg-gradient-to-b from-background to-background/95 dark:from-background dark:to-background/98`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}