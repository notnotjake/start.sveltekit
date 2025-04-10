<script lang="ts">
	import type { PageData } from './$types'
	import { enhance } from '$app/forms'

	import PasskeyRegister from '$ui/auth/passkey-register.svelte'

	let { data } = $props()
</script>

<PasskeyRegister />
