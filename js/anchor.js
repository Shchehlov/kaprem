$(document).ready(function() {

	var winH = $(window).height();

	$('body').on('click', '.js-anchor', function () {
		var _$ = $(this),
		anch = _$.attr('href');

		if($(anch).length){

			$('.side-menu').css('transition', 'transform 0s linear 0s');

			var scrTo = $(anch).offset().top - $('.header').innerHeight() - 50;
			$('html, body').stop().animate({scrollTop: scrTo}, 1021, 'easeInOutQuart', function() {
				$('.js-anchor-sector').removeClass('anchor-sector-current');
				$(anch).addClass('anchor-sector-current');
				$('.side-menu__item').removeClass('side-menu__item_current');
				_$.parent().addClass('side-menu__item_current');
				$('.side-menu').css('transition', '');
			});
		}

		return false;
	});

	$(window).scroll(function() {
		var winScrTop = $(window).scrollTop(),
		winScrTopHalf = winScrTop + winH / 2;

		$('.js-anchor-sector').each(function() {
			var ofsT = $(this).offset().top;
			if (winScrTop < ofsT && winScrTopHalf > ofsT) {
				$('.js-anchor-sector').removeClass('anchor-sector-current');
				$(this).addClass('anchor-sector-current');
				$('.side-menu__item').removeClass('side-menu__item_current');
				$('a[href="#'+ $(this).attr('id') +'"]').parent().addClass('side-menu__item_current');
			}
		});

	});
	
});