import { z } from 'zod'

export const bulkInquirySchema = z.object({
  businessType: z.string().min(1, 'Please select a business type'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  contactName: z.string().min(2, 'Contact name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address').toLowerCase(),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number'),
  requirements: z.string().min(10, 'Please describe your requirements in at least 10 characters'),
  estimatedQty: z.number().int().min(10, 'Minimum quantity is 10 units'),
  targetBudget: z.string().optional(),
})

export type BulkInquiryInput = z.infer<typeof bulkInquirySchema>
