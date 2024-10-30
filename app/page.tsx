import { TranscriptionForm } from '@/components/transcription-form'
import { Header } from '@/components/header'
import { FeatureHighlight } from '@/components/feature-highlight'
import { UseCases } from '@/components/use-cases'
import { Industries } from '@/components/industries'
import { Features } from '@/components/features'
import { Languages } from '@/components/languages'

export default function Home() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <section className="space-y-6 text-center mb-12">
          <h1 className="text-6xl font-bold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Free Online Audio to Text Converter
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional audio transcription powered by AI. Convert voice recordings, MP3s, and video files to text with industry-leading accuracy.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <FeatureHighlight
            title="20+ Languages"
            description="Support for major global languages"
            type="languages"
          />
          <FeatureHighlight
            title="99% Accuracy"
            description="Industry-leading transcription precision"
            type="accuracy"
          />
          <FeatureHighlight
            title="Multi-Speaker"
            description="Automatic speaker detection & labeling"
            type="speakers"
          />
          <FeatureHighlight
            title="Free to Use"
            description="No credit card required"
            type="free"
          />
        </div>

        <TranscriptionForm />

        <Features />
        <Industries />
        <Languages />
        <UseCases />
      </main>
    </>
  )
}