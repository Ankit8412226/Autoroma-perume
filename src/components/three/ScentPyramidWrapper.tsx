'use client'

import dynamic from 'next/dynamic'

const ScentPyramidCanvas = dynamic(
  () => import('./ScentPyramidCanvas').then((mod) => mod.ScentPyramidCanvas),
  {
    ssr: false,
    loading: () => <div className="h-full w-full bg-bg-surface/50 animate-pulse rounded-none" />,
  }
)

export function ScentPyramidWrapper() {
  return <ScentPyramidCanvas />
}
