<script lang="ts">
	import { Slider } from 'bits-ui'
	import { Button } from '$ui/input'
	import { createClass } from '$utils/styles'

	let value = $state(50)
	let valueSteps = $state(25)
</script>

<div class="h-30 w-full md:max-w-[280px]">
	<Slider.Root
		type="single"
		bind:value
		class="relative flex w-full touch-none items-center rounded-full bg-neutral-200 select-none"
	>
		{#snippet children()}
			<span
				class="bg-dark-10 relative h-1.5 w-full grow cursor-pointer overflow-hidden rounded-full"
			>
				<Slider.Range class="absolute h-full rounded-full bg-blue-500" />
			</span>
			<Slider.Thumb
				class="block h-5 w-8.5 cursor-pointer rounded-full border border-neutral-300/50 bg-white shadow-md transition-colors hover:border-neutral-300/80 focus:bg-white/20 focus-visible:outline-hidden active:scale-[0.98] active:bg-white/20 disabled:pointer-events-none disabled:opacity-50"
				index={0}
			/>
		{/snippet}
	</Slider.Root>
</div>

<div class="h-40 w-full md:max-w-[280px]">
	<Slider.Root
		type="single"
		bind:value
		class="relative flex h-8 w-full touch-none items-center rounded-xl bg-neutral-200 select-none"
	>
		{#snippet children()}
			<span
				class="bg-dark-10 group relative h-full w-full grow cursor-pointer overflow-hidden rounded-xl inset-shadow-sm"
			>
				<div class={createClass('absolute inset-0 z-10 flex h-full w-full')}>
					<div
						class={createClass(
							'absolute top-0 left-0 flex h-full items-center justify-center px-1.5 transition-all',
							value < 50 ? '-translate-x-full' : 'text-white'
						)}
					>
						<div class="flex h-fit items-baseline">
							<p class="h-full text-[1.1rem] font-semibold">{value}</p>
							<p class="font-medium opacity-90">px</p>
						</div>
					</div>
					<div
						class={createClass(
							'absolute top-0 right-0 flex h-full items-center px-1.5 transition-all',
							value < 50 ? 'text-blue-600' : 'translate-x-full text-white'
						)}
					>
						<div class="flex h-fit items-baseline">
							<p class="h-full text-[1.1rem] font-semibold">{value}</p>
							<p class="font-medium opacity-90">px</p>
						</div>
					</div>
				</div>
				<Slider.Range class="absolute h-full bg-blue-400">
					<div
						class={createClass(
							'absolute top-0 right-0 flex h-full w-fit items-center py-1.5 pr-1',
							value <= 10 ? '-right-5' : 'right-0'
						)}
					>
						<div
							class={createClass(
								'rounded-full bg-black/35 transition-all',
								value >= 95 || value <= 10 ? 'aspect-square w-3' : 'h-full w-[5px]'
							)}
						></div>
					</div>
				</Slider.Range>
			</span>
			<Slider.Thumb
				class="h-full cursor-pointer bg-white/0 transition-colors outline-none hover:bg-blue-500/20"
				index={0}
			/>
		{/snippet}
	</Slider.Root>
</div>

<div class="h-50 w-full md:max-w-[280px]">
	<div class="relative h-14 w-full rounded-full bg-neutral-200 p-2 inset-shadow-sm">
		<div class="absolute inset-0 flex hidden h-full w-full items-center justify-between px-7">
			{@render dot()}
			{@render dot()}
			{@render dot()}
			{@render dot()}
			{@render dot()}
		</div>
		<Slider.Root
			type="single"
			bind:value={valueSteps}
			step={25}
			class="relative flex h-full w-full touch-none items-center select-none"
		>
			{#snippet children()}
				<span
					class="relative h-full w-full grow cursor-pointer overflow-hidden rounded-full bg-transparent"
				>
					<Slider.Range class="absolute h-full bg-transparent" />
				</span>

				<Slider.Thumb
					class={createClass(
						'z-10 aspect-square h-full cursor-pointer rounded-full shadow-lg transition-colors delay-75 outline-none',
						valueSteps === 100 ? 'bg-neutral-700' : 'bg-white'
					)}
					index={0}
				/>

				<Slider.Tick index={0} class="z-0 h-[5px] w-[5px] rounded-full bg-neutral-400/40" />
				<Slider.Tick index={1} class="z-0 h-[5px] w-[5px] rounded-full bg-neutral-400/40" />
				<Slider.Tick index={2} class="z-0 h-[5px] w-[5px] rounded-full bg-neutral-400/40" />
				<Slider.Tick index={3} class="z-0 h-[5px] w-[5px] rounded-full bg-neutral-400/40" />
				<Slider.Tick index={4} class="z-0 h-[5px] w-[5px] rounded-full bg-neutral-400/40" />
			{/snippet}
		</Slider.Root>
	</div>
</div>

<Button
	class={createClass(
		'group z-10 rounded-[1rem] bg-neutral-800 px-5 py-2 text-white transition-all  hover:bg-neutral-800',
		value === 100
			? 'bg-neutral-800 hover:scale-105 hover:-rotate-2 hover:bg-neutral-800'
			: 'bg-neutral-400 hover:translate-y-2 hover:scale-x-95 hover:bg-neutral-400'
	)}
>
	request access
	{#if value !== 100}
		<p
			class="absolute top-0 z-0 text-neutral-500/0 transition-all group-hover:-top-7 group-hover:text-neutral-600"
		>
			sorry, we're maxed out
		</p>
	{/if}
</Button>

{#snippet dot()}
	<div class="h-[5px] w-[5px] rounded-full bg-neutral-400/40"></div>
{/snippet}
