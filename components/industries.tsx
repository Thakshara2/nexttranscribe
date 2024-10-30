import { 
  Stethoscope, 
  Scale, 
  GraduationCap, 
  Video, 
  FileText,
  Building2
} from 'lucide-react'
import { Card } from './ui/card'

export function Industries() {
  const industries = [
    {
      icon: <Stethoscope className="w-6 h-6" />,
      title: "Healthcare",
      description: "HIPAA-compliant medical transcription for clinical notes, patient records, and medical dictation."
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Legal",
      description: "Accurate transcription for depositions, court recordings, and legal proceedings."
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Education",
      description: "Convert lectures, classroom discussions, and educational content to text."
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "Media & Content",
      description: "Professional transcription for YouTube videos, podcasts, and digital content."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Research",
      description: "Convert research interviews, focus groups, and academic discussions to text."
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: "Enterprise",
      description: "Secure corporate transcription for meetings, interviews, and business content."
    }
  ]

  return (
    <section className="py-16" id="industries">
      <h2 className="text-3xl font-bold text-center mb-12">Industry Solutions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {industries.map((industry, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="p-2 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              {industry.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{industry.title}</h3>
            <p className="text-muted-foreground">{industry.description}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}