export default class Cards {
	constructor(el) {
		this.$el = $(el)
		this.$tags = this.$el.find('.tags__item')
		this.$cards = this.$el.find('[data-card-tags]')
		this.init()
	}

	init() {
		this.$tags.on('click', (evt) => {
			const activeClass = 'tags__item--active'
			const $tag = $(evt.target)
			const isThisTagAll = $tag.data('tag') === 'all'
			!isThisTagAll && $tag.toggleClass(activeClass)
			const $tags = this.getTags()
			const $tagAll = $('[data-tag="all"]')
			const activeTags = this.getActiveTags()
			const $activeTags = $(activeTags)
			if(isThisTagAll) {
				if($tag.hasClass(activeClass)) {
					// $tags.removeClass(activeClass)
					// $tag.removeClass(activeClass)
				} else {
					$tags.removeClass(activeClass)
					$tag.addClass(activeClass)
				}
			} else {
				if(!$activeTags.length){
					$tagAll.addClass(activeClass)
				} else {
					$tagAll.removeClass(activeClass)
				}
			}
			this.showFilteredCards(this.getActiveTags())
		})
	}
	getTags(){
		return $('[data-tag]').not('[data-tag="all"]')
	}
	getActiveTags() {
		const activeTagElements = this.$el[0].querySelectorAll('.tags__item--active:not([data-tag="all"])')
		return [...activeTagElements].map(item => item.dataset.tag)
	}

	showFilteredCards(activeTags) {
		console.log(activeTags)
		if (!activeTags.length) {
			this.$cards.show()
			return
		}

		this.$cards.each(function () {
			const $item = $(this)
			let isCardActive = false;
			const cardTagsStr = $item.data('card-tags')

			if (cardTagsStr) {
				const cardTagsArr = cardTagsStr.split(' ')
				isCardActive = cardTagsArr.some(tag => activeTags.includes(tag))
			}

			if (isCardActive) {
				$item.show()
			} else {
				$item.hide()
			}
		})
	}
}
