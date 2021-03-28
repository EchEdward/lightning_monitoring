
// /lightning_server/
// Цвета для всех классов напряжения
let colors = {750: '#1f7a00',
                330: "#1a009e",
                220: "#c20202",
                110: '#037bfc',
                35: "#d96200",
                10: "#EEFF00",};

let strikes_serch_param = {
    "real_time":{
        'object_type':'Все',
        'rup':"Все",
        'branch':"Все",
        'Unom':"",
        'Name':"",
        'dist':"",
        'all_check':false,},

    "time_period":{
        'object_type':'Все',
        'rup':"Все",
        'branch':"Все",
        'Unom':"",
        'Name':"",
        'dist':"",
        'all_check':false,},   
};

let ZoomCircleRadius = {
    0 : 50000,
    1 : 20000,
    3 : 10000,
    4 : 6000,
    5 : 3000,
    6 : 1000,
    7 : 700,
    8 : 400,
    9 : 200,
    10: 90,
    11: 40,
    12: 20,
    13: 10,
    14: 6,
    15: 3,
    16: 1,
    17: 0.7,
    18: 0.3,
    19: 0.2
};

let cord_complete = false;

// координаты для построения обьектов на карте
let coordinates;
// Обьекты ссылок на линии и метки на карте
let objects_dict = {};
// Обьекты линий и меток на карте 
let map_objects_cord = {};

// Таймер просмотра журала ударов молний в реалтайме
let timer_load_log_strikes;

// Обьект запроса данных об ударе молний для периода времени
let period_log_data = [[],{},{}];
// Html блоки ссылок на события журнала
let time_period_content = {};
// Мап обьекты для периода времени
let map_objects_time_period = {};

// Обьект запроса данных об ударе молний для периода времени
let real_time_log_data = [[],{},{}];
// Html блоки ссылок на события журнала
let real_time_content = {};
// Мап обьекты для периода времени
let map_objects_real_time = {};
// не показываем круги при первом запуске 
let ShowCircle = false;
// Обьекты кругов для отоббражения новых молний
let CircleObj = [];


