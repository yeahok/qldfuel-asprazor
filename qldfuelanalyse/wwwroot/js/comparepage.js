function create_multi_price_graph(baseUrl, inputClass, fuelType, divId) {
    var idFields = document.getElementsByClassName("inputSiteId tt-input");

    let urls = [];

    urls[0] = `${baseUrl}${idFields[0].dataset.siteId}?fueltype=${fuelType}`;
    urls[1] = `${baseUrl}${idFields[1].dataset.siteId}?fueltype=${fuelType}`;
 
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
        var mergedArray = data[0].concat(data[1]);
            var vlSpec = {
                $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
                title: graphTitle,
                height: 500,
                width: 'container',
                data: {
                    values: mergedArray
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

var sites = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
        url: 'https://localhost:44338/api/sites?search=%QUERY',
        wildcard: '%QUERY',
        transform: function (response) {
            return $.map(response.sites, function (site) {
                return {
                    name: site.siteName,
                    id: site.siteId
                }
            });
        }
    }
});

$('.inputSiteId').typeahead(null, {
    name: 'sites',
    display: 'name',
    source: sites
}).on('typeahead:selected', function (evt, item) {
    evt.currentTarget.dataset.siteId = item.id;
});
