var Calc = {
	init: function() {
		var _ = this;
		_.build('block');
	},
	getFlGr: function() {
		var floor_count = 1,
		floor_group;
		if (floor_count <= 5) {
			floor_group = 0;
		} else if (floor_count > 5 && floor_count <= 13) {
			floor_group = 1;
		} else {
			floor_group = 2;
		}
		return floor_group;
	},
	build: function(type) {

		var _ = this,
		work_items = calc_data[type],
		mid = Math.ceil(work_items.length/2),
		result = '<div class="calc__sl-item">',
		pop_result = '';

		for (var i = 0; i < work_items.length; i++) {

			var work_units = work_items[i].floor_group[_.getFlGr()].items;

			pop_result += '<div id="pop-calc-work-'+ i +'" class="form__fieldset form__fieldset_hidden"><div class="popup-calc__title">'+ work_items[i].pop_title +'</div> <div class="calc__bar"> <div class="row-tbl row-tbl_mid vw1000-row-col"> <div class="col-6"> <div class="txt m-0 tt-u"> ИТОГОВАЯ СТОИМОСТЬ<br> '+ work_items[i].pop_title_pd +'</div> </div> <div class="col-6"> <div class="calc__sum"><span class="calc-work-sum">0</span> <span class="calc__sum-span">руб.</span></div> </div> </div> </div>  <div class="table table_v1"> <div class="table__head row vw1000-hide"> <div class="col-3-4">Тип<br> работ</div> <div class="col-1 pl-20">Единица<br> измерения</div> <div class="col-2-3 ta-r">Стоимость<br> 1 е.и.</div> <div class="col-2-3 pl-30">необходимое<br> количество е.и.</div> <div class="col-2-3 ta-r">Итого</div> </div>';

			for (var j = 0; j < work_units.length; j++) {

				var defCount = work_units[j].default || 0;

				pop_result += '<div class="table__row row-tbl row-tbl_mid vw1000-row"> <div class="col-3-4 vw1000-col vw1000-fw-400">'+ work_units[j].tit +'<span class="vw1001-hide">, '+ work_units[j].unit +'</span></div> <div class="col-1 pl-20 vw1000-hide">'+ work_units[j].unit +'</div> <div class="table__head row vw1001-hide"> <div class="col-7">Стоимость<br> 1 е.и.</div> <div class="col-5">необходимое<br> количество е.и.</div> </div> <div class="table__lg col-2-3 ta-r vw1000-ta-l vw1000-pt-25 vw1000-col-7">'+ work_units[j].price +' <span>руб.</span> </div> <div class="col-2-3 pl-30 vw1000-col-5 vw1000-pad-x-0"> <div class="form__field"> <input id="chb-pop-calc-'+ i +'-'+ j +'" type="text" name="'+ type +'-'+ i +'-'+ j +'" class="form__text-input" value="'+ defCount +'"> </div> </div> <div class="row__br vw1001-hide"></div> <div class="table__head vw1001-hide">Итого</div> <div class="table__lg col-2-3 ta-r vw1000-ta-l vw1000-col"> <span id="calc-unit-sum-'+ i +'-'+ j +'" class="calc-unit-sum">0</span> <span>руб.</span></div> </div>';
			}

			pop_result += '</div> </div>';



			if (work_items.length > 4 && i == mid) {
				result += '</div><div class="calc__sl-item">';
			}

			result += '<div id="calc-item-ind-'+ i +'" class="calc__item"><div class="calc__item-thumb"><img src="'+ work_items[i].thumb +'" alt="thumb"></div><div class="calc__item-cnt"><div class="calc__item-row row"><div class="col-6"><p class="txt-t1">'+ work_items[i].title +'</p></div><div class="col-6"><p class="calc__item-price"><span class="calc__item-price-num">0</span> <span class="calc__item-price-span">руб.</span></p></div></div><div class="calc__item-works" data-count="'+ work_units.length +'"></div></div><button class="calc__item-btn" data-type="'+ type +'" data-work-index="'+ i +'"></button></div>'
		}
		result += '</div>';

		
		if ($('#calc-slider').hasClass('slick-initialized')) {
			$('#calc-slider').slick('unslick');
		}

		$('#calc-slider').html(result).slick({
			infinite: false,
			slidesToShow: 1,
			slidesToScroll: 1,
			arrows: false,
			dots: true
		});

		$('#calc-works-selected').html(0);
		$('#calc-works-count').html(work_items.length);

		$('#calc-popup .form__fieldset-wrap').html(pop_result);

		$('#calc-sum').html(0);

	},
	choice: function() {
		var form_data = $('#calc-pop-form').serializeArray(),
		item_sum = [],
		sum = 0,
		unitCount = [];

		$('.calc__item').removeClass('calc__item_active');
		$('.calc-work-sum, .calc-unit-sum, .calc__item-price-num').html(0);
		$('.calc__item-works').html('').removeClass('emp');

		for (var i = 0; i < form_data.length; i++) {
			
			var _ = this,
			spl = form_data[i].name.split('-'),
			type = spl[0],
			work_ind = spl[1],
			unit_ind = spl[2],
			price = calc_data[type][work_ind].floor_group[_.getFlGr()].items[unit_ind].price,
			val = +form_data[i].value;

			sum += price*val;

			item_sum[work_ind] = price*val + (item_sum[work_ind] || 0);

			$('#calc-unit-sum-'+ work_ind +'-'+ unit_ind).html((price*val).toFixed(2));

			if (val) {

				if (!$('#calc-item-ind-'+ work_ind +' .calc__item-works').hasClass('emp')) {
					$('#calc-item-ind-'+ work_ind +' .calc__item-works').html('').addClass('emp');
				}

				$('#calc-item-ind-'+ work_ind +' .calc__item-works').append('<div class="calc__item-unit">'+ calc_data[type][work_ind].floor_group[_.getFlGr()].items[unit_ind].tit +'&nbsp;<button type="button" class="btn-close btn-close_v1" data-ind="'+ work_ind +'-'+ unit_ind +'"></button></div>');

				unitCount[work_ind] = $('#calc-item-ind-'+ work_ind +' .calc__item-works').find('.calc__item-unit').length;

			}

		}

		for (var i = 0; i < unitCount.length; i++) {
			if (unitCount[i] > 2) {
				$('#calc-item-ind-'+ i +' .calc__item-works').html('<div class="txt">Все работы ('+ unitCount[i] +')</div>');
			}
		}

		for (var i = 0; i < item_sum.length; i++) {
			if (item_sum[i]) {
				$('#calc-item-ind-'+ i).addClass('calc__item_active');
				$('#pop-calc-work-'+ i).find('.calc-work-sum').html(item_sum[i].toFixed(2));
				$('#calc-item-ind-'+ i +' .calc__item-price-num').html(item_sum[i].toFixed(2));
			}
		}

		$('#calc-sum').html((sum) ? sum.toFixed(2) : 0);

		$('#calc-works-selected').html($('.calc__item_active').length);

	}
}

