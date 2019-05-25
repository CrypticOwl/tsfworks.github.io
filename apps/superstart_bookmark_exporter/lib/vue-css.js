// USAGE:
// 	new VueCSS(name, cssText)
// DETAILS:
// 	appends <style data-vue-css=name> cssText </style> to <head>


class VueCSS {
	constructor(name, cssText) {

		// // Return, if <style> of the same name already added
		// if (document.head.querySelector(`[data-vue-css=${name}]`)) {
		// 	return
		// }

		// Create CSS
		const $style = document.createElement('style')
		$style.setAttribute('data-vue-css', name)
		$style.innerHTML = cssText

		// Append CSS
		document.head.appendChild($style)

	}
}

