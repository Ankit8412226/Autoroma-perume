'use server'

import { prisma } from '@/lib/db/prisma'
import { bulkInquirySchema } from '../schemas/bulkInquiry.schema'
import type { ActionResult } from '@/types/action.types'

export async function submitBulkInquiry(
  input: unknown
): Promise<ActionResult<{ inquiryId: string; referenceNumber: string }>> {
  try {
    const validated = bulkInquirySchema.safeParse(input)
    if (!validated.success) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid B2B inquiry data',
          details: validated.error.flatten().fieldErrors,
        },
      }
    }

    const data = validated.data
    const referenceNumber = `B2B-${Date.now().toString().slice(-6)}`

    const inquiry = await prisma.bulkOrder.create({
      data: {
        businessType: data.businessType,
        companyName: data.companyName,
        contactName: data.contactName,
        email: data.email,
        phone: data.phone,
        requirements: data.requirements,
        estimatedQty: data.estimatedQty,
        targetBudget: data.targetBudget ?? null,
        referenceNumber,
        status: 'NEW',
      },
    })

    return {
      success: true,
      data: {
        inquiryId: inquiry.id,
        referenceNumber: inquiry.referenceNumber,
      },
    }
  } catch (error) {
    console.error('B2B inquiry error:', error)
    return {
      success: false,
      error: 'Failed to submit bulk inquiry. Please try again.',
    }
  }
}
