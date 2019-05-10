const LazyList = {
	template: `
		<div class='lazy-list' @scroll='handleBottomReached'>	

			<span v-for='item,i in displayedList' class='chip'>
				<span v-text='item'></span>
				<span v-text='i+1' class='chip-index'></span>
			</span>

			<div>
				<span v-if='displayedList.length >= list.length' class='chip chip-index'>
					<template v-if='list.length === 0'>
						No items. 
					</template>
					<template v-else-if='list.length === 1'>
						{{ list.length }} item total.
					</template>
					<template v-else>
						{{ list.length }} items total.
					</template>
				</span>
				<button v-else @click='loadMore' class='chip chip-index'>
					{{ list.length - displayedList.length }} more items.
				</button>
			</div>

			<span ref='scrollVisibilityTester'></span>
		</div>
	`,
	props: {
		list: {
			type: Array,
			default: () => []
		},
		initial: {
			default: 100
		},
		increment: {
			default: 100
		}
	},
	data() {
		return {
			displayedListLength: this.initial
		}
	},
	computed: {
		displayedList() {
			return this.list.slice(0, this.displayedListLength);
		}
	},
	methods: {
		loadMore() {
			this.displayedListLength += +this.increment
		},
		handleBottomReached() {
			if (!this.$el) {
				return
			}


			// Check if bottom reached
			// 	by checking if scrollVisibilityTester is visible,
			// 	this avoids the issue of having to set the component's height directly
			var boundingRect = this.$refs.scrollVisibilityTester.getBoundingClientRect()
			var bottomVisible = boundingRect.y <= window.innerHeight


			// Load more on next tick, if still needed
			if (bottomVisible && this.displayedListLength < this.list.length) {
				this.loadMore()
				Vue.nextTick(this.handleBottomReached)
			}
		}
	},
	watch: {
		list() {
			this.handleBottomReached()
		}
	},
	mounted() {
		window.addEventListener('scroll', this.handleBottomReached)
		window.addEventListener('resize', this.handleBottomReached)
	},
	beforeDestroy() {
		window.removeEventListener('scroll', this.handleBottomReached)
		window.addEventListener('resize', this.handleBottomReached)
	},
	updated() {
		this.handleBottomReached()
	}
};



new VueCSS('lazy-list', `

`)



export default LazyList