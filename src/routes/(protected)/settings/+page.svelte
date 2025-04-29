<script lang="ts">
	import type { PageData } from './$types'
	import { enhance } from '$app/forms'
	import { fade, scale } from 'svelte/transition'
	import { cubicOut } from 'svelte/easing'
	import { createClass } from '$utils/create-class'
	import ArrowsExpand from '$ui/icons/arrows-expand.svelte'
	import ArrowsCollapse from '$ui/icons/arrows-collapse.svelte'
	import Checkmark from '$ui/icons/checkmark.svelte'
	import Sidebar from '$ui/containers/sidebar-provider.svelte'
	import { ToastInline } from '$ui/feedback'
	import Toggle from '$ui/input/toggle.svelte'
	import LogoutButton from '$ui/auth/logout.svelte'

	import Button from '$ui/input/button.svelte'

	let { data }: PageData = $props()

	function popUpIn(node, { duration = 250, delay = 0, easing = cubicOut }) {
		return {
			duration,
			delay,
			easing,
			css: (t) => `
				transform: translateY(${50 * (1 - t)}px) scale(${0.9 + t * 0.1});
				opacity: ${t};
			`
		}
	}

	let visibility: 'hidden' | 'mini' | 'full' = $state('mini')

	function toggleVisibility() {
		if (visibility === 'hidden') {
			visibility = 'mini'
		} else if (visibility === 'mini') {
			visibility = 'full'
		} else {
			visibility = 'hidden'
		}
	}

	function toggleSize() {
		if (visibility === 'mini') {
			visibility = 'full'
		} else {
			visibility = 'mini'
		}
	}

	let sidebarExpand = $state(false)
	$effect(() => {
		if (visibility === 'full') {
			setTimeout(() => {
				sidebarExpand = true
			}, 200)
		} else {
			sidebarExpand = false
		}
	})

	let allowEmail = $state(true)
	let triggerToast
</script>

