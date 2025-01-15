import type { Actions } from '@sveltejs/kit'
import { fail, redirect } from '@sveltejs/kit'
import { Resend } from 'resend'
import { RESEND_API } from '$env/static/private'
import { generateSessionToken, createSession, setSessionTokenCookie } from '$lib/server/auth'

export const actions: Actions = {
	createTestSession: async () => {
		const token = generateSessionToken()
		return {
			success: true,
			data: {
				token
			}
		}
	},
	sendMagicLinkEmail: async () => {
		const resend = new Resend(RESEND_API)

		const { data, error } = await resend.emails.send({
			from: 'LightDance <onboarding@resend.dev>',
			to: ['jake@lightdance.design'],
			subject: 'Hello World',
			html: '<strong>It works!</strong>'
		})

		if (error) {
			return console.error(error)
		}

		console.log(data)
	}
}
