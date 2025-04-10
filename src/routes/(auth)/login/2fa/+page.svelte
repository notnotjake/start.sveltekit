<script lang="ts">
	import type { PageData } from './$types'

	import { createClass } from '$utils/create-class'
	import { fade } from 'svelte/transition'

	import PinCell from '$ui/auth/pin.svelte'

	let pin = $state('')
	let proto = $state('')
	let pinLength = $state(6) // Default number of pin cells

	let textSelected = $state(true)
</script>

<div class="w-full">
	<div class="flex w-full flex-col items-center gap-0.5 pt-3 pb-10">
		<p class="text-center font-medium tracking-tight text-neutral-600">Enter Code</p>
		<div
			class="group bg-neutral-150 relative inline-block h-[2.8rem] rounded-[0.9rem] focus-within:ring-2 focus-within:ring-blue-500"
		>
			<input
				type="text"
				bind:value={pin}
				name="pin-input"
				inputmode="numeric"
				maxlength={pinLength}
				class="absolute top-0 left-0 h-full min-h-0 w-full min-w-0 cursor-pointer opacity-0"
			/>

			<div
				class="bg-neutral-150 pointer-events-none flex h-full w-fit items-center rounded-[0.9rem] px-6"
			>
				{#each Array(pinLength) as _, i}
					{#if i === 3}
						<p class="h-fit w-4 text-[1.15rem]">&nbsp;</p>
					{/if}
					<PinCell value={pin[i] ?? ''} active={i === pin.length || textSelected} />
				{/each}
			</div>
		</div>
	</div>
</div>
