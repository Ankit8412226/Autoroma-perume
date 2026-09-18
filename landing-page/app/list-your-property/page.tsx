'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getApiBaseUrl } from '@/utils/api'
import { useOwnerAuth } from '@/stores/auth.store'
import {
  Home, MapPin, IndianRupee, Camera, CheckCircle2,
  ChevronRight, LogIn, UserPlus, Upload, X, Loader2,
  Phone, Mail, Building2, BedDouble, Bath, Car
} from 'lucide-react'

// --- Type mappings: display label → backend enum value ---
const PROPERTY_TYPE_OPTIONS: { label: string; value: string }[] = [
  { label: 'Residential Plot', value: 'RESIDENTIAL_PLOT' },
  { label: 'Apartment / Flat', value: 'APARTMENT' },
  { label: 'Villa', value: 'VILLA' },
  { label: 'Independent House', value: 'VILLA' }, // maps to VILLA
  { label: 'Commercial Space', value: 'COMMERCIAL' },
  { label: 'Office', value: 'COMMERCIAL' }, // maps to COMMERCIAL
  { label: 'Showroom', value: 'SHOWROOM' },
  { label: 'Shop', value: 'SHOWROOM' }, // maps to SHOWROOM
  { label: 'Land / Agriculture', value: 'LAND' },
  { label: 'Warehouse / Industrial', value: 'COMMERCIAL' }, // maps to COMMERCIAL
]

const LISTING_TYPE_OPTIONS = [
  { label: 'For Sale', value: 'SALE' },
  { label: 'For Rent', value: 'RENT' },
  { label: 'For Lease', value: 'LEASE' },
]

const FURNISHING_OPTIONS = ['Unfurnished', 'Semi-Furnished', 'Fully Furnished']
const FACING_OPTIONS = ['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West']

const COMMON_AMENITIES = [
  'Car Parking', 'Power Backup', 'Security', 'Lift / Elevator', 'Swimming Pool', 'Gym / Fitness',
  'Garden / Park', 'Clubhouse', 'CCTV', 'Children Play Area', 'Water Supply 24x7', 'Servant Quarter'
]

interface FormState {
  displayType: string
  propertyType: string
  listingType: string
  title: string
  description: string
  state: string
  city: string
  area: string
  address: string
  pincode: string
  googleMapsUrl: string
  areaSqft: string
  bedrooms: string
  bathrooms: string
  parkingSpaces: string
  floor: string
  totalFloors: string
  facing: string
  furnishing: string
  amenities: string[]
  price: string
  priceRange: string
  isNegotiable: boolean
  monthlyRent: string
  securityDeposit: string
  contactPhone: string
  contactEmail: string
  heroImage: string
  gallery: { url: string; s3Key: string }[]
}

const EMPTY_FORM: FormState = {
  displayType: '',
  propertyType: 'RESIDENTIAL_PLOT',
  listingType: 'SALE',
  title: '',
  description: '',
  state: '',
  city: '',
  area: '',
  address: '',
  pincode: '',
  googleMapsUrl: '',
  areaSqft: '',
  bedrooms: '',
  bathrooms: '',
  parkingSpaces: '',
  floor: '',
  totalFloors: '',
  facing: '',
  furnishing: '',
  amenities: [],
  price: '',
  priceRange: '',
  isNegotiable: false,
  monthlyRent: '',
  securityDeposit: '',
  contactPhone: '',
  contactEmail: '',
  heroImage: '',
  gallery: []
}

// --- Section wrapper ---
function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-brand-green/15 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-brand-soft flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-brand-green" />
        </div>
        <h2 className="font-serif text-lg font-bold text-brand-charcoal">{title}</h2>
      </div>
      <div>{children}</div>
    </div>
  )
}

// --- Input helper ---
function FieldInput({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-brand-charcoal/70 block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-[11px] text-red-600 font-medium">{error}</p>}
    </div>
  )
}

const inputCls = 'w-full bg-[#FAF9F6] border border-brand-green/20 text-brand-charcoal text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all'
const selectCls = inputCls + ' cursor-pointer'

