"use client"

import { Globe2, CheckCircle2, Users2, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card } from './ui/card'

interface FeatureHighlightProps {
  title: string
  description: string
  type: 'languages' | 'accuracy' | 'speakers' | 'free'
}

export function FeatureHighlight({ title, description, type }: FeatureHighlightProps) {
  const getIcon = () => {
    switch (type) {
      case 'languages': return <Globe2 className="w-5 h-5" />
      case 'accuracy': return <CheckCircle2 className="w-5 h-5" />
      case 'speakers': return <Users2 className="w-5 h-5" />
      case 'free': return <Sparkles className="w-5 h-5" />
    }
  }

  return (
    <Card className="relative overflow-hidden group">
      <motion.div
        className="p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {getIcon()}
          </div>
          <h3 className="font-semibold text-sm">{title}</h3>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>

        {type === 'accuracy' && (
          <motion.div
            className="h-1.5 bg-primary/20 rounded-full overflow-hidden mt-2"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: "99%" }}
              transition={{ duration: 1.5, delay: 0.8 }}
            />
          </motion.div>
        )}

        {type === 'speakers' && (
          <div className="mt-2 flex -space-x-2">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="w-6 h-6 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.2 }}
              >
                <Users2 className="w-3 h-3 text-primary" />
              </motion.div>
            ))}
          </div>
        )}

        {type === 'free' && (
          <motion.div
            className="mt-2 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
          >
            <div className="text-xl">✨</div>
          </motion.div>
        )}
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Card>
  )
}