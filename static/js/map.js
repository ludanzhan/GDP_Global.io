var Mapmargin = {top: 30, right: 10, bottom: 40, left: 70},
    width = 1000 - Mapmargin.left - Mapmargin.right,
    height = 600 - Mapmargin.top - Mapmargin.bottom;
const svg = d3.select("#map")
.append("svg")
.attr("width", width + Mapmargin.left + Mapmargin.right)
.attr("height", height + Mapmargin.top + Mapmargin.bottom)
.attr("transform",
"translate(" + Mapmargin.left + "," + Mapmargin.top + ")");

// Map and projection
const path = d3.geoPath();
const projection = d3.geoMercator()
  .scale(110)
  .center([0,30])
  .translate([width / 2 - Mapmargin.left, height / 2]);
  
//----------------------------Data and color scale-----------------------------//
let data = new Map()
const colorScale = d3.scaleThreshold()
  .domain([50000000, 1000000000, 50000000000, 10000000000, 50000000000, 100000000000,500000000000,10000000000000])
  .range(d3.schemeBlues[9]);

const linear = d3.scaleLinear()
  .domain([50000000, 1000000000, 50000000000, 10000000000, 50000000000, 100000000000,500000000000,10000000000000])
  .range(d3.schemeBlues[9]);


//----------------------------Tooltip-----------------------------//
const Tooltip = d3.select("#map")
    .append("div")
    .style("opacity", 1)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

//----------------------------Load external data and boot--------------------//
Promise.all([
d3.json("Data/world.geojson"),
d3.csv("Data/GDP.csv", function(d) {
    data.set(d.Code, +d['2020'])
})]).then(function(loadData){
    let topo = loadData[0]
    let gdp = loadData[1]

    console.log("Load",loadData[1])
 let mouseOver = function( d) {
    Tooltip.style("opacity", 1)
    d3.select(this)
      .transition()
      .duration(50)
      .style("opacity", 1)
      .style("stroke", "black")
  }

//----------------------------Mouse action------------//
  let mousemove = function(event, d) {
      Tooltip
        .style("opacity", 0.8)
        .html("ID")
        .style("left", (d3.event.pageX) + "px")  
        .style("top", (d3.event.pageY - 28) + "px")
        .style('visibility', 'visible');
  }

  let mouseLeave = function(d) {
    d3.select(this)
      .transition()
      .duration(200)
      .style("stroke", "transparent")
      Tooltip.style("opacity", 0)
  }

  //----------------------------Add Legend--------------------//
  let legend_x = width - 170
  let legend_y = height - 500

  svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(" + legend_x + "," + legend_y+")");

  let labels = ["< 50 M", "50 M - 100 M", "100 M - 500 M","500 M - 1000 M","1000 M - 5000 M","5000 M - 10000 M","10000 M - 50000 M","500000M-1000000M",">1000000M"]
  let legend = d3.legendColor()
    .labels(labels)
    .scale(colorScale)

  svg.select(".legend")
    .call(legend);

   //----------------------------Add Slider--------------------//

  // //----------------------------/Draw the map------------------//
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