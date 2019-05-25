"use strict";

import SuperstartExporter from './app/SuperstartExporter.js'


import FullscreenButton from './lib/FullscreenButton.js'
import ResourceSelector from './lib/ResourceSelector.js'

new Vue({
	el: '#app',
	template: `
		<div class='white-box' style='font-size: 0.8em; line-height: 1.2;'>
			<header>
				<h2>Superstart bookmark exporter</h2>
				<FullscreenButton/>
			</header>


			<!--
			<div>
				File: 
					<ResourceSelector 
						:urls='["./assets/sample-data/superstart-backup.ssbackup"]' 
						type='file' 
						@loaded='superstartBackup = $event'
					/>
			</div>
			-->

			<p>
				Export bookmarks created in <b>cyberscorpio's <i>Superstart</i> Firefox extension</b> <a href='http://www.enjoyfreeware.org/superstart'>(http://www.enjoyfreeware.org/superstart)</a> to a HTML file that can be imported as regular bookmarks into Firefox. 
			</p>
			<p>
				Create a Superstart backup file (ending with '.ssbackup') and add it here:
			</p>

			<div class='white-box'>
				<input type='file' @change='handleFileInput'/>
			</div>

			<SuperstartExporter 
				:superstartBackup='superstartBackup'
			/>

		</div>
	`,
	data() {
		return {
			superstartBackup: null
		}
	},
	methods: {
		handleFileInput(e) {
			const file = e.target.files[0]
			if (file)
				this.superstartBackup = file
		}
	},
	components: {
		SuperstartExporter,
		FullscreenButton,
		ResourceSelector
	},
})




