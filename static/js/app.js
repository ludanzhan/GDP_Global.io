

// set the dimensions and margins of the graph
const margin = {top: 10, right: 50, bottom: 30, left: 80};
const   x_width = 660 - margin.left - margin.right ;
const   y_height = 400 - margin.top - margin.bottom ;


// append the svg object to the body of the page
const Linesvg = d3.select("#line")
  .append("svg")
    .attr("width", x_width + margin.left + margin.right)
    .attr("height", y_height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

//Read the data
d3.csv("Data/df.csv").then(

  // Now I can use this dataset:
  function(data) {

    // Add X axis --> it is a date format
    const x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.year; }))
      .range([ 0, x_width ]);
      Linesvg.append("g")
      .attr("transform", `translate(0, ${y_height})`)
      .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.EastAsia; })])
      .range([ y_height, 0 ]);
      Linesvg.append("g")
      .call(d3.axisLeft(y));

      Linesvg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(((d.year))) })
        .y(function(d) { return y(d.EastAsia) })
        )
    console.log(data)
})
