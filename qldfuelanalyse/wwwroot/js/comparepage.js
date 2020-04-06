function create_multi_price_graph(baseUrl, siteId1, siteId2, fuelType, divId) {
    let urls = [];
    urls[0] = `${baseUrl}${siteId1}?fueltype=${fuelType}`;
    urls[1] = `${baseUrl}${siteId2}?fueltype=${fuelType}`;
    let graphTitle = `${fuelType} Price vs Time`;

    Promise.all(urls.map(url =>
        fetch(url)))
        .then(function (response) {
            var jsonData = [];
            for (var i = response.length - 1; i >= 0; i--) {
                jsonData.push(response[i].json());
            }
            return Promise.all(jsonData);
        }
    ).then(function (data) {
        //var ok = data.map(function (element) { element['price'] /= 1000; return element })
        var flattenedArray = data[0].concat(data[1]);
        console.log(flattenedArray);
            var vlSpec = {
                $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
                title: graphTitle,
                height: 500,
                width: 'container',
                data: {
                    values: flattenedArray
                },
                mark: {
                    type: 'line',
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
                    },
                    color: {
                        field: 'siteId',
                        type: 'nominal'
                    }
                }
            };
            vegaEmbed("#" + divId, vlSpec);
        });
}

