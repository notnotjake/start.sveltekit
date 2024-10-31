<script lang="ts">
	import type { PageData } from './$types'

	import OAuth from '$ui/auth/OAuthOptions.svelte'
	import SkeletonLoader from '$ui/skeleton-loader.svelte'
	import Spinner from '$ui/spinner.svelte'
	import TextShimmer from '$ui/text-shimmer.svelte'

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
			<div class="relative flex h-11 w-full flex-col items-center">
				<input
					type="text"
					placeholder="Password"
					aria-label="Enter account password for {identifier}"
					class="absolute left-0 top-0 h-[2.8rem] w-full rounded-[0.9rem] border-none bg-neutral-200/60 pl-4 pr-11 font-[450] text-zinc-900 shadow-inner-xs outline-none transition-all selection:bg-sky-200 selection:text-blue-600 placeholder:font-normal placeholder:text-neutral-500 focus:shadow-input-pop"
				/>
			</div>

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
							class="relative m-auto flex h-11 w-full max-w-full cursor-pointer items-center justify-center rounded-[0.9rem] border-none bg-neutral-200/60 px-4 text-zinc-900 outline-none"
							>Sign in with Passkey</button
						>
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
