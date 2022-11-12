const width = 900
const height = 600

// The svg
const svg = d3.select("#map")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

// Map and projection
const projection = d3.geoMercator()
.scale(110)
.center([0,50])                      // This is like the zoom
    .translate([ width/2, height/2 ])
    
const data = new Map();


// Load external data and boot
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then( function(data){

    // Filter data

    // Draw the map
    svg.append("svg")
        .selectAll("path")
        .data(data.features)
        .join("path")
          .attr("fill", "#b8b8b8")
          .attr("d", d3.geoPath()
              .projection(projection)
          )
        .style("stroke", "black")
        .style("opacity", .3)



    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function(event, d) {
      Tooltip.style("opacity", 1)
    }
    var mousemove = function(event, d) {
      Tooltip
        .html(d.name )
        .style("left", (event.x)/2 + "px")
        .style("top", (event.y)/2 - 30 + "px")
    }
    var mouseleave = function(event, d) {
      Tooltip.style("opacity", 0)
    }



})
