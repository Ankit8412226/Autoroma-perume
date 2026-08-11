'use server'

import { prisma } from '@/lib/db/prisma'
import crypto from 'crypto'
import { forgotPasswordSchema } from '../schemas/forgot-password.schema'
import type { ActionResult } from '@/types/action.types'

export async function requestPasswordReset(
  input: unknown
): Promise<ActionResult<{ message: string; devResetToken?: string }>> {
  try {
    const validated = forgotPasswordSchema.safeParse(input)
    if (!validated.success) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid email address',
          details: validated.error.flatten().fieldErrors,
        },
      }
    }

    const { email } = validated.data
    const normalizedEmail = email.toLowerCase()
    const genericSuccessMsg =
      "If an account exists with this email address, password reset instructions have been sent."

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (!user || !user.isActive) {
      // Prevent user enumeration attacks
      return {
        success: true,
        data: { message: genericSuccessMsg },
      }
    }

    // Clean up existing tokens for this user
    await prisma.verificationToken.deleteMany({
      where: { identifier: normalizedEmail },
    })

    // Generate secure token valid for 1 hour
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 60 * 60 * 1000)

    await prisma.verificationToken.create({
      data: {
        identifier: normalizedEmail,
        token,
        expires,
      },
    })

    return {
      success: true,
      data: {
        message: genericSuccessMsg,
        devResetToken: token,
      },
    }
  } catch (error) {
    console.error('Request password reset error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while requesting password reset. Please try again.',
    }
  }
}
