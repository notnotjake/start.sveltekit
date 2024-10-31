<script lang="ts">
	import OAuth from '$ui/auth/OAuthOptions.svelte'

	import TextShimmer from '$ui/text-shimmer.svelte'
	import Spinner from '$ui/spinner.svelte'

	import type { PageData } from './$types'
	import SkeletonLoader from '$ui/skeleton-loader.svelte'

	// export const data: PageData

	let identifier = 'jake@notnotjake.com'
	let editIdentity = false
	let continueButton
</script>

<a
	class="mx-auto block pt-2 text-center text-base font-medium tracking-tight-md text-black/55 no-underline transition-all duration-300 hover:text-black/85"
	href="/">Art Fellowship</a
>

<div class="mb-12 mt-20 flex h-full flex-col items-center">
	<div
		class="flex min-h-40 w-[23rem] flex-shrink-0 flex-col rounded-[1.3rem] bg-gradient-to-b from-[hsl(214,100%,96%)] to-[hsl(282,100%,98%)] p-[0.5rem]"
	>
		<div class="mb-2 px-7 py-5">
			<h2 class="text-[1.3rem] font-[550] leading-loose tracking-tight-md">Start Practicing</h2>
			<p class="text-[0.96rem] font-[380] leading-5 tracking-tight-lg">
				Connect with others and schedule Art Fellowship practice with the community
			</p>
		</div>

		<div
			class="flex h-full w-full flex-col items-center gap-3 rounded-[calc(1.3rem-0.5rem)] bg-white px-3.5 pb-3 pt-7 shadow-sm"
		>
			<!-- -->
			<div class="relative flex h-11 w-full flex-col items-center">
				<input
					type="text"
					placeholder="Email or Phone"
					bind:value={identifier}
					onfocus={editIdentity}
					aria-label="Enter your email or phone"
					class="absolute left-0 top-0 h-[2.8rem] w-full rounded-[0.9rem] border-none bg-neutral-200/40 pl-4 pr-11 text-center font-[450] text-zinc-900 outline-none transition-all selection:bg-sky-200 selection:text-blue-600 placeholder:font-normal placeholder:text-neutral-500 focus:shadow-input-pop"
				/>
				<button
					disabled="true"
					onclick={continueButton}
					aria-label="Continue"
					class="group absolute right-0 top-0 h-full w-fit translate-x-full rounded-2xl bg-slate-800 pr-3 opacity-0"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						class="bi bi-arrow-right-circle-fill relative h-6 w-6 cursor-pointer p-[0.1rem] text-[hsl(211,100%,58%)] group-disabled:text-neutral-500/80"
						viewBox="0 0 16 16"
					>
						<path
							d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"
						/>
					</svg>
				</button>
			</div>
			<!-- -->
			<!-- <TextShimmer class="text-lg font-medium">Logging you in...</TextShimmer> -->
			<div class="w-full pt-5">
				<p class="w-full text-center tracking-tight-md">A login link has been sent to your email</p>
				<p class="pt-2 text-center text-[0.93rem] font-[350] tracking-tight-sm text-neutral-800">
					Haven't received it? Try Resending
				</p>
			</div>
			<!-- <Spinner /> -->
			<div class="h-12"></div>
			<!-- -->
			<div class="w-full">
				<div class="providers flex w-full flex-col flex-nowrap gap-2">
					<div class="w-ful mb-4 h-[1px] w-full rounded-full bg-neutral-200"></div>

					<div class="shrink-1 relative flex w-full grow basis-1 flex-col items-center">
						<button
							type="button"
							class="relative m-auto flex h-11 w-full max-w-full cursor-pointer items-center justify-center rounded-[0.9rem] border-none bg-neutral-200/60 px-4 text-zinc-900 outline-none"
							>Continue with Password</button
						>
					</div>
					<div class="shrink-1 relative flex w-full grow basis-1 flex-col items-center">
						<button
							type="button"
							class="relative m-auto flex h-11 w-full max-w-full cursor-pointer items-center justify-center gap-2 rounded-[0.9rem] border-none bg-neutral-200/60 px-4 text-zinc-900 outline-none"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="1em"
								height="1em"
								viewBox="0 0 24 24"
								{...$$props}
							>
								<path
									fill="currentColor"
									d="M9.496 2a5.25 5.25 0 0 0-2.519 9.857A9.01 9.01 0 0 0 .5 20.228a.75.75 0 0 0 .728.772h5.257q5.008.002 10.015 0a.5.5 0 0 0 .5-.5v-4.669a.95.95 0 0 0-.171-.551a9.02 9.02 0 0 0-4.814-3.423A5.25 5.25 0 0 0 9.496 2"
								/>
								<path
									fill="currentColor"
									d="M23.625 10.313c0 1.31-.672 2.464-1.691 3.134a.4.4 0 0 0-.184.33v.886a.37.37 0 0 1-.11.265l-.534.534a.19.19 0 0 0 0 .265l.534.534c.071.07.11.166.11.265v.347a.37.37 0 0 1-.11.265l-.534.534a.19.19 0 0 0 0 .265l.534.534a.37.37 0 0 1 .11.265v.431a.38.38 0 0 1-.097.253l-1.2 1.319a.78.78 0 0 1-1.156 0l-1.2-1.319a.38.38 0 0 1-.097-.253v-5.39a.4.4 0 0 0-.184-.33a3.75 3.75 0 1 1 5.809-3.134M21 9.75a1.125 1.125 0 1 0-2.25 0a1.125 1.125 0 0 0 2.25 0"
								/>
							</svg>
							Sign in with Passkey
						</button>
					</div>
				</div>
			</div>
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
