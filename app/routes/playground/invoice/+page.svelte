<script lang="ts">
	import LineItem from '$ui/invoicing/invoice/line-item.svelte'

	const customerId = 'LF'
	const invoiceId = 'P6001'
	const invoiceDate = 'Jan 2, 2025'

	const customerName = 'Buy n Large'

	const address = '1 MegaCorp Plaza'
	const city = 'Sellington'
	const state = 'NY'
	const zip = 99942
	const phone = '(555) 925 5533'

	const lineItem1 = {
		name: 'Product Photography',
		subtotalPrice: 800,
		unitPrice: 200,
		unitQty: 4,
		unitLabel: 'products',
		description: 'High-res product shots edited'
	}

	const lineItem2 = {
		name: 'SEO Optimization',
		description: 'On-page SEO and keyword research',
		subtotalPrice: 750,
		unitPrice: 250,
		unitQty: 3,
		unitLabel: 'pages'
	}

	const total = 1550

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
</script>

<div
	class="mt-14 min-w-[28rem] max-w-[36rem] border-x border-gray-200 px-10 py-4 print:min-w-[39rem] print:max-w-[40rem] print:border-hidden"
>
	<!-- Header -->
	<div class="mb-7 flex items-baseline gap-2">
		<h1 class="mr-3 grow text-2xl font-semibold tracking-tight-sm">Invoice</h1>

		<div
			class="flex gap-[0.35rem] rounded-md bg-slate-200/60 px-1.5 font-mono font-semibold tracking-tight"
		>
			<p class="text-[0.9rem] text-slate-800">{customerId}</p>
			<p class="text-[0.9rem] text-slate-800">{invoiceId}</p>
		</div>

		<h2 class="text-[0.95rem] font-medium uppercase text-slate-500">{invoiceDate}</h2>
	</div>

	<!-- Summary -->
	<div class="mb-10 mt-3">
		<p class="">
			<span class="text-lg font-medium">{formatCurrencyCompact(total)}</span><span
				class="font-medium">.00</span
			>
			<span class="">Billed to</span>
			<span class="text-lg font-medium">{customerName}</span>
		</p>
		<p class="text-[0.9rem] text-gray-600">{address}, {city} {state}, {zip}</p>
	</div>

	<!-- Line Items Compact -->
	<div
		class="shadow-primary mx-[-0.8rem] flex flex-col gap-1.5 rounded-2xl border border-gray-200 px-[0.8rem] py-3"
	>
		<div class="flex items-baseline tracking-tight-sm">
			<p class="flex-shrink-0 pr-1 text-[0.95rem] font-medium text-gray-800">2 Items</p>
			<p class="line-limit-1 text-sm text-gray-600">Photography and SEO</p>
		</div>

		<div class="flex flex-col gap-2 py-1">
			<LineItem item={lineItem1} />

			<!-- <div class="h-[1.5px] w-full rounded-full bg-slate-200"></div> -->

			<LineItem item={lineItem2} />
		</div>
	</div>

	<!-- Line Items Expanded -->

	<!-- Payment Summary -->
	<div class="total mt-6 flex flex-col justify-end gap-1.5">
		<div class="amount-due flex items-baseline justify-end gap-1 tracking-tight-sm">
			<h3 class="text-[0.9rem] text-slate-600">Subtotal</h3>
			<p class="font-medium text-slate-800">{formatCurrency(total)}</p>
		</div>
		<div class="amount-due flex hidden items-baseline justify-end gap-1 tracking-tight-sm">
			<h3 class="text-[0.9rem] text-green-600">Payment 2/15/24</h3>
			<p class="font-medium text-slate-800">-500.80</p>
		</div>

		<div class="amount-due mt-3 flex items-baseline justify-end gap-1">
			<h3 class="text-[0.9rem] font-semibold tracking-tight-md text-slate-600">Amount Due</h3>
			<p class="text-lg font-medium text-slate-800">{formatCurrency(total)}</p>
		</div>
	</div>

	<!-- Actions -->
	<div class="mt-10 flex flex-col items-end gap-2 *:cursor-pointer print:hidden">
		<p class="w-fit rounded-full bg-slate-100 px-4 py-1 text-center font-semibold text-[#0088FF]">
			Pay Now
		</p>
		<button
			on:click={() => window.print()}
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
