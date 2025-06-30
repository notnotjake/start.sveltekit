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

		const now = new Date()
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
	<div class="fixed inset-7 z-100">
		<input
			type="text"
			class="rounded-xl bg-white/10 px-3 py-1 text-lg"
			placeholder="Override Time"
			bind:value={setTime}
		/>
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
