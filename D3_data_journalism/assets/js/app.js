var svgWidth = 960;
var svgHeight = 500;
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
// Import Data
d3.csv("assets/data/data.csv")
  .then(function(newsdata) {
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    newsdata.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      //console.log(data.poverty);
    });
    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8.5, d3.max(newsdata, d => d.poverty*1.2)])
      .range([0, width]);
    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(newsdata, d => d.healthcare*1.2)])
      .range([height, 0]);
    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
    chartGroup.append("g")
      .call(leftAxis);
    // Step 5: Create Circles (two parts: 1- append the circles based on the data 2- append the text inside the circles)
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle").data(newsdata).enter();
    circlesGroup.append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("class","stateCircle")
        .attr("opacity", ".5")
        .on("click", function(data) {     
          toolTip.show(data,this);
        });
    circlesGroup.append("text")
    .text(function(d){
      return d.abbr;
    })
      .attr("dx", d => xLinearScale(d.poverty))
      .attr("dy", d => yLinearScale(d.healthcare)+10/2.5)
      .attr("font-size","9")
      .attr("class","stateText")
      .on("mouseover", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });
      chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
    chartGroup.append("g")
      .call(leftAxis);
   // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -20])
    .html(function(d) {
      return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
    });
    
  // Step 7: Create tooltip in the chart
  // ==============================
  chartGroup.call(toolTip);

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare(%)");
    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty(%)");
  });
  ///////////////////////////////////////// The End :) ////////////////////////////////////////////////////////////////////////////////////