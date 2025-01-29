<script lang="ts">
	import { createClass } from '$utils/create-class'
	import { fade } from 'svelte/transition'

	import TextShimmer from '$ui/feedback/suspense-text-shimmer.svelte'
	import Spinner from '$ui/feedback/suspense-spinner.svelte'
	import ProgressRadial from '$ui/feedback/progress-radial.svelte'

	import type { PageData } from './$types'
	import SkeletonLoader from '$ui/feedback/suspense-skeleton.svelte'

	import PinCell from '$ui/auth/pin.svelte'

	let pin = $state('')
	let proto = $state('')
	let pinLength = $state(6) // Default number of pin cells

	let identifier = $state('jake@notnotjake.com')
	let editIdentity = $state(false)
	let continueButton = $state()

	let textSelected = $state(true)
</script>

<div class="h-12"></div>

<div class="w-full">
	<div class="providers flex w-full flex-col flex-nowrap gap-2">
		<div class="w-ful mb-4 h-[1px] w-full rounded-full"></div>

		<div class="flex flex-col items-center">
			<p class="mt-2 mb-4 font-medium text-neutral-600">Enter Code</p>
			<div class="group relative inline-block h-[2.8rem]">
				<input
					type="text"
					bind:value={pin}
					name="pin-input"
					inputmode="numeric"
					maxlength={pinLength}
					class="absolute top-0 left-0 h-full min-h-0 min-w-0 cursor-pointer opacity-0 focus:border-none focus:outline-none"
				/>

				<div
					class={createClass(
						'bg-neutral-150 group-focus-within:shadow-input-pop pointer-events-none flex h-full w-fit items-center rounded-[0.9rem] px-6 ring-1 ring-neutral-200 group-hover:ring-neutral-300'
					)}
				>
					{#each Array(pinLength) as _, i}
						{#if i === 3}
							<p class="h-fit w-4 text-[1.15rem]" class:bg-sky-200={textSelected}>&nbsp;</p>
						{/if}
						<PinCell value={pin[i] ?? ''} active={i === pin.length || textSelected} />
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
