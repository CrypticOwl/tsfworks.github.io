const ResourceSelector = {
	template: `
		<span class='resource-selector'>
			<select v-model='selected' @input='$event.target.blur()'>
				<option v-for='assetName in assetNames' v-text='assetName'></option>
			</select>
			<span v-text='status' class='chip-index'></span>
		</span>
	`,
	props: {
		assetNames: {
			type: Array,
			required: true
		},
		default: {
		}
	},
	data() {
		return {
			selected: '',
			assetData: '',
			status: ''
		}
	},
	watch: {
		selected() {
			this.loadResource()
		},
		assetData(newValue) {
			this.$emit('loaded', newValue)
		}
	},
	methods: {
		loadResource() {
			var url = `./assets/${this.selected}`
			this.status = 'Fetching...'

			// Fetch data then add it to this.assetData
			window.fetch(url)
				.then(response => {
					if (response.status != 200) {
						console.error(`Fetch failed (with ${response.status}): ${response.url}`)
						throw 'Failed to download'
					}
					return response.text()
				})
				.then(text => {
					this.status = 'Processing... '
					this.assetData = text.split('\n')
					this.status = ''
				})
				.catch(error => {
					this.status = error
				})
			}
	},
	created() {
		this.selected = this.default || this.assetNames[0]
		this.loadResource()
	}
}

new VueCSS('resource-selector', `
	.resource-selector {
		font-size: inherit;
	}
`)


export default ResourceSelector