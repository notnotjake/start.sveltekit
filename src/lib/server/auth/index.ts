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

import { generateToken, generateShortCode } from './utils'

import {
	getUserByIdentifier,
	getUserKeysAvailable,
	requestUpdateUserIdentifier,
	confirmUpdateUserIdentifier,
	getUserKeysOfType
} from './users'

import { createAuthAttempt, getAuthAttempt } from './auth-attempt'

import { verifyPasswordsMatch, addPassword, updatePassword } from './password'

import { addPasskey, getPasskeyCredential, getPasskeyUser } from './key'

import { verifyLoginWithEmail, verifyLoginWithPassword, verifyLoginWithCode } from './verify-login'

import { sendMagiclink, sendCode } from './magiclink'

import { requireRecentAuth, requireAuthenticatedUser, requireSession } from './protect'

export { authHandler } from './handler'
export { protectHandler } from './hooks'

const Auth = {
	getAuthAttempt,
	getUserKeysOfType,
	requestUpdateUserIdentifier,
	generateShortCode,
	confirmUpdateUserIdentifier,
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
	verifyPasswordsMatch,
	addPassword,
	clearRedirectUrlCookie,
	setRedirectUrlCookie,
	getRedirectUrlCookie,
	updatePassword,
	addPasskey,
	getPasskeyCredential,
	getPasskeyUser,
	sendMagiclink,
	sendCode,
	clearStepUpReauthCookie,
	verify: {
		withEmail: verifyLoginWithEmail,
		withPassword: verifyLoginWithPassword,
		withCode: verifyLoginWithCode
	},
	protect: {
		requireRecentAuth,
		requireAuthenticatedUser,
		requireSession
	}
}
export default Auth
