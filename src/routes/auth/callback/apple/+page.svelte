<script lang="ts">
	import { onMount } from 'svelte'
	import { Tween } from 'svelte/motion'
	import { scale } from 'svelte/transition'
	import { circOut, cubicOut } from 'svelte/easing'
	import { Suspense } from '$ui/feedback'

	let { data } = $props()

	let targetHeight = $state(0)
	let tweenedHeight = new Tween(0, {
		duration: 400,
		delay: 150,
		easing: circOut
	})

	let ready = $state(false)

	onMount(() => {
		ready = true
		// window.opener.postMessage('abc123', window.location.origin)
		tweenedHeight.target = targetHeight
		setTimeout(() => {
			window.close()
		}, 2500)
	})
</script>

<svelte:head>
	<title>Sign in with Apple</title>
</svelte:head>

<div bind:offsetHeight={targetHeight} class="relative h-full w-full">
	<div class="relative z-10 flex h-full w-full items-center justify-center">
		{#if data.name && ready}
			<p
				in:scale={{
					delay: 300,
					duration: 300,
					start: 0.4,
					opacity: 0,
					easing: cubicOut
				}}
				class="text-2xl font-semibold text-white opacity-80"
			>
				Welcome back {data.name}
			</p>
		{/if}
	</div>
	<div class="absolute inset-0 h-full w-full bg-green-100/50"></div>
	<div
		style:height={`${tweenedHeight.current}px`}
		class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#6BE389] to-[#0AB445]"
	></div>
</div>
