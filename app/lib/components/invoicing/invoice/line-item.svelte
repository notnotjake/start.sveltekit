<script lang="ts">
	interface lineItem {
		name: string
		description?: string
		subtotalPrice: number
		unitPrice: number
		unitLabel?: string
		unitQty: number
	}

	let { item }: lineItem = $props()

	function formatCurrency(amount: number): string {
		return (
			'$' +
			parseFloat(amount).toLocaleString('en-US', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			})
		)
	}
	function formatCurrencyCompact(amount: number): string {
		if (Number.isInteger(amount)) {
			// No decimal places, return as whole number
			return (
				'$' +
				parseFloat(amount).toLocaleString('en-US', {
					minimumFractionDigits: 0,
					maximumFractionDigits: 0
				})
			)
		} else {
			return (
				'$' +
				parseFloat(amount).toLocaleString('en-US', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				})
			)
		}
	}
</script>

<div class="item flex justify-between tracking-tight-sm">
	<div>
		<div class="description">
			<p class="tw text-[0.95rem]">{item.name}</p>
			<p class="tw text-sm text-slate-600">{item.description ?? ''}</p>
		</div>
	</div>

	<div class="total flex flex-col items-end">
		<h3 class="font-medium">{formatCurrencyCompact(item.subtotalPrice)}</h3>
		{#if item.unitQty == 1 && !item.unitLabel}
			<!-- quantity of one and no unit label: -->
			<p class="text-sm font-medium"></p>
		{:else}
			<div class="pricing flex text-sm font-medium text-slate-600">
				<p class="">{item.unitQty} {item.unitLabel ?? ''}</p>
				{#if item.unitQty > 1}
					<p class="">&nbsp;&times; {formatCurrencyCompact(item.unitPrice)}</p>
				{/if}
			</div>
		{/if}
	</div>
</div>
