<!-- <script lang="ts">
</script>

<div
	class="relative flex h-6 min-w-14 items-center justify-center overflow-hidden rounded-full bg-gray-200 px-3 py-1 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.9s_ease-out_infinite] before:bg-gradient-to-r before:from-transparent before:via-slate-100/70 before:to-transparent"
></div> -->
<script>
	export let size = '22px'
</script>

<div class="spinner" style="width: {size}; height: {size};">
	<svg viewBox="0 0 40 40">
		<defs>
			<linearGradient
				id="spinnerGradient"
				gradientUnits="userSpaceOnUse"
				gradientTransform="rotate(120)"
			>
				<stop offset="0%" stop-color="rgba(0, 165, 255, 0)" />
				<stop offset="60%" stop-color="rgba(0, 165, 255, 1)" />
				<stop offset="100%" stop-color="rgba(0, 165, 255, 1)" />
			</linearGradient>
		</defs>
		<path
			d="M 36 20 A 16 16 0 0 1 4 20"
			fill="none"
			stroke="url(#spinnerGradient)"
			stroke-width="8"
			stroke-linecap="round"
		>
			<animateTransform
				attributeName="transform"
				type="rotate"
				from="0 20 20"
				to="360 20 20"
				dur="1.3s"
				repeatCount="indefinite"
			/>
		</path>
	</svg>
</div>

<style>
	.spinner {
		display: inline-block;
	}
</style>
