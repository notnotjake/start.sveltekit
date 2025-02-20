<script lang="ts">
	type Props = {
		data: Record<string, any>
		label: string
	}
	let { data, label = 'Debug Logger' }: Props = $props()

	// Helper function to format logs
	function logDebugData() {
		console.groupCollapsed(`%cDebug: ${label}`, 'color: #6a5acd; font-weight: bold;')
		for (const key in data) {
			console.groupCollapsed(`%c${key}`, 'color: #1e90ff; font-weight: bold;')
			const value = data[key]
			// Format arrays & objects nicely
			if (Array.isArray(value) || typeof value === 'object') {
				console.table(value)
			} else {
				console.log(value)
			}
			console.groupEnd()
		}
		console.groupEnd()
	}

	// Log when the component is mounted
	$effect(() => {
		logDebugData()
	})
</script>
