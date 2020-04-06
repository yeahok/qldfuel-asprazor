function create_multi_price_graph(baseUrl, inputClass, fuelType, divId) {
    var idFields = document.getElementsByClassName("inputSiteId");

    let urls = [];

    urls[0] = `${baseUrl}${idFields[0].value}?fueltype=${fuelType}`;
    urls[1] = `${baseUrl}${idFields[1].value}?fueltype=${fuelType}`;
    console.log(urls)
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

//set up buttons to change graph
var generateGraphBtn = document.getElementById("generateGraphBtn");

let apiUrl = generateGraphBtn.dataset.baseapiurl;
console.log(apiUrl);
generateGraphBtn.addEventListener("click",
    create_multi_price_graph.bind(null, apiUrl, "inputSiteId", "Unleaded", "vegagraph1"));


