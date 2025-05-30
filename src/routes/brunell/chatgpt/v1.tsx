import React, { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const MINUTE = 60 * 1000
const to5 = (ms) => Math.round(ms / (5 * MINUTE)) * (5 * MINUTE)
const todayAt = (h = 0, m = 0) => {
	const d = new Date()
	d.setHours(h, m, 0, 0)
	return d
}
const fmt = (d) => d.toTimeString().slice(0, 5)
const mins = (a, b) => Math.round((b - a) / MINUTE)
const BREAK_OPTS = [10, 15, 20, 30]

export default function TimeSheetPrototype() {
	const [job, setJob] = useState('')
	const [crew, setCrew] = useState([])
	const [start, setStart] = useState(todayAt(8, 0))
	const [end, setEnd] = useState(todayAt(12, 0))
	const [duration, setDuration] = useState(mins(start, end))
	const [field, setField] = useState(null)
	const [timeInputs, setTimeInputs] = useState({ start: fmt(start), end: fmt(end) })
	const [breaks, setBreaks] = useState([])
	const [showBreakMenu, setShowBreakMenu] = useState(false)
	const dragRef = useRef(null)

	useEffect(() => {
		if (field !== 'duration') setDuration(mins(start, end))
	}, [start, end, field])

	useEffect(() => {
		setEnd(new Date(start.getTime() + duration * MINUTE))
	}, [duration, start])

	useEffect(() => {
		setTimeInputs((p) => ({ ...p, end: fmt(end) }))
	}, [end])

	const parseTime = (val) => {
		const [h, m] = val.split(':').map(Number)
		return to5(todayAt(h, m))
	}

	const handleCustomInput = (type, val) => {
		setTimeInputs((p) => ({ ...p, [type]: val }))
		const newTime = parseTime(val)
		if (type === 'start') setStart(newTime)
		else setEnd(newTime)
		setField(type)
	}

	const nudge = (targetField, dir) => {
		if (!targetField) return
		if (targetField === 'duration') {
			setDuration((d) => Math.max(0, d + dir * 5))
			return
		}
		const tgt = targetField === 'start' ? start : end
		const t = new Date(tgt.getTime() + dir * 5 * MINUTE)
		if (targetField === 'start') setStart(t)
		else setEnd(t)
		setTimeInputs({
			start: fmt(targetField === 'start' ? t : start),
			end: fmt(targetField === 'end' ? t : end)
		})
	}

	const handlePadDrag = (dx) => nudge(field, Math.round(dx / 10))
	const addBreak = (min) => {
		setBreaks((b) => [...b, min])
		setShowBreakMenu(false)
	}

	return (
		<div className="space-y-6 p-6">
			<input
				value={job}
				onChange={(e) => setJob(e.target.value)}
				placeholder="Job name or number"
				className="w-full rounded-xl border px-3 py-2 shadow-sm"
			/>
			<input
				value={crew.join(', ')}
				onChange={(e) => setCrew(e.target.value.split(/,\s*/))}
				placeholder="Crew names (comma-separated)"
				className="w-full rounded-xl border px-3 py-2 shadow-sm"
			/>

			<section className="space-y-3 rounded-3xl bg-white p-4 shadow-md">
				<div className="flex items-center justify-evenly gap-3">
					{['start', 'duration', 'end'].map((type) =>
						type === 'duration' ? (
							<div key={type} className="flex flex-1 flex-col items-center">
								<label className="mb-1 text-xs">Duration</label>
								<div
									onClick={() => setField('duration')}
									className={`w-full cursor-pointer rounded-full bg-gray-100 px-3 py-2 text-center text-lg ${field === 'duration' ? 'ring-2 ring-rose-400' : ''}`}
								>
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
									className={`w-full rounded-lg bg-gray-100 px-2 py-2 text-center text-lg ${field === type ? 'ring-2 ring-rose-400' : ''}`}
								/>
							</div>
						)
					)}
				</div>

				{field && (
					<div className="flex items-center justify-center gap-4 pt-1">
						<button onClick={() => nudge(field, -1)} className="rounded-lg bg-gray-100 px-3 py-2">
							−5
						</button>
						<div
							ref={dragRef}
							className="flex h-10 cursor-ew-resize items-center justify-center rounded-xl bg-gray-200 px-6 text-sm text-gray-600"
							onPointerDown={(e) => {
								const el = dragRef.current
								if (!el) return
								el.setPointerCapture(e.pointerId)
								const startX = e.clientX
								const move = (m) => handlePadDrag(m.clientX - startX)
								const up = () => {
									if (el) el.releasePointerCapture(e.pointerId)
									window.removeEventListener('pointermove', move)
									window.removeEventListener('pointerup', up)
								}
								window.addEventListener('pointermove', move)
								window.addEventListener('pointerup', up)
							}}
						>
							Slide to adjust
						</div>
						<button onClick={() => nudge(field, 1)} className="rounded-lg bg-gray-100 px-3 py-2">
							+5
						</button>
					</div>
				)}
			</section>

			<section className="rounded-3xl bg-white p-4 shadow-md">
				<div className="flex flex-wrap items-center justify-between gap-2">
					<div className="flex flex-1 flex-wrap items-center gap-2">
						{breaks.map((b, i) => (
							<span
								key={i}
								className="flex items-center gap-1 rounded-full bg-amber-100 px-4 py-2 text-sm"
							>
								{b}m
								<button
									onClick={() => setBreaks(breaks.filter((_, idx) => idx !== i))}
									className="ml-1 text-xs"
								>
									×
								</button>
							</span>
						))}
					</div>
					<div className="relative">
						<button
							onClick={() => setShowBreakMenu((s) => !s)}
							className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xl"
						>
							+
						</button>
						{showBreakMenu && (
							<div className="absolute right-0 z-10 mt-2 rounded-xl border bg-white py-2 shadow-md">
								{BREAK_OPTS.map((opt) => (
									<button
										key={opt}
										onClick={() => addBreak(opt)}
										className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
									>
										{opt} minutes
									</button>
								))}
							</div>
						)}
					</div>
				</div>
			</section>

			<button className="w-full rounded-2xl bg-rose-600 py-3 text-lg font-semibold text-white shadow-md hover:bg-rose-700">
				Submit Time Sheet
			</button>
		</div>
	)
}
