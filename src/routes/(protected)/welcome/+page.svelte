<script lang="ts">
	import { fly, scale } from 'svelte/transition'
	import { onMount, onDestroy } from 'svelte'

	import WelcomeMessage from './welcome-message.svelte'
	import EditName from './edit-name.svelte'
	import SecureAccount from './secure-account.svelte'

	let animationPhase = $state('load')

	let timer = $state(null)

	onMount(() => {
		animationPhase = 'initial'

		timer = setTimeout(() => {
			animationPhase = 'second'
		}, 2000)
	})

	function secondKey() {
		animationPhase = 'second'

		clearTimeout(timer)
		timer = null
	}

	onDestroy(() => {
		clearTimeout(timer)
		timer = null
	})
</script>

<div class="mx-auto mt-30 flex max-w-sm flex-col items-start justify-center">
	<WelcomeMessage />

	{#if animationPhase === 'second'}
		<div in:fly={{ y: 200, duration: 600, delay: 200 }} class="flex flex-col gap-8">
			<EditName />
			<SecureAccount />
		</div>
	{/if}
</div>
