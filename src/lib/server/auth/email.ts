import { Resend } from 'resend'
import { RESEND_API } from '$env/static/private'
import { base } from '$app/paths'

const resend = new Resend(RESEND_API)

export async function sendMagiclinkEmail(email: string, token: string) {
	const magiclink = `${base}/auth?token=${token}`
}
