<script lang="ts">
	import LineItem from '$bits/invoice/line-item.svelte'

	const customerId = 'LF'
	const invoiceId = 'P6001'
	const invoiceDate = 'Jan 2, 2025'

	const customerName = 'Buy n Large'

	const address = '1 MegaCorp Plaza'
	const city = 'Sellington'
	const state = 'NY'
	const zip = 92553
	const phone = '(555) 925 5533'

	const summary = 'Photography and SEO'
	const items = [
		{
			name: 'Product Photography',
			description: 'High-res product shots edited',
			unitPrice: 200,
			unitQty: 4,
			unitLabel: 'products'
		},
		{
			name: 'SEO Optimization',
			description: 'On-page SEO and keyword research',
			unitPrice: 250,
			unitQty: 3,
			unitLabel: 'pages'
		}
	]

	const total = $derived(
		items
			.map((item) => item.unitPrice * item.unitQty)
			.reduce((sum, itemTotal) => sum + itemTotal, 0)
	)

	// NEED TO REFACTOR OUT
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
	function formatCurrencyAsComponents(amount: number): { whole: string; cents: string } {
		// Extract whole and decimal parts
		const wholePart = Math.floor(Math.abs(amount))
		const centsPart = Math.round((Math.abs(amount) - wholePart) * 100)

		// Format whole part with dollar sign and commas
		const formattedWhole =
			'$' +
			wholePart.toLocaleString('en-US', {
				minimumFractionDigits: 0,
				maximumFractionDigits: 0
			})

		// Format cents part with leading zero if needed
		const formattedCents = centsPart.toString().padStart(2, '0')

		// Handle negative amounts by adding negative sign to whole part
		const finalWhole = amount < 0 ? '-' + formattedWhole : formattedWhole

		return {
			whole: finalWhole,
			cents: formattedCents
		}
	}

	function print() {
		window.print()
	}
</script>

<div
	class="mt-14 max-w-[36rem] min-w-[28rem] border-x border-gray-200 px-10 py-4 print:max-w-[40rem] print:min-w-[39rem] print:border-hidden"
>
	<div class="mb-7 flex items-baseline gap-2">
		<h1 class="tracking-tight-sm mr-3 grow text-2xl font-semibold">Invoice</h1>

		<div
			class="flex gap-[0.35rem] rounded-md bg-slate-200/60 px-1.5 font-mono font-semibold tracking-tight"
		>
			<p class="text-[0.9rem] text-slate-800">{customerId}</p>
			<p class="text-[0.9rem] text-slate-800">{invoiceId}</p>
		</div>

		<h2 class="text-[0.95rem] font-medium text-slate-500 uppercase">{invoiceDate}</h2>
	</div>

	<div class="mt-3 mb-10">
		<p class="">
			<span class="text-lg font-medium">{formatCurrencyAsComponents(total).whole}</span><span
				class="font-medium">.{formatCurrencyAsComponents(total).cents}</span
			> <span class="">Billed to</span> <span class="text-lg font-medium">{customerName}</span>
		</p>
		<p class="text-[0.9rem] text-gray-600">{address}, {city} {state}, {zip}</p>
	</div>

	<div
		class="shadow-primary mx-[-0.8rem] flex flex-col gap-1.5 rounded-2xl border border-gray-200 px-[0.8rem] py-3"
	>
		<div class="tracking-tight-sm flex items-baseline">
			<p class="flex-shrink-0 pr-1 text-[0.95rem] font-medium text-gray-800">
				{items.length} Item{items.length > 1 ? 's' : ''}
			</p>
			<p class="line-limit-1 text-sm text-gray-600">{summary}</p>
		</div>

		<div class="flex flex-col gap-2 py-1">
			{#each items as item}
				<LineItem {item} />
			{/each}
		</div>
	</div>

	<div class="total mt-6 flex flex-col justify-end gap-1.5">
		<div class="amount-due tracking-tight-sm flex items-baseline justify-end gap-1">
			<h3 class="text-[0.9rem] text-slate-600">Subtotal</h3>
			<p class="font-medium text-slate-800">{formatCurrency(total)}</p>
		</div>
		<!-- <div class="amount-due tracking-tight-sm flex hidden items-baseline justify-end gap-1">
			<h3 class="text-[0.9rem] text-green-600">Payment 2/15/24</h3>
			<p class="font-medium text-slate-800">-500.80</p>
		</div> -->

		<div class="amount-due mt-3 flex items-baseline justify-end gap-1">
			<h3 class="tracking-tight-md text-[0.9rem] font-semibold text-slate-600">Amount Due</h3>
			<p class="text-lg font-medium text-slate-800">{formatCurrency(total)}</p>
		</div>
	</div>

	<div class="mt-10 flex flex-col items-end gap-2 *:cursor-pointer print:hidden">
		<p class="w-fit rounded-full bg-slate-100 px-4 py-1 text-center font-semibold text-[#0088FF]">
			Pay Now
		</p>
		<button
			onclick={print}
			class="w-fit rounded-full bg-slate-100 px-4 py-1 text-center font-medium text-slate-600"
		>
			Print Invoice
		</button>
		<p class="w-fit rounded-full bg-slate-100 px-4 py-1 text-center font-medium text-slate-600">
			Contact
		</p>
	</div>
</div>

<style>
	@media print {
		:root {
			font-size: 11px;
		}
		body {
			margin: 0;
			padding: 0;
			height: auto !important;
			min-height: unset !important;
		}
		.shadow-primary {
			box-shadow: none !important;
		}
	}

	.shadow-primary {
		box-shadow:
			rgba(0, 0, 0, 0.07) 0px 0.602187px 0.602187px -1.166667px,
			rgba(0, 0, 0, 0.063) 0px 2.288533px 2.288533px -2.333333px,
			rgba(0, 0, 0, 0.03) 0px 10px 10px -3.5px;
	}
	.line-limit-1 {
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
