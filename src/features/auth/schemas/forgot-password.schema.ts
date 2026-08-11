import { z } from 'zod'

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase(),
})

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
