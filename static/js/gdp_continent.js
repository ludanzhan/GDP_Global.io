

// set the dimensions and margins of the graph
const margin = {top: 50, right: 10, left: 80, bottom:20};
const   x_width = 600 - margin.left - margin.right ;
const   y_height = 400 - margin.top ;


// append the svg object to the body of the page
const Linesvg = d3.select("#GDP_line")
  .append("svg")
    .attr("width", x_width + margin.left + margin.right)
    .attr("height", y_height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

//Read the data
d3.csv("Data/GDP_Continent.csv").then(
  // Now I can use this dataset:
  function(data) {
    const slices = data.columns.slice(1).map(function(id) {
      return {
          id: id,
          values: data.map(function(d){
              return {
                  date: d.year,
                  measurement: +d[id]
              };
          })
      };
    });

 /* //console.log("year",data.year)
   console.log("Column headers without date", data.columns.slice(1));
// returns the sliced dataset
   console.log("Slices",slices);
    // Add X axis --> it is a date format
   console.log("Slices",slices[0].id);*/

    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.year; }))
      .range([ 0, x_width ]);


    const yScale = d3.scaleLinear()
      .range([y_height, 0])
      .domain([(0), d3.max(slices, function(c) {
        return d3.max(c.values, function(d) {
            return d.measurement ; });
            })
        ]);

    
    const yaxis = d3.axisLeft(yScale); 
    const xaxis = d3.axisBottom(xScale);

    Linesvg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + y_height + ")")
    .call(xaxis.ticks(5));

    Linesvg.append("g")
    .attr("class", "axis")
    .call(yaxis);

    //----------------------------LINES-----------------------------//
    const line = d3.line()
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.measurement);}); 


    let id = 0;
    const ids = function () {
        return "line-"+id++
    }

    //----------------------------LINES-----------------------------//
  
    
    const lines = Linesvg.selectAll("lines")
    .data(slices)
    .enter()
    .append("g");

    let legend_keys = 
    ['East Asia & Pacific', 'Europe & Central Asia', 
    'Latin America & Caribbean', 'Middle East & North Africa', 
    'North America', 'South Asia', 'Sub-Saharan Africa']

    
    let lineLegend = Linesvg.selectAll(".lineLegend").data(legend_keys)
    .enter().append("g")
    .attr("class","lineLegend")
    .attr("transform", function (d,i) {
            return "translate(" + 5 + "," + (i*20)+")";
        });

    lineLegend.append("text")
      .text(function (d) {return d;})
      .attr("transform", "translate(15, 6)");

    const color = ["#ed3700",'#2b2929','#9c9c9c','#4daf4a','#984ea3','#ff7f00','#067eee']

    lineLegend.append("rect")
      .attr("fill", function (d,i){
        return color[i]
      })
      .attr("width", 12).attr('height', 5);

      Linesvg.append("text")
        .attr("x", (x_width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style('font-family', 'Georgia') 
        .style("font-weight",'bold') 
        .text("GDP Grwoth by Continent");

    /*lines.append("text")
    .attr("class","label")
    .datum(function(d) {
        return {
            id: d.id,
            value: d.values[d.values.length - 1]}; })
    .attr("transform", function(d) {
            return "translate(" + (xScale(d.value.date))  
            + "," + (yScale(d.value.measurement) ) + ")";})
    .attr("x",-20)
    .attr('text-anchor', 'middle')
    .text(function(d) {return ("")+d.id; });*/

    console.log(slices)
    lines.append("path")
      .attr("class", ids)
      .attr("fill", "none")
      .attr("stroke","blue")
      .attr("stroke-width", 1.5)
      .attr("d", function(d) { return line(d.values); });
})




