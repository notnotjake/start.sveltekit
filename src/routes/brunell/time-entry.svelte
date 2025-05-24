<script lang="ts">
	let hour = $state<number>(8)
	let minutes = $state<number>(45)
</script>

<div class="flex font-mono text-[1.2rem] font-semibold">
	<div>
		<p>0{hour}</p>
	</div>
	<div>:</div>
	<div>
		<p>{minutes}</p>
	</div>
</div>
