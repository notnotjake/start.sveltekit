<script lang="ts">
	import { createClass } from '$utils/create-class'
	import { Tween } from 'svelte/motion'
	import { cubicOut } from 'svelte/easing'

	let sidebarContentSize = $state(0)
	let sidebarWidth = new Tween(80, {
		duration: 250,
		easing: cubicOut
	})

	let isSidebarShown = $state(false)

	function toggleSidebar() {
		isSidebarShown = !isSidebarShown
		sidebarWidth.target = 200
	}

	$effect(() => {
		if (isSidebarShown) {
			sidebarWidth.target = 0
		} else {
			sidebarWidth.target = sidebarContentSize
		}
	})
</script>

<div class="relative h-full w-full bg-neutral-900">
	<div
		desc="sidebar-left"
		bind:offsetWidth={sidebarContentSize}
		class={createClass(
			'h-full w-[18rem] transition-all delay-[25ms] duration-250',
			isSidebarShown ? 'opacity-20' : 'opacity-100'
		)}
	>
		<div desc="title bar" class="flex px-3 py-3">
			<button onclick={toggleSidebar} class="text-lg font-semibold text-neutral-300">Close</button>
		</div>
		<div>
			<p class="text-neutral-400">This is some text</p>
			<p class="text-neutral-400">This is some text</p>
			<p class="text-neutral-400">This is some text</p>
			<p class="text-neutral-400">This is some text</p>
			<p class="text-neutral-400">This is some text</p>
			<p class="text-neutral-400">This is some text</p>
		</div>

		<div desc="drag-handle" class="h-full w-10 bg-blue-500"></div>
	</div>

	<div class="absolute inset-0 flex h-full w-full">
		<div style:width={`${sidebarWidth.current}px`} class="h-full shrink-0"></div>
		<div class="h-full w-full min-w-10 bg-neutral-800" desc="sidebar-right (main)">
			<div desc="title bar" class="flex justify-between px-3 py-3">
				<button onclick={toggleSidebar} class="text-lg font-semibold text-neutral-300">Open</button>
				<p class="text-lg font-semibold text-neutral-300">Hi, Jake</p>
			</div>
		</div>
	</div>
</div>
