// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { Session, User } from '$lib/server/db/index'

declare global {
	namespace App {
		interface Locals {
			user: User | null
			session: Session | null
		}

		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
