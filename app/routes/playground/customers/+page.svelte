<script lang="ts">
	import TextShimmer from '$ui/feedback/suspense-text-shimmer.svelte'

	const customer = {
		id: 'LT',
		status: 'good',
		name: 'Luxo Technologies',
		city: 'San Francisco',
		state: 'CA'
	}
</script>

<div class="flex h-full w-full bg-white">
	<div class="h-full min-w-[17rem] bg-neutral-100"></div>

	<div class="mx-auto max-w-[42rem] pt-10">
		<div class="mb-4 flex items-baseline rounded-lg bg-neutral-200/60 px-3 py-1.5">
			<p class="text-[0.9rem] font-medium">New</p>
			<p class="pl-2 text-[0.95rem]">Add new records with automatic imports</p>
			<p class="text-[0.95rem] font-medium text-purple-600">View Generated Imports</p>
		</div>

		<div class="flex bg-white">
			<p>{customer.id}</p>
			<p>{customer.name}</p>
			<p>{customer.city}, {customer.state}</p>
		</div>
	</div>
</div>
