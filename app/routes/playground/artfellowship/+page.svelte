<script lang="ts">
	import { assetUrl } from '$utils/asset-url'
	import { createFonts, LoadFonts, url } from '$utils/Fonts'
	import './styles.css'

	const Fonts = createFonts()

	Fonts.Face('Source Serif', {
		src: url(assetUrl('fonts/source-serif/small-text/Light.woff2')).format('woff2'),
		// weight: 'light',
		preload: true
	})

	Fonts.Face('Unbounded', {
		src: url('https://large-assets.notnotjake.com/fonts/unbounded/var.woff2')
			.format('woff2')
			.tech('variations'),
		preload: false
	})
</script>

<LoadFonts {Fonts} debug={true} />

<div class="bgg-blue-yellow-plain flex min-h-screen w-full items-center justify-center">
	<div>
		<h1
			class="py-2.75 bg-[linear-gradient(to_bottom,_#0A00A3_6%,_#1977EB_32%,_#D58EFF_92%)] bg-[length:100%_100%] bg-clip-text bg-[position:left_top] bg-no-repeat font-['Source_Serif'] text-[clamp(2.6rem,6vw,4.38rem)] font-light tracking-[-0.015em] text-transparent"
		>
			Art Fellowship Practice
		</h1>

		<div class="mt-8 flex flex-col items-center justify-center gap-3">
			<h1
				class="bg-[linear-gradient(to_bottom,_#2484F9_6%,_#5C64F9_32%,_#008AF4_92%)] bg-clip-text font-['Source_Serif'] text-3xl font-light tracking-[-0.015em] text-transparent"
			>
				Richmond, VA
			</h1>
			<h2 class="rounded-full bg-slate-50 px-2.5 py-0.5 font-medium text-zinc-600">Fall 2024</h2>
		</div>
	</div>
</div>

<h1>Looking for Participants</h1>
