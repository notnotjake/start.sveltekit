import { z } from 'zod'

export const emailSchema = z.object({
	email: z.string().email('Email Invalid')
})

export const loginWithPasswordSchema = z.object({
	email: z.string().email('Email Invalid'),
	password: z.string().min(8, 'Too Short').max(64, 'Too Long')
})
