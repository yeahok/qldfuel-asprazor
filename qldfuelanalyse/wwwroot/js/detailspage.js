function create_single_price_graph(baseUrl, fuelType, siteName, divId, daterange) {
    let url = `${baseUrl}?fueltype=${fuelType}&daterange=${daterange}`;
    let graphTitle = `${fuelType} Price vs Time (${siteName})`;

    fetch(url)
    .then(
        response => response.json()
    ).then(function (data) {
        var vlSpec = {
            $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
            title: graphTitle,
            height: 500,
            width: 'container',
            data: {
                values: data.map(function (element) { element['amount'] /= 1000; return element })
            },
            mark: {
                type: 'line',
                clip: true,
                point: true,
                tooltip: true,
                interpolate: 'step-after'
            },
            encoding: {
                y: {
                    field: 'amount',
                    type: 'quantitative',
                    axis: { title: 'Price' }
                },
                x: {
                    field: 'transactionDate',
                    type: "temporal",
                    axis: { title: 'Date' }
                }
            }
        };
        vegaEmbed("#"+divId, vlSpec);
    });
}

//set up leaflet map
var sitelat = document.getElementById("mapid").dataset.lat;
var sitelong = document.getElementById("mapid").dataset.long;
var mymap = L.map('mapid').setView([sitelat, sitelong], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);
L.marker([sitelat, sitelong]).addTo(mymap)
    .bindPopup(document.getElementById("mapid").dataset.sitename);


//set up buttons to change graph
var btns = document.getElementsByClassName("fuel-type-btn")
for (i = 0; i < btns.length; i++) {
    if (btns[i].dataset.apiurl) {
        let apiUrl = btns[i].dataset.apiurl;
        btns[i].addEventListener("click",
            create_single_price_graph.bind(null, apiUrl, btns[i].id, btns[i].dataset.sitename, "vegagraph1", 31)
        );
    }
}
