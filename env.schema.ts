import { z } from 'zod'

export const privateSchema = z.object({
	NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),

	// Database
	DB_URL: z.string(),

	RESEND_API: z.string(),

	OAUTH_GOOGLE_SECRET: z.string()
})

export const publicSchema = z.object({
	PUBLIC_URL_BASE: z.string().url().optional().default(''),
	PUBLIC_URL_ASSETS: z.union([z.string().url(), z.literal('')]),
	PUBLIC_ANALYTICS: z.coerce.boolean(),
	PUBLIC_OAUTH_GOOGLE_CLIENTID: z.string()
})

export const envSchema = z.object({
	...privateSchema.shape,
	...publicSchema.shape
})

export type PrivateEnv = z.infer<typeof privateSchema>
export type PublicEnv = z.infer<typeof publicSchema>
