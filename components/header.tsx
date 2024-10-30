"use client"

import { Wand2 } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { Button } from './ui/button'

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Wand2 className="w-6 h-6 text-primary" />
          <span className="text-xl font-semibold">AudioScribe</span>
        </div>
        
        <nav className="flex items-center gap-6">
          <Button variant="ghost" className="text-sm font-medium">
            Features
          </Button>
          <Button variant="ghost" className="text-sm font-medium">
            Pricing
          </Button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}