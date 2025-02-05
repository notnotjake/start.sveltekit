// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { SessionValidationResult } from '$lib/server/auth/session'

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: SessionValidationResult['user']
			session: SessionValidationResult['session']
			meta: {
				title: string | null
				description: string | null
			}
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