jQuery('document').ready(function(){
    //Создаём таб виджет
    jQuery("#tabs").tabs();
    jQuery("#tabs").tabs({heightStyle: "fill"});

    // Создаём выпадающий список энергообьектов
    jQuery("#objtyte_1").selectmenu();
    jQuery("#objtyte_2").selectmenu();

    // Создаём выпадающий список Рупов
    jQuery("#rup_1").selectmenu(); /* {width:  jQuery(this).attr("width")} */
    jQuery("#rup_1").selectmenu().selectmenu("menuWidget").css("height","200px");
    jQuery("#rup_1").selectmenu({
        position: {
         my:"left+10 top",
         at:"left top+20"},});

    jQuery("#rup_2").selectmenu(); /* {width:  jQuery(this).attr("width")} */
    jQuery("#rup_2").selectmenu().selectmenu("menuWidget").css("height","200px");
    jQuery("#rup_2").selectmenu({
        position: {
        my:"left+10 top",
        at:"left top+20"},});
    
    // Создаём выпадающий список филиалов
    jQuery("#branch_1").selectmenu({width:  false});
    jQuery("#branch_1").selectmenu().selectmenu("menuWidget").css("height","200px");
    jQuery("#branch_1").selectmenu({
        position: {
         my:"left+10 top",
         at:"left top+20"},});

    jQuery("#branch_2").selectmenu({width:  false});
    jQuery("#branch_2").selectmenu().selectmenu("menuWidget").css("height","200px");
    jQuery("#branch_2").selectmenu({
        position: {
        my:"left+10 top",
        at:"left top+20"},});

    /* jQuery(".bwidth").selectmenu({width:  jQuery(this).attr("width")}); */
    
    // Настраиваем поля ввода номинального напряжения
    jQuery("#Unom_1").spinner();
    jQuery("#Unom_1").keyup(function() {
        if(  isNaN (jQuery(this).val() )){ //Only numbers !
            jQuery(this).prop("value", "0") ; //Back to 0, as it is the minimum
        }
    });

    jQuery("#Unom_2").spinner();
    jQuery("#Unom_2").keyup(function() {
        if(  isNaN (jQuery(this).val() )){ //Only numbers !
            jQuery(this).prop("value", "0") ; //Back to 0, as it is the minimum
        }
    });

    // Настраиваем поле ввода растояния от удара молнии до энергообьекта
    jQuery("#dist_2").spinner();
    jQuery("#dist_2").keyup(function() {
        if(  isNaN (jQuery(this).val() )){ //Only numbers !
            jQuery(this).prop("value", "0") ; //Back to 0, as it is the minimum
        }
    });

    // Добавляем кнопу поиска на первой вкладке табов
    jQuery("#search-btn-1").button({icons: {primary: 'ui-icon-search'}});
    jQuery("#search-btn-2").button({icons: {primary: 'ui-icon-search'}});
    
    // Создаём поля для выбора даты и времени
    jQuery('#date_start_2').bootstrapMaterialDatePicker({ format : 'YYYY-MM-DD HH:mm',
                     lang : 'ru', weekStart : 1, cancelText : 'Отмена', maxDate : new Date() });

    jQuery('#date_end_2').bootstrapMaterialDatePicker({ format : 'YYYY-MM-DD HH:mm',
                     lang : 'ru', weekStart : 1, cancelText : 'Отмена', maxDate : new Date() });


    // Запускаем радиочекбокс
    jQuery("input[type='radio']").checkboxradio();
    jQuery("input[type='radio']").click(radio_event);
    jQuery("#radio-1").click();
    //$("#leftFit").hide()

    // Переопределяем поведение при изменении размера окна браузера
    jQuery(window).resize(function(){
        let a1 = Number(jQuery("#fragment-1").css("width").slice(0,-2));
        let b1 = 95;

        let a2 = Number(jQuery("#fragment-1").css("width").slice(0,-2));
        let b2 = 95;

        jQuery("#rup_1").selectmenu({width: (a1-b1)+"px" });
        jQuery("#objtyte_1").selectmenu({width: (a1-b1)+"px" });
        jQuery("#branch_1").selectmenu({width: (a1-b1)+"px" });
        jQuery("#Unom_1").css("width", (a1-b1-41)+"px");

        jQuery("#rup_2").selectmenu({width: (a2-b2)+"px" });
        jQuery("#objtyte_2").selectmenu({width: (a2-b2)+"px" });
        jQuery("#branch_2").selectmenu({width: (a2-b2)+"px" });
        jQuery("#Unom_2").css("width", (a2-b2-41)+"px");
        jQuery("#dist_2").css("width", (a2-b2-41)+"px");
        jQuery("#date_start_2").css("width", (a2-b2-4)+"px");
        jQuery("#date_end_2").css("width", (a2-b2-4)+"px");
        
        let h1 = jQuery(window).height();
        let h2 = Number(jQuery("#tab_top").css("height").slice(0,-2));

        jQuery("#fragment-1").css("height", (h1-h2-50)+"px");
        jQuery("#fragment-2").css("height", (h1-h2-50)+"px");

        jQuery("#map-box").css("left", (a1+70)+"px");
        jQuery("#map-box").css("left", (a1+70)+"px");
    });
    // Принудительно запускаем ресайз при готовности страницы
    jQuery(window).resize()

    // Обрабатываем собитие нажатиян на кнопу пойска первой вкладки
    jQuery("#search-btn-1").click(Sort_data);
    

    // Загружаем с сервера инфу для сортировки
    readTextFile("own_data.json", function(text){
        let items = JSON.parse(text);

        jQuery("#objtyte_1").append('<option value="Все">Все</option>');
        jQuery("#objtyte_2").append('<option value="Все">Все</option>');
        for (let i in items[2]){
            jQuery("#objtyte_1").append('<option value="'+items[2][i]+'">'+items[2][i]+'</option>');
            jQuery("#objtyte_2").append('<option value="'+items[2][i]+'">'+items[2][i]+'</option>');
        };
        jQuery("#objtyte_1").val("Все").selectmenu("refresh");
        jQuery("#objtyte_2").val("Все").selectmenu("refresh");

        jQuery("#rup_1").append('<option value="Все">Все</option>');
        jQuery("#branch_1").append('<option value="Все">Все</option>');

        jQuery("#rup_2").append('<option value="Все">Все</option>');
        jQuery("#branch_2").append('<option value="Все">Все</option>');
        for (let i in items[0]){
            if (i=="Неизвестно") continue;
            jQuery("#rup_1").append('<option value="'+i+'">'+i+'</option>');
            jQuery("#rup_2").append('<option value="'+i+'">'+i+'</option>');
            for (let j in items[0][i]){
                if (items[0][i][j]=="Неизвестно") continue;
                jQuery("#branch_1").append('<option value="'+items[0][i][j]+'">'+items[0][i][j]+'</option>');
                jQuery("#branch_2").append('<option value="'+items[0][i][j]+'">'+items[0][i][j]+'</option>');
            };
        };
        jQuery("#rup_1").val("Все").selectmenu("refresh");
        jQuery("#branch_1").val("Все").selectmenu("refresh");

        jQuery("#rup_2").val("Все").selectmenu("refresh");
        jQuery("#branch_2").val("Все").selectmenu("refresh");
    
    });

    // Загружаем координаты ВЛ И ПС
    readTextFile("coordinates.json", function(text){
        coordinates = JSON.parse(text);
        /* name="option1" value="a1" */
        let obj_map;
        let objt;
        let lines;
        let count_vl = 0;
        let count_ps = 0;
        for (let i in coordinates) {
            objt = (coordinates[i].object_type == "ВЛ") ? "VL" : "PS";
            jQuery( "#layer_1" ).append(
                `<div id="obj_first_tab_${i}" class="EnObj">
                    <input type="checkbox" class="check_first_tab" id="check_first_tab_${i}" >
                    <img src="${static_dir}static/icon/${objt}${coordinates[i].voltage_class}.png" width="15" height="15">
                    <span class="ntit first_tab">${coordinates[i].name}</span> <br>
                    <span class="sign">${coordinates[i].object_type} ${coordinates[i].voltage_class} кВ</span>
                </div>`);
            
            objects_dict[i] = {'state':true, 'div':jQuery('#obj_first_tab_'+i)};
            if (coordinates[i].object_type == "ВЛ"){
                lines = [];
                count_vl++
                for (let j in coordinates[i].line) {
                    obj_map = PrintPolyline(coordinates[i].line[j],
                                            colors[coordinates[i].voltage_class],
                                            coordinates[i].name,
                                            `${coordinates[i].object_type} ${coordinates[i].voltage_class} кВ`);
                    lines.push(obj_map);
                };
                map_objects_cord[i]={"state":false,"line":lines,"bounds":coordinates[i].bounds};
            } else {
                count_ps++
                obj_map = PrintPlacemark(coordinates[i].cord,
                                colors[coordinates[i].voltage_class],
                                coordinates[i].name,
                                `${coordinates[i].object_type} ${coordinates[i].voltage_class} кВ`);
                
                map_objects_cord[i]={"state":false,"placemark":obj_map};
                                
            }
            
            
        };
        // Устанавливаем надпись количества обьектов
        jQuery('#counter_1').text(`${count_vl} ВЛ и ${count_ps} ПС`);
        // Событие нажатия чекбокс
        jQuery(".check_first_tab").click(function(){
            let text = jQuery(this).parent().attr("id").substring(14);
            let state = jQuery(`#check_first_tab_${text}`).prop("checked");
            if (coordinates[text].object_type == "ВЛ"){
                if (map_objects_cord[text].state && !state){
                    for (let i in map_objects_cord[text].line){
                        myMap.geoObjects.remove(map_objects_cord[text].line[i]);
                    };
                    map_objects_cord[text].state = false;
                } else if (!map_objects_cord[text].state && state){
                    for (let i in map_objects_cord[text].line){
                        myMap.geoObjects.add(map_objects_cord[text].line[i]);
                    };
                    map_objects_cord[text].state = true;
                };

            } else {
                if (map_objects_cord[text].state && !state){
                    myMap.geoObjects.remove(map_objects_cord[text].placemark);
                    map_objects_cord[text].state = false;
                } else if (!map_objects_cord[text].state && state){
                    myMap.geoObjects.add(map_objects_cord[text].placemark);
                    map_objects_cord[text].state = true;
                };
            };
        });
        
        // Переносимся к ВЛ по клику на её ссылку
        jQuery(".first_tab").click(function(){
            let text = jQuery(this).parent().attr("id").substring(14);
                if (coordinates[text].object_type == "ВЛ"){
                    let slide = ymaps.util.bounds.getCenterAndZoom(map_objects_cord[text].bounds,
                                                        [Number(jQuery("#map").css("width").slice(0,-2)),
                                                        Number(jQuery("#map").css("height").slice(0,-2))],
                                                        ymaps.projection.wgs84Mercator, {
                                                            preciseZoom: false
                                                        });
                    
                    myMap.setZoom(slide.zoom, {smooth: true, centering: false});
                    myMap.panTo(slide.center, {delay: 1500});
                } else {
                    myMap.setZoom(17, {smooth: true, centering: false});
                    myMap.panTo(coordinates[text].cord, {delay: 1500});
                };

        });

        
        // Запускаем загрузку журнала ударом молнии вблизи энергообьектов
        func_date_start = () => moment().subtract(1,'d');
        func_date_end = () => moment();
        get_strike_data(load_real_time_strike_data,func_date_start,func_date_end,"real_time")();
        timer_load_log_strikes = setInterval(get_strike_data(load_real_time_strike_data,
                                                            func_date_start,func_date_end,"real_time"), 60000);
        cord_complete = true;
        jQuery("#search-btn-2").click(btn_search_strikes);
    });
    
    // Событие мас чека
    jQuery("#all_check_1").click(function(){
        state = jQuery("#all_check_1").prop("checked");
        for (let i in map_objects_cord){
            if (!objects_dict[i].state){
                continue;
            } else if (!state && jQuery(`#check_first_tab_${i}`).prop("checked")){
                jQuery(`#check_first_tab_${i}`).click();
            } else if (state && !jQuery(`#check_first_tab_${i}`).prop("checked")){
                jQuery(`#check_first_tab_${i}`).click();
            };
        };
        
    });

    jQuery("#all_check_2").click(all_check_2);  

    // Указание геокординаты положения курсора
    jQuery('#map').mousemove( function (e) {
        let projection = myMap.options.get('projection');
        let cord = projection.fromGlobalPixels(
            myMap.converter.pageToGlobal([e.pageX, e.pageY]), myMap.getZoom());
        jQuery('#map-box').text(`lat: ${cord[0].toFixed(4)}, lon: ${cord[1].toFixed(4)}`);
    });

   
});

