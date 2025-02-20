<script lang="ts">
	import type { Snippet } from 'svelte'
	type Props = {
		name?: string
		description?: string
	}
	let { name, description }: Props = $props()
</script>

<div class="pt-5 pb-5">
	<div
		class="flex items-center justify-between rounded-[0.8rem] bg-blue-200/20 px-3 py-1.5 ring-1 ring-blue-200/40"
	>
		<h1 class=" text-2xl font-medium text-blue-50">
			{name}
		</h1>
		<p class="rounded-full px-2 text-sm font-medium text-blue-50 italic">Group</p>
	</div>
	<p class="rounded-b-[0.8rem] px-3 py-1 text-blue-50/90">
		{description}
	</p>
	<!-- <div class="h-[2px] w-full rounded-full bg-blue-300"></div> -->
</div>
