<script lang="ts">
	import { fade, fly } from 'svelte/transition'
	import { cubicOut } from 'svelte/easing'
	import { createClass } from '$utils/create-class'
	import { wipeVertical } from '$ui/motion/transitions'

	import { Suspense, Progress } from '$ui/feedback'
	import Arrow from '$ui/icons/arrow-circle-fill.svelte'
	import Divider from '$ui/divider.svelte'
	import Chevron from '$ui/icons/chevron.svelte'
	import PasswordInput from '$ui/auth/password-input.svelte'
	import PasskeyAuto from '$ui/auth/passkey-auto.svelte'
	import PasskeyButton from '$ui/auth/passkey-button.svelte'
	import MagicLinkMessage from '$ui/auth/magic-link-message.svelte'
	import ToastSwap from '$ui/feedback/toast-swap.svelte'

	import { IconCopy, IconArrowBackUp } from '@tabler/icons-svelte'

	import type { PageData } from './$types'
	import { onMount } from 'svelte'
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { emailSchema, passwordLoginSchema } from './schema.ts'

	let { data } = $props()

	const {
		form: emailForm,
		errors: emailErrors,
		allErrors: emailAllErrors,
		constraints: emailConstraints,
		message: emailMessage,
		enhance: emailEnhance,
		validate: emailValidate,
		validateForm: emailValidateForm,
		delayed: emailDelayed,
		timeout: emailTimeout
	} = superForm(data.emailForm, {
		id: 'checkEmailForm',
		resetForm: false,
		validators: zodClient(emailSchema),
		validationMethod: 'auto',
		delayMs: 150,
		timeoutMs: 3000,
		multipleSubmits: 'prevent',
		onSubmit({ formData, cancel }) {
			console.log('test')
		}
	})

	let identifier = $state('')
	let editIdentity = $state(false)

	let buttonWidth = $state(0)

	// Set user's timezone on component mount
	onMount(() => {
		$emailForm.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
	})

	function resetForm() {
		if ($emailMessage) {
			$emailMessage = null
		}
	}

	let doAttentionAnimation = $state(false)
	async function emailAttentionAnimate() {
		doAttentionAnimation = false
		setTimeout(() => {
			doAttentionAnimation = true
		}, 5)
	}

	let toastConfirmCopied = $state(null)
	function copyCode() {
		if (data.magicStatus.code) {
			navigator.clipboard.writeText(data.magicStatus.code)

			toastConfirmCopied(2500)
		}
	}

	const SUPPRESS_AUTO_PASSKEY = true
</script>

