import { z } from 'zod'

export const registration = z.object({
	email: z.string().email('Email not accepted'),
	name: z.string().min(2, 'Too Short (min 2 characters)').max(32, 'Too Long (max 24 characters)')
})
