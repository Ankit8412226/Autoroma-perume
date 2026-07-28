import { describe, it, expect } from 'vitest'
import { loginSchema } from '../../src/features/auth/schemas/login.schema'
import { registerSchema } from '../../src/features/auth/schemas/register.schema'
import { bulkInquirySchema } from '../../src/features/b2b/schemas/bulkInquiry.schema'

describe('Zod Validation Schemas', () => {
  describe('loginSchema', () => {
    it('validates correct email and password', () => {
      const result = loginSchema.safeParse({ email: 'driver@domain.com', password: 'Password123!' })
      expect(result.success).toBe(true)
    })

    it('rejects invalid email', () => {
      const result = loginSchema.safeParse({ email: 'invalid-email', password: 'Password123!' })
      expect(result.success).toBe(false)
    })
  })

  describe('registerSchema', () => {
    it('validates matching passwords', () => {
      const result = registerSchema.safeParse({
        name: 'Priya Mehta',
        email: 'priya@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      })
      expect(result.success).toBe(true)
    })

    it('rejects non-matching passwords', () => {
      const result = registerSchema.safeParse({
        name: 'Priya Mehta',
        email: 'priya@example.com',
        password: 'Password123!',
        confirmPassword: 'DifferentPassword!',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('bulkInquirySchema', () => {
    it('validates legitimate Indian 10-digit phone and requirements', () => {
      const result = bulkInquirySchema.safeParse({
        businessType: 'Dealership',
        companyName: 'Speedline Detailing',
        contactName: 'Vikram Sharma',
        email: 'vikram@speedline.com',
        phone: '9876543210',
        requirements: 'Looking for 100 units of custom car vent clips.',
        estimatedQty: 100,
      })
      expect(result.success).toBe(true)
    })
  })
})
