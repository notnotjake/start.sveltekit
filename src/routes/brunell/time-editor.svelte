<script>
	let editingTime = $state(null) // 'start' or 'end'
	let isDragging = $state(false)
	let dragStartX = $state(0)
	let initialMinutes = $state(0)

	let startTime = $state({ hours: 8, minutes: 15, period: 'AM' })
	let endTime = $state({ hours: 3, minutes: 20, period: 'PM' })

	function formatTime(time) {
		const hours = time.hours === 0 ? 12 : time.hours > 12 ? time.hours - 12 : time.hours
		const minutes = time.minutes.toString().padStart(2, '0')
		return `${hours}:${minutes}`
	}

	function timeToMinutes(time) {
		let hours = time.hours
		if (time.period === 'AM' && hours === 12) hours = 0
		if (time.period === 'PM' && hours !== 12) hours += 12
		return hours * 60 + time.minutes
	}

	function minutesToTime(totalMinutes) {
		// Keep within 24 hour bounds
		totalMinutes = Math.max(0, Math.min(1439, totalMinutes)) // 0 to 23:59

		const hours24 = Math.floor(totalMinutes / 60)
		const minutes = totalMinutes % 60

		let hours12 = hours24
		let period = 'AM'

		if (hours24 >= 12) {
			period = 'PM'
			if (hours24 > 12) hours12 = hours24 - 12
		}
		if (hours24 === 0) hours12 = 12

		return { hours: hours24, minutes: Math.round(minutes / 5) * 5, period }
	}

	function calculateDuration() {
		const startMinutes = timeToMinutes(startTime)
		const endMinutes = timeToMinutes(endTime)
		let duration = endMinutes - startMinutes

		// Handle overnight shifts
		if (duration < 0) duration += 1440 // Add 24 hours

		const hours = Math.floor(duration / 60)
		const mins = duration % 60
		return `${hours}:${mins.toString().padStart(2, '0')} hrs`
	}

	function handleDragStart(e) {
		isDragging = true
		const clientX = e.touches ? e.touches[0].clientX : e.clientX
		dragStartX = clientX
		const currentTime = editingTime === 'start' ? startTime : endTime
		initialMinutes = timeToMinutes(currentTime)
	}

	function handleDragMove(e) {
		if (!isDragging) return

		const clientX = e.touches ? e.touches[0].clientX : e.clientX
		const deltaX = clientX - dragStartX
		const minutesDelta = Math.round(deltaX / 2) // 2px = 1 minute

		const newTotalMinutes = initialMinutes + minutesDelta
		const newTime = minutesToTime(newTotalMinutes)

		if (editingTime === 'start') {
			startTime = newTime
		} else {
			endTime = newTime
		}
	}

	function handleDragEnd() {
		isDragging = false
	}

	function adjustTime(minutes) {
		const currentTime = editingTime === 'start' ? startTime : endTime
		const totalMinutes = timeToMinutes(currentTime) + minutes
		const newTime = minutesToTime(totalMinutes)

		if (editingTime === 'start') {
			startTime = newTime
		} else {
			endTime = newTime
		}
	}

	let currentTime = $derived(editingTime === 'start' ? startTime : endTime)
</script>

