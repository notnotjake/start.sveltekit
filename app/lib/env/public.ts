import { publicSchema, type PublicEnv } from './env.schema'
import * as public_env from '$env/static/public'
import { validateEnv } from './validate'

function getEnvs(): Record<string, string> {
	const envVars: Record<string, string> = {}

	// Filters environment variables to just those defined in our schema
	// Removes all the other variables that are in runtime's shell execution
	const APP_ENV_KEYS = Object.keys(publicSchema.shape)
	for (const key of APP_ENV_KEYS) {
		if (key in public_env) {
			envVars[key] = (public_env as Record<string, string>)[key]
		}
	}

	return envVars
}

const envs = getEnvs()

export const env = validateEnv(envs, publicSchema)
