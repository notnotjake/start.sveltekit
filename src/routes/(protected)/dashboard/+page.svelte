<script lang="ts">
	import LogoutButton from '$ui/auth/logout.svelte'

	import AccountButton from '$ui/auth/account.svelte'

	let { data } = $props()
</script>

<AccountButton user={data.user} />

<div class="flex min-h-full w-full flex-col items-center justify-center">
	<div class="mb-9 flex flex-col items-center">
		<h2 class="text-2xl font-semibold">
			Welcome back <span class="text-neutral-500">{data.userName}</span>
		</h2>
		<p class="text-lg font-medium text-neutral-500">{data.userEmail}</p>
	</div>

	<div class="flex min-w-32 flex-col justify-center gap-2">
		<a
			class="text-neutal-500 rounded-full bg-neutral-200 px-4 py-2 text-center font-medium"
			href="/settings">Settings</a
		>
		<LogoutButton class="rounded-full bg-neutral-800 px-4 py-2 font-medium text-neutral-100" />
	</div>
</div>
