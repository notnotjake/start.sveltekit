<script lang="ts">
	import type { PageData } from './$types'
	import { enhance } from '$app/forms'

	import PasskeyRegister from '$ui/auth/passkey-register.svelte'

	let { data } = $props()
</script>

<h1>Protected Route</h1>
<p>User: {data.userEmail}</p>
<p>Session: {data.sessionId}</p>

<form method="POST" action="?/logout" use:enhance>
	<button class="rounded-full bg-rose-50 px-3 py-1 font-medium text-rose-600">Logout</button>
</form>

<PasskeyRegister />
