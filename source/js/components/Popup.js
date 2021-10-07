export default class Popup {
	static instances = []

	constructor(el) {
		this.$el = $(el)
		this.name = this.$el.data('popup')
		this.$triggers = $(`[data-popup-trigger=${this.name}]`)
		this.$btnClose = this.$el.find('[data-btn-close]')
		this.init()
		Popup.instances.push(this)
	}

	static initInstances(elSelector) {
		$(elSelector).each(function ()  {
			new Popup(this)
		})
	}

	init() {
		this.$triggers.on('click', (evt) => {
			evt.preventDefault()
			this.open()
		})
		this.$btnClose.on('click', () => {
			this.close()
		})
	}

	open() {
		this.$el.addClass('active')
		$('body').css('overflow', 'hidden')
		Popup.instances
			.filter(item => item.name !== this.name)
			.forEach(item => item.close())
	}

	close() {
		this.$el.removeClass('active')
		$('body').css('overflow', 'visible')
	}
}
