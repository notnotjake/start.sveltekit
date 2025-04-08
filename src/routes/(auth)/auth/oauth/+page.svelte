<script lang="ts">
	let { data } = $props()

	let progress = $state('')
	let window = $state()
	let innerWidth = $state()
	let innerHeight = $state()

	function initiateGoogleLogin() {
		console.log(innerWidth, innerHeight)
		const w = 550
		const h = 700
		const top = window.top.outerHeight / 2 + window.top.screenY - h / 2
		const left = window.top.outerWidth / 2 + window.top.screenX - w / 2
		const popup = window.open(
			data.authorizationURL,
			'Signin with Google',
			`width=${w},
			height=${h},
			top=${top},
			left=${left},
			popup=yes,
			toolbar=no,
			meubar=no`
		)
		window.addEventListener('message', async (event) => {
			// Verify the origin of the message
			if (event.origin !== window.location.origin) return

			console.log('Received token:', event.data)

			if (event.data.type === 'oauth-success') {
				// Handle successful login
				console.log('Successfully logged in:', event.data.user)
				progress = 'Success'
				popup?.close()
				// Refresh the page or update UI as needed
			} else if (event.data.type === 'oauth-error') {
				console.error('Login failed:', event.data.error)
				progress = 'Fail'
				popup?.close()
				// Handle error appropriately
			}
		})
	}
</script>

<svelte:window bind:this={window} />

<button onclick={initiateGoogleLogin}>Sign in with Google</button>
