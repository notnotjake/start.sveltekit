import { PUBLIC_URL_BASE, PUBLIC_NODE_ENV } from '$env/static/public'
import { env } from '$env/dynamic/private'
import { Resend } from 'resend'
import LoginEmail from './templates/login-email'

const RESEND_AUTH = env.RESEND_AUTH

import { StructuredResponse as Response } from '$utils/structured-response'

const CONSOLE_ONLY = PUBLIC_NODE_ENV === 'development'

export async function login({
	email,
	token,
	newAccount = false,
	timezone = 'UTC',
	maxAgeMins = 5
}: {
	email: string
	token: string
	newAccount?: boolean
	timezone: string
	maxAgeMins?: number
}): Promise<Response<never>> {
	const resend = new Resend(RESEND_AUTH)

	const url = `${PUBLIC_URL_BASE}/login?magic=${token}`

	// Calculate expiration time based on maxAgeMins
	const expiresAt = new Date(Date.now() + maxAgeMins * 60 * 1000)

	// Format the expiration time in the user's timezone
	const timeFormatter = new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		timeZone: timezone,
		hour12: true
	})

	// Get timezone abbreviation
	const timeZoneFormatter = new Intl.DateTimeFormat('en-US', {
		timeZoneName: 'short',
		timeZone: timezone
	})
	const timeZoneParts = timeZoneFormatter.formatToParts(expiresAt)
	const timeZoneAbbr = timeZoneParts.find((part) => part.type === 'timeZoneName')?.value || ''

	const formattedExpirationTime = timeFormatter.format(expiresAt) + ' ' + timeZoneAbbr

	const options = {
		newAccount: newAccount,
		url: url,
		maxAgeMins: maxAgeMins,
		expiresAtString: formattedExpirationTime
	}

	if (CONSOLE_ONLY) {
		console.log('Simulated email. Magic Link: ', url)
	} else {
		const { error } = await resend.emails.send({
			from: 'LightDance <accounts@resend.notnotjake.com>',
			to: email,
			subject: newAccount ? 'Verify Email' : 'Login Link',
			react: LoginEmail(options)
		})

		if (error) {
			console.log(error)
			return Response.fail()
		}
	}

	return Response.succeed()
}
