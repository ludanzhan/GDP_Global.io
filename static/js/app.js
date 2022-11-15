

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

    let id = 0
    const ids = function () {
    return "line-"+id++
    };

  //console.log("year",data.year)
   console.log("Column headers without date", data.columns.slice(1));
// returns the sliced dataset
   console.log("Slices",slices);
    // Add X axis --> it is a date format

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

    //----------------------------LINES-----------------------------//
    const color = d3.scaleOrdinal()
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628'])

    const lines = Linesvg.selectAll("lines")
    .data(slices)
    .enter()
    .append("g");

    lines.append("text")
    .attr("class","serie_label")
    .datum(function(d) {
        return {
            id: d.id,
            value: d.values[d.values.length - 1]}; })
    .attr("transform", function(d) {
            return "translate(" + (xScale(d.value.date) + 10)  
            + "," + (yScale(d.value.measurement) + 5 ) + ")";})
    .attr("x", 5)
    .text(function(d) { return  + d.id; });

    lines.append("path")
    .attr("class", ids)
    .attr("fill", "none")
    .attr("stroke",function(d){ return color(d[0]) })
    .attr("d", function(d) { return line(d.values); });

   /* const x = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.year; }))
      .range([ 0, x_width ]);
      Linesvg.append("g")
      .attr("transform", `translate(0, ${y_height})`)
      .call(d3.axisBottom(x).ticks(5));

    
    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d){ return d.EastAsia}
      )])
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
        )*/
})
