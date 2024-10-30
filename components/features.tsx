import { 
  Wand2, 
  Mic, 
  Globe2, 
  Users2, 
  Clock, 
  Shield, 
  FileAudio,
  Code2
} from 'lucide-react'
import { Card } from './ui/card'

export function Features() {
  const features = [
    {
      icon: <Wand2 className="w-6 h-6" />,
      title: "AI-Powered Transcription",
      description: "Advanced machine learning algorithms ensure high accuracy transcription of your audio files."
    },
    {
      icon: <Mic className="w-6 h-6" />,
      title: "Voice Recognition",
      description: "Industry-leading voice recognition technology with up to 99% accuracy."
    },
    {
      icon: <Globe2 className="w-6 h-6" />,
      title: "Multilingual Support",
      description: "Support for 20+ languages including Spanish, Mandarin, Arabic, and more."
    },
    {
      icon: <Users2 className="w-6 h-6" />,
      title: "Speaker Detection",
      description: "Automatic identification and labeling of different speakers in your audio."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Real-Time Processing",
      description: "Fast, real-time transcription for immediate results."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Processing",
      description: "HIPAA-compliant and secure audio processing for sensitive content."
    },
    {
      icon: <FileAudio className="w-6 h-6" />,
      title: "Multiple Formats",
      description: "Support for MP3, WAV, M4A, and other popular audio formats."
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "API Integration",
      description: "Easy integration with our REST API for developers."
    }
  ]

  return (
    <section className="py-16" id="features">
      <h2 className="text-3xl font-bold text-center mb-12">Advanced Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="p-2 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}