<script lang="ts">
	import type { ComponentProps } from 'svelte'
	import Button from '$ui/input/button.svelte'

	let state: null | 'trying' | 'timeout' | 'success' | 'error' = $state(null)

	function handleClick() {
		console.log('trying to submit')
	}

	// Another potential feature: countdown also confirm with second click
</script>

<Button
	style="outline"
	onClick={() => {
		handleClick()
	}}>Resend</Button
>
