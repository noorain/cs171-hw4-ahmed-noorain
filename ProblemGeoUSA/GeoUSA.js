/**
 * Created by hen on 3/8/14.
 */

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 70
};
 var padding = margin

var width = 1060 - margin.left - margin.right;
var height = 800 - margin.bottom - margin.top;
var h = height
var centered;
var bbVis = {
    x: 100,
    y: 10,
    w: width - 100,
    h: 300
};


var detailVis = d3.select("#detailVis").append("svg").attr({
    width:350,
    height:200
})

var canvas = d3.select("#vis").append("svg").attr({
    width: width + margin.left + margin.right,
    height: height + margin.top + margin.bottom
    })
 .call(d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoom))

var svg = canvas.append("g").attr({
        transform: "translate(" + margin.left + "," + margin.top + ")"
    });

function zoom() {
  svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

var g = svg.append("g");

var ng = detailVis.append("g")
      .attr("transform", "translate("+margin.left+","+margin.top+")");

var projection = d3.geo.albersUsa().translate([width / 2, height / 2]);//.precision(.1);
var path = d3.geo.path().projection(projection);
var dataSet = {};
var colors = d3.scale.category20();
var array1 = []
var rs = d3.scale.linear().range([0, 10]);
var stats;
var stats_array = []

function loadStations() {
  var i = 0; 
  for (a in stats){
    if ( i == 0){
    min = stats[a].sum ;
    max = stats[a].sum ;
    i++;
  }
  if(stats[a].sum < min )
    min  = stats[a].sum
  if(stats[a].sum > max)
    max = stats[a].sum
  }
  rs.domain([min,max])
  d3.csv("../data/NSRDB_StationsMeta.csv",function(error,data){
    data.forEach(function(d,i) {
      var sname  = d["USAF"]
      var latitude = d["NSRDB_LAT(dd)"]
      var longitude = d["NSRDB_LON(dd)"];
      var id = d["USAF"]
      if(longitude != null)
      if(latitude != null){
        var screencoord = projection([longitude, latitude]);
        var info = { i:i, x:screencoord[0], y: screencoord[1], r:Math.random()*30, name: sname , key: id } 
        array1.push(info)
      }
    });
    g.selectAll("circle")
         .data(array1)
         .enter().append("svg:circle")
         .attr("stroke", "green")
         .attr("fill", function(d) { 
          if(stats[d.key]) 
          { return "green" }
          else
            return "red"
            } )
         .attr("cx", function(d) { return d.x; })
         .attr("cy", function(d) { return d.y; })
         .attr("r", function(d) { 
          if(stats[d.key]) 
          { return rs(stats[d.key].sum) }
          else
            return 2
            })
         .on("mouseover", function(d) { createDetailVis(d.key) })
         .on("mouseout", function(d) { d3.selectAll("#mbars").select("svg")
       .remove();})

      $('svg circle').tipsy({ 
        gravity: 'w', 
        html: true, 
        title: function() {
          var d = this.__data__, c = colors(d.i);
          //console.log("Looking for:", d.key)
          //console.log("Stats Array:", stats)
          //console.log("stats[d.key]", stats[d.key])
          if(stats[d.key])

          return 'Station USAF: <span style="color:' + c + '">' + d.name + ' ' + stats[d.key].sum +  '</span>'; 
        else
        return 'Station USAF: <span style="color:' + c + '">' + d.name +  '</span>'; 
        }
      });

      //console.log("Stats in loadStations:", stats[690150][0].sum)
//createDetailVis(722515)

    });
}

function loadStats() {
    d3.json("../data/reducedMonthStationHour2003_2004.json", function(error,data){
        completeDataSet= data;
        stats = data
        console.log("Complete reduced data", completeDataSet)
		//....
		
        loadStations();
    })

}


d3.json("../data/us-named.json", function(error, data) {
    var usMap = topojson.feature(data,data.objects.states).features
    g.append("g")
      .attr("id", "states")
      .selectAll("path")
      .data(usMap)
      .enter().append("path")
      .attr("d", path)
      .on("click", clicked);
    loadStats();
});


function clicked(d) {
   console.log("d in clicked" ,d )
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}


// ALL THESE FUNCTIONS are just a RECOMMENDATION !!!!
var createDetailVis = function(cid){
  if(stats[cid].sum > 0){
    console.log("createDetailVis called for:", cid)
var like_bar = []
    for (a in stats[cid].hourly){
        var b  = {"date": +a, "value" : stats[cid].hourly[a]}
        console.log("Each Hour:", [a],  stats[cid].hourly[a])
        like_bar.push(b)
    }
    console.log("like_bar", like_bar)

     sortdatedesc = function (a, b) {
      return d3.ascending(a.date, b.date);
    }

like_bar.sort(sortdatedesc)

d3.selectAll("#detailVis").select("div").html("Hello, world!");

var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
 
var y = d3.scale.linear().range([height, 0]);


 
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(function(d) { return d + ":00" });
 
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(20);

var svg = d3.select("#mbars").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");
 
d3.csv("bar-data.csv", function(error, data) {
 data = like_bar
 console.log("bardata:", data)
 console.log("statsdata:", stats[cid].hourly)
    data.forEach(function(d) {
        d.date = d.date;
        d.value = +d.value;
    });
    
  x.domain(data.map(function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.value; })]);
 
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );
 
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Values");

      svg.append("g")
    .append("text")
          .attr("y", 6)
          .attr("x", 400)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Summed Hourly Value for " +  cid);
 
  svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .style("fill", "green")
      .attr("x", function(d) { return x(d.date); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); });
 
});


}
}




