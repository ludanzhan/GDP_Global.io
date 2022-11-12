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
  .center([0,50])
  .translate([width/2, height/2]);

// Data and color scale
const data = new Map();
const colorScale = d3.scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  .range(d3.schemeBlues[7]);

  const Tooltip = d3.select("#map")
  .append("svg")
  .attr("class", "tooltip")
  .style("opacity", 1)
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px")

// Load external data and boot
Promise.all([
d3.json("Data/world.geojson"),
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv", function(d) {
    data.set(d.code, +d.pop)
})]).then(function(loadData){
    let topo = loadData[0]

    let mouseOver = function(event, d) {
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .5)
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "black")
    
      Tooltip.style("opacity", 1)
  }

  var mousemove = function(event, d) {
    Tooltip
      .html(data.get(d.name) )
      .style("left", (event.x)/2 + "px")
      .style("top", (event.y)/2 - 30 + "px")
  }

  let mouseLeave = function(d) {
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .8)
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