import { z } from 'zod'

export const registration = z.object({
	token: z.string()
})
