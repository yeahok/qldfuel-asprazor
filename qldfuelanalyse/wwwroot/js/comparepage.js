//create comparison graph using information from 'inputClass' fields
function create_comparison_graph(baseUrl, inputNameClass, inputIdClass, fuelType, divId) {
    var idFields = document.getElementsByClassName(inputIdClass);
    var nameFields = document.getElementsByClassName(inputNameClass);

    let urls = [];
    let titles = [];

    for (let i = 0; i < idFields.length; i++) {
        urls[i] = `${baseUrl}${idFields[i].value}?fueltype=${fuelType}`;
        titles[i] = nameFields[i].value;
    }

    let graphTitle = `${fuelType} Price vs Time`;
    
    Promise.all(urls.map(url =>
        fetch(url)))
        .then(function (response) {
            return Promise.all(response.map(r => r.json()));
        })
        .then(function (data) {
            //this code adds site names to the returned object
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < data[i].length; j++) {
                    data[i][j].siteName = titles[i];
                }
            }
            let mergedArray = data[0].concat(data[1]);

            generate_vega_graph(graphTitle, mergedArray, divId);
            create_stats_table(data)
     });
}

function validate_input(inputNameClass) {
    let nameFields = document.getElementsByClassName(inputNameClass);

    for (let i = 0; i < nameFields.length; i++) {
        if (nameFields[i].value.length < 1) {
            alert("Missing input for comparison");
            return true;
        }
    }
    return false;
}

function generate_vega_graph(graphTitle, priceData, divId) {
    var vlSpec = {
        $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
        title: graphTitle,
        height: 500,
        width: 'container',
        data: {
            values: priceData.map(function (element) { element['price'] /= 1000; return element })
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
}

function create_stats_table(priceData) {
    //most of this needs to be refactored

    //generate stats
    let stats = [];
    for (let i = 0; i < priceData.length; i++) {
        let prices = priceData[i].map(item => {
            return item["price"]
        })
        let stat = { };
        stat["min"] = Math.min(...prices);
        stat["max"] = Math.max(...prices);
        stat["mean"] = mean(prices);
        stats.push(stat);
    }

    let table = document.getElementById("fuelStatsTable");
    table.innerHTML = "";

    //generate actual table
    let header = table.createTHead();
    let hrow = header.insertRow();     
    let th1 = hrow.insertCell();
    let th2 = hrow.insertCell();
    let th3 = hrow.insertCell();
    let th4 = hrow.insertCell();
    th1.appendChild(document.createTextNode("Site"));
    th2.appendChild(document.createTextNode("Min"));
    th3.appendChild(document.createTextNode("Max"));
    th4.appendChild(document.createTextNode("Mean"));

    for (i = 0; i < stats.length; i++) {
        let row = table.insertRow();
        let td1 = row.insertCell();
        let td2 = row.insertCell();
        let td3 = row.insertCell();
        let td4 = row.insertCell();
        td1.appendChild(document.createTextNode(priceData[i][0].siteName))
        td2.appendChild(document.createTextNode(stats[i]["min"]))
        td3.appendChild(document.createTextNode(stats[i]["max"]))
        td4.appendChild(document.createTextNode(stats[i]["mean"]))
    }
}

function mean(values) {
    let sum = 0;
    for (let i = 0; i < values.length; i++) {
        sum += values[i];
    }
    let average = sum / values.length
        
    return Number.parseFloat(average).toPrecision(4);
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

function setFuelTypeButtons(className) {
    document.getElementById("fuel-type-btn-group").removeAttribute("hidden");

    let fuelTypeFields = document.getElementsByClassName(className);
    let fuelTypeLists = [];
    for (let i = 0; i < fuelTypeFields.length; i++) {
        fuelTypeLists[i] = fuelTypeFields[i].value.split(",");
    }
    //change this later to work for arbitrary length 
    let intersectFuelList = fuelTypeLists[0].filter(value => fuelTypeLists[1].includes(value));
    let btns = document.getElementsByClassName("fuel-type-btn")

    for (let i = 0; i < btns.length; i++) {
        //disable all buttons first
        btns[i].classList.add("disabled");
        for (let j = 0; j < intersectFuelList.length; j++) {
            if (btns[i].id == intersectFuelList[j]) {
                btns[i].classList.remove("disabled");
                break;
            }
        }
    }
}

function generateGraphBtnHandler(baseUrl, inputNameClass, inputIdClass, fuelType, divId, fuelTypeBtnsClass) {
    if (validate_input(inputNameClass)) {
        return;

    setFuelTypeButtons(fuelTypeBtnsClass);
    create_comparison_graph(baseUrl, inputNameClass, inputIdClass, fuelType, divId);    
}

//set up buttons to change graph
var generateGraphBtn = document.getElementById("generateGraphBtn");

//bind button to generate comparison graph
let apiUrl = generateGraphBtn.dataset.baseapiurl;
generateGraphBtn.addEventListener("click",
    generateGraphBtnHandler.bind(null, apiUrl, "inputSiteName", "inputSiteId", "Unleaded", "vegagraph1", "inputFuelTypes")
);


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

//set up buttons to change graphs
var btns = document.getElementsByClassName("fuel-type-btn")
for (i = 0; i < btns.length; i++) {
    if (btns[i].dataset.apiurl) {
        let apiUrl = btns[i].dataset.apiurl;
        btns[i].addEventListener("click",
            create_comparison_graph.bind(null, apiUrl, "inputSiteName", "inputSiteId", btns[i].id, "vegagraph1")
        );
    }
}