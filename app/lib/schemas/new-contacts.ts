import { z } from 'zod'

export const newContact = z.object({
	name: z.string().min(2, 'Name too short'),
	label: z.string(),
	email: z.string().email('Invalid email address'),
	phone: z.string().min(10)
})
