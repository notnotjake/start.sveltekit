<script lang="ts">
	import { Tabs } from 'bits-ui'
</script>

{#snippet trigger(title, value)}
	<Tabs.Trigger
		{value}
		class="shrink-0 rounded-full bg-transparent px-3.5 py-1 font-medium text-neutral-500 hover:text-neutral-800 data-[state=active]:bg-neutral-500/20 data-[state=active]:text-neutral-900 data-[state=active]:inset-shadow-sm"
	>
		{title}</Tabs.Trigger
	>
{/snippet}

<Tabs.Root value="all" class="max-w-sm bg-neutral-200 px-5 py-5">
	<Tabs.List class="flex gap-1 overflow-scroll bg-neutral-200 px-2">
		{@render trigger('All', 'all')}
		{@render trigger('Productivity', 'productivity')}
		{@render trigger('Travel', 'travel')}
		{@render trigger('Shopping', 'shopping')}
		{@render trigger('Entertainment', 'entertainment')}
	</Tabs.List>
	<Tabs.Content value="all" class="debug pt-3 select-none">
		<div class="grid grid-cols-3 grid-rows-2 gap-0 p-4 pb-1">
			<div class="text-left">
				<h4 class="mb-2 text-[20px] leading-none font-semibold tracking-[-0.01em]">Prague</h4>
				<p class="text-muted-foreground text-sm font-medium">06:05</p>
			</div>
			<div class="self-end text-center">
				<p class="text-muted-foreground text-sm font-medium">3h 30m</p>
			</div>
			<div class="text-right">
				<h4 class="mb-2 text-[20px] leading-none font-semibold tracking-[-0.01em]">Malaga</h4>
				<p class="text-muted-foreground text-sm font-medium">06:05</p>
			</div>
			<div class="relative col-span-3">
				<hr class="border-border-input relative top-4 h-px border-1 border-dashed" />

				<div class="bg-background-alt absolute left-1/2 -translate-x-1/2 p-1"></div>
			</div>
		</div>
	</Tabs.Content>
	<Tabs.Content value="productivity" class="pt-3 select-none">
		<div class="grid grid-cols-3 grid-rows-2 gap-0 p-4 pb-1">
			<div class="text-left">
				<h4 class="mb-2 text-[20px] leading-none font-semibold tracking-[-0.01em]">Malaga</h4>
				<p class="text-muted-foreground text-sm font-medium">07:25</p>
			</div>
			<div class="self-end text-center">
				<p class="text-muted-foreground text-sm font-medium">3h 20m</p>
			</div>
			<div class="text-right">
				<h4 class="mb-2 text-[20px] leading-none font-semibold tracking-[-0.01em]">Prague</h4>
				<p class="text-muted-foreground text-sm font-medium">10:45</p>
			</div>
			<div class="relative col-span-3">
				<hr class="border-border-input relative top-4 h-px border-1 border-dashed" />

				<div class="bg-background-alt absolute left-1/2 -translate-x-1/2 p-1"></div>
			</div>
		</div>
	</Tabs.Content>
</Tabs.Root>
