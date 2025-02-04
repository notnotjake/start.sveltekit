<script lang="ts">
	import { createClass } from '$utils/create-class'
	import { Tween } from 'svelte/motion'
	import { cubicOut } from 'svelte/easing'

	const sidebarMin = 150
	const sidebarMax = 500
	let sidebarContentSize = $state(300) // declarative width of the sidebar's inner content and its expanded width

	let isResizing = $state(false)
	let isSidebarShown = $state(true)

	let sidebarWidthTweened = new Tween(sidebarContentSize, {
		duration: 250,
		easing: cubicOut
	})

	function startResize(event) {
		isResizing = true
		event.preventDefault()
	}
	function stopResize() {
		isResizing = false
	}
	function resize(event) {
		if (!isResizing) return
		if (event.pageX < 25) {
			isSidebarShown = !isSidebarShown
			stopResize()
		}
		const newWidth = Math.max(sidebarMin, Math.min(sidebarMax, event.pageX))
		sidebarContentSize = newWidth
		sidebarWidthTweened.set(newWidth, { duration: 0 })
	}

	function toggleSidebar() {
		isSidebarShown = !isSidebarShown
	}
	$effect(() => {
		if (isResizing) {
			console.log('not this')
		} else if (isSidebarShown) {
			sidebarWidthTweened.target = sidebarContentSize
		} else {
			sidebarWidthTweened.target = 0
		}
	})
</script>

<svelte:window on:mouseup={stopResize} />

<div class="relative flex h-full w-full bg-neutral-900" onmousemove={resize}>
	<div
		style:width={`${sidebarWidthTweened.current}px`}
		class="relative h-full shrink-0 overflow-hidden"
		desc="sidebar-left-container"
	>
		<div
			desc="sidebar-left-content"
			style:width={`${sidebarContentSize}px`}
			class={createClass(
				'absolute inset-0 h-full transition-all delay-[25ms] duration-250',
				isSidebarShown ? 'opacity-100' : 'opacity-20'
			)}
		>
			<div desc="title bar" class="flex px-3 py-3">
				<button onclick={toggleSidebar} class="text-lg font-semibold text-neutral-300">Close</button
				>
			</div>
			<div>
				<p class="text-neutral-400">This is some text</p>
				<p class="text-neutral-400">This is some text</p>
				<p class="text-neutral-400">This is some text</p>
				<p class="text-neutral-400">This is some text</p>
				<p class="text-neutral-400">This is some text</p>
				<p class="text-neutral-400">This is some text</p>
			</div>
		</div>
		<div
			desc="drag-handle"
			class={createClass(
				'absolute top-0 right-0 h-full w-[0px] bg-blue-500 opacity-0 transition-all duration-200 has-hover:w-[3px] has-hover:opacity-100',
				isResizing ? 'w-[3px] opacity-100' : ''
			)}
			onmousedown={startResize}
		>
			<div class="absolute top-0 right-0 h-full w-2.5 cursor-ew-resize"></div>
		</div>
	</div>

	<div class="h-full w-full min-w-10 shrink-1 bg-neutral-800" desc="sidebar-right (main)">
		<div desc="title bar" class="flex justify-between px-3 py-3">
			<button onclick={toggleSidebar} class="text-lg font-semibold text-neutral-300">Open</button>
			<p class="text-lg font-semibold text-neutral-300">Hi, Jake</p>
		</div>
		<p class="text-white">Content: {sidebarContentSize}</p>
		<p class="text-white">Tweened: {sidebarWidthTweened.current}</p>
		<p class="text-white">{isResizing ? 'yes' : 'no'}</p>
	</div>

	<!-- <div class="absolute inset-0 h-full w-full">
		<div class="absolute inset-0 h-full w-full border-1 bg-black/60"></div>
		<div class="absolute inset-0 flex h-full w-full items-center justify-center">
			<div
				class="h-[calc(100%-6rem)] w-[80%] max-w-[60rem] rounded-2xl bg-neutral-800 inset-ring-[0.5px] inset-ring-neutral-400/50"
			></div>
		</div>
	</div> -->
</div>
