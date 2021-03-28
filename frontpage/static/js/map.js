ymaps.ready(init);

let myMap;
let static_dir = '';
//'static/icon/'+strike+'.png'
// /lightning_server/


function init () {
    // Параметры карты можно задать в конструкторе.
    myMap = new ymaps.Map(
        // ID DOM-элемента, в который будет добавлена карта.
        'map',
        // Параметры карты.
        {
            // Географические координаты центра отображаемой карты.
            center: [53.85, 27.97],
            // Масштаб.
            zoom: 7,
            // Тип покрытия карты: "Спутник".
            //type: 'yandex#satellite'
            // Тип покрытия карты: "Схема".
            //type:'yandex#map'
            //Тип покрытия карты: "Гибрид".
            type:"yandex#hybrid"
        }, {
            // Поиск по организациям.
            autoFitToViewport: 'always',
            searchControlProvider: 'yandex#search',
            // Убираем ссылку открыть в яндекс картах
            suppressMapOpenBlock: true,
        }
    );
    
    myMap.container.fitToViewport()
    // Удалим с карты «Ползунок масштаба».
    myMap.controls.remove('geolocationControl');
    // Удалим с карты «Поиск по карте».
    myMap.controls.remove('searchControl');
    // Удалим с карты «Пробки».
    myMap.controls.remove('trafficControl');

    /* let myPolyline = new ymaps.Polyline([
        // Указываем координаты вершин ломаной.
        [53.61585, 23.998238],
        [53.628976, 24.011201],
        [53.656572, 24.014361],
        [53.681755, 24.029845]
        
    ], {
        // Описываем свойства геообъекта.
        // Содержимое балуна.
        balloonContent: "Ломаная линия",
        // Содержимое загаловка балуна.   
        balloonContentHeader:"Ломаная линия",
        // Содержимое высплывающей подсказки балуна. 
        hintContent:"Ломаная линия"
    }, {
        // Задаем опции геообъекта.
        // Отключаем кнопку закрытия балуна.
        balloonCloseButton: false,
        // Цвет линии.
        strokeColor: "#000000",
        // Ширина линии.
        strokeWidth: 4,
        // Коэффициент прозрачности.
        strokeOpacity: 0.5
    }); */
    
    //myMap.geoObjects.add(myPolyline);

    /* myPieChart = new ymaps.Placemark([53.61585, 23.998238],  {
        iconContent: 'опора № 90',
        iconColor:  '#FFFFFF'
    },
    {   
        preset: 'islands#blackStretchyIcon'        
    });

    myMap.geoObjects.add(myPieChart) */
}


function PrintPlacemark(arr,color,name,coment){
    myPieChart = new ymaps.Placemark(arr,  {
        balloonContentHeader:name,
        balloonContent: coment,  
        hintContent: name,

    },
    {   
        preset: 'islands#circleDotIcon',//'islands#circleDotIconWithCaption',
        iconColor: color,
    });
    
    return myPieChart;
};

function StrikePlacemark(arr,date,strike){
    myPlacemark = new ymaps.Placemark(arr, {
        balloonContentHeader:date,
        //balloonContent: type_obj+", "+date+", "+dist.toFixed(2)+' м',  
        hintContent: date,
    }, {
        // Опции.
        // Необходимо указать данный тип макета.
        iconLayout: 'default#image',
        // Своё изображение иконки метки.
        iconImageHref: `/${static_dir}static/icon/${strike}.png`,
        // Размеры метки.
        iconImageSize: [20, 20],
        // Смещение левого верхнего угла иконки относительно
        // её "ножки" (точки привязки).
        iconImageOffset: [-10, -20]
    });
    return myPlacemark;
};


function StrikeCircle(arr){
    let circle = new ymaps.Circle([arr, 10], {

    }, {
        //geodesic: true,
        fillColor: "#ff0000",
        fillOpacity : 0.5,
        hasBalloon: false,
        hasHint: false,
        strokeColor:"#ffffff"
    });

    return circle
};



function setCenter () {
    myMap.setCenter([57.767265, 40.925358]);
}

function setBounds () {
    // Bounds - границы видимой области карты.
    // Задаются в географических координатах самой юго-восточной и самой северо-западной точек видимой области.
    myMap.setBounds([[37, 38], [39, 40]]);
}

function setTypeAndPan (arr) {
    // Меняем тип карты на "Гибрид".
    myMap.setType('yandex#hybrid');
    // Плавное перемещение центра карты в точку с новыми координатами.
    myMap.panTo(arr, {
            // Задержка между перемещениями.
            delay: 1500
        });
}

function PrintPolyline(arr,col,name,coment){
    let myPolyline = new ymaps.Polyline(arr, {
        // Описываем свойства геообъекта.
        // Содержимое балуна.
        balloonContent: coment,
        // Содержимое загаловка балуна.   
        balloonContentHeader:name,
        // Содержимое высплывающей подсказки балуна. 
        hintContent: name,

    }, {
        // Задаем опции геообъекта.
        // Отключаем кнопку закрытия балуна.
        balloonCloseButton: true,
        // Цвет линии.
        strokeColor: col,
        // Ширина линии.
        strokeWidth: 4,
        // Коэффициент прозрачности.
        strokeOpacity: 1
    });
    //myPolyline.balloon.options = {closeButton : true};
    return myPolyline;
};

