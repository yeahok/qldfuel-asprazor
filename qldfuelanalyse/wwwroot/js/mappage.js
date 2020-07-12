//set up leaflet map
var sitelat = -27.4698;
var sitelong = 153.0251;
var mymap = L.map('mapid').setView([sitelat, sitelong], 8);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

let siteApiUrl = document.getElementById("siteapi").dataset.basesiteapiurl;

let markerGroup = [];

function AddMarkers(baseUrl, fuelType) {
    url = `${baseUrl}mapdata?fueltype=${fuelType}`
    fetch(url)
        .then(
            response => response.json()
    ).then(function (data) {
        mymap.removeLayer(markerGroup);

        let markers = []; 

        for (let site of data) {
            let price = site.prices[0].amount / 1000;
            var priceIcon = L.divIcon({ className: 'pricemarker', html: `${price}` });
            let detailsUrl = `${window.location.origin}/Sites/Details/${site.Id}`;
            let priceDate = site.prices[0].transactionDateutc;

            let marker = L.marker([site.latitude, site.longitude], { icon: priceIcon })
                .bindPopup(`${site.name}<br/>Price recorded on ${priceDate}<br/><a href=${detailsUrl}>More Details</a>`);
            markers.push(marker);
            
        }
        markerGroup = L.layerGroup(markers);
        markerGroup.addTo(mymap);
    });
}

//initialise
AddMarkers(siteApiUrl, "Premium Unleaded 98");

//set up buttons to change map markers
var btns = document.getElementsByClassName("fuel-type-btn")
for (i = 0; i < btns.length; i++) {
    if (btns[i].dataset.apiurl) {
        let apiUrl = btns[i].dataset.apiurl;
        btns[i].addEventListener("click",
            AddMarkers.bind(null, apiUrl, btns[i].id)
        );
    }
}