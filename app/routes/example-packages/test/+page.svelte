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

	Fonts.Face('Manrope', {
		src: url('https://large-assets.notnotjake.com/fonts/manrope/Medium.woff2').format('woff2'),
		weight: 'medium',
		preload: false
	})

	Fonts.Face('Unbounded', {
		src: url('https://large-assets.notnotjake.com/fonts/unbounded/var.woff2')
			.format('woff2')
			.tech('variations'),
		preload: false
	})

	// 	Fonts.Face('TestFace', {
	// 		preload: true,
	// 		src: url('test-url').format('ttf'),
	// 		weight: 'bold',
	// 		display: 'swap',
	// 		sizeAdjust: 1.2,
	// 		style: 'normal',
	// 		featureSettings: '"swsh" 50',
	// 		variationSettings: '"wdth" 100',
	// 		unicodeRange: 'U255+12',
	// 		lineGapOverride: 1.2,
	// 		ascentOverride: 0.9,
	// 		descentOverride: 1.1,
	// 		stretch: 'semi-expanded'
	// 	})
	//
	// 	Fonts.Family('Roboto', {
	// 		faces: [
	// 			{
	// 				src: [
	// 					url('font-url-400').format('woff2'),
	// 					url('font-url-400-ttf').format('ttf'),
	// 					local('Roboto')
	// 				],
	// 				weight: 400,
	// 				preload: true
	// 			},
	// 			{
	// 				src: url('font-url-500').format('woff2'),
	// 				weight: 500
	// 			},
	// 			{
	// 				src: url('font-url-400-italic').format('woff2'),
	// 				weight: 400,
	// 				style: 'italic'
	// 			}
	// 		],
	// 		display: 'swap',
	// 		sizeAdjust: 1.09
	// 	})
</script>

<LoadFonts {Fonts} debug={true} />

<h1 class="font-['Fixel']">Hello, this is TEST. It should be displayed in Fixel font!</h1>

<h1 class="font-['Unbounded'] text-3xl font-bold">This should be petrona variable!!</h1>
