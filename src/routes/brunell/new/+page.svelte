<!-- TimeSheetPrototype.svelte -->
<script>
	import { onMount } from 'svelte'
	import Sheet from './Sheet.svelte'
	import Avatar from './Avatar.svelte'

	/****************************
	 * Utilities
	 ***************************/
	const MINUTE = 60 * 1000
	const to5 = (ms) => Math.round(ms / (5 * MINUTE)) * (5 * MINUTE)
	const todayAt = (h = 0, m = 0) => {
		const d = new Date()
		d.setHours(h, m, 0, 0)
		return d
	}
	const fmt = (d) => d.toTimeString().slice(0, 5)
	const mins = (a, b) => Math.round((b - a) / MINUTE)

	/****************************
	 * State
	 ***************************/
	let job = $state('')
	let crew = $state([])
	let start = $state(todayAt(8, 0))
	let end = $state(todayAt(12, 0))
	let field = $state('start')
	let breaks = $state([])
	let crewSheet = $state(false)
	let matSheet = $state(false)
	let taskSheet = $state(false)
	let timeInputs = $state({ start: fmt(start), end: fmt(end) })
	let breakMenuOpen = $state(false)

	const teams = [
		{ name: 'Crew Alpha', members: ['JD', 'MG', 'RS'] },
		{ name: 'Roofers', members: ['AH', 'BL', 'CP', 'DW'] }
	]
	const people = [
		{ name: 'John Doe', initials: 'JD' },
		{ name: 'Maria Garcia', initials: 'MG' },
		{ name: 'Robert Smith', initials: 'RS' },
		{ name: 'Alice Huang', initials: 'AH' },
		{ name: 'Brian Lee', initials: 'BL' },
		{ name: 'Carlos Perez', initials: 'CP' },
		{ name: 'Dana White', initials: 'DW' }
	]

	/****************************
	 * Reactive statements
	 ***************************/
	let duration = $derived(mins(start, end))

	/****************************
	 * Functions
	 ***************************/
	const parseTime = (val) => {
		const [h, m] = val.split(':').map(Number)
		return to5(todayAt(h, m))
	}

	const handleCustomInput = (type, val) => {
		timeInputs = { ...timeInputs, [type]: val }
		const newTime = parseTime(val)
		if (type === 'start') {
			start = newTime
		} else {
			end = newTime
		}
	}

	const nudge = (t, dir) => {
		const tgt = t === 'start' ? start : end
		const d = new Date(tgt.getTime() + dir * 5 * MINUTE)
		if (t === 'start') {
			start = d
		} else {
			end = d
		}
		timeInputs = {
			start: fmt(t === 'start' ? d : start),
			end: fmt(t === 'end' ? d : end)
		}
		// duration is reactively updated via $derived
	}

	const handlePadDrag = (dx) => nudge(field, Math.round(dx / 10))

	const toggleCrew = (initialsArr) => {
		const set = new Set(crew)
		initialsArr.forEach((i) => {
			if (set.has(i)) {
				set.delete(i)
			} else {
				set.add(i)
			}
		})
		crew = [...set]
	}

	const removeBreak = (index) => {
		breaks = breaks.filter((_, idx) => idx !== index)
	}

	const addBreak = (minutes) => {
		breaks = [...breaks, minutes]
		breakMenuOpen = false
	}

	const getBreakColor = (index) => {
		const colors = [
			'bg-pink-200 text-pink-800',
			'bg-purple-200 text-purple-800',
			'bg-blue-200 text-blue-800',
			'bg-green-200 text-green-800',
			'bg-yellow-200 text-yellow-800',
			'bg-orange-200 text-orange-800',
			'bg-red-200 text-red-800',
			'bg-indigo-200 text-indigo-800'
		]
		return colors[index % colors.length]
	}

	const handleSliderPointerDown = (e) => {
		e.currentTarget.setPointerCapture(e.pointerId)
		const startX = e.clientX

		const move = (m) => handlePadDrag(m.clientX - startX)
		const up = () => {
			e.currentTarget.releasePointerCapture(e.pointerId)
			window.removeEventListener('pointermove', move)
			window.removeEventListener('pointerup', up)
		}

		window.addEventListener('pointermove', move)
		window.addEventListener('pointerup', up)
	}

	// Close dropdown when clicking outside
	const handleClickOutside = (event) => {
		if (breakMenuOpen && !event.target?.closest('.break-menu-container')) {
			breakMenuOpen = false
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside)
		return () => {
			document.removeEventListener('click', handleClickOutside)
		}
	})
</script>