// Функция запроса файла с сервера
function readTextFile(file, callback) {
    let rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
};

// Функция формирования запроса по сортировке
function Sort_data(){
    object_type_1 = (jQuery("#objtyte_1").val() == "Все") ? "null" : jQuery("#objtyte_1").val();
    rup_1 = (jQuery("#rup_1").val() == "Все") ? "null" : jQuery("#rup_1").val();
    branch_1 = (jQuery("#branch_1").val() == "Все") ? "null" : jQuery("#branch_1").val();
    Unom_1 = (jQuery("#Unom_1").val() == "") ? "0" : jQuery("#Unom_1").val();
    Name_1 = (jQuery("#search-input-1").val() == "") ? "null" : jQuery("#search-input-1").val();

    readTextFile(`sort=${object_type_1}=${Name_1}=${Unom_1}=${rup_1}=${branch_1}=null=null.json`, sort_objects);
};

// Функция удаления и добаления вкладок в соотвествии с параметрами сортировки
function sort_objects(text){
    let objects = new Set(JSON.parse(text));
    state = jQuery("#all_check_1").prop("checked");
    count_ps = 0;
    count_vl = 0;
    for (i in objects_dict){
        if (objects.has(Number(i))){
            if (coordinates[i].object_type == "ВЛ") count_vl++
            else count_ps++;
            // Устанавливаем надпись количества обьектов
            jQuery('#counter_1').text(`${count_vl} ВЛ и ${count_ps} ПС`);

            if (!objects_dict[i].state){
                objects_dict[i].div.appendTo('#layer_1');
                objects_dict[i].state = true;
            };
            if (state){
                jQuery(`#check_first_tab_${i}`).prop("checked",false);
                jQuery(`#check_first_tab_${i}`).click();
            };
        } else {
            jQuery(`#check_first_tab_${i}`).prop("checked",true);
            jQuery(`#check_first_tab_${i}`).click();
            if (objects_dict[i].state){
                objects_dict[i].div.detach();
                objects_dict[i].state = false;
            };
        };
    };
};

