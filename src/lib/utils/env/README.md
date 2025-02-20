# Env Validation for SvelteKit and Node

This tool provides environment variable validation using [Zod](https://zod.dev/) and makes validated environment variables accessible across:

- **SvelteKit server-side** (`$utils/env/server`)
- **SvelteKit client-side** (`$utils/env/client`) (though client-side usage is generally unnecessary)
- **External processes** (such as `drizzle.config.ts` or other Node.js scripts) via `import { env } from './src/lib/utils/env'`
	- When running this way it supports **layered environment variables**, ensuring values from `.env.development` or `.env.production` merge with `.env`.

### Features

- ✅ **Schema-based validation** using Zod
- ✅ **Works inside SvelteKit server code, SvelteKit client code, and standalone Node processes**
- ✅ **Supports layered `.env` resolution in Node environments**
- ✅ **Throws errors on missing or invalid variables at startup**

### Recommended Use
- Add env validation check to sveltekit startup (in hooks.server.ts)
- **Inside SvelteKit** use SvelteKit’s built-in environment imports for performance when accessing env values after validation
- **Outside SvelteKit** (eg Drizzle) use this library to access env values with layering and validation

---

## Prerequisites

**Ensure you have zod and dotenv installed:**

```sh
npm install zod dotenv
```

**Define your Schema:**

The schema is defined in `env.schema.ts` at the project root. It must export an `envSchema` object.

```ts
// env.schema.ts
import { z } from 'zod';

export const envSchema = z.object({
  DB_URL: z.string().url(),
  API_KEY: z.string(),
  NODE_ENV: z.enum(["development", "production", "test"]),
});
```

## SvelteKit server-side:

For server-side usage, import the validated environment

```
import { env } from '$utils/env/server';

console.log(env.DB_URL);
```

**Overhead Considerations in SvelteKit:**

Validating environment variables every time they are accessed adds minor overhead. Thus it is recommended you:
- Only validate the env's once at startup
- Then continue using SvelteKit’s built-in environment imports (`import { DB_URL } from '$env/static/private'`)

**Notes:**
- The server environment includes both private and public variables
- SvelteKit will prevent this import into client side code
- Uses SvelteKit’s `$env/static/private` and `$env/static/public` imports for environment access
	- Will utilize layered env values when running in bun or with dotenvx (ie. the tool does not specially handle layering env's)

## In External Node Processes (e.g., Drizzle):

When running a script outside of SvelteKit (e.g., usage in drizzle.config.ts)

```
import { env } from './src/lib/utils/env';

console.log(env.DB_URL);
```

**Notes:**
- Drizzle, running in a separate Node environment, does not have access to the `$lib` alias. Import from `./src/lib/env` to ensure compatibility
- Layers environment variables: combines **.env** with **.env.[environment]** and **.env.local**

## SvelteKit client-side:

Client-side usage is possible **but typically unnecessary**

```
import { env } from '$utils/env/client';

console.log(env.PUBLIC_API_KEY);
```

**Notes:**
- Only public environment variables are available on the client (svelte enforces a `PUBLIC_` prefix requirement)
- Uses SvelteKit’s `$env/static/private` and `$env/static/public` imports for environment access
	- Will utilize layered env values when running in bun or with dotenvx (ie. the tool does not specially handle layering env's)

---

## Code Structure

### `env/index.ts`
**Description:**  
Main entry point for accessing validated environment variables in **Node processes** (e.g., Drizzle migrations, CLI scripts).  

**Function Signatures:**  
- `export const env: z.infer<typeof envSchema>`  
  - Loads and validates environment variables from `process.env`.  

**Notes:**  
- Supports **layered environment variables** (e.g., merging `.env`, `.env.development`, `.env.local`).  
- Used when importing env variables outside of SvelteKit.  

---

### `env/server.ts`
**Description:**  
Provides access to validated environment variables for **SvelteKit server-side code**.  

**Function Signatures:**  
- `export const env: z.infer<typeof envSchema>`  
  - Loads and validates environment variables using SvelteKit’s `$env/static/private`.  

**Notes:**  
- Ensures private variables are never exposed to the client.  
- Should be used inside SvelteKit server routes, hooks, or endpoints.  

---

### `env/client.ts`
**Description:**  
Provides access to **public** environment variables on the client.  

**Function Signatures:**  
- `export const env: z.infer<typeof envSchema>`  
  - Loads and validates only environment variables prefixed with `PUBLIC_`.  

**Notes:**  
- Ensures only public env variables are available on the client.  
- Uses `$env/static/public`.  

---

### `env/validate.ts`
**Description:**  
Utility function to validate environment variables against a **Zod schema**.  

**Function Signatures:**  
- `validateEnv<T>(envs: Record<string, unknown>, schema: T, logLevel?: LogLevel): z.infer<T>`  
  - Validates `envs` against `schema`, logs errors based on `logLevel`, and returns parsed variables.  

**Notes:**  
- Logs validation results (`'all' | 'errors' | 'none'`).  
- Throws an error if validation fails.  

---

### `env.schema.ts`
**Description:**  
Defines the **Zod schema** for environment variable validation.  

**Function Signatures:**  
- `export const envSchema: z.ZodObject<{ ... }>`  
  - Defines required environment variables and their expected types.  

**Notes:**  
- Ensures all required variables exist and have correct formats.  
- Used by all other env modules.  
