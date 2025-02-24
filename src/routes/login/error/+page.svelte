<script lang="ts">
	import type { PageData } from './$types'

	import { createClass } from '$utils/create-class'
	import { fade } from 'svelte/transition'

	import PinCell from '$ui/auth/pin.svelte'

	let pin = $state('')
	let proto = $state('')
	let pinLength = $state(6) // Default number of pin cells

	let identifier = $state('jake@notnotjake.com')
	let editIdentity = $state(false)
	let continueButton = $state()

	let textSelected = $state(true)
</script>

<div class="mb-10 w-full">
	<div class="providers flex w-full flex-col flex-nowrap gap-2">
		<div class="w-ful mb-4 h-[1px] w-full rounded-full"></div>

		<div class="flex flex-col items-center">
			<p class="mt-2 mb-4 font-medium text-neutral-600">You're Logged In</p>

			<p>Were you trying to sign in on another device?</p>
		</div>
	</div>
</div>
