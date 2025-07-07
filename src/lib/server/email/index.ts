import { PUBLIC_NODE_ENV } from '$env/static/public'

import { login } from './login'
import { loginCode } from './login-code'

const Email = {
	login,
	loginCode
}

export default Email

// export const CONSOLE_ONLY = PUBLIC_NODE_ENV === 'development'
export const CONSOLE_ONLY = false