function radio_event(){
    state1 = jQuery("#radio-1").prop("checked");
    state2 = jQuery("#radio-2").prop("checked");
    if (state1 && !state2){
        jQuery("#search-blok-2-botton").hide();
        jQuery("#layer_2").css("height", "45%");

        data = strikes_serch_param.real_time;
        jQuery("#objtyte_2").val(data.object_type).selectmenu("refresh");
        jQuery("#search-input-2").val(data.Name);
        jQuery("#rup_2").val(data.rup).selectmenu("refresh");
        jQuery("#branch_2").val(data.branch).selectmenu("refresh");
        jQuery("#Unom_2").val(data.Unom);
        jQuery("#dist_2").val(data.dist); 
        
        strikes_serch_param.time_period.all_check = jQuery("#all_check_2").prop("checked");
        jQuery("#all_check_2").prop("checked",data.all_check);

        if (cord_complete){
            func_date_start = () => moment().subtract(1,'d');
            func_date_end = () => moment();
            ShowCircle = false;
            get_strike_data(load_real_time_strike_data,func_date_start,
                            func_date_end,"real_time")();
            timer_load_log_strikes = setInterval(get_strike_data(load_real_time_strike_data,
                                                func_date_start,func_date_end,"real_time"), 60000);
        };

        // Очищаем поле перед заполнением
        radio_2_content_check('off');
        jQuery("#layer_2").empty();

        
    } else if (!state1 && state2){
        jQuery("#layer_2").css("height", "31%");
        jQuery("#search-blok-2-botton").show();

        data = strikes_serch_param.time_period;
        jQuery("#objtyte_2").val(data.object_type).selectmenu("refresh");
        jQuery("#search-input-2").val(data.Name);
        jQuery("#rup_2").val(data.rup).selectmenu("refresh");
        jQuery("#branch_2").val(data.branch).selectmenu("refresh");
        jQuery("#Unom_2").val(data.Unom);
        jQuery("#dist_2").val(data.dist); 

        strikes_serch_param.real_time.all_check = jQuery("#all_check_2").prop("checked");
        jQuery("#all_check_2").prop("checked",data.all_check);

        if (cord_complete) clearInterval(timer_load_log_strikes);

        radio_1_content_check("off")
        set_content_radio2();

        // Задаём обработчик событий чекбоксов записей
        check_time_period_event();
        // Задаём обработчик событий нажатия на ссылки
        link_time_period_event();
        // Включаем отключённые чекбоксы
        radio_2_content_check('on');
  
    };

};

