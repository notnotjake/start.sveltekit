import { z } from 'zod'

export const passwordSchema = z.object({
	password: z
		.string()
		.min(8, 'Must be at least 8 characters')
		.max(64, 'Must be less than 64 characters')
})
