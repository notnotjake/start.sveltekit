import type { Actions } from './$types'
import { Resend } from 'resend'
import { RESEND_API } from '$env/static/private'
import { template } from './email-template'

const siteName = 'Luxo Circle'
const magicLinkURL = 'http://localhost:5173/login'
const magicLinkBackupCode = '012-489'

function timeInTenMinutes(): string {
	const now = new Date()
	now.setMinutes(now.getMinutes() + 10)

	const timeString = now.toLocaleTimeString('en-US')

	return timeString.replace(/:\d{2}\s/, ' ')
}

export const actions: Actions = {
	default: async () => {
		const resend = new Resend(RESEND_API)

		const { data, error } = await resend.emails.send({
			from: 'LightDance <accounts@resend.notnotjake.com>',
			to: ['jake@notnotjake.com'],
			subject: 'Sign In Link',
			html: template
		})

		if (error) {
			return console.error(error)
		}

		console.log(data)
	}
}
