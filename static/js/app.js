// // // Json file location
const jsonLocation = "data/samples.json"

// initial page
function init() {
    // var data;
    d3.json(jsonLocation).then(function(data) {
              
        // select dropdown menu 
        var dropdown = d3.select("#selDataset");
        // append dropdown menu
        data.names.forEach(function(name){
            dropdown.append("option").text(name).property("value");
        });
        // call required function
        demoData(data.names[0]);
        topOTUPlot(data.names[0]);
        bublePlot(data.names[0]);
        gaugeChart(data.names[0]);
    });
};

// append Dempgraphic Info
function demoData (id){
   
    d3.json(jsonLocation).then(function(data) {              
        // retrive metadata
        var metaData = data.metadata;
        // filter metadata
        filter_data = metaData.filter(meta => meta.id.toString()==id)[0];
        // select demo info field
        var demoInfoDiv = d3.select("#sample-metadata")
        // empty demographic info
        demoInfoDiv.html("");

        // append demoInfoDiv
        Object.entries(filter_data).forEach(([key, value]) => {
            demoInfoDiv.append("h6").text(key.toUpperCase() + ": " + value + "\n");
        });
    });
};

// horizontal bar chart
function topOTUPlot(id){
    d3.json(jsonLocation).then(function(data) { 
        // console.log(data) ;

        // sample data
        var sampleData = data.samples;
        // console.log(sampleData);

        // filter and sort sample Data
        var filter_sam_data = sampleData.filter(sample => sample.id ==id)[0];
        // filter_sam_data.sort(function(a,b){return a.sample_values-b.sample_values});
        // console.log(filter_sam_data);

        // get top 10 OTUs
        var sampleValues = filter_sam_data.sample_values.slice(0,10).reverse();
        // console.log(sampleValue);

        // // get OTUs + ID
        var sampleID = filter_sam_data.otu_ids.slice(0,10).reverse().map(x => "OTU " + x );
        // console.log(idOTU);

        // otu label
        var labels = filter_sam_data.otu_labels.slice(0,10);

        // create trace
        var trace = {
            x: sampleValues,
            y: sampleID,
            text: labels,
            marker: {color: 'blue'},
            type:"bar",
            orientation: "h",
        };
        // data
        var dataPlot = [trace];

        // create layout
        var layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };      
        // plot 
        Plotly.newPlot("bar", dataPlot, layout);
    });    
};

// buble plot
function bublePlot(id){
    d3.json(jsonLocation).then(function(data) { 
        // console.log(data) ;

        // sample data
        var sampleData = data.samples;
        // console.log(sampleData);

        // filter and sort sample Data
        var filter_sam_data = sampleData.filter(sample => sample.id ==id)[0];
        // console.log(filter_sam_data);

        // create trace
        var trace = {
            x: filter_sam_data.otu_ids,
            y: filter_sam_data.sample_values,
            text : filter_sam_data.otu_labels,
            mode : "markers",
            marker: {
                color: filter_sam_data.otu_ids,
                size: filter_sam_data.sample_values
            },
        };
        // data
        var dataPlot = [trace];

        // create layout
        var layout = {
            xaxis: {title: "OTU ID"},
            height: 600,
            width: 1000
        };      
        // plot 
        Plotly.newPlot("bubble", dataPlot, layout);
    }); 
};

// option change
function optionChanged(){
    // select id data from dropdownMenu
    var dropdownMenu = d3.select("#selDataset");
    // get id from drop down menu
    var idFromOption = dropdownMenu.property("value");
    
    // call required function
    demoData(idFromOption);
    topOTUPlot(idFromOption);
    bublePlot(idFromOption);
    gaugeChart(idFromOption);
};


// Gauge Charts
function gaugeChart(id){
    d3.json(jsonLocation).then(function(data) { 
        // console.log(data) ;

        // metaData
        var metaData = data.metadata;
        // console.log(sampleData);

        // filter and sort sample Data
        var filter_metaData = metaData.filter(sample => sample.id ==id)[0];
        // console.log(filter_sam_data);

        var data = [
            {
              type: "indicator",
              mode: "gauge+number",
            //   mode: "gauge+number+delta",
              value: filter_metaData.wfreq,
              title: { text: "Belly Button Washing Frequency", font: { size: 24 } },
              delta: { reference: 9, increasing: { color: "green" } },
              gauge: {
                axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
                bar: { color: "darkblue" },
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "gray",
                steps: [
                  { range: [0, 1], color: "rgba(240, 230, 215, .5)"},
                  { range: [1, 2], color: "rgba(232, 226, 202, .5)"},
                  { range: [2, 3], color: "rgba(210, 206, 145, .5)"},
                  { range: [3, 4], color: "rgba(202, 209, 95, .5)"},
                  { range: [4, 5], color: "rgba(170, 202, 42, .5)"},
                  { range: [5, 6], color: "rgba(110, 154, 22, .5)"},
                  { range: [6, 7], color: "rgba(14, 127, 0, .5)"},
                  { range: [7, 8], color: "rgba(10, 120, 22, .5)"},
                  { range: [8, 9], color: "rgba(0, 105, 11, .5)"}
                ],
                threshold: {
                    // line: { color: "red", width: 4 },
                    line: { width: 4 },
                    thickness: 0.75,
                    value: 490
                }
              }
            }
          ];
          
          var layout = {
            width: 500,
            height: 400,
            margin: { t: 25, r: 25, l: 25, b: 25 },
            // paper_bgcolor: "lavender",
            font: { color: "darkblue", family: "Arial" }
          };
          
          Plotly.newPlot('gauge', data, layout);
    }); 
};

init();

// On change to the DOM, call getData()
d3.selectAll("#selDataset").on("change", optionChanged);