function btn_search_strikes(){
    state1 = jQuery("#radio-1").prop("checked");
    state2 = jQuery("#radio-2").prop("checked");
    if (state1 && !state2){
        data = strikes_serch_param.real_time;
        data.object_type = jQuery("#objtyte_2").val();
        data.Name = jQuery("#search-input-2").val();
        data.rup = jQuery("#rup_2").val();
        data.branch = jQuery("#branch_2").val();
        data.Unom = jQuery("#Unom_2").val();
        data.dist = jQuery("#dist_2").val();

        // При поиске в реалтайме отменяем цикл вызовов, вызываем его заново, и сново задаём цикл
        clearInterval(timer_load_log_strikes);

        func_date_start = () => moment().subtract(1,'d');
        func_date_end = () => moment();
        ShowCircle = false;
        get_strike_data(load_real_time_strike_data,func_date_start,func_date_end,"real_time")();
        timer_load_log_strikes = setInterval(get_strike_data(load_real_time_strike_data,
                                                            func_date_start,func_date_end,"real_time"), 60000);

    } else if (!state1 && state2){
        data = strikes_serch_param.time_period;
        data.object_type = jQuery("#objtyte_2").val();
        data.Name = jQuery("#search-input-2").val();
        data.rup = jQuery("#rup_2").val();
        data.branch = jQuery("#branch_2").val();
        data.Unom = jQuery("#Unom_2").val();
        data.dist = jQuery("#dist_2").val(); 

        
        // Читаем заданные даты, и проверяем их на валидность формату
        date_end = moment(jQuery("#date_end_2").val(), "YYYY-MM-DD HH:mm");
        if (!date_end.isValid()){
            date_end =  moment();
            jQuery("#date_end_2").val(date_end.format("YYYY-MM-DD HH:mm"))
        };
        
        date_start = moment(jQuery("#date_start_2").val(), "YYYY-MM-DD HH:mm");
        if (!date_start.isValid()){
            date_start = date_end.subtract(1,'d');
            jQuery("#date_start_2").val(date_start.format("YYYY-MM-DD HH:mm"))
        };
        
        func_date_start = () => date_start;
        func_date_end = () => date_end;

        get_strike_data(load_time_period_strike_data,func_date_start,func_date_end,"time_period")();

    };
};

function get_strike_data(func,
                        date_s,
                        date_e,tp){
    
    
    return function (){
        date_start = date_s();
        date_end = date_e();

        if (tp == "real_time"){
            data = strikes_serch_param.real_time;
        } else if (tp == "time_period"){
            data = strikes_serch_param.time_period;
        };
        
        object_type = (data.object_type == "Все") ? "null" : data.object_type;
        rup = (data.rup == "Все") ? "null" : data.rup;
        branch = (data.branch == "Все") ? "null" : data.branch;
        Unom = (data.Unom == "") ? "0" : data.Unom;
        Name = (data.Name == "") ? "null" : data.Name;
        dist = (data.dist == "") ? "0" : data.dist;
        // Лямбда функция в js
        f = (text) => func(text,date_start,date_end);

        readTextFile(`log=${object_type}`+
                            `=${Name}`+
                            `=${Unom}`+
                            `=${rup}`+
                            `=${branch}`+
                            `=null`+
                            `=null`+
                            `=${date_start.format("YYYY-MM-DD HH:mm:ss ZZ")}`+
                            `=${date_end.format("YYYY-MM-DD HH:mm:ss ZZ")}`+
                            `=${dist}.json`, f);
    };
};

function DrawCircleEvents(){
    MakeDrawTimer = function (func) {
        let i = 0;
        return setTimeout(function run() {
            i++;
            func(i);
            if (i<41) setTimeout(run, 130);
            }, 130);
        };

    ReDrawCircle = function(obj){
        return function (i){
            if (i==1) myMap.geoObjects.add(obj)
            else if (i<41) obj.geometry.setRadius(ZoomCircleRadius[myMap.getZoom()]*i)
            else if (i==41) myMap.geoObjects.remove(obj);  
        };
    };
    
    for (obj of CircleObj){
        MakeDrawTimer(ReDrawCircle(obj))
    };
};


