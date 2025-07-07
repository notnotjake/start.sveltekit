<script lang="ts">
	import { onMount } from 'svelte'
	import { greet } from 'sveltekit-auth'

	let res = $state('')

	onMount(() => {
		res = greet('Jake')
	})
</script>

<p>{res}</p>
