import {
	setSessionTokenCookie,
	getSessionTokenCookie,
	deleteSessionTokenCookie,
	setRedirectUrl,
	getRedirectUrl,
	setStepUpReauthCookie,
	getStepUpReauthCookie,
	clearStepUpReauthCookie
} from './cookie'
import {
	createUnauthenticatedSession,
	createAuthenticatedSession,
	authenticateSession,
	invalidateSession,
	validateSessionToken,
	listAllUserSessions
} from './session'
import { generateToken } from './utils'
import { getUserByIdentifier, getUserKeysAvailable } from './users'
import { createAuthAttempt, getAuthAttempt } from './auth-attempt'
import { verifyPassword, addPassword } from './password'
import { addPasskey, getPasskeyCredential, getPasskeyUser } from './key'

import { verifyLoginWithEmail } from './verify-login'

import { sendMagiclink } from './magiclink'

import { requireRecentAuth, requireAuthenticatedUser, requireSession } from './protect'

const Auth = {
	getAuthAttempt,
	getSessionTokenCookie,
	setStepUpReauthCookie,
	getStepUpReauthCookie,
	getUserKeysAvailable,
	setSessionTokenCookie,
	deleteSessionTokenCookie,
	invalidateSession,
	createUnauthenticatedSession,
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
	getRedirectUrl,
	addPasskey,
	getPasskeyCredential,
	getPasskeyUser,
	sendMagiclink,
	clearStepUpReauthCookie,
	verify: {
		withEmail: verifyLoginWithEmail
	},
	protect: {
		requireRecentAuth,
		requireAuthenticatedUser,
		requireSession
	}
}
export default Auth
