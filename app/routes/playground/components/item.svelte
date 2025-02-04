<script lang="ts">
	import type { Snippet } from 'svelte'
	type Props = {
		title?: string
		description?: string
		children: Snippet
		source: string
	}
	let {
		children,
		title = 'Component Title',
		description = 'This is a new svelte component',
		source = ''
	}: Props = $props()
</script>

<div class="pb-14">
	<div class="mb-3 px-2">
		<div class="flex items-start justify-between">
			<h2 class="pb-0.5 text-xl/6 font-semibold text-blue-50">{title}</h2>
			<a
				href={source}
				class="h-fit rounded-full bg-blue-400/60 px-3 py-0.5 font-mono text-[0.9rem] font-medium text-blue-100"
			>
				Code
			</a>
		</div>

		<p class="text-lg/5 font-medium text-blue-100 opacity-90">
			{description}
		</p>
	</div>

	<div class="flex h-30 w-80 items-center justify-center rounded-[1.3rem] bg-white shadow-xl">
		<div class="flex flex-col items-center gap-2">
			{@render children()}
		</div>
	</div>
</div>
