<script>
	import Item from './item.svelte'
	import Group from './group.svelte'
	import FluidButton from '$ui/fluid-button.svelte'
	import { Suspense, Progress } from '$ui/feedback'
</script>

<Item title="Fluid Button" description="Dynamically resizing button with state animations">
	<FluidButton />
</Item>

<Group
	name="Suspense"
	description="Suspense gives feedback to users without showing an exact progress amount. (It is indeterminate)"
/>

<Item title="Shimmer Text" description="Nice">
	<Suspense.Text speed={0.2} spread={8} class="text-lg font-medium">Logging you in...</Suspense.Text
	>
</Item>

<Item title="Skeleton" description="Nice">
	<Suspense.Skeleton />
</Item>

<Item title="Bar" description="Nice">
	<Suspense.Bar />
</Item>

<Item title="Spinner" description="Nice">
	<Suspense.Spinner size={18} thickness={11} />
	<Suspense.Spinner
		background="var(--color-stone-300)"
		tint="var(--color-neutral-600)"
		thickness={11}
		gradient={false}
		percent={25}
		speed="fast"
	/>
</Item>

<Group name="Progress" description="Gives feedback with determinate state" />

<Item title="Spinner" description="Nice">
	<Progress.Ring percent={70} gradient={true} thickness={10} />
</Item>

<Item title="Bar" description="Nice">
	<Progress.Bar
		tint="var(--color-neutral-600)"
		background="var(--color-neutral-200)"
		class="h-4 w-40"
	/>
</Item>

<Item title="Radial" description="Nice">
	<Progress.Radial totalTime={60} currentTime={5} />
</Item>
