"use strict";

const VueDownloadButton = {
	template: `
		<button @click='handleClick'>
			<slot></slot>
		</button>
	`,
	props: {
		file: {

		},
		fileName: {
			type: String,
			default: 'File'
		},
		fileType: {
			default: 'text/plain'
		}
	},
	methods: {
		handleClick() {
			if (typeof this.file === 'undefined') {
				console.error('No file')
				return
			}

			// Create blob of the file
			if (typeof this.file === 'string') {
				var blob = new Blob([this.file], {type: this.fileType})
			}

			// Create <a> to click on
			var $a = document.createElement('a')
			$a.download = this.fileName
			$a.href = URL.createObjectURL(blob)
			$a.style.display = 'none'

			document.body.appendChild($a)
			$a.click()
			document.body.removeChild($a)
		}
	}
}





export default VueDownloadButton