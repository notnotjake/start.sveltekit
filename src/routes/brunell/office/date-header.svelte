<script lang="ts">
	import type { Snippet, Component } from 'svelte'
	import { createClass } from '$utils/create-class'

	let {
		title,
		date,
		hasNewEntries
	}: {
		title: string
		date: string
		hasNewEntries: boolean
	} = $props()
</script>

<div class="flex items-center gap-2">
	{#if hasNewEntries}
		<div
			class="-ml-4 h-2 w-2 rounded-full bg-blue-500 bg-gradient-to-b from-blue-500 to-blue-400"
		></div>
	{/if}
	{#if title}
		<p class="font-semibold text-neutral-700 capitalize">{title}</p>
	{/if}
	<p class="text-neutral-700">{date}</p>
</div>
