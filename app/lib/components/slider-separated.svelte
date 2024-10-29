<script lang="ts">
	let valueLabel: string = 'Width'
	let value: number = 24
	let valueUnit: string = 'px'

	let isEditing = false
	let isDragging = false

	let startX = 0
	let currentX = 0
	let dragThreshold = 5 // pixels to move before considering it a drag
	let lastClickTime = 0
	const doubleClickDelay = 300

	let sliderValueWidth = 30
	let sliderValueDragStart

	function handlePointerDown(event) {
		startX = event.clientX
		currentX = event.clientX

		// Set capture to get pointer events outside the element
		event.target.setPointerCapture(event.pointerId)
	}

	function handlePointerMove(event) {
		if (!event.buttons) return // Not pressing any buttons

		currentX = event.clientX

		const deltaX = Math.abs(currentX - startX)

		// If moved more than threshold, consider it a drag
		if (!isDragging && deltaX > dragThreshold) {
			isDragging = true
			onDragStart()
		}

		if (isDragging) {
			onDrag(currentX - startX)
		}
	}

	function handlePointerUp(event) {
		if (isDragging) {
			onDragEnd(currentX - startX)
			isDragging = false
		} else {
			const currentTime = Date.now()
			const timeSinceLastClick = currentTime - lastClickTime

			if (timeSinceLastClick < doubleClickDelay) {
				// Double Click
				doubleClick()
				lastClickTime = 0
			} else {
				// Single Click or First Click
				lastClickTime = currentTime
				onClick()
			}
		}

		event.target.releasePointerCapture(event.pointerId)
	}

	let debugText = 'nada'

	function onClick() {
		console.log('Clicked!')
		debugText = 'clicked'
		isEditing = true
	}

	function doubleClick() {
		debugText = 'double clicked'
	}

	function onDragStart() {
		console.log('Started dragging')
		debugText = 'started dragging'
		sliderValueDragStart = sliderValueWidth
	}

	function onDrag(deltaX, deltaY) {
		console.log(`Dragging: dx=${deltaX}`)
		debugText = `dragging: dx=${deltaX}`

		sliderValueWidth = sliderValueDragStart + deltaX
	}

	function onDragEnd(totalDeltaX, totalDeltaY) {
		console.log(`Finished drag: dx=${totalDeltaX}`)
		debugText = `Ended drag: dx=${totalDeltaX}`
	}

	function handleTouchMove() {
		debugText = 'touch move'
	}
</script>

<div
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
	ontouchmove={handleTouchMove}
	class="flex gap-1"
>
	<div
		class="hover:shadow-inner-xs group my-3 flex h-8 w-28 cursor-ew-resize select-none items-center justify-between rounded-[0.6rem] bg-neutral-200 px-2"
	>
		<p class="text-sm text-neutral-600 group-hover:text-neutral-900">{valueLabel}</p>
		<p
			style:color={isEditing ? 'blue' : 'unset'}
			class="cursor-pointer text-sm font-semibold text-neutral-600 group-hover:text-neutral-900"
		>
			{value}{valueUnit}
		</p>
	</div>
</div>
