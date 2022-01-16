//---------------------------------------------------------
//GLOBAL VARIABLES
//---------------------------------------------------------
// create filepath of file
const filepath = 'resources/samples.json'

//---------------------------------------------------------
//LOADER FUNCTION THAT LOADS DATA FROM FILE
//---------------------------------------------------------
// fetch call using promises
// fetch(filepath).then(response => response.json())

// fetch call using async function
async function loadFile(path) {
    return (await fetch(path)).json();
};

//---------------------------------------------------------
//SCRAPER/PARSER FUNCTION FOR ANY GIVEN SUBJECT NUMBER
//---------------------------------------------------------
// scraping samples
async function scrapeSamples(subjectNum) {
    // load data from file
    let bigData = await loadFile(filepath);
    // console.log(bigData);

    // filter down to specific bacteria samples of given subject number
    return bigData.samples.filter(item => item.id == subjectNum)[0];
};

// scraping metadata
async function scrapeMeta(subjectNum) {
    // load data from file
    let bigData = await loadFile(filepath);
    // console.log(bigData);

    // filter down to specific bacteria samples of given subject number
    return bigData.metadata.filter(item => item.id == subjectNum)[0];
};

//---------------------------------------------------------
//WEBPAGE POPULATOR/GRAPHER FUNCTION FOR ANY GIVEN SUBJECT NUMBER
//---------------------------------------------------------
function populator(subjectNum) {
    // scrape data and sort it
    let sample = scrapeSamples(subjectNum);
    let sortedSample = sortTopTen(sample);

    //build table
    let metadata = scrapeMeta(subjectNum);
    buildTable(subjectNum);

    // build charts
    buildBar(sortedSample);
    buildBubble(sortedSample);
    // buildGauge(sortedSample);
};

//---------------------------------------------------------
//SORTER FUNCTION TO FIND TOP 10 OTU FROM SAMPLE
//---------------------------------------------------------
// define a helper function called zip to help combine arrays
// function zip(arr1, arr2) {
//     return arr1.map((element, i) => [element, arr2[i]]);
// };

// // function that sorts, using the helper function
// function sortTopTen(sample) {
//     let zippedSample = zip(sample.sample_values, zip(sample.otu_ids, sample.otu_labels));
//     let sortedZippedSample = zippedSample.sort((a,b) => b[0] - a[0]);
//     return sortedZippedSample.slice(0, 10);
// };

// sample is already sorted, just return the slice
function sortTopTen(sample) {
    sample.otu_ids = sample.otu_ids.slice(0, 10)
    sample.otu_labels = sample.otu_labels.slice(0, 10)
    sample.sample_values = sample.sample_values.slice(0, 10)
};

//---------------------------------------------------------
//TABLE CONSTRUCTOR FUNCTION
//---------------------------------------------------------
function buildTable(subjectNum) {
    // reset data in table
    document.querySelector("#sample-metadata").innerHTML = "";
  
    // populating each value
    Object.entries(metadata).forEach(([key, value]) => {
        let tableElement = document.createElement("h4");
        tableElement.textContent = `${key.toUpperCase()}: ${value}`;
        panel.append(tableElement);
    });
};

//---------------------------------------------------------
//BAR CHART CONSTRUCTOR FUNCTION
//---------------------------------------------------------
function buildBar(sortedSample) {
    // define title here for easy editing
    let barTitle = `Top 10 OTUs Found in Subject ${subjectNum}'s Bellybutton`

    // define trace's data
    let trace1 = {
        y: sortedSample.otu_ids,
        x: sortedSample.sample_values,
        text: sortedSample.otu_labels,
        name: `Subject ${subjectNum}`,
        type: "bar",
        orientation: "h",
    };
    let barTraceData = [trace1]

    // define trace's layout
    let barLayout = {
        title: barTitle,
        margin: {
            t: 30,
            b: 30,
            l: 10,
            r: 10
        }
    };

    // graph plot
    Plotly.newPlot("bar", barTraceData, barLayout);
};

//---------------------------------------------------------
//BUBBLE CHART CONSTRUCTOR FUNCTION
//---------------------------------------------------------
function buildBubble(sortedSample) {
    // define title here for easy editing
    let barTitle = `Bacteria Cultures Per Sample in ${subjectNum}'s Bellybutton`

    // define trace's data
    let trace1 = {
        y: sortedSample.otu_ids,
        x: sortedSample.sample_values,
        text: sortedSample.otu_labels,
        name: `Subject ${subjectNum}`,
        mode: 'markers',
        marker: {
            size: sortedSample.sample_values,
            color: sortedSample.otu_ids,
            // colorscale: 'Earth'
        }
        // type: "bubble"
    };
    let bubbleTraceData = [trace1]

    // define trace's layout
    let barLayout = {
        title: barTitle,
        margin: {
            t: 30,
            b: 30,
            l: 10,
            r: 10
        },
        hovermode: "closest",
        xaxis: { title: "OTU ID" }
    };

    // graph plot
    Plotly.newPlot("bubble", bubbleTraceData, bubbleLayout);
};

//---------------------------------------------------------
//GAUGE CHART CONSTRUCTOR FUNCTION
//---------------------------------------------------------
function buildGauge(sortedSample) {
};

//---------------------------------------------------------
//WEBPAGE CONSTRUCTOR FUNCTION FOR CREATING GRAPH ELEMENTS
//---------------------------------------------------------
function constructor() {
    // initialize default graphs
    populator('940')
    // add functionality to each item in dropdown menu
    document.querySelector("#selDataset").addEventListener("change", event => {
        populator(event.target.value);
        // buildMetadata(event.target.value);
    });

    // populate dropdown menu
    bigData.names.forEach(item => {
        let option = document.createElement("option");
        option.textContent = item;
        document.querySelector("#selDataset").append(option);
    });
    // initialize default menu option
    document.querySelector("#selDataset").value = '940';
};

//---------------------------------------------------------
//AND FINALLY, RUNNING ALL THE FUNCTIONS
//---------------------------------------------------------
constructor();