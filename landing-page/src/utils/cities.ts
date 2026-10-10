'use client'

import * as React from 'react'
import { getApiBaseUrl } from '@/utils/api'

/** City configured by admins/managers in the admin panel (Cities & Locations). */
export interface PublicCity {
  _id: string
  name: string
  state?: string
  imageUrl?: string
  latitude?: number | null
  longitude?: number | null
}

/** Built-in list used only until admins configure their own cities. */
export const DEFAULT_CITY_NAMES = [
  'Dholera', 'Noida', 'Bhopal', 'Narmadapuram', 'Ahmedabad', 'Delhi NCR',
  'Gurgaon', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune', 'Indore',
  'Jaipur', 'Lucknow', 'Surat', 'Kolkata', 'Chennai', 'Goa',
  'Chandigarh', 'Ayodhya', 'Thane', 'Navi Mumbai', 'Nagpur', 'Ludhiana', 'Patna'
]

// One request per page load, shared by every component that needs cities.
let citiesPromise: Promise<PublicCity[]> | null = null

function fetchCities(): Promise<PublicCity[]> {
  if (!citiesPromise) {
    citiesPromise = fetch(`${getApiBaseUrl()}/public/cities`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => (Array.isArray(data) ? data : []))
      .catch(() => {
        citiesPromise = null // allow a retry on the next mount
        return []
      })
  }
  return citiesPromise
}

/** Admin-configured cities; `loaded` flips true once the request settles. */
export function useConfiguredCities() {
  const [cities, setCities] = React.useState<PublicCity[]>([])
  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => {
    let active = true
    fetchCities().then((list) => {
      if (!active) return
      setCities(list)
      setLoaded(true)
    })
    return () => {
      active = false
    }
  }, [])

  return { cities, loaded }
}

/** Case/spacing-insensitive exact match of free text (typed or spoken) to a city name. */
export function matchCityName(text: string, names: string[]): string | null {
  const q = text.toLowerCase().replace(/[.,!?]/g, '').replace(/\s+/g, ' ').trim()
  if (!q) return null
  return names.find((n) => n.toLowerCase() === q) || null
}

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/** Closest configured city that has coordinates, with its distance in km. */
export function findNearestCity(lat: number, lng: number, cities: PublicCity[]): { city: PublicCity; km: number } | null {
  let best: { city: PublicCity; km: number } | null = null
  for (const city of cities) {
    if (typeof city.latitude !== 'number' || typeof city.longitude !== 'number') continue
    const km = distanceKm(lat, lng, city.latitude, city.longitude)
    if (!best || km < best.km) best = { city, km }
  }
  return best
}

/**
 * Fallback when no configured city has coordinates: ask OpenStreetMap which
 * town/city the visitor is in. Returns candidate names, most specific first.
 */
export async function reverseGeocodeCityNames(lat: number, lng: number): Promise<string[]> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&zoom=10&lat=${lat}&lon=${lng}`,
      { headers: { Accept: 'application/json' } }
    )
    if (!res.ok) return []
    const data = await res.json()
    const a = data?.address || {}
    return [a.city, a.town, a.village, a.county, a.state_district].filter(
      (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0
    )
  } catch {
    return []
  }
}
