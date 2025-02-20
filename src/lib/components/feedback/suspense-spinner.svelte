<script lang="ts">
	type Props = {
		size?: number
		thickness?: number
		percent?: number
		background?: boolean | string
		tint?: string
		gradient?: boolean
		speed?: 'slow' | 'normal' | 'fast'
	}
	let {
		size = 22,
		thickness = 8,
		percent = 70,
		background = false,
		tint = 'var(--color-sky-500)',
		gradient = true,
		speed = 'normal'
	}: Props = $props()

	let backgroundColor = $derived.by(() => {
		if (background === true) {
			return 'var(--color-neutral-200)'
		} else if (background) {
			return `var(${background})`
		} else {
			return 'transparent'
		}
	})

	let arcPath = $derived.by(() => {
		// Constrain percentage between 0 and 100
		const p = Math.min(99.9, Math.max(0, percent))

		// Convert percentage to radians (starting from -90° to start at 12 o'clock)
		const startAngle = -Math.PI / 2
		const endAngle = startAngle + (2 * Math.PI * p) / 100

		// Center point
		const cx = 20
		const cy = 20
		const r = 20 - thickness / 2 // radius same as original

		// Calculate start and end points
		const startX = cx + r * Math.cos(startAngle)
		const startY = cy + r * Math.sin(startAngle)
		const endX = cx + r * Math.cos(endAngle)
		const endY = cy + r * Math.sin(endAngle)

		// Determine if we need to use the large arc flag
		const largeArcFlag = p > 50 ? 1 : 0

		// Create the SVG arc path
		return `M ${startX} ${startY} A ${r} ${r} 0 ${largeArcFlag} 1 ${endX} ${endY}`
	})

	let duration = $derived.by(() => {
		switch (speed) {
			case 'fast':
				return '0.6s'
			case 'normal':
				return '1.4s'
			case 'slow':
				return '2.0s'
			default:
				return '1.4s'
		}
	})
</script>

<div class="inline-block" style="width: {size}px; height: {size}px;">
	<svg viewBox="0 0 40 40">
		<defs>
			<linearGradient id="gradient" gradientUnits="userSpaceOnUse" gradientTransform="rotate(120)">
				<stop offset="0%" stop-color={tint} stop-opacity="0" />
				<stop offset="60%" stop-color={tint} stop-opacity="1" />
				<stop offset="100%" stop-color={tint} stop-opacity="1" />
			</linearGradient>
		</defs>
		<circle
			cx="20"
			cy="20"
			r={20 - thickness / 2}
			fill="none"
			stroke={background}
			stroke-width={thickness}
			stroke-linecap="round"
		/>
		<path
			d={arcPath}
			fill="none"
			stroke={gradient ? 'url(#gradient' : tint}
			stroke-width={thickness}
			stroke-linecap="round"
		>
			<animateTransform
				attributeName="transform"
				type="rotate"
				from="0 20 20"
				to="360 20 20"
				dur={duration}
				repeatCount="indefinite"
			/>
		</path>
	</svg>
</div>
