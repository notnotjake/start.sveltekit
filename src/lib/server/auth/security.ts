import { error, type RequestEvent } from '@sveltejs/kit'
import type { User } from '$lib/server/db/schema/auth'

export class Security {
	private readonly user?: User

	constructor(private readonly event: RequestEvent) {
		this.user = event.locals.user
	}

	isAuthenticated() {
		if (!this.user) {
			error(401, 'Unauthorized')
		}
		return this
	}
}
