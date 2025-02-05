<script lang="ts">
	import InputFormatted from './input-formatter.svelte'
	import CursorTest from './cursor.svelte'

	let date = $state()

	let card = $state('')
	let expirationMonth = $state('')
	let expirationYear = $state('')
	let security = $state('')

	let cardTest = $state('')

	let cardInput
	let expirationMonthInput
	let expirationYearInput
	let securityInput

	$effect(() => {
		if (card.length > 5) {
			expirationMonthInput.focus()
			if (expirationMonth.length >= 2) {
				expirationYearInput.focus()
				if (expirationYear.length >= 2) {
					securityInput.focus()
				}
			}
		}
	})
</script>

<div class="mb-2 px-7 py-5">
	<h2 class="tracking-tight-md text-[1.3rem] leading-loose font-[550]">Payment</h2>
	<p class="tracking-tight-lg text-[0.96rem] leading-5 font-[380]">You won't be charged yet</p>
</div>

<div
	class="flex h-full w-full flex-col items-center gap-3 rounded-[calc(1.3rem-0.5rem)] px-3.5 pt-7 pb-3"
>
	<div class="ring-neutral-150 shadow-box rounded-md px-2 py-1 ring-1">
		<CursorTest />
	</div>

	<InputFormatted
		bind:value={cardTest}
		pattern={{ count: 4, token: '-', repeat: '4' }}
		placeholder={'Card •••• •••• ••••'}
	/>

	<div
		class="focus-within:shadow-input-pop flex h-[2.8rem] w-full max-w-full items-center rounded-[0.9rem] border-none bg-neutral-100 font-[450] text-zinc-900 ring-1 ring-neutral-200 transition-all outline-none selection:bg-sky-200 selection:text-blue-600 placeholder:font-normal placeholder:text-neutral-500"
	>
		<input
			type="text"
			bind:this={cardInput}
			bind:value={card}
			placeholder="Card •••• ••••"
			maxlength="16"
			class="min-w-0 pl-4 outline-none focus:placeholder:text-neutral-900"
		/>
		<input
			type="text"
			bind:this={expirationMonthInput}
			bind:value={expirationMonth}
			placeholder="MM"
			maxlength="2"
			class="w-9 px-0 text-right outline-none focus:placeholder:text-neutral-900"
		/>
		<p class="px-0.5 text-neutral-600">/</p>
		<input
			type="text"
			bind:this={expirationYearInput}
			bind:value={expirationYear}
			placeholder="YY"
			maxlength="2"
			class="w-8 px-0 text-left outline-none focus:placeholder:text-neutral-900"
		/>
		<input
			type="text"
			placeholder="CCV"
			bind:this={securityInput}
			bind:value={security}
			maxlength="3"
			class="w-19 min-w-0 pr-4 pl-2 text-right outline-none focus:placeholder:text-neutral-900"
			onfocus={(e) => {
				setTimeout(() => e.target.select(), 0)
			}}
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