function load_real_time_strike_data(text,date_start,date_end){
    CircleObj = [];
    real_time_log_data = JSON.parse(text);

    let log_count = 0;

    order = real_time_log_data[0];
    obj = real_time_log_data[1];
    strikes = real_time_log_data[2];
    
    dt = (date_end - date_start)/7;

    let date_set = {};
    for (let i=1;i<=7;i++){
        date_set["strike"+(8-i)] = moment(date_start + dt*i);
    }

    // Очищаем поле перед заполнением
    jQuery("#layer_2").empty();
    old_obj =  new Set(Object.keys(real_time_content));

    for (let i in order) {
        log_count++;
        j = order[i];

        strike = strikes[obj[j].strike]
        date_obj = moment(strike.date, "YYYY-MM-DD HH:mm:ss ZZ");
        data_str = date_obj.locale("ru").format('Do MMMM YYYY, H:mm:ss');
        for (key in date_set){
            if (date_set[key].isAfter(date_obj) || date_set[key].isSame(date_obj)){
                color = key;
                break;
            } else continue;
        };

        if (!(j in real_time_content)){
            k = obj[j].energy_object
            objt = (coordinates[k].object_type == "ВЛ") ? "VL" : "PS";

            jQuery("#layer_2").append(
                `<div id="obj_real_time_${j}" class="EnObj">
                    <input type="checkbox" class="check_real_time" id="check_real_time_${j}" >
                    <img src="${static_dir}static/icon/${objt}${coordinates[k].voltage_class}.png" width="15" height="15">
                    <span class="ntit link_real_time">${coordinates[k].name}</span> <br>
                    <span class="sign">${coordinates[k].object_type} ${coordinates[k].voltage_class} кВ, 
                    ${obj[j].distance.toFixed(2)} м</span><br>
                    <span class="sign">${data_str}</span><br>
                </div>`);
            
            real_time_content[j] = {"div":jQuery('#obj_real_time_'+j),"strike_id":obj[j].strike,"state":false};
            
            if (!(obj[j].strike in map_objects_real_time)){
                obj_map = StrikePlacemark([strike.lat,strike.lon],data_str,color);
                map_objects_real_time[obj[j].strike]={"placemark":obj_map,
                                                        "color":key,"link":new Set([j])};

                if (ShowCircle){
                    obj_crc = StrikeCircle([strike.lat,strike.lon]);
                    CircleObj.push(obj_crc);
                    //myMap.geoObjects.add(obj_crc);
                    //alert("test")
                };
                
                
            } else {
                if (!(map_objects_real_time[obj[j].strike].link.has(j))){
                    map_objects_real_time[obj[j].strike].link.add(j);
                };
                if (map_objects_real_time[obj[j].strike].color!=color){
                    obj_map = StrikePlacemark([strike.lat,strike.lon],data_str,color);
                    map_objects_real_time[obj[j].strike].color = color;
                    
                    for (let itt of map_objects_real_time[obj[j].strike].link){
                        if (real_time_content[itt].state){
                            myMap.geoObjects.remove(map_objects_real_time[obj[j].strike].placemark);
                            myMap.geoObjects.add(obj_map);
                            break;
                        };
                    };
                    map_objects_real_time[obj[j].strike].placemark = obj_map;
                };
                

            };
        } else {
            //alert("берём из памяти");
            real_time_content[j].div.appendTo("#layer_2");
            old_obj.delete(j);

            if (map_objects_real_time[obj[j].strike].color!=color){
                obj_map = StrikePlacemark([strike.lat,strike.lon],data_str,color);
                map_objects_real_time[obj[j].strike].color = color;
                
                for (let itt of map_objects_real_time[obj[j].strike].link){
                    if (real_time_content[itt].state){
                        myMap.geoObjects.remove(map_objects_real_time[obj[j].strike].placemark);
                        myMap.geoObjects.add(obj_map);
                        break;
                    };
                };
                map_objects_real_time[obj[j].strike].placemark = obj_map;
            }; 
        };
    };
    // Удаляем старые записи из объекта
    for (let item of old_obj) {
        strike_id = real_time_content[item].strike_id;
        delete real_time_content[item];
        map_objects_real_time[strike_id].link.delete(item);
        if (map_objects_real_time[strike_id].link.size == 0){
            myMap.geoObjects.remove(map_objects_real_time[strike_id].placemark);
            delete map_objects_real_time[strike_id];
        };
    };
    //alert("load_data_real_time_end");

    // Задаём обработчик событий чекбоксов записей
    check_real_time_event();

    // Задаём обработчик событий нажатия на ссылки
    link_real_time_event();

    if (jQuery("#all_check_2").prop("checked")){
        jQuery("#all_check_2").prop("checked",false);
        jQuery("#all_check_2").click();
    };

    jQuery('#counter_2').text(`${log_count} ударов`);

    DrawCircleEvents();
    ShowCircle = true;
};

