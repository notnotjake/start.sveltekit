<script>
	import { onMount } from 'svelte'
	import { enhance } from '$app/forms'

	let { data, form } = $props()

	$inspect(form)
</script>

<p>Passkey Testing</p>

<form method="POST" action="?/registerPasskey" use:enhance>
	<input type="email" name="email" id="email" placeholder="Email" />
	<input type="text" name="name" id="name" placeholder="Name" />
	<button>Register a Passkey</button>
</form>
