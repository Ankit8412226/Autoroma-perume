import * as React from 'react'
import { AGENTS } from '@/data/agents'
import { AgentCard } from '@/components/real-estate/AgentCard'
import { SectionHeading } from '@/components/real-estate/SectionHeading'

export const metadata = {
  title: 'Senior Estate Advisors & Partners — Aura Véloce',
  description: 'Meet our senior partners specializing in ultra-prime residential real estate across Mumbai, Goa, Delhi NCR, and Bangalore.',
}

export default function AgentsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <SectionHeading
        eyebrow="ADVISORY TEAM"
        title="Private Real Estate Advisors"
        subtitle="Our senior partners bring unmatched market intelligence, discretion, and architectural knowledge to every client engagement."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {AGENTS.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  )
}
