function create_single_price_graph(url, graphTitle, divId) {
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
                    axis: { title: 'Price' },
                    scale: { domain: [1, 2] }
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