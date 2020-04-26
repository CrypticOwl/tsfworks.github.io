// Generate analogous, monochromatic, triad, tetrad etc
// 
// References
// 	LAB vs LUV: https://www.burosch.de/understanding-delta-e.html
// 	colorspace.js: https://github.com/boronine/colorspaces.js/

const Settings = {
	width: 1000,
	height: 1000,
	divX: 20,
	divY: 20,
	pixelSize: 5	// As rendered by colorspace
}




import colorspaces from './lib/colorspaces.modified.js'
import generateHCLGrid from './main/generateHCLGrid.js'

const $app = document.querySelector('#app')

// Plot L against C in HCL
const $canvas1 = createCanvasElement({
	$parent: $app,
	width: 1000,
	height: 1000
})

createRangeElement({
	$parent: $app,
	label: 'Hue',
	min: 0, 
	max: 360,
	onInput(v) {
		genLC(v)
	}
})

genLC(180)
function genLC(H) {
	let ctx = $canvas1.getContext('2d')
	// generateHCLGrid(ctx, 100, 100, { x: 'L', y: 'C', constant: H, shape: 'square'})
	generateHCLGrid(ctx, 100, 100, { L: 'x', C: 'y', H, shape: 'square'})
}



// Plot H in HCL
const $canvasHue = createCanvasElement({
	$parent: $app,
	width: 360,
	height: 20
})
let canvasHueC = 50
let canvasHueL = 75
createRangeElement({
	$parent: $app,
	label: 'Chroma',
	min: 0, 
	max: 200,
	value: 75,
	onInput(C) {
		canvasHueC = C
		genHue()
	}
})
createRangeElement({
	$parent: $app,
	label: 'Lightness',
	min: 0, 
	max: 100,
	value: 75,
	onInput(L) {
		canvasHueL = L
		genHue()
	}
})

genHue()
function genHue() {
	let C = canvasHueC
	let L = canvasHueL
	let ctx = $canvasHue.getContext('2d')
	generateHCLGrid(ctx, 36, 20, { H: 'x', C, L, shape: 'square'})
}





// Plot H against C in HCL
const $canvasHC = createCanvasElement({
	$parent: $app,
	width: 360,
	height: 200
})

createRangeElement({
	$parent: $app,
	label: 'Lightness',
	min: 0, 
	max: 100,
	value: 75,
	onInput(v) {
		genHC(v)
	}
})

genHC(75)
function genHC(L) {
	let ctx = $canvasHC.getContext('2d')
	// generateHCLGrid(ctx, 90, 50, { x: 'H', y: 'C', constant: L, shape: 'square'})
	generateHCLGrid(ctx, 90, 50, { H: 'x', C: 'y', L, shape: 'square'})
}





// DOM utilities

function createRangeElement({$parent, label, min, max, step, value, onInput, onChange}) {
	label = label || ''
	min = min || 0
	max = max || 100
	value = value || ( (min + max) / 2 )


	// Create label, which will contain the range element
	let $label = document.createElement('label')

	// Create span element for label text
	let $labelText = document.createElement('span')
	$labelText.innerText = label
	$label.appendChild($labelText)

	// Create range element
	let $range = document.createElement('input')
	$range.type = 'range'
	$range.min = min
	$range.max = max
	$range.value = value
	step && ($range.step = step)

	onInput && $range.addEventListener('input', e => {
		onInput(parseFloat(e.target.value))
	})
	onChange && $range.addEventListener('change', e => {
		onChange(parseFloat(e.target.value))
	})

	$label.appendChild($range)

	// Create an element that reflects the range element's value
	let $rangeValue = document.createElement('input')
	$rangeValue.type = 'number'
	$rangeValue.style.width = '7ch'
	$rangeValue.value = $range.value
	$rangeValue.addEventListener('input', e => {
		$range.value = $rangeValue.value
		onInput(parseFloat(e.target.value))
	})
	$range.addEventListener('input', e => {
		$rangeValue.value = $range.value
	})
	$label.appendChild($rangeValue)


	// Append element
	$parent = $parent || document.body
	$parent.appendChild($label)
}



function createCanvasElement({$parent, width, height}) {
	$parent = $parent || document.body
	width = width || 100
	height = height || 100

	// Create canvas
	const $canvas = document.createElement('canvas')
	$parent.appendChild($canvas)

	// Set ctx size
	$canvas.width = width
	$canvas.height = height
	$canvas.style.width = '100%'
	// $canvas.style.height = '200px'

	return $canvas
}