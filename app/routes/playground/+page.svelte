<script>
	import SkeletonLoader from '$ui/skeleton-loader.svelte'
	import SliderSeparated from '$ui/slider-separated.svelte'
	import LoadingSpinner from '$ui/spinner.svelte'
	import TextShimmer from '$ui/text-shimmer.svelte'

	let rangeMin = 0
	let rangeMax = 100
	let rangeValue = 50

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

		sliderValueWidth = 50
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

<TextShimmer class="text-lg font-medium">Logging you in...</TextShimmer>
<LoadingSpinner />
<SkeletonLoader />
<SliderSeparated />

<p>{debugText}</p>
<div
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
	ontouchmove={handleTouchMove}
	style:transform={isDragging ? 'scale(1.03)' : 'scale(1.0)'}
	class="relative my-2 h-6 w-32 cursor-ew-resize select-none rounded-full bg-zinc-200 transition-all"
>
	<p
		style:transform={isDragging ? 'translateY(-100%)' : 'translateY(0)'}
		style:color={isDragging ? 'black' : 'white'}
		class="absolute inset-0 z-10 h-full w-full text-center font-medium text-white mix-blend-difference transition-all"
	>
		35
	</p>

	<div class="relative h-full w-full overflow-hidden rounded-full bg-zinc-200">
		<div
			style:width={`${sliderValueWidth}px`}
			class="absolute inset-0 h-full min-w-[5px] max-w-full bg-neutral-800"
		></div>
	</div>
</div>
