export default class FileInput {
	constructor(el) {
		this.$el = $(el)
		this.$btnAdd = this.$el.find('[data-btn-add]')
		this.$btnClear = this.$el.find('[data-btn-clear]')
		this.$input = this.$el.find('[data-fileinput]')
		this.$fileName = this.$el.find('[data-filename]')
		this.$fileList = this.$el.find('[data-filelist]')
		this.init()
	}

	init() {
		this.$btnAdd.on('click', () => {
			this.$input.trigger('click')
		})

		this.$input.on('change', (evt) => {
			this.renderFiles(evt.target.files)
		})

		this.$btnClear.on('click', () => {
			this.$input.val('')
			this.$input.trigger('change')
		})

	}

	renderFiles(filesArr) {
		console.log(filesArr)
		if(!filesArr.length) {
			this.$fileName.text('')
			this.$btnAdd.show()
			this.$fileList.hide()
		} else {
			this.$btnAdd.hide()
			this.$fileName.text(filesArr[0].name)
			this.$fileList.show()
		}
	}
}
