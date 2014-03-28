/**
 * Created by hen on 3/8/14.
 */

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

var width = 1060 - margin.left - margin.right;
var height = 800 - margin.bottom - margin.top;
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

var svg = canvas.append("g").attr({
        transform: "translate(" + margin.left + "," + margin.top + ")"
    });

var g = svg.append("g");

 var ng = detailVis.append("g")
      .attr("transform", "translate("+margin.left+","+margin.top+")");

var projection = d3.geo.albersUsa().translate([width / 2, height / 2]);//.precision(.1);
var path = d3.geo.path().projection(projection);
var dataSet = {};
var colors = d3.scale.category20();
var array1 = []
function loadStations() {

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
         .attr("fill", "red")
         .attr("cx", function(d) { return d.x; })
         .attr("cy", function(d) { return d.y; })
         .attr("r", 2)
         .on("mouseover", function(d) { createDetailVis(d.key) })

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


    });
}
var stats;
var stats_array = []
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
    console.log("createDetailVis called for:", cid)

    for (a in stats[cid].hourly){
        console.log("Each Hour:", [a],  stats[cid].hourly[a])
    }
d3.selectAll("#detailVis").select("div").html("Hello, world!");
var data = [4, 8, 15, 16, 23, 42];

var x = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([0, 420]);

console.log("Stats to add to greups" ,data)
var groups = ng.append("g")
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
        //.attr("transform", function(d, i) { return "translate(0, " + yScale(d.State) +")"; })
        
    
      var bars = groups
        .append("rect")
        .attr("width", function(d) { return d; })
        //.attr("x", function(d) { return d; })
        .attr("y", function(d) { return d*2; })
        .attr("height", 10)
        .style("fill", function(d, i) { return "red";})




}


var updateDetailVis = function(data, name){
  
}



// ZOOMING
function zoomToBB() {


}

function resetZoom() {
    
}


