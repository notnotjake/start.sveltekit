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

	let passkeysFormatted = null
	if (data.passkeys) {
		passkeysFormatted = data.passkeys.map((item) => {
			return {
				...item,
				relativeTime: relativeTimeString(item.createdAt)
			}
		})
	}

	console.log(data.passkeys)
</script>

<div class="mx-auto mt-30 flex max-w-90 flex-col items-center justify-center">
	<div class=" w-full flex-col items-center justify-center px-7 py-5 text-center">
		<h2 class="tracking-tight-md animate-fade-in-scale text-[1.33rem] leading-loose font-[550]">
			Passkeys
		</h2>
	</div>

	<div class="flex w-full flex-col gap-4">
		{#if data.passkeys.length > 0}
			{#each passkeysFormatted as passkey}
				<div class="flex justify-between">
					<h1 class="font-medium">{passkey.name}</h1>
					<p class="text-neutral-600">Added {passkey.relativeTime}</p>
				</div>
			{/each}
		{:else}
			<div class="flex justify-between">
				<h1 class="font-medium">No Passkeys Found</h1>
			</div>
		{/if}
	</div>
</div>
