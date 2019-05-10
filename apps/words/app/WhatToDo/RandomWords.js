

const RandomWords = {
	template: `
		<span>
			{{ randomWords.join(', ') }}
		</span>
	`,
	props: {
		wordList: {
			type: Array,
			required: true
		},
		interval: {
			default: 500
		},
		count: {
			default: 3
		}
	},
	data() {
		return {
			randomWords: [],
			intervalFn: null
		}
	},
	computed: {
	},
	methods: {
		selectRandomWords() {
			if (!this.wordList) {
				return
			}

			// Clear
			this.randomWords.length = 0

			// Get this.count number of random words
			for (let i=0; i<this.count; i++) {
				// Get a random index
				var randomIndex = Math.floor(Math.random() * (this.wordList.length))

				// Select the word
				this.randomWords.push( this.wordList[randomIndex] )
			}

		},
		resetInterval() {
			if (this.intervalFn) {
				clearInterval(this.intervalFn)
			}

			this.intervalFn = setInterval(this.selectRandomWords, this.interval)
		}
	},
	watch: {
		wordList() {
			this.resetInterval()
		},
		interval() {
			this.resetInterval()
		},
		count() {
			this.resetInterval()
		},
	},
}







export default RandomWords