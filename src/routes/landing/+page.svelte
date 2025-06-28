<script>
	import { onMount, onDestroy } from 'svelte'
	import SunShader from './sun-shader.svelte'
	import SunCalc from 'suncalc'

	// Values passed to shader
	let sunHeight = $state(0.3) // height (distance to horizon)
	let sunAngle = $state(0.3) // angle (rotation)

	// Preset location - Grace & Foushee in Richmond, VA
	const latitude = 37.544674
	const longitude = -77.442584

	const REFRESH_FREQ = 60 * 1000 // one minute

	let datetime = $state(new Date())

	// Manually override the time (for test purposes)
	let setTime = $state(null)

	$effect(() => {
		if (setTime) {
			const newDate = new Date()
			newDate.setHours(setTime, 0, 0, 0)
			datetime = newDate
		} else {
			datetime = new Date()
		}
	})

	let formattedDate = $derived.by(() => {
		return datetime.toLocaleString('en-US', {
			timezone: 'America/New_York',
			weekday: 'long',
			month: 'short',
			day: 'numeric'
		})
	})

	let formattedTime = $derived.by(() => {
		return datetime.toLocaleString('en-US', {
			timezone: 'America/New_York',
			hour: 'numeric',
			minute: '2-digit'
		})
	})

	// Uses suncalc package to get the altitude and azimuth based on the current date-time
	let sun = $derived.by(() => {
		const calc = SunCalc.getPosition(datetime, latitude, longitude)

		return {
			altitude: calc.altitude * (180 / Math.PI),
			azimuth: calc.azimuth * (180 / Math.PI),
			altitudeRaw: calc.altitude,
			azimuthRaw: calc.azimuth
		}
	})

	// Calculate the sun progress / sun height based on altitude and azimuth
	// Mapping sunrise to 0 and sunset to 1
	$effect(() => {
		if (sun.altitude != null && sun.azimuthRaw != null) {
			if (sun.altitude <= 0) {
				sunHeight = sun.azimuth < 0 ? 1 : 0
			} else {
				const t = Math.min(sun.altitude, 90) / 90

				if (sun.azimuth < 0) {
					sunHeight = 1 - t * 0.5
				} else {
					sunHeight = t * 0.5
				}
			}
		}
	})

	// Map azimuth to the shader sun angle
	// Azimuth: 0 is south, measured from south to west
	// Convert to our east-west range where 0.5 is south
	// $effect(() => {
	// 	if (sun.azimuth != null) {
	// 		const azimuthDegrees = sun.azimuthRaw * (180 / Math.PI)
	// 		// Map azimuth so that: east (-90°) = 0, south (0°) = 0.5, west (90°) = 1
	// 		sunAngle = 0.5 + azimuthDegrees / 180
	// 	}
	// })

	// Variable to hold the interval
	let updateTimeInterval = $state(null)

	// Update the time every minute
	onMount(() => {
		updateTimeInterval = setInterval(() => {
			if (!setTime) {
				datetime = new Date()
			}
		}, REFRESH_FREQ)
	})

	// Cleanup interval when unmounted
	onDestroy(() => {
		if (updateTimeInterval) {
			clearInterval(updateTimeInterval)
		}
	})
</script>

<div class="min-h-screen bg-black p-4 font-sans text-white">
	<div class="mx-auto mb-6 max-w-2xl">
		<div class="rounded-2xl bg-white/10 p-6 backdrop-blur-md">
			<div class="mb-4">
				<h2 class="text-[1.4rem] font-bold tracking-tight opacity-85">{formattedDate}</h2>
				<h2 class="text-[2.8rem] font-extrabold tracking-tight opacity-85">{formattedTime}</h2>
			</div>

			{#if sun}
				<div class="mb-4 grid grid-cols-1 gap-4 rounded-2xl bg-white/5 p-4 md:grid-cols-2">
					<div class="space-y-1 text-sm">
						<div>
							<span class="font-medium">Altitude:</span>
							{sun.altitude.toFixed(1)}°
						</div>
						<div>
							<span class="font-medium">Azimuth:</span>
							{sun.azimuth.toFixed(1)}°
						</div>
					</div>
					<div class="space-y-1 text-sm">
						<div><span class="font-medium">Sun Height:</span> {sunHeight.toFixed(3)}</div>
						<div><span class="font-medium">Sun Angle:</span> {sunAngle.toFixed(3)}</div>
					</div>

					<button
						onclick={() => {
							datetime = new Date()
						}}
						class="rounded-2xl bg-gradient-to-b from-green-500 to-emerald-600 px-6 py-2 font-semibold text-green-100 transition-all hover:text-white active:scale-95"
					>
						Refresh Sun Position
					</button>
				</div>
			{/if}

			<div class="flex flex-col items-center space-y-4">
				<div class="w-full rounded-lg bg-white/5 p-4">
					<input type="text" bind:value={setTime} />
				</div>
			</div>
		</div>
	</div>

	<!-- Pass calculated values to the shader component -->
	<div class="flex justify-center">
		<SunShader {sunHeight} {sunAngle} showControls={false} />
	</div>
</div>
