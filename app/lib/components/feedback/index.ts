import SuspenseText from './suspense-text.svelte'
import SuspenseSkeleton from './suspense-skeleton.svelte'
import SuspenseBar from './suspense-bar.svelte'
import SuspenseSpinner from './suspense-spinner.svelte'

import ProgressBar from './progress-bar.svelte'
import ProgressRing from './progress-ring.svelte'
import ProgressRadial from './progress-radial.svelte'

export const Suspense = {
	Text: SuspenseText,
	Skeleton: SuspenseSkeleton,
	Bar: SuspenseBar,
	Spinner: SuspenseSpinner
}

export const Progress = {
	Bar: ProgressBar,
	Ring: ProgressRing,
	Radial: ProgressRadial
}

export {
	ProgressRing,
	ProgressBar,
	ProgressRadial,
	SuspenseBar,
	SuspenseSkeleton,
	SuspenseSpinner,
	SuspenseText
}
