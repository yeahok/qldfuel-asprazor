function create_all_price_graph(baseUrl, fuelType, divId) {
    let url = `${baseUrl}?fueltype=${fuelType}`;
    let graphTitle = `${fuelType} Price vs Time (All Sites)`;

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
                    clip: true,
                    tooltip: true
                },
                encoding: {
                    y: {
                        field: 'price',
                        type: 'quantitative',
                        axis: { title: 'Price' },
                        scale: { domain: [1,2] }
                    },
                    x: {
                        field: 'transactionDateutc',
                        type: "temporal",
                        axis: {
                            title: 'Date',
                            format: '%-d %b %y'
                        }
                    }
                }
            };
            vegaEmbed("#" + divId, vlSpec);
        });
}

//set up buttons to change graph
var btns = document.getElementsByClassName("fuel-type-btn")
for (i = 0; i < btns.length; i++) {
    if (btns[i].dataset.apiurl) {
        let apiUrl = btns[i].dataset.apiurl;
        btns[i].addEventListener("click",
            create_all_price_graph.bind(null, apiUrl, btns[i].id, "vegagraph1")
        );
    }
}
