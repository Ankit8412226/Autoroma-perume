'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, Car, Wind, Shield, Award, CheckCircle2, RotateCcw, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/stores/cart.store'
import { Button } from '@/components/ui'

// Audio Chime Synthesizer for Quiz Match
function playMatchChime() {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2) // A5

    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.3)
  } catch {
    // Ignore audio errors
  }
}

export function InteractiveScentQuiz() {
  const [step, setStep] = React.useState<number>(1)
  const [vehicle, setVehicle] = React.useState<string>('')
  const [vibe, setVibe] = React.useState<string>('')
  const [intensity, setIntensity] = React.useState<string>('')
  const [isMatching, setIsMatching] = React.useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const openDrawer = useCartStore((state) => state.openDrawer)

  const vehicles = [
    { id: 'sedan', label: 'Executive Sedan', desc: 'BMW 5/7, Mercedes E/S Class', icon: Car },
    { id: 'suv', label: 'Luxury SUV', desc: 'Range Rover, Porsche Cayenne', icon: Shield },
    { id: 'sports', label: 'Sports Coupe', desc: 'Porsche 911, Mustang, BMW M', icon: Wind },
    { id: 'ev', label: 'EV / Minimalist Cockpit', desc: 'Tesla, Volvo EX, Audi e-tron', icon: Award },
  ]

  const vibes = [
    { id: 'oud', label: 'Deep Oud & Amber', notes: 'Cambodian Oud, Dark Amber, Musk' },
    { id: 'fresh', label: 'Crisp Marine & Bergamot', notes: 'Sea Spray, Citrus, Bergamot' },
    { id: 'leather', label: 'Tuscan Leather & Cedar', notes: 'Smoked Leather, Cedarwood' },
    { id: 'woody', label: 'Japanese Cedar & Hinoki', notes: 'Kyoto Cedar, Sandalwood' },
  ]

  const intensities = [
    { id: 'subtle', label: 'Subtle & Sophisticated', desc: 'Gentle diffusion during climate control airflow' },
    { id: 'medium', label: 'Balanced & Long-Lasting', desc: 'Even 45-day cabin scenting' },
    { id: 'bold', label: 'Bold & Atmospheric', desc: 'Strong, immediate luxury aura' },
  ]

  const handleFinishQuiz = () => {
    setIsMatching(true)
    setTimeout(() => {
      playMatchChime()
      setIsMatching(false)
      setStep(4) // Result Step
    }, 1000)
  }

  const handleReset = () => {
    setStep(1)
    setVehicle('')
    setVibe('')
    setIntensity('')
  }

  // Get matched recommendation based on answers
  const getRecommendation = () => {
    if (vibe === 'fresh') {
      return {
        id: 'rec-ocean',
        name: 'Ocean Drive Marine Vent Clip',
        type: 'VENT_CLIP',
        price: 1299,
        family: 'Fresh Aquatic',
        image: '/images/car-vent-perfume-clip.png',
        notes: 'Calabrian Bergamot, Sea Spray, Smoked Cedar',
        desc: 'Engineered for your minimalist cabin with 60°C heat-resistant pure oils.',
      }
    } else if (vibe === 'leather') {
      return {
        id: 'rec-leather',
        name: 'Tuscan Leather Solid Gel Jar',
        type: 'DASHBOARD_GEL',
        price: 1499,
        family: 'Leather Woody',
        image: '/images/scent-heart-notes.png',
        notes: 'Tuscan Leather, Smoked Cedar, Amber',
        desc: 'Diffusion jar designed for broad vehicle cabin volumes and leather seats.',
      }
    } else if (vibe === 'woody') {
      return {
        id: 'rec-kyoto',
        name: 'Kyoto Cedar Wooden Hanging Vial',
        type: 'HANGING',
        price: 999,
        family: 'Woody Earthy',
        image: '/images/car-perfume-craft.png',
        notes: 'Japanese Cedarwood, Hinoki Cypress, Ambergris',
        desc: 'Porous beechwood cap hanging bottle for subtle rearview mirror diffusion.',
      }
    }
    return {
      id: 'rec-oud',
      name: 'Cambodian Oud Royal Spray Mist',
      type: 'SPRAY',
      price: 1699,
      family: 'Oriental Oud',
      image: '/images/scent-top-notes.png',
      notes: 'Royal Cambodian Oud, Smoked Amber, Musk',
      desc: '50ml fine mist atomizer for floor mats and headliners for instant luxury.',
    }
  }

  const matchedProduct = getRecommendation()

  const handleAddToCart = () => {
    addItem({
      productId: matchedProduct.id,
      variantId: matchedProduct.id,
      name: matchedProduct.name,
      image: matchedProduct.image,
      productType: matchedProduct.type,
      variantLabel: 'Discovery Matched Unit',
      price: matchedProduct.price,
      quantity: 1,
    })
    openDrawer()
  }

  return (
    <div className="bg-bg-secondary border border-white-500/20 p-6 sm:p-10 lg:p-12 shadow-2xl rounded-sm">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Quiz Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/30 text-white text-[10px] sm:text-xs font-inter uppercase tracking-[0.25em]">
            <Sparkles className="h-3.5 w-3.5 text-white animate-pulse" />
            <span>Bombay Musk Inspired Olfactory Quiz</span>
          </div>
          <h2 className="font-cormorant text-3xl sm:text-5xl text-white-100 font-light">
            Find Your Signature Cabin Fragrance
          </h2>
          <p className="text-xs sm:text-body-md text-white-300 font-inter font-light max-w-xl mx-auto">
            Answer 3 quick questions about your vehicle & fragrance preference to uncover your personalized scent match.
          </p>
        </div>

        {/* Quiz Steps Indicator */}
        {step <= 3 && (
          <div className="flex items-center justify-center gap-3 sm:gap-6 font-inter text-xs border-b border-white-500/15 pb-6">
            <span className={`px-3 py-1 border transition-all ${step === 1 ? 'border-white text-white bg-white/10 font-semibold' : 'border-white-500/20 text-white-400'}`}>
              1. Vehicle Type
            </span>
            <span className="text-white-500">→</span>
            <span className={`px-3 py-1 border transition-all ${step === 2 ? 'border-white text-white bg-white/10 font-semibold' : 'border-white-500/20 text-white-400'}`}>
              2. Scent Vibe
            </span>
            <span className="text-white-500">→</span>
            <span className={`px-3 py-1 border transition-all ${step === 3 ? 'border-white text-white bg-white/10 font-semibold' : 'border-white-500/20 text-white-400'}`}>
              3. Intensity
            </span>
          </div>
        )}

        {/* STEP 1: VEHICLE TYPE */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="font-cormorant text-2xl text-white-100 text-center font-light">
              Step 1: What type of vehicle do you drive?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {vehicles.map((v) => {
                const Icon = v.icon
                const isSelected = vehicle === v.id
                return (
                  <div
                    key={v.id}
                    onClick={() => setVehicle(v.id)}
                    className={`p-5 border cursor-pointer transition-all flex items-center gap-4 ${
                      isSelected
                        ? 'bg-white/10 border-white text-white-100 shadow-xl'
                        : 'bg-bg-surface border-white-500/15 text-white-200 hover:border-white/50'
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-white text-black font-bold' : 'bg-bg-primary text-white border border-white/30'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-cormorant text-xl text-white-100 font-light">{v.label}</h4>
                      <p className="text-[11px] text-white-400 font-inter">{v.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex justify-end pt-4">
              <Button
                variant="primary"
                size="md"
                disabled={!vehicle}
                onClick={() => setStep(2)}
                className="font-inter text-xs uppercase tracking-wider bg-white text-black hover:bg-neutral-200"
              >
                Next Step →
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: SCENT VIBE */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="font-cormorant text-2xl text-white-100 text-center font-light">
              Step 2: Which fragrance profile resonates with you?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {vibes.map((vb) => {
                const isSelected = vibe === vb.id
                return (
                  <div
                    key={vb.id}
                    onClick={() => setVibe(vb.id)}
                    className={`p-5 border cursor-pointer transition-all space-y-1 ${
                      isSelected
                        ? 'bg-white/10 border-white text-white-100 shadow-xl'
                        : 'bg-bg-surface border-white-500/15 text-white-200 hover:border-white/50'
                    }`}
                  >
                    <span className="text-[10px] text-white-300 uppercase tracking-widest font-inter block">Signature Profile</span>
                    <h4 className="font-cormorant text-xl text-white-100 font-light">{vb.label}</h4>
                    <p className="text-[11px] text-white-400 font-inter">{vb.notes}</p>
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between items-center pt-4">
              <button onClick={() => setStep(1)} className="text-xs font-inter text-white-300 hover:text-white uppercase tracking-wider">
                ← Back
              </button>
              <Button
                variant="primary"
                size="md"
                disabled={!vibe}
                onClick={() => setStep(3)}
                className="font-inter text-xs uppercase tracking-wider bg-white text-black hover:bg-neutral-200"
              >
                Next Step →
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: INTENSITY */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="font-cormorant text-2xl text-white-100 text-center font-light">
              Step 3: Preferred Cabin Scent Intensity?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {intensities.map((ins) => {
                const isSelected = intensity === ins.id
                return (
                  <div
                    key={ins.id}
                    onClick={() => setIntensity(ins.id)}
                    className={`p-5 border cursor-pointer transition-all space-y-2 text-center ${
                      isSelected
                        ? 'bg-white/10 border-white text-white-100 shadow-xl'
                        : 'bg-bg-surface border-white-500/15 text-white-200 hover:border-white/50'
                    }`}
                  >
                    <h4 className="font-cormorant text-xl text-white-100 font-light">{ins.label}</h4>
                    <p className="text-[11px] text-white-400 font-inter leading-relaxed">{ins.desc}</p>
                  </div>
                )
              })}
            </div>

            <div className="flex justify-between items-center pt-4">
              <button onClick={() => setStep(2)} className="text-xs font-inter text-white-300 hover:text-white uppercase tracking-wider">
                ← Back
              </button>
              <Button
                variant="primary"
                size="md"
                disabled={!intensity || isMatching}
                onClick={handleFinishQuiz}
                className="font-inter text-xs uppercase tracking-wider bg-white text-black hover:bg-neutral-200"
              >
                {isMatching ? 'Matching Olfactory Profile...' : 'Reveal Scent Match ✨'}
              </Button>
            </div>
          </div>
        )}

        {/* RESULT STEP: MATCHED PRODUCT RECOMMENDATION */}
        {step === 4 && (
          <div className="bg-bg-primary border border-white/40 p-6 sm:p-8 space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white-500/20 pb-4">
              <span className="text-[10px] font-inter uppercase tracking-widest text-white font-bold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>100% Olfactory Match Found</span>
              </span>
              <button onClick={handleReset} className="text-xs font-inter text-white-400 hover:text-white flex items-center gap-1">
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Retake Quiz</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-5 relative aspect-square w-full bg-bg-surface border border-white-500/20 overflow-hidden shadow-xl">
                <Image
                  src={matchedProduct.image}
                  alt={matchedProduct.name}
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              </div>

              <div className="md:col-span-7 space-y-4 text-left font-inter">
                <span className="text-[10px] text-white-300 uppercase tracking-widest block font-bold">
                  {matchedProduct.family}
                </span>
                <h3 className="font-cormorant text-3xl text-white-100 font-light">
                  {matchedProduct.name}
                </h3>
                <p className="text-xs text-white-300 font-light leading-relaxed">
                  {matchedProduct.desc}
                </p>

                <div className="p-3 bg-bg-surface border border-white-500/10 space-y-1 text-xs">
                  <strong className="text-white block text-[10px] uppercase tracking-wider">NOTES BREAKDOWN</strong>
                  <span className="text-white-200">{matchedProduct.notes}</span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xl font-semibold text-white font-inter">
                    ₹{matchedProduct.price}
                  </span>

                  <div className="flex items-center gap-3">
                    <Link
                      href="/products"
                      className="text-xs text-white-300 hover:text-white uppercase tracking-wider underline"
                    >
                      Shop All →
                    </Link>
                    <button
                      onClick={handleAddToCart}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-inter text-xs uppercase tracking-widest font-semibold hover:bg-neutral-200 transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>Add Match to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
