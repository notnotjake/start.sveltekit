import { z } from 'zod'

export function validateEnv<T extends z.ZodTypeAny>(
	envs: Record<string, unknown>,
	schema: T
): z.infer<T> {
	try {
		const validatedEnv = schema.parse(envs)

		if (validatedEnv.NODE_ENV === 'development') {
			console.log('✅ env/validate - Environment variables validated successfully')
		}

		return validatedEnv
	} catch (error) {
		if (error instanceof z.ZodError) {
			const missingVars = error.errors.map((err) => err.path.join('.'))
			console.error('⚠️ env/validate - Invalid environment variables:', error.errors)
			console.error('⚠️ env/validate - Missing or invalid variables:', missingVars.join(', '))
			throw new Error('⚠️ env/validate - Invalid environment configuration')
		}
		throw error
	}
}
