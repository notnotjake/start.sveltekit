<!-- Sheet.svelte -->
<script>
	import { fly, fade } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'

	let { open = $bindable(false), title = '' } = $props()

	const handleBackdropClick = () => {
		open = false
	}

	const handleKeydown = (event) => {
		if (event.key === 'Escape') {
			open = false
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
	<div class="fixed inset-0 z-40 flex items-end justify-center" transition:fade={{ duration: 300 }}>
		<!-- Backdrop -->
		<div
			class="absolute inset-0 bg-black/40"
			on:click={handleBackdropClick}
			on:keydown={handleBackdropClick}
			role="button"
			tabindex="-1"
		></div>

		<!-- Sheet -->
		<div
			class="relative w-full max-w-lg rounded-t-3xl bg-white p-6 shadow-xl"
			transition:fly={{
				y: '100%',
				duration: 400,
				easing: quintOut
			}}
		>
			<header class="mb-4 flex items-center justify-between">
				<h2 class="text-lg font-semibold">{title}</h2>
				<button on:click={() => (open = false)} class="text-sm text-gray-500"> Done </button>
			</header>
			<div class="max-h-[60vh] space-y-6 overflow-y-auto">
				<slot></slot>
			</div>
		</div>
	</div>
{/if}
