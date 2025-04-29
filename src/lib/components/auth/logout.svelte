<script lang="ts">
	import { goto } from '$app/navigation'
	import Button from '$ui/input/button.svelte'

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

<Button style="primary" onClick={handleClick} class="w-full" {...restProps}>Logout</Button>
