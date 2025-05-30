import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

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
const colors = [
	'bg-rose-400',
	'bg-amber-400',
	'bg-emerald-400',
	'bg-sky-400',
	'bg-violet-400',
	'bg-fuchsia-400'
]
const colorFor = (i) => colors[i % colors.length]

/****************************
 * Modal Sheet Component
 ***************************/
function Sheet({ open, onClose, title, children }) {
	return (
		<AnimatePresence>
			{open && (
				<motion.div
					className="fixed inset-0 z-40 flex items-end justify-center"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<div className="absolute inset-0 bg-black/40" onClick={onClose} />
					<motion.div
						initial={{ y: '100%' }}
						animate={{ y: 0 }}
						exit={{ y: '100%' }}
						transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
						className="relative w-full max-w-lg rounded-t-3xl bg-white p-6 shadow-xl"
					>
						<header className="mb-4 flex items-center justify-between">
							<h2 className="text-lg font-semibold">{title}</h2>
							<button onClick={onClose} className="text-sm text-gray-500">
								Done
							</button>
						</header>
						<div className="max-h-[60vh] space-y-6 overflow-y-auto">{children}</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

/****************************
 * Avatars
 ***************************/
function Avatar({ initials, size = 8, idx }) {
	return (
		<div
			className={`flex shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${colorFor(idx)} h-${size} w-${size}`}
		>
			{initials}
		</div>
	)
}

/****************************
 * Main Prototype
 ***************************/
export default function TimeSheetPrototype() {
	const [job, setJob] = useState('')
	const [crew, setCrew] = useState([])
	const [start, setStart] = useState(todayAt(8, 0))
	const [end, setEnd] = useState(todayAt(12, 0))
	const [duration, setDuration] = useState(mins(start, end))
	const [field, setField] = useState('start')
	const [breaks, setBreaks] = useState([])
	const [crewSheet, setCrewSheet] = useState(false)
	const [matSheet, setMatSheet] = useState(false)
	const [taskSheet, setTaskSheet] = useState(false)
	const [timeInputs, setTimeInputs] = useState({ start: fmt(start), end: fmt(end) })

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

	useEffect(() => setDuration(mins(start, end)), [start, end])
	useEffect(() => setEnd(new Date(start.getTime() + duration * MINUTE)), [start, duration])

	const parseTime = (val) => {
		const [h, m] = val.split(':').map(Number)
		return to5(todayAt(h, m))
	}
	const handleCustomInput = (type, val) => {
		setTimeInputs((p) => ({ ...p, [type]: val }))
		const newTime = parseTime(val)
		type === 'start' ? setStart(newTime) : setEnd(newTime)
	}
	const nudge = (t, dir) => {
		const tgt = t === 'start' ? start : end
		const d = new Date(tgt.getTime() + dir * 5 * MINUTE)
		t === 'start' ? setStart(d) : setEnd(d)
		setTimeInputs({ start: fmt(t === 'start' ? d : start), end: fmt(t === 'end' ? d : end) })
	}
	const handlePadDrag = (dx) => nudge(field, Math.round(dx / 10))

	const toggleCrew = (initialsArr) => {
		const set = new Set(crew)
		initialsArr.forEach((i) => {
			set.has(i) ? set.delete(i) : set.add(i)
		})
		setCrew([...set])
	}

	return (
		<div className="font-inter mx-auto max-w-lg space-y-6 p-4">
			<input
				value={job}
				onChange={(e) => setJob(e.target.value)}
				placeholder="Select or type job…"
				className="w-full rounded-xl border px-3 py-2 shadow-sm focus:ring-2 focus:ring-rose-500"
			/>
			<button
				onClick={() => setCrewSheet(true)}
				className="flex w-full items-center justify-between rounded-xl border px-3 py-2 shadow-sm hover:bg-gray-50"
			>
				<span>{crew.length ? `${crew.length} selected` : 'Add people'}</span>
				<span className="text-sm text-gray-400">⋯</span>
			</button>
			<section className="space-y-4 rounded-3xl bg-white p-5 shadow-lg">
				<div className="flex items-center justify-evenly gap-2">
					{['start', 'duration', 'end'].map((type, idx) =>
						type === 'duration' ? (
							<div key={type} className="flex flex-1 flex-col items-center">
								<label className="mb-1 text-xs">Duration</label>
								<div className="w-full rounded-full bg-gray-100 px-4 py-1 text-center text-lg">
									{(duration / 60).toFixed(2)}h
								</div>
							</div>
						) : (
							<div key={type} className="flex flex-1 flex-col items-center">
								<label className="mb-1 text-xs">{type === 'start' ? 'Start' : 'End'}</label>
								<input
									value={timeInputs[type]}
									onChange={(e) => handleCustomInput(type, e.target.value)}
									onFocus={() => setField(type)}
									className="w-full rounded-lg bg-gray-100 px-2 py-1 text-center text-lg"
								/>
							</div>
						)
					)}
				</div>
				<div className="flex items-center justify-center gap-3">
					<button onClick={() => nudge(field, -1)} className="rounded-lg bg-gray-100 px-3 py-1">
						−5
					</button>
					<div
						className="flex h-10 cursor-ew-resize items-center justify-center rounded-xl bg-gray-200 px-6 text-sm text-gray-600"
						onPointerDown={(e) => {
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
						}}
					>
						Slide to adjust
					</div>
					<button onClick={() => nudge(field, 1)} className="rounded-lg bg-gray-100 px-3 py-1">
						+5
					</button>
				</div>
			</section>
			<div className="flex flex-wrap items-center gap-2">
				{breaks.map((b, i) => (
					<button
						key={i}
						onClick={() => setBreaks(breaks.filter((_, idx) => idx !== i))}
						className="rounded-full bg-amber-100 px-3 py-1 text-sm"
					>
						{b}m ×
					</button>
				))}
				<button
					onClick={() => setBreaks([...breaks, 15])}
					className="rounded-full bg-gray-100 px-3 py-1 text-sm"
				>
					+ Break
				</button>
			</div>
			<div className="grid grid-cols-2 gap-3">
				<button
					onClick={() => setMatSheet(true)}
					className="rounded-xl bg-white p-4 text-center shadow hover:bg-gray-50"
				>
					Materials
				</button>
				<button
					onClick={() => setTaskSheet(true)}
					className="rounded-xl bg-white p-4 text-center shadow hover:bg-gray-50"
				>
					To‑dos
				</button>
			</div>
			<button className="w-full rounded-2xl bg-rose-600 py-3 text-lg text-white shadow-lg hover:bg-rose-700">
				Submit
			</button>
			<Sheet open={crewSheet} onClose={() => setCrewSheet(false)} title="Select Crew">
				<div className="space-y-4">
					{teams.map((team, tIdx) => (
						<button
							key={team.name}
							onClick={() => toggleCrew(team.members)}
							className="flex w-full items-center gap-3 rounded-xl border p-3 hover:bg-gray-50"
						>
							<div className="flex -space-x-2">
								{team.members.slice(0, 4).map((ini, i) => (
									<Avatar key={ini} initials={ini} idx={i} size={8} />
								))}
							</div>
							<div className="text-left">
								<div className="font-medium">{team.name}</div>
								<div className="text-xs text-gray-500">{team.members.join(', ')}</div>
							</div>
						</button>
					))}
				</div>
				<div className="border-t pt-6">
					{people.map((p, idx) => (
						<div key={p.name} className="flex items-center justify-between py-2">
							<div className="flex items-center gap-3">
								<Avatar initials={p.initials} idx={idx} size={9} />
								<span>{p.name}</span>
							</div>
							<button
								onClick={() => toggleCrew([p.initials])}
								className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xl leading-none hover:bg-gray-200"
							>
								+
							</button>
						</div>
					))}
				</div>
			</Sheet>
			<Sheet open={matSheet} onClose={() => setMatSheet(false)} title="Materials Used">
				<p className="text-gray-500">(stub) Search list & quantity steppers here.</p>
			</Sheet>
			<Sheet open={taskSheet} onClose={() => setTaskSheet(false)} title="Work Description / Todos">
				<p className="text-gray-500">(stub) Task checklist & notes.</p>
			</Sheet>
		</div>
	)
}
