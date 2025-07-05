// need to import something
// then create your own instance of it with config like db reference and email plugin

// options to define:
// redirects
// callbacks after certain actions
// passkey details
// email details
// other things about how it's setup and working

const authOptions = {
	redirects: {
		afterLogin: '/dashboard',
		afterLogout: '/',
		afterAccountCreated: '/welcome',
		afterAccountDeleted: '/'
	},
	authenticationMethods: {
		passkeys: 'true',
		passwords: 'true',
		email: 'true',
		oauth: 'false'
	}
}

// email link or email code
// email code initially then link if more secure auth methods are added
// still only allow codes to be redeemed in session the login was initiated from
