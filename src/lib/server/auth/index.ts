import {
	sessionCookieName,
	setSessionTokenCookie,
	deleteSessionTokenCookie,
	setRedirectUrl,
	consumeRedirectUrl
} from './cookie'
import {
	generateSessionToken,
	createSession,
	createAuthenticatedSession,
	authenticateSession,
	invalidateSession,
	validateSessionToken,
	listAllUserSessions
} from './session'
import { generateToken } from './utils'
import { getUserByIdentifier, getUserKeysAvailable } from './users'
import { createAuthAttempt, verifyAuthAttempt } from './auth-attempt'
import { verifyPassword, addPassword } from './password'

const Auth = {
	sessionCookieName,
	getUserKeysAvailable,
	setSessionTokenCookie,
	deleteSessionTokenCookie,
	generateSessionToken,
	invalidateSession,
	createSession,
	authenticateSession,
	createAuthenticatedSession,
	validateSessionToken,
	listAllUserSessions,
	generateToken,
	getUserByIdentifier,
	createAuthAttempt,
	verifyAuthAttempt,
	verifyPassword,
	addPassword,
	setRedirectUrl,
	consumeRedirectUrl
}
export default Auth
