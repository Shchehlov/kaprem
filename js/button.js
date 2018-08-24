$(document).ready(function() {

	/*Toggle*/
	$('body').on('click', '.js-toggle', function() {
		var _ = $(this),
		targetId = _.attr('data-target-id'),
		targetClass = _.attr('data-target-class'),
		targetElements = _.attr('data-target-elements');

		function tId(st) {
			if (targetId) {
				var _$ = $('#'+ targetId);
				if (st) {
					_$.addClass('toggled');

					if (targetId == 'header-mob-menu') {
						var pos = $(window).scrollTop();
						$('body').css('top', -pos).attr('data-position', pos).addClass('is-popup-opened');
					}

				} else {
					_$.removeClass('toggled');

					if (targetId == 'header-mob-menu') {
						$('body').removeClass('is-popup-opened').removeAttr('style');
						$('html,body').scrollTop($('body').attr('data-position'));
					}

				}

				if (winW < 1000 && targetId == 'login-block') {
					$('#header-mob-menu').animate({scrollTop: (_$.offset().top - 72) }, 300);
				}

			}
		}

		function tCl(st) {
			if (targetClass) {

				var _$ = null,
				toggledClass = '',
				splClass = targetClass.split(':');

				if (splClass.length > 1) {
					_$ = $('.'+ splClass[0]);
					toggledClass = splClass[1];
				} else {
					_$ = $('.'+ targetClass);
					toggledClass = 'toggled';
				}
				
				if (st) {
					_$.addClass(toggledClass);
				} else {
					_$.removeClass(toggledClass);
				}

			}
		}

		function tEl(st) {
			if (targetElements) {

				var _$ = $(targetElements), 
				exSel = _.attr('data-exclude-elements-by') || '';

				if (_.attr('data-elements-parent')) {
					var $par = $(_.attr('data-elements-parent'));

					if (st) {
						$par.find(targetElements).not(exSel).addClass('toggled');
					} else {
						$par.find(targetElements).not(exSel).removeClass('toggled');
					}

				} else {
					if (st) {
						_$.not(exSel).addClass('toggled');
					} else {
						_$.not(exSel).removeClass('toggled');
					}
				}
				
			}
		}
		
		if (!_.hasClass('toggled')) {
			tId(1);
			tCl(1);
			tEl(1);
			_.addClass('toggled');
			var secTxt = _.attr('data-second-button-text');
			if (secTxt) {
				if (!_.attr('data-first-button-text')) {
					_.attr('data-first-button-text', _.html());
				}
				_.html(secTxt);
			}
		} else {
			tId(0);
			tCl(0);
			tEl(0);
			_.removeClass('toggled');
			var fstTxt = _.attr('data-first-button-text');
			if (fstTxt) {
				_.html(fstTxt);
			}
		}

		return false;
	});

	$(document).on('click', 'body', function(e) {
		if (!$(e.target).closest('.user').length) {
			$('.js-toggle[data-target-id="login-block"], #login-block').removeClass('toggled');
		}
	});

	$(document).on('click', '#pagination-container .more_goods', function () {

		var ajaxurl = $(this).parent().parent().find('div.bx-pagination  ul li.bx-pag-next a').attr('href');
		console.log(ajaxurl);
		var thatTxt = $(this).html();
		var that = this;
		$(this).html('...');
		if(ajaxurl!==undefined){
			$.ajax({
				type: "POST",
				url: ajaxurl,
				data: {'ajax_get_page': 'y'},
				dataType: "html",
				success: function (data) {
					$('#pagination-container .pagination_wrap').remove();
					var Pagination = $(data).find('.pagination_wrap').html();
					$('#pagination-container').append($(data).find('#pagination-container').html());
					history.pushState('', '', ajaxurl);
					$(that).html(thatTxt);
				}
			});
		}
		return false;
	});

	$(document).on('click', '#pagination-container-2 .more_goods', function () {
		var ajaxurl = $(this).parent().parent().find('div.bx-pagination  ul li.bx-pag-next a').attr('href');
		console.log(ajaxurl);
		var thatTxt = $(this).html();
		var that = this;
		$(this).html('...');
		if(ajaxurl!==undefined){
			$.ajax({
				type: "POST",
				url: ajaxurl,
				data: {'ajax_get_page': 'y'},
				dataType: "html",
				success: function (data) {
					$('#pagination-container-2 .pagination_wrap').remove();
					var Pagination = $(data).filter('.pagination_wrap').html();
					$('#pagination-container-2').append($(data).find('#pagination-container-2').html());
					history.pushState('', '', ajaxurl);
					$(that).html(thatTxt);
				}
			});
		}
		return false;
	});

});