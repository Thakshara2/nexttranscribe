import { 
  Video, 
  Presentation, 
  MessageSquare, 
  FileVideo,
  Mic
} from 'lucide-react'
import { Card } from './ui/card'

export function UseCases() {
  const useCases = [
    {
      icon: <Video className="w-6 h-6" />,
      title: "Video Platforms",
      description: "Convert YouTube videos, webinars, and online courses to text with automatic caption generation."
    },
    {
      icon: <Presentation className="w-6 h-6" />,
      title: "Virtual Meetings",
      description: "Transcribe Zoom recordings, Teams meetings, and Google Meet sessions."
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Podcasts",
      description: "Generate accurate transcripts for podcasts and audio content."
    },
    {
      icon: <FileVideo className="w-6 h-6" />,
      title: "Content Creation",
      description: "Create subtitles and captions for videos and social media content."
    },
    {
      icon: <Mic className="w-6 h-6" />,
      title: "Voice Notes",
      description: "Convert voice memos and recordings to searchable text."
    }
  ]

  return (
    <section className="py-16" id="use-cases">
      <h2 className="text-3xl font-bold text-center mb-12">Popular Use Cases</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {useCases.map((useCase, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="p-2 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              {useCase.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
            <p className="text-muted-foreground">{useCase.description}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}