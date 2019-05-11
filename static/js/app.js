function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var url = "/metadata/${sample}";
    d3.json(url).then(function(sample) {

    var metadata_sample = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metadata_sample.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample).forEach(function([key, value]) {
      var row = metadata_sample.append("p");
      row.text("${key}: ${value}");
    });
      }
    });
function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = "/samples/${sample}";
  d3.json(url).then(function(data) {


    // @TODO: Build a Bubble Chart using the sample data
  var x_bubble = data.otu.ids;
  var y_bubble = data.sample_values;
  var size_bubble = data.sample_values;
  var value_bubble = data.otu_labels;
  var color_bubble = data.otu_ids;

  var trace1 = {
    x: x_bubble,
    y: y_bubble,
    text: value_bubble,
    mode: "markers",
    marker: {
      color: color_bubble,
      size: size_bubble
    }
  };

  var data = [trace1]

  var layout = {
    xaxis: {title: "Otu Id"},
  };

  //Plotly
  Plotly.newPlot("bubble", data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  d3.json(url).then(function(data) {
    var pie_value = data.sample_values.slice(0, 10);
    var pie_label = data.otu_ids.slice(0, 10);
    var pie_hover = data.otu_labels.slice(0, 10);

    var data = [{
      values: pie_value,
      labels: pie_label,
      hovertext: pie_hover,
      type: "pie"
    }];

  //Plotly
  Plotly.newPlot("pie", data);
    });
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
