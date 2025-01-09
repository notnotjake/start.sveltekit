export function filterEnvs(process_env, schema): Record<string, string> {
	const envVars: Record<string, string> = {}

	// Filters environment variables to just those defined in our schema
	// Removes all the other variables that are in runtime's shell execution
	const APP_ENV_KEYS = Object.keys(schema.shape)
	for (const key of APP_ENV_KEYS) {
		if (key in process_env) {
			envVars[key] = (process_env as Record<string, string>)[key]
		}
	}

	return envVars
}
