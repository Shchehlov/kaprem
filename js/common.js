document.documentElement.setAttribute('data-useragent',  navigator.userAgent);

var winW, winH;
var dropVideo = function () {
    Object.keys(WowzaPlayer.f).forEach(function (id) {
        if (WowzaPlayer.f[id] !== null) WowzaPlayer.f[id].destroy();
    });
}
var initVideo = function (base) {
    Object.keys(WowzaPlayer.f).forEach(function (id) {
        //console.log(id, WowzaPlayer.f[id])
        //if (WowzaPlayer.f[id] !== null) WowzaPlayer.f[id].destroy();
    });
    base = base && base.length ? base : $('body');
    base.find(".video-wow").each(function () {
        var t = $(this),
            start = t.data("start"),
            stream = t.data("stream"),
            id = t.attr("id"),
            name = t.data("name");
        try {
            WowzaPlayer.create(id, {
                license: "PLAY1-apNYT-NkGdH-Ux9Ww-NzrmB-4hyEv",
                title: "",
                description: "",
                sourceURL: "https://fkr-cams.reginc.pro:1936/live/" + stream + "/playlist.m3u8",
                autoPlay: start,
                volume: 75,
                mute: !1,
                loop: !1,
                audioOnly: !1,
                uiShowQuickRewind: !0,
                uiQuickRewindSeconds: 30
            })
        } catch (e) {
            if (WowzaPlayer.f[id]) {
                try {
                    //WowzaPlayer.f[id].destroy()
                    WowzaPlayer.create(id,
                        {
                            "license": "PLAY1-apNYT-NkGdH-Ux9Ww-NzrmB-4hyEv",
                            "title": name,
                            "description": "",
                            "sourceURL": "https://59ba2b57bf04e.streamlock.net:1936/live/" + stream + "/playlist.m3u8",
                            "autoPlay": true,
                            "volume": "75",
                            "mute": false,
                            "loop": false,
                            "audioOnly": false,
                            "uiShowQuickRewind": true,
                            "uiQuickRewindSeconds": "30"
                        }
                    );
                } catch (e) {
                }
            }
        }
    })
}
$(document).ready(function () {

	if (typeof BX !== "undefined" && BX.admin.dynamic_mode_show_borders) {
		$('html').addClass('edit-mode');
	}

    function setDim() {
        winW = $(window).width();
        winH = $(window).height();

        $('.wrapper').css('padding-bottom', $('.footer').innerHeight());

        //old-version
        $('.wrapper').css('padding-top', $('.old-version').innerHeight());
        $('.header').css('top', $('.old-version').innerHeight());

        if (winW < 1200) {
            $('#header-mob-menu').css('top', ($('.old-version').innerHeight() + $('.header').innerHeight()));
        } else {
            $('.wrapper__full-height').css('padding-top', $('.old-version').innerHeight());
        }

        if (winW > 1000) {
            
            $('.home-footer').css('height', ($('.home__foot').innerHeight() + parseInt($('.home').css('padding-bottom'))));

            $('.home-footer__bounce-wrap').hover(function() {
                $(this).find('.home-footer__bounce').stop().animate({bottom: $('.home__foot').innerHeight()}, 321, 'easeOutCubic');
            }, function() {
                $(this).find('.home-footer__bounce').stop().animate({bottom: 0}, 321, 'easeInCubic');
            });
        }

    }

    setDim();

    $(window).resize(function() {
        if (winW != $(window).width()) {
            setDim();
        }
    });

    //numberspin
    if (winW > 1000) {
        $('.home__num').each(function() {
            numberspin(this);
        });
        $('.head__num-spin').each(function() {
            numberspin(this).start();
        });
    }
   
    var scr = scr1 = [];
    $(window).scroll(function() {
        var winScrTop = $(window).scrollTop();

        if (winW < 1000) {
            
            $('.home__num').each(function(i) {
                var ofsT = $(this).offset().top + 70;

                if ((winScrTop + winH) > ofsT && !scr[i]) {
                    scr[i] = true;
                    $(this).spincrement({
                        thousandSeparator: " ",
                        duration: 900
                    });
                }

            });

            $('.numspin1').each(function(i) {
                var ofsT = $(this).offset().top + 80;

                if ((winScrTop + winH) > ofsT && !scr1[i]) {
                    scr1[i] = true;
                    $(this).spincrement({
                        thousandSeparator: " ",
                        duration: 900
                    });
                }

            });

        } else {
            $('.numspin1').each(function() {
                var ofsT = $(this).offset().top + 80,
                ns = numberspin(this);

                if ((winScrTop + winH) > ofsT) {
                    ns.start();
                }
            });
        }

        

    });

    //init images
    flexImage(winW);
    ovfImage();

    //headerFix
    $(window).scroll(function () {
        if (!$('body').hasClass('is-popup-opened')) {
            var winScrTop = $(window).scrollTop();
            if (winScrTop > 21) {
                $('.header').addClass('header_fixed');
            } else {
                $('.header').removeClass('header_fixed');
            }
        }
    });

    //side menu fix
    if ($('#js-side-menu').length && winW > 1200) {
        var _$ = $('#js-side-menu'),
            ofsT = _$.offset().top,
            ofsL = _$.offset().left,
            wd = _$.width(),
            hg = _$.height(),
            headerH = $('.header').innerHeight(),
            footerH = $('.footer').innerHeight();

        _$.css('width', wd);

        $(window).scroll(function () {
            var winScrTop = $(window).scrollTop(),
            ofstF = ($('.footer').length) ? ($('.footer').offset().top) : 0;

            if ((winScrTop + headerH + 50 + hg) > (ofstF - 50)) {
                _$.addClass('side-menu_bottom');
                _$.css({top: 'auto', bottom: (footerH + 50)});
            } else if (winScrTop > (ofsT - 50 - headerH)) {
                _$.addClass('side-menu_fixed').css({top: (headerH + 50)});
                _$.removeClass('side-menu_bottom');
            } else {
                _$.removeClass('side-menu_fixed');
            }

            $('.side-menu__a').each(function() {
                var _$a = $(this),
                aOfs = _$a.offset().top;

                $('.container_bg-photo, .container_bg-red, .container_bg-black, .container_bg-red-black').each(function() {
                    var _$c = $(this),
                    cOfs = _$c.offset().top,
                    cH = _$c.innerHeight();

                    if (aOfs > cOfs && aOfs < (cOfs + cH)) {
                        _$a.addClass('side-menu__a_wh');

                        if (_$c.hasClass('container_bg-photo') || _$c.hasClass('container_bg-red')) {
                            _$a.addClass('side-menu__a_act-wh').parent('li').addClass('side-menu__item_current-white');
                        }

                        return false;
                    } else {
                        _$a.removeClass('side-menu__a_wh side-menu__a_act-wh').parent('li').removeClass('side-menu__item_current-white');
                    }

                });


            });


        });
    }

    //Init Sliders
    if(typeof BX === "undefined" || (typeof BX !== "undefined" && !BX.admin.dynamic_mode_show_borders)){
    	$('#expert-slider').slick({
    		infinite: true,
    		slidesToShow: 1,
    		slidesToScroll: 1
    	});
        $('#interview-slider').slick({
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 3
        });
        $('#docs-slider').slick({
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            dots: true,
            responsive: [
            {
                breakpoint: 1000,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
            ]
        });
        $('#polls-slider').slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true
        });
    }
    
    $('#portal-slider').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1
    });
    
    // Vital
    $('.index_home_slider').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true
    });
    // Vital

    if (winW < 1000) {
        $('#interview-mob-slider').slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1
        });
    }


    if (winW > 1000) {
        $('#build-slider').slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            dots: true
        });
    }

    if (winW > 1000) {
        $('#works-slider').slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            dots: true
        });
    }


    if (winW < 1000) {
        $('#num-slider').slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            dots: true
        });

        $('#step-slider').slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            dots: true
        });

    }

    //Building
    if (winW > 1000) {
        $('body').on('mouseenter', '.build__item', function () {
            var _$ = $(this),
                ind = _$.attr('data-index');
            $('.build__btn').removeClass('build__btn_active');
            $('.build__btn_i' + ind).addClass('build__btn_active');
        });

        $('body').on('mouseleave', '.build__item', function () {
            $('.build__btn').removeClass('build__btn_active');
            $('.build__item').removeClass('build__item_active');
        });

        $('body').on('mouseenter', '.build__btn', function () {
            var _$ = $(this),
                ind = _$.attr('data-index');
            if (!_$.hasClass('build__btn_active')) {
                $('.build__btn').removeClass('build__btn_active');
                $('.build__item').removeClass('build__item_active');
                _$.addClass('build__btn_active');
                $('.build__item_i' + ind).addClass('build__item_active');
                if (!$('.build__item_i' + ind).closest('.slick-current').length) {
                    $('#build-slider').slick('slickNext');
                }
            }
        });

    }
    // автокомплит на поле поиска сврего дома на странице результатов
    var search_input = $("#search-i-txt-1");
    if (search_input.length) {
        var afm = search_input.parents('form');
        search_input.autocomplete({
            serviceUrl: '/map/json.php',
            paramName: 'address',
            onSelect: function (a, b) {
                if (a.id) {
                    search_input.val(a.value);
                    afm.find('[name="hid"]').val(a.id);
                    afm.submit();
                    return false;
                } else {
                    search_input.val("")
                }
            },
            dataType: "json"
        });
    }
    // автокомплит на форме отзыва
    var formse_input = $("#formi-txt-1");
    if (formse_input.length) {
        formse_input.autocomplete({
            serviceUrl: '/map/json.php',
            paramName: 'address',
            onSelect: function (a, b) {
                if (a.id) {
                    formse_input.val(a.value);
                    return false;
                } else {
                    formse_input.val("")
                }
            },
            dataType: "json"
        });
    }

    /*PlayVideo*/
    $('body').on('click', '.video__play', function () {
        var _$ = $(this),
            VidCont = _$.closest('.video'),
            Prev = VidCont.find('.video__preview'),
            Iframe = VidCont.find('.video__iframe');

        if (Iframe.length) {
            var ifrSrc = function (vid) {
                var utm = vid.split('?v=');
                return 'https://www.youtube.com/embed/' + utm[1] + '?autoplay=1';
            }(_$.attr('data-video'));

            Iframe.attr('src', ifrSrc);
            _$.addClass('hide');
            Prev.addClass('hide');
        }

    });

});