<div class="mx-auto max-w-lg space-y-6 p-4">
	<input
		bind:value={job}
		placeholder="Select or type job…"
		class="border- w-full rounded-xl border px-3 py-2 shadow-sm focus:ring-2 focus:ring-rose-500"
	/>

	<button
		onclick={() => (crewSheet = true)}
		class="flex w-full items-center justify-between rounded-xl border px-3 py-2 shadow-sm hover:bg-gray-50"
	>
		<span>{crew.length ? `${crew.length} selected` : 'Add people'}</span>
		<span class="text-sm text-gray-400">⋯</span>
	</button>

	<section class="space-y-4 rounded-3xl bg-white p-5 shadow-lg">
		<div class="flex items-center justify-evenly gap-2">
			<div class="flex flex-1 flex-col items-center">
				<label class="mb-1 text-xs">Start</label>
				<input
					bind:value={timeInputs.start}
					oninput={(e) => handleCustomInput('start', e.target.value)}
					onfocus={() => (field = 'start')}
					class="w-full rounded-lg bg-gray-100 px-2 py-1 text-center text-lg"
				/>
			</div>

			<div class="flex flex-1 flex-col items-center">
				<label class="mb-1 text-xs">Duration</label>
				<div class="w-full rounded-full bg-gray-100 px-4 py-1 text-center text-lg">
					{(duration / 60).toFixed(2)}h
				</div>
			</div>

			<div class="flex flex-1 flex-col items-center">
				<label class="mb-1 text-xs">End</label>
				<input
					bind:value={timeInputs.end}
					oninput={(e) => handleCustomInput('end', e.target.value)}
					onfocus={() => (field = 'end')}
					class="w-full rounded-lg bg-gray-100 px-2 py-1 text-center text-lg"
				/>
			</div>
		</div>

		<div class="flex items-center justify-center gap-3">
			<button onclick={() => nudge(field, -1)} class="rounded-lg bg-gray-100 px-3 py-1">
				−5
			</button>
			<div
				class="flex h-10 cursor-ew-resize items-center justify-center rounded-xl bg-gray-200 px-6 text-sm text-gray-600"
				onpointerdown={handleSliderPointerDown}
			>
				Slide to adjust
			</div>
			<button onclick={() => nudge(field, 1)} class="rounded-lg bg-gray-100 px-3 py-1"> +5 </button>
		</div>
	</section>

	<div class="flex flex-wrap items-center justify-between gap-2">
		<div class="flex flex-wrap items-center gap-2">
			{#each breaks as breakTime, i}
				<button
					onclick={() => removeBreak(i)}
					class="rounded-lg px-3 py-1 text-sm {getBreakColor(i)}"
				>
					{breakTime}m ×
				</button>
			{/each}
		</div>
		<div class="break-menu-container relative">
			<button
				onclick={() => (breakMenuOpen = !breakMenuOpen)}
				class="rounded-full bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
			>
				+ Break
			</button>
			{#if breakMenuOpen}
				<div class="absolute top-full right-0 z-10 mt-1 w-24 rounded-lg border bg-white shadow-lg">
					{#each [5, 10, 15, 20, 30] as minutes}
						<button
							onclick={() => addBreak(minutes)}
							class="w-full px-3 py-2 text-sm first:rounded-t-lg last:rounded-b-lg hover:bg-gray-50"
						>
							{minutes}m
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<div class="grid grid-cols-2 gap-3">
		<button
			onclick={() => (matSheet = true)}
			class="rounded-xl bg-white p-4 text-center shadow hover:bg-gray-50"
		>
			Materials
		</button>
		<button
			onclick={() => (taskSheet = true)}
			class="rounded-xl bg-white p-4 text-center shadow hover:bg-gray-50"
		>
			To‑dos
		</button>
	</div>

	<button
		class="w-full rounded-2xl bg-rose-600 py-3 text-lg text-white shadow-lg hover:bg-rose-700"
	>
		Submit
	</button>

	<!-- Crew Selection Sheet -->
	<Sheet bind:open={crewSheet} title="Select Crew">
		<div class="space-y-4">
			{#each teams as team, tIdx}
				<button
					onclick={() => toggleCrew(team.members)}
					class="flex w-full items-center gap-3 rounded-xl border p-3 hover:bg-gray-50"
				>
					<div class="flex -space-x-2">
						{#each team.members.slice(0, 4) as ini, i}
							<Avatar initials={ini} idx={i} size={8} />
						{/each}
					</div>
					<div class="text-left">
						<div class="font-medium">{team.name}</div>
						<div class="text-xs text-gray-500">{team.members.join(', ')}</div>
					</div>
				</button>
			{/each}
		</div>
		<div class="border-t pt-6">
			{#each people as person, idx}
				<div class="flex items-center justify-between py-2">
					<div class="flex items-center gap-3">
						<Avatar initials={person.initials} {idx} size={9} />
						<span>{person.name}</span>
					</div>
					<button
						onclick={() => toggleCrew([person.initials])}
						class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xl leading-none hover:bg-gray-200"
					>
						+
					</button>
				</div>
			{/each}
		</div>
	</Sheet>

	<!-- Materials Sheet -->
	<Sheet bind:open={matSheet} title="Materials Used">
		<p class="text-gray-500">(stub) Search list & quantity steppers here.</p>
	</Sheet>

	<!-- Tasks Sheet -->
	<Sheet bind:open={taskSheet} title="Work Description / Todos">
		<p class="text-gray-500">(stub) Task checklist & notes.</p>
	</Sheet>
</div>
