import DemoOne from '@/components/ui/tubes-cursor-demo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tubes Cursor Interactive Demo | Aura Véloce',
}

export default function TubesDemoPage() {
  return (
    <main className="w-full h-screen bg-black overflow-hidden">
      <DemoOne />
    </main>
  )
}
