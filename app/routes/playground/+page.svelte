<script>
	import LoadingSkeleton from '$ui/feedback/loading-skeleton.svelte'
	import SuspenseSpinner from '$ui/feedback/suspense-spinner.svelte'
	import SuspenseTextShimmer from '$ui/feedback/suspense-text-shimmer.svelte'
</script>

<SuspenseTextShimmer class="text-lg font-medium">Logging you in...</SuspenseTextShimmer>
<SuspenseSpinner />
<LoadingSkeleton class="" />
