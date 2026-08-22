import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Agent } from '@/data/agents'
import { Phone, ArrowUpRight } from 'lucide-react'

interface AgentCardProps {
  agent: Agent
  className?: string
}

export function AgentCard({ agent, className = '' }: AgentCardProps) {
  return (
    <div className={`group bg-bg-surface border border-white/15 p-6 flex flex-col justify-between hover:border-white/35 transition-all duration-300 shadow-lg ${className}`}>
      <div className="space-y-5">
        {/* Agent Avatar & Badge */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 border border-white/25 overflow-hidden">
            <Image
              src={agent.avatar}
              alt={agent.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gold-300 block">
              {agent.location}
            </span>
            <Link href={`/agents/${agent.slug}`}>
              <h3 className="font-serif text-lg sm:text-xl text-white font-normal group-hover:text-gold-200 transition-colors">
                {agent.name}
              </h3>
            </Link>
            <p className="text-xs text-white/70 font-light">{agent.title}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 py-3 border-y border-white/15 text-center font-mono">
          <div>
            <span className="block text-[10px] text-white/50 uppercase font-semibold">Sales Volume</span>
            <span className="text-sm font-bold text-white">{agent.totalSalesVolume}</span>
          </div>
          <div>
            <span className="block text-[10px] text-white/50 uppercase font-semibold">Active Listings</span>
            <span className="text-sm font-bold text-white">{agent.activeListingsCount} Estates</span>
          </div>
        </div>

        <p className="text-xs text-white/80 line-clamp-3 font-light leading-relaxed">
          {agent.bio}
        </p>
      </div>

      {/* Actions */}
      <div className="pt-6 border-t border-white/15 flex items-center justify-between gap-3">
        <a
          href={`tel:${agent.phone.replace(/\s+/g, '')}`}
          className="flex-1 py-2.5 bg-white/10 hover:bg-white hover:text-black border border-white/30 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <Phone className="w-3.5 h-3.5 text-gold-300 group-hover:text-black" />
          <span>Call</span>
        </a>

        <Link
          href={`/agents/${agent.slug}`}
          className="flex-1 py-2.5 bg-gold-300 hover:bg-white text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all shadow-md cursor-pointer"
        >
          <span>Profile</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-black" />
        </Link>
      </div>
    </div>
  )
}
