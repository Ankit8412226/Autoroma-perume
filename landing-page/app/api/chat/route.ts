import { NextResponse } from 'next/server'
import { PROPERTIES } from '@/data/properties'
import { LOCATIONS } from '@/data/locations'

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const lower = message.toLowerCase()

    // Smart Concierge response generation based on House & Sky property data
    let responseText = ''
    let suggestedProperties: Array<{ title: string; price: string; location: string; slug: string }> = []

    if (lower.includes('bandra') || lower.includes('mumbai') || lower.includes('penthouse') || lower.includes('sky villa')) {
      const p = PROPERTIES.find((prop) => prop.slug.includes('bandra')) || PROPERTIES[0]
      responseText = `We have architecturally distinguished residences in Bandra West, Mumbai, including **${p.title}** starting from ${p.formattedPrice}. It features ${p.specs.bedrooms} bedrooms, ${p.specs.areaSqFt.toLocaleString()} sq ft of space, and panoramic views.`
      suggestedProperties.push({
        title: p.title,
        price: p.formattedPrice,
        location: `${p.location.area}, ${p.location.city}`,
        slug: p.slug,
      })
    } else if (lower.includes('goa') || lower.includes('villa') || lower.includes('assagao')) {
      const p = PROPERTIES.find((prop) => prop.slug.includes('goa')) || PROPERTIES[1]
      responseText = `In Goa, we curate private architectural villas such as **${p.title}** (${p.formattedPrice}). Set amidst palm-shaded valleys in Assagao, it offers private plunge pools, staff quarters, and 100% legal title lineage.`
      suggestedProperties.push({
        title: p.title,
        price: p.formattedPrice,
        location: `${p.location.area}, ${p.location.city}`,
        slug: p.slug,
      })
    } else if (lower.includes('gurgaon') || lower.includes('delhi') || lower.includes('golf course') || lower.includes('ncr')) {
      const p = PROPERTIES.find((prop) => prop.slug.includes('gurgaon')) || PROPERTIES[2]
      responseText = `In Gurgaon & Delhi NCR, **${p.title}** (${p.formattedPrice}) offers golf course views, double-height ceilings, and private elevator landings.`
      suggestedProperties.push({
        title: p.title,
        price: p.formattedPrice,
        location: `${p.location.area}, ${p.location.city}`,
        slug: p.slug,
      })
    } else if (lower.includes('tour') || lower.includes('book') || lower.includes('visit') || lower.includes('contact')) {
      responseText = `You can schedule a private viewing directly with our senior estate partners. Would you like to submit your preferred date and window on our advisory desk, or connect via direct line (+91 022 8800 9900)?`
    } else if (lower.includes('off-market') || lower.includes('nda') || lower.includes('private')) {
      responseText = `House & Sky maintains an off-market private client vault for confidential acquisitions across Mumbai and Goa. All inquiries operate under strict non-disclosure protocols.`
    } else {
      responseText = `Welcome to House & Sky Real Estate Advisory. We represent curated trophy penthouses, modern villas, and architectural estates across Mumbai, Goa, Delhi NCR, Bangalore, and Hyderabad. How may I assist your search today?`
      PROPERTIES.slice(0, 2).forEach((p) => {
        suggestedProperties.push({
          title: p.title,
          price: p.formattedPrice,
          location: `${p.location.area}, ${p.location.city}`,
          slug: p.slug,
        })
      })
    }

    return NextResponse.json({
      reply: responseText,
      properties: suggestedProperties,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { reply: 'I am here to assist with House & Sky property discovery and private tour scheduling. Please feel free to ask about our Bandra penthouses, Goa villas, or Gurgaon estates.' },
      { status: 500 }
    )
  }
}
