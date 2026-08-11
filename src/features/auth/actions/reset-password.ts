'use server'

import { prisma } from '@/lib/db/prisma'
import { hash } from 'bcryptjs'
import { resetPasswordSchema } from '../schemas/reset-password.schema'
import type { ActionResult } from '@/types/action.types'

export async function resetPassword(
  input: unknown
): Promise<ActionResult<{ message: string }>> {
  try {
    const validated = resetPasswordSchema.safeParse(input)
    if (!validated.success) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid password reset input',
          details: validated.error.flatten().fieldErrors,
        },
      }
    }

    const { token, password } = validated.data

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    })

    if (!verificationToken) {
      return {
        success: false,
        error: 'Invalid or expired password reset token. Please request a new link.',
      }
    }

    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: { token },
      })
      return {
        success: false,
        error: 'Password reset link has expired. Please request a new link.',
      }
    }

    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    })

    if (!user || !user.isActive) {
      return {
        success: false,
        error: 'User account was not found or is inactive.',
      }
    }

    const passwordHash = await hash(password, 12)

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    })

    // Remove used verification token
    await prisma.verificationToken.delete({
      where: { token },
    })

    // Invalidate all active sessions for security
    await prisma.session.deleteMany({
      where: { userId: user.id },
    })

    return {
      success: true,
      data: {
        message: 'Your password has been reset successfully. Please sign in with your new password.',
      },
    }
  } catch (error) {
    console.error('Reset password error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while resetting your password. Please try again.',
    }
  }
}
