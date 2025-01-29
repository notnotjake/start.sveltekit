<script lang="ts">
	import type { PageData } from './$types'

	import { createClass } from '$utils/create-class'

	import PasswordInput from '$ui/auth/password-input.svelte'
	import PasskeyButton from '$ui/auth/passkey-button.svelte'
	import OAuth from '$ui/auth/oauth.svelte'
	import MagicLinkMessage from '$ui/auth/magic-link-message.svelte'

	import Divider from '$ui/divider.svelte'
	import SkeletonLoader from '$ui/feedback/suspense-skeleton.svelte'
	import Spinner from '$ui/feedback/suspense-spinner.svelte'
	import TextShimmer from '$ui/feedback/suspense-text-shimmer.svelte'

	// export const data: PageData

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
		bind:value={identifier}
		aria-label="Enter your email or phone"
		class={createClass(
			'h-full w-full flex-grow-1 pl-4 font-[450] text-zinc-900 transition-all outline-none selection:bg-sky-200 selection:text-blue-600 placeholder:font-normal placeholder:text-neutral-500',
			next ? 'bg-none pr-4 text-center' : 'pr-1'
		)}
	/>

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
