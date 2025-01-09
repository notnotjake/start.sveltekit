import { combinedSchema, type CombinedEnv } from './env.schema'
import * as private_env from '$env/static/private'
import * as public_env from '$env/static/public'
import { validateEnv } from './validate'

const process_env = { ...private_env, ...public_env }

function getEnvs(): Record<string, string> {
	const envVars: Record<string, string> = {}

	// Filters environment variables to just those defined in our schema
	// Removes all the other variables that are in runtime's shell execution
	const APP_ENV_KEYS = Object.keys(combinedSchema.shape)
	for (const key of APP_ENV_KEYS) {
		if (key in process_env) {
			envVars[key] = (process_env as Record<string, string>)[key]
		}
	}

	return envVars
}

const envs = getEnvs()

export const env = validateEnv(envs, combinedSchema)
