<script lang="ts">
	import FluidButton from '$ui/fluid-button.svelte'
</script>

<p></p>

<div class="flex items-center gap-[0.45rem] rounded-full bg-neutral-900 px-[0.4rem] py-[0.4rem]">
	<div
		class="w-fit cursor-pointer rounded-full bg-none px-4 py-1.5 text-[0.92rem] font-medium text-neutral-100 inset-ring-1 inset-ring-neutral-500/50"
	>
		Share
	</div>
	<div
		class="w-fit cursor-pointer rounded-full bg-neutral-600 px-4 py-1.5 text-[0.92rem] font-medium text-neutral-100 inset-ring-1 inset-ring-neutral-500/50"
	>
		Share
	</div>
	<div
		class="w-fit cursor-pointer rounded-full bg-neutral-600 px-4 py-1.5 text-[0.92rem] font-medium text-neutral-100"
	>
		Copy
	</div>
	<!-- <div
		class="w-fit cursor-pointer rounded-full bg-neutral-50 px-4 py-1.5 text-[0.92rem] font-medium text-neutral-800"
	>
		Save
	</div> -->
	<FluidButton />
</div>
