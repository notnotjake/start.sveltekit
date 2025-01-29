<script lang="ts">
	let { size = '22px' } = $props()
</script>

<div class="inline-block" style="width: {size}; height: {size};">
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
