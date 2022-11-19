
// append the svg object to the body of the page
const TopGDPsvg = d3.select("#Top10_GDP_per_Capita")
  .append("svg")
    .attr("width", x_width + margin.left + margin.right)
    .attr("height", y_height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Parse the Data
d3.csv("Data/GDP_per_Capita.csv").then( function(data) {
    let topData = data.sort(function(a, b) {
        return d3.descending(+a['2021'], +b['2021']);
    }).slice(0, 10);
    console.log("data",topData[0]['2021'])

  // Add X axis
  const x = d3.scaleLinear()
    .domain([0, topData[0]['2021']])
    .range([ 0, x_width]);
    TopGDPsvg.append("g")
    .attr("transform", `translate(0, ${y_height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-40)")
      .style("text-anchor", "end");

  // Y axis
  const y = d3.scaleBand()
    .range([ 0, y_height ])
    .domain(topData.map(d => d['Country Name']))
    .padding(.1);
    TopGDPsvg.append("g")
    .call(d3.axisLeft(y))

  //Bars
  TopGDPsvg.selectAll("myRect")
    .data(topData)
    .join("rect")
    .attr("x", x(0) )
    .attr("y", d => y(d['Country Name']))
    .attr("width", d => x(d['2021']))
    .attr("height", y.bandwidth())
    .attr("fill", "#5384b7")


    TopGDPsvg.append("text")
    .attr("x", (x_width / 2))             
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style('font-family', 'Georgia') 
    .style("font-weight",'bold') 
    .text(" GDP per Capita");

})