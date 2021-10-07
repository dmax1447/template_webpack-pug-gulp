export default class Brief {
	constructor(el) {
		this.$el = $(el)
		this.$rangeBudget = this.$el.find('[data-range="budget"]')
		this.$rangeDeadlines = this.$el.find('[data-range="deadlines"]')
		this.$radioBudget = this.$el.find('[data-radio="budget"]')
		this.$radioDeadlines = this.$el.find('[data-radio="deadlines"]')
		this.init()
	}

	init() {
		if ($(window).width() >= 768) {
			this.$rangeBudget.ionRangeSlider({
				type: 'single',
				skin: 'round',
				hide_from_to: false,
				// from: 3,
				force_edges: true,
				values: [
					'до 500 т.р.',
					'1-3 млн.р',
					'3-5 млн.р',
					'5-7 млн.р',
					'7-10 млн.р',
					'10-15 млн.р',
					'от 15 млн.р',
				]
			})
			this.$rangeDeadlines.ionRangeSlider({
				type: 'single',
				skin: 'round',
				hide_from_to: false,
				// from: 3,
				force_edges: true,
				values: [
					'менее 1 мес.',
					'1-3 мес',
					'3-5 мес',
					'5-7 мес',
					'7-10 млн.р',
					'10-12 мес',
					'более 1.5 лет',
				]
			})
			this.$radioBudget.remove()
			this.$radioDeadlines.remove()
		} else {
			this.$rangeBudget.remove()
			this.$rangeDeadlines.remove()
		}

		this.$el.on('submit', function (evt) {
			evt.preventDefault();
			const formData = new FormData(evt.target);
			[...formData.entries()].forEach(item => console.log(item))
		})
		this.$el.validate({
			rules: {
				name: {
					required: true,
					minlength: 2
				},
				company: {
					required: true,
					minlength: 2
				},
				phone: {
					required: true,
					phoneru: true,
					minlength: 10
				},
				email: {
					required: true,
					email: true,
					maxlength: 255
				},
				description: {
					required: true
				}

			},

			messages: {
				email: {
					required: "Введите адрес электронной почты",
				},
				phone: {
					phoneru: 'неверный номер телефона'
				}
			}
		});
		this.$el.find('[name="phone"]').mask('+7 (000) 000-00-00')
	}
}
