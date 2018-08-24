var wrap = $("#map-wrap"),
    myMap, dropSearch,
    filter_box = $("#map-filter"),
    getHouseBox = function () {
        return $('#map-house');
    };
getHousePop = function () {
    return $('#map-house-popup');
};
ymaps.ready(init);
Array.prototype.in_array = function (p_val) {
    for (var i = 0, l = this.length; i < l; i++) {
        if (this[i] == p_val) {
            return true;
        }
    }
    return false;
}
$('body').on('click', '[data-tohref]', function (e) {
    //e.preventDefault();
    var _ = $(this),
        _url = _.data('tohref');
    window.location.href = _url;
})
var loadHouse = function (objectId) {
    history.pushState({}, '', '/map/?hid=' + objectId)
    //object = objectManager.objects.getById(objectId);
    dropSearch = true;
    $.ajax({
        url: '/map/popup.php',
        data: {hid: objectId},
        success: function (data) {
            getHousePop().html(data);
            ovfImage('#popup-gallery-slider');
            ovfImage('#popup-gallery-slider-thumbs');
            ovfImage('#popup-gallery-slider2');
        },
        error: function () {
            Popup.message('#message-popup', 'Send Error');
        }
    });
    $('body').on('click', '[href="#house-popup"]', function (e) {
        initVideo(getHousePop());
    })
    $.ajax({
        url: '/map/house.php',
        data: {hid: objectId},
        success: function (data) {
            var hbox = getHouseBox();
            if (hbox.length) {
                hbox.fadeOut();
                hbox.remove();
                wrap.append(data);
            } else {
                filter_box.fadeOut();
                wrap.append(data);
            }
            initHousePreviewSliders();
            setTimeout(function () {
                initVideo(getHouseBox());
            }, 100)
        },
        error: function () {
            Popup.message('#message-popup', 'Send Error');
        }
    })
}

function init() {
    setTimeout(function () {
        $('.map__loading-wrap').addClass('hide');
    }, 10000);

    myMap = new ymaps.Map('map', {
        center: [lat, lon],
        zoom: zoom,
        controls: []
    }, {
        searchControlProvider: 'yandex#search'
    }),
        objectManager = new ymaps.ObjectManager({
            clusterize: true,
            clusterHasBalloon: false,
            gridSize: 64,
        });
    if (house)
        loadHouse(house);

    objectManager.objects.options.set('preset', 'islands#redCircleDotIcon');
    objectManager.clusters.options.set('preset', 'islands#invertedBlackClusterIcons');
    objectManager.objects.events.add('click', function (e) {
        var objectId = e.get('objectId');
        var obj = objectManager.objects.getById(objectId)
        myMap.setCenter(obj.geometry.coordinates, 18);
        loadHouse(objectId);
    });
    myMap.geoObjects.add(objectManager);

    $('body').on('click', '.map-back', function () {
        dropVideo()
        var hbox = getHouseBox();
        if (hbox.length) {
            hbox.fadeOut();
            hbox.remove();
        }
        $('#map-i-txt-1').val('');
        filter_box.fadeIn();
        toMainView()
    });
    $('body').on('submit', '.form_map', function () {
        var pa = [];
        if (omsuId) {
            pa.push("properties.o == '" + omsuId + "'");
        }
        if (kprId) {
            pa.push("properties.p" + kprId + " == '1'");
        }
        if (with_cams) {
            console.log('with_cams 111');
            pa.push("properties.c == '1'");
        }

        objectManager.setFilter(ps.join(' && '));

        return false;
    });

    $("#map-i-txt-1").autocomplete({
        serviceUrl: '/map/json.php?s=1',
        paramName: 'address',
        onSelect: function (a, b) {
            if (a.id) {
                var obj = objectManager.objects.getById(a.id)
                myMap.setCenter(obj.geometry.coordinates, 18);
                loadHouse(a.id)
                return false;
            }
        },
        dataType: "json"// список городов на сервере
    });

    $('body').on('click', '.form_map__button', function () {
        var map_adress = $('#map-i-txt-1').val();
        if (!map_adress) {
            toMainView()
        } else
            ymaps.geocode(map_adress, {
                results: 1
            }).then(function (res) {
                var firstGeoObject = res.geoObjects.get(0),
                    coords = firstGeoObject.geometry.getCoordinates(),
                    bounds = firstGeoObject.properties.get('boundedBy');
                myMap.setBounds(bounds, {});
            });
        return false;

    });

    $.ajax({
        url: "/map/json.php",
    }).done(function (data) {

        var charge_calculated = 0;
        var pa = [];
        if (omsuId) {
            pa.push("properties.o == '" + omsuId + "'");
        }


        /*
        if(currentKprIDs && currentKprIDs.length){
            let paOR = [];
            currentKprIDs.forEach(function(item){
                paOR.push("properties.p" + item + " == '1'");
            });
            pa.push("(" + paOR.join(' || ') + ")")
        }else if (kprId) {
            pa.push("properties.p" + kprId + " == '1'");
        }*/

        if (with_cams) {
            console.log('with_cams 22222');
            pa.push("properties.c == '1'");
            if (kprId) {
                pa.push("properties.p" + kprId + " == '1'");
            }
        }else{
            if(currentKprIDs && currentKprIDs.length){
                let paOR = [];
                currentKprIDs.forEach(function(item){
                    paOR.push("properties.p" + item + " == '1'");
                });
                pa.push("(" + paOR.join(' || ') + ")")
            }else if (kprId) {
                pa.push("properties.p" + kprId + " == '1'");
            }
        }
        
        console.log('pa: ', pa);
        
        console.log('pa.join(\' && \'): ', pa.join(' && '));
        
        if (pa.length)
            objectManager.setFilter(pa.join(' && '));

        objectManager.add(data);
        objectManager.objects.each(function (el) {
            if (el.properties.c == '1')
                objectManager.objects.setObjectOptions(el.id, {
                    preset: 'islands#blueVideoCircleIcon'
                });
            if (!kprId) {
                kprId = currentKprID;
            }
            //if (el.properties['p'+kprId] == '1') {
            //    charge_calculated += el.properties.p? el.properties.p:0 ;
            //}
        })

        if (charge_calculated > 1000000) {
            charge_calculated = (charge_calculated/1000000).toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' млн. руб'
        } else if (charge_calculated > 1000) {
            charge_calculated = (charge_calculated/1000).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + 'тыс. руб'
        }
        //$('#charge_calculated').text(charge_calculated);

    });
    var toMainView = function () {
        history.pushState({}, '', '/map/');
        myMap.setCenter([center_lat, center_lon], center_zoom);
    }
    //objectManager.add(map_data);

}