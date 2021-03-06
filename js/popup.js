var Popup = {
	closeCallback: null,
	play: null,
	ind: 0,
	groupClass: '',
	show: function(id,fun) {
		var _ = this,
		_popup = $(id);
		_.Pop = _popup;
		if (_popup.length && _popup.hasClass('popup__window')) {
			var pos = $(window).scrollTop();
			$('.popup').fadeIn(321).scrollTop(0);
			$('.popup__window').removeClass('popup__window_visible');
			_popup.addClass('popup__window_visible');
			$('body').css('top', -pos).attr('data-position', pos).addClass('is-popup-opened');

			setTimeout(function() {
				ovfImage('#media-popup');
				initPopupSlider();
			}, 721);

		}
		_.closeCallback = fun || function() {};
	},
	hide: function() {
		var _ = this;
		$('.popup__window').removeClass('popup__window_visible');
		$('.popup').fadeOut(321);
		$('.popup__message').remove();
		$('body').removeClass('is-popup-opened').removeAttr('style');
		$('html,body').scrollTop($('body').attr('data-position'));
		if($('.popup #player').length > 0) {
			$('.popup #player').attr('src', '');
		}
		_.closeCallback();
	},
	message: function(id,msg,fun) {
		var _ = this;
		$(id).find('.popup__inner').html('<div class="popup__message">'+ msg +'</div>');
		_.show(id);
		_.closeCallback = fun || function() {};
	},
	media: function(_$,args,show) {
		var _ = this,
		id = $(_$).attr('href'),
		Pop = $(id),
		Img = Pop.find('.popup-media__image'),
		BtnPlay = Pop.find('.popup-media__play'),
		Iframe = Pop.find('.popup-media__iframe');

		if (args.data) {
			var data = JSON.parse( args.data );
			for (var i = 0; i < data.length; i++) {
				Pop.find('.popup-media__data-'+ i).html(data[i]);
			}
		}

		if (args.imgSize) {
			var imgSize = JSON.parse(args.imgSize);
			Img.attr('width', imgSize[0]).attr('height', imgSize[1]);
		}
		
		Img.css({visibility: 'visible', marginLeft: '', marginTop: ''}).removeClass('ovf-image_w ovf-image_h').attr('src', args.img);
		Iframe.css('visibility', 'hidden').attr('src', '');
		BtnPlay.css('visibility', 'hidden');
		
		if (show) {
			_.show(id);
		} else {
			setTimeout(function() {
				ovfImage('#media-popup');
			}, 721);
		}

		if (args.vid) {
			BtnPlay.css('visibility', 'visible').attr('href', args.vid);

			_.play = function() {
				var ifrSrc = function(vid) {
					var utm = vid.split('?v=');
					return 'https://www.youtube.com/embed/'+ utm[1] +'?autoplay=1';
				}(args.vid);
				BtnPlay.css('visibility', 'hidden');
				Img.css('visibility', 'hidden');
				Iframe.css('visibility', 'visible').attr('src', ifrSrc);
			}

		}

		_.groupClass =  '.'+ $(_$).attr('data-group-class');
		_.ind = $(_.groupClass).index(_$);

		_.closeCallback = function() {
			Img.css('visibility', 'visible').attr('src', '');
			Iframe.css('visibility', 'hidden').attr('src', '#');
			BtnPlay.css('visibility', 'hidden');
		};

	},
	next: function(dir) {
		var _ = this,
		Next,
		ind = _.ind;

		if (dir == 'next') {
			ind++;
			if ($(_.groupClass).eq(ind).length) {
				Next = $(_.groupClass).eq(ind);
			}
		} else if (dir == 'prev' && ind > 0) {
			ind--;
			if ($(_.groupClass).eq(ind).length) {
				Next = $(_.groupClass).eq(ind);
			}
		}

		if (Next) {
			var args = {
				img: Next.attr('data-image'),
				imgSize: Next.attr('data-image-size'),
				vid: Next.attr('data-video'),
				group: Next.attr('data-group-class'),
				data: Next.attr('data-data'),
			};
			_.media(Next, args);
		}
		

	}

};


$(document).ready(function() {
	$('body').on('click', '.js-open-popup', function () {
		Popup.show($(this).attr('href'));
		return false;
	});

	$('body').on('click', '.js-open-popup-media', function () {
		var args = {
			img: $(this).attr('data-image'),
			imgSize: $(this).attr('data-image-size'),
			vid: $(this).attr('data-video'),
			group: $(this).attr('data-group-class'),
			data: $(this).attr('data-data'),
		};
		Popup.media(this, args, true);
		return false;
	});

	$('body').on('click', '.popup-media__play', function () {
		Popup.play();
		return false;
	});

	$('body').on('click', '.popup-media__arr', function () {
		Popup.next($(this).attr('data-dir'));
		return false;
	});

	$('body').on('click', '.js-open-msg-popup', function () {
		Popup.message('#message-popup', 'Это всплывашка с сообщением.<br> вызов: <span class="c-red">Popup.message("#id", "Текст или html");</span>', function() { alert('После закрытия'); });
		return false;
	});

	$('body').on('click', '.popup__close', function () {
		Popup.hide();
		return false;
	});

	$('body').on('click', '.popup', function(e) {
		if (!$(e.target).closest('.popup__window').length) {
			Popup.hide();
		}
	});



	if (window.location.hash) {
		Popup.show(window.location.hash);
	}

});
/**
 * Created by ncheremisin on 11.12.17.
 */
$(document).ready(function () {
    $(document).on('click', '.js-popup', function (e) {
        e.preventDefault();
        var code = $(this).attr('href').split('#');
        var callbk = function () {
            var iframe = $('#article-popup__' + code[1]).find('iframe');
            var src = iframe.attr('src');
            iframe.attr('src', '');
            iframe.attr('src', src);
        };
        if ($('#article-popup__' + code[1]).length) {
            Popup.show('#article-popup__' + code[1], callbk)
        } else {
            $.ajax({
                url: '/ajax/get_popup.php',
                type: "POST",
                dataType: "html",
                data: {id: code[1]},
                success: function (response) {
                    $('body > .popup').append(response);
                    setTimeout(function () {
                        Popup.show('#article-popup__' + code[1], callbk);
                    }, 0)
                },
                error: function () {
                    alert('Send Error');
                }
            });
        }
    })
});