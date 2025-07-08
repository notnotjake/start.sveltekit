<script lang="ts">
	import type { PageData } from './$types'
	import { enhance } from '$app/forms'
	import { fade, scale } from 'svelte/transition'
	import { cubicOut } from 'svelte/easing'
	import { createClass } from '$utils/styles'
	import ArrowsExpand from '$ui/icon/arrows-expand.svelte'
	import ArrowsCollapse from '$ui/icon/arrows-collapse.svelte'
	import Checkmark from '$ui/icon/checkmark.svelte'
	import Sidebar from '$ui/container/sidebar-provider.svelte'
	import { ToastInline } from '$ui/feedback'
	import Toggle from '$ui/input/toggle.svelte'
	import LogoutButton from '$bits/auth/logout.svelte'

	import { IconChevronLeft } from '@tabler/icons-svelte'

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

	let allowEmail = $state(true)
	let triggerToast
</script>

<div class="min-h-full w-full bg-neutral-100">
	<div class="mx-auto max-w-lg">
		<div class="flex justify-between py-3">
			<Button class="bg-neutral-300 pl-2 hover:bg-neutral-400" href="/app"
				><IconChevronLeft class="mr-1" size={22} />Back to App</Button
			>
			<LogoutButton class="">Logout</LogoutButton>
		</div>
	</div>

	<div class="mt-5 flex min-h-full w-full items-center justify-center">
		<div
			style:--padding-x="calc(var(--spacing) * 6)"
			class="shadow-primary relative min-h-full w-lg rounded-3xl border-1 border-neutral-200/70 bg-white transition-all duration-700"
		>
			<div class="px-[var(--padding-x)] pb-10">
				<div class="mb-2 flex w-full justify-between justify-start py-5">
					<h2 class="tracking-tight-md text-[1.3rem] leading-loose font-[550]">Settings</h2>
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
		</div>
	</div>
</div>

<style>
	.shadow-primary {
		box-shadow:
			rgba(0, 0, 0, 0.07) 0px 0.602187px 0.602187px -1.166667px,
			rgba(0, 0, 0, 0.063) 0px 2.288533px 2.288533px -2.333333px,
			rgba(0, 0, 0, 0.03) 0px 10px 10px -3.5px;
	}
</style>
