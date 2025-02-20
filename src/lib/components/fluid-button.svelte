<script lang="ts">
	import { createClass } from '$utils/create-class'
	import CheckmarkIcon from '$lib/theme/icons/checkmark.svelte'
	import ErrorIcon from '$lib/theme/icons/exclamation-circle-fill.svelte'
	import { Suspense } from '$ui/feedback'
	import ResizableContainer from '$ui/resizable-container.svelte'
	import { fly, fade, scale, slide } from 'svelte/transition'
	import { Spring } from 'svelte/motion'
	import { cubicOut } from 'svelte/easing'

	let containerWidth = new Spring(100, {
		stiffness: 0.07,
		damping: 0.29
	})
	let contentWidth = $state(0)

	$effect(() => {
		containerWidth.target = contentWidth
	})

	type ButtonState = 'button' | 'suspense' | 'completed' | 'error'
	let buttonState: ButtonState = $state('button')

	const errorSim = false
	function stepButtonState() {
		if (errorSim) {
			if (buttonState == 'button') {
				buttonState = 'suspense'
				setTimeout(() => {
					buttonState = 'error'
				}, 1500)
			} else {
				buttonState = 'button'
			}
		} else {
			if (buttonState == 'button') {
				buttonState = 'suspense'
				setTimeout(() => {
					buttonState = 'completed'
				}, 1500)
				setTimeout(() => {
					buttonState = 'button'
				}, 4000)
			} else {
				buttonState = 'button'
			}
		}
	}

	$inspect(buttonState)
</script>

<button
	onclick={stepButtonState}
	style:width={`${containerWidth.current}px`}
	class={createClass(
		'relative flex h-10 cursor-pointer items-center justify-center rounded-full px-2 transition-colors duration-300',
		buttonState == 'button' ? 'bg-stone-200' : 'bg-neutral-800',
		buttonState == 'completed' ? 'bg-white inset-ring-1 inset-ring-stone-200' : '',
		buttonState == 'error' ? 'bg-rose-100 inset-ring-2 inset-ring-rose-500' : ''
	)}
>
	<div bind:offsetWidth={contentWidth} class="relative flex h-full w-fit items-center px-2">
		{#if buttonState != 'button'}
			<div class="relative min-w-7 px-2">
				{#if buttonState == 'suspense'}
					<div
						class="absolute inset-0 flex items-center justify-center"
						in:scale={{ start: 0.4, opacity: 0, duration: 300, start: 0.95, easing: cubicOut }}
						out:fade={{ duration: 150, easing: cubicOut }}
					>
						<div class="flex h-6 w-6 items-center justify-center">
							<Suspense.Spinner
								background={'var(--color-stone-300)'}
								tint={'var(--color-stone-50)'}
								gradient={false}
								percent={25}
								speed={'fast'}
							/>
						</div>
					</div>
				{:else if buttonState == 'completed'}
					<div
						class="absolute inset-0 flex items-center justify-center"
						in:scale={{
							delay: 50,
							duration: 150,
							start: 0.4,
							opacity: 0,
							easing: cubicOut
						}}
						out:fade={{ duration: 150, easing: cubicOut }}
					>
						<div class="flex h-6 w-6 items-center justify-center">
							<CheckmarkIcon class="text-neutral-600 transition-colors duration-300" size="24px" />
						</div>
					</div>
				{:else if buttonState == 'error'}
					<div
						class="absolute inset-0 flex items-center justify-center"
						in:scale={{
							delay: 50,
							duration: 150,
							start: 0.4,
							opacity: 0,
							easing: cubicOut
						}}
						out:fade={{ duration: 150, easing: cubicOut }}
					>
						<div class="flex h-6 w-6 items-center justify-center">
							<ErrorIcon class="text-rose-700 transition-colors duration-300" size="24px" />
						</div>
					</div>
				{/if}
			</div>
		{/if}

		<ResizableContainer {buttonState} />
	</div>
</button>
