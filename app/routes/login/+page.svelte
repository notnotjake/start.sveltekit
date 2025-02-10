<script lang="ts">
	import type { PageData } from './$types'
	import { fade } from 'svelte/transition'
	import { createClass } from '$utils/create-class'
	import { Suspense, Progress } from '$ui/feedback'
	import PasswordInput from '$ui/auth/password-input.svelte'
	import PasskeyButton from '$ui/auth/passkey-button.svelte'
	import OAuth from '$ui/auth/oauth.svelte'
	import MagicLinkMessage from '$ui/auth/magic-link-message.svelte'
	import Arrow from '$lib/theme/icons/arrow-circle-fill.svelte'

	import Divider from '$ui/divider.svelte'

	let identifier = $state('')
	let editIdentity = $state(false)
	const continueButton = () => {
		console.log(identifier)
	}

	let error = $state(false)
	let next = $state(false)
	let buttonElement = $state()
	let buttonElementWidth = $state(0)

	function handleNext() {
		buttonElementWidth = buttonElement?.offsetWidth || 0
		next = !next
	}
	function handleError() {
		error = !error
		buttonElementWidth = buttonElement?.offsetWidth || 0
	}

	let showBackButton = $state(false)
</script>

<div
	class={createClass(
		'group focus-within:shadow-input-pop relative flex h-11 h-[2.8rem] w-full items-center overflow-hidden rounded-[0.9rem] ring-1 ring-neutral-200',
		next ? 'bg-none' : 'bg-neutral-100 ring-1 ring-neutral-200'
	)}
>
	<input
		type="text"
		placeholder="Continue with email"
		autocomplete="email"
		name="email"
		id="email"
		aria-label="Enter your email"
		bind:value={identifier}
		onfocusin={() => {
			next = false
		}}
		class={createClass(
			'h-full w-full flex-grow-1 pl-4 font-[450] text-zinc-900 transition-all outline-none selection:bg-sky-200 selection:text-blue-600 placeholder:font-normal placeholder:text-neutral-500',
			next ? 'cursor-pointer bg-none pr-4 text-center' : 'pr-1'
		)}
	/>

	{#if next}
		<div
			in:fade={{ duration: 150, delay: 500 }}
			class="pointer-events-none absolute flex h-full w-full cursor-pointer items-center justify-center bg-neutral-200 opacity-0 transition-all duration-300 group-hover:opacity-100"
		>
			<div
				class="flex items-center justify-center rounded-full bg-neutral-50 px-1 py-1 inset-ring-[1px] shadow-xs inset-ring-neutral-300/80"
			>
				<Arrow class="mr-1 h-5 w-5 rotate-180 p-[0.1rem] text-neutral-400" />
				<p class="pr-2 text-sm font-medium">Go Back to Options</p>
			</div>
		</div>
	{/if}

	<button
		onclick={handleNext}
		bind:this={buttonElement}
		aria-label="Continue"
		class="group flex h-full shrink-0 flex-nowrap items-center justify-end px-1 transition-all duration-200"
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
			<Arrow
				class="bi bi-arrow-right-circle-fill mr-1 h-6 w-6 cursor-pointer p-[0.1rem] text-[#0E8CFF] transition-colors duration-300 ease-in-out group-disabled:text-neutral-500/80"
			/>
		{/if}
	</button>
</div>

<div class="min-h-24">
	{#if next}
		<MagicLinkMessage />
	{/if}
</div>

<Divider text={'Or Continue With'} isCollapsed={next} />

{#if next}
	<div class="flex w-full flex-col flex-nowrap gap-2">
		<PasswordInput />
		<PasskeyButton />
	</div>
{:else}
	<OAuth />
{/if}

<div
	class=" shadow-box absolute top-1 left-5 my-4 flex hidden h-40 w-70 items-center justify-evenly rounded-[1.1rem] bg-white ring-1 ring-neutral-200/70"
>
	<button onclick={handleNext} class="cursor-pointer font-medium text-blue-500">Next</button>
	<button onclick={handleError} class="cursor-pointer font-medium text-blue-500">Error</button>
</div>
