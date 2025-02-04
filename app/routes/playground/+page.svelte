<script>
	import { Suspense } from '$ui/feedback'
	import { Progress } from '$ui/feedback'
</script>

<div class="flex flex-col items-center gap-2">
	<h2 class="mt-2 text-lg font-medium text-neutral-700">Suspense Components</h2>
	<Suspense.Text speed={0.5} class="text-lg font-medium">Logging you in...</Suspense.Text>
	<Suspense.Skeleton />
	<Suspense.Bar />
	<Suspense.Spinner size={18} thickness={11} />
	<Suspense.Spinner
		background="--color-stone-300"
		tint="--color-neutral-600"
		thickness={11}
		gradient={false}
		percent={25}
		speed="fast"
	/>

	<h2 class="mt-2 text-lg font-medium text-neutral-700">Progress Components</h2>
	<Progress.Ring percent={65} />
	<Progress.Bar
		percent={30}
		tint="var(--color-neutral-600)"
		background="var(--color-neutral-200)"
		class="h-4 w-40"
	/>
	<Progress.Radial totalTime={60} currentTime={5} />
</div>
