<script lang="ts">
	import { createClass } from '$utils/create-class'
	import { Tween } from 'svelte/motion'
	import { cubicOut, elasticOut } from 'svelte/easing'
	import { fly, fade, scale } from 'svelte/transition'

	let { class: classProp, children, buttonState } = $props()

	let containerWidth = new Tween(100, {
		duration: 400,
		easing: cubicOut
	})
	let contentWidthButton = $state(0)
	let contentWidthCompleted = $state(0)
	let contentWidthError = $state(0)

	containerWidth.delay = 500

	$effect(() => {
		if (buttonState == 'button') {
			containerWidth.target = contentWidthButton
		} else if (buttonState == 'completed') {
			setTimeout(() => {
				containerWidth.target = contentWidthCompleted
			}, 300)
		} else if (buttonState == 'error') {
			setTimeout(() => {
				containerWidth.target = contentWidthError
			}, 300)
		} else {
			containerWidth.target = 0
		}
	})
</script>

<div
	style:width={`${containerWidth.current}px`}
	class={createClass('relative flex h-10 items-center overflow-hidden', classProp)}
>
	{#if buttonState == 'button'}
		<p
			bind:offsetWidth={contentWidthButton}
			in:fly={{ y: -3, duration: 450, delay: 200, easing: cubicOut }}
			out:fade={{ duration: 200, easing: cubicOut }}
			class="absolute inset-0 flex h-full w-fit items-center justify-center px-2 text-[1.1rem] font-medium text-neutral-800"
		>
			Save
		</p>
	{:else if buttonState == 'completed'}
		<p
			bind:offsetWidth={contentWidthCompleted}
			in:scale={{ start: 0.6, opacity: 0, duration: 600, delay: 400, easing: elasticOut }}
			out:scale={{ start: 0.6, duration: 300, easing: cubicOut }}
			class="absolute inset-0 flex h-full w-fit items-center justify-center px-2 font-medium text-neutral-800"
		>
			Saved
		</p>
	{:else if buttonState == 'error'}
		<p
			bind:offsetWidth={contentWidthError}
			in:scale={{ start: 0.6, opacity: 0, duration: 600, delay: 400, easing: elasticOut }}
			out:scale={{ start: 0.6, duration: 300, easing: cubicOut }}
			class="absolute inset-0 flex h-full w-fit items-center justify-center px-2 font-medium text-rose-800"
		>
			Error
		</p>
	{/if}
</div>