var calc_data;

$(document).ready(function() {

	$.ajax({
        url: "/local/templates/kap/js/calc-data.json"
    }).done(function (data) {
        calc_data = data;
        Calc.init();
        Calc.choice();
    });

	$('body').on('click', '.calc__btn', function() {
		_$ = $(this),
		type = _$.attr('data-type');

		if (!_$.hasClass('calc__btn_active')) {
			$('.calc__btn').removeClass('calc__btn_active');
			_$.addClass('calc__btn_active');
			Calc.build(type);
			Calc.choice();
		}
	});

	$('body').on('click', '.calc__item-btn', function() {
		var ind = $(this).attr('data-work-index');
		$('#calc-popup .form__fieldset').addClass('form__fieldset_hidden');
		$('#pop-calc-work-'+ ind).removeClass('form__fieldset_hidden');
		Calc.choice();
		Popup.show('#calc-popup', function() {
			Calc.choice();
		});
	});

	$('body').on('blur', '.form_calc-pop .form__text-input', function() {
		var val = $(this).val();
		if (val == '') {
			$(this).val(0);
		}
	});

	$('body').on('keyup', '.form_calc-pop .form__text-input', function() {
		var _$ = $(this);
		if (/^[0-9]*$/.test(_$.val())) {
			_$[0].defaultValue = _$.val();
		} else {
			_$.val(_$[0].defaultValue);
		}
		if (_$.val() > 10000) {
			_$.val(10000);
		}
		Calc.choice();
	});

	$('body').on('click', '.calc__item-unit .btn-close', function() {
		var ind = $(this).attr('data-ind');
		$('#chb-pop-calc-'+ ind).val(0);
		Calc.choice();
	});

	$('body').on('click', '.calc-reset', function() {
		$('.form_calc-pop .form__text-input').val(0);
		Calc.choice();
	});

});