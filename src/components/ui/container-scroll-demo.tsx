'use client'

import React from 'react'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import Image from 'next/image'

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden py-10 bg-black border-y border-white-500/20 my-12">
      <ContainerScroll
        titleComponent={
          <span className="text-xs sm:text-sm font-inter uppercase tracking-[0.3em] text-white-300 font-semibold block pb-2">
            AURA VÉLOCE ATELIER
          </span>
        }
      >
        <div className="relative w-full h-full bg-black flex items-center justify-center">
          <Image
            src="/images/hero-woman-perfume-perfect.png"
            alt="Aura Véloce Luxury Car Perfume Atelier"
            height={720}
            width={1400}
            className="mx-auto rounded-xl object-cover h-full w-full shadow-2xl"
            draggable={false}
            priority
          />
        </div>
      </ContainerScroll>
    </div>
  )
}

export default HeroScrollDemo