<div class="w-full space-y-3 p-4">
	<!-- Start and End Times -->
	<div class="flex items-center justify-between">
		<div class="text-center">
			<button
				onclick={() => (editingTime = editingTime ? null : 'start')}
				class="rounded-lg p-2 transition-colors hover:bg-neutral-50 {editingTime === 'start'
					? 'border-2 border-blue-200 bg-blue-50'
					: ''}"
			>
				<div class="text-lg font-semibold text-neutral-900">
					{formatTime(startTime)}<span class="text-sm font-medium">{startTime.period}</span>
				</div>
				<div class="text-xs text-neutral-500">Start</div>
			</button>
		</div>

		<div class="flex flex-1 justify-center">
			<div class="rounded-full bg-blue-500 px-3 py-1 text-white">
				<span class="text-sm font-medium">{calculateDuration()}</span>
			</div>
		</div>

		<div class="text-center">
			<button
				onclick={() => (editingTime = editingTime ? null : 'end')}
				class="rounded-lg p-2 transition-colors hover:bg-neutral-50 {editingTime === 'end'
					? 'border-2 border-blue-200 bg-blue-50'
					: ''}"
			>
				<div class="text-lg font-semibold text-neutral-900">
					{formatTime(endTime)}<span class="text-sm font-medium">{endTime.period}</span>
				</div>
				<div class="text-xs text-neutral-500">End</div>
			</button>
		</div>
	</div>

	<!-- Time Editor -->
	{#if editingTime}
		<div class="mt-3 overflow-hidden rounded-lg bg-neutral-100">
			<!-- Active time selector tabs -->
			<div class="flex bg-neutral-200">
				<button
					onclick={() => (editingTime = 'start')}
					class="flex-1 px-3 py-2 text-sm font-medium transition-colors {editingTime === 'start'
						? 'bg-white text-neutral-900 shadow-sm'
						: 'text-neutral-600 hover:text-neutral-800'}"
				>
					{formatTime(startTime)}<span class="text-xs">{startTime.period}</span>
				</button>
				<button
					onclick={() => (editingTime = 'end')}
					class="flex-1 px-3 py-2 text-sm font-medium transition-colors {editingTime === 'end'
						? 'bg-white text-neutral-900 shadow-sm'
						: 'text-neutral-600 hover:text-neutral-800'}"
				>
					{formatTime(endTime)}<span class="text-xs">{endTime.period}</span>
				</button>
			</div>

			<!-- Drag area -->
			<div
				class="cursor-grab touch-none p-6 select-none active:cursor-grabbing"
				onmousedown={handleDragStart}
				onmousemove={handleDragMove}
				onmouseup={handleDragEnd}
				onmouseleave={handleDragEnd}
				ontouchstart={handleDragStart}
				ontouchmove={handleDragMove}
				ontouchend={handleDragEnd}
				role="slider"
				tabindex="0"
			>
				<!-- Current time display -->
				<div class="mb-4 text-center">
					<div class="mb-1 text-2xl font-bold text-neutral-900">
						{formatTime(currentTime)}<span class="text-lg font-medium">{currentTime.period}</span>
					</div>
					<div class="text-sm text-neutral-600">Drag to adjust time</div>
				</div>

				<!-- Timeline with quick adjustments -->
				<div class="flex items-center space-x-2">
					<!-- Left quick buttons -->
					<button
						onclick={() => adjustTime(-10)}
						class="flex h-12 w-8 flex-col items-center justify-center text-xs text-neutral-600 hover:text-neutral-800"
					>
						<span class="font-bold">-10</span>
					</button>
					<button
						onclick={() => adjustTime(-5)}
						class="flex h-12 w-8 flex-col items-center justify-center text-xs text-neutral-600 hover:text-neutral-800"
					>
						<span class="font-bold">-5</span>
					</button>

					<!-- Main timeline -->
					<div class="relative mx-2 h-8 flex-1 overflow-hidden rounded-full bg-neutral-200">
						<div class="absolute inset-0 flex items-center justify-center">
							<div class="h-6 w-1 rounded-full bg-blue-500"></div>
						</div>

						<!-- Tick marks -->
						<div class="absolute inset-0 flex items-center">
							{#each Array(11) as _, i}
								<div class="flex flex-1 justify-center">
									<div class="h-3 w-px bg-neutral-300"></div>
								</div>
							{/each}
						</div>
					</div>

					<!-- Right quick buttons -->
					<button
						onclick={() => adjustTime(5)}
						class="flex h-12 w-8 flex-col items-center justify-center text-xs text-neutral-600 hover:text-neutral-800"
					>
						<span class="font-bold">+5</span>
					</button>
					<button
						onclick={() => adjustTime(10)}
						class="flex h-12 w-8 flex-col items-center justify-center text-xs text-neutral-600 hover:text-neutral-800"
					>
						<span class="font-bold">+10</span>
					</button>
				</div>
			</div>

			<!-- Done button -->
			<div class="px-4 pb-4">
				<button
					onclick={() => (editingTime = null)}
					class="w-full rounded-lg bg-blue-500 py-2 font-medium text-white"
				>
					Done
				</button>
			</div>
		</div>
	{/if}
</div>
