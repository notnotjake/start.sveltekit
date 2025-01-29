<script lang="ts">
	let { size = '22px', percent = 22 } = $props()

	let arcPath = $derived.by(() => {
		// Constrain percentage between 0 and 100
		const p = Math.min(100, Math.max(0, percent))

		// Convert percentage to radians (starting from -90° to start at 12 o'clock)
		const startAngle = -Math.PI / 2
		const endAngle = startAngle + (2 * Math.PI * p) / 100

		// Center point
		const cx = 20
		const cy = 20
		const r = 16 // radius same as original

		// Calculate start and end points
		const startX = cx + r * Math.cos(startAngle)
		const startY = cy + r * Math.sin(startAngle)
		const endX = cx + r * Math.cos(endAngle)
		const endY = cy + r * Math.sin(endAngle)

		// Determine if we need to use the large arc flag
		const largeArcFlag = p > 50 ? 1 : 0

		if (Math.abs(p - 100) < 0.01) {
			return `M 36 20 A 16 16 0 1 1 4 20 A 16 16 0 1 1 36 20`
		}

		// Create the SVG arc path
		return `M ${startX} ${startY} A ${r} ${r} 0 ${largeArcFlag} 1 ${endX} ${endY}`
	})
</script>

<div class="inline-block" style="width: {size}; height: {size};">
	<svg viewBox="0 0 40 40">
		<path
			d={arcPath}
			fill="none"
			stroke="rgba(0, 165, 255, 1)"
			stroke-width="8"
			stroke-linecap="round"
		/>
	</svg>
</div>
