<script lang="ts">
	import { fly, scale } from 'svelte/transition'
	import { onMount, onDestroy } from 'svelte'
	import CheckmarkIcon from '$ui/icons/checkmark.svelte'

	let animationPhase = $state('load')

	let timer = $state(null)

	onMount(() => {
		animationPhase = 'initial'

		timer = setTimeout(() => {
			animationPhase = 'second'
		}, 1500)
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

<div class=" w-full flex-col items-center justify-center px-7 py-5 text-center">
	{#if animationPhase === 'load'}
		<div></div>
	{:else if animationPhase === 'initial'}
		<div
			in:scale={{ duration: 150 }}
			out:scale={{ duration: 150 }}
			class="flex items-center justify-center gap-2 rounded-full bg-green-100 py-3 pr-4 pl-1"
		>
			<CheckmarkIcon class="text-green-500" size="27px" />
			<p class=" text-[1.2rem] leading-5 font-medium tracking-[-0.015em] text-green-700">
				Your account has been created
			</p>
		</div>
	{:else if animationPhase === 'second'}
		<h2
			in:fly={{ y: 100, duration: 200, delay: 150 }}
			class="tracking-tight-md text-[1.45rem] leading-loose font-[550]"
		>
			Welcome!
		</h2>
	{:else}
		<h2 class="tracking-tight-md text-[1.45rem] leading-loose font-[550]">Welcome!</h2>
	{/if}
</div>