// --- Auth Gate (shown when user is not logged in) ---
function AuthGate() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-brand-soft flex items-center justify-center mx-auto">
          <Home className="w-8 h-8 text-brand-green" />
        </div>
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-green">Property Listing Portal</p>
          <h1 className="font-serif text-3xl font-bold text-brand-charcoal">List Your Property</h1>
          <p className="text-sm text-brand-charcoal/60 leading-relaxed">
            Create a free account or login to list your property with House & Sky and reach verified buyers and tenants.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-brand-green/15 p-6 space-y-3">
          <Link
            href="/owner-register?redirect=/list-your-property"
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-green text-white text-xs font-bold hover:bg-brand-dark transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Create Free Account
          </Link>
          <Link
            href="/owner-login?redirect=/list-your-property"
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl border border-brand-green/20 text-brand-charcoal text-xs font-bold hover:bg-brand-soft transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Login to Existing Account
          </Link>
        </div>

        <p className="text-[11px] text-brand-charcoal/40">
          Free to list · No brokerage · Admin reviewed before going live
        </p>
      </div>
    </div>
  )
}

// --- Success Screen ---
function SuccessScreen({ referenceId }: { referenceId: string }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold text-brand-charcoal">Property Submitted!</h2>
          <p className="text-sm text-brand-charcoal/60 leading-relaxed">
            Your property has been submitted successfully. Our team will review it and update you shortly.
          </p>
        </div>
        <div className="bg-brand-soft rounded-2xl p-5 border border-brand-green/15 text-left space-y-1">
          <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-brand-green">Reference ID</p>
          <p className="font-mono font-extrabold text-xl text-brand-charcoal">{referenceId}</p>
          <p className="text-xs text-brand-charcoal/50">Keep this for your records</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/my-properties"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-green text-white text-xs font-bold hover:bg-brand-dark transition-colors"
          >
            View My Properties
          </Link>
          <Link
            href="/list-your-property"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl border border-brand-green/20 text-brand-charcoal text-xs font-bold hover:bg-brand-soft transition-colors"
            onClick={() => window.location.reload()}
          >
            List Another
          </Link>
        </div>
      </div>
    </div>
  )
}

// --- Image Uploader (for public form — uses the existing /public/upload endpoint) ---
function ImageUploader({
  images,
  onChange,
  heroImage,
  onHeroChange
}: {
  images: { url: string; s3Key: string }[]
  onChange: (images: { url: string; s3Key: string }[]) => void
  heroImage: string
  onHeroChange: (url: string) => void
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadError, setUploadError] = React.useState('')
  const baseUrl = getApiBaseUrl()
  const MAX_IMAGES = 10
  const MAX_SIZE_MB = 5

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploadError('')

    const remaining = MAX_IMAGES - images.length
    if (remaining <= 0) {
      setUploadError(`Maximum ${MAX_IMAGES} images allowed.`)
      return
    }

    const selected = Array.from(files).slice(0, remaining)
    const oversized = selected.filter((f) => f.size > MAX_SIZE_MB * 1024 * 1024)
    if (oversized.length > 0) {
      setUploadError(`${oversized.map((f) => f.name).join(', ')} exceed ${MAX_SIZE_MB}MB limit.`)
      return
    }

    setIsUploading(true)
    const uploaded: { url: string; s3Key: string }[] = []

    for (const file of selected) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'public-property-listings')
        const res = await fetch(`${baseUrl}/public/upload`, {
          method: 'POST',
          body: formData
        })
        const data = await res.json().catch(() => ({}))
        if (data.url) {
          uploaded.push({ url: data.url, s3Key: data.s3Key || '' })
        }
      } catch {
        setUploadError(`Failed to upload ${file.name}`)
      }
    }

    if (uploaded.length > 0) {
      const newImages = [...images, ...uploaded]
      onChange(newImages)
      // Auto-set hero image if not set
      if (!heroImage && uploaded[0]) {
        onHeroChange(uploaded[0].url)
      }
    }
    setIsUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index)
    onChange(updated)
    if (heroImage === images[index]?.url) {
      onHeroChange(updated[0]?.url || '')
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {images.map((img, index) => (
          <div
            key={`${img.url}-${index}`}
            className={`relative aspect-square rounded-xl overflow-hidden border-2 ${heroImage === img.url ? 'border-brand-green' : 'border-brand-green/15'} bg-brand-soft group cursor-pointer`}
            onClick={() => onHeroChange(img.url)}
            title="Click to set as main photo"
          >
            <img src={img.url} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
            {heroImage === img.url && (
              <div className="absolute bottom-0 left-0 right-0 bg-brand-green/90 text-white text-[9px] font-bold text-center py-0.5">MAIN</div>
            )}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeImage(index) }}
              className="absolute top-1 right-1 p-1 rounded-lg bg-white/90 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {images.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="aspect-square rounded-xl border-2 border-dashed border-brand-green/25 bg-brand-soft text-brand-green flex flex-col items-center justify-center gap-1 hover:bg-brand-green hover:text-white transition-colors disabled:opacity-60"
          >
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            <span className="text-[10px] font-bold">{isUploading ? 'Uploading…' : 'Add photos'}</span>
          </button>
        )}
      </div>
      {uploadError && <p className="text-[11px] text-red-600 font-medium">{uploadError}</p>}
      <p className="text-[11px] text-brand-charcoal/50">{images.length}/{MAX_IMAGES} photos · Click a photo to set it as the main listing image · Max {MAX_SIZE_MB}MB each</p>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
    </div>
  )
}

