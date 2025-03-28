import { sessionCookieName, setSessionTokenCookie, deleteSessionTokenCookie } from './cookie'
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
import { getUserByIdentifier } from './users'
import { createAuthAttempt, verifyAuthAttempt } from './auth-attempt'

const Auth = {
	sessionCookieName,
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
	verifyAuthAttempt
}
export default Auth
