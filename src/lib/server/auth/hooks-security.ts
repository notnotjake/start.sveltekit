import { error, type RequestEvent } from '@sveltejs/kit'
import type { User } from '$lib/server/db/schema/auth'

export class Security {
	private readonly user?: User | null

	constructor(private readonly event: RequestEvent) {
		this.user = event.locals.user
	}

	isAuthenticated() {
		if (!this.user) {
			error(401, 'unauthorized')
		}
		return this
	}

	isAdmin() {
		if (!this.user?.admin) {
			error(403, 'not admin')
		}
		return this
	}

	hasRole(role: string) {
		if (!this.user?.roles.includes(role)) {
			error(403, 'missing role: ' + role)
		}
		return this
	}

	hasAnyRole(roles: string[]) {
		if (!roles.some((role) => this.user?.roles.includes(role))) {
			error(403, 'missing any role: ' + roles.join(', '))
		}
		return this
	}

	hasAllRoles(roles: string[]) {
		if (!roles.every((role) => this.user?.roles.includes(role))) {
			const missing = roles.filter((role) => !this.user?.roles.includes(role)).join(', ')
			error(403, 'missing role(s): ' + missing)
		}
		return this
	}

	isProjectOwner(project: Project) {
		if (!this.user || !project.owners.includes(this.user.uid)) {
			error(403, 'not project owner')
		}
		return this
	}

	isInternalAccount() {
		if (!this.user || !this.user.email?.endsWith('@company.com')) {
			error(403, 'not internal account')
		}
		return this
	}
}
