// created by John Read for UCSB Datascience Bootcamp
// Chart chart size
var svgWidth = 1200;
var svgHeight = 950;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Wrapper, append group, and shift by left and top margins.
var chart = d3
    .select("#scatter")
    .append("div")
    .classed("chart", true);

var svg = chart.append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data
d3.csv("./assets/data/data.csv").then(function(censusData) {

    // Format data
    censusData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.heathcare = +data.healthcare;
    });

    // Create scaling
    var xScale = d3.scaleLinear()
        // .domain([8, d3.max(censusData, d => d.poverty)])
        .domain([d3.min(censusData, d => d.poverty) * 0.9,
        d3.max(censusData, d => d.poverty) * 1.1])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(censusData, d => d.heathcare) * 1.1])
        .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xScale)
    var leftAxis = d3.axisLeft(yScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Append circles
    var circlesGroup = chartGroup
      .selectAll("circle")
      .data(censusData)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.poverty))
      .attr("cy", d => yScale(d.healthcare))
      .classed("stateCircle", true)
      .attr("r", 10);
    
    // Add text to circles
    var textGroup = chartGroup
        .selectAll(".stateText")
        .data(censusData)
        .enter()
        .append("text")
        .attr("x", d => xScale(d.poverty))
        .attr("y", d => yScale(d.healthcare))
        .text(function (d) { return d.abbr })
        .classed("stateText", true)
        .attr("dy", 3)
        .attr("font-size", "10px");

    // Add axes labels
    var povertyText = chartGroup
        .append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
        .classed("aText", true)
        .text("Poverty (%)");
    
    var healthcareText = chartGroup
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Lacks Healthcare (%)");   
      
    // Add tool tips
    var toolTip = d3.tip()
        .attr('class', 'd3-tip')
        .html(function (d) { return `State: ${d.state} <br> Poverty: ${d.poverty}% <br> Lacks Healthcare: ${d.healthcare}%`});

    circlesGroup.call(toolTip);

    //add events
    circlesGroup.on("mouseover", toolTip.show).on("mouseout", toolTip.hide);
});
