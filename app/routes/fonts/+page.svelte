<script lang="ts">
	import { createFonts, LoadFonts, local, url } from '$utils/Fonts'

	const Fonts = createFonts()

	Fonts.Face('Fixel', {
		src: url('https://large-assets.notnotjake.com/fonts/fixel/display/SemiBold.woff2').format(
			'woff2'
		),
		weight: 600,
		preload: true
	})

	Fonts.Face('Unbounded', {
		src: url('https://large-assets.notnotjake.com/fonts/unbounded/var.woff2')
			.format('woff2')
			.tech('variations'),
		preload: false
	})

	Fonts.Family('Pressura', {
		faces: [
			{
				src: url('https://large-assets.notnotjake.com/fonts/pressura/Regular.woff2').format(
					'woff2'
				),
				weight: 'regular'
			},
			{
				src: url('https://large-assets.notnotjake.com/fonts/pressura/Medium.woff2').format('woff2'),
				weight: 'medium'
			}
		],
		display: 'swap',
		sizeAdjust: 1.05
	})
</script>

<LoadFonts {Fonts} debug={true} />

<h1 class="font-['Fixel']">Hello, this is TEST. It should be displayed in Fixel font!</h1>

<h1 class="font-['Unbounded'] text-3xl font-bold">This should be Unbounded variable!!</h1>

<h1 class="font-['Pressura']">
	This is some pressura text! <span class="font-med">And this should be bold</span>
</h1>
