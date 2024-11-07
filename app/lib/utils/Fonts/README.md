This utility makes it easier to import fonts. It does not handle font files, only the style and preload tags for making the font usable. It's recommended to self-host fonts, but any URL will work here.

Start by importing `createFonts` and either/both `local`, `url`
</br>Create a new instance of the Fonts object: `const Fonts = createFonts()` with the **createFonts()** factory function.

The Fonts object has two main methods, **Face** and **Family**.
Face lets you define a singular font face. Family allows you to quickly define multiple faces as part of a family. Inside family you will have a `faces` property alongside all other properties. 
</br>Setting properties on the family, they will be inherited on each face. Each face can however override those properties with their own properties.
</br>Every face is required to have a `src` defined. This can be either a `url()` or `local()`.


```
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

<LoadFonts {Fonts} debug={false} />
```
