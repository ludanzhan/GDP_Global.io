// set the dimensions and margins of the graph
const   Chartwidth = 1200 - margin.left - margin.right ;
const   Chartheight = 500 - margin.top ;

// append the svg object to the body of the page
const Ratesvg = d3.select("#GrowthRate")
  .append("svg")
    .attr("width", Chartwidth + margin.left + margin.right)
    .attr("height", Chartheight + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

//Read the data
d3.csv("Data/continent_Pct_change.csv").then(
  // use the dataset and extract wanted data
  function(data) {
    const rate = data.columns.slice(1).map(function(id) {
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

      //console.log("year",data.year)
   console.log("Column headers without date", data.columns.slice(1));
   // returns the sliced dataset
      console.log("Rate",rate);
       // Add X axis --> it is a date format
      console.log("Rate",rate[0].id);

    // set up the x axis
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.year; }))
      .range([ 0,Chartwidth ]);
    const xaxis = d3.axisBottom(xScale);

    Ratesvg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + Chartheight + ")")
    .call(xaxis.ticks(5));

    // set up the y axis
    const yScale = d3.scaleLinear()
      .range([Chartheight, 0])
      .domain([(0), d3.max(rate, function(c) {
        return d3.max(c.values, function(d) {
            return d.measurement ; });
            })
        ]);
    const yaxis = d3.axisLeft(yScale); 
    Ratesvg.append("g")
    .attr("class", "axis")
    .call(yaxis);

    //----------------------------draw the lines-----------------------------//
    const line = d3.line()
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.measurement);}); 

    // set an id to each line, easy for styling after 
    let id = 0;
    const ids = function () {
        return "Rateline-"+id++
    }

    const lines = Ratesvg.selectAll("lines")
    .data(rate)
    .enter()
    .append("g");

   //----------------------------Legend-----------------------------//
    let legend_keys = 
    ['East Asia & Pacific', 'Europe & Central Asia', 
    'Latin America & Caribbean', 'Middle East & North Africa', 
    'North America', 'South Asia', 'Sub-Saharan Africa']

    let lineLegend = Ratesvg
        .selectAll(".lineLegend")
        .data(legend_keys)
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

    //----------------------------draw the graph-----------------------------//
    lines.append("path")
      .attr("class", ids)
      .attr("fill", "none")
      .attr("stroke","blue")
      .attr("stroke-width", 2)
      .attr("d", function(d) { return line(d.values); });

   //----------------------------title of graph----------------------------//
      Ratesvg.append("text")
      .attr("x", (Chartwidth / 2))             
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")  
      .style("font-size", "16px") 
      .style('font-family', 'Georgia') 
      .style("font-weight",'bold') 
      .text("World GDP Growth Rate vs. Continent GDP Growth Rate");
})