{#if visibility !== 'hidden'}
	<div class="absolute inset-0 z-20 flex h-full w-full items-center justify-center">
		<div
			onclick={() => {
				visibility = 'hidden'
			}}
			class="bg-neutral-150/50 absolute inset-0 z-10 h-full w-full"
			in:fade={{ duration: 200 }}
			out:fade={{ duration: 150 }}
		></div>

		<div
			style:--padding-x="calc(var(--spacing) * 6)"
			class={createClass(
				'shadow-primary relative z-50 border-[1px] transition-all duration-700',
				visibility === 'full'
					? 'h-full w-full rounded-none border-white'
					: 'min-h-60 w-110 rounded-[1.3rem] border-neutral-200/80'
			)}
			in:popUpIn={{ duration: 200 }}
			out:popUpIn={{ duration: 150 }}
		>
			<Sidebar
				defaultWidth={400}
				resizable={false}
				class={createClass('z-50 transition-all', visibility === 'full' ? '' : 'rounded-[1.3rem]')}
				isShown={sidebarExpand}
			>
				{#snippet sidebarContent()}
					<div
						class="bg-neutral-150 flex h-full w-full flex-col items-end justify-center gap-3 px-6 py-10"
					>
						<p
							class="shadow-primary rounded-lg bg-neutral-50 px-2 py-1 font-[1.2rem] font-medium text-neutral-800"
						>
							Account
						</p>
						<p class="rounded-lg px-2 py-1 font-[1.2rem] font-medium text-neutral-600">Security</p>
						<p class="rounded-lg px-2 py-1 font-[1.2rem] font-medium text-neutral-600">Billing</p>
					</div>
				{/snippet}

				<div
					class={createClass(
						'bg-white px-[var(--padding-x)] pb-4',
						visibility === 'full' ? 'h-full rounded-none' : 'rounded-[1.3rem]'
					)}
				>
					<div class="mb-2 flex items-center justify-between py-5">
						<h2 class="tracking-tight-md text-[1.3rem] leading-loose font-[550]">Settings</h2>
						<button onclick={toggleSize}>
							{#if visibility === 'mini'}
								<ArrowsExpand size="20px" class="text-neutral-400 hover:text-neutral-800" />
							{:else}
								<ArrowsCollapse size="20px" class="text-neutral-400 hover:text-neutral-800" />
							{/if}
						</button>
					</div>

					<div class="flex items-center justify-between py-2">
						<div class="flex w-fit items-center gap-4">
							<div
								class="aspect-square h-8 rounded-full bg-gray-200 ring-2 ring-neutral-400 ring-offset-2"
							></div>
							<div class="text-[0.9rem]">
								<p class="leading-none font-medium text-neutral-800">{data.userName}</p>
								<p class="text-neutral-600">{data.userEmail}</p>
							</div>
						</div>

						<Button style="ghost" href="/settings/change-email">Edit</Button>
					</div>

					<div
						class="ring-neutral-150 w-breakout-40 shadow-card my-3 w-full rounded-2xl bg-white px-3 py-3 ring-1 hover:bg-neutral-50"
					>
						<div class="flex items-center justify-between text-[0.95rem]">
							<div class="flex w-fit gap-2 text-[0.95rem]">
								<p class="font-medium">Notifications</p>
								<p class="text-neutral-700"></p>
							</div>
							<Button style="secondary">Manage</Button>
						</div>
					</div>

					<div class="w-breakout-full bg-neutral-150 my-3 h-[3px]"></div>

					<h2 class="mt-1 text-lg font-semibold">Security</h2>

					<section class="py-3">
						<div class="flex items-center justify-between py-1">
							<div class="flex w-fit items-center gap-2 text-[0.95rem]">
								<p class="font-medium">Login with Email</p>
								<p class="text-neutral-700">{allowEmail ? 'Enabled' : 'Disabled'}</p>

								<ToastInline
									bind:trigger={triggerToast}
									class="flex items-center gap-[0.2rem] rounded-full bg-green-100 p-[2px]"
								>
									<Checkmark size="20px" class="text-green-400" />
									<p class="pr-2 text-[0.9rem]/1 font-medium text-green-500">Saved</p>
								</ToastInline>
							</div>

							<Toggle
								bind:checked={allowEmail}
								onChange={() => {
									triggerToast()
								}}
							/>
						</div>

						<div class="bg-neutral-150 my-1.5 h-[1px] rounded-full"></div>

						<div class="flex items-center justify-between py-1">
							<div class="flex w-fit items-center gap-2 text-[0.95rem]">
								<p class="font-medium">Passkey</p>
								<p class="text-neutral-700">None Setup</p>
							</div>

							<Button style="outline" href="/settings/add-passkey">Add Passkey</Button>
						</div>

						<div class="bg-neutral-150 my-1.5 h-[1px] rounded-full"></div>

						<div class="flex items-center justify-between py-1">
							<div class="flex w-fit items-center gap-2 text-[0.95rem]">
								<p class="font-medium">Password</p>
								<p class="text-neutral-700">Set 2 weeks ago</p>
							</div>

							<Button style="outline" href="/settings/change-password">Change Password</Button>
						</div>
					</section>

					<div class="shadow-primary my-3 w-full rounded-2xl border border-gray-200 px-3 py-2">
						<div class="flex items-center justify-between py-2 text-[0.95rem]">
							<div class="flex w-fit gap-2 text-[0.95rem]">
								<p class="font-medium">Sessions</p>
								<p class="text-neutral-700">2 Active</p>
							</div>
							<Button href="settings/sessions/" style="secondary">Manage</Button>
						</div>
					</div>

					<div class="w-breakout-full bg-neutral-150 my-3 h-[3px]"></div>

					<h2 class="mt-1 text-lg font-semibold">Account</h2>

					<div class="flex items-center justify-between py-2">
						<p class="">Log out on this device</p>

						<LogoutButton
							class="rounded-full bg-neutral-700 px-3.5 py-1.5 text-[0.95rem] font-medium text-white hover:bg-neutral-800"
						/>
					</div>

					<div class="bg-neutral-150 my-1.5 h-[1px] rounded-full"></div>

					<div class="flex items-center justify-between py-2">
						<p class="">Delete Account</p>
						<Button href="/settings/delete-account" role="destructive" style="primary"
							>Delete Account</Button
						>
					</div>
				</div>
			</Sidebar>
		</div>
	</div>
{/if}

<button class="z-10 cursor-pointer" onclick={toggleVisibility}>Settings</button>

<style>
	.shadow-primary {
		box-shadow:
			rgba(0, 0, 0, 0.07) 0px 0.602187px 0.602187px -1.166667px,
			rgba(0, 0, 0, 0.063) 0px 2.288533px 2.288533px -2.333333px,
			rgba(0, 0, 0, 0.03) 0px 10px 10px -3.5px;
	}
</style>
