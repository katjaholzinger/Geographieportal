var hauptstaedte = [];

var map = L.map('map');
//var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png').addTo(map);
// load a tile layer
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

}).addTo(map);

map.setView({
    lat: 53.040182144806664,
    lng: 9.667968750000002
}, 4);

jQuery.getJSON("../script/hauptstaedte.json", function(data) {
    hauptstaedte = data;
    // Select 10 Random Citys
    for (i = 0; i < hauptstaedte.length; i++) {
        var marker = L.marker([data[i].koordinaten.x, data[i].koordinaten.y]).addTo(map);
        marker.bindPopup("<b>" + data[i].land + "</b><br>" + data[i].name)
    }

});