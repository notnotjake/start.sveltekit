import type { RequestEvent } from '@sveltejs/kit'

export const sessionCookieName = 'session'
export const redirectCookieName = 'redirect'
export const stepUpReauthCookieName = 'stepUpReauth'

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set(sessionCookieName, token, {
		httpOnly: true,
		sameSite: 'lax',
		expires: expiresAt,
		path: '/'
	})
}

export function getSessionTokenCookie(event: RequestEvent): string | null {
	return event.cookies.get(sessionCookieName) ?? null
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.set(sessionCookieName, '', {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 0,
		path: '/'
	})
}

export function setRedirectUrlCookie(event: RequestEvent) {
	event.cookies.set(redirectCookieName, event.url.pathname, {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 5, // 5 minutes
		path: '/'
	})
}

export function getRedirectUrlCookie(event: RequestEvent): string {
	return event.cookies.get(redirectCookieName) ?? '/protected'
}

export function clearRedirectUrlCookie(event: RequestEvent) {
	event.cookies.set(redirectCookieName, '', {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 0,
		path: '/'
	})
}

export function setStepUpReauthCookie(event: RequestEvent) {
	event.cookies.set(stepUpReauthCookieName, 'true', {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 10, // 10 minutes
		path: '/'
	})
}

export function getStepUpReauthCookie(event: RequestEvent): boolean {
	return event.cookies.get(stepUpReauthCookieName) === 'true'
}

export function clearStepUpReauthCookie(event: RequestEvent) {
	event.cookies.set(stepUpReauthCookieName, '', {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 0,
		path: '/'
	})
}
