<script lang="ts">
	import { fade } from 'svelte/transition'
	import { createClass } from '$utils/styles'
	import { wipeVertical } from '$ui/transition'

	import { Suspense, Progress } from '$ui/feedback'
	import Arrow from '$ui/icon/arrow-circle-fill.svelte'
	import Chevron from '$ui/icon/chevron.svelte'
	import PasswordInput from '$bits/auth/password-input.svelte'
	import PasskeyAuto from '$bits/auth/passkey-auto.svelte'
	import PasskeyButton from '$bits/auth/passkey-button.svelte'
	import CodeMessage from '$bits/auth/code-message.svelte'
	import ToastSwap from '$ui/feedback/toast-swap.svelte'

	import { IconCopy, IconArrowBackUp } from '@tabler/icons-svelte'

	import type { PageData } from './$types'
	import { onMount } from 'svelte'

	let { data } = $props()

	let identifier = $state('')

	let buttonWidth = $state(0)

	const SUPPRESS_AUTO_PASSKEY = false
</script>

<div class="z-10 mx-auto flex h-full w-full max-w-[28rem] items-center justify-center px-2">
	<div
		class={createClass(
			'relative flex min-h-40 w-full flex-shrink-0 grow flex-col items-center rounded-[1.4rem] rounded-[1.8rem] bg-white p-[0.5rem] px-2.5 pt-4 pb-10 transition-all duration-200 sm:px-5'
		)}
	>
		<div
			class={createClass(
				'top-0 left-0 -z-10 hidden h-18 w-full bg-gradient-to-b from-[#E8F9FF] to-[#E8F9FF]/0 opacity-100 transition-colors duration-200 sm:absolute sm:z-auto sm:block sm:rounded-t-[1.5rem]'
			)}
		></div>

		<div transition:wipeVertical class="flex w-full flex-col gap-2 pt-5">
			<PasskeyButton identifier="test@notnotjake.com" supressAuto={true} />
		</div>
	</div>
</div>

<style>
	.attention-animation {
		animation: bounce 0.7s ease-in-out;
	}

	@keyframes bounce {
		0% {
			transform: translateY(0);
			color: inherit;
		}
		15% {
			transform: translateY(-4px);
			color: var(--color-blue-500);
		}
		30% {
			transform: translateY(-4px);
			color: var(--color-blue-500);
		}
		45% {
			transform: translateY(0);
			color: var(--color-blue-500);
		}
		65% {
			transform: translateY(-2px);
			color: var(--color-blue-500);
		}
		80% {
			transform: translateY(-2px);
			color: var(--color-blue-500);
		}
		100% {
			transform: translateY(0);
			color: inherit;
		}
	}
</style>
