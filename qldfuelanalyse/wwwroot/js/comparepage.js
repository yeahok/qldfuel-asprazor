//create comparison graph using information from 'inputClass' fields
function create_multi_price_graph(baseUrl, inputNameClass, inputIdClass, fuelType, divId) {
    var idFields = document.getElementsByClassName("inputSiteId");
    var nameFields = document.getElementsByClassName("inputSiteName");

    let urls = [];

    urls[0] = `${baseUrl}${idFields[0].value}?fueltype=${fuelType}`;
    urls[1] = `${baseUrl}${idFields[1].value}?fueltype=${fuelType}`;

    let titles = [];

    titles[0] = nameFields[0].value;
    titles[1] = nameFields[1].value;

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
        //this code adds site names to the returned object
        for (i = 0; i < mergedArray.length; i++) {
            for (j = 0; j < titles.length; j++) {
                if (mergedArray[i].siteId == idFields[j].value) {
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
                    values: mergedArray.map(function (element) { element['price'] /= 1000; return element })
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

function getFuelTypes(apiUrl, fieldNo, siteId, className) {
    let url = `${apiUrl}${siteId}`;
    let fuelTypeField = document.getElementsByClassName(className)[fieldNo];

    fetch(url)
        .then(
            response => response.json()
        ).then(function (data) {
            fuelTypeField.value = data.queryInfo.fuelTypes;
     })
};

//set up buttons to change graph
var generateGraphBtn = document.getElementById("generateGraphBtn");

//bind button to generate comparison graph
let apiUrl = generateGraphBtn.dataset.baseapiurl;
console.log(apiUrl);
generateGraphBtn.addEventListener("click",
    create_multi_price_graph.bind(null, apiUrl, "inputSiteName", "inputSiteId", "Unleaded", "vegagraph1"));

//create data source for typeahead
let siteApiUrl = document.getElementById("siteapi").dataset.basesiteapiurl;
var sites = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
        url: `${siteApiUrl}?search=%QUERY`,
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
$('.userInputSiteName').typeahead(null, {
    name: 'sites',
    display: 'name',
    source: sites
}).on('typeahead:selected', function (evt, item) {
    let fieldNo = evt.currentTarget.dataset.id;
    let storeIdFields = document.getElementsByClassName("inputSiteId");
    let storeNameFields = document.getElementsByClassName("inputSiteName");
    storeIdFields[fieldNo].value = item.id;
    storeNameFields[fieldNo].value = item.name;

    getFuelTypes(siteApiUrl,fieldNo, item.id, "inputFuelTypes");
});
