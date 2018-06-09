"use strict";
var t0 = performance.now();

var stdComponents = {
	whiteBox: {
		template: `<div class="white-box">
			<h5>
				{{ title }}
				<fullscreenButton :style="style.fullscreenButton"></fullscreenButton>
			</h5>
			<slot></slot>
		</div>`,
		data: function() {
			return {
				style: {
					fullscreenButton: `
						float: right;
						font-size: 8.5pt;
					`
				}
			};
		},
		components: {
			fullscreenButton: {
				template: `<button @click="toggleFullscreen">
					{{ buttonText }}
				</button>`,
				data: function() {
					return {
						buttonText: "Fullscreen"
					}
				},
				methods: {
					toggleFullscreen: function() {
						var el = this.$parent.$el;
						if (document.fullscreenElement) {
							document.exitFullscreen();
						} else {
							el.requestFullscreen();
						}
					}
				},
				mounted: function() {
					function fullscreenNotSupported() {
						console.log("Error: Fullscreen not supported");
					}
					var el = this.$parent.$el;
					el.requestFullscreen = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen || fullscreenNotSupported;
					document.exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen || fullscreenNotSupported;

					
					// Polyfill: document.onfullscreenchange
					if (document.onfullscreenchange === undefined) {
						var dispatchFS = function() {
							var eventFS = new CustomEvent("onfullscreenchange");
							document.dispatchEvent(eventFS);
						};
						if (document.onmozfullscreenchange === null)
							document.onmozfullscreenchange = dispatchFS;
						if (document.onwebkitfullscreenchange === null)
							document.onwebkitfullscreenchange = dispatchFS;
						if (document.MSFullscreenChange === null)
							document.MSFullscreenChange = dispatchFS;
						
						// Polyfill: document.fullscreenEnabled, document.fullscreenElement
						document.addEventListener("onfullscreenchange", function() {
							document.fullscreenEnabled = document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled;
							document.fullscreenElement = document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.webkitFullscreenElement;
						});
					}

					var self = this;
					document.addEventListener("onfullscreenchange", function() {
						if (document.fullscreenElement) {
							self.buttonText = "Exit Fullscreen";
						} else {
							self.buttonText = "Fullscreen";
						}
					});


				}
			}
		},
		props: {
			title: {
				type: String,
				default: ""
			}
		}
	},
	inlineBox: {
		template: `<div class="inline-box">
			<h6>{{ title }}</h6>
			<slot></slot>
		</div>`,
		props: {
			title: {
				type: String,
				default: ""
			}
		}
	},
	consoleIntercept: {
		template: `<header class="white-box">
			<h1>V101</h1>
			<div>
				<strong style="color:green">Vue test live</strong>
			</div>
			<div>
				<a style="font-size:9pt; color:inherit" href="https://vuejs.org/v2/guide/" target="_blank">https://vuejs.org/v2/guide/</a>
			</div>
			<ol :style="consoleInterceptStyle">
				<li v-for="line in consoleInterceptLines">
					{{ line }}
				</li>
			</ol>
		</header>`,
		data: function() {
			return {
				consoleInterceptStyle: `
					display: block;
					height: 3.5em;
					min-height: 3.5em;

					border: 1px dashed #DDD;
					margin: 0.5em 0;
					padding: 0.5em 0.5em 0.5em 3em;

					background: hsla(0, 0%, 0%, 0.02);
					font: 9pt monospace;
					color: #666;

					overflow: auto;
					resize: vertical;
				`,
				consoleInterceptLines: []
			};
		},
		mounted: function() {
			var self = this;

			// checks if consoleIntercept is already initialized
			if (window.console.logNative !== undefined) {
				console.log("console-intercept.js: already initialized");
				return;
			}
			window.console.logNative = window.console.log;


			// replace native console.log
			window.console.log = function() {
				// ??? voodoo logic
				var output = [];
				for (let i=0; i< arguments.length; i++) {
					switch (typeof arguments[i]) {
						case "object":
							var prototype = Object.prototype.toString.call(arguments[i]);
							output.push(prototype + " " + JSON.stringify(arguments[i]));
							break;
						default: 
							output.push(arguments[i]);
							break;
					}
				}

				// add to data
				self.consoleInterceptLines.push(output.join(" "));

				// scroll to bottom
				var ol = self.$el.querySelector("ol");
				ol.scrollTop = ol.scrollHeight + 1e5;

				// 
				window.console.logNative(...arguments);
			}
		}
	}
};


var subitizingTrainer = {
	template: `<div tabindex="1" @click="generateCircles" @keypress.enter.space="generateCircles">
		<div>
			<input v-model="nCircles" type="number" style="width:4ch"></input>
			<label>
				<input v-model="randomColor" type="checkbox"></input>
				Randomize Color
			</label>
		</div>
		<svg v-bind="svgAttr">
			<circle v-for="circle in circles" v-bind="circle"/>
		</svg>
	</div>`,
	data: function() {
		return {
			svgAttr: {
				viewBox: "-5 -5 110 50",
				viewPort: "0, 0, 0, 0",
				xmlns: "http://www.w3.org/2000/svg",
				autofocus: true,
				style: "cursor: none"
			},
			nCircles: 6,
			circles: [],
			randomColor: true
		};
	},
	mounted: function() {
		this.generateCircles();
	},
	methods: {
		generateCircles: function() {
			var n = this.nCircles;

			n = (n>=1)? n : 1;

			function generateCircle(r, existingCircles) {
				function getDistance(x1, y1, x2, y2) {
					var x = Math.abs(x2 - x1),
						y = Math.abs(y2 - y1);
					return Math.sqrt( Math.pow(x,2) + Math.pow(y,2));
				}

				function isTooNear(newCircle, existingCircles, nearDistance) {
					for (let i=0; i<existingCircles.length; i++) {
						let x1 = newCircle.cx;
						let y1 = newCircle.cy;
						let x2 = existingCircles[i].cx;
						let y2 = existingCircles[i].cy;

						let distance = getDistance(x1, y1, x2, y2);

						if (distance < nearDistance)
							return true;
					};
					return false;
				}

				var newCircle = {
					 cx: Math.random()*100,
					 cy: Math.random()*40,
					 r: r
				};

				newCircle = isTooNear(newCircle, existingCircles, r*2) ?
					generateCircle(r, existingCircles) : newCircle;

				return newCircle;
			}

			function randomColor(s, l) {
				var h = Math.random() * 360;
				s = s || "50%";
				l = l || "45%";

				return "hsl(" + h + "," + s + "," + l + ")";
			}


			var circles = [];
			n = Math.floor(Math.random() * n/2 + n/2) + 1;
			for (let i=0; i<n; i++) {
				var newCircle = generateCircle(2, circles);
				if (this.randomColor)
					newCircle.fill = randomColor();

				circles.push(newCircle);
			}

			// var circles = new Array(10).fill().map(function(circle) {
			// 	return generateCircle(2);
			// });


			this.circles = circles;
		}
	}
}







var app = new Vue({
	el: "#vue-app",
	template: `<div id="vue-app">
		<consoleIntercept></consoleIntercept>
		<whiteBox title="Subitizing Trainer">
			<subitizingTrainer></subitizingTrainer>
		</whiteBox>
	</div>`,
	components: {
		whiteBox: stdComponents.whiteBox,
		inlineBox: stdComponents.inlineBox,
		consoleIntercept: stdComponents.consoleIntercept,
		subitizingTrainer: subitizingTrainer
	},
	mounted: function() {
		console.log("Vue app mounted: " + (performance.now() - t0).toFixed(0) + "ms");
	}
});

