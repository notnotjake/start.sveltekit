<script>
	import { Tooltip } from 'bits-ui'
	import { IconHelp } from '@tabler/icons-svelte'
</script>

<Tooltip.Provider>
	<Tooltip.Root delayDuration={200}>
		<Tooltip.Trigger>
			<div>
				<IconHelp class="text-neutral-500" />
			</div>
		</Tooltip.Trigger>

		<Tooltip.Content side="bottom" sideOffset={5} align="end">
			<div class="flex flex-col gap-3 rounded-xl bg-neutral-900 px-3 py-3">
				{@render tooltip('bg-neutral-200', 'No.', 'Default')}
				{@render tooltip('bg-green-400', 'Yes!', 'Click Once')}
				{@render tooltip('bg-yellow-300/90', 'Maybe', 'Click Twice')}
			</div>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>

{#snippet tooltip(color, primaryText, secondaryText)}
	<div class="flex items-center gap-2">
		<div class="h-8 w-8 rounded-lg {color}"></div>
		<div>
			<p class="text-[0.9rem]/4 font-medium text-neutral-100">{primaryText}</p>
			<p class="text-[0.75rem]/3 text-neutral-400">{secondaryText}</p>
		</div>
	</div>
{/snippet}
