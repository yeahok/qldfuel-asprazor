//create comparison graph using information from 'inputClass' fields
function create_multi_price_graph(baseUrl, inputClass, fuelType, divId) {
    var idFields = document.getElementsByClassName("inputSiteId tt-input");

    let urls = [];

    urls[0] = `${baseUrl}${idFields[0].dataset.siteId}?fueltype=${fuelType}`;
    urls[1] = `${baseUrl}${idFields[1].dataset.siteId}?fueltype=${fuelType}`;

    let titles = [];

    titles[0] = idFields[0].dataset.siteName;
    titles[1] = idFields[1].dataset.siteName;
    console.log(titles);

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
        //this should probably be changed completely
        for (i = 0; i < mergedArray.length; i++) {
            for (j = 0; j < titles.length; j++) {
                if (mergedArray[i].siteId == idFields[j].dataset.siteId) {
                    mergedArray[i].siteName = titles[j];
                }                    
            }
        }

        console.log(mergedArray);
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
                        field: 'siteName',
                        type: 'nominal',
                    }
                }
            };
            vegaEmbed("#" + divId, vlSpec);
        });
}

//set up buttons to change graph
var generateGraphBtn = document.getElementById("generateGraphBtn");

//bind button to generate comparison graph
let apiUrl = generateGraphBtn.dataset.baseapiurl;
console.log(apiUrl);
generateGraphBtn.addEventListener("click",
    create_multi_price_graph.bind(null, apiUrl, "inputSiteId", "Unleaded", "vegagraph1"));

//create data source for typeahead
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

//create typeahead for text fields
$('.inputSiteId').typeahead(null, {
    name: 'sites',
    display: 'name',
    source: sites
}).on('typeahead:selected', function (evt, item) {
    evt.currentTarget.dataset.siteId = item.id;
    evt.currentTarget.dataset.siteName = item.name;
});
