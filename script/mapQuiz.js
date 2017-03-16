var hauptstaedte = [];
var items = [];
var active = 0;
var trial = 0;

var map = L.map('map');
var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png').addTo(map);

map.setView({
    lat: 53.040182144806664,
    lng: 9.667968750000002
}, 4);

jQuery.getJSON("../script/hauptstaedte.json", function(data) {
    hauptstaedte = data;
    var min = 0;
    var max = data.length;

    // Select 10 Random Citys
    for (i = 0; i < 10; i++) {
        var x = Math.floor(Math.random() * (max - min)) + min;
        if (items.find(function(y) {
                return y == x;
            })) {
            i--;
        } else {
            items.push(x);
            var marker = L.marker([data[x].koordinaten.x, data[x].koordinaten.y], { title: x }).addTo(map).on('click', onClick);
        }
    }
    $('#activeCity').text(hauptstaedte[items[active]].name);
});

function onClick(e) {
    //Compare of Marker and Searched City
    string = "";
    if (items[active] == e.target.options.title) {
        string += 'Richtig, das ist ' + hauptstaedte[items[active]].name + '.';
        if (active < 9) {
            active++;
            trial++;
            $('#activeCity').text(hauptstaedte[items[active]].name);
            $('#trial').text(trial);
            string += '<br>' + hauptstaedte[items[active - 1]].name + ' ist die Hauptstadt von ' + hauptstaedte[items[active - 1]].land + '.';
            string += '<br> Als nächstes wird ' + hauptstaedte[items[active]].name + ' gesucht.';
            $('#quizResult').text("Richtig");
            $('#trial').text(trial);

        } else {
            active++;
            trial++;
            $('#activeCity').text("Beendet");
            $('#trial').text(trial);
            string += '<br>' + hauptstaedte[items[active - 1]].name + ' ist die Hauptstadt von ' + hauptstaedte[items[active - 1]].land + '.';
            string += '<br> Die 10 Städte wurden mit <b>' + trial + ' </b> Versuchen gefunden.';
            string += '<br> Versuch es doch nochmal durch neuladen der Seite.'; //<-stattdessen einen button der nur die Seite neu lädt
            window.alert('Die 10 Städte wurden mit ' + trial + ' Versuchen gefunden.')
            $('#quizResult').text("Beendet");
        }

    } else {
        trial++;
        string += 'Falsch, das ist nicht ' + hauptstaedte[items[active]].name;
        $('#trial').text(trial);
        $('#quizResult').text("Falsch");
    }
    $('#informativ').html(string);
}