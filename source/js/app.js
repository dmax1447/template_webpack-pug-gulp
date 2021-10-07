import validate from 'jquery-validation'
import owlCarousel from 'owl.carousel'
import ionRangeSlider from 'ion-rangeslider'
import mask from 'jquery-mask-plugin'
import messages from 'jquery-validation/dist/localization/messages_ru.min'

import Popup from './components/Popup'
import Brief from './components/Brief'
import Cards from './components/Cards'
import FileInput from './components/FileInput';

import {getCookie, setCookie, deleteCookie} from './components/cookie-utils'

$(document).ready(function() {

	function initCursor(){
		let isHovered = false
		document.addEventListener("mousemove", function(event) {

		  const x = event.pageX;
		  const y = event.pageY;
		  const cursor = document.querySelector("#mouse");
		  cursor.style.left = x + "px";
		  cursor.style.top = y + "px";
		});

		$('a, button, .hover').on("mouseover", function(){
		  $('#mouse').css({height: '50px', width:'50px'});
		  isHovered = true
		});

		$('a, button, .hover').on("mouseleave", function(){
		  $('#mouse').css({height: '25px', width:'25px'});
		  isHovered = false
		});
	}

	function initClientsSlider(){
		const clientsSlider = $(".clients__slider").owlCarousel({
			items:1
		});
		$('.clients__item--arrow--next').on('click', function(event) {
			clientsSlider.trigger('next.owl.carousel');
		});
		$('.clients__item--arrow--prev').on('click', function(event) {
			clientsSlider.trigger('prev.owl.carousel');
		});
	}

	function initReviewsSlider(){
		const block = $(".reviews__list")
		block.addClass('owl-carousel')
		const slider = block.owlCarousel({
			autoWidth:true,
			margin:20
		});

	}

	function initArticleSlider() {
		const $sliderContainer = $(".article-page__sidebar-list")
		if ($(window).width() >= 768 || !$sliderContainer.length) {
			return
		}
		const slider = $sliderContainer.owlCarousel({
			items:1,
			autoWidth: true,
			margin: 20
		});
	}

	function initCookies(){
		if(getCookie('cookies')) {
			return
		}

		const cookieBlock = $('.cookies')
		cookieBlock.show()
		const link = $('.cookies__link')
		link.on('click', function(event) {
			event.preventDefault();
			cookieBlock.hide()
			const setting = {
				expires:31104000 // год в секундах
			}
			setCookie('cookies', 'Y', setting)

		});
	}

	function init() {
		const $blogEl = $('[data-blog]')
		const $casesEl = $('[data-cases]')
		const $brief = $('[data-brief]')
		const $fileInput = $('[data-file-input]')
		const $window = $(window)
		const desktop = $window.width() > 1024
		const tablet = $window.width() <= 1024
		const phone = $window.width() < 768

		// кастомный курсор
		if(desktop){
			initCursor()
		}

		// общая логика валидатора
		$.validator.setDefaults({
			highlight: function(element) {
				$(element).closest(".form-group").addClass("has-error").removeClass('valid');
			},
			unhighlight: function(element) {
				$(element).closest(".form-group").removeClass("has-error");
			},
			errorElement: "span",
			errorClass: "form-group__error",
			validClass: 'valid',
			success: function(label) {
				label.closest('.form-group').addClass('valid')
			},

			errorPlacement: function(error, element) {
				if (element.parent(".input-group").length ||
					element.prop("type") === "checkbox" ||
					element.prop("type") === "radio"
				) {
					error.insertAfter(element.parent());
				} else {
					element.closest('.form-group__wrap').append(error)
					// error.append(element);
				}
			}
		});
		$.validator.addMethod('phoneru', function(value, element) {
			const phoneRegex = /\+\d{1}\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}/g
			const isValid = phoneRegex.test(value)
			return isValid;
		})

		// блог - фильрация карточек
		if ($blogEl.length) {
			const blog = new Cards($blogEl)
		}
		if($casesEl.length){
			const cases = new Cards($casesEl)
		}

		// слайдер на главной
		initClientsSlider()

		// слайдер в статье
		initArticleSlider()
		initCookies()

		$('[data-popup]').each(function ()  {
			new Popup(this)
		})

		// починить статические методы
		// Popup.initInstanses('[data-popup]')
		if(phone) {
			initReviewsSlider()
		}

		// файловые инпуты
		if ($fileInput.length) {
			$fileInput.each(function () {
				const inputFile = new FileInput(this)
			})
		}

		// бриф
		if($brief.length) {
			const brief = new Brief($brief)
		}


	}

	init()

});
