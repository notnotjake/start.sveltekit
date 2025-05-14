<script lang="ts">
	import { AlertDialog } from 'bits-ui'
	import { createClass } from '$utils/styles'
	import Button from '$ui/input/button.svelte'
	import { flyScale } from '$lib/ui/transition'
	import { fade } from 'svelte/transition'
	import { IconX, IconMessage2 } from '@tabler/icons-svelte'

	let isOpen = $state(false)
	let stackOrder = $state<number>(0)

	function simStack() {
		if (stackOrder === 0) {
			stackOrder = 1
		} else {
			stackOrder = 0
		}
	}

	let secondOpen = $state(false)
	$effect(() => {
		if (secondOpen) {
			stackOrder = 1
		} else {
			stackOrder = 0
		}
	})
</script>

<div class="absolute top-30 left-80 h-90 w-80 bg-blue-400"></div>
<div class="absolute top-90 left-190 h-90 w-80 bg-blue-400"></div>

<AlertDialog.Root bind:open={isOpen} class="outline-none">
	<AlertDialog.Trigger class="outline-none">
		<Button as="div" style="primary" rounded="md">Change Name</Button>
	</AlertDialog.Trigger>
	<AlertDialog.Portal>
		<AlertDialog.Overlay
			forceMount
			class={createClass('fixed inset-0 z-50 bg-black/50 outline-none')}
		>
			{#snippet child({ props, open })}
				{#if open}
					<div {...props} in:fade={{ duration: 150 }} out:fade={{ duration: 150, delay: 80 }}></div>
				{/if}
			{/snippet}
		</AlertDialog.Overlay>

		<AlertDialog.Content forceMount interactOutsideBehavior="close" preventScroll={true}>
			{#snippet child({ props, open })}
				{#if open}
					<div
						{...props}
						in:flyScale={{ duration: 200, delay: 80, y: 400, scale: 0.85, opacity: 0 }}
						out:flyScale={{
							duration: 300,
							delay: stackOrder !== 0 ? 50 : 0,
							y: 500,
							scale: 0.97,
							opacity: 0
						}}
						class={createClass(
							'fixed top-[50%] left-[50%] z-50 flex w-md max-w-[calc(100%-2rem)] origin-top translate-x-[-50%] translate-y-[-50%] gap-4 rounded-3xl bg-neutral-100/80 shadow-sm backdrop-blur-md transition-all duration-150 outline-none sm:max-w-lg md:w-sm',
							stackOrder === 1 && 'translate-y-[-51.5%] scale-[0.97] brightness-90'
						)}
					>
						<div class="flex w-full flex-col gap-3">
							<div class="w-full">
								<div class="relative flex items-center justify-center gap-2 px-1.5 py-2">
									<div class="rounded-full bg-blue-500 p-1.5">
										<IconMessage2 size={17} class="text-white" />
									</div>

									<AlertDialog.Title class="text-center font-medium text-neutral-800"
										>Add Comment</AlertDialog.Title
									>
									<div class="absolute top-0 right-3 flex h-full w-fit items-center justify-center">
										<AlertDialog.Cancel
											class="group rounded-full p-1 transition-all duration-100 hover:scale-110 hover:bg-white/90"
										>
											<IconX size={22} class="text-neutral-500 group-hover:text-black" />
										</AlertDialog.Cancel>
									</div>
								</div>

								<div class="w-full px-1">
									<div class="dark-line h-[1.5px] w-full"></div>
									<div class="highlight-line h-[1px] w-full"></div>
								</div>
							</div>

							<div class="flex flex-col gap-4 px-4 pb-2">
								<div class="flex w-full rounded-full bg-neutral-400/25 px-4 py-2">
									<p>To:</p>
									<input type="text" class="w-full focus:outline-none" />
								</div>
								<div class="h-40 w-full rounded-lg bg-neutral-200"></div>
								<Button rounded="md" style="primary" class="bg-blue-400 py-3 hover:bg-blue-500"
									>Save Changes</Button
								>
								<AlertDialog.Action>Save Changes</AlertDialog.Action>

								<AlertDialog.Root bind:open={secondOpen} class="outline-none">
									<AlertDialog.Trigger class="outline-none">
										<Button
											as="div"
											style="primary"
											rounded="md"
											class="bg-blue-500 py-3 hover:bg-blue-600">Open Nested</Button
										>
									</AlertDialog.Trigger>
									<AlertDialog.Portal>
										<AlertDialog.Overlay
											forceMount
											class={createClass(
												'fixed inset-0 z-50 outline-none',
												stackOrder !== 0 ? 'bg-black/10' : 'bg-black/50'
											)}
										>
											{#snippet child({ props, open })}
												{#if open}
													<div
														{...props}
														in:fade={{ duration: 150 }}
														out:fade={{ duration: 150, delay: 80 }}
													></div>
												{/if}
											{/snippet}
										</AlertDialog.Overlay>

										<AlertDialog.Content
											forceMount
											interactOutsideBehavior="close"
											preventScroll={true}
										>
											{#snippet child({ props, open })}
												{#if open}
													<div
														{...props}
														in:flyScale={{
															duration: 200,
															delay: 80,
															y: 400,
															scale: 0.85,
															opacity: 0
														}}
														out:flyScale={{
															duration: 300,
															delay: 0,
															y: 500,
															scale: 0.97,
															opacity: 0
														}}
														class={createClass(
															'fixed top-[50%] left-[50%] z-50 flex w-md max-w-[calc(100%-2rem)] origin-top translate-x-[-50%] translate-y-[-50%] gap-4 rounded-3xl bg-neutral-100/80 shadow-sm backdrop-blur-md transition-all duration-150 outline-none sm:max-w-lg md:w-sm'
														)}
													>
														<div class="flex w-full flex-col gap-3">
															<div class="w-full">
																<div
																	class="relative flex items-center justify-center gap-2 px-1.5 py-2"
																>
																	<div class="rounded-full bg-blue-500 p-1.5">
																		<IconMessage2 size={17} class="text-white" />
																	</div>

																	<AlertDialog.Title
																		class="text-center font-medium text-neutral-800"
																		>Add Comment</AlertDialog.Title
																	>
																	<div
																		class="absolute top-0 right-3 flex h-full w-fit items-center justify-center"
																	>
																		<AlertDialog.Cancel
																			class="group rounded-full p-1 transition-all duration-100 hover:scale-110 hover:bg-white/90"
																		>
																			<IconX
																				size={22}
																				class="text-neutral-500 group-hover:text-black"
																			/>
																		</AlertDialog.Cancel>
																	</div>
																</div>

																<div class="w-full px-1">
																	<div class="dark-line h-[1.5px] w-full"></div>
																	<div class="highlight-line h-[1px] w-full"></div>
																</div>
															</div>

															<div class="flex flex-col gap-4 px-4 pb-2">
																<div class="flex w-full rounded-full bg-neutral-400/25 px-4 py-2">
																	<p>To:</p>
																	<input type="text" class="w-full focus:outline-none" />
																</div>
																<div class="h-40 w-full rounded-lg bg-neutral-200"></div>
																<Button
																	rounded="md"
																	style="primary"
																	class="bg-blue-400 py-3 hover:bg-blue-500">Save Changes</Button
																>
																<AlertDialog.Action>Save Changes</AlertDialog.Action>
															</div>
														</div>
													</div>
												{/if}
											{/snippet}
										</AlertDialog.Content>
									</AlertDialog.Portal>
								</AlertDialog.Root>
							</div>
						</div>
					</div>
				{/if}
			{/snippet}
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>

<style>
	.dark-line {
		background-image: linear-gradient(
			to right,
			rgba(0, 0, 0, 0) 0%,
			rgba(0, 0, 0, 0.13) 20%,
			rgba(0, 0, 0, 0.13) 80%,
			rgba(0, 0, 0, 0) 100%
		);
	}
	.highlight-line {
		background-image: linear-gradient(
			to right,
			rgba(255, 255, 255, 0) 0%,
			rgba(255, 255, 255, 0.3) 20%,
			rgba(255, 255, 255, 0.3) 80%,
			rgba(255, 255, 255, 0) 100%
		);
	}
</style>
