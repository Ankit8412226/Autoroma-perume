import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AGENTS } from '@/data/agents'
import { PROPERTIES } from '@/data/properties'
import { PropertyGrid } from '@/components/real-estate/PropertyGrid'
import { InquiryForm } from '@/components/real-estate/InquiryForm'
import { Phone, Mail, Award, CheckCircle2, ChevronRight, Star } from 'lucide-react'

interface AgentPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return AGENTS.map((a) => ({
    slug: a.slug,
  }))
}

export async function generateMetadata({ params }: AgentPageProps) {
  const resolvedParams = await params
  const agent = AGENTS.find((a) => a.slug === resolvedParams.slug)
  if (!agent) return { title: 'Advisor Not Found' }

  return {
    title: `${agent.name} — ${agent.title}`,
    description: agent.bio,
  }
}

export default async function AgentDetailPage({ params }: AgentPageProps) {
  const resolvedParams = await params
  const agent = AGENTS.find((a) => a.slug === resolvedParams.slug)

  if (!agent) {
    notFound()
  }

  // Active listings represented by this agent
  const agentProperties = PROPERTIES.filter((p) => p.agentId === agent.id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-white/50 font-mono">
        <Link href="/" className="hover:text-white">Home</Link>
        <ChevronRight className="w-3 h-3 text-white/30" />
        <Link href="/agents" className="hover:text-white">Advisors</Link>
        <ChevronRight className="w-3 h-3 text-white/30" />
        <span className="text-white">{agent.name}</span>
      </nav>

      {/* Header Profile Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-bg-surface border border-white/10 p-8 sm:p-12">
        <div className="lg:col-span-4 relative aspect-[4/5] w-full border border-white/15 overflow-hidden">
          <Image
            src={agent.avatar}
            alt={agent.name}
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-gold-300">
              {agent.location} Desk
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-white font-normal">
              {agent.name}
            </h1>
            <p className="text-sm text-white/70 font-light">{agent.title}</p>
          </div>

          {/* Stats Matrix */}
          <div className="grid grid-cols-3 gap-4 py-4 border-y border-white/10 text-center font-mono">
            <div>
              <span className="block text-[10px] text-white/40 uppercase">EXPERIENCE</span>
              <span className="text-base sm:text-lg font-bold text-white">{agent.experienceYears} Years</span>
            </div>
            <div>
              <span className="block text-[10px] text-white/40 uppercase">SALES VOLUME</span>
              <span className="text-base sm:text-lg font-bold text-white">{agent.totalSalesVolume}</span>
            </div>
            <div>
              <span className="block text-[10px] text-white/40 uppercase">CLIENT RATING</span>
              <span className="text-base sm:text-lg font-bold text-white flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-gold-300 text-gold-300" />
                {agent.rating}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed">
            {agent.bio}
          </p>

          <div className="space-y-2 pt-2">
            <h4 className="text-xs uppercase tracking-wider text-gold-300 font-semibold">Specialty Focus</h4>
            <div className="flex flex-wrap gap-2">
              {agent.specialties.map((s) => (
                <span key={s} className="px-3 py-1 bg-white/5 border border-white/15 text-xs text-white/80">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Listings Grid & Direct Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-6">
          <h3 className="font-serif text-2xl text-white font-normal">
            Active Listings Represented by {agent.name}
          </h3>
          <PropertyGrid properties={agentProperties} columns={2} variant="B" />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <InquiryForm agentName={agent.name} />
        </div>
      </div>
    </div>
  )
}