function load_time_period_strike_data(text,date_start,date_end){
    period_log_data = JSON.parse(text);
    let log_count = 0;
    //alert("load_data_time_period_completed");
    //alert(date_end);
    order = period_log_data[0];
    obj = period_log_data[1];
    strikes = period_log_data[2];
    
    dt = (date_end - date_start)/7;

    let date_set = {};
    for (let i=1;i<=7;i++){
        date_set["strike"+(8-i)] = moment(date_start + dt*i);
    }

    // Очищаем поле перед заполнением
    jQuery("#layer_2").empty();
    old_obj =  new Set(Object.keys(time_period_content));

    for (let i in order) {
        log_count++;
        j = order[i];

        strike = strikes[obj[j].strike]
        date_obj = moment(strike.date, "YYYY-MM-DD HH:mm:ss ZZ");
        data_str = date_obj.locale("ru").format('Do MMMM YYYY, H:mm:ss');
        //alert(data_str);
        for (key in date_set){
            //alert(date_set[key].locale("ru").format('Do MMMM YYYY, H:mm:ss'))
            if (date_set[key].isAfter(date_obj) || date_set[key].isSame(date_obj)){
                color = key;
                break;
            } else continue;
        };

        //alert(color);

        if (!(j in time_period_content)){
            //alert("создаём")
            k = obj[j].energy_object
            objt = (coordinates[k].object_type == "ВЛ") ? "VL" : "PS";
            

            jQuery("#layer_2").append(
                `<div id="obj_time_period_${j}" class="EnObj">
                    <input type="checkbox" class="check_time_period" id="check_time_period_${j}" >
                    <img src="${static_dir}static/icon/${objt}${coordinates[k].voltage_class}.png" width="15" height="15">
                    <span class="ntit link_time_period">${coordinates[k].name}</span> <br>
                    <span class="sign">${coordinates[k].object_type} ${coordinates[k].voltage_class} кВ, 
                    ${obj[j].distance.toFixed(2)} м</span><br>
                    <span class="sign">${data_str}</span><br>
                </div>`);
            
            time_period_content[j] = {"div":jQuery('#obj_time_period_'+j),"strike_id":obj[j].strike,"state":false};
            
            if (!(obj[j].strike in map_objects_time_period)){
                obj_map = StrikePlacemark([strike.lat,strike.lon],data_str,color);
                map_objects_time_period[obj[j].strike]={"placemark":obj_map,
                                                        "color":key,"link":new Set([j])};
                
                
            } else {
                if (!(map_objects_time_period[obj[j].strike].link.has(j))){
                    map_objects_time_period[obj[j].strike].link.add(j);
                };
                
                if (map_objects_time_period[obj[j].strike].color!=color){
                    obj_map = StrikePlacemark([strike.lat,strike.lon],data_str,color);
                    map_objects_time_period[obj[j].strike].color = color;
                    
                    for (let itt of map_objects_time_period[obj[j].strike].link){
                        if (time_period_content[itt].state){
                            myMap.geoObjects.remove(map_objects_time_period[obj[j].strike].placemark);
                            myMap.geoObjects.add(obj_map);
                            break;
                        };
                    };
                    map_objects_time_period[obj[j].strike].placemark = obj_map;
                };
                

            };
        } else {
            //alert("берём из памяти");
            time_period_content[j].div.appendTo("#layer_2");
            old_obj.delete(j);

            if (map_objects_time_period[obj[j].strike].color!=color){
                obj_map = StrikePlacemark([strike.lat,strike.lon],data_str,color);
                map_objects_time_period[obj[j].strike].color = color;

                for (let itt of map_objects_time_period[obj[j].strike].link){
                    if (time_period_content[itt].state){
                        myMap.geoObjects.remove(map_objects_time_period[obj[j].strike].placemark);
                        myMap.geoObjects.add(obj_map);
                        break;
                    };
                };
                map_objects_time_period[obj[j].strike].placemark = obj_map;
            }; 
        };
    };
    // Удаляем старые записи из объекта
    for (let item of old_obj) {
        strike_id = time_period_content[item].strike_id;
        delete time_period_content[item];
        map_objects_time_period[strike_id].link.delete(item);
        if (map_objects_time_period[strike_id].link.size == 0){
            myMap.geoObjects.remove(map_objects_time_period[strike_id].placemark);
            delete map_objects_time_period[strike_id];
        };
    };

    // Задаём обработчик событий чекбоксов записей
    check_time_period_event();

    // Задаём обработчик событий нажатия на ссылки
    link_time_period_event();

    if (jQuery("#all_check_2").prop("checked")){
        jQuery("#all_check_2").prop("checked",false);
        jQuery("#all_check_2").click();
    };
    jQuery('#counter_2').text(`${log_count} ударов`);
};

function set_content_radio2(){
    // Очищаем поле перед заполнением
    let log_count = 0;
    jQuery("#layer_2").empty();

    order = period_log_data[0];
    obj = period_log_data[1];

    for (let i of order) {
        log_count++;
        time_period_content[i].div.appendTo("#layer_2");
    };
    jQuery('#counter_2').text(`${log_count} ударов`);
};


