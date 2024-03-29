﻿function create_all_price_graph(baseUrl, fuelType, divId) {
    let url = `${baseUrl}?fueltype=${fuelType}`;
    let graphTitle = `${fuelType} Price vs Time (All Sites)`;

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
                    type: 'point',
                    clip: true,
                    tooltip: true
                },
                encoding: {
                    y: {
                        field: 'amount',
                        type: 'quantitative',
                        axis: {
                            title: 'Price (AUD)',
                            format: '.2f'
                        },
                        scale: { domain: [0,3] }
                    },
                    x: {
                        field: 'transactionDate',
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
