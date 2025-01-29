<script lang="ts">
	import InputFormatter from './input-formatter.svelte'

	let date = $state()
</script>

<div
	class="flex h-full w-full flex-shrink-0 flex-col items-center justify-center overflow-scroll bg-neutral-100"
>
	<a
		class="tracking-tight-md mx-auto block pt-2 text-center text-base font-medium text-black/55 no-underline transition-all duration-300 hover:text-black/85"
		href="/">Art Fellowship</a
	>

	<div class="mt-14 mb-12 flex h-full flex-col items-center">
		<div
			class="flex min-h-40 w-[23rem] flex-shrink-0 flex-col rounded-[1.3rem] bg-white p-[0.5rem]"
		>
			<div class="mb-2 px-7 py-5">
				<h2 class="tracking-tight-md text-[1.3rem] leading-loose font-[550]">Payment</h2>
				<p class="tracking-tight-lg text-[0.96rem] leading-5 font-[380]">
					You won't be charged yet
				</p>
			</div>

			<div
				class="flex h-full w-full flex-col items-center gap-3 rounded-[calc(1.3rem-0.5rem)] px-3.5 pt-7 pb-3"
			>
				<InputFormatter
					bind:value={date}
					pattern={{ count: 2, token: '/', repeat: 2 }}
					placeholder="MM/YY"
				/>

				<div
					class="focus-within:shadow-input-pop flex h-[2.8rem] w-full max-w-full rounded-[0.9rem] border-none bg-neutral-100 font-[450] text-zinc-900 ring-1 ring-neutral-200 transition-all outline-none selection:bg-sky-200 selection:text-blue-600 placeholder:font-normal placeholder:text-neutral-500"
				>
					<input
						type="text"
						placeholder="Card •••• ••••"
						class="min-w-0 pl-4 outline-none focus:placeholder:text-neutral-900"
					/>
					<input
						type="text"
						placeholder="MM/YY"
						class="w-20 min-w-0 px-0 text-right outline-none focus:placeholder:text-neutral-900"
					/>
					<input
						type="text"
						placeholder="CCV"
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
		</div>
	</div>
</div>
