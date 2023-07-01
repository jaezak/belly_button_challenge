
d3.json("samples.json").then(data => {
    console.log(data)
    names = data.names

    let dropdown = d3.select("#selDataset");

    for (let i = 0; i < names.length; i++) {
        dropdown
            .append("option")
            .text(names[i])
            .property("value", names[i]);
    };

    buildMetadata(names[0])
    buildCharts(names[0])

});

function optionChanged(id) {
    buildMetadata(id)
}

function buildMetadata(id) {
    d3.json("samples.json").then(data => {
        metadata = data.metadata
        let resultArray = metadata.filter(sampleObj => sampleObj.id == id);
        let result = resultArray[0];
        let box = d3.select("#sample-metadata");

        box.html("")
        Object.entries(result).forEach(([key, value]) => {
            box.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    })
}

function buildCharts(id) {
    d3.json("samples.json").then(data => {
        samples = data.samples
        let resultArray = samples.filter(sampleObj => sampleObj.id == id);
        let result = resultArray[0];


        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        let barData = [
            {
              y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
              x: sample_values.slice(0, 10).reverse(),
              text: otu_labels.slice(0, 10).reverse(),
              type: "bar",
              orientation: "h",
            }
          ];
      
          let barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: { t: 30, l: 150 }
          };
      
          Plotly.newPlot("bar", barData, barLayout);

          let bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: { t: 0 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
            margin: { t: 30 }
          };
      
          let bubbleData = [
            {
              x: otu_ids,
              y: sample_values,
              text: otu_labels,
              mode: "markers",
              marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
              }
            }
          ];
      
          Plotly.newPlot("bubble", bubbleData, bubbleLayout);
        
    })
}
