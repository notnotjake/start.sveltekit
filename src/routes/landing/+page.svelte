<script>
	import { onMount, onDestroy } from 'svelte'
	import SunShader from './sun-shader.svelte'
	import SunCalc from 'suncalc'

	// ===============================================================================
	// Time

	let datetime = $state(new Date())
	let setTime = $state(null) // Manually override time

	$effect(() => {
		if (setTime) {
			const newDate = new Date()
			newDate.setHours(setTime, 0, 0, 0)
			datetime = newDate
		} else {
			datetime = new Date()
		}
	})

	let formattedDate = $derived(
		datetime.toLocaleString('en-US', {
			timezone: 'America/New_York',
			weekday: 'long',
			month: 'short',
			day: 'numeric'
		})
	)

	let formattedTime = $derived(
		datetime.toLocaleString('en-US', {
			timezone: 'America/New_York',
			hour: 'numeric',
			minute: '2-digit'
		})
	)

	function updateTime() {
		if (setTime != null) return
		datetime = new Date()
	}

	let timers = $state({ alignment: null, interval: null })

	// Update the time every minute
	onMount(() => {
		updateTime()

		const msToNextMinute = 60 * 1000 - (now.getSeconds() * 1000 + now.getMilliseconds()) + 100

		timers.alignment = setTimeout(() => {
			updateTime()
			timers.interval = setInterval(updateTime, 60 * 1000)
		}, msToNextMinute)
	})

	// Cleanup interval when unmounted
	onDestroy(() => {
		clearInterval(timers.interval)
		clearTimeout(timers.alignment)
	})

	// ===============================================================================
	// Sun calculations

	// Values passed to shader
	let sunHeight = $state(0.3) // height (distance to horizon)
	let sunAngle = $state(0.3) // angle (rotation)

	// Location used for sun data
	const geo = {
		// Preset location - Grace & Foushee in Richmond, VA
		lat: 7.544674,
		long: -77.442584
	}

	// Uses suncalc package to get the altitude and azimuth based on the current date-time
	let sun = $derived.by(() => {
		const calc = SunCalc.getPosition(datetime, geo.lat, geo.long)

		return {
			altitude: calc.altitude * (180 / Math.PI),
			azimuth: calc.azimuth * (180 / Math.PI)
		}
	})

	// Calculate the sun height value based on altitude and azimuth
	$effect(() => {
		if (sun.altitude == null || sun.azimuth == null) return

		const isNegativeAzimuth = sun.azimuth < 0
		const normalizedAltitude = Math.min(sun.altitude, 90) / 90

		if (sun.altitude < 0) {
			sunHeight = isNegativeAzimuth ? 1 : 0
		} else {
			sunHeight = isNegativeAzimuth ? 1 - normalizedAltitude * 0.5 : normalizedAltitude * 0.5
		}
	})
</script>

<div class="min-h-screen bg-black p-4 font-sans text-white">
	<div class="mx-auto mb-6 max-w-2xl">
		<div class="rounded-2xl bg-white/10 p-6 backdrop-blur-md">
			<div class="mb-4">
				<h2 class="text-[1.4rem] font-bold tracking-tight opacity-85">{formattedDate}</h2>
				<h2 class="text-[2.8rem] font-extrabold tracking-tight opacity-85">
					{formattedTime}
				</h2>
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

	<div class="relative flex justify-center">
		<SunShader {sunHeight} {sunAngle} showControls={false} />

		<div
			class="absolute inset-0 flex h-full w-full items-end justify-center pb-[28%] mix-blend-overlay"
		>
			<p class="text-[1.8rem] font-semibold">Good Afternoon!</p>
		</div>

		<div
			class="absolute inset-0 flex h-full w-full items-end justify-center pb-[20%] mix-blend-overlay"
		>
			<h2 class="z-index-20 text-[5rem] font-extrabold tracking-tight opacity-85">
				{formattedTime}
			</h2>
		</div>
		<div
			class="absolute inset-0 flex h-full w-full items-end justify-center pb-[20%] mix-blend-soft-light"
		>
			<h2 class="z-index-20 text-[5rem] font-extrabold tracking-tight opacity-90">
				{formattedTime}
			</h2>
		</div>
	</div>
</div>
