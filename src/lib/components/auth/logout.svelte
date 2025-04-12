<script lang="ts">
	import { goto } from '$app/navigation'

	let { onClick: protectedOnClick, type: protectedType, ...restProps } = $props()

	const REDIRECT_AFTER_LOGOUT = '/'

	async function handleClick() {
		const response = await fetch('/auth/logout', {
			method: 'POST'
		})

		const result = await response.json()

		if (!result?.success) {
			console.log('show error')
		}

		if (result?.success === true) {
			goto(REDIRECT_AFTER_LOGOUT)
		}
	}
</script>

<button type="button" onclick={handleClick} {...restProps}>Logout</button>
