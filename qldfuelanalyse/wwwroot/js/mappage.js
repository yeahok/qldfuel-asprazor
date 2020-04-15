//set up leaflet map
var sitelat = -27.4698;
var sitelong = 153.0251;
var mymap = L.map('mapid').setView([sitelat, sitelong], 8);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);