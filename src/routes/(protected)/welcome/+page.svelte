<script lang="ts">
	import { fly, scale, fade } from 'svelte/transition'
	import { onMount, onDestroy } from 'svelte'
	import { createClass } from '$utils/styles'
	import { ProgressText } from '$ui/feedback/progress'
	import Button from '$ui/input/button.svelte'
	import { IconConfettiFilled, IconArrowForwardUp } from '@tabler/icons-svelte'

	import EditName from './edit-name.svelte'
	import SecureAccount from './secure-account.svelte'

	let textTimer = $state(null)

	onMount(() => {
		textTimer = setTimeout(() => {
			textAnimationValue = 100
		}, 150)
	})

	function secondKey() {
		animationPhase = 'second'

		clearTimeout(timer)
		timer = null
	}

	onDestroy(() => {
		clearTimeout(textTimer)
		textTimer = null
	})

	let textAnimationValue = $state(0)
	let animationComplete = $state(false)
</script>

<div class="h-full min-h-full w-full flex-col items-center justify-center px-7 py-5 text-center">
	<div
		class={createClass(
			'absolute inset-0 z-0 h-full w-full transition-colors',
			animationComplete ? 'bg-black/10' : 'bg-black/0'
		)}
	></div>
	{#if !animationComplete}
		<div class="absolute inset-0 z-30 flex min-h-full w-full items-center justify-center">
			<div out:fly={{ y: -100, duration: 150, delay: 0 }}>
				<ProgressText
					value={textAnimationValue}
					dur={1800}
					fillColor="var(--color-neutral-800)"
					class="text-3xl font-semibold"
					onComplete={() => {
						animationComplete = true
					}}
				>
					Getting things setup
				</ProgressText>
			</div>
		</div>
	{:else}
		<div class="relative flex min-h-full w-full items-center justify-center">
			<div class="z-10 w-full max-w-md rounded-3xl bg-white" in:fly={{ y: 120, duration: 250 }}>
				<div class="flex items-center justify-center gap-2 pt-10">
					<IconConfettiFilled size={26} class="text-emerald-500" />
					<h2 class="tracking-tight-md text-[1.8rem] leading-loose font-semibold text-emerald-500">
						Welcome!
					</h2>
				</div>

				<div class="mx-auto mt-15 flex max-w-sm flex-col items-start justify-center">
					<div class="w-full">
						<EditName />
					</div>
					<div class="flex">
						<SecureAccount />
					</div>
				</div>

				<div class="flex justify-center py-10">
					<Button
						href="/app"
						resetStyles
						class="flex w-fit gap-1 py-4 text-[1.1rem] font-semibold text-neutral-500 hover:bg-transparent hover:text-neutral-900"
					>
						<IconArrowForwardUp />
						Skip for now
					</Button>
				</div>
			</div>
		</div>
	{/if}
</div>