function initHousePreviewSliders() {
    if (winW > 1000) {
        $('#map-work-slider').slick({
            infinite: true,
            slidesToShow: 4,
            slidesToScroll: 4,
            arrows: false,
            dots: true,
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                    }
                }
            ]
        });
    }


    $('#gallery-slider').on('init', function () {
        ovfImage('#gallery-slider');
    });
    $('#gallery-slider').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: false,
        responsive: [
            {
                breakpoint: 1000,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    });

}


function initPopupSlider() {

    if ($(window).width() > 1000) {
        $('#popup-gallery-slider').slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            dots: false
        });

        $('#popup-gallery-slider-thumbs').on('init', function () {
            ovfImage('#popup-gallery-slider-thumbs');
        });
        $('#popup-gallery-slider-thumbs').slick({
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            arrows: false,
            dots: false
        });

        $('#popup-gallery-slider').on('afterChange', function (event, slick, currentSlide) {
            $('#popup-gallery-slider-thumbs').slick('slickGoTo', currentSlide);
        });

        $('body').on('click', '#popup-gallery-slider-thumbs .gallery__sl-item', function () {
            var ind = $(this).attr('data-slick-index');
            $('#popup-gallery-slider').slick('slickGoTo', ind);
            return false;
        });

    }

    if ($(window).width() < 1000) {
        $('#popup-docs-slider').slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            dots: true
        });
        $('#popup-gallery-slider2').slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            dots: false
        });
    }
}

window.onload = function () {

    if ($('.preloader').length) {
        $('.preloader').addClass('preloader_hide');
        if (winW > 1000) {
            setTimeout(function() {
                $('.home__num').each(function() {
                    numberspin(this).start();
                });
            }, 500);
        } 
    }

    if (winW < 1000) {
        $('.head__num-spin').spincrement({
            thousandSeparator: " ",
            duration: 900
        });
    }

}