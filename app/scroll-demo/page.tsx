import { HeroScrollDemo } from '@/components/ui/container-scroll-demo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Container Scroll Animation Demo | Aura Véloce',
}

export default function ScrollDemoPage() {
  return (
    <main className="w-full min-h-screen bg-black text-white">
      <HeroScrollDemo />
    </main>
  )
}
