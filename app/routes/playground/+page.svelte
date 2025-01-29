<script>
	import LoadingSkeleton from '$ui/feedback/suspense-skeleton.svelte'
	import SuspenseSpinner from '$ui/feedback/suspense-spinner.svelte'
	import SuspenseTextShimmer from '$ui/feedback/suspense-text-shimmer.svelte'
	import ProgressRadial from '$ui/feedback/progress-radial.svelte'
	import LoadingSpinner from '$ui/feedback/loading-spinner.svelte'
	import SupsenseBar from '$ui/feedback/suspense-bar.svelte'
	import ProgressBar from '$ui/feedback/progress-bar.svelte'
</script>

<div class="flex flex-col items-center gap-2">
	<SuspenseTextShimmer class="text-lg font-medium">Logging you in...</SuspenseTextShimmer>
	<LoadingSkeleton class="" />
	<ProgressRadial totalTime={60} currentTime={5} />
	<SuspenseSpinner />
	<LoadingSpinner percent={70} />
	<SupsenseBar />
	<ProgressBar percent={80} />
</div>