{#if data.automaticPasskeyEnabled && !SUPPRESS_AUTO_PASSKEY}
	<PasskeyAuto />
{/if}

{#if $emailMessage}
	<div
		transition:fade={{ duration: 150 }}
		class="pointer-events-none absolute inset-0 z-0 h-full w-full bg-neutral-400/10"
	></div>
{/if}

<div class="z-10 flex h-full items-center justify-center">
	<div
		class={createClass(
			'relative flex min-h-40 w-[26rem] flex-shrink-0 flex-col items-center rounded-[1.8rem] p-[0.5rem] px-5 transition-all duration-200',
			$emailMessage ? 'rounded-[1.4rem] bg-white pt-4 pb-10' : 'bg-none'
		)}
	>
		<div
			class={createClass(
				'absolute top-0 left-0 h-18 w-full rounded-t-[1.5rem] bg-gradient-to-b from-[#E8F9FF] to-[#E8F9FF]/0 transition-colors duration-200',
				$emailMessage ? 'opacity-0' : 'opacity-100',
				data.magicStatus.code && 'opacity-0'
			)}
		></div>

		<div class=" w-full flex-col items-center justify-center px-7 py-5 text-center">
			<h2 class="tracking-tight-md animate-fade-in-scale text-[1.33rem] leading-loose font-[550]">
				{#if data.authTitle}{data.authTitle}{:else if $emailMessage?.existingUser}Almost There{:else}Welcome
					to Luxo{/if}
			</h2>
			{#if data.authMessage}
				<p
					class="animate-fade-in-scale text-[1.05rem] leading-5 font-[430] tracking-[-0.015em] text-neutral-500"
					transition:wipeVertical={{ duration: 400 }}
				>
					{data.authMessage}
				</p>
			{:else if !$emailMessage}
				<p
					class="animate-fade-in-scale text-[1.05rem] leading-5 font-[430] tracking-[-0.015em] text-neutral-500"
					transition:wipeVertical={{ duration: 400 }}
				>
					Log in or sign up to get started
				</p>
			{/if}
		</div>

		{#if data.magicStatus.code}
			<button
				type="button"
				onclick={copyCode}
				class="group mb-3 flex w-full flex-col items-center justify-center rounded-[1.5rem] bg-gradient-to-t from-neutral-900 to-neutral-700 py-3"
			>
				<h2
					class="text-3xl font-semibold text-neutral-200 transition-colors duration-100 group-hover:text-white"
				>
					{data.magicStatus.code.slice(0, 3)}
					<span class="w-1"></span>
					{data.magicStatus.code.slice(3, 6)}
				</h2>

				<ToastSwap bind:trigger={toastConfirmCopied}>
					{#snippet swapContent()}
						<div in:wipeHorizontal={{ duration: 400 }} class="flex h-7 items-center">
							<p class="w-fit rounded-full bg-green-500 px-3 text-[0.93rem] text-white">
								Copied to Clipboard
							</p>
						</div>
					{/snippet}
					<p
						class="flex h-7 items-center font-medium text-neutral-300 transition-colors duration-100 group-hover:text-white"
					>
						Click to Copy
						<IconCopy class="ml-2" size={18} />
					</p>
				</ToastSwap>
			</button>

			<a
				class="flex items-center pt-10 text-[1.1rem] font-semibold text-neutral-400 transition-colors duration-200 hover:text-neutral-600"
				href="/login"
				><IconArrowBackUp size={22} class="mr-2" /> Login on this device
			</a>
		{:else}
			{#if data.magicStatus.invalid && !$emailMessage}
				<div class="mb-3 w-full rounded-full bg-gradient-to-t from-rose-200/50 to-rose-300/50 py-3">
					<p class="text-center font-medium text-rose-600">Email link expired or invalid</p>
				</div>
			{:else if data.magicStatus.error && !$emailMessage}
				<div class="mb-3 w-full rounded-full bg-gradient-to-t from-rose-200/50 to-rose-300/50 py-3">
					<p class="text-center font-medium text-rose-600">
						Something went wrong trying to redeem email link
					</p>
				</div>
			{/if}

			<form method="POST" action="?/startLogin" use:emailEnhance class="w-full">
				<div
					class={createClass(
						'group relative flex h-12 w-full items-center overflow-hidden rounded-[0.9rem] border-2 border-red-500/0 focus-within:border-2 focus-within:border-blue-500',
						$emailMessage ? 'bg-neutral-50' : 'bg-neutral-100'
					)}
				>
					{#if $emailMessage}
						<div
							class="pointer-events-none absolute inset-0 z-10 flex h-full w-full items-center justify-start"
						>
							<Chevron size="30px" class="text-neutral-400 group-hover:text-neutral-700" />
						</div>
					{/if}

					<input
						type="email"
						name="email"
						autocomplete="username webauthn"
						id="email"
						placeholder="Continue with email"
						aria-label="Enter your email"
						bind:value={$emailForm.email}
						{...$emailConstraints.email}
						onfocusin={resetForm}
						class:attention-animation={doAttentionAnimation}
						class={createClass(
							'h-full w-full flex-grow-1 translate-y-0 pl-4 font-[450] text-zinc-900 transition-all outline-none selection:bg-sky-200 selection:text-blue-600 placeholder:font-[450] placeholder:text-neutral-400',
							$emailMessage ? 'cursor-pointer bg-none pr-4 text-center text-neutral-500' : 'pr-1'
						)}
					/>

					<!-- Hidden input to capture user's timezone -->
					<input type="hidden" aria-hidden name="timezone" bind:value={$emailForm.timezone} />

					<!-- Hint -->
					<div
						class={createClass(
							'pointer-events-none absolute top-0 right-0 z-0 h-full w-10 bg-gradient-to-l from-[#4496FF] to-[rgba(45,169,255,0.00)] transition-all duration-300',
							$emailAllErrors.length > 0 || $emailForm.email.length < 5
								? 'w-0 opacity-0'
								: 'w-15 opacity-20',
							$emailMessage && 'w-full opacity-10'
						)}
					></div>

					<button
						type="submit"
						disabled={$emailAllErrors.length > 0 || $emailForm.email.length < 5}
						class="group z-10 flex h-full shrink-0 flex-nowrap items-center justify-end px-1 transition-all duration-200"
						bind:offsetWidth={buttonWidth}
						style:margin-right={$emailMessage ? `-${buttonWidth}px` : '0px'}
						class:cursor-[w-resize]={$emailAllErrors.length > 0}
						class:cursor-pointer={!$emailAllErrors.length > 0}
					>
						{#if $emailErrors.email}
							<p
								class="animate-fade-in-scale-right pointer-events-none cursor-[w-resize] rounded-full bg-rose-100 px-3 py-1 text-[0.83rem] font-medium text-rose-600"
							>
								{$emailErrors.email}
							</p>
						{:else if $emailDelayed && !$emailTimeout}
							<div class="flex h-full items-center px-3">
								<Suspense.Spinner size={18} thickness={7} />
							</div>
						{:else}
							<Arrow
								class="animate-fade-in-scale-right mr-1 h-6 w-6 cursor-pointer p-[0.1rem] text-blue-500 transition-colors duration-300 ease-in-out group-disabled:text-neutral-500/80"
							/>
						{/if}
					</button>
				</div>
				{#if $emailTimeout}
					<p class="animate-fade-in-scale pt-0.5 pl-4 text-[0.83rem] font-medium text-rose-600">
						Something went wrong, please try again
					</p>
				{/if}
			</form>

			{#if $emailMessage}
				<div transition:wipeVertical class="flex w-full flex-col gap-2 pt-5">
					{#if $emailMessage?.passkeyAvailable}
						<PasskeyButton identifier={$emailForm.email} />
					{/if}

					{#if $emailMessage?.passwordAvailable}
						<PasswordInput formData={data.passwordLoginForm} email={$emailForm.email} />
					{/if}

					{#if $emailMessage?.emailAvailable}
						<MagicLinkMessage
							email={$emailForm.email}
							triggerAttention={emailAttentionAnimate}
							emailSent={$emailMessage?.emailSentSuccess}
						/>
					{/if}
				</div>
			{/if}
		{/if}
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
