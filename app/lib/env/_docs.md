Provides environment variable validation using zod.

Schema is created in env.schema.ts
- Separated into public and private for organization and to support sveltekit's handling of private/public envs across server side and client side code

Validate
- Uses zod to parse environment variables against schema
- Outputs error or success message

private & public
- uses sveltekit's `$env/static/private` and `$env/static/public` imports and validates them
- private includes both private and public
- used in server.hooks.ts to check validation at server startup (uses private)
- recommended to continue using svelte's built in envs import rather than this code because
	- this code adds some overhead (validating every time the env is read)
	- loads/exposes all private or public env vars when used, as opposed to only those specified as is the case when using sveltekit's import (`import { DB_URL } from '$env/static/private` imports _only_ that variable instead of all environment variables)

index.ts
- uses process.env for node environments
- used by, for example, drizzle.config.ts
	- when the process is run inside of bun, it can use $lib alias, but when running directly in a node process, that alias is not available. (Drizzle runs in a separate node environment, not bun directly)
