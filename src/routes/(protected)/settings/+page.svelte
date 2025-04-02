<script lang="ts">
	import Arrow from '$lib/theme/icons/arrow-circle-fill.svelte'

	let buttonWidth = $state(0)
</script>

<div class="mb-2 py-5">
	<h2 class="tracking-tight-md text-[1.3rem] leading-loose font-[550]">Settings</h2>
</div>

<div class="flex items-center justify-between py-2">
	<div class="flex w-fit gap-2">
		<p class="font-medium">Email</p>
		<p class="text-neutral-700">jake@notnotjake.com</p>
	</div>
	<button
		class="border-neutral-150 bg-neutral-150 box-content rounded-full border-1 px-3.5 py-1.5 text-[0.95rem] font-medium text-neutral-800 hover:border-neutral-200 hover:bg-neutral-200"
		>Change</button
	>
</div>

<div class="flex items-center justify-between py-2">
	<div class="flex w-fit gap-2 text-[0.95rem]">
		<p class="font-medium">Name</p>
		<p class="text-neutral-700">Jake Go</p>
	</div>
	<button
		class="text-vibrant-blue hover:bg-blue-0 rounded-full border-1 border-transparent px-3.5 py-1.5 text-[0.95rem] font-medium"
		>Edit</button
	>
</div>

<div class="shadow-primary my-3 w-full rounded-2xl border border-gray-200 px-3 py-2">
	<div class="flex items-center justify-between py-2 text-[0.95rem]">
		<p class="">Email: jake@notnotjake.com</p>
		<button
			class="border-neutral-150 bg-neutral-150 box-content rounded-full border-1 px-3.5 py-1.5 text-[0.95rem] font-medium text-neutral-800 hover:border-neutral-200 hover:bg-neutral-200"
			>Change</button
		>
	</div>
</div>

<div
	class="group focus-within:shadow-input-pop relative flex hidden h-11 h-[2.8rem] w-full flex-shrink-0 items-center overflow-hidden rounded-[0.9rem] bg-neutral-100 ring-1 ring-neutral-200"
>
	<input
		type="email"
		name="email"
		autocomplete="email"
		id="email"
		value="jake@notnotjake.com"
		placeholder="Continue with email"
		aria-label="Enter your email"
		class="h-full w-full flex-grow-1 translate-y-0 pl-4 font-[450] text-zinc-900 transition-all outline-none selection:bg-sky-200 selection:text-blue-600 placeholder:font-normal placeholder:text-neutral-500"
	/>
</div>

<div
	class="flex hidden h-full w-full flex-col items-center gap-3 rounded-[calc(1.3rem-0.5rem)] pt-7 pb-3"
>
	<a
		class="bg-vibrant-blue flex h-[2.8rem] w-full items-center justify-center rounded-[0.9rem] border-none px-3 text-[1.1rem] font-medium text-blue-50"
		href="/">Click to Login</a
	>
	<p
		class="flex h-[2.8rem] w-full items-center justify-center rounded-[0.9rem] border-none bg-neutral-200 px-3 font-mono text-[0.9rem] text-zinc-600"
	>
		951-028
	</p>

	<div class="h-12"></div>

	<div class="relative flex h-6 w-full flex-col items-center"></div>
</div>

<div class="w-break-full bg-neutral-150 my-3 h-1"></div>

<h2 class="mt-1 text-lg font-semibold">Account</h2>

<div class="flex items-center justify-between py-2">
	<div class="flex w-fit gap-2 text-[0.95rem]">
		<p class="font-medium">Login with Email</p>
		<p class="text-neutral-700">Allowed</p>
	</div>
	<button
		class="shadow-primary rounded-full border-1 border-neutral-300 px-3.5 py-1.5 text-[0.95rem] font-medium text-neutral-800 hover:border-neutral-300 hover:bg-neutral-100"
		>Disable</button
	>
</div>

<div class="bg-neutral-150 my-1.5 h-[1px] rounded-full"></div>

<div class="flex items-center justify-between py-2">
	<div class="flex w-fit gap-2 text-[0.95rem]">
		<p class="font-medium">Passkey</p>
		<p class="text-neutral-700">None Setup</p>
	</div>
	<button
		class="shadow-primary rounded-full border-1 border-neutral-300 px-3.5 py-1.5 text-[0.95rem] font-medium text-neutral-800 hover:border-neutral-300 hover:bg-neutral-100"
		>Add Passkey</button
	>
</div>

<div class="bg-neutral-150 my-1.5 h-[1px] rounded-full"></div>

<div class="flex items-center justify-between py-2">
	<div class="flex w-fit gap-2 text-[0.95rem]">
		<p class="font-medium">Password</p>
		<p class="text-neutral-700">None Setup</p>
	</div>
	<button
		class="shadow-primary rounded-full border-1 border-neutral-300 px-3.5 py-1.5 text-[0.95rem] font-medium text-neutral-800 hover:border-neutral-300 hover:bg-neutral-100"
		>Change Password</button
	>
</div>

<div class="bg-neutral-150 my-1.5 h-[1px] rounded-full"></div>

<div class="flex items-center justify-between py-2">
	<p class="">Log out on this device</p>
	<button
		class="rounded-full bg-neutral-700 px-3.5 py-1.5 text-[0.95rem] font-medium text-white hover:bg-neutral-800"
		>Log Out</button
	>
</div>

<div class="bg-neutral-150 my-1.5 h-[1px] rounded-full"></div>

<div class="flex items-center justify-between py-2">
	<p class="">Delete Account</p>
	<button
		class="rounded-full bg-red-500 px-3.5 py-1.5 text-[0.95rem] font-medium text-rose-50 hover:bg-red-600"
		>Delete Account</button
	>
</div>

<style>
	.shadow-primary {
		box-shadow:
			rgba(0, 0, 0, 0.07) 0px 0.602187px 0.602187px -1.166667px,
			rgba(0, 0, 0, 0.063) 0px 2.288533px 2.288533px -2.333333px,
			rgba(0, 0, 0, 0.03) 0px 10px 10px -3.5px;
	}
	.w-break-full {
		width: calc(100% + var(--padding-x) * 2 + 1px);
		margin-left: calc(var(--padding-x) * -1 - 1px);
		margin-right: calc(var(--padding-x) * -1 - 1px);
	}
</style>
