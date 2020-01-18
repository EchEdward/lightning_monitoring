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

};


function PrintPlacemark(arr,color,name,coment){
    myPieChart = new ymaps.Placemark(arr,  {
        balloonContentHeader:name,
        balloonContent: coment,  
        hintContent: name,

    },
    {   
        preset: 'islands#circleDotIcon',
        iconColor: color,
    });
    
    return myPieChart;
};

function StrikePlacemark(arr,date,strike){
    myPlacemark = new ymaps.Placemark(arr, {
        balloonContentHeader:date,  
        hintContent: date,
    }, {
        // Опции.
        // Необходимо указать данный тип макета.
        iconLayout: 'default#image',
        // Своё изображение иконки метки.
        iconImageHref: static_dir +'static/icon/'+strike+'.png',
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
        fillColor: "#ff0000",
        fillOpacity : 0.5,
        hasBalloon: false,
        hasHint: false,
        strokeColor:"#ffffff"
    });

    return circle
};

