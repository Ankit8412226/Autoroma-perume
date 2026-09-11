import { Property } from '@/data/properties'
import { FALLBACK_IMAGE } from '@/utils/siteConfig'

const TYPE_MAP: Record<string, Property['propertyType']> = {
  RESIDENTIAL_PLOT: 'Estate',
  LAND: 'Estate',
  COMMERCIAL: 'Commercial',
  SHOWROOM: 'Commercial',
  VILLA: 'Villa',
  APARTMENT: 'Apartment'
}

function formatInr(amount: number): string {
  if (!amount) return 'Price on request'
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} Lakh`
  return `₹${amount.toLocaleString('en-IN')}`
}

export function mapBackendProperty(raw: any): Property {
  const price = Number(raw.price) || 0
  const galleryUrls = Array.isArray(raw.gallery)
    ? raw.gallery.map((item: any) => item?.url || item).filter(Boolean)
    : []
  const hero = raw.heroImage || galleryUrls[0] || FALLBACK_IMAGE

  return {
    id: String(raw._id || raw.slug),
    slug: raw.slug,
    title: raw.title,
    tagline: raw.tagline || '',
    description: raw.description || '',
    price,
    formattedPrice: raw.priceRange || formatInr(price),
    pricePerSqFt: Number(raw.pricePerSqft) || 0,
    formattedPricePerSqFt: raw.pricePerSqft ? `₹${Number(raw.pricePerSqft).toLocaleString('en-IN')} / sq ft` : '',
    propertyType: TYPE_MAP[raw.propertyType] || 'Estate',
    listingType: raw.listingType === 'RENT' ? 'Rent' : 'Buy',
    location: {
      city: raw.city || '',
      area: raw.area || raw.location || '',
      address: raw.address || [raw.village, raw.location, raw.city].filter(Boolean).join(', '),
      coordinates: { lat: 0, lng: 0 }
    },
    specs: {
      bedrooms: Number(raw.bedrooms) || 0,
      bathrooms: Number(raw.bathrooms) || 0,
      areaSqFt: Number(raw.areaSqft) || 0,
      parkingSpaces: Number(raw.parkingSpaces) || 0,
      yearBuilt: 2026
    },
    amenities: (raw.amenities || []).map((name: string) => ({ icon: 'Star', name })),
    features: raw.features || raw.highlights || [],
    images: {
      hero,
      gallery: galleryUrls.length > 0 ? galleryUrls : [hero]
    },
    floorPlanUrl: raw.floorPlanUrl || '',
    agentId: 'agent-1',
    isFeatured: Boolean(raw.isFeatured),
    isSpotlight: Boolean(raw.isFeatured),
    isNew: true,
    status: raw.status === 'SOLD' ? 'Sold' : raw.status === 'BOOKED' ? 'Under Negotiation' : 'Available',
    createdAt: raw.createdAt || new Date().toISOString()
  }
}
