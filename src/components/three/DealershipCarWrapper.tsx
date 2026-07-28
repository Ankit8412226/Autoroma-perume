'use client'

import dynamic from 'next/dynamic'

const DealershipCarCanvas = dynamic(
  () => import('./DealershipCarCanvas').then((mod) => mod.DealershipCarCanvas),
  {
    ssr: false,
    loading: () => <div className="h-full w-full bg-bg-surface/50 animate-pulse rounded-none" />,
  }
)

export function DealershipCarWrapper() {
  return <DealershipCarCanvas />
}
