import '../node_modules/dropzone/dist/dropzone.js';
import '../node_modules/alpinejs/dist/cdn.js';
import Swal from './vanilla-swal';
import './alpine';
import './dropzone';
import './getClientID';
import './kia-select';
import './qr-generation';
import './quiz-slider';

document.addEventListener('DOMContentLoaded', () => {

	var canHover = !(matchMedia('(hover: none)').matches);
	if (canHover) {
		document.body.classList.add('can-hover');
	}

	const delears = document.querySelectorAll('.dealer-link');
	const reviews = document.querySelectorAll('#add-review-good .add-review__link');
	const map = document.querySelector('.map');
	const mapBlock = document.querySelector('.map-block');
	const yandexMap = document.querySelector('#map');

	const links = document.querySelectorAll('.classified__link');
	const sublist = document.querySelector('.classified__sublist');
	const sublinks = document.querySelectorAll('.classified__sublink');

	const quizForm = document.querySelector('#quiz_form');
	
	const qtyBlock = document.querySelector('.quality-block');
	const reviewBlockGood = document.querySelector('#add-review-good');
	const reviewBlockBad = document.querySelector('#add-review-bad');
	const formComment = document.getElementById('form-comment');
	const reviewList = document.getElementById('add-review__list');

	let clicked = false;
	let attr = '';
	let attrName = '';
	let rate = 0;
	const clientID = new window.getClientID();

	function getCookie(name) {
		var matches = document.cookie.match(new RegExp(
			"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		))
		return matches ? decodeURIComponent(matches[1]) : undefined
	};
	function setCookie(name, value, props) {
		props = props || {}
		// console.log(props);
		var exp = props.expires
		if (typeof exp == "number" && exp) {
			var d = new Date()
			d.setTime(d.getTime() + exp*1000)
			exp = props.expires = d
		}
		if(exp && exp.toUTCString) { props.expires = exp.toUTCString() }
		value = encodeURIComponent(value)
		var updatedCookie = name + "=" + value
		for(var propName in props){
			updatedCookie += "; " + propName
			var propValue = props[propName]
			if(propValue !== true){ updatedCookie += "=" + propValue }
			// console.log(updatedCookie);
		}
		document.cookie = updatedCookie
	};
	function deleteCookie(name) {
		setCookie(name, null, { 'domain':settings.domain,'path':'/','expires': -1 })
	};

	function slideUp(container){

		if(container.style.height != "")
			container.style.height = '0px';
		if(container.style.padding != "")
			container.style.padding = '0';
		if(container.style['max-height'] != "")
			container.style['max-height'] = '0px';
		container.addEventListener('transitionend', function () {
			container.classList.remove('active');
		}, {
			once: true
		});
	}

	function slideDown(container, withMap = true){

		container.addEventListener('transitionend', function () {
			container.classList.add('active');
		});
		if(withMap){
			setTimeout( () => {
				container.style.height = container.scrollHeight + 'px';
				container.closest('#map').style.height = container.scrollHeight + 'px';
			}, 300);
		}
	}

	function scrollSmooth(selector){
		setTimeout( ()=>{
			document.querySelector(selector).scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		}, 300 );
	}

	function setClassifiedAttrValue() {
		if(document.querySelector('.classified__link.active'))
			if(document.querySelector('.classified__sublink.active'))
				return document.querySelector('.classified__link.active').getAttribute('data-source') + document.querySelector('.classified__sublink.active').getAttribute('data-source')
		return "";
	}

	if(reviews) reviews.forEach( (el) => {
		el.addEventListener('click', (e) => {
			e.preventDefault();

			attr = el.getAttribute('data-source');
			attrName = el.getAttribute('data-source-name');
			// add_screenshot = document.querySelector('.add-screenshot');

			mapBlock.style.height = '0px';
			// if(add_screenshot) add_screenshot.style.height = '0px';

			if ( el.classList.contains('active') ) {

				el.classList.remove('active');
				// if(add_screenshot) add_screenshot.classList.remove('active');

				mapBlock.addEventListener('transitionend', function () {
					map.style.height = 0;
				}, {
					once: true
				});

			} else {

				reviews.forEach( (elem) => {
					elem.classList.remove('active');
					// if(add_screenshot) add_screenshot.classList.remove('active');
				});
				el.classList.add('active');
				// setTimeout(()=>{
				// 	if(add_screenshot) add_screenshot.classList.add('active');
				// }, 300)

				if(Object.keys(placemarks).length>1) {
					setTimeout(() => {
						if (!clicked) {
							ymaps.ready(init);
						}
						map.style.height = (mapBlock.clientWidth + 30) + 'px';
						yandexMap.style.height = (mapBlock.clientWidth + 30) + 'px';
						mapBlock.style.height = (mapBlock.clientWidth + 30) + 'px';
						scrollSmooth('.add-review');
						clicked = true;
					}, 300)
				} else {
					placeholderClick(attr, rate, attrName, placemarks, Object.keys(placemarks)[0]);
				}
				// setTimeout(()=>{
				// 	if(add_screenshot) add_screenshot.style.height = 'auto';
				// }, 300)
			}

		});
	});

	if(links) links.forEach( (el) => {
		el.addEventListener('click', (e) => {
			e.preventDefault();

			if ( el.classList.contains('active') ) return;

			mapBlock.style.height = '0px';

			map.style.height = 0;

			// slideUp(mapBlock);
			// slideUp(sublist);
			links.forEach( (elem) => {
				elem.classList.remove('active');
			});
			el.classList.add('active');

			sublist.classList.add('active');

			sublinks.forEach( (elem) => {
				elem.classList.remove('active');
			});

			attr = setClassifiedAttrValue();
		});
	});

	if(sublinks) sublinks.forEach( (elem) => {
		elem.addEventListener('click', (e) => {
			e.preventDefault();

			if ( elem.classList.contains('active') ) return;

			slideUp(mapBlock);
			sublinks.forEach( (el) => {
				el.classList.remove('active');
			});
			elem.classList.add('active');
			// slideDown(mapBlock);

			attr = setClassifiedAttrValue();

			setTimeout(() => {
				if (!clicked) {
					ymaps.ready(init);
				}
				map.style.height = (mapBlock.clientWidth + 30) + 'px';
				yandexMap.style.height = (mapBlock.clientWidth + 30) + 'px';
				mapBlock.style.height = (mapBlock.clientWidth + 30) + 'px';
				scrollSmooth('.classified__list');
				clicked = true;
			}, 300)

		});
	});

	let zoom = (window.screen.availWidth < 360) ? 10 : 11;

	function init () {
		const add = (a1, a2) => a1.map((e, i) => e + a2[i]);
		const avr = (array, length) => array.map((e, i) => e/length);
		var count = 0;
		var center = [0,0];

		var myMap = new ymaps.Map('map', {
			center: center,
			zoom: zoom,
			controls: ['zoomControl']
		});



		myMap.behaviors.disable('scrollZoom');

		var clusterer = new ymaps.Clusterer({
			// preset: 'islands#invertedBlackClusterIcons',
			groupByCoordinates: false,
			clusterDisableClickZoom: false,
			clusterHideIconOnBalloonOpen: false,
			geoObjectHideIconOnBalloonOpen: false,
			openBalloonOnClick: false,
			hasBalloon: false
	  })

		var HintLayout = ymaps.templateLayoutFactory.createClass( "<div class='map-hint'>" +
			"{{ properties.name }}" +
			"</div>", {
				// Определяем метод getShape, который
				// будет возвращать размеры макета хинта.
				// Это необходимо для того, чтобы хинт автоматически
				// сдвигал позицию при выходе за пределы карты.
				getShape: function () {
					var el = this.getElement(),
						result = null;
					if (el) {
						var firstChild = el.firstChild;
						result = new ymaps.shape.Rectangle(
							new ymaps.geometry.pixel.Rectangle([
								[0, 0],
								[firstChild.offsetWidth, firstChild.offsetHeight]
							])
						);
					}
					return result;
				}
			}
		);

		let keysSorted = Object.keys(placemarks).sort(function(a,b){return placemarks[a].position[1]-placemarks[b].position[1]})

		Object.values(keysSorted).forEach((obj) => {
			if(placemarks[obj][attr] == "") return;
			center = add(center,placemarks[obj].position);
			if(placemarks[obj].zoom) {
				zoom = placemarks[obj].zoom;
			}
			if(placemarks[obj].mapZoom) zoom = placemarks[obj].mapZoom;
			count++;
			var myPlacemark = new ymaps.Placemark(placemarks[obj].position, {
				name: placemarks[obj].hintContent
			}, {
				hintLayout: HintLayout,
				iconLayout: 'default#image',
				iconImageHref: placemarks[obj].marker,
				iconImageSize: [42, 62],
				iconImageOffset: [-21, -58],
			});

			clusterer.add(myPlacemark);
			myMap.geoObjects.add(clusterer);

			myPlacemark.events.add('click', function (e) {
				placeholderClick(attr, rate, attrName, placemarks, obj);
			});
		});

		clusterer.events.add('click', function (e) {
			e.preventDefault()
			setTimeout(()=>{
				myMap.setZoom(19);
			},50)
		});

		myMap.setCenter(avr(center,count));
		myMap.setZoom(zoom);
	}

	function placeholderClick(attr, rate, attrName, placemarks, obj) {
		if(["google", "yandex", "gis", "zoon", "flamp", "yell", "avito", "avto_provereno"].includes(attr)) {
			if(getCookie("sentGoodFeedback") === undefined || location.search.includes("utm_campaign=cafe")) {
				setCookie("sentGoodFeedback", true, {'domain':location.hostname,'path':'/','expires': 3600*24*1});
				sendGood(rate, attrName, placemarks[obj][attr], placemarks[obj].hintContent);
			}
		}
		// let param = new URLSearchParams(getPair(new URL(placemarks[obj][attr]))).toString();
		let param = Object.entries(getPair(new URL(placemarks[obj][attr]))).map(([key, value]) => `${key}=${value}`).join('&');
		let url = new URL(placemarks[obj][attr]);
		url.search = "?" + param;
		window.open(decodeURI(url));
	}

	function getPair(openURL) {
		let result = {referer: encodeURIComponent(window.location.origin)};
		if(typeof openURL == "object") {
			openURL.search.substring(1).split('&').forEach(function(el){
				if(el!=""){
					var pair = el.split('=');
					result[pair[0]] = pair[1];
				}
			});
		}
		let source = new URL(getCookie('__gtm_campaign_url') ? getCookie('__gtm_campaign_url') : window.location);
		if(source.search != window.location.search) {
			source.search.substring(1).split('&').forEach(function(el){
				if(el!=""){
					var pair = el.split('=');
					result[pair[0]] = pair[1];
				}
			});
		}
		window.location.search.substring(1).split('&').forEach(function(el){
			if(el!=""){
				var pair = el.split('=');
				result[pair[0]] = pair[1];
			}
		});

		return result;
	}

	function getUniqueID() {
		var navigator_info = window.navigator;
		var screen_info = window.screen;
		var uid = '';
		uid += navigator_info.vendor.replace(/\W+/g, '')+'-';
		uid += navigator_info.mimeTypes.length+'-';
		uid += navigator_info.userAgent.replace(/\D+/g, '')+'-';
		uid += navigator_info.plugins.length+'-';
		uid += (screen_info.width || '') + 'x';
		uid += (screen_info.height || '') + 'x';
		uid += screen_info.pixelDepth || '';
		return uid;
	}

	function maskphone(form) {

		form.querySelector('.error-message#phone').style.display = 'none';

		var num = this.value.replace(/^(\+7|7|8)/g, '').replace(/\D/g, '').split(/(?=.)/),
			i = num.length;

		// console.log(num, num.length == 1 && num[0] == "" && this.required, num.length != 10 || [... new Set(num)].length == 1, this.required, form);

		if (num.length == 1 && num[0] == "" && this.required) {
			checkingRequiredFields( form, JSON.parse('{"phone":"Поле обязательно для заполнения"}') )
			return false;
		} else if(num.length != 10 || [... new Set(num)].length == 1) {
			checkingRequiredFields( form, JSON.parse('{"phone":"Некорректный номер телефона"}') )
			return false;
		}

		if (0 <= i) num.unshift('+7');
		if (1 <= i) num.splice(1, 0, ' ');
		if (4 <= i) num.splice(5, 0, ' ');
		if (7 <= i) num.splice(9, 0, '-');
		if (9 <= i) num.splice(12, 0, '-');
		if (11 <= i) num.splice(15, num.length - 15);
		this.value = num.join('');
		return true;
	};

	document.querySelectorAll("input[name=phone]").forEach(function (el) {
		// el.addEventListener('focus', maskphone.bind(el, el.closest('form')) );
		el.addEventListener('input', maskphone.bind(el, el.closest('form')) );
		el.addEventListener('change', maskphone.bind(el, el.closest('form')) );
	});

	document.querySelectorAll('input[name=agree]').forEach((el) => {
		el.addEventListener('change', function(){
			el.closest('form').querySelector('.error-message#agree').style.display = 'none';
		})
	})
	document.querySelectorAll('[name=comment]').forEach((el) => {
		el.addEventListener('change', function(){
			el.closest('form').querySelector('.error-message#comment').style.display = 'none';
		})
	})

	function checkingRequiredFields(form, errors) {
		let valid = true;
		for (const key in errors) {
			let field = form.querySelector('.error-message#'+key);
			// console.log(key, errors[key], field);
			field.innerText = errors[key];
			field.style.display = 'block';
			valid = false;
		}
		if(errors){
			setTimeout( ()=>{
			// console.log(Object.keys( errors )[0]);
			form
				.querySelector('.error-message#'+Object.keys( errors )[0])
				.previousElementSibling
				.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				});
			}, 300 );
		}
		return valid;
	}

	async function sendGood(rate, serviceName, link, dealer) {
		if(!rate || (rate && rate === 0)) return;
		let res;
		let formData = new FormData();
		formData.append('rate', rate);
		formData.append('link', link);
		formData.append('dealer', dealer);

		let data = getPair();
		Object.entries(data).forEach(function(pair){
			formData.append(pair[0], pair[1]);
		});

		formData.append('map', serviceName);

		if(getCookie("fta") != undefined) {
			formData.append('fta', true);
		}

		formData.append('uniqueID', getUniqueID());

		console.log(clientID, ('clientID' in localStorage));
		if('clientID' in localStorage) {
			formData.append('Посещение', clientID.count);
			formData.append('Яндекс ID', clientID.ym);
			formData.append('Google ID', clientID.ga);
		}

		let response = await fetch('/good.php', {
			method: 'POST',
			body: formData
		});

		if (response.status === 200) {
			res = await response.json();
			console.log(res);
		}
	}

	function checkingRequiredSelect(selects){
		let valid = true
		selects.forEach(select => {
			const selectValue = select.dataset.value;
			const selectRequired = select.dataset.required;
			if (typeof selectRequired != 'undefined' && selectValue == '') {
				select.nextSibling.nextElementSibling.innerText = 'Выберите значение'
				select.nextSibling.nextElementSibling.style.display = 'block'
				valid = false
			}
		})
		return valid
	}

	let quizRating = {};
	let hasLowRating = false;

	function getRequiredRatingNames() {
		return Array.from(document.querySelectorAll('.rating-slider__input[required]'))
			.map(input => input.name);
	}

	function getQuizAnswers() {
		const ratingInputs = document.querySelectorAll('.rating-slider__input');
		const yesNoInputs = document.querySelectorAll('.quiz__yesno-input');
		const answers = {};
		ratingInputs.forEach(input => {
			if (input.name) {
				answers[input.name] = input.value;
			}
		});
		yesNoInputs.forEach(input => {
			if (input.name) {
				answers[input.name] = input.value;
			}
		});
		return answers;
	}

	function parseNegativeRule(rule) {
		const normalized = String(rule).trim().toLowerCase();
		if (normalized === '') {
			return null;
		}
		if (normalized === 'нет' || normalized === 'no') {
			return { type: 'yesno', value: 'no' };
		}
		if (normalized === 'да' || normalized === 'yes') {
			return { type: 'yesno', value: 'yes' };
		}
		const rangeMatch = normalized.match(/^(\d+)\s*-\s*(\d+)$/);
		if (rangeMatch) {
			return { type: 'range', min: Number(rangeMatch[1]), max: Number(rangeMatch[2]) };
		}
		const compareMatch = normalized.match(/^(<=|>=|<|>)(\d+)$/);
		if (compareMatch) {
			return { type: 'compare', op: compareMatch[1], value: Number(compareMatch[2]) };
		}
		return null;
	}

	function isNegativeByRule(rule, value, questionType) {
		if (!rule) {
			return false;
		}
		const parsed = parseNegativeRule(rule);
		if (!parsed) {
			return false;
		}
		if (parsed.type === 'yesno') {
			return String(value).toLowerCase() === parsed.value;
		}
		if (questionType === 'yesno') {
			return false;
		}
		const numericValue = Number(value);
		if (Number.isNaN(numericValue)) {
			return false;
		}
		if (parsed.type === 'range') {
			return numericValue >= parsed.min && numericValue <= parsed.max;
		}
		if (parsed.type === 'compare') {
			switch (parsed.op) {
				case '<':
					return numericValue < parsed.value;
				case '<=':
					return numericValue <= parsed.value;
				case '>':
					return numericValue > parsed.value;
				case '>=':
					return numericValue >= parsed.value;
				default:
					return false;
			}
		}
		return false;
	}

	function updateHasLowRating() {
		const answers = getQuizAnswers();
		const questionSlides = document.querySelectorAll('.swiper-slide[data-negative-rule]');
		hasLowRating = Array.from(questionSlides).some(slide => {
			const rule = slide.dataset.negativeRule || '';
			const questionType = slide.dataset.questionType || 'rating';
			if (questionType === 'yesno') {
				const input = slide.querySelector('.quiz__yesno-input');
				const value = input ? input.value : '';
				return isNegativeByRule(rule, value, 'yesno');
			}
			const input = slide.querySelector('.rating-slider__input');
			const value = input ? input.value : '';
			return isNegativeByRule(rule, value, 'rating');
		});
	}

	document.addEventListener('ratingChange', (e) => {
		if(!quizRating[e.detail.name]) {
			quizRating[e.detail.name] = e.detail.value;
		} else {
			quizRating[e.detail.name] = e.detail.value;
		}
		updateHasLowRating();
	});

	document.addEventListener('quizYesNoChange', () => {
		updateHasLowRating();
	});

	async function sendForm(form, btn, formData, textSucces = 'Спасибо!') {
		let res;
		// console.log(textSucces)

		const selects = form.querySelectorAll('.kia-select')
		if(selects.length && !checkingRequiredSelect(selects)){
			btn.innerHTML = '<span>Отправить</span>';
			btn.removeAttribute('disabled');
			return
		}

		if (formData.get('file')) {
			textSucces = 'Ваш скриншот был успешно отправлен!';
		}

		let data = getPair();
		Object.entries(data).forEach(function(pair){
			formData.append(pair[0], pair[1]);
		});

		formData.append('uniqueID', getUniqueID());

		if(getCookie("fta") != undefined) {
			formData.append('fta', true);
		}

		if('clientID' in localStorage) {
			formData.append('Посещение', clientID.count);
			formData.append('Яндекс ID', clientID.ym);
			formData.append('Google ID', clientID.ga);
		}

		switch(form.dataset.type) {
			case "review":
			case "screenshot":
			case "friend":
			case "friend_create":
			case "quiz":
				formData.append('type', form.dataset.type);
				break;
			default:
				break;
		}

		if(form.dataset.type == "friend_create") {
			if (formData.get('phone')) {
				var stringForEncode = parseInt(formData.get('phone').replace(/\D/ig,"").substring(1)).toString(32).toUpperCase();
				formData.append('code', stringForEncode);
				var your = " вашего";
				textSucces = "";
			}
		}

		if(quizForm){
			if(!formData.get('phone')){
				formData.append('nophone', '');
			}
		}

		let response = await fetch('/mail.php', {
			method: 'POST',
			body: formData
		});

		if (response.status === 200) {
			res = await response.json();
			if (!res.validation && !checkingRequiredFields(form, res.messages)) {
				if(form.querySelector('.success-message')){
					form.querySelector('.success-message').style.display = 'none';
				}
				btn.innerHTML = '<span>Отправить</span>';
				btn.removeAttribute('disabled');
				return false;
			}

			if (res.answer == 'error' || res.answer == 'required') {
				Swal.fire({
					title: 'Ошибка',
					text: res?.error || res?.message,
					icon: 'error',
					iconColor: '#eA0029',
					backdrop: 'rgba(0,0,0,0.7)',
					showCloseButton: true,
					closeButtonHtml: '&times;',
					showConfirmButton: false
				})
				btn.innerHTML = '<span>Отправить</span>';
				btn.removeAttribute('disabled');
				return false;
			}

			if(res.answer == 'ok') {

				if(quizForm){
					const NAME = formData.get('name') || null;
					const LEAD_ID = res.lead_id || null;
					if(!hasLowRating){
						reviewBlockGood.classList.add('active');
					}else{
						const inputName = reviewBlockBad.querySelector('[name="name"]');
						const inputLeadId = reviewBlockBad.querySelector('[name="lead_id"]');
						const inputAnswers = reviewBlockBad.querySelector('[name="answers"]');
						if(inputName && NAME) inputName.value = NAME;
						if(inputLeadId && LEAD_ID) inputLeadId.value = LEAD_ID;
						if(inputAnswers && Object.values(quizRating).length){
							const requiredNames = getRequiredRatingNames();
							const quizAnswers = requiredNames
								.map(name => quizRating[name])
								.filter(value => typeof value !== 'undefined');
							inputAnswers.value = quizAnswers.join('-');
						}
						reviewBlockBad.classList.add('active');
					}
					quizForm.classList.add('d-none');
				}

				if(res?.gs?.manager) {
					your = "";
					textSucces += "<br>Этот клиент уже закреплен за менеджером: <b>" + res.gs.manager + "</b><br><br>\n";
				}
				if(res?.gs?.lineAdded) {
					textSucces += "Код для" + your + " клиента: " + stringForEncode + "<br><br>\n";
					textSucces += "Ссылка для" + your + " клиента:<br><a target=\"_blank\" href=\"https://qr.kia-engels.ru/ref/" + stringForEncode + "\">qr.kia-engels.ru/ref/" + stringForEncode + "</a>";
					document.querySelector('.last-code').innerHTML += "<br><br>"+textSucces;
				}
				if(res?.gs?.httpcode) {
					textSucces = "Что-то пошло не&nbsp;так, пожалуйста свяжитесь с&nbsp;техподдержкой<br><br><a target=\"_blank\" href=\"https://alexsab.t.me\">alexsab.t.me</a>";
				}
				if(!Object.keys(quizRating).length){
					Swal.fire({
						title: 'Спасибо',
						html: textSucces,
						icon: 'success',
						iconColor: '#f3c300',
						backdrop: 'rgba(0,0,0,0.7)',
						showCloseButton: true,
						closeButtonHtml: '&times;',
						confirmButtonColor: '#05141f',
						allowOutsideClick: false,
						allowEscapeKey: false,
						showDenyButton: false,
						showCancelButton: false
					});

					quizRating = {};
				}
				if(formData.get('file')){
					document.querySelector('#file-upload').dropzone.removeAllFiles();
				} else if(form.closest('.add-review')) {
					form.closest('.add-review').innerHTML = `<p class="text-muted mb-0">${textSucces}</p>`
				}
				form.reset();
				selects.forEach(select => {
					const $label = select.querySelector('.kia-select-label');
					const labelValue = select.dataset.label;
					$label.innerText = labelValue;
					select.setAttribute('data-value', '')
					select.querySelectorAll('.kia-select-option input').forEach(option => {
						option.checked = false
					})
				})
				btn.innerHTML = '<span>Отправить</span>';
				btn.removeAttribute('disabled');
				return true;
			}
		}else{
			Swal.fire({
				title: 'Ошибка',
				html: 'Перезагрузите страницу и&nbsp;попробуйте снова',
				icon: 'error',
				iconColor: '#eA0029',
				backdrop: 'rgba(0,0,0,0.7)',
				showCloseButton: true,
				closeButtonHtml: '&times;',
				showConfirmButton: false
			})
			btn.innerHTML = '<span>Отправить</span>';
			btn.removeAttribute('disabled');
			return false;
		}
	}

	document.querySelectorAll('form').forEach(form => {
		let btn = form.querySelector('button[type="submit"]');
		form.onsubmit = async (e) => {
			e.preventDefault();
			btn.innerHTML = 'Отправляем...';
			btn.setAttribute('disabled', true);

			const dataset = btn.dataset;
			let formData = new FormData(form);
			formData.append('subject', dataset.subject);
			formData.append('form', dataset.form);
			if(rate != 0) {
				formData.append('rate', rate);
			}

			if(dataset.file){
				formData.append('file', dataset.file);
				sendForm(form, btn, formData, "Спасибо за&nbsp;Ваш отзыв.");
			}else{
				if(!formData.get('phone')){
					formData.delete('phone')
				}
				if(formData.get('phone') && formData.get('comment') && formData.get('agree')){
					sendForm(form, btn, formData, "Спасибо за&nbsp;Ваш комментарий, в&nbsp;ближайшее время мы&nbsp;с&nbsp;Вами свяжемся.");
				} else if(!formData.get('comment') || !formData.get('agree')){
					sendForm(form, btn, formData, "");
				}

				if(!formData.get('phone') && formData.get('comment') && formData.get('agree')){
					Swal.fire({
						html: '<h2>Спасибо за&nbsp;Ваш комментарий.</h2><p>Если Вы&nbsp;хотите чтобы мы&nbsp;с&nbsp;Вами связались, пожалуйста, оставьте свой номер телефона</p><br>' +
						'<div class="qr-form-group">' +
						'<input type="text" tabindex="-1" placeholder="Ваше имя" name="name">' +
						'<input type="email" tabindex="-1" name="email" placeholder="mail@example.com">' +
						'<input type="tel" id="phone-field-swal" name="phone" placeholder=" " required>' +
						'<label for="phone-field-swal">Телефон</label>' +
						'</div>' +
						'<div class="error-message mx-0" id="phone"></div>' +
						'<div class="swal-buttons d-flex justify-content-center gap-2 mt-4">' +
						'<button type="button" class="btn" id="sendPhone"><span>Отправить</span></button>' +
						'<button type="button" class="btn btn-white" id="send"><span>Отправить без телефона</span></button>' +
						'</div>',
						backdrop: 'rgba(0,0,0,0.7)',
						allowOutsideClick: false,
						allowEscapeKey: false,
						showCloseButton: false,
						showDenyButton: false,
						showCancelButton: false,
						showConfirmButton: false,
						padding: '20px'
					})

					let phoneField = document.querySelector('.swal2-html-container input[name=phone]');
					let phoneErrorField = document.querySelector('.swal2-html-container .error-message#phone');
					let sendBtn = document.querySelector('.swal2-html-container #send');
					let sendPhoneBtn = document.querySelector('.swal2-html-container #sendPhone');
					phoneField.addEventListener('focus', maskphone.bind(phoneField, document.querySelector('.swal2-html-container')));
					phoneField.addEventListener('input', maskphone.bind(phoneField, document.querySelector('.swal2-html-container')));
					sendBtn.addEventListener('click', e => {
						sendBtn.innerHTML = '<span>Отправляем...</span>';
						sendBtn.setAttribute('disabled', true);
						sendPhoneBtn.setAttribute('disabled', true);
						
						let send = sendForm(form, btn, formData, 'Спасибо за&nbsp;Ваш комментарий!');
						send
						.then( res => {
							if(res) Swal.close();
						})
						.catch(error => {
							Swal.showValidationMessage(
								`Request failed: ${error}`
								)
						})
						.finally(() => {
							sendBtn.innerHTML = '<span>Отправить без телефона</span>';
							sendBtn.removeAttribute('disabled');
							sendPhoneBtn.removeAttribute('disabled');
						})
					})
					sendPhoneBtn.addEventListener('click', e => {

						if(!maskphone.call(phoneField, document.querySelector('.swal2-html-container'))) {
							return false;
						}

						sendPhoneBtn.innerHTML = '<span>Отправляем...</span>';
						sendPhoneBtn.setAttribute('disabled', true);
						sendBtn.setAttribute('disabled', true);

						formData.append('phone', phoneField.value);
						let swalName = document.querySelector('.swal2-html-container input[name=name]');
						if(swalName) {
							formData.append('name', swalName.value);
						}
						let swalEmail = document.querySelector('.swal2-html-container input[name=email]');
						if(swalEmail) {
							formData.append('email', swalEmail.value);
						}

						let send = sendForm(form, btn, formData, "Спасибо за&nbsp;Ваш комментарий, в&nbsp;ближайшее время мы&nbsp;с&nbsp;Вами свяжемся.");
						send
						.then( res => {
							if(res) Swal.close();
						})
						.catch(error => {
							Swal.showValidationMessage(
								`Request failed: ${error}`
								)
						})
						.finally(() => {
							sendPhoneBtn.innerHTML = '<span>Отправить</span>';
							sendPhoneBtn.removeAttribute('disabled');
							sendBtn.removeAttribute('disabled');
						})
					})
				}
			}
		};
	})

	if(qtyBlock) {
		qtyBlock.addEventListener('click', e => {
			if(e.target.closest('.quality-item')) {
				rate = e.target.closest('.quality-item').dataset.quality;
				if(!rate) {
					console.log("didn't find data-quality");
					return;
				}else{
					// slideUp(qtyBlock.closest('#service-quality'));
					qtyBlock.closest('#service-quality').classList.remove('active');
					// qtyBlock.classList.remove('icon-block');
					if(rate < 4){
						// formComment.classList.remove('d-none');
						reviewBlockBad.classList.add('active');
					}else if(rate >= 4){
						// reviewList.classList.remove('d-none');
						reviewBlockGood.classList.add('active');
					}else{
						console.log("smth wrong with rate");
						return;
					}
				}
			}
		})
	}

	const saveBtn = document.querySelector('.save-vcard')
	if (/mobile|iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()) && saveBtn) {
		saveBtn.classList.add('mobile');

		let ignoreScrollRevealUntil = 0;
		const hideSaveBtn = () => {
			saveBtn.classList.add('is-quiz-shifted');
			// Игнорируем события scroll от программной прокрутки
			ignoreScrollRevealUntil = Date.now() + 1200;
		};
		const showSaveBtn = () => {
			saveBtn.classList.remove('is-quiz-shifted');
		};

		document.addEventListener('quizStart', hideSaveBtn);
		document.addEventListener('quizNavigate', hideSaveBtn);
		window.addEventListener('scroll', () => {
			if (Date.now() < ignoreScrollRevealUntil) {
				return;
			}
			showSaveBtn();
		}, { passive: true });
	} else {
		// code for non-mobile devices
	}

});
