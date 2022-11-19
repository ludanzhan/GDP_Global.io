// append the svg object to the body of the page
// set the dimensions and margins of the graph
const worldsvg = d3.select("#GrowthRate")
  .append("svg")
    .attr("width", Chartwidth + margin.left + margin.right)
    .attr("height", Chartheight + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left+14},${margin.top+30})`);

//Read the data
d3.csv("Data/world.csv",
  function(d){
    return { date : (d.year), value : d.World}
  }).then(
  // Now I can use this dataset:
  function(data) {
    const x = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width ]);

    worldsvg.append("g")
      .attr("transform", `translate(0, ${y_height})`)
      //.call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.value; })])
      .range([ height, 0 ]);

    worldsvg.append("g")
      //.call(d3.axisLeft(y));
    // Add the line
    worldsvg.append("path")
      .datum(data)
      .attr("fill", "red")
      .attr("opacity", .51)
      .attr("stroke", "red")
      .attr("stroke-width", 3)
      .attr("stroke-linejoin", "round")
      .attr("d",  d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
      )
})
