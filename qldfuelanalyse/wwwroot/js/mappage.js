//set up leaflet map
var sitelat = -27.4698;
var sitelong = 153.0251;
var mymap = L.map('mapid').setView([sitelat, sitelong], 8);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

let siteApiUrl = document.getElementById("siteapi").dataset.basesiteapiurl;

function AddMarkers(baseUrl, fuelType) {
    url = `${baseUrl}mapdata?fueltype=${fuelType}`
    fetch(url)
        .then(
            response => response.json()
        ).then(function (data) {
            for (let site of data) {
                let price = site.prices[0].price / 1000;
                var priceIcon = L.divIcon({ html: `<p>${price}</p>` });
                L.marker([site.siteLatitude, site.siteLongitude], { icon: priceIcon }).addTo(mymap)
                    .bindPopup(site.siteName);
            }
        });
}

AddMarkers(siteApiUrl, "e85");