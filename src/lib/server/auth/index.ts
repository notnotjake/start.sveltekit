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
	isSessionRecentlyAuthenticated,
	listAllUserSessions
} from './session'
import { generateToken } from './utils'
import { getUserByIdentifier, getUserKeysAvailable } from './users'
import { createAuthAttempt, getAuthAttempt } from './auth-attempt'
import { verifyPassword, addPassword } from './password'
import { addPasskey, getPasskeyCredential, getPasskeyUser } from './key'

import { verifyLoginWithEmail } from './verify-login'

import { sendMagiclink } from './magiclink'

const Auth = {
	sessionCookieName,
	getAuthAttempt,
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
	verifyPassword,
	addPassword,
	setRedirectUrl,
	consumeRedirectUrl,
	addPasskey,
	getPasskeyCredential,
	getPasskeyUser,
	sendMagiclink,
	isSessionRecentlyAuthenticated,
	verify: {
		withEmail: verifyLoginWithEmail
	}
}
export default Auth
