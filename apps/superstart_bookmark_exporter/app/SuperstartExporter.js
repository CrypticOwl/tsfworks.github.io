import VueDownloadButton from '../lib/VueDownloadButton.js'

// Superstart Exporter
export default {
	template: `
		<div>
			<div v-if='!bookmarksHTML' 
				style='color: #888; font-weight: bold; font-size: 0.8em;'
				v-text='status'
			></div>

			<template v-else>
				<!-- PREVIEW -->
				<div class='white-box' v-html='bookmarksHTML' style='max-height: 10em; font-size: 0.7em; overflow: auto;'></div>

				<!-- SAVE BUTTON -->
				<div style='margin-bottom: 0.5em'>
					<VueDownloadButton :file='bookmarksHTML' fileName='SuperstartBookmarks.html' fileType='text/html'>
						Save
					</VueDownloadButton>
					<p>
						To import the generated HTML file into Firefox:
						<ol style='margin: 0.3em'>
							<li>
								Press <b>ctrl + shift + B</b> to open the Firefox Library
							</li>
							<li>
								Go to <b>Import and Backup</b> &gt; <b>Import Bookmarks from HTML...</b>
							</li>
						</ol>
						Or see: <a href='https://support.mozilla.org/en-US/kb/import-bookmarks-html-file'>https://support.mozilla.org/en-US/kb/import-bookmarks-html-file</a>
					</p>
				</div>
			</template>
		</div>
	`,
	props: {
		superstartBackup: {
			required: true,
			validator(file) {
				if (file instanceof File) {
					return true
				} else {
					return false
				}
			}
		}
		// json: {
		// 	validator(json) {
		// 		if (typeof json !== "object" || json.sites === undefined) {
		// 			console.error('Superstart JSON invalid: ', this.json)
		// 			return false;
		// 		}

		// 		return true
		// 	}
		// }
	},
	data() {
		return {
			json: null,
			status: ''
		}
	},
	watch: {
		superstartBackup(file) {
			this.getJSON(file)
		}
	},
	computed: {
		// Generates a Firefox bookmark backup HTML file from this.json
		bookmarksHTML() {
			if (!this.json) return

			// Functions to generate HTML strings for bookmark and folder
			const generateStr = {
				root(innerStr) {
					return `
						<!DOCTYPE NETSCAPE-Bookmark-file-1>
							<!-- This is an automatically generated file.
							     It will be read and overwritten.
							     DO NOT EDIT! -->
							<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
							<TITLE>Bookmarks</TITLE>
							<H1>Bookmarks Menu</H1>

							<DL><p>
							    <DT><H3 UNFILED_BOOKMARKS_FOLDER="true">Other Bookmarks</H3>
							    <DL><p>
							    	${innerStr}
							    </DL><p>
							</DL>
					`
				},
				bookmark(title, url) {
					return `<DT><A HREF="${url}">${title}</A>\n`
				},
				folder(title, innerStr) {
					return `
				      <DT><H3>${title}</H3>
				      	<DL><p>
				      		${innerStr}
				      	</DL><p>
				    `
				}
			}


			// Generate HTML from Superstart's JSON
			function HTMLFrom(currentNode) {
				// if its a Folder
				if (Array.isArray(currentNode.sites)) {
					var title = currentNode.title
					var innerHTML = ''

					// Add children str
					currentNode.sites.forEach( childNode => {
						innerHTML += HTMLFrom(childNode)
					})

					return generateStr.folder(title, innerHTML)
				} 
				// else its a Bookmark
				else {
					var title = currentNode.title
					var url = currentNode.url

					return generateStr.bookmark(title, url)
				}
			}

			return generateStr.root(HTMLFrom(this.json))
		},
	},
	methods: {
		// Unzip the '.ssbackup' file and gets the 'sites.v1.json'
		getJSON(file) {
			if (typeof JSZip !== 'function') {
				console.error('JSZip not loaded')
				return
			}


			// Unzip and find the file
			this.status = 'Uncompressing...'
			const jsZip = new JSZip()

			jsZip.loadAsync(file)
				.then(zip => {
					const zipObject = zip.file('superstart/sites.v1.json')

					if (zipObject) {
						return zipObject.async('text')
					} else {
						throw '"sites.v1.json" file was not found'
					}

				})
				.then(text => {
					this.json = JSON.parse(text)
				})
				.catch(error => {
					this.status = 'Error: ' + error
				})
		}
	},
	components: {
		VueDownloadButton
	}
}