function check_real_time_event(){
    jQuery(".check_real_time").click(function(){
        let text = jQuery(this).parent().attr("id").substring(14);
        let state = jQuery(`#check_real_time_${text}`).prop("checked");

        strike_id = real_time_content[text].strike_id;

        if (state) {
            for (let item of map_objects_real_time[strike_id].link){
                state_check = jQuery(`#check_real_time_${item}`).prop("checked");
                if (state_check && item != text) return;
            };
            myMap.geoObjects.add(map_objects_real_time[strike_id].placemark);
            real_time_content[text].state = true;
        } else {
            for (let item of map_objects_real_time[strike_id].link){
                state_check = jQuery(`#check_real_time_${item}`).prop("checked");
                if (state_check && item != text) return;
            };
            myMap.geoObjects.remove(map_objects_real_time[strike_id].placemark);
            real_time_content[text].state = false;
        };
    });
};


function check_time_period_event(){
    jQuery(".check_time_period").click(function(){
        let text = jQuery(this).parent().attr("id").substring(16);
        let state = jQuery(`#check_time_period_${text}`).prop("checked");

        strike_id = time_period_content[text].strike_id;

        if (state) {
            for (let item of map_objects_time_period[strike_id].link){
                state_check = jQuery(`#check_time_period_${item}`).prop("checked");
                if (state_check && item != text) return;
            };
            myMap.geoObjects.add(map_objects_time_period[strike_id].placemark);
            time_period_content[text].state = true;
        } else {
            for (let item of map_objects_time_period[strike_id].link){
                state_check = jQuery(`#check_time_period_${item}`).prop("checked");
                if (state_check && item != text) return;
            };
            myMap.geoObjects.remove(map_objects_time_period[strike_id].placemark);
            time_period_content[text].state = false;
        };
    });
};

function link_real_time_event(){
    jQuery(".link_real_time").click(function(){
        let text = jQuery(this).parent().attr("id").substring(14);
        let energy_object_id = real_time_log_data[1][text].energy_object;
        let strike_id = real_time_log_data[1][text].strike;

        if (!jQuery(`#check_first_tab_${energy_object_id}`).prop("checked")){
                jQuery(`#check_first_tab_${energy_object_id}`).click();
        };

        myMap.setZoom(17, {smooth: true, centering: false});
        myMap.panTo([real_time_log_data[2][strike_id].lat,real_time_log_data[2][strike_id].lon], {delay: 1500});

        //let state = jQuery(`#check_time_period_${text}`).prop("checked");
    });
};

function link_time_period_event(){
    jQuery(".link_time_period").click(function(){
        let text = jQuery(this).parent().attr("id").substring(16);
        let energy_object_id = period_log_data[1][text].energy_object;
        let strike_id = period_log_data[1][text].strike;

        if (!jQuery(`#check_first_tab_${energy_object_id}`).prop("checked")){
                jQuery(`#check_first_tab_${energy_object_id}`).click();
        };

        myMap.setZoom(17, {smooth: true, centering: false});
        myMap.panTo([period_log_data[2][strike_id].lat,period_log_data[2][strike_id].lon], {delay: 1500});

        //let state = jQuery(`#check_time_period_${text}`).prop("checked");
    });
};

function all_check_2(){
    
    state1 = jQuery("#radio-1").prop("checked");
    state2 = jQuery("#radio-2").prop("checked");
    state_all_check = jQuery("#all_check_2").prop("checked");
    
    if (state1 && !state2){
        for (let item of real_time_log_data[0]) {
            if (state_all_check && !jQuery(`#check_real_time_${item}`).prop("checked")){
                jQuery(`#check_real_time_${item}`).click();
            } else if (!state_all_check && jQuery(`#check_real_time_${item}`).prop("checked")){
                jQuery(`#check_real_time_${item}`).click();
            };
        };     
    } else if (!state1 && state2){
        for (let item of period_log_data[0]) {
            if (state_all_check && !jQuery(`#check_time_period_${item}`).prop("checked")){
                jQuery(`#check_time_period_${item}`).click();
            } else if (!state_all_check && jQuery(`#check_time_period_${item}`).prop("checked")){
                jQuery(`#check_time_period_${item}`).click();
            };
        };
    };
};

function radio_1_content_check(act){
    if (act == "off"){
        for (let item of real_time_log_data[0]) {
            state = jQuery(`#check_real_time_${item}`).prop("checked");
            if (state){
                jQuery(`#check_real_time_${item}`).click();
                real_time_content[item].state = state;
            };    
        };
    } /* else if (act == "on"){
        for (let item of period_log_data[0]) {
            state = time_period_content[item].state;
            if (state){
                jQuery(`#check_time_period_${item}`).click();
            };
        }; 
    }; */
};

function radio_2_content_check(act){
    if (act == "off"){
        for (let item of period_log_data[0]) {
            state = jQuery(`#check_time_period_${item}`).prop("checked");
            if (state){
                jQuery(`#check_time_period_${item}`).click();
                time_period_content[item].state = state;
            };    
        };
    } else if (act == "on"){
        for (let item of period_log_data[0]) {
            state = time_period_content[item].state;
            if (state){
                jQuery(`#check_time_period_${item}`).click();
            };
        }; 
    };
};