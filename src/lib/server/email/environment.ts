import { PUBLIC_NODE_ENV } from '$env/static/public'

const SEND_EMAILS_OVERRIDE: true | null = true // set to true to send emails in DEV environment

export const SUPRESS_EMAILS =
	SEND_EMAILS_OVERRIDE === true ? false : PUBLIC_NODE_ENV === 'development'
