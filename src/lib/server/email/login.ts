import { Resend } from 'resend'
import { RESEND_API } from '$env/static/private'
import { PUBLIC_URL_BASE } from '$env/static/public'
import MagicLinkEmail from './templates/login-email'

import { StructuredResponse as Response } from '$utils/structured-response'

export async function login(
	email: string,
	token: string,
	newAccount: boolean,
	timezone: string = 'UTC',
	maxAgeMins: number = 10
): Promise<Response<never>> {
	const resend = new Resend(RESEND_API)

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

	const formattedExpirationTime = timeFormatter.format(expiresAt)

	const options = {
		newAccount: newAccount,
		url: url,
		maxAgeMins: maxAgeMins,
		expiresAtString: formattedExpirationTime
	}

	const { error } = await resend.emails.send({
		from: 'LightDance <accounts@resend.notnotjake.com>',
		to: email,
		subject: newAccount ? 'Verify Email' : 'Login Link',
		react: MagicLinkEmail(options)
	})

	if (error) {
		console.log(error)
		return Response.fail()
	}

	console.log('simulated email')

	return Response.succeed()
}
