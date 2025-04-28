import { PUBLIC_NODE_ENV } from '$env/static/public'

import { login } from './login'

const Email = {
	login
}

export default Email

export const CONSOLE_ONLY = PUBLIC_NODE_ENV === 'development'
// export const CONSOLE_ONLY = false
