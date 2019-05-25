// Normalize different browsers prefixed Fullscreen API
(function fullscreenPolyfill() {

	// Normalize fullscreen functions
	var el = Element.prototype;
	el.requestFullscreen = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;

	document.exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;


	// Polyfill: document.onfullscreenchange
	if (document.onfullscreenchange === undefined) {
		var dispatchFS = function() {
			var eventFS = new CustomEvent("fullscreenchange");
			document.dispatchEvent(eventFS);
		};
		if (document.onmozfullscreenchange === null)
			document.onmozfullscreenchange = dispatchFS;
		if (document.onwebkitfullscreenchange === null)
			document.onwebkitfullscreenchange = dispatchFS;
		if (document.MSFullscreenChange === null)
			document.MSFullscreenChange = dispatchFS;
		
		// Polyfill: document.fullscreenEnabled, document.fullscreenElement
		document.addEventListener("fullscreenchange", function() {
			document.fullscreenEnabled = document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled;
			document.fullscreenElement = document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.webkitFullscreenElement;
		});
	}
})();



// Icons from Google's Material UI 
const Icons = {
	fullscreen: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		    <path d="M0 0h24v24H0z" fill="none"/>
		    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
		</svg>
	`,
	fullscreen_exit: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		    <path d="M0 0h24v24H0z" fill="none"/>
		    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
		</svg>
	`
}



const FullscreenButton = {
	template: `
		<button v-html='icon' @click='toggleFullscreen'></button>
	`,
	props: {
		targetElement: {
			default: undefined,
			validator() {

			}
		}
	},
	data() {
		return {
			inFullscreen: false,

			// To restore focus
			lastFocusedElement: null,
			lastFocusoutTime: 0,

			// To restore element width and height
			lastElementStyle: {
				width: '',
				height: '',
				boxSizing: ''
			}
		}
	},
	computed: {
		icon() {
			if (this.fullscreenSupported) {
				return this.inFullscreen ? Icons.fullscreen_exit : Icons.fullscreen
			} else {
				return ''
			}
		},
		fullscreenSupported() {
			if (Element.prototype.requestFullscreen && document.exitFullscreen) {
				return true
			} else {
				console.error('FullscreenButton.js: Fullscreen not supported')
				return false
			}
		}
	},
	methods: {
		toggleFullscreen() {

			// Restore focus on last focused element
			this.restoreFocus()

			// Request fullscreen, or exit fullscreen
			var el = this.targetElement || this.$parent.$el

			if (document.fullscreenElement) {
				document.exitFullscreen()
			} else {
				el.requestFullscreen()
			}
		},
		restoreFocus() {
			// If last focusout is less than 150ms away, 
			// 	assume its caused by the fullscreen button, ie. it's not defocused
			if (performance.now() - this.lastFocusoutTime < 150) {
				this.lastFocusedElement && this.lastFocusedElement.focus()
			}
		},
		// To tracked last focused element
		onFocusChange(e) {
			// New element focus, that is not the fullscreen button
			if (e.type === 'focusin' && !(e.target === this.$el)) {
				this.lastFocusedElement = document.activeElement
				return
			}

			// Element defocus (assume caused by fullscreen first)
			if (e.type === 'focusout') {
				this.lastFocusoutTime = performance.now() // see refocus code
				return
			}
		},
		onfullscreenchange() {
			
			var el = this.targetElement || this.$parent.$el

			if (document.fullscreenElement) {

				this.inFullscreen = true

				// Fill element to screen
				this.lastElementStyle = {
					width: el.style.width,
					height: el.style.height,
					boxSizing: el.style.boxSizing,
				}
				el.style.width = '100vw'
				el.style.height = '100vh'
				el.style.boxSizing = 'border-box'

			} else {

				this.inFullscreen = false

				// Restore: undo fill element to screen
				el.style.width = this.lastElementStyle.width
				el.style.height = this.lastElementStyle.height
				el.style.boxSizing = this.lastElementStyle.boxSizing

			}
		}
	},
	created() {

		// For restoring focus: update this.lastFocusedElement
		document.addEventListener('focusin', this.onFocusChange)
		document.addEventListener('focusout', this.onFocusChange)

		// Update fullscreen status
		document.addEventListener('fullscreenchange', this.onfullscreenchange)
	},
	destroyed() {
		document.removeEventListener('focusin', this.onFocusChange)
		document.removeEventListener('focusout', this.onFocusChange)
	}
}







export default FullscreenButton