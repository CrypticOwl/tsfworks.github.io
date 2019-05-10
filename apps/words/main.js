"use strict";

import WordSearch from './app/WordSearch.js'
import LazyList from './app/LazyList.js'
import ResourceSelector from './app/ResourceSelector.js'

import WhatToDo from './app/WhatToDo.js'

import FullscreenButton from './lib/FullscreenButton.js'


new Vue({
	el: '#app',
	template: `
		<div>

			<div class='white-box' style='height: 5em'>
				<header>
					<h2>What to do?</h2>
					<FullscreenButton/>
				</header>
				<WhatToDo :wordList='wordsFound'/>
			</div>

			<div class='white-box'>
				<header>
					<h2>Words:</h2>

					<ResourceSelector :assetNames='wordListOptions' @loaded='wordList = $event'/>
					<FullscreenButton/>
				</header>

				<WordSearch :list='wordList' @wordsFound='handleWordsFound'/>
				<LazyList :list='wordsFound' increment='100'/>
			</div>

		</div>
	`,
	data() {
		return {
			wordListOptions: [
				'wordsEn_10k.txt',
				'wordsEn_20k.txt',
				'wordsEn_100k.txt',
				'wordsEn_335k.txt',
			],
			wordList: [],
			wordsFound: []
		}
	},
	methods: {
		handleWordsFound(wordsFound) {
			this.wordsFound = wordsFound
		}
	},
	components: {
		LazyList,
		WordSearch,
		ResourceSelector,

		WhatToDo,

		FullscreenButton
	},
	created() {
	}
})