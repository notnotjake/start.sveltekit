<script lang="ts">
	import { createClass } from '$utils/create-class'

	let value = $state()
	let errors = $state()
</script>

<div
	class="group focus-within:shadow-input-pop relative flex flex h-11 h-[2.8rem] w-full items-center overflow-hidden rounded-[0.9rem] bg-neutral-100 ring-1 ring-neutral-200"
>
	<input
		type="text"
		placeholder="Continue with email"
		bind:value
		aria-label="Enter your email or phone"
		class={createClass(
			'h-full w-full flex-grow-1 pr-2 pl-4 font-[450] text-zinc-900 transition-all outline-none selection:bg-sky-200 selection:text-blue-600 placeholder:font-normal placeholder:text-neutral-500',
			next ? 'bg-none text-center' : ''
		)}
	/>

	<button
		onclick={handleNext}
		bind:this={buttonElement}
		aria-label="Continue"
		class="group flex h-full shrink-0 flex-nowrap items-center justify-end px-2 transition-all duration-200"
		style:margin-right={next ? `-${buttonElementWidth}px` : '0px'}
		class:cursor-[w-resize]={error}
		class:cursor-pointer={!error}
	>
		{#if error}
			<p
				aria-label="Continue"
				class="animate-fade-in-scale-right cursor-[w-resize] rounded-full bg-rose-100 px-3 py-1 text-[0.92rem] font-medium text-rose-600"
			>
				Email Invalid
			</p>
		{:else}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="currentColor"
				class="bi bi-arrow-right-circle-fill mr-1 h-6 w-6 cursor-pointer p-[0.1rem] text-[#0E8CFF] transition-colors duration-300 ease-in-out group-disabled:text-neutral-500/80"
				viewBox="0 0 16 16"
			>
				<path
					d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"
				/>
			</svg>
		{/if}
	</button>
</div>
