import { cubicOut } from 'svelte/easing'

export function wipeVertical(node, { duration = 250, delay = 0, easing = cubicOut }) {
	const targetHeight = node.offsetHeight
	return {
		duration,
		delay,
		easing,
		css: (t) => `
			height: ${t * targetHeight}px;
			min-height: ${t * targetHeight}px;
			overflow: hidden;
			white-space: nowrap;
			opacity: ${t};
		`
	}
}

export function wipeHorizontal(node, { duration = 300, delay = 0, easing = cubicOut }) {
	const targetWidth = node.offsetWidth
	return {
		duration,
		delay,
		easing,
		css: (t) => `
			width: ${t * targetWidth}px;
			overflow: hidden;
			white-space: nowrap;
			opacity: ${t};
		`
	}
}
