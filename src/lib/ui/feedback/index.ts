import SuspenseText from './suspense-text.svelte'
import SuspenseSkeleton from './suspense-skeleton.svelte'
import SuspenseBar from './suspense-bar.svelte'
import SuspenseSpinner from './suspense-spinner.svelte'

import ProgressBar from './progress-bar.svelte'
import ProgressRing from './progress-ring.svelte'
import ProgressRadial from './progress-radial.svelte'
import { ProgressText } from './progress/text'

import ToastInline from './toast-inline.svelte'

export const Suspense = {
	Text: SuspenseText,
	Skeleton: SuspenseSkeleton,
	Bar: SuspenseBar,
	Spinner: SuspenseSpinner
}

export const Progress = {
	Bar: ProgressBar,
	Ring: ProgressRing,
	Radial: ProgressRadial,
	Text: ProgressText
}

export const Toast = {
	Inline: ToastInline
}

export {
	ProgressRing,
	ProgressBar,
	ProgressRadial,
	ProgressText,
	SuspenseBar,
	SuspenseSkeleton,
	SuspenseSpinner,
	SuspenseText,
	ToastInline
}
