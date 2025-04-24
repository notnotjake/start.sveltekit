export function createVariants(definition, props) {
	// Object to return with classes and variant values
	const result = {
		classes: '',
		// Add properties for each variant type
		...Object.keys(definition)
			.filter((key) => key !== 'base' && key !== 'compound')
			.reduce((acc, key) => ({ ...acc, [key]: undefined }), {})
	}

	// Start with base classes
	let classList = definition.base || ''

	// Process each variant group
	for (const [groupName, groupConfig] of Object.entries(definition)) {
		if (groupName === 'base' || groupName === 'compound') continue

		// Check if this variant was passed as a prop
		const propValue = props[groupName]

		if (propValue !== undefined) {
			// Store the selected variant value
			result[groupName] = propValue

			// Add classes if this variant exists in the definition
			if (groupConfig[propValue]) {
				classList += ' ' + groupConfig[propValue]
			}
			// If it's a string but not a defined variant, use directly as a class
			else if (typeof propValue === 'string') {
				classList += ' ' + propValue
			}
		}
		// No prop passed, use default if available
		else if (groupConfig._default) {
			const defaultValue = groupConfig._default

			// Store the default variant value
			if (groupConfig[defaultValue]) {
				result[groupName] = defaultValue
				classList += ' ' + groupConfig[defaultValue]
			} else {
				result[groupName] = '_custom'
				classList += ' ' + defaultValue
			}
		}
	}

	// Process compound variants
	if (definition.compound) {
		for (const compound of definition.compound) {
			// Check if all conditions in this compound variant match
			const isMatch = Object.entries(compound).every(([key, value]) => {
				// Skip the 'classes' property
				if (key === 'classes') return true
				return result[key] === value
			})

			// If all conditions match, add the compound classes
			if (isMatch && compound.classes) {
				classList += ' ' + compound.classes
			}
		}
	}

	// Store the final class string
	result.classes = classList.trim()

	return result
}
