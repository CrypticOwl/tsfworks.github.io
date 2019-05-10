const WordSearch = {
	template: `
		<div class='word-search'>

			<div>
				<input type="text" placeholder="Search" v-model="searchString" autofocus style="width:30ch">

				<label style="font-size:0.8em" title="Enable or disable interpretation of search input as Regular Expression">
					<input type="checkbox" v-model="useRegex">
					<span>Using Regex Search</span>
				</label>

				<span class="chip-index" style="font-size:0.8em; font-weight:400">
					{{ status }}
				</span>
			</div>

			<div>

				<span>Sort by:</span>
				<select v-model='sortBy' @input='$event.target.blur()'>
					<option v-for='sortFn,option in sortByOptions' v-text='option'></option>
				</select>

				<button v-if='sortBy === "Shuffle"' @click='shuffleWordsFound'>⟳</button>

				<!--
				<label>
					<input type='radio' value='a-z' v-model='sortBy'>
					<span>a-z</span>
				</label>
				<label>
					<input type='radio' value='z-a' v-model='sortBy'>
					<span>z-a</span>
				</label>
				<label>
					<input type='radio' value='Longest' v-model='sortBy'>
					<span>Longest</span>
				</label>
				<label>
					<input type='radio' value='Shortest' v-model='sortBy'>
					<span>Shortest</span>
				</label>
				-->
			</div>
		</div>
	`,
	props: {
		list: {
			type: Array,
			default: () => []
		},
	},
	data() {
		return {
			searchString: '',
			useRegex: true,

			sortByOptions: {
				'a-z': (a, b) => {
					if (a < b) return -1
					if (a > b) return 1
					return 0
				},
				'z-a': (a, b) => {
					if (a > b) return -1
					if (a < b) return 1
					return 0
				},
				'Longest': (a, b) => {
					if (a.length > b.length) return -1
					if (a.length < b.length) return 1
					return 0
				},
				'Shortest': (a, b) => {
					if (a.length < b.length) return -1
					if (a.length > b.length) return 1
					return 0
				},
				'Shuffle': () => {
				}
			},
			sortBy: 'Shuffle',
			wordsFound: []
		}
	},
	computed: {
		wordsFoundRaw: function() {
			// Copy list
			var w = this.list.slice()

			// Options
			var searchString = this.searchString
			var useRegex = this.useRegex

			// Search
			if (useRegex) {
				searchString = RegExp(searchString)
				w = w.filter(word => {
					return searchString.test(word)
				})
			} else {
				w = w.filter(word => {
					return word.includes(searchString)
				})
			}

			// Sort
			if (this.sortBy !== 'Shuffle')
				w.sort(this.sortByOptions[this.sortBy])

			return w
		},
		status() {
			if (this.searchString) {
				return `${this.wordsFound.length} words found.`
			} else if (this.list.length) {
				return `${this.list.length} words loaded.`
			} else {
				return ''
			}
		}
	},
	watch: {
		wordsFoundRaw(w) {
			this.wordsFound = w

			if (this.sortBy === 'Shuffle') {
				this.shuffleWordsFound()
			}
		},
		wordsFound() {
			this.$emit('wordsFound', this.wordsFound)
		}
	},
	methods: {
		shuffleWordsFound() {
			function durstenfeldShuffle(array) {
				for (let i = array.length - 1; i > 0; i--) {
				  const j = Math.floor(Math.random() * (i + 1));
				  [array[i], array[j]] = [array[j], array[i]];
				}
			}

			var w = this.wordsFoundRaw.slice()
			durstenfeldShuffle(w)
			this.wordsFound = w
		},
	},
}

new VueCSS('word-search', `
	.word-search {
		padding-bottom: 0.2em;
		margin: 0.6em 0;
		border-bottom: 1px solid #CCC;
	}
`)


export default WordSearch