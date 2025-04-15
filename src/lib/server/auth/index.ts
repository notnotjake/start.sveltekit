import {
	setSessionTokenCookie,
	getSessionTokenCookie,
	deleteSessionTokenCookie,
	setRedirectUrlCookie,
	getRedirectUrlCookie,
	clearRedirectUrlCookie,
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

import { verifyPassword, addPassword, updatePassword } from './password'

import { addPasskey, getPasskeyCredential, getPasskeyUser } from './key'

import { verifyLoginWithEmail, verifyLoginWithPassword } from './verify-login'

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
	clearRedirectUrlCookie,
	setRedirectUrlCookie,
	getRedirectUrlCookie,
	updatePassword,
	addPasskey,
	getPasskeyCredential,
	getPasskeyUser,
	sendMagiclink,
	clearStepUpReauthCookie,
	verify: {
		withEmail: verifyLoginWithEmail,
		withPassword: verifyLoginWithPassword
	},
	protect: {
		requireRecentAuth,
		requireAuthenticatedUser,
		requireSession
	}
}
export default Auth
