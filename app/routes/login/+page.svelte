<script lang="ts">
	import type { PageData } from './$types'

	import OAuth from '$ui/auth/OAuthOptions.svelte'
	import SkeletonLoader from '$ui/feedback/loading-skeleton.svelte'
	import Spinner from '$ui/feedback/suspense-spinner.svelte'
	import TextShimmer from '$ui/feedback/suspense-text-shimmer.svelte'

	// export const data: PageData

	let identifier = ''
	let editIdentity = false
	const continueButton = () => {
		console.log(identifier)
	}

	const siteName = 'Luxo Circle'
	const action = 'Start Creating'
	const welcome = 'Connect with others and schedule practice sessions in our vibrant community'

	const error = false
</script>

<a
	class="tracking-tight-md mx-auto block pt-2 text-center text-base font-medium text-black/55 no-underline transition-all duration-300 hover:text-black/85"
	href="/">{siteName}</a
>

<div class="mt-20 mb-12 flex h-full flex-col items-center">
	<div
		class="flex min-h-40 w-[23rem] flex-shrink-0 flex-col rounded-[1.3rem] bg-gradient-to-b from-[hsl(214,100%,96%)] to-[hsl(282,100%,98%)] p-[0.5rem]"
	>
		<div class="mb-2 px-7 py-5">
			<h2 class="tracking-tight-md text-[1.3rem] leading-loose font-[550]">{action}</h2>
			<p class="tracking-tight-lg text-[0.96rem] leading-5 font-[380]">
				{welcome}
			</p>
		</div>

		<div
			class="flex h-full w-full flex-col items-center gap-3 rounded-[calc(1.3rem-0.5rem)] bg-white px-3.5 pt-7 pb-3 shadow-sm"
		>
			<!-- -->
			<div class="relative flex h-11 w-full flex-col items-center">
				<input
					type="text"
					placeholder="Continue with email"
					bind:value={identifier}
					aria-label="Enter your email or phone"
					class="shadow-inner-xs focus:shadow-input-pop absolute top-0 left-0 h-[2.8rem] w-full rounded-[0.9rem] border-none bg-neutral-200/60 pr-11 pl-4 font-[450] text-zinc-900 transition-all outline-none selection:bg-sky-200 selection:text-blue-600 placeholder:font-normal placeholder:text-neutral-500"
				/>

				<button
					onclick={continueButton}
					aria-label="Continue"
					class="disabled: group absolute top-0 right-0 flex h-full w-fit items-center justify-end rounded-2xl px-2"
					class:cursor-[w-resize]={error}
					class:cursor-pointer={!error}
				>
					{#if error}
						<p
							aria-label="Continue"
							class="cursor-[w-resize] rounded-full bg-rose-200 px-3 py-1 text-[0.92rem] font-medium text-rose-600"
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
			<!-- -->
			<div class="h-12"></div>
			<!-- -->
			<OAuth />
		</div>
	</div>
</div>

<div class="mx-auto mb-6 flex w-fit flex-row gap-8 rounded-full bg-[hsla(0,0%,97%,1)] px-6 py-3">
	<a
		href="/help"
		class="text-[0.95rem] tracking-tighter text-slate-800 hover:text-black hover:underline">Help</a
	>
	<a
		href="/privacy"
		class="text-[0.95rem] tracking-tighter text-slate-800 hover:text-black hover:underline"
		>Privacy</a
	>
</div>
