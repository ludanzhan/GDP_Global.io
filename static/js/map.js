const width = 900
const height = 600

const svg = d3.select("#map")
.append("svg")
.attr("width", width)
.attr("height", height)

// Map and projection
const path = d3.geoPath();
const projection = d3.geoMercator()
  .scale(110)
  .center([0,20])
  .translate([width/2, height/2]);

  //[50000000, 1000000000, 50000000000, 10000000000, 50000000000, 100000000000,500000000000,10000000000000]
// Data and color scale
const data = new Map();
const colorScale = 
  d3.scaleThreshold()
  .domain([1000000,50000000, 10000000])
  .range(d3.schemeBlues[5])


  const Tooltip = d3.select("#map")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

// Load external data and boot
Promise.all([
d3.json("Data/world.geojson"),
d3.csv("Data/Pop.csv", function(d) {
    data.set(d.code, +d['2021'])
})]).then(function(loadData){
    let topo = loadData[0]

    console.log(loadData[1])

    let mouseOver = function( d) {

    d3.select(this)
      .transition()
      .duration(50)
      .style("opacity", 1)
      .style("stroke", "black")
    
      Tooltip.style("opacity", 1)
  }

  var mousemove = function(d) {
    Tooltip
    .html(d.name)
    .style("left", (d3.mouse(this)[0]+70) + "px")
    .style("top", (d3.mouse(this)[1]) + "px")
  }

  let mouseLeave = function(d) {
    Tooltip
    .style("opacity", 0)
    d3.select(this)
      .transition()
      .duration(200)
      .style("stroke", "transparent")
  }

  // Draw the map
  svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
      // draw each country
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      // set the color of each country
      .attr("fill", function (d) {
        d.total = data.get(d.id) || 0;
        return colorScale(d.total);
      })
      .style("stroke", "transparent")
      .attr("class", function(d){ return "Country" } )
      .style("opacity", .8)
      .on("mouseover", mouseOver)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseLeave )

    
})