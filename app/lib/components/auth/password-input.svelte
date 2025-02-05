<script lang="ts">
	import { createClass } from '$utils/create-class'
	let isInput = $state(false)
</script>

<div class="relative flex w-full shrink-1 grow basis-1 flex-col items-center">
	<input
		type="password"
		placeholder="Password"
		aria-label="Enter account password"
		class={createClass(
			'focus:shadow-input-pop h-[2.8rem] w-full rounded-[0.9rem] border-none pr-11 pl-4 font-[450] text-zinc-900 transition-all outline-none selection:bg-sky-200 selection:text-blue-600 placeholder:font-normal placeholder:text-neutral-500',
			isInput ? 'bg-neutral-50 ring-1 ring-neutral-200' : 'bg-neutral-150 cursor-pointer'
		)}
		onclick={(isInput = true)}
		onfocus={(isInput = true)}
	/>
	{#if !isInput}
		<button
			type="button"
			onclick={(isInput = true)}
			class={createClass(
				'bg-neutral-150 pointer-events-none absolute top-0 left-0 m-auto flex h-11 w-full max-w-full cursor-pointer items-center justify-center rounded-[0.9rem] border-none px-4 text-zinc-900 outline-none',
				isInput ? 'hidden' : 'absolute cursor-pointer'
			)}>Continue with Password</button
		>
	{/if}
</div>
