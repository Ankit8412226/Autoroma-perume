'use server'

import { prisma } from '@/lib/db/prisma'
import { hash } from 'bcryptjs'
import { registerSchema } from '../schemas/register.schema'
import type { ActionResult } from '@/types/action.types'

export async function register(input: unknown): Promise<ActionResult<{ userId: string }>> {
  try {
    const validated = registerSchema.safeParse(input)
    if (!validated.success) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid registration input',
          details: validated.error.flatten().fieldErrors,
        },
      }
    }

    const { name, email, password } = validated.data

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return {
        success: false,
        error: 'An account with this email address already exists.',
      }
    }

    const passwordHash = await hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: 'CUSTOMER',
        isActive: true,
      },
    })

    return {
      success: true,
      data: { userId: user.id },
    }
  } catch (error) {
    console.error('Registration action error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred during registration. Please try again.',
    }
  }
}
