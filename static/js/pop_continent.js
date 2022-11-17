// append the svg object to the body of the page
const Popsvg = d3.select("#POP_line")
  .append("svg")
    .attr("width", x_width + margin.left + margin.right)
    .attr("height", y_height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

//Read the data
d3.csv("Data/Pop_Continent.csv").then(
  // Now I can use this dataset:
  function(data) {
    const pop = data.columns.slice(1).map(function(id) {
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


    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.year; }))
      .range([ 0, x_width ]);


    const yScale = d3.scaleLinear()
      .range([y_height, 0])
      .domain([(0), d3.max(pop, function(c) {
        return d3.max(c.values, function(d) {
            return d.measurement ; });
            })
        ]);

    
    const yaxis = d3.axisLeft(yScale); 
    const xaxis = d3.axisBottom(xScale);

    Popsvg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + y_height + ")")
    .call(xaxis.ticks(5));

    Popsvg.append("g")
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
  
    const lines = Popsvg.selectAll("lines")
    .data(pop)
    .enter()
    .append("g");

    /*lines.append("text")
    .attr("class","label")
    .datum(function(d) {
        return {
            id: d.id,
            value: d.values[d.values.length - 1]}; })
    .attr("transform", function(d) {
            return "translate(" + (xScale(d.value.date))  
            + "," + (yScale(d.value.measurement) +5) + ")";})
    .attr("x",-20)
    .attr('text-anchor', 'middle')
    .text(function(d) {return ("")+d.id; })*/

    var legend_keys = 
    ['East Asia & Pacific', 'Europe & Central Asia', 
    'Latin America & Caribbean', 'Middle East & North Africa', 
    'North America', 'South Asia', 'Sub-Saharan Africa']

    
    var lineLegend = Popsvg.selectAll(".lineLegend").data(legend_keys)
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

    lines.append("path")
      .attr("class", ids)
      .attr("fill", "none")
      .attr("stroke","blue")
      .attr("stroke-width", 1.5)
      .attr("d", function(d) { return line(d.values); });
})
