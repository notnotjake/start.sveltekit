<script lang="ts">
	import type { PageData } from './$types'

	import OAuth from '$ui/auth/OAuthOptions.svelte'
	import SkeletonLoader from '$ui/feedback/loading-skeleton.svelte'
	import Spinner from '$ui/feedback/suspense-spinner.svelte'
	import TextShimmer from '$ui/feedback/suspense-text-shimmer.svelte'

	// export const data: PageData

	let identifier = ''
	let editIdentity = false
	let continueButton

	const siteName = 'Luxo Circle'
	const action = 'Start Creating'
	const welcome = 'Connect with others and schedule practice sessions in our vibrant community'
</script>

<a
	class="mx-auto block pt-2 text-center text-base font-medium tracking-tight-md text-black/55 no-underline transition-all duration-300 hover:text-black/85"
	href="/">{siteName}</a
>

<div class="mb-12 mt-20 flex h-full flex-col items-center">
	<div
		class="flex min-h-40 w-[23rem] flex-shrink-0 flex-col rounded-[1.3rem] bg-gradient-to-b from-[hsl(214,100%,96%)] to-[hsl(282,100%,98%)] p-[0.5rem]"
	>
		<div class="mb-2 px-7 py-5">
			<h2 class="text-[1.3rem] font-[550] leading-loose tracking-tight-md">{action}</h2>
			<p class="text-[0.96rem] font-[380] leading-5 tracking-tight-lg">
				{welcome}
			</p>
		</div>

		<div
			class="flex h-full w-full flex-col items-center gap-3 rounded-[calc(1.3rem-0.5rem)] bg-white px-3.5 pb-3 pt-7 shadow-sm"
		>
			<TextShimmer class="my-12 shrink-0">Authenticating with Apple</TextShimmer>
			<button
				type="button"
				class="relative m-auto flex h-11 max-w-full cursor-pointer items-center justify-center gap-1 rounded-full border-none bg-neutral-100 px-5 text-[0.95rem] font-[450] text-zinc-900 outline-none"
				>Try Another Method</button
			>
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