// --- Main Form Page ---
export default function ListPropertyPage() {
  const router = useRouter()
  const { isAuthenticated, user, token } = useOwnerAuth()
  const [form, setForm] = React.useState<FormState>({ ...EMPTY_FORM })
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitError, setSubmitError] = React.useState('')
  const [successRefId, setSuccessRefId] = React.useState('')

  // Pre-fill contact details from logged-in user
  React.useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        contactPhone: prev.contactPhone || user.phone || '',
        contactEmail: prev.contactEmail || user.email || ''
      }))
    }
  }, [user])

  if (!isAuthenticated) return <AuthGate />
  if (successRefId) return <SuccessScreen referenceId={successRefId} />

  const update = (key: keyof FormState, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setFieldErrors((prev) => ({ ...prev, [key]: '' }))
  }

  const toggleAmenity = (item: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(item)
        ? prev.amenities.filter((a) => a !== item)
        : [...prev.amenities, item]
    }))
  }

  const showBedBath = ['APARTMENT', 'VILLA'].includes(form.propertyType)
  const showFloor = ['APARTMENT', 'COMMERCIAL', 'SHOWROOM'].includes(form.propertyType)
  const isRent = form.listingType === 'RENT' || form.listingType === 'LEASE'

  const validate = () => {
    const errors: Record<string, string> = {}
    if (!form.displayType) errors.displayType = 'Please select property type.'
    if (!form.title.trim() || form.title.trim().length < 3) errors.title = 'Title must be at least 3 characters.'
    if (!form.city.trim()) errors.city = 'City is required.'
    if (!form.contactPhone.trim() || form.contactPhone.trim().length < 7) errors.contactPhone = 'Valid phone number is required.'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    if (!validate()) {
      const firstError = document.querySelector('[data-field-error]')
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        propertyType: form.propertyType,
        listingType: form.listingType,
        location: [form.area, form.city].filter(Boolean).join(', '),
        city: form.city.trim(),
        state: form.state.trim(),
        area: form.area.trim(),
        address: form.address.trim(),
        pincode: form.pincode.trim(),
        googleMapsUrl: form.googleMapsUrl.trim(),
        areaSqft: Number(form.areaSqft) || 0,
        bedrooms: Number(form.bedrooms) || 0,
        bathrooms: Number(form.bathrooms) || 0,
        parkingSpaces: Number(form.parkingSpaces) || 0,
        amenities: form.amenities,
        features: [form.furnishing, form.facing].filter(Boolean),
        price: isRent ? Number(form.monthlyRent) || 0 : Number(form.price) || 0,
        priceRange: form.priceRange.trim(),
        heroImage: form.heroImage,
        gallery: form.gallery.map((img) => ({ url: img.url, s3Key: img.s3Key })),
        contactPhone: form.contactPhone.trim(),
        contactEmail: form.contactEmail.trim()
      }

      const res = await fetch(`${getApiBaseUrl()}/properties/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setSubmitError(data.message || 'Failed to submit property. Please try again.')
        return
      }

      setSuccessRefId(data.data?.referenceId || 'HS-PROP-000000')
    } catch {
      setSubmitError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6 bg-bg-primary">
      {/* Page header */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-green">Property Listing Portal</p>
        <h1 className="font-serif text-3xl font-bold text-brand-charcoal mt-1">List Your Property</h1>
        <p className="text-xs text-brand-charcoal/60 mt-1">
          Logged in as <span className="font-bold text-brand-charcoal">{user?.fullName}</span> ·{' '}
          <button
            type="button"
            onClick={() => router.push('/my-properties')}
            className="text-brand-green font-bold hover:underline"
          >
            My Properties
          </button>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Section 1 — Basic Details */}
        <Section title="Basic Details" icon={Home}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldInput label="Property Type" required error={fieldErrors.displayType}>
              <select
                className={selectCls}
                value={form.displayType}
                onChange={(e) => {
                  const opt = PROPERTY_TYPE_OPTIONS.find((o) => o.label === e.target.value)
                  update('displayType', e.target.value)
                  if (opt) update('propertyType', opt.value)
                }}
              >
                <option value="">Select type…</option>
                {PROPERTY_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.label} value={opt.label}>{opt.label}</option>
                ))}
              </select>
            </FieldInput>

            <FieldInput label="Listing Type" required>
              <select
                className={selectCls}
                value={form.listingType}
                onChange={(e) => update('listingType', e.target.value)}
              >
                {LISTING_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </FieldInput>
          </div>

          <div className="mt-4">
            <FieldInput label="Property Title" required error={fieldErrors.title}>
              <input
                type="text"
                className={inputCls}
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="e.g. Spacious 3BHK in Sector 62 Noida"
                maxLength={160}
              />
            </FieldInput>
          </div>

          <div className="mt-4">
            <FieldInput label="Description">
              <textarea
                className={`${inputCls} resize-none`}
                rows={4}
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="Describe the property — key highlights, nearby landmarks, special features…"
                maxLength={2000}
              />
              <p className="text-[10px] text-brand-charcoal/40 mt-1">{form.description.length}/2000</p>
            </FieldInput>
          </div>
        </Section>

        {/* Section 2 — Location */}
        <Section title="Location" icon={MapPin}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldInput label="State">
              <input type="text" className={inputCls} value={form.state} onChange={(e) => update('state', e.target.value)} placeholder="e.g. Uttar Pradesh" />
            </FieldInput>
            <FieldInput label="City" required error={fieldErrors.city}>
              <input type="text" className={inputCls} value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="e.g. Noida" />
            </FieldInput>
            <FieldInput label="Locality / Area">
              <input type="text" className={inputCls} value={form.area} onChange={(e) => update('area', e.target.value)} placeholder="e.g. Sector 62" />
            </FieldInput>
            <FieldInput label="Pincode">
              <input type="text" className={inputCls} value={form.pincode} onChange={(e) => update('pincode', e.target.value)} placeholder="6-digit pincode" maxLength={6} />
            </FieldInput>
          </div>
          <div className="mt-4">
            <FieldInput label="Full Address">
              <textarea
                className={`${inputCls} resize-none`}
                rows={2}
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                placeholder="Plot number, street name, landmark…"
              />
            </FieldInput>
          </div>
          <div className="mt-4">
            <FieldInput label="Google Maps Link">
              <input
                type="url"
                className={inputCls}
                value={form.googleMapsUrl}
                onChange={(e) => update('googleMapsUrl', e.target.value)}
                placeholder="https://maps.google.com/..."
              />
            </FieldInput>
          </div>
        </Section>

        {/* Section 3 — Property Details */}
        <Section title="Property Details" icon={Building2}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <FieldInput label="Total Area (sq. ft.)">
              <input type="number" min="0" className={inputCls} value={form.areaSqft} onChange={(e) => update('areaSqft', e.target.value)} placeholder="e.g. 1200" />
            </FieldInput>
            {showBedBath && (
              <>
                <FieldInput label="Bedrooms">
                  <div className="relative">
                    <BedDouble className="w-4 h-4 text-brand-charcoal/30 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="number" min="0" max="20" className={`${inputCls} pl-9`} value={form.bedrooms} onChange={(e) => update('bedrooms', e.target.value)} placeholder="0" />
                  </div>
                </FieldInput>
                <FieldInput label="Bathrooms">
                  <div className="relative">
                    <Bath className="w-4 h-4 text-brand-charcoal/30 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="number" min="0" max="20" className={`${inputCls} pl-9`} value={form.bathrooms} onChange={(e) => update('bathrooms', e.target.value)} placeholder="0" />
                  </div>
                </FieldInput>
              </>
            )}
            <FieldInput label="Parking Spaces">
              <div className="relative">
                <Car className="w-4 h-4 text-brand-charcoal/30 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="number" min="0" max="10" className={`${inputCls} pl-9`} value={form.parkingSpaces} onChange={(e) => update('parkingSpaces', e.target.value)} placeholder="0" />
              </div>
            </FieldInput>
            {showFloor && (
              <>
                <FieldInput label="Floor Number">
                  <input type="number" min="0" className={inputCls} value={form.floor} onChange={(e) => update('floor', e.target.value)} placeholder="e.g. 3" />
                </FieldInput>
                <FieldInput label="Total Floors">
                  <input type="number" min="1" className={inputCls} value={form.totalFloors} onChange={(e) => update('totalFloors', e.target.value)} placeholder="e.g. 10" />
                </FieldInput>
              </>
            )}
            <FieldInput label="Facing">
              <select className={selectCls} value={form.facing} onChange={(e) => update('facing', e.target.value)}>
                <option value="">Any</option>
                {FACING_OPTIONS.map((f) => <option key={f}>{f}</option>)}
              </select>
            </FieldInput>
            {showBedBath && (
              <FieldInput label="Furnishing">
                <select className={selectCls} value={form.furnishing} onChange={(e) => update('furnishing', e.target.value)}>
                  <option value="">Not specified</option>
                  {FURNISHING_OPTIONS.map((f) => <option key={f}>{f}</option>)}
                </select>
              </FieldInput>
            )}
          </div>

          {/* Amenities */}
          <div className="mt-5">
            <p className="text-xs font-bold text-brand-charcoal/70 mb-2">Amenities</p>
            <div className="flex flex-wrap gap-2">
              {COMMON_AMENITIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleAmenity(item)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    form.amenities.includes(item)
                      ? 'bg-brand-green text-white'
                      : 'bg-brand-soft text-brand-charcoal hover:bg-brand-green/10'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* Section 4 — Pricing */}
        <Section title="Pricing" icon={IndianRupee}>
          {isRent ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldInput label="Monthly Rent (₹)">
                <input type="number" min="0" className={inputCls} value={form.monthlyRent} onChange={(e) => update('monthlyRent', e.target.value)} placeholder="e.g. 25000" />
              </FieldInput>
              <FieldInput label="Security Deposit (₹)">
                <input type="number" min="0" className={inputCls} value={form.securityDeposit} onChange={(e) => update('securityDeposit', e.target.value)} placeholder="e.g. 75000" />
              </FieldInput>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldInput label="Expected Price (₹)">
                <input type="number" min="0" className={inputCls} value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="e.g. 7500000" />
              </FieldInput>
              <FieldInput label="Price Display (optional)">
                <input type="text" className={inputCls} value={form.priceRange} onChange={(e) => update('priceRange', e.target.value)} placeholder="e.g. ₹75 Lakh" />
              </FieldInput>
            </div>
          )}
          <label className="flex items-center gap-2 cursor-pointer mt-3">
            <input
              type="checkbox"
              className="w-4 h-4 rounded accent-brand-green"
              checked={form.isNegotiable}
              onChange={(e) => update('isNegotiable', e.target.checked)}
            />
            <span className="text-xs font-semibold text-brand-charcoal/70">Price is negotiable</span>
          </label>
        </Section>

        {/* Section 5 — Contact */}
        <Section title="Your Contact Details" icon={Phone}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldInput label="Contact Phone" required error={fieldErrors.contactPhone}>
              <div className="relative">
                <Phone className="w-4 h-4 text-brand-charcoal/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  className={`${inputCls} pl-10`}
                  value={form.contactPhone}
                  onChange={(e) => update('contactPhone', e.target.value)}
                  placeholder="10-digit mobile"
                />
              </div>
            </FieldInput>
            <FieldInput label="Contact Email">
              <div className="relative">
                <Mail className="w-4 h-4 text-brand-charcoal/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  className={`${inputCls} pl-10`}
                  value={form.contactEmail}
                  onChange={(e) => update('contactEmail', e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
            </FieldInput>
          </div>
          <p className="text-[11px] text-brand-charcoal/50 mt-2">This is shown to interested buyers/tenants only after admin approval.</p>
        </Section>

        {/* Section 6 — Photos */}
        <Section title="Property Photos" icon={Camera}>
          <ImageUploader
            images={form.gallery}
            onChange={(imgs) => update('gallery', imgs)}
            heroImage={form.heroImage}
            onHeroChange={(url) => update('heroImage', url)}
          />
        </Section>

        {/* Submit */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-red-700">{submitError}</p>
          </div>
        )}

        <div className="flex items-center justify-between gap-4 bg-white rounded-2xl border border-brand-green/15 p-5">
          <div>
            <p className="text-xs font-bold text-brand-charcoal">Ready to submit?</p>
            <p className="text-[11px] text-brand-charcoal/50 mt-0.5">Our team will review and approve your listing within 24–48 hrs.</p>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-green text-white text-xs font-bold hover:bg-brand-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
            ) : (
              <><ChevronRight className="w-4 h-4" /> Submit Property</>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
