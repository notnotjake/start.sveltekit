<script lang="ts">
	import ProgressRadial from '$ui/feedback/progress-radial.svelte'
</script>

<p></p>

<div class="w-full pt-5">
	<p class="tracking-tight-md animate-fade-in-scale w-full text-center">
		A login link has been sent to your email
	</p>
	<div class="flex w-full items-center justify-center gap-1">
		<button class="tracking-tight-sm cursor-pointer text-[0.93rem] font-[350] text-neutral-900">
			Resend
		</button>
		<ProgressRadial totalTime={20} currentTime={1} />
	</div>
</div>
