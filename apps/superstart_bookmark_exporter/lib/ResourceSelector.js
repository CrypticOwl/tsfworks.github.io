/*
	<ResourceSelector 
		:urls='["./path/to/asset"]' 
		defaultUrl='./path/to/asset'
		type='file' 
		@loaded='asset = $event'
	/>
	
	type: 'json', 'text' or 'file'
*/

export default {
	template: `
		<span class='resource-selector'>
			<select v-model='selectedURL' @input='$event.target.blur()'>
				<option v-for='url in urls' v-text='url'></option>
			</select>
			<span v-text='status' class='chip-index'></span>
		</span>
	`,
	props: {
		urls: {
			type: Array,
			required: true
		},
		defaultURL: {
		},
		type: {
			default: 'text',
			validator(type) {
				return ['json', 'text', 'file'].indexOf(type) !== -1
			}
		}
	},
	data() {
		return {
			selectedURL: '',
			asset: '',
			status: ''
		}
	},
	watch: {
		selectedURL() {
			this.loadResource()
		},
		asset(newValue) {
			this.$emit('loaded', newValue)
		}
	},
	methods: {
		loadResource() {
			var url = this.selectedURL
			this.status = 'Fetching...'

			// Fetch data then add it to this.asset
			window.fetch(url)
				.then(response => {
					if (response.status != 200) {
						console.error(`Fetch failed (with ${response.status}): ${response.url}`)
						throw 'Failed to download'
					}
					return response
				})
				.then(response => {
					this.status = 'Processing... '

					switch (this.type) {
						case 'text':
							return response.text()
							break
						case 'json':
							return response.json()
							break
						case 'file':
							return response.blob()
							break
					}
				})
				.then(data => {

					switch (this.type) {
						case 'text':
							this.asset = data
							break
						case 'json':
							this.asset = data
							break
						case 'file':
							// data is a blob
							this.asset = new File([data], 'resource')
							break
					}

					this.status = ''
				})
				.catch(error => {
					this.status = error
				})
		}
	},
	created() {
		this.selectedURL = this.defaultURL || this.urls[0]
		this.loadResource()
	}
}

new VueCSS('resource-selector', `
	.resource-selector {
		font-size: inherit;
	}
`)