import { describe, it, expect } from 'vitest'
import { formatCurrency } from '../../src/utils/formatCurrency'

describe('formatCurrency', () => {
  it('formats paise to INR currency string correctly', () => {
    expect(formatCurrency(49900)).toBe('₹499')
    expect(formatCurrency(89900)).toBe('₹899')
    expect(formatCurrency(0)).toBe('₹0')
  })
})
