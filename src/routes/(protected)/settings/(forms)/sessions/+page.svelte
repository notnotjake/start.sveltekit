<script lang="ts">
	let { data } = $props()

	function relativeTimeString(date: Date): string {
		const now = new Date()

		const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000)

		// Time intervals in seconds
		const intervals: Record<string, number> = {
			year: 365 * 24 * 60 * 6,
			month: 4 * 7 * 24 * 60 * 60,
			week: 7 * 24 * 60 * 60,
			day: 24 * 60 * 60,
			hour: 60 * 60,
			minute: 60,
			second: 1
		}

		// Check each interval
		for (const [unit, seconds] of Object.entries(intervals)) {
			const interval = Math.floor(secondsAgo / seconds)

			if (interval >= 1) {
				return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`
			}
		}
		return 'Just now'
	}
</script>

<div class="mx-auto mt-30 flex max-w-120 flex-col items-center justify-center">
	<div class=" w-full flex-col items-center justify-center px-7 py-5 text-center">
		<h2 class="tracking-tight-md animate-fade-in-scale text-[1.33rem] leading-loose font-[550]">
			Sessions
		</h2>
	</div>

	<div class="flex w-full flex-col gap-4">
		<p class="text-[0.95rem] font-medium">{data.activeSessions.length} Sessions</p>
		{#if data.activeSessions.length > 0}
			{#each data.activeSessions as session}
				<div class="flex justify-between">
					<h1 class="font-medium">{session.ipAddress}</h1>
					<p class="text-neutral-600">Last seen {relativeTimeString(session.lastSeenAt)}</p>
				</div>
			{/each}
		{:else}
			<div class="flex justify-between">
				<h1 class="font-medium">No Sessions Found</h1>
			</div>
		{/if}
	</div>

	<div class="mt-15 flex w-full flex-col gap-4">
		<h3 class="text-lg leading-1 font-medium">Past Sessions</h3>
		<p class="text-[0.95rem] font-medium">{data.invalidatedSessions.length} Sessions</p>
		{#if data.invalidatedSessions.length > 0}
			{#each data.invalidatedSessions as session}
				<div class="flex justify-between">
					<h1 class="font-medium">{session.ipAddress}</h1>
					<p class="text-neutral-600">Removed {relativeTimeString(session.invalidatedAt)}</p>
				</div>
			{/each}
		{:else}
			<div class="flex justify-between">
				<h1 class="font-medium">No Sessions Found</h1>
			</div>
		{/if}
	</div>
</div>
