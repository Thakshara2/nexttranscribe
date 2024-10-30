import Image from 'next/image'
import { Card } from './ui/card'
import { SUPPORTED_LANGUAGES } from '@/lib/assembly-ai'

export function Languages() {
  return (
    <section className="py-16" id="languages">
      <h2 className="text-3xl font-bold text-center mb-12">Multilingual Support</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => {
          const flagCode = code.split('_')[0]
          return (
            <Card key={code} className="p-4 flex items-center gap-3 hover:shadow-lg transition-shadow">
              <div className="relative w-8 h-6 rounded-sm overflow-hidden">
                <Image
                  src={`https://flagcdn.com/w80/${flagCode}.png`}
                  alt={`${lang.name} flag`}
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
              <span className="font-medium">{lang.name}</span>
            </Card>
          )
        })}
      </div>
    </section>
  )
}