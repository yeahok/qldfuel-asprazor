function create_single_price_graph(baseUrl, fuelType, siteName, divId) {
    let url = `${baseUrl}?fueltype=${fuelType}`;
    let graphTitle = `${fuelType} Price vs Time (${siteName})`;

    fetch(url)
    .then(
        response => response.json()
    ).then(function (data) {
        var vlSpec = {
            $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
            title: graphTitle,
            height: 500,
            width: 'container',
            data: {
                values: data.map(function (element) { element['price'] /= 1000; return element })
            },
            mark: {
                type: 'point',
                clip: 'true'
            },
            encoding: {
                y: {
                    field: 'price',
                    type: 'quantitative',
                    axis: { title: 'Price' }
                },
                x: {
                    field: 'transactionDateutc',
                    type: "temporal",
                    axis: { title: 'Date' }
                }
            }
        };
        vegaEmbed("#"+divId, vlSpec);
    });
}

//set up buttons to change graph
var btns = document.getElementsByClassName("fuel-type-btn")
for (i = 0; i < btns.length; i++) {
    if (btns[i].dataset.apiurl) {
        let apiUrl = btns[i].dataset.apiurl;
        btns[i].addEventListener("click",
            create_single_price_graph.bind(null, apiUrl, btns[i].id, btns[i].dataset.sitename, "vegagraph1")
        );
    }
}
