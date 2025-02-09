<script lang="ts">
	import { formatInput, maskOnBlur } from '$lib/actions'

	let date = $state()

	const pattern = '####-####-####-####'

	let card = $state('')
	let expirationMonth = $state('')
	let expirationYear = $state('')
	let security = $state('')

	let cardTest = $state('')

	let cardInput
	let expirationMonthInput
	let expirationYearInput
	let securityInput

	// $effect(() => {
	// 	if (card.length > 5) {
	// 		expirationMonthInput.focus()
	// 		if (expirationMonth.length >= 2) {
	// 			expirationYearInput.focus()
	// 			if (expirationYear.length >= 2) {
	// 				securityInput.focus()
	// 			}
	// 		}
	// 	}
	// })
</script>

<div class="mb-2 px-7 py-5">
	<h2 class="tracking-tight-md text-[1.3rem] leading-loose font-[550]">Payment</h2>
	<p class="tracking-tight-lg text-[0.96rem] leading-5 font-[380]">You won't be charged yet</p>
</div>

<div
	class="flex h-full w-full flex-col items-center gap-3 rounded-[calc(1.3rem-0.5rem)] px-3.5 pt-7 pb-3"
>
	<div
		class="focus-within:shadow-input-pop flex h-[2.8rem] w-full max-w-full items-center rounded-[0.9rem] border-none bg-neutral-100 font-[450] text-zinc-900 ring-1 ring-neutral-200 transition-all outline-none selection:bg-sky-200 selection:text-blue-600 placeholder:font-normal placeholder:text-neutral-500"
	>
		<input
			type="text"
			bind:value={card}
			use:formatInput={'####-####-####-####'}
			use:maskOnBlur={{
				stripCharacters: '-',
				maskAtLength: 19,
				visibleAtEnd: 4,
				truncateFromStart: 15,
				truncatedFill: '...'
			}}
			placeholder="Card •••• ••••"
			class="min-w-0 pl-4 outline-none focus:placeholder:text-neutral-900"
		/>
		<input
			type="text"
			bind:value={expirationMonth}
			use:formatInput={'##/##'}
			inputmode="numeric"
			placeholder="MM/YY"
			class="w-17 px-0 outline-none focus:placeholder:text-neutral-900"
		/>
		<input
			type="text"
			use:formatInput={'###'}
			use:maskOnBlur
			inputmode="numeric"
			placeholder="CCV"
			bind:value={security}
			class="after:conten w-19 min-w-0 pr-4 pl-2 text-right outline-none focus:placeholder:text-neutral-900"
		/>
	</div>

	<a
		class="bg-vibrant-blue flex h-[2.8rem] w-full items-center justify-center rounded-[0.9rem] border-none px-3 text-[1.1rem] font-medium text-blue-50"
		href="/">Click to Login</a
	>
	<p
		class="flex h-[2.8rem] w-full items-center justify-center rounded-[0.9rem] border-none bg-neutral-200 px-3 font-mono text-[0.9rem] text-zinc-600"
	>
		951-028
	</p>

	<div class="h-12"></div>

	<div class="relative flex h-6 w-full flex-col items-center"></div>
</div>
