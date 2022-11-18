

// append the svg object to the body of the page
const TopPopsvg = d3.select("#Top10_pop")
  .append("svg")
    .attr("width", x_width + margin.left + margin.right)
    .attr("height", y_height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Parse the Data
d3.csv("Data/Pop.csv").then( function(data) {

    let topData = data.sort(function(a, b) {
        return d3.descending(+a['2021'], +b['2021']);
    }).slice(0, 10);
    console.log("data",topData)


  // Add X axis
  const x = d3.scaleLinear()
    .domain([0, 13000])
    .range([ 0, x_width]);
    TopPopsvg.append("g")
    .attr("transform", `translate(0, ${y_height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Y axis
  const y = d3.scaleBand()
    .range([ 0, y_height ])
    .domain(data.map(d => d.Country))
    .padding(.1);
    TopPopsvg.append("g")
    .call(d3.axisLeft(y))

  //Bars
  TopPopsvg.selectAll("myRect")
    .data(data)
    .join("rect")
    .attr("x", x(0) )
    .attr("y", d => y(d.Country))
    .attr("width", d => x(d.Value))
    .attr("height", y.bandwidth())
    .attr("fill", "#69b3a2")

})