<script lang="ts">
	import { AddMessage, LoadMessages } from '$utils/Meta.ts'

	AddMessage('test1')
	AddMessage('test2')

	// 	import { Meta, Metadata } from '$util/Meta.ts'
	//
	// 	Metadata({
	// 		title: 'Page Title',
	// 		description: 'Pade Description',
	// 		image: 'url-to-image'
	// 	})

	// look through the project and collect these, then use them to actually load the data SSR
	export const metadata = {
		title: ''
	}
</script>

<svelte:head></svelte:head>

<div>{@html LoadMessages()}</div>

<h1>This page has custom metadata loaded</h1>
