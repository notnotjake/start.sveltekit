import { z } from 'zod'

export const registration = z.object({
	email: z.string().email('Email not accepted')
})
