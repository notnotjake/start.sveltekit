import { z } from 'zod'

export const newCustomer = z.object({
	name: z.string().min(5, 'Name is too short'),
	addressLine1: z.string()$bindable,
	addressLine2: z.string(),
})
