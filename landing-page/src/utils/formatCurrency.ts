/**
 * Formats price in paise to INR string (e.g. 39900 -> ₹399)
 */
export function formatCurrency(priceInPaise: number): string {
  const rupees = priceInPaise / 100
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: rupees % 1 === 0 ? 0 : 2,
  }).format(rupees)
}
