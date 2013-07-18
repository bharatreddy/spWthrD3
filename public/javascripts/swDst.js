window.onload = function () {


  //var tdy = new Date();
  //var allDataDtStrt = new Date( new Date(tdy).setDate(tdy.getDate() - 1500) );
  //var allDataDtEnd = new Date( new Date(tdy).setDate(tdy.getDate() - 1000) );
  var allDataDtStrt = new Date("January 1, 2010 00:00:00")//new Date(2000,1,1,0);
  var allDataDtEnd = new Date("December 31, 2012 23:00:00")//new Date(2012,12,31,23);

var margin = {top: 10, right: 10, bottom: 100, left: 40},
    margin2 = {top: 430, right: 10, bottom: 20, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;


var parseDate = d3.time.format("%x %X").parse;


var x = d3.time.scale().range([0, width]),
    x2 = d3.time.scale().range([0, width]),
    y = d3.scale.linear().range([height, 0]),
    y2 = d3.scale.linear().range([height2, 0]);



var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left");


var brush = d3.svg.brush()
    .x(x2)
    .on("brush", brushed);

var area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.dst); });

var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.dst); });


var line2 = d3.svg.line()
	.interpolate("monotone")
    .x(function(d) { return x2(d.date); })
    .y(function(d) { return y2(d.dst); });

var area2 = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x2(d.date); })
    .y0(height2)
    .y1(function(d) { return y2(d.dst); });

d3.select(".swDst").selectAll("svg").remove();
var svg = d3.select(".swDst").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


// Read data from the mongodb database....

var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;

d3.xhr("/dstDb?sdt="+allDataDtStrt+"&edt="+allDataDtEnd
      , "application/json"
      , function(error, xhrRes) {

      if (!error) {
          var data = JSON.parse(xhrRes.response);
      } else {
      	  console.log('here');
          console.log(error);
      }

      var datDst = data.filter( function(d) {
     
            d.date = new Date(d.time);
            d.dst = +d.dst;

            return d
      });


     //  datDst.forEach(function(d) {
     //      d.date = parseDate(d.time);
     //      d.dst = +d.dst;
  	  // });

  x.domain(d3.extent(datDst.map(function(d) { return d.date; })));
  y.domain([d3.min(datDst.map(function(d) { return d.dst; })), d3.max(datDst.map(function(d) { return d.dst; }))]);
  x2.domain(x.domain());
  y2.domain(y.domain());

  focus.append("path")
      .datum(datDst)
      .attr("clip-path", "url(#clip)")
      .attr("d", line);

  focus.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  focus.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  focus.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "-2.71em")
      .style("text-anchor", "end")
      .text("Dst-Index [nT]");

  context.append("path")
      .datum(datDst)
      .attr("d", line2);

  context.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

  context.append("g")
      .attr("class", "x brush")
      .call(brush)
    .selectAll("rect")
      .attr("y", -6)
      .attr("height", height2 + 7);
});

	function brushed() {

	  x.domain(brush.empty() ? x2.domain() : brush.extent());
	  focus.select("path").attr("d", line);
	  focus.select(".x.axis").call(xAxis);
	}

}



