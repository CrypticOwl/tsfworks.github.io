import RandomWords from './WhatToDo/RandomWords.js'


const WhatToDo = {
	template: `
		<div>
			Random words: <RandomWords :wordList='wordList' interval='800'/>
		</div>
	`,
	props: {
		wordList: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
		}
	},
	components: {
		RandomWords
	}
}







export default WhatToDo