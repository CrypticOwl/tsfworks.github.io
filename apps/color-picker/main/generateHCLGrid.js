import mathUtil from './mathUtil.js'

export default function generateHCLGrid(ctx, numX, numY, options) {
	numX = numX || 10
	numY = numY || 10
	options = options || {}
	options.H = options.H || 'x'
	options.C = options.C || 'y'
	options.L = options.L || 50
	options.shape = options.shape || 'square'


	let width = ctx.canvas.width
	let height = ctx.canvas.height
	let dotSizeX = width / numX
	let dotSizeY = height / numY

	// Clear canvas
	ctx.clearRect(0, 0, width, height)

	// L: 0 to 100
	// C: -200 to 200
	// H: 0 to 360
	const MaxL = 100
	const MaxC = 200
	const MaxH = 360

	// Find and set axis values
	let components = {
		H: options.H,
		C: options.C,
		L: options.L
	}
	let axis = {
		x: undefined,
		y: undefined,
		constants: []
	}
	Object.keys(components).forEach(k => {
		let componentValue = components[k]

		// Map axis
		if (componentValue === 'x') {
			axis.x = k
		}
		else if (componentValue === 'y') {
			axis.y = k
		}

		// Map constants
		if (typeof componentValue === 'number') {
			axis.constants.push({
				component: k,
				value: componentValue
			})
		}
	})

	// Set constant component(s) values
	for (let i = 0; i < axis.constants.length; i++) {
		let component = axis.constants[i].component
		let value = axis.constants[i].value

		if (component === 'L') { var L = value }
		if (component === 'C') { var C = value }
		if (component === 'H') { var H = value }
	}


	// Grid
	for (let x = 0; x < numX; x++) {

		// Set x-axis component value
		if (axis.x === 'L') { var L = mathUtil.map(x, 0, numX, MaxL, 0) }
		if (axis.x === 'C') { var C = mathUtil.map(x, 0, numX, MaxC, 0) }
		if (axis.x === 'H') { var H = mathUtil.map(x, 0, numX, 0, MaxH) }

		for (let y = 0; y < numY; y++) {

			// Set y-axis component value
			if (axis.y === 'L') { var L = mathUtil.map(y, 0, numY, MaxL, 0) }
			if (axis.y === 'C') { var C = mathUtil.map(y, 0, numY, MaxC, 0) }
			if (axis.y === 'H') { var H = mathUtil.map(y, 0, numY, 0, MaxH) }

			// Make and draw color dot
			let color = colorspaces.make_color('CIELCHuv', [L, C, H])
			if (color.is_displayable()) {
				drawColor({
					ctx,
					rgb: color.as('sRGB'), 
					x: x * dotSizeX, 
					y: y * dotSizeY, 
					size: dotSizeX,
					shape: options.shape
				})
			}
			else if (color.is_visible()) {
				drawColor({
					ctx,
					rgb: [0.95, 0.95, 0.95], 
					x: x * dotSizeX, 
					y: y * dotSizeY, 
					size: dotSizeX,
					shape: options.shape
				})
			}
			else {
			}
		}

	}
}



function drawColor({ctx, rgb, x, y, size, shape}) {
	if (!Array.isArray(rgb)) {
		console.error('drawColor: input not array', rgb)
		return
	}

	// Set default options and alias
	let [r, g, b] = rgb
	x = x || 0
	y = y || 0
	size = size || 5
	shape = shape || 'square'

	// Set pen color
	ctx.fillStyle = `rgb(${r * 255}, ${g * 255}, ${b * 255})`

	// Draw on canvas
	if (shape === 'square') {
		ctx.fillRect(x, y, size, size)
	}

	if (shape === 'circle') {
		let r = size / 2
		let cx = x + r
		let cy = y + r
		ctx.beginPath()
		ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2)
		ctx.fill()
	}
}