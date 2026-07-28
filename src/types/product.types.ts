import { ProductType, ProductStatus } from '@prisma/client'

export interface ProductVariantDTO {
  id: string
  label: string
  sku: string
  price: number
  stock: number
}

export interface ProductDTO {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  collectionId: string
  status: ProductStatus
  productType: ProductType
  price: number
  compareAtPrice?: number | null
  sku: string
  stock: number
  lowStockThreshold: number
  images: string[]
  scentFamily: string
  intensity: string
  longevity: string
  season: string[]
  occasion: string[]
  topNotes: string[]
  heartNotes: string[]
  baseNotes: string[]
  compatible: string[]
  mountType: string[]
  variants: ProductVariantDTO[]
  metaTitle?: string | null
  metaDescription?: string | null
  averageRating: number
  reviewCount: number
  salesCount: number
  isNew: boolean
  isFeatured: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
