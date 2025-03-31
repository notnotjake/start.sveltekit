import type { RequestEvent } from '@sveltejs/kit'

export const sessionCookieName = 'session'
export const redirectCookieName = 'redirect'

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set(sessionCookieName, token, {
		httpOnly: true,
		sameSite: 'lax',
		expires: expiresAt,
		path: '/'
	})
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.set(sessionCookieName, '', {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 0,
		path: '/'
	})
}

export function setRedirectUrl(event: RequestEvent) {
	event.cookies.set(redirectCookieName, event.url.pathname, {
		httpOnly: true,
		sameSite: 'lax',
		expires: new Date(Date.now() + 1000 * 60 * 15),
		path: '/'
	})
}

export function consumeRedirectUrl(event: RequestEvent) {
	const redirectUrl = event.cookies.get(redirectCookieName) ?? '/protected'

	event.cookies.set(redirectCookieName, '', {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 0,
		path: '/'
	})

	return redirectUrl
}